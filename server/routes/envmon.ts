import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const envmon = new Hono();

envmon.use('*', authMiddleware);

// List monitoring points
envmon.get('/points', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.monitoringPoint.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ points: items });
  } catch (error: any) {
    console.error('List monitoring points error:', error);
    return c.json({ message: 'Failed to list monitoring points' }, 500);
  }
});

// Create monitoring point
envmon.post('/points', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.name || !body.zone) {
      return c.json({ message: 'projectId, name, and zone are required' }, 400);
    }

    const item = await prisma.monitoringPoint.create({
      data: {
        projectId: body.projectId,
        name: body.name,
        zone: body.zone,
        type: body.type ?? 'temperature',
        unit: body.unit ?? '°C',
        alertThreshold: body.alertThreshold ?? null,
        actionThreshold: body.actionThreshold ?? null,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'monitoring_point',
      entityId: item.id,
      newValue: item,
    });

    return c.json({ point: item }, 201);
  } catch (error: any) {
    console.error('Create monitoring point error:', error);
    return c.json({ message: 'Failed to create monitoring point' }, 500);
  }
});

// Add reading (auto-detect excursion)
envmon.post('/points/:id/readings', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const point = await prisma.monitoringPoint.findUnique({ where: { id } });
    if (!point) {
      return c.json({ message: 'Monitoring point not found' }, 404);
    }

    if (body.value === undefined) {
      return c.json({ message: 'value is required' }, 400);
    }

    // Auto-detect excursion based on thresholds
    let excursion = false;
    let excursionType: string | null = null;

    if (point.actionThreshold !== null && body.value > point.actionThreshold) {
      excursion = true;
      excursionType = 'action';
    } else if (point.alertThreshold !== null && body.value > point.alertThreshold) {
      excursion = true;
      excursionType = 'alert';
    }

    const reading = await prisma.monitoringReading.create({
      data: {
        pointId: id,
        value: body.value,
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
        excursion,
        excursionType,
        actionTaken: body.actionTaken ?? null,
        acknowledgedBy: body.acknowledgedBy ?? null,
      },
    });

    if (excursion && user.orgId) {
      dispatchWebhook(user.orgId, 'envmon.excursion_detected', {
        reading,
        point,
        excursionType,
      });
    }

    return c.json({ reading }, 201);
  } catch (error: any) {
    console.error('Add reading error:', error);
    return c.json({ message: 'Failed to add reading' }, 500);
  }
});

// Get readings for a point
envmon.get('/points/:id/readings', async (c) => {
  try {
    const { id } = c.req.param();
    const limit = parseInt(c.req.query('limit') || '100');

    const point = await prisma.monitoringPoint.findUnique({ where: { id } });
    if (!point) {
      return c.json({ message: 'Monitoring point not found' }, 404);
    }

    const readings = await prisma.monitoringReading.findMany({
      where: { pointId: id },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return c.json({ readings, point });
  } catch (error: any) {
    console.error('Get readings error:', error);
    return c.json({ message: 'Failed to get readings' }, 500);
  }
});

// List all excursions for project
envmon.get('/excursions', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const points = await prisma.monitoringPoint.findMany({
      where: { projectId },
      select: { id: true, name: true, zone: true, type: true },
    });

    const pointIds = points.map((p) => p.id);
    const pointMap = new Map(points.map((p) => [p.id, p]));

    const excursions = await prisma.monitoringReading.findMany({
      where: {
        pointId: { in: pointIds },
        excursion: true,
      },
      orderBy: { timestamp: 'desc' },
    });

    const enriched = excursions.map((ex) => ({
      ...ex,
      point: pointMap.get(ex.pointId),
    }));

    return c.json({ excursions: enriched });
  } catch (error: any) {
    console.error('List excursions error:', error);
    return c.json({ message: 'Failed to list excursions' }, 500);
  }
});

// Environmental trending data
envmon.get('/trending', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const points = await prisma.monitoringPoint.findMany({
      where: { projectId },
      include: {
        readings: {
          orderBy: { timestamp: 'asc' },
          take: 500,
        },
      },
    });

    const trending = points.map((point) => ({
      pointId: point.id,
      name: point.name,
      zone: point.zone,
      type: point.type,
      unit: point.unit,
      alertThreshold: point.alertThreshold,
      actionThreshold: point.actionThreshold,
      readings: point.readings.map((r) => ({
        timestamp: r.timestamp,
        value: r.value,
        excursion: r.excursion,
      })),
      excursionCount: point.readings.filter((r) => r.excursion).length,
      latestValue: point.readings.length > 0 ? point.readings[point.readings.length - 1].value : null,
    }));

    return c.json({ trending });
  } catch (error: any) {
    console.error('Environmental trending error:', error);
    return c.json({ message: 'Failed to get trending data' }, 500);
  }
});

export default envmon;
