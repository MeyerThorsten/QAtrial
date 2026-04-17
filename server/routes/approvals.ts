import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { findAccessibleProject, listAccessibleProjectIds } from '../lib/projectAccess.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const approvals = new Hono();

approvals.use('*', authMiddleware);

const VALID_ENTITY_TYPES = ['requirement', 'test', 'capa'] as const;

class ApprovalError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
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

async function findPendingApproval(entityType: string, entityId: string) {
  return prisma.approval.findFirst({
    where: {
      entityType,
      entityId,
      status: 'pending',
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function createApprovalRequest(
  user: ReturnType<typeof getUser>,
  entityType: string,
  entityId: string,
): Promise<Awaited<ReturnType<typeof prisma.approval.create>>> {
  if (!VALID_ENTITY_TYPES.includes(entityType as (typeof VALID_ENTITY_TYPES)[number])) {
    throw new ApprovalError(400, 'entityType must be requirement, test, or capa');
  }

  const entityProjectId = await getEntityProjectId(entityType, entityId);
  if (!entityProjectId) {
    throw new ApprovalError(404, 'Entity not found');
  }

  const accessibleProject = await findAccessibleProject(entityProjectId, user.orgId);
  if (!accessibleProject) {
    throw new ApprovalError(404, 'Entity not found');
  }

  const existingPending = await findPendingApproval(entityType, entityId);
  if (existingPending) {
    throw new ApprovalError(400, 'A pending approval already exists for this entity');
  }

  const approval = await prisma.approval.create({
    data: {
      projectId: entityProjectId,
      entityType,
      entityId,
      status: 'pending',
      requestedBy: user.userId,
    },
  });

  await logAudit({
    projectId: entityProjectId,
    userId: user.userId,
    action: 'request_approval',
    entityType,
    entityId,
    newValue: { approvalId: approval.id, status: 'pending' },
    reason: 'Approval requested',
  });

  if (user.orgId) {
    dispatchWebhook(user.orgId, 'approval.requested', { approval });
  }

  return approval;
}

async function reviewApproval(
  user: ReturnType<typeof getUser>,
  approvalId: string,
  action: 'approved' | 'rejected',
  signatureId?: string,
  reason?: string,
) {
  const existing = await prisma.approval.findUnique({ where: { id: approvalId } });
  if (!existing) {
    throw new ApprovalError(404, 'Approval not found');
  }

  const accessibleProject = await findAccessibleProject(existing.projectId, user.orgId);
  if (!accessibleProject) {
    throw new ApprovalError(404, 'Approval not found');
  }

  if (existing.status !== 'pending') {
    throw new ApprovalError(400, 'Approval has already been reviewed');
  }

  if (existing.requestedBy === user.userId) {
    throw new ApprovalError(403, 'Cannot review your own approval request');
  }

  const reviewReason = reason?.trim() || (action === 'approved' ? 'Approved' : '');
  if (action === 'rejected' && reviewReason.length === 0) {
    throw new ApprovalError(400, 'reason is required when rejecting an approval');
  }

  if (signatureId) {
    const signature = await prisma.signature.findUnique({ where: { id: signatureId } });
    if (!signature) {
      throw new ApprovalError(404, 'Signature not found');
    }

    if (
      signature.projectId !== existing.projectId ||
      signature.entityType !== existing.entityType ||
      signature.entityId !== existing.entityId
    ) {
      throw new ApprovalError(400, 'Signature does not match this approval entity');
    }
  }

  const approval = await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status: action,
      reviewedBy: user.userId,
      reviewedAt: new Date(),
      reason: reviewReason || null,
      signatureId: signatureId ?? undefined,
    },
  });

  await logAudit({
    projectId: existing.projectId,
    userId: user.userId,
    action: action === 'approved' ? 'approve' : 'reject',
    entityType: existing.entityType,
    entityId: existing.entityId,
    previousValue: { approvalId: approval.id, status: 'pending' },
    newValue: { approvalId: approval.id, status: action, signatureId: signatureId ?? undefined },
    reason: reviewReason || undefined,
  });

  if (user.orgId) {
    dispatchWebhook(user.orgId, action === 'approved' ? 'approval.approved' : 'approval.rejected', { approval });
  }

  return approval;
}

async function revokeApproval(user: ReturnType<typeof getUser>, approvalId: string) {
  const existing = await prisma.approval.findUnique({ where: { id: approvalId } });
  if (!existing) {
    throw new ApprovalError(404, 'Approval not found');
  }

  const accessibleProject = await findAccessibleProject(existing.projectId, user.orgId);
  if (!accessibleProject) {
    throw new ApprovalError(404, 'Approval not found');
  }

  if (existing.status !== 'pending') {
    throw new ApprovalError(400, 'Only pending approvals can be revoked');
  }

  if (existing.requestedBy !== user.userId && user.role !== 'admin') {
    throw new ApprovalError(403, 'Only the requester or an admin can revoke this approval');
  }

  await prisma.approval.delete({ where: { id: approvalId } });

  await logAudit({
    projectId: existing.projectId,
    userId: user.userId,
    action: 'approval_revoked',
    entityType: existing.entityType,
    entityId: existing.entityId,
    previousValue: { approvalId, status: 'pending' },
    reason: 'Approval revoked',
  });

  return existing;
}

function approvalErrorResponse(c: any, error: unknown, label: string) {
  if (error instanceof ApprovalError) {
    return c.json({ message: error.message }, error.status);
  }

  console.error(label, error);
  return c.json({ message: 'Failed to process approval request' }, 500);
}

// POST /request — request approval for an entity
approvals.post('/request', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { entityType, entityId } = body;
    if (!entityType || !entityId) {
      return c.json({ message: 'entityType and entityId are required' }, 400);
    }

    const approval = await createApprovalRequest(user, entityType, entityId);
    return c.json({ approval }, 201);
  } catch (error: any) {
    return approvalErrorResponse(c, error, 'Request approval error:');
  }
});

