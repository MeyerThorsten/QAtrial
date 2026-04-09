import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const auditrecords = new Hono();

auditrecords.use('*', authMiddleware);

// Upcoming audit schedule (must be before /:id)
auditrecords.get('/schedule', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const now = new Date();
    const items = await prisma.auditRecord.findMany({
      where: {
        projectId,
        status: { in: ['scheduled', 'in_progress'] },
      },
      include: { findings: true },
      orderBy: { scheduledDate: 'asc' },
    });

    const enriched = items.map((audit) => ({
      ...audit,
      overdue: audit.scheduledDate < now && audit.status === 'scheduled',
      findingCounts: {
        total: audit.findings.length,
        open: audit.findings.filter((f) => f.status === 'open').length,
        critical: audit.findings.filter((f) => f.classification === 'critical').length,
        major: audit.findings.filter((f) => f.classification === 'major').length,
      },
    }));

    return c.json({ schedule: enriched });
  } catch (error: any) {
    console.error('Audit schedule error:', error);
    return c.json({ message: 'Failed to get audit schedule' }, 500);
  }
});

// List audits by projectId
auditrecords.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const items = await prisma.auditRecord.findMany({
      where: { projectId },
      include: { findings: true },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ audits: items });
  } catch (error: any) {
    console.error('List audits error:', error);
    return c.json({ message: 'Failed to list audits' }, 500);
  }
});

// Schedule audit
auditrecords.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.title || !body.scheduledDate || !body.leadAuditor) {
      return c.json({ message: 'projectId, title, scheduledDate, and leadAuditor are required' }, 400);
    }

    const project = await findAccessibleProject(body.projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const item = await prisma.auditRecord.create({
      data: {
        projectId: body.projectId,
        type: body.type ?? 'internal',
        title: body.title,
        scheduledDate: new Date(body.scheduledDate),
        status: 'scheduled',
        scope: body.scope ?? '',
        leadAuditor: body.leadAuditor,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'audit_record',
      entityId: item.id,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'audit.scheduled', { audit: item });
    }

    return c.json({ audit: item }, 201);
  } catch (error: any) {
    console.error('Schedule audit error:', error);
    return c.json({ message: 'Failed to schedule audit' }, 500);
  }
});

// Get audit with findings
auditrecords.get('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const item = await prisma.auditRecord.findUnique({
      where: { id },
      include: { findings: { orderBy: { createdAt: 'asc' } } },
    });

    if (!item) {
      return c.json({ message: 'Audit not found' }, 404);
    }
    const project = await findAccessibleProject(item.projectId, user.orgId);
    if (!project) return c.json({ message: 'Audit not found' }, 404);

    return c.json({ audit: item });
  } catch (error: any) {
    console.error('Get audit error:', error);
    return c.json({ message: 'Failed to get audit' }, 500);
  }
});

// Update audit
auditrecords.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.auditRecord.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Audit not found' }, 404);
    }
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Audit not found' }, 404);

    const item = await prisma.auditRecord.update({
      where: { id },
      data: {
        type: body.type ?? existing.type,
        title: body.title ?? existing.title,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : existing.scheduledDate,
        actualDate: body.actualDate ? new Date(body.actualDate) : existing.actualDate,
        status: body.status ?? existing.status,
        scope: body.scope ?? existing.scope,
        leadAuditor: body.leadAuditor ?? existing.leadAuditor,
        reportSummary: body.reportSummary !== undefined ? body.reportSummary : existing.reportSummary,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'audit_record',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
    });

    return c.json({ audit: item });
  } catch (error: any) {
    console.error('Update audit error:', error);
    return c.json({ message: 'Failed to update audit' }, 500);
  }
});

// Delete audit
auditrecords.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.auditRecord.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Audit not found' }, 404);
    }
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Audit not found' }, 404);

    await prisma.auditRecord.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'audit_record',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Audit deleted' });
  } catch (error: any) {
    console.error('Delete audit error:', error);
    return c.json({ message: 'Failed to delete audit' }, 500);
  }
});

// Add finding
auditrecords.post('/:id/findings', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const audit = await prisma.auditRecord.findUnique({ where: { id } });
    if (!audit) {
      return c.json({ message: 'Audit not found' }, 404);
    }
    const project = await findAccessibleProject(audit.projectId, user.orgId);
    if (!project) return c.json({ message: 'Audit not found' }, 404);

    if (!body.classification || !body.area || !body.description) {
      return c.json({ message: 'classification, area, and description are required' }, 400);
    }

    const validClassifications = ['observation', 'minor', 'major', 'critical'];
    if (!validClassifications.includes(body.classification)) {
      return c.json({ message: `classification must be one of: ${validClassifications.join(', ')}` }, 400);
    }

    const finding = await prisma.auditFinding.create({
      data: {
        auditId: id,
        classification: body.classification,
        area: body.area,
        description: body.description,
        responsibleParty: body.responsibleParty ?? null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        capaId: body.capaId ?? null,
        status: 'open',
      },
    });

    await logAudit({
      projectId: audit.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'audit_finding',
      entityId: finding.id,
      newValue: finding,
    });

    if (user.orgId && (body.classification === 'critical' || body.classification === 'major')) {
      dispatchWebhook(user.orgId, 'audit.finding_created', { finding, audit });
    }

    return c.json({ finding }, 201);
  } catch (error: any) {
    console.error('Add finding error:', error);
    return c.json({ message: 'Failed to add finding' }, 500);
  }
});

// Update finding
auditrecords.put('/:id/findings/:findingId', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id, findingId } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.auditFinding.findUnique({ where: { id: findingId } });
    if (!existing || existing.auditId !== id) {
      return c.json({ message: 'Finding not found' }, 404);
    }

    const audit = await prisma.auditRecord.findUnique({ where: { id } });
    if (!audit) return c.json({ message: 'Audit not found' }, 404);
    const project = await findAccessibleProject(audit.projectId, user.orgId);
    if (!project) return c.json({ message: 'Audit not found' }, 404);

    const finding = await prisma.auditFinding.update({
      where: { id: findingId },
      data: {
        classification: body.classification ?? existing.classification,
        area: body.area ?? existing.area,
        description: body.description ?? existing.description,
        responsibleParty: body.responsibleParty !== undefined ? body.responsibleParty : existing.responsibleParty,
        dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
        capaId: body.capaId !== undefined ? body.capaId : existing.capaId,
        status: body.status ?? existing.status,
        response: body.response !== undefined ? body.response : existing.response,
      },
    });

    if (audit) {
      await logAudit({
        projectId: audit.projectId,
        userId: user.userId,
        action: 'update',
        entityType: 'audit_finding',
        entityId: finding.id,
        previousValue: existing,
        newValue: finding,
      });
    }

    return c.json({ finding });
  } catch (error: any) {
    console.error('Update finding error:', error);
    return c.json({ message: 'Failed to update finding' }, 500);
  }
});

// Complete audit with report summary
auditrecords.put('/:id/complete', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.auditRecord.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Audit not found' }, 404);
    }
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Audit not found' }, 404);

    const item = await prisma.auditRecord.update({
      where: { id },
      data: {
        status: 'completed',
        actualDate: new Date(),
        reportSummary: body.reportSummary ?? null,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'status_change',
      entityType: 'audit_record',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'audit.completed', { audit: item });
    }

    return c.json({ audit: item });
  } catch (error: any) {
    console.error('Complete audit error:', error);
    return c.json({ message: 'Failed to complete audit' }, 500);
  }
});

export default auditrecords;
