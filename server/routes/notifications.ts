import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';

const notifications = new Hono();

notifications.use('*', authMiddleware);

/**
 * Helper: create a notification (exported for use by other routes).
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  entityType?: string,
  entityId?: string,
  projectId?: string,
) {
  return prisma.notification.create({
    data: { userId, type, title, message, entityType: entityType ?? null, entityId: entityId ?? null, projectId: projectId ?? null },
  });
}

// GET / — my notifications (paginated, newest first)
notifications.get('/', async (c) => {
  try {
    const user = getUser(c);
    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = parseInt(c.req.query('limit') || '30', 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId: user.userId } }),
    ]);

    return c.json({ notifications: items, total, page, limit });
  } catch (error: any) {
    console.error('List notifications error:', error);
    return c.json({ message: 'Failed to list notifications' }, 500);
  }
});

// GET /unread-count
notifications.get('/unread-count', async (c) => {
  try {
    const user = getUser(c);
    const count = await prisma.notification.count({
      where: { userId: user.userId, read: false },
    });
    return c.json({ count });
  } catch (error: any) {
    console.error('Unread count error:', error);
    return c.json({ message: 'Failed to get unread count' }, 500);
  }
});

// PUT /:id/read — mark single as read
notifications.put('/:id/read', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.userId !== user.userId) {
      return c.json({ message: 'Notification not found' }, 404);
    }
    const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
    return c.json({ notification: updated });
  } catch (error: any) {
    console.error('Mark read error:', error);
    return c.json({ message: 'Failed to mark notification read' }, 500);
  }
});

// PUT /read-all — mark all as read
notifications.put('/read-all', async (c) => {
  try {
    const user = getUser(c);
    await prisma.notification.updateMany({
      where: { userId: user.userId, read: false },
      data: { read: true },
    });
    return c.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    console.error('Mark all read error:', error);
    return c.json({ message: 'Failed to mark all as read' }, 500);
  }
});

// DELETE /:id
notifications.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.userId !== user.userId) {
      return c.json({ message: 'Notification not found' }, 404);
    }
    await prisma.notification.delete({ where: { id } });
    return c.json({ message: 'Notification deleted' });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    return c.json({ message: 'Failed to delete notification' }, 500);
  }
});

export default notifications;