// Compatibility route for the current frontend ApprovalPanel
approvals.post('/:entityType/:entityId/request', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { entityType, entityId } = c.req.param();
    const approval = await createApprovalRequest(user, entityType, entityId);
    return c.json({ approval }, 201);
  } catch (error: any) {
    return approvalErrorResponse(c, error, 'Request approval error:');
  }
});

// PUT /:id/review — approve or reject
approvals.put('/:id/review', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const { action, reason, signatureId } = body;
    if (!action || !['approved', 'rejected'].includes(action)) {
      return c.json({ message: 'action must be "approved" or "rejected"' }, 400);
    }

    const approval = await reviewApproval(user, id, action, signatureId, reason);
    return c.json({ approval });
  } catch (error: any) {
    return approvalErrorResponse(c, error, 'Review approval error:');
  }
});

approvals.post('/:entityType/:entityId/approve', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { entityType, entityId } = c.req.param();
    const body = await c.req.json().catch(() => ({}));
    const existing = await findPendingApproval(entityType, entityId);
    if (!existing) {
      return c.json({ message: 'Pending approval not found for this entity' }, 404);
    }

    const approval = await reviewApproval(user, existing.id, 'approved', body.signatureId, body.reason);
    return c.json({ approval });
  } catch (error: any) {
    return approvalErrorResponse(c, error, 'Approve approval error:');
  }
});

approvals.post('/:entityType/:entityId/reject', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { entityType, entityId } = c.req.param();
    const body = await c.req.json();
    const existing = await findPendingApproval(entityType, entityId);
    if (!existing) {
      return c.json({ message: 'Pending approval not found for this entity' }, 404);
    }

    const approval = await reviewApproval(user, existing.id, 'rejected', body.signatureId, body.reason);
    return c.json({ approval });
  } catch (error: any) {
    return approvalErrorResponse(c, error, 'Reject approval error:');
  }
});

approvals.post('/:entityType/:entityId/revoke', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { entityType, entityId } = c.req.param();
    const existing = await findPendingApproval(entityType, entityId);
    if (!existing) {
      return c.json({ message: 'Pending approval not found for this entity' }, 404);
    }

    const approval = await revokeApproval(user, existing.id);
    return c.json({ approval, message: 'Approval revoked' });
  } catch (error: any) {
    return approvalErrorResponse(c, error, 'Revoke approval error:');
  }
});

// GET / — list approvals (filterable by status and projectId)
approvals.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    const status = c.req.query('status');
    const entityType = c.req.query('entityType');
    const entityId = c.req.query('entityId');

    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const accessibleProject = await findAccessibleProject(projectId, user.orgId);
    if (!accessibleProject) {
      return c.json({ approvals: [] });
    }

    const where: any = { projectId };
    if (status) where.status = status;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    const items = await prisma.approval.findMany({
      where,
      include: { signature: true },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ approvals: items });
  } catch (error: any) {
    console.error('List approvals error:', error);
    return c.json({ message: 'Failed to list approvals' }, 500);
  }
});

// GET /my-pending — list approvals pending for current user's role
approvals.get('/my-pending', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);

    const accessibleIds = await listAccessibleProjectIds(user.orgId);
    if (accessibleIds.length === 0) {
      return c.json({ approvals: [] });
    }

    // Return all pending approvals not requested by this user (they are potential reviewers)
    // scoped to projects within the user's organization
    const items = await prisma.approval.findMany({
      where: {
        status: 'pending',
        requestedBy: { not: user.userId },
        projectId: { in: accessibleIds },
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
