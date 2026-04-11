import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const scheduledReports = new Hono();

scheduledReports.use('*', authMiddleware);

const VALID_REPORT_TYPES = [
  'validation_summary',
  'executive_brief',
  'gap_analysis',
  'risk_assessment',
  'traceability',
];

function cronToHuman(cron: string): string {
  const parts = cron.split(' ');
  if (parts.length !== 5) return cron;
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Daily at ${hour}:${minute.padStart(2, '0')}`;
  }
  if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[parseInt(dayOfWeek, 10)] || dayOfWeek;
    return `Weekly on ${dayName} at ${hour}:${minute.padStart(2, '0')}`;
  }
  if (dayOfMonth !== '*' && month === '*') {
    return `Monthly on day ${dayOfMonth} at ${hour}:${minute.padStart(2, '0')}`;
  }
  return cron;
}

// List scheduled reports by orgId
scheduledReports.get('/', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ message: 'Organization membership required' }, 403);
    }

    const items = await prisma.scheduledReport.findMany({
      where: { orgId: user.orgId },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = items.map((item) => ({
      ...item,
      scheduleHuman: cronToHuman(item.schedule),
    }));

    return c.json({ scheduledReports: enriched });
  } catch (error: any) {
    console.error('List scheduled reports error:', error);
    return c.json({ message: 'Failed to list scheduled reports' }, 500);
  }
});

// Create scheduled report
scheduledReports.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ message: 'Organization membership required' }, 403);
    }

    const body = await c.req.json();

    if (!body.projectId || !body.reportType || !body.schedule) {
      return c.json({ message: 'projectId, reportType, and schedule are required' }, 400);
    }

    if (!VALID_REPORT_TYPES.includes(body.reportType)) {
      return c.json({ message: `reportType must be one of: ${VALID_REPORT_TYPES.join(', ')}` }, 400);
    }

    const item = await prisma.scheduledReport.create({
      data: {
        orgId: user.orgId,
        projectId: body.projectId,
        reportType: body.reportType,
        schedule: body.schedule,
        recipients: body.recipients ?? [],
        format: body.format ?? 'html',
        enabled: body.enabled ?? true,
        createdBy: user.userId,
      },
    });

    return c.json({ scheduledReport: item }, 201);
  } catch (error: any) {
    console.error('Create scheduled report error:', error);
    return c.json({ message: 'Failed to create scheduled report' }, 500);
  }
});

// Update scheduled report
scheduledReports.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.scheduledReport.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Scheduled report not found' }, 404);

    if (existing.orgId !== user.orgId) {
      return c.json({ message: 'Scheduled report not found' }, 404);
    }

    const item = await prisma.scheduledReport.update({
      where: { id },
      data: {
        reportType: body.reportType ?? existing.reportType,
        schedule: body.schedule ?? existing.schedule,
        recipients: body.recipients ?? existing.recipients,
        format: body.format ?? existing.format,
        enabled: body.enabled !== undefined ? body.enabled : existing.enabled,
      },
    });

    return c.json({ scheduledReport: item });
  } catch (error: any) {
    console.error('Update scheduled report error:', error);
    return c.json({ message: 'Failed to update scheduled report' }, 500);
  }
});

// Delete scheduled report
scheduledReports.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.scheduledReport.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Scheduled report not found' }, 404);

    if (existing.orgId !== user.orgId) {
      return c.json({ message: 'Scheduled report not found' }, 404);
    }

    await prisma.scheduledReport.delete({ where: { id } });

    return c.json({ message: 'Scheduled report deleted' });
  } catch (error: any) {
    console.error('Delete scheduled report error:', error);
    return c.json({ message: 'Failed to delete scheduled report' }, 500);
  }
});

// Run now — execute immediately and return report data
scheduledReports.post('/:id/run-now', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.scheduledReport.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Scheduled report not found' }, 404);

    if (existing.orgId !== user.orgId) {
      return c.json({ message: 'Scheduled report not found' }, 404);
    }

    // Gather project data for the report
    const [requirements, tests, risks, capas] = await Promise.all([
      prisma.requirement.findMany({ where: { projectId: existing.projectId } }),
      prisma.test.findMany({ where: { projectId: existing.projectId } }),
      prisma.risk.findMany({ where: { projectId: existing.projectId } }),
      prisma.cAPA.findMany({ where: { projectId: existing.projectId } }),
    ]);

    const totalReqs = requirements.length;
    const totalTests = tests.length;
    const passedTests = tests.filter((t) => t.status === 'Passed').length;
    const failedTests = tests.filter((t) => t.status === 'Failed').length;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    const linkedReqIds = new Set(tests.flatMap((t) => t.linkedRequirementIds));
    const coveredReqs = requirements.filter((r) => linkedReqIds.has(r.id)).length;
    const coveragePct = totalReqs > 0 ? Math.round((coveredReqs / totalReqs) * 100) : 0;
    const highRisks = risks.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical').length;
    const openCapas = capas.filter((ca) => ca.status === 'open').length;

    const reportData: Record<string, any> = {
      reportType: existing.reportType,
      generatedAt: new Date().toISOString(),
      projectId: existing.projectId,
      summary: {
        totalRequirements: totalReqs,
        totalTests,
        passedTests,
        failedTests,
        passRate,
        traceabilityCoverage: coveragePct,
        totalRisks: risks.length,
        highCriticalRisks: highRisks,
        totalCapas: capas.length,
        openCapas,
      },
    };

    // Update last run info
    await prisma.scheduledReport.update({
      where: { id },
      data: {
        lastRunAt: new Date(),
        lastStatus: 'success',
      },
    });

    return c.json({ report: reportData });
  } catch (error: any) {
    console.error('Run scheduled report error:', error);

    // Mark as failed
    try {
      const { id } = c.req.param();
      await prisma.scheduledReport.update({
        where: { id },
        data: { lastRunAt: new Date(), lastStatus: 'failed' },
      });
    } catch (_) { /* ignore */ }

    return c.json({ message: 'Failed to run report' }, 500);
  }
});

// History — list past runs (simplified: return lastRunAt/lastStatus since we don't store run history separately)
scheduledReports.get('/:id/history', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.scheduledReport.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Scheduled report not found' }, 404);

    if (existing.orgId !== user.orgId) {
      return c.json({ message: 'Scheduled report not found' }, 404);
    }

    // Return last run info as a single-entry history
    const history = existing.lastRunAt
      ? [{ runAt: existing.lastRunAt, status: existing.lastStatus ?? 'unknown' }]
      : [];

    return c.json({ history });
  } catch (error: any) {
    console.error('Get report history error:', error);
    return c.json({ message: 'Failed to get report history' }, 500);
  }
});

export default scheduledReports;
