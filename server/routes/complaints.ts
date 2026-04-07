import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const complaints = new Hono();

complaints.use('*', authMiddleware);

const VALID_TRANSITIONS: Record<string, string[]> = {
  received: ['investigating'],
  investigating: ['resolved'],
  resolved: ['closed'],
};

function isValidTransition(from: string, to: string): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// List complaints by projectId with optional filters
complaints.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const severity = c.req.query('severity');
    const status = c.req.query('status');
    const dateFrom = c.req.query('dateFrom');
    const dateTo = c.req.query('dateTo');

    const where: any = { projectId };
    if (severity) where.severity = severity;
    if (status) where.investigationStatus = status;
    if (dateFrom || dateTo) {
      where.reportDate = {};
      if (dateFrom) where.reportDate.gte = new Date(dateFrom);
      if (dateTo) where.reportDate.lte = new Date(dateTo);
    }

    const items = await prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ complaints: items });
  } catch (error: any) {
    console.error('List complaints error:', error);
    return c.json({ message: 'Failed to list complaints' }, 500);
  }
});

// Complaint trending data
complaints.get('/trending', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const allComplaints = await prisma.complaint.findMany({
      where: { projectId },
      orderBy: { reportDate: 'asc' },
    });

    // Count by month
    const byMonth: Record<string, number> = {};
    for (const comp of allComplaints) {
      const key = comp.reportDate.toISOString().slice(0, 7); // YYYY-MM
      byMonth[key] = (byMonth[key] || 0) + 1;
    }

    // Count by severity
    const bySeverity: Record<string, number> = { minor: 0, major: 0, critical: 0 };
    for (const comp of allComplaints) {
      bySeverity[comp.severity] = (bySeverity[comp.severity] || 0) + 1;
    }

    // Count by product
    const byProduct: Record<string, number> = {};
    for (const comp of allComplaints) {
      byProduct[comp.productName] = (byProduct[comp.productName] || 0) + 1;
    }

    // Mean time to resolution (for resolved/closed complaints)
    const resolvedComplaints = allComplaints.filter(
      (comp) => comp.investigationStatus === 'resolved' || comp.investigationStatus === 'closed'
    );
    let meanTimeToResolution = 0;
    if (resolvedComplaints.length > 0) {
      const totalDays = resolvedComplaints.reduce((sum, comp) => {
        const days = (comp.updatedAt.getTime() - comp.reportDate.getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      meanTimeToResolution = Math.round(totalDays / resolvedComplaints.length);
    }

    // Open vs closed counts
    const openCount = allComplaints.filter(
      (comp) => comp.investigationStatus === 'received' || comp.investigationStatus === 'investigating'
    ).length;
    const closedCount = allComplaints.filter(
      (comp) => comp.investigationStatus === 'resolved' || comp.investigationStatus === 'closed'
    ).length;

    return c.json({
      trending: {
        byMonth: Object.entries(byMonth).map(([month, count]) => ({ month, count })),
        bySeverity,
        byProduct: Object.entries(byProduct).map(([product, count]) => ({ product, count })),
        meanTimeToResolution,
        openCount,
        closedCount,
        total: allComplaints.length,
      },
    });
  } catch (error: any) {
    console.error('Complaint trending error:', error);
    return c.json({ message: 'Failed to get complaint trending data' }, 500);
  }
});

// Get single complaint
complaints.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const item = await prisma.complaint.findUnique({ where: { id } });

    if (!item) {
      return c.json({ message: 'Complaint not found' }, 404);
    }

    return c.json({ complaint: item });
  } catch (error: any) {
    console.error('Get complaint error:', error);
    return c.json({ message: 'Failed to get complaint' }, 500);
  }
});

// Create complaint
complaints.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.productName || !body.description || !body.severity) {
      return c.json({ message: 'projectId, productName, description, and severity are required' }, 400);
    }

    const validSeverities = ['minor', 'major', 'critical'];
    if (!validSeverities.includes(body.severity)) {
      return c.json({ message: `severity must be one of: ${validSeverities.join(', ')}` }, 400);
    }

    const item = await prisma.complaint.create({
      data: {
        projectId: body.projectId,
        productName: body.productName,
        reportDate: body.reportDate ? new Date(body.reportDate) : new Date(),
        severity: body.severity,
        patientImpact: body.patientImpact ?? false,
        description: body.description,
        reporterType: body.reporterType ?? 'customer',
        investigationStatus: 'received',
        regulatoryReportable: body.regulatoryReportable ?? false,
        fscaRequired: body.fscaRequired ?? false,
        createdBy: user.userId,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'complaint',
      entityId: item.id,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'complaint.created', { complaint: item });
    }

    return c.json({ complaint: item }, 201);
  } catch (error: any) {
    console.error('Create complaint error:', error);
    return c.json({ message: 'Failed to create complaint' }, 500);
  }
});

// Update complaint
complaints.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.complaint.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Complaint not found' }, 404);
    }

    // Validate status transition if status is changing
    if (body.investigationStatus && body.investigationStatus !== existing.investigationStatus) {
      if (!isValidTransition(existing.investigationStatus, body.investigationStatus)) {
        return c.json({
          message: `Invalid status transition from '${existing.investigationStatus}' to '${body.investigationStatus}'. Valid next states: ${VALID_TRANSITIONS[existing.investigationStatus]?.join(', ') || 'none'}`,
        }, 400);
      }
    }

    const item = await prisma.complaint.update({
      where: { id },
      data: {
        productName: body.productName ?? existing.productName,
        reportDate: body.reportDate ? new Date(body.reportDate) : existing.reportDate,
        severity: body.severity ?? existing.severity,
        patientImpact: body.patientImpact !== undefined ? body.patientImpact : existing.patientImpact,
        description: body.description ?? existing.description,
        reporterType: body.reporterType ?? existing.reporterType,
        investigationStatus: body.investigationStatus ?? existing.investigationStatus,
        rootCause: body.rootCause !== undefined ? body.rootCause : existing.rootCause,
        capaId: body.capaId !== undefined ? body.capaId : existing.capaId,
        regulatoryReportable: body.regulatoryReportable !== undefined ? body.regulatoryReportable : existing.regulatoryReportable,
        fscaRequired: body.fscaRequired !== undefined ? body.fscaRequired : existing.fscaRequired,
      },
    });

    const action = body.investigationStatus && body.investigationStatus !== existing.investigationStatus
      ? 'status_change'
      : 'update';

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action,
      entityType: 'complaint',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
    });

    if (user.orgId && action === 'status_change') {
      dispatchWebhook(user.orgId, 'complaint.status_changed', { complaint: item, previous: existing });
    }

    return c.json({ complaint: item });
  } catch (error: any) {
    console.error('Update complaint error:', error);
    return c.json({ message: 'Failed to update complaint' }, 500);
  }
});

// Delete complaint
complaints.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.complaint.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Complaint not found' }, 404);
    }

    await prisma.complaint.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'complaint',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Complaint deleted' });
  } catch (error: any) {
    console.error('Delete complaint error:', error);
    return c.json({ message: 'Failed to delete complaint' }, 500);
  }
});

export default complaints;
