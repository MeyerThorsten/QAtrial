import { Hono } from 'hono';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';
import * as bcrypt from 'bcryptjs';

const batches = new Hono();

batches.use('*', authMiddleware);

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['in_progress'],
  in_progress: ['review'],
  review: ['released', 'rejected'],
  rejected: ['draft'],
};

function isValidTransition(from: string, to: string): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

async function findAccessibleBatch(id: string, orgId: string | null) {
  const batch = await prisma.batchRecord.findUnique({ where: { id } });
  if (!batch) {
    return null;
  }

  const project = await findAccessibleProject(batch.projectId, orgId);
  if (!project) {
    return null;
  }

  return batch;
}

async function findAccessibleBatchWithSteps(id: string, orgId: string | null) {
  const batch = await prisma.batchRecord.findUnique({
    where: { id },
    include: { steps: { orderBy: { stepNumber: 'asc' } } },
  });

  if (!batch) {
    return null;
  }

  const project = await findAccessibleProject(batch.projectId, orgId);
  if (!project) {
    return null;
  }

  return batch;
}

// List batch records by projectId
batches.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const items = await prisma.batchRecord.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ batches: items });
  } catch (error: any) {
    console.error('List batches error:', error);
    return c.json({ message: 'Failed to list batch records' }, 500);
  }
});

// Get single batch with steps
batches.get('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const item = await findAccessibleBatchWithSteps(id, user.orgId);

    if (!item) {
      return c.json({ message: 'Batch record not found' }, 404);
    }

    return c.json({ batch: item });
  } catch (error: any) {
    console.error('Get batch error:', error);
    return c.json({ message: 'Failed to get batch record' }, 500);
  }
});

// Create batch record
batches.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.productName || !body.batchNumber) {
      return c.json({ message: 'projectId, productName, and batchNumber are required' }, 400);
    }
    const project = await findAccessibleProject(body.projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const item = await prisma.batchRecord.create({
      data: {
        projectId: body.projectId,
        productName: body.productName,
        batchNumber: body.batchNumber,
        status: 'draft',
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        yieldExpected: body.yieldExpected ?? null,
        createdBy: user.userId,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'batch_record',
      entityId: item.id,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'batch.created', { batch: item });
    }

    return c.json({ batch: item }, 201);
  } catch (error: any) {
    console.error('Create batch error:', error);
    return c.json({ message: 'Failed to create batch record' }, 500);
  }
});

// Update batch record
batches.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await findAccessibleBatch(id, user.orgId);
    if (!existing) {
      return c.json({ message: 'Batch record not found' }, 404);
    }

    // Validate status transition
    if (body.status && body.status !== existing.status) {
      if (!isValidTransition(existing.status, body.status)) {
        return c.json({
          message: `Invalid status transition from '${existing.status}' to '${body.status}'. Valid next states: ${VALID_TRANSITIONS[existing.status]?.join(', ') || 'none'}`,
        }, 400);
      }
    }

    const item = await prisma.batchRecord.update({
      where: { id },
      data: {
        productName: body.productName ?? existing.productName,
        batchNumber: body.batchNumber ?? existing.batchNumber,
        status: body.status ?? existing.status,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate ? new Date(body.endDate) : existing.endDate,
        yieldActual: body.yieldActual !== undefined ? body.yieldActual : existing.yieldActual,
        yieldExpected: body.yieldExpected !== undefined ? body.yieldExpected : existing.yieldExpected,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: body.status && body.status !== existing.status ? 'status_change' : 'update',
      entityType: 'batch_record',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
    });

    return c.json({ batch: item });
  } catch (error: any) {
    console.error('Update batch error:', error);
    return c.json({ message: 'Failed to update batch record' }, 500);
  }
});

// Delete batch record
batches.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await findAccessibleBatch(id, user.orgId);
    if (!existing) {
      return c.json({ message: 'Batch record not found' }, 404);
    }

    await prisma.batchRecord.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'batch_record',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Batch record deleted' });
  } catch (error: any) {
    console.error('Delete batch error:', error);
    return c.json({ message: 'Failed to delete batch record' }, 500);
  }
});

