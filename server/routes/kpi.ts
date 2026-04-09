import { Hono } from 'hono';
import { listAccessibleProjectIds } from '../lib/projectAccess.js';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission, roleHasPermission, type JwtPayload } from '../middleware/auth.js';

const kpi = new Hono();

kpi.use('*', authMiddleware);

// ── Metrics Catalog ─────────────────────────────────────────────────────────

const METRICS_CATALOG: Record<string, { metrics: string[]; groupByOptions: string[] }> = {
  requirements: {
    metrics: ['count', 'overdue_count'],
    groupByOptions: ['status', 'area', 'month'],
  },
  tests: {
    metrics: ['count', 'pass_rate'],
    groupByOptions: ['status', 'month'],
  },
  capa: {
    metrics: ['count', 'overdue_count'],
    groupByOptions: ['status', 'month'],
  },
  deviations: {
    metrics: ['count', 'overdue_count'],
    groupByOptions: ['classification', 'area', 'status', 'month'],
  },
  complaints: {
    metrics: ['count'],
    groupByOptions: ['severity', 'month', 'status'],
  },
  training: {
    metrics: ['count', 'compliance_pct'],
    groupByOptions: ['status', 'month'],
  },
  suppliers: {
    metrics: ['count', 'avg_score'],
    groupByOptions: ['category', 'riskLevel', 'qualificationStatus'],
  },
  batches: {
    metrics: ['count', 'yield_avg'],
    groupByOptions: ['status', 'product', 'month'],
  },
  stability: {
    metrics: ['count', 'oos_count'],
    groupByOptions: ['status', 'month'],
  },
};

function canViewDashboard(dashboard: { createdBy: string; isPublic: boolean }, user: JwtPayload): boolean {
  return dashboard.isPublic || dashboard.createdBy === user.userId || roleHasPermission(user.role, 'canAdmin');
}

function canManageDashboard(dashboard: { createdBy: string }, user: JwtPayload): boolean {
  return dashboard.createdBy === user.userId || roleHasPermission(user.role, 'canAdmin');
}

function applyProjectScope(where: Record<string, any>, projectId: string | undefined, accessibleProjectIds: string[]) {
  if (projectId) {
    if (!accessibleProjectIds.includes(projectId)) {
      throw new Error('Project not found');
    }
    where.projectId = projectId;
    return;
  }

  where.projectId = { in: accessibleProjectIds };
}

// GET /metrics/available — return catalog of available data sources and metrics
kpi.get('/metrics/available', async (c) => {
  const catalog = Object.entries(METRICS_CATALOG).map(([source, config]) => ({
    dataSource: source,
    metrics: config.metrics,
    groupByOptions: config.groupByOptions,
  }));
  return c.json({ catalog });
});

// ── Dashboard CRUD ──────────────────────────────────────────────────────────

// GET /dashboards — list dashboards for org
kpi.get('/dashboards', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId || '';
    const dashboards = await prisma.customDashboard.findMany({
      where: {
        orgId,
        ...(roleHasPermission(user.role, 'canAdmin')
          ? {}
          : { OR: [{ isPublic: true }, { createdBy: user.userId }] }),
      },
      include: { widgets: { select: { id: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    const result = dashboards.map((d) => ({
      ...d,
      widgetCount: d.widgets.length,
      widgets: undefined,
    }));
    return c.json({ dashboards: result });
  } catch (error: any) {
    console.error('List dashboards error:', error);
    return c.json({ message: 'Failed to list dashboards' }, 500);
  }
});

// POST /dashboards — create dashboard
kpi.post('/dashboards', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { name, description, isPublic } = body;

    if (!name) return c.json({ message: 'name is required' }, 400);

    const dashboard = await prisma.customDashboard.create({
      data: {
        orgId: user.orgId || '',
        name,
        description: description || '',
        createdBy: user.userId,
        isPublic: isPublic !== false,
      },
      include: { widgets: true },
    });

    return c.json({ dashboard }, 201);
  } catch (error: any) {
    console.error('Create dashboard error:', error);
    return c.json({ message: 'Failed to create dashboard' }, 500);
  }
});

// GET /dashboards/:id — get with widgets
kpi.get('/dashboards/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const dashboard = await prisma.customDashboard.findFirst({
      where: { id, orgId: user.orgId || '' },
      include: { widgets: { orderBy: { position: 'asc' } } },
    });
    if (!dashboard) return c.json({ message: 'Dashboard not found' }, 404);
    if (!canViewDashboard(dashboard, user)) {
      return c.json({ message: 'Dashboard not found' }, 404);
    }
    return c.json({ dashboard });
  } catch (error: any) {
    console.error('Get dashboard error:', error);
    return c.json({ message: 'Failed to get dashboard' }, 500);
  }
});

