import { Hono } from 'hono';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const pms = new Hono();

pms.use('*', authMiddleware);

// List PMS entries
pms.get('/:projectId/entries', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const entryType = c.req.query('entryType');
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const where: any = { projectId };
    if (entryType) where.entryType = entryType;

    const items = await prisma.pMSEntry.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return c.json({ entries: items });
  } catch (error: any) {
    console.error('List PMS entries error:', error);
    return c.json({ message: 'Failed to list PMS entries' }, 500);
  }
});

// PMS summary
pms.get('/:projectId/summary', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const entries = await prisma.pMSEntry.findMany({ where: { projectId } });

    const complaints = await prisma.complaint.findMany({ where: { projectId } });
    const capas = await prisma.cAPA.findMany({ where: { projectId } });

    const byType: Record<string, number> = {};
    for (const entry of entries) {
      byType[entry.entryType] = (byType[entry.entryType] || 0) + 1;
    }

    // Trends by month
    const byMonth: Record<string, number> = {};
    for (const entry of entries) {
      const key = entry.date.toISOString().slice(0, 7);
      byMonth[key] = (byMonth[key] || 0) + 1;
    }

    return c.json({
      summary: {
        totalEntries: entries.length,
        byType,
        complaintCount: complaints.length,
        openComplaints: complaints.filter((c) => c.investigationStatus === 'received' || c.investigationStatus === 'investigating').length,
        capaCount: capas.length,
        openCapas: capas.filter((c) => c.status === 'open').length,
        fieldActions: entries.filter((e) => e.entryType === 'field_action').length,
        byMonth: Object.entries(byMonth).map(([month, count]) => ({ month, count })),
      },
    });
  } catch (error: any) {
    console.error('PMS summary error:', error);
    return c.json({ message: 'Failed to get PMS summary' }, 500);
  }
});

// PSUR data
pms.get('/:projectId/psur-data', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const from = c.req.query('from');
    const to = c.req.query('to');
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const dateFilter: any = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);

    const entriesWhere: any = { projectId };
    if (from || to) entriesWhere.date = dateFilter;

    const complaintsWhere: any = { projectId };
    if (from || to) complaintsWhere.reportDate = dateFilter;

    const [entries, complaints, capas, risks] = await Promise.all([
      prisma.pMSEntry.findMany({ where: entriesWhere, orderBy: { date: 'desc' } }),
      prisma.complaint.findMany({ where: complaintsWhere, orderBy: { reportDate: 'desc' } }),
      prisma.cAPA.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } }),
      prisma.risk.findMany({ where: { projectId } }),
    ]);

    return c.json({
      psurData: {
        period: { from: from || 'all', to: to || 'all' },
        pmsEntries: entries,
        complaints,
        capas,
        risks,
        statistics: {
          totalComplaints: complaints.length,
          bySeverity: {
            minor: complaints.filter((c) => c.severity === 'minor').length,
            major: complaints.filter((c) => c.severity === 'major').length,
            critical: complaints.filter((c) => c.severity === 'critical').length,
          },
          patientImpactCount: complaints.filter((c) => c.patientImpact).length,
          regulatoryReportableCount: complaints.filter((c) => c.regulatoryReportable).length,
          openCapas: capas.filter((c) => c.status === 'open').length,
          highRisks: risks.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical').length,
        },
      },
    });
  } catch (error: any) {
    console.error('PSUR data error:', error);
    return c.json({ message: 'Failed to get PSUR data' }, 500);
  }
});

// Create PMS entry
pms.post('/:projectId/entries', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const body = await c.req.json();
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    if (!body.entryType || !body.title) {
      return c.json({ message: 'entryType and title are required' }, 400);
    }

    const validTypes = ['complaint_summary', 'literature', 'field_action', 'customer_feedback', 'capa_summary'];
    if (!validTypes.includes(body.entryType)) {
      return c.json({ message: `entryType must be one of: ${validTypes.join(', ')}` }, 400);
    }

    const item = await prisma.pMSEntry.create({
      data: {
        projectId,
        entryType: body.entryType,
        title: body.title,
        description: body.description ?? '',
        source: body.source ?? '',
        date: body.date ? new Date(body.date) : new Date(),
        severity: body.severity ?? null,
        actionTaken: body.actionTaken ?? null,
        linkedEntityId: body.linkedEntityId ?? null,
        createdBy: user.userId,
      },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'pms_entry',
      entityId: item.id,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'pms.entry_created', { entry: item });
    }

    return c.json({ entry: item }, 201);
  } catch (error: any) {
    console.error('Create PMS entry error:', error);
    return c.json({ message: 'Failed to create PMS entry' }, 500);
  }
});

export default pms;