// Add step to batch
batches.post('/:id/steps', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const batch = await findAccessibleBatch(id, user.orgId);
    if (!batch) {
      return c.json({ message: 'Batch record not found' }, 404);
    }

    if (!body.instruction) {
      return c.json({ message: 'instruction is required' }, 400);
    }

    // Auto-assign stepNumber
    const maxStep = await prisma.batchStep.findFirst({
      where: { batchId: id },
      orderBy: { stepNumber: 'desc' },
    });

    const step = await prisma.batchStep.create({
      data: {
        batchId: id,
        stepNumber: body.stepNumber ?? (maxStep ? maxStep.stepNumber + 1 : 1),
        instruction: body.instruction,
        expectedValue: body.expectedValue ?? null,
        unit: body.unit ?? null,
      },
    });

    await logAudit({
      projectId: batch.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'batch_step',
      entityId: step.id,
      newValue: step,
    });

    return c.json({ step }, 201);
  } catch (error: any) {
    console.error('Add batch step error:', error);
    return c.json({ message: 'Failed to add batch step' }, 500);
  }
});

// Update batch step (record actual value, deviation)
batches.put('/:id/steps/:stepId', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id, stepId } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.batchStep.findUnique({ where: { id: stepId } });
    if (!existing || existing.batchId !== id) {
      return c.json({ message: 'Batch step not found' }, 404);
    }
    const batch = await findAccessibleBatch(id, user.orgId);
    if (!batch) {
      return c.json({ message: 'Batch step not found' }, 404);
    }

    const step = await prisma.batchStep.update({
      where: { id: stepId },
      data: {
        actualValue: body.actualValue !== undefined ? body.actualValue : existing.actualValue,
        inSpec: body.inSpec !== undefined ? body.inSpec : existing.inSpec,
        deviation: body.deviation !== undefined ? body.deviation : existing.deviation,
        deviationNote: body.deviationNote !== undefined ? body.deviationNote : existing.deviationNote,
        performedBy: body.performedBy ?? existing.performedBy ?? user.userId,
        performedAt: body.actualValue !== undefined ? new Date() : existing.performedAt,
        verifiedBy: body.verifiedBy !== undefined ? body.verifiedBy : existing.verifiedBy,
      },
    });

    await logAudit({
      projectId: batch.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'batch_step',
      entityId: step.id,
      previousValue: existing,
      newValue: step,
    });

    // Dispatch webhook if deviation flagged
    if (step.deviation && !existing.deviation && user.orgId) {
      dispatchWebhook(user.orgId, 'batch.deviation_flagged', { batch, step });
    }

    return c.json({ step });
  } catch (error: any) {
    console.error('Update batch step error:', error);
    return c.json({ message: 'Failed to update batch step' }, 500);
  }
});

// Release batch (requires e-signature: check user password)
batches.put('/:id/release', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await findAccessibleBatchWithSteps(id, user.orgId);
    if (!existing) {
      return c.json({ message: 'Batch record not found' }, 404);
    }

    if (existing.status !== 'review') {
      return c.json({ message: 'Batch must be in review status to release' }, 400);
    }

    // E-signature verification: check password
    if (!body.password) {
      return c.json({ message: 'Password required for e-signature release' }, 400);
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser) {
      return c.json({ message: 'User not found' }, 404);
    }

    const passwordValid = await bcrypt.compare(body.password, dbUser.passwordHash);
    if (!passwordValid) {
      return c.json({ message: 'Invalid password. E-signature verification failed.' }, 401);
    }

    const item = await prisma.batchRecord.update({
      where: { id },
      data: {
        status: 'released',
        releasedBy: user.userId,
        releasedAt: new Date(),
        endDate: existing.endDate ?? new Date(),
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'release',
      entityType: 'batch_record',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
      reason: body.reason ?? 'Batch released with e-signature verification',
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'batch.released', { batch: item });
    }

    return c.json({ batch: item });
  } catch (error: any) {
    console.error('Release batch error:', error);
    return c.json({ message: 'Failed to release batch record' }, 500);
  }
});

export default batches;
