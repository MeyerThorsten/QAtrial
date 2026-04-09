import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const risks = new Hono();

risks.use('*', authMiddleware);

risks.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.risk.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ risks: items });
  } catch (error: any) {
    console.error('List risks error:', error);
    return c.json({ message: 'Failed to list risks' }, 500);
  }
});

risks.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.requirementId || body.severity === undefined || body.likelihood === undefined) {
      return c.json({ message: 'projectId, requirementId, severity, and likelihood are required' }, 400);
    }

    const riskScore = body.riskScore ?? body.severity * body.likelihood * (body.detectability ?? 1);

    let riskLevel = body.riskLevel;
    if (!riskLevel) {
      if (riskScore >= 200) riskLevel = 'critical';
      else if (riskScore >= 100) riskLevel = 'high';
      else if (riskScore >= 50) riskLevel = 'medium';
      else riskLevel = 'low';
    }

    const risk = await prisma.risk.create({
      data: {
        projectId: body.projectId,
        requirementId: body.requirementId,
        severity: body.severity,
        likelihood: body.likelihood,
        detectability: body.detectability ?? null,
        riskScore,
        riskLevel,
        mitigation: body.mitigation ?? null,
        residualRisk: body.residualRisk ?? null,
        classifiedBy: body.classifiedBy ?? 'manual',
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'risk',
      entityId: risk.id,
      newValue: risk,
    });

    return c.json({ risk }, 201);
  } catch (error: any) {
    console.error('Create risk error:', error);
    return c.json({ message: 'Failed to create risk' }, 500);
  }
});

risks.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const risk = await prisma.risk.findUnique({ where: { id } });

    if (!risk) {
      return c.json({ message: 'Risk not found' }, 404);
    }

    return c.json({ risk });
  } catch (error: any) {
    console.error('Get risk error:', error);
    return c.json({ message: 'Failed to get risk' }, 500);
  }
});

risks.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.risk.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Risk not found' }, 404);
    }

    const severity = body.severity ?? existing.severity;
    const likelihood = body.likelihood ?? existing.likelihood;
    const detectability = body.detectability !== undefined ? body.detectability : existing.detectability;
    const riskScore = body.riskScore ?? severity * likelihood * (detectability ?? 1);

    let riskLevel = body.riskLevel;
    if (!riskLevel) {
      if (riskScore >= 200) riskLevel = 'critical';
      else if (riskScore >= 100) riskLevel = 'high';
      else if (riskScore >= 50) riskLevel = 'medium';
      else riskLevel = 'low';
    }

    const risk = await prisma.risk.update({
      where: { id },
      data: {
        severity,
        likelihood,
        detectability,
        riskScore,
        riskLevel,
        mitigation: body.mitigation !== undefined ? body.mitigation : existing.mitigation,
        residualRisk: body.residualRisk !== undefined ? body.residualRisk : existing.residualRisk,
        classifiedBy: body.classifiedBy ?? existing.classifiedBy,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'risk',
      entityId: risk.id,
      previousValue: existing,
      newValue: risk,
    });

    return c.json({ risk });
  } catch (error: any) {
    console.error('Update risk error:', error);
    return c.json({ message: 'Failed to update risk' }, 500);
  }
});

risks.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.risk.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Risk not found' }, 404);
    }

    await prisma.risk.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'risk',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Risk deleted' });
  } catch (error: any) {
    console.error('Delete risk error:', error);
    return c.json({ message: 'Failed to delete risk' }, 500);
  }
});

export default risks;
