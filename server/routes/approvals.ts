import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const approvals = new Hono();

approvals.use('*', authMiddleware);

/**
 * Helper: update the status of the linked entity (requirement, test, or CAPA).
 */
async function updateEntityStatus(entityType: string, entityId: string, status: string) {
  switch (entityType) {
    case 'requirement':
      await prisma.requirement.update({ where: { id: entityId }, data: { status } });
      break;
    case 'test':
      await prisma.test.update({ where: { id: entityId }, data: { status } });
      break;
    case 'capa':
      await prisma.cAPA.update({ where: { id: entityId }, data: { status } });
      break;
  }
}

/**
 * Helper: get the projectId from an entity.
 */
async function getEntityProjectId(entityType: string, entityId: string): Promise<string | null> {
  let entity: any = null;
  switch (entityType) {
    case 'requirement':
      entity = await prisma.requirement.findUnique({ where: { id: entityId }, select: { projectId: true } });
      break;
    case 'test':
      entity = await prisma.test.findUnique({ where: { id: entityId }, select: { projectId: true } });
      break;
    case 'capa':
      entity = await prisma.cAPA.findUnique({ where: { id: entityId }, select: { projectId: true } });
      break;
  }
  return entity?.projectId ?? null;
}

// POST /request — request approval for an entity
approvals.post('/request', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const { projectId, entityType, entityId } = body;
    if (!projectId || !entityType || !entityId) {
      return c.json({ message: 'projectId, entityType, and entityId are required' }, 400);
    }

    if (!['requirement', 'test', 'capa'].includes(entityType)) {
      return c.json({ message: 'entityType must be requirement, test, or capa' }, 400);
    }

    // Verify entity exists
    const entityProjectId = await getEntityProjectId(entityType, entityId);
    if (!entityProjectId) {
      return c.json({ message: 'Entity not found' }, 404);
    }

    // Check for existing pending approval
    const existingPending = await prisma.approval.findFirst({
      where: { entityType, entityId, status: 'pending' },
    });
    if (existingPending) {
      return c.json({ message: 'A pending approval already exists for this entity' }, 400);
    }

    // Update entity status to "In Review"
    await updateEntityStatus(entityType, entityId, 'In Review');

    const approval = await prisma.approval.create({
      data: {
        projectId,
        entityType,
        entityId,
        status: 'pending',
        requestedBy: user.userId,
      },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'request_approval',
      entityType: 'approval',
      entityId: approval.id,
      newValue: { entityType, entityId, status: 'pending' },
    });

    return c.json({ approval }, 201);
  } catch (error: any) {
    console.error('Request approval error:', error);
    return c.json({ message: 'Failed to request approval' }, 500);
  }
});

// PUT /:id/review — approve or reject
approvals.put('/:id/review', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const { action, reason } = body;
    if (!action || !['approved', 'rejected'].includes(action)) {
      return c.json({ message: 'action must be "approved" or "rejected"' }, 400);
    }

    if (!reason || reason.trim().length === 0) {
      return c.json({ message: 'reason is required' }, 400);
    }

    const existing = await prisma.approval.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Approval not found' }, 404);
    }

    if (existing.status !== 'pending') {
      return c.json({ message: 'Approval has already been reviewed' }, 400);
    }

    // Reviewer cannot be the same as requester
    if (existing.requestedBy === user.userId) {
      return c.json({ message: 'Cannot review your own approval request' }, 403);
    }

    const approval = await prisma.approval.update({
      where: { id },
      data: {
        status: action,
        reviewedBy: user.userId,
        reviewedAt: new Date(),
        reason,
      },
    });

    // Update entity status based on action
    const newStatus = action === 'approved' ? 'Approved' : 'Draft';
    await updateEntityStatus(existing.entityType, existing.entityId, newStatus);

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: `approval_${action}`,
      entityType: 'approval',
      entityId: approval.id,
      previousValue: { status: 'pending' },
      newValue: { status: action, reason },
    });

    return c.json({ approval });
  } catch (error: any) {
    console.error('Review approval error:', error);
    return c.json({ message: 'Failed to review approval' }, 500);
  }
});

// GET / — list approvals (filterable by status and projectId)
approvals.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    const status = c.req.query('status');

    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const where: any = { projectId };
    if (status) where.status = status;

    const items = await prisma.approval.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ approvals: items });
  } catch (error: any) {
    console.error('List approvals error:', error);
    return c.json({ message: 'Failed to list approvals' }, 500);
  }
});

// GET /my-pending — list approvals pending for current user's role
approvals.get('/my-pending', async (c) => {
  try {
    const user = getUser(c);

    // Return all pending approvals not requested by this user (they are potential reviewers)
    const items = await prisma.approval.findMany({
      where: {
        status: 'pending',
        requestedBy: { not: user.userId },
      },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ approvals: items });
  } catch (error: any) {
    console.error('My pending approvals error:', error);
    return c.json({ message: 'Failed to list pending approvals' }, 500);
  }
});

export default approvals;
