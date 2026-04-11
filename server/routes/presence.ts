import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { realtimeService } from '../services/realtime.service.js';

const presence = new Hono();
presence.use('*', authMiddleware);

// GET /:projectId — list online users in project
presence.get('/:projectId', async (c) => {
  try {
    const { projectId } = c.req.param();
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    // Get from DB presence records (heartbeat-based)
    const records = await prisma.presenceRecord.findMany({
      where: { projectId, lastSeen: { gte: twoMinutesAgo } },
      orderBy: { lastSeen: 'desc' },
    });

    // Deduplicate by userId, keep latest
    const userMap = new Map<string, typeof records[0]>();
    for (const rec of records) {
      if (!userMap.has(rec.userId)) {
        userMap.set(rec.userId, rec);
      }
    }

    const users = Array.from(userMap.values()).map((r) => ({
      userId: r.userId,
      userName: r.userName,
      entityType: r.entityType,
      entityId: r.entityId,
      lastSeen: r.lastSeen.toISOString(),
      status: r.lastSeen.getTime() > Date.now() - 60 * 1000 ? 'active' : 'idle',
    }));

    return c.json({ users });
  } catch (error: any) {
    console.error('Presence list error:', error);
    return c.json({ message: 'Failed to get presence' }, 500);
  }
});

// POST /heartbeat — client sends heartbeat every 30s
presence.post('/heartbeat', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { projectId, entityType, entityId } = body;

    if (!projectId) return c.json({ message: 'projectId required' }, 400);

    // Upsert presence record
    const existing = await prisma.presenceRecord.findFirst({
      where: { userId: user.userId, projectId },
    });

    // Get user name
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { name: true },
    });
    const userName = dbUser?.name || user.email || 'Unknown';

    if (existing) {
      await prisma.presenceRecord.update({
        where: { id: existing.id },
        data: {
          lastSeen: new Date(),
          entityType: entityType ?? null,
          entityId: entityId ?? null,
          userName,
        },
      });
    } else {
      await prisma.presenceRecord.create({
        data: {
          userId: user.userId,
          userName,
          projectId,
          entityType: entityType ?? null,
          entityId: entityId ?? null,
          lastSeen: new Date(),
        },
      });
    }

    // Broadcast presence update via SSE
    realtimeService.broadcast(projectId, 'user.presence', {
      userId: user.userId,
      userName,
      entityType,
      entityId,
      lastSeen: new Date().toISOString(),
    });

    return c.json({ ok: true });
  } catch (error: any) {
    console.error('Heartbeat error:', error);
    return c.json({ message: 'Failed to update presence' }, 500);
  }
});

export default presence;
