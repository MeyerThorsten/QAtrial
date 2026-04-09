import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { findAccessibleProject } from '../lib/projectAccess.js';

const audit = new Hono();

audit.use('*', authMiddleware);

audit.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    const entityId = c.req.query('entityId');
    const from = c.req.query('from');
    const to = c.req.query('to');
    const limit = parseInt(c.req.query('limit') || '100', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);

    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const projectAccess = await findAccessibleProject(projectId, user.orgId);
    if (!projectAccess) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const where: any = { projectId };

    if (entityId) where.entityId = entityId;
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = new Date(from);
      if (to) where.timestamp.lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return c.json({ auditLogs: items, total, limit, offset });
  } catch (error: any) {
    console.error('List audit logs error:', error);
    return c.json({ message: 'Failed to list audit logs' }, 500);
  }
});

audit.get('/export', requirePermission('canExport'), async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const projectAccess = await findAccessibleProject(projectId, user.orgId);
    if (!projectAccess) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const format = c.req.query('format') || 'csv';
    if (format !== 'csv') {
      return c.json({ message: 'Only CSV format is supported' }, 400);
    }

    const items = await prisma.auditLog.findMany({
      where: { projectId },
      orderBy: { timestamp: 'desc' },
    });

    const headers = ['id', 'timestamp', 'userId', 'action', 'entityType', 'entityId', 'reason'];
    const rows = items.map((item) => [
      item.id,
      item.timestamp.toISOString(),
      item.userId,
      item.action,
      item.entityType,
      item.entityId,
      item.reason ?? '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-log-${projectId}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Export audit logs error:', error);
    return c.json({ message: 'Failed to export audit logs' }, 500);
  }
});

export default audit;
