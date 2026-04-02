import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser, JwtPayload } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const requirements = new Hono();

requirements.use('*', authMiddleware);

async function nextSeqId(projectId: string): Promise<string> {
  const count = await prisma.requirement.count({ where: { projectId } });
  return `REQ-${String(count + 1).padStart(3, '0')}`;
}

requirements.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.requirement.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });

    return c.json({ requirements: items });
  } catch (error: any) {
    console.error('List requirements error:', error);
    return c.json({ message: 'Failed to list requirements' }, 500);
  }
});

requirements.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }

    const seqId = await nextSeqId(body.projectId);

    const requirement = await prisma.requirement.create({
      data: {
        projectId: body.projectId,
        seqId,
        title: body.title,
        description: body.description ?? '',
        status: body.status ?? 'Draft',
        tags: body.tags ?? [],
        riskLevel: body.riskLevel ?? null,
        regulatoryRef: body.regulatoryRef ?? null,
        evidenceHints: body.evidenceHints ?? [],
        createdBy: user.userId,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'requirement',
      entityId: requirement.id,
      newValue: requirement,
    });

    return c.json({ requirement }, 201);
  } catch (error: any) {
    console.error('Create requirement error:', error);
    return c.json({ message: 'Failed to create requirement' }, 500);
  }
});

requirements.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const requirement = await prisma.requirement.findUnique({ where: { id } });

    if (!requirement) {
      return c.json({ message: 'Requirement not found' }, 404);
    }

    return c.json({ requirement });
  } catch (error: any) {
    console.error('Get requirement error:', error);
    return c.json({ message: 'Failed to get requirement' }, 500);
  }
});

requirements.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.requirement.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Requirement not found' }, 404);
    }

    const requirement = await prisma.requirement.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        status: body.status ?? existing.status,
        tags: body.tags ?? existing.tags,
        riskLevel: body.riskLevel !== undefined ? body.riskLevel : existing.riskLevel,
        regulatoryRef: body.regulatoryRef !== undefined ? body.regulatoryRef : existing.regulatoryRef,
        evidenceHints: body.evidenceHints ?? existing.evidenceHints,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'requirement',
      entityId: requirement.id,
      previousValue: existing,
      newValue: requirement,
    });

    return c.json({ requirement });
  } catch (error: any) {
    console.error('Update requirement error:', error);
    return c.json({ message: 'Failed to update requirement' }, 500);
  }
});

requirements.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.requirement.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Requirement not found' }, 404);
    }

    // Remove this requirement from any test's linkedRequirementIds
    const linkedTests = await prisma.test.findMany({
      where: { projectId: existing.projectId, linkedRequirementIds: { has: id } },
    });

    for (const test of linkedTests) {
      await prisma.test.update({
        where: { id: test.id },
        data: {
          linkedRequirementIds: test.linkedRequirementIds.filter((rid) => rid !== id),
        },
      });
    }

    await prisma.requirement.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'requirement',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Requirement deleted' });
  } catch (error: any) {
    console.error('Delete requirement error:', error);
    return c.json({ message: 'Failed to delete requirement' }, 500);
  }
});

export default requirements;
