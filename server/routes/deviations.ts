import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const deviations = new Hono();

deviations.use('*', authMiddleware);

const VALID_TRANSITIONS: Record<string, string[]> = {
  detected: ['investigating'],
  investigating: ['root_cause_identified'],
  root_cause_identified: ['capa_created'],
  capa_created: ['closed'],
};

// GET /trending — deviations by classification/area/month, root cause categories
deviations.get('/trending', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) return c.json({ message: 'projectId required' }, 400);
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const all = await prisma.deviation.findMany({ where: { projectId } });

    const byClassification: Record<string, number> = {};
    const byArea: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    const byRootCause: Record<string, number> = {};
    let openCount = 0;
    let closedCount = 0;

    for (const d of all) {
      byClassification[d.classification] = (byClassification[d.classification] || 0) + 1;
      if (d.area) {
        byArea[d.area] = (byArea[d.area] || 0) + 1;
      }
      const month = d.createdAt.toISOString().slice(0, 7);
      byMonth[month] = (byMonth[month] || 0) + 1;
      if (d.rootCause) {
        byRootCause[d.rootCause] = (byRootCause[d.rootCause] || 0) + 1;
      }
      if (d.status === 'closed') closedCount++;
      else openCount++;
    }

    return c.json({
      trending: {
        total: all.length,
        openCount,
        closedCount,
        byClassification: Object.entries(byClassification).map(([classification, count]) => ({ classification, count })),
        byArea: Object.entries(byArea).map(([area, count]) => ({ area, count })),
        byMonth: Object.entries(byMonth).sort().map(([month, count]) => ({ month, count })),
        byRootCause: Object.entries(byRootCause).map(([rootCause, count]) => ({ rootCause, count })),
      },
    });
  } catch (error: any) {
    console.error('Deviation trending error:', error);
    return c.json({ message: 'Failed to get trending data' }, 500);
  }
});

// GET / — list deviations by projectId
deviations.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) return c.json({ message: 'projectId required' }, 400);
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const items = await prisma.deviation.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    return c.json({ deviations: items });
  } catch (error: any) {
    console.error('List deviations error:', error);
    return c.json({ message: 'Failed to list deviations' }, 500);
  }
});

// POST / — create (auto-generate DEV-NNN number)
deviations.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { projectId, title, classification, area, description } = body;

    if (!projectId || !title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const count = await prisma.deviation.count({ where: { projectId } });
    const deviationNumber = `DEV-${String(count + 1).padStart(3, '0')}`;

    const deviation = await prisma.deviation.create({
      data: {
        projectId,
        title,
        deviationNumber,
        classification: classification || 'minor',
        area: area || '',
        description: description || '',
        detectedBy: user.userId,
        status: 'detected',
      },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'deviation_created',
      entityType: 'deviation',
      entityId: deviation.id,
      newValue: { deviationNumber, title, classification: deviation.classification },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'deviation.created', { deviation });
    }

    return c.json({ deviation }, 201);
  } catch (error: any) {
    console.error('Create deviation error:', error);
    return c.json({ message: 'Failed to create deviation' }, 500);
  }
});

// GET /:id — get single
deviations.get('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const deviation = await prisma.deviation.findUnique({ where: { id } });
    if (!deviation) return c.json({ message: 'Deviation not found' }, 404);
    const project = await findAccessibleProject(deviation.projectId, user.orgId);
    if (!project) return c.json({ message: 'Deviation not found' }, 404);
    return c.json({ deviation });
  } catch (error: any) {
    console.error('Get deviation error:', error);
    return c.json({ message: 'Failed to get deviation' }, 500);
  }
});

