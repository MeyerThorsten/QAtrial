import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const stability = new Hono();

stability.use('*', authMiddleware);

// List studies by projectId
stability.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.stabilityStudy.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ studies: items });
  } catch (error: any) {
    console.error('List stability studies error:', error);
    return c.json({ message: 'Failed to list stability studies' }, 500);
  }
});

// Create study
stability.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.productName || !body.conditions || !body.startDate || !body.durationMonths) {
      return c.json({ message: 'projectId, productName, conditions, startDate, and durationMonths are required' }, 400);
    }

    const item = await prisma.stabilityStudy.create({
      data: {
        projectId: body.projectId,
        productName: body.productName,
        studyType: body.studyType ?? 'long_term',
        conditions: body.conditions,
        startDate: new Date(body.startDate),
        durationMonths: body.durationMonths,
        pullSchedule: body.pullSchedule ? JSON.stringify(body.pullSchedule) : '',
        status: body.status ?? 'active',
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'stability_study',
      entityId: item.id,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'stability.study_created', { study: item });
    }

    return c.json({ study: item }, 201);
  } catch (error: any) {
    console.error('Create stability study error:', error);
    return c.json({ message: 'Failed to create stability study' }, 500);
  }
});

// Get study with samples
stability.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const item = await prisma.stabilityStudy.findUnique({
      where: { id },
      include: { samples: { orderBy: { timePointMonths: 'asc' } } },
    });

    if (!item) {
      return c.json({ message: 'Stability study not found' }, 404);
    }

    return c.json({ study: item });
  } catch (error: any) {
    console.error('Get stability study error:', error);
    return c.json({ message: 'Failed to get stability study' }, 500);
  }
});

// Update study
stability.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.stabilityStudy.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Stability study not found' }, 404);
    }

    const item = await prisma.stabilityStudy.update({
      where: { id },
      data: {
        productName: body.productName ?? existing.productName,
        studyType: body.studyType ?? existing.studyType,
        conditions: body.conditions ?? existing.conditions,
        durationMonths: body.durationMonths ?? existing.durationMonths,
        pullSchedule: body.pullSchedule ? JSON.stringify(body.pullSchedule) : existing.pullSchedule,
        status: body.status ?? existing.status,
      },
    });

    return c.json({ study: item });
  } catch (error: any) {
    console.error('Update stability study error:', error);
    return c.json({ message: 'Failed to update stability study' }, 500);
  }
});

// Delete study
stability.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.stabilityStudy.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Stability study not found' }, 404);
    }

    await prisma.stabilityStudy.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'stability_study',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Stability study deleted' });
  } catch (error: any) {
    console.error('Delete stability study error:', error);
    return c.json({ message: 'Failed to delete stability study' }, 500);
  }
});

// Add sample result
stability.post('/:id/samples', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const study = await prisma.stabilityStudy.findUnique({ where: { id } });
    if (!study) {
      return c.json({ message: 'Stability study not found' }, 404);
    }

    if (body.timePointMonths === undefined || !body.parameter) {
      return c.json({ message: 'timePointMonths and parameter are required' }, 400);
    }

    // Auto-detect OOS/OOT if spec and result provided
    let oosFlag = body.oosFlag ?? false;
    let ootFlag = body.ootFlag ?? false;
    let inSpec = body.inSpec ?? null;

    if (body.result && body.specification) {
      // Simple spec check: "90.0-110.0%" pattern
      const specMatch = body.specification.match(/([\d.]+)-([\d.]+)/);
      const resultNum = parseFloat(body.result);
      if (specMatch && !isNaN(resultNum)) {
        const low = parseFloat(specMatch[1]);
        const high = parseFloat(specMatch[2]);
        inSpec = resultNum >= low && resultNum <= high;
        if (!inSpec) oosFlag = true;
        // OOT: within spec but trending (within 5% of limits)
        const margin = (high - low) * 0.05;
        if (inSpec && (resultNum < low + margin || resultNum > high - margin)) {
          ootFlag = true;
        }
      }
    }

    const sample = await prisma.stabilitySample.create({
      data: {
        studyId: id,
        timePointMonths: body.timePointMonths,
        testDate: body.testDate ? new Date(body.testDate) : new Date(),
        parameter: body.parameter,
        result: body.result ?? null,
        specification: body.specification ?? null,
        inSpec,
        oosFlag,
        ootFlag,
        investigationId: body.investigationId ?? null,
      },
    });

    await logAudit({
      projectId: study.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'stability_sample',
      entityId: sample.id,
      newValue: sample,
    });

    if (user.orgId && oosFlag) {
      dispatchWebhook(user.orgId, 'stability.oos_detected', { sample, study });
    }

    return c.json({ sample }, 201);
  } catch (error: any) {
    console.error('Add stability sample error:', error);
    return c.json({ message: 'Failed to add stability sample' }, 500);
  }
});

// Trending data for charts
stability.get('/:id/trending', async (c) => {
  try {
    const { id } = c.req.param();

    const study = await prisma.stabilityStudy.findUnique({
      where: { id },
      include: { samples: { orderBy: { timePointMonths: 'asc' } } },
    });

    if (!study) {
      return c.json({ message: 'Stability study not found' }, 404);
    }

    // Group by parameter
    const byParameter: Record<string, { timePoint: number; result: string | null; inSpec: boolean | null; oosFlag: boolean; ootFlag: boolean }[]> = {};
    for (const sample of study.samples) {
      if (!byParameter[sample.parameter]) {
        byParameter[sample.parameter] = [];
      }
      byParameter[sample.parameter].push({
        timePoint: sample.timePointMonths,
        result: sample.result,
        inSpec: sample.inSpec,
        oosFlag: sample.oosFlag,
        ootFlag: sample.ootFlag,
      });
    }

    return c.json({ trending: byParameter, studyId: id, conditions: study.conditions });
  } catch (error: any) {
    console.error('Stability trending error:', error);
    return c.json({ message: 'Failed to get trending data' }, 500);
  }
});

// OOS/OOT flagged samples
stability.get('/:id/oos-oot', async (c) => {
  try {
    const { id } = c.req.param();

    const samples = await prisma.stabilitySample.findMany({
      where: {
        studyId: id,
        OR: [{ oosFlag: true }, { ootFlag: true }],
      },
      orderBy: { timePointMonths: 'asc' },
    });

    return c.json({ samples });
  } catch (error: any) {
    console.error('OOS/OOT list error:', error);
    return c.json({ message: 'Failed to get OOS/OOT samples' }, 500);
  }
});

export default stability;