// PUT /dashboards/:id — update name/description/public
kpi.put('/dashboards/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { name, description, isPublic } = body;

    const existing = await prisma.customDashboard.findFirst({ where: { id, orgId: user.orgId || '' } });
    if (!existing) return c.json({ message: 'Dashboard not found' }, 404);
    if (!canManageDashboard(existing, user)) {
      return c.json({ message: 'Only the creator or an admin can update this dashboard' }, 403);
    }

    const dashboard = await prisma.customDashboard.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        isPublic: isPublic ?? existing.isPublic,
      },
      include: { widgets: { orderBy: { position: 'asc' } } },
    });

    return c.json({ dashboard });
  } catch (error: any) {
    console.error('Update dashboard error:', error);
    return c.json({ message: 'Failed to update dashboard' }, 500);
  }
});

// DELETE /dashboards/:id — delete (creator or admin)
kpi.delete('/dashboards/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.customDashboard.findFirst({ where: { id, orgId: user.orgId || '' } });
    if (!existing) return c.json({ message: 'Dashboard not found' }, 404);
    if (!canManageDashboard(existing, user)) {
      return c.json({ message: 'Only the creator or an admin can delete this dashboard' }, 403);
    }

    await prisma.customDashboard.delete({ where: { id } });
    return c.json({ message: 'Dashboard deleted' });
  } catch (error: any) {
    console.error('Delete dashboard error:', error);
    return c.json({ message: 'Failed to delete dashboard' }, 500);
  }
});

// ── Widget CRUD ─────────────────────────────────────────────────────────────

// POST /dashboards/:id/widgets — add widget
kpi.post('/dashboards/:id/widgets', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { type, title, dataSource, metric, groupBy, filters, position, size } = body;

    const dashboard = await prisma.customDashboard.findFirst({ where: { id, orgId: user.orgId || '' } });
    if (!dashboard) return c.json({ message: 'Dashboard not found' }, 404);
    if (!canManageDashboard(dashboard, user)) {
      return c.json({ message: 'Only the creator or an admin can update this dashboard' }, 403);
    }

    if (!type || !title || !dataSource || !metric) {
      return c.json({ message: 'type, title, dataSource, and metric are required' }, 400);
    }

    // Get current max position
    const maxPos = await prisma.dashboardWidget.findFirst({
      where: { dashboardId: id },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const widget = await prisma.dashboardWidget.create({
      data: {
        dashboardId: id,
        type,
        title,
        dataSource,
        metric,
        groupBy: groupBy || null,
        filters: filters || null,
        position: position ?? (maxPos ? maxPos.position + 1 : 0),
        size: size || 'medium',
      },
    });

    return c.json({ widget }, 201);
  } catch (error: any) {
    console.error('Create widget error:', error);
    return c.json({ message: 'Failed to create widget' }, 500);
  }
});

// PUT /dashboards/:id/widgets/:widgetId — update widget config
kpi.put('/dashboards/:id/widgets/:widgetId', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { widgetId } = c.req.param();
    const body = await c.req.json();
    const { type, title, dataSource, metric, groupBy, filters, size } = body;

    const existing = await prisma.dashboardWidget.findUnique({
      where: { id: widgetId },
      include: { dashboard: true },
    });
    if (!existing) return c.json({ message: 'Widget not found' }, 404);
    if (existing.dashboard.orgId !== (user.orgId || '') || !canManageDashboard(existing.dashboard, user)) {
      return c.json({ message: 'Widget not found' }, 404);
    }

    const widget = await prisma.dashboardWidget.update({
      where: { id: widgetId },
      data: {
        type: type ?? existing.type,
        title: title ?? existing.title,
        dataSource: dataSource ?? existing.dataSource,
        metric: metric ?? existing.metric,
        groupBy: groupBy !== undefined ? groupBy : existing.groupBy,
        filters: filters !== undefined ? filters : existing.filters,
        size: size ?? existing.size,
      },
    });

    return c.json({ widget });
  } catch (error: any) {
    console.error('Update widget error:', error);
    return c.json({ message: 'Failed to update widget' }, 500);
  }
});