// PUT /:id — update (with status transition validation)
deviations.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.deviation.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Deviation not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Deviation not found' }, 404);

    if (body.status && body.status !== existing.status) {
      const allowed = VALID_TRANSITIONS[existing.status];
      if (!allowed || !allowed.includes(body.status)) {
        return c.json({ message: `Cannot transition from ${existing.status} to ${body.status}` }, 400);
      }
    }

    const deviation = await prisma.deviation.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        classification: body.classification ?? existing.classification,
        area: body.area ?? existing.area,
        description: body.description ?? existing.description,
        status: body.status ?? existing.status,
        investigationMethod: body.investigationMethod ?? existing.investigationMethod,
        investigationNotes: body.investigationNotes ?? existing.investigationNotes,
        rootCause: body.rootCause ?? existing.rootCause,
        capaId: body.capaId ?? existing.capaId,
        closedBy: body.status === 'closed' ? user.userId : existing.closedBy,
        closedAt: body.status === 'closed' ? new Date() : existing.closedAt,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'deviation_updated',
      entityType: 'deviation',
      entityId: id,
      previousValue: { status: existing.status },
      newValue: { status: deviation.status },
    });

    return c.json({ deviation });
  } catch (error: any) {
    console.error('Update deviation error:', error);
    return c.json({ message: 'Failed to update deviation' }, 500);
  }
});

// DELETE /:id — delete
deviations.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const existing = await prisma.deviation.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Deviation not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Deviation not found' }, 404);
    await prisma.deviation.delete({ where: { id } });
    return c.json({ message: 'Deviation deleted' });
  } catch (error: any) {
    console.error('Delete deviation error:', error);
    return c.json({ message: 'Failed to delete deviation' }, 500);
  }
});

// PUT /:id/investigate — start investigation
deviations.put('/:id/investigate', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.deviation.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Deviation not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Deviation not found' }, 404);

    const deviation = await prisma.deviation.update({
      where: { id },
      data: {
        investigationMethod: body.method || 'other',
        investigationNotes: body.notes || '',
        status: existing.status === 'detected' ? 'investigating' : existing.status,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'deviation_investigation_started',
      entityType: 'deviation',
      entityId: id,
      newValue: { method: body.method },
    });

    return c.json({ deviation });
  } catch (error: any) {
    console.error('Investigate deviation error:', error);
    return c.json({ message: 'Failed to start investigation' }, 500);
  }
});

// PUT /:id/root-cause — record root cause
deviations.put('/:id/root-cause', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.deviation.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Deviation not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Deviation not found' }, 404);

    const deviation = await prisma.deviation.update({
      where: { id },
      data: {
        rootCause: body.rootCause || '',
        status: existing.status === 'investigating' ? 'root_cause_identified' : existing.status,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'deviation_root_cause_recorded',
      entityType: 'deviation',
      entityId: id,
      newValue: { rootCause: body.rootCause },
    });

    return c.json({ deviation });
  } catch (error: any) {
    console.error('Root cause error:', error);
    return c.json({ message: 'Failed to record root cause' }, 500);
  }
});

// PUT /:id/create-capa — auto-create CAPA linked to this deviation
deviations.put('/:id/create-capa', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.deviation.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Deviation not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Deviation not found' }, 404);

    // Create a CAPA linked to this deviation
    const capa = await prisma.cAPA.create({
      data: {
        projectId: existing.projectId,
        title: `CAPA for ${existing.deviationNumber}: ${existing.title}`,
        status: 'open',
        rootCause: existing.rootCause || '',
        createdBy: user.userId,
      },
    });

    // Update deviation with CAPA link
    const deviation = await prisma.deviation.update({
      where: { id },
      data: {
        capaId: capa.id,
        status: existing.status === 'root_cause_identified' ? 'capa_created' : existing.status,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'deviation_capa_created',
      entityType: 'deviation',
      entityId: id,
      newValue: { capaId: capa.id },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'deviation.capa_created', { deviation, capa });
    }

    return c.json({ deviation, capa });
  } catch (error: any) {
    console.error('Create CAPA error:', error);
    return c.json({ message: 'Failed to create CAPA' }, 500);
  }
});

export default deviations;
