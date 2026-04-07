import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser, JwtPayload } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const capa = new Hono();

capa.use('*', authMiddleware);

const VALID_TRANSITIONS: Record<string, string[]> = {
  open: ['investigation'],
  investigation: ['in_progress'],
  in_progress: ['verification'],
  verification: ['resolved'],
  resolved: ['closed'],
};

function isValidTransition(from: string, to: string): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

capa.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.cAPA.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ capas: items });
  } catch (error: any) {
    console.error('List CAPAs error:', error);
    return c.json({ message: 'Failed to list CAPAs' }, 500);
  }
});

capa.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }

    const item = await prisma.cAPA.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        status: 'open',
        rootCause: body.rootCause ?? null,
        containment: body.containment ?? null,
        correctiveAction: body.correctiveAction ?? null,
        preventiveAction: body.preventiveAction ?? null,
        effectivenessCheck: body.effectivenessCheck ?? null,
        linkedTestId: body.linkedTestId ?? null,
        createdBy: user.userId,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'capa',
      entityId: item.id,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'capa.created', { capa: item });
    }

    return c.json({ capa: item }, 201);
  } catch (error: any) {
    console.error('Create CAPA error:', error);
    return c.json({ message: 'Failed to create CAPA' }, 500);
  }
});

capa.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const item = await prisma.cAPA.findUnique({ where: { id } });

    if (!item) {
      return c.json({ message: 'CAPA not found' }, 404);
    }

    return c.json({ capa: item });
  } catch (error: any) {
    console.error('Get CAPA error:', error);
    return c.json({ message: 'Failed to get CAPA' }, 500);
  }
});

capa.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.cAPA.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'CAPA not found' }, 404);
    }

    // Validate status transition if status is changing
    if (body.status && body.status !== existing.status) {
      if (!isValidTransition(existing.status, body.status)) {
        return c.json({
          message: `Invalid status transition from '${existing.status}' to '${body.status}'. Valid next states: ${VALID_TRANSITIONS[existing.status]?.join(', ') || 'none'}`,
        }, 400);
      }
    }

    const item = await prisma.cAPA.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        status: body.status ?? existing.status,
        rootCause: body.rootCause !== undefined ? body.rootCause : existing.rootCause,
        containment: body.containment !== undefined ? body.containment : existing.containment,
        correctiveAction: body.correctiveAction !== undefined ? body.correctiveAction : existing.correctiveAction,
        preventiveAction: body.preventiveAction !== undefined ? body.preventiveAction : existing.preventiveAction,
        effectivenessCheck: body.effectivenessCheck !== undefined ? body.effectivenessCheck : existing.effectivenessCheck,
        linkedTestId: body.linkedTestId !== undefined ? body.linkedTestId : existing.linkedTestId,
      },
    });

    const action = body.status && body.status !== existing.status ? 'status_change' : 'update';

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action,
      entityType: 'capa',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
    });

    if (user.orgId) {
      const webhookEvent = action === 'status_change' ? 'capa.status_changed' : 'capa.updated';
      dispatchWebhook(user.orgId, webhookEvent, { capa: item, previous: existing });
    }

    // Closed-loop cascade: when CAPA is resolved, log cascade and dispatch webhook
    if (body.status === 'resolved' && existing.status !== 'resolved') {
      await logAudit({
        projectId: existing.projectId,
        userId: user.userId,
        action: 'cascade',
        entityType: 'capa',
        entityId: item.id,
        newValue: { note: 'CAPA resolved — closed-loop cascade triggered. Review linked documents and training records for updates.' },
      });

      if (user.orgId) {
        dispatchWebhook(user.orgId, 'capa.resolved', { capa: item, previous: existing });
      }
    }

    return c.json({ capa: item });
  } catch (error: any) {
    console.error('Update CAPA error:', error);
    return c.json({ message: 'Failed to update CAPA' }, 500);
  }
});

capa.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.cAPA.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'CAPA not found' }, 404);
    }

    await prisma.cAPA.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'capa',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'CAPA deleted' });
  } catch (error: any) {
    console.error('Delete CAPA error:', error);
    return c.json({ message: 'Failed to delete CAPA' }, 500);
  }
});

export default capa;