// DELETE /dashboards/:id/widgets/:widgetId — remove widget
kpi.delete('/dashboards/:id/widgets/:widgetId', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { widgetId } = c.req.param();
    const existing = await prisma.dashboardWidget.findUnique({
      where: { id: widgetId },
      include: { dashboard: true },
    });
    if (!existing) return c.json({ message: 'Widget not found' }, 404);
    if (existing.dashboard.orgId !== (user.orgId || '') || !canManageDashboard(existing.dashboard, user)) {
      return c.json({ message: 'Widget not found' }, 404);
    }
    await prisma.dashboardWidget.delete({ where: { id: widgetId } });
    return c.json({ message: 'Widget deleted' });
  } catch (error: any) {
    console.error('Delete widget error:', error);
    return c.json({ message: 'Failed to delete widget' }, 500);
  }
});

// PUT /dashboards/:id/reorder — reorder widgets
kpi.put('/dashboards/:id/reorder', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { widgetIds } = body;

    if (!Array.isArray(widgetIds)) {
      return c.json({ message: 'widgetIds array is required' }, 400);
    }
    const dashboardForUser = await prisma.customDashboard.findFirst({ where: { id, orgId: user.orgId || '' } });
    if (!dashboardForUser) return c.json({ message: 'Dashboard not found' }, 404);
    if (!canManageDashboard(dashboardForUser, user)) {
      return c.json({ message: 'Only the creator or an admin can update this dashboard' }, 403);
    }

    // Update positions
    await Promise.all(
      widgetIds.map((wid: string, index: number) =>
        prisma.dashboardWidget.update({
          where: { id: wid },
          data: { position: index },
        })
      )
    );

    const dashboard = await prisma.customDashboard.findUnique({
      where: { id },
      include: { widgets: { orderBy: { position: 'asc' } } },
    });

    return c.json({ dashboard });
  } catch (error: any) {
    console.error('Reorder widgets error:', error);
    return c.json({ message: 'Failed to reorder widgets' }, 500);
  }
});

// ── Data Execution Engine ───────────────────────────────────────────────────

// GET /dashboards/:id/data — execute all widgets and return computed data
kpi.get('/dashboards/:id/data', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const dashboard = await prisma.customDashboard.findFirst({
      where: { id, orgId: user.orgId || '' },
      include: { widgets: { orderBy: { position: 'asc' } } },
    });
    if (!dashboard) return c.json({ message: 'Dashboard not found' }, 404);
    if (!canViewDashboard(dashboard, user)) {
      return c.json({ message: 'Dashboard not found' }, 404);
    }
    const accessibleProjectIds = await listAccessibleProjectIds(user.orgId);

    const widgetResults = await Promise.all(
      dashboard.widgets.map(async (widget) => {
        try {
          const data = await executeWidgetQuery(widget, {
            accessibleProjectIds,
            orgId: user.orgId,
          });
          return { widgetId: widget.id, data };
        } catch (err: any) {
          console.error(`Widget ${widget.id} query error:`, err);
          return { widgetId: widget.id, data: { labels: [], values: [], total: 0 } };
        }
      })
    );

    return c.json({ widgets: widgetResults });
  } catch (error: any) {
    console.error('Dashboard data error:', error);
    return c.json({ message: 'Failed to get dashboard data' }, 500);
  }
});

// ── Widget Query Executor ───────────────────────────────────────────────────

