import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser, JwtPayload } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const tests = new Hono();

tests.use('*', authMiddleware);

async function nextSeqId(projectId: string): Promise<string> {
  const count = await prisma.test.count({ where: { projectId } });
  return `TST-${String(count + 1).padStart(3, '0')}`;
}

tests.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.test.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });

    return c.json({ tests: items });
  } catch (error: any) {
    console.error('List tests error:', error);
    return c.json({ message: 'Failed to list tests' }, 500);
  }
});

tests.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }

    const seqId = await nextSeqId(body.projectId);

    const test = await prisma.test.create({
      data: {
        projectId: body.projectId,
        seqId,
        title: body.title,
        description: body.description ?? '',
        status: body.status ?? 'Not Run',
        linkedRequirementIds: body.linkedRequirementIds ?? [],
        createdBy: user.userId,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'test',
      entityId: test.id,
      newValue: test,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'test.created', { test });
    }

    return c.json({ test }, 201);
  } catch (error: any) {
    console.error('Create test error:', error);
    return c.json({ message: 'Failed to create test' }, 500);
  }
});

tests.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const test = await prisma.test.findUnique({ where: { id } });

    if (!test) {
      return c.json({ message: 'Test not found' }, 404);
    }

    return c.json({ test });
  } catch (error: any) {
    console.error('Get test error:', error);
    return c.json({ message: 'Failed to get test' }, 500);
  }
});

tests.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.test.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Test not found' }, 404);
    }

    const test = await prisma.test.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        status: body.status ?? existing.status,
        linkedRequirementIds: body.linkedRequirementIds ?? existing.linkedRequirementIds,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'test',
      entityId: test.id,
      previousValue: existing,
      newValue: test,
    });

    if (user.orgId) {
      const event = test.status === 'Failed' ? 'test.failed' : 'test.updated';
      dispatchWebhook(user.orgId, event, { test, previous: existing });
    }

    return c.json({ test });
  } catch (error: any) {
    console.error('Update test error:', error);
    return c.json({ message: 'Failed to update test' }, 500);
  }
});

tests.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.test.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Test not found' }, 404);
    }

    await prisma.test.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'test',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Test deleted' });
  } catch (error: any) {
    console.error('Delete test error:', error);
    return c.json({ message: 'Failed to delete test' }, 500);
  }
});

export default tests;