async function executeWidgetQuery(
  widget: any,
  {
    accessibleProjectIds,
    orgId,
  }: {
    accessibleProjectIds: string[];
    orgId: string | null;
  },
): Promise<{ labels: string[]; values: number[]; total?: number }> {
  const filters = (widget.filters || {}) as any;
  const projectId = filters.projectId as string | undefined;
  const dateRange = filters.dateRange;

  // Build date filter
  const dateFilter: any = {};
  if (dateRange) {
    if (dateRange.from) dateFilter.gte = new Date(dateRange.from);
    if (dateRange.to) dateFilter.lte = new Date(dateRange.to);
  }
  const hasDateFilter = Object.keys(dateFilter).length > 0;

  switch (widget.dataSource) {
    case 'requirements': {
      const where: any = {};
      applyProjectScope(where, projectId, accessibleProjectIds);
      if (hasDateFilter) where.createdAt = dateFilter;

      if (widget.metric === 'count' && widget.groupBy) {
        if (widget.groupBy === 'status') {
          const items = await prisma.requirement.findMany({ where, select: { status: true } });
          return groupAndCount(items, 'status');
        }
        if (widget.groupBy === 'month') {
          const items = await prisma.requirement.findMany({ where, select: { createdAt: true } });
          return groupByMonth(items);
        }
      }
      const total = await prisma.requirement.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'tests': {
      const where: any = {};
      applyProjectScope(where, projectId, accessibleProjectIds);
      if (hasDateFilter) where.createdAt = dateFilter;

      if (widget.metric === 'pass_rate') {
        const all = await prisma.test.findMany({ where, select: { status: true } });
        const total = all.length;
        const passed = all.filter((t) => t.status === 'Passed').length;
        const rate = total > 0 ? Math.round((passed / total) * 100) : 0;
        return { labels: ['Pass Rate'], values: [rate], total };
      }

      if (widget.metric === 'count' && widget.groupBy === 'status') {
        const items = await prisma.test.findMany({ where, select: { status: true } });
        return groupAndCount(items, 'status');
      }
      if (widget.metric === 'count' && widget.groupBy === 'month') {
        const items = await prisma.test.findMany({ where, select: { createdAt: true } });
        return groupByMonth(items);
      }
      const total = await prisma.test.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'capa': {
      const where: any = {};
      applyProjectScope(where, projectId, accessibleProjectIds);
      if (hasDateFilter) where.createdAt = dateFilter;

      if (widget.metric === 'overdue_count') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const overdueCount = await prisma.cAPA.count({
          where: {
            ...where,
            status: { notIn: ['resolved', 'closed'] },
            createdAt: { lt: thirtyDaysAgo },
          },
        });
        return { labels: ['Overdue'], values: [overdueCount], total: overdueCount };
      }

      if (widget.metric === 'count' && widget.groupBy === 'status') {
        const items = await prisma.cAPA.findMany({ where, select: { status: true } });
        return groupAndCount(items, 'status');
      }
      if (widget.metric === 'count' && widget.groupBy === 'month') {
        const items = await prisma.cAPA.findMany({ where, select: { createdAt: true } });
        return groupByMonth(items);
      }
      const total = await prisma.cAPA.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'deviations': {
      const where: any = {};
      applyProjectScope(where, projectId, accessibleProjectIds);
      if (hasDateFilter) where.createdAt = dateFilter;

      if (widget.metric === 'count' && widget.groupBy) {
        if (['classification', 'area', 'status'].includes(widget.groupBy)) {
          const items = await prisma.deviation.findMany({ where, select: { [widget.groupBy]: true } as any });
          return groupAndCount(items, widget.groupBy);
        }
        if (widget.groupBy === 'month') {
          const items = await prisma.deviation.findMany({ where, select: { createdAt: true } });
          return groupByMonth(items);
        }
      }
      const total = await prisma.deviation.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'complaints': {
      const where: any = {};
      applyProjectScope(where, projectId, accessibleProjectIds);
      if (hasDateFilter) where.createdAt = dateFilter;

      if (widget.metric === 'count' && widget.groupBy === 'severity') {
        const items = await prisma.complaint.findMany({ where, select: { severity: true } });
        return groupAndCount(items, 'severity');
      }
      if (widget.metric === 'count' && widget.groupBy === 'month') {
        const items = await prisma.complaint.findMany({ where, select: { createdAt: true } });
        return groupByMonth(items);
      }
      if (widget.metric === 'count' && widget.groupBy === 'status') {
        const items = await prisma.complaint.findMany({ where, select: { investigationStatus: true } });
        return groupAndCount(items, 'investigationStatus');
      }
      const total = await prisma.complaint.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'training': {
      const where: any = {};
      if (orgId) where.course = { orgId };
      if (hasDateFilter) where.assignedAt = dateFilter;

      if (widget.metric === 'compliance_pct') {
        const all = await prisma.trainingRecord.findMany({ where, select: { status: true } });
        const total = all.length;
        const completed = all.filter((t) => t.status === 'completed').length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { labels: ['Compliance %'], values: [pct], total };
      }

      if (widget.metric === 'count' && widget.groupBy === 'status') {
        const items = await prisma.trainingRecord.findMany({ where, select: { status: true } });
        return groupAndCount(items, 'status');
      }
      const total = await prisma.trainingRecord.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'suppliers': {
      const where: any = orgId ? { orgId } : { orgId: '__no-access__' };

      if (widget.metric === 'avg_score') {
        const result = await prisma.supplier.aggregate({
          where,
          _avg: { overallScore: true },
        });
        const avg = Math.round(result._avg.overallScore || 0);
        return { labels: ['Avg Score'], values: [avg], total: avg };
      }

      if (widget.metric === 'count' && widget.groupBy) {
        if (['category', 'riskLevel', 'qualificationStatus'].includes(widget.groupBy)) {
          const items = await prisma.supplier.findMany({ where, select: { [widget.groupBy]: true } as any });
          return groupAndCount(items, widget.groupBy);
        }
      }
      const total = await prisma.supplier.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'batches': {
      const where: any = {};
      applyProjectScope(where, projectId, accessibleProjectIds);
      if (hasDateFilter) where.createdAt = dateFilter;

      if (widget.metric === 'yield_avg') {
        const result = await prisma.batchRecord.aggregate({
          where,
          _avg: { yieldActual: true },
        });
        const avg = Math.round((result._avg.yieldActual || 0) * 100) / 100;
        return { labels: ['Avg Yield'], values: [avg], total: avg };
      }

      if (widget.metric === 'count' && widget.groupBy === 'status') {
        const items = await prisma.batchRecord.findMany({ where, select: { status: true } });
        return groupAndCount(items, 'status');
      }
      if (widget.metric === 'count' && widget.groupBy === 'product') {
        const items = await prisma.batchRecord.findMany({ where, select: { productName: true } });
        return groupAndCount(items, 'productName');
      }
      if (widget.metric === 'count' && widget.groupBy === 'month') {
        const items = await prisma.batchRecord.findMany({ where, select: { createdAt: true } });
        return groupByMonth(items);
      }
      const total = await prisma.batchRecord.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    case 'stability': {
      const where: any = {};
      applyProjectScope(where, projectId, accessibleProjectIds);

      if (widget.metric === 'oos_count') {
        const oosCount = await prisma.stabilitySample.count({
          where: {
            oosFlag: true,
            study: { projectId: where.projectId },
          },
        });
        return { labels: ['OOS Count'], values: [oosCount], total: oosCount };
      }

      if (widget.metric === 'count' && widget.groupBy === 'status') {
        const items = await prisma.stabilityStudy.findMany({ where, select: { status: true } });
        return groupAndCount(items, 'status');
      }
      const total = await prisma.stabilityStudy.count({ where });
      return { labels: ['Total'], values: [total], total };
    }

    default:
      return { labels: [], values: [], total: 0 };
  }
}

// ── Helper Functions ────────────────────────────────────────────────────────

function groupAndCount(items: any[], field: string): { labels: string[]; values: number[]; total: number } {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = String(item[field] || 'Unknown');
    counts[key] = (counts[key] || 0) + 1;
  }
  const labels = Object.keys(counts).sort();
  const values = labels.map((l) => counts[l]);
  return { labels, values, total: items.length };
}

function groupByMonth(items: { createdAt?: Date; assignedAt?: Date }[]): { labels: string[]; values: number[]; total: number } {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const date = (item as any).createdAt || (item as any).assignedAt;
    if (!date) continue;
    const d = new Date(date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  const labels = Object.keys(counts).sort();
  const values = labels.map((l) => counts[l]);
  return { labels, values, total: items.length };
}

export default kpi;
