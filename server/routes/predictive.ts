import { Hono } from 'hono';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser } from '../middleware/auth.js';

const predictive = new Hono();
predictive.use('*', authMiddleware);

// ── Helper: statistics ──────────────────────────────────────────────────────

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function linearSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const xMean = (n - 1) / 2;
  const yMean = mean(values);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

async function ensureAccessibleProject(projectId: string, orgId: string | null) {
  return findAccessibleProject(projectId, orgId);
}

// ── GET /:projectId/failure-risk ────────────────────────────────────────────

predictive.get('/:projectId/failure-risk', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const project = await ensureAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const [requirements, tests] = await Promise.all([
      prisma.requirement.findMany({
        where: { projectId },
        select: {
          id: true, seqId: true, title: true, description: true,
          status: true, tags: true, riskLevel: true,
        },
      }),
      prisma.test.findMany({
        where: { projectId },
        select: { id: true, status: true, linkedRequirementIds: true },
      }),
    ]);

    // Find requirements that have failed tests (for similarity comparison)
    const failedTestReqIds = new Set<string>();
    const failedReqTags: string[][] = [];
    for (const t of tests) {
      if (t.status === 'Failed') {
        for (const rid of t.linkedRequirementIds) {
          failedTestReqIds.add(rid);
        }
      }
    }

    for (const req of requirements) {
      if (failedTestReqIds.has(req.id)) {
        failedReqTags.push(req.tags);
      }
    }

    // Build coverage map
    const coveredReqIds = new Set<string>();
    for (const t of tests) {
      for (const rid of t.linkedRequirementIds) {
        coveredReqIds.add(rid);
      }
    }

    const predictions = requirements.map((req) => {
      let score = 0;

      // Complexity factor: description length + tag count (max 25)
      const descLen = (req.description || '').length;
      const complexityScore = Math.min(25, (descLen / 500) * 15 + req.tags.length * 2);
      score += complexityScore;

      // Risk level factor (max 25)
      const riskMap: Record<string, number> = { critical: 25, high: 18, medium: 10, low: 3 };
      score += riskMap[req.riskLevel || 'medium'] || 10;

      // No linked tests factor (max 20)
      if (!coveredReqIds.has(req.id)) {
        score += 20;
      }

      // Similarity to previously failed requirements (max 30)
      let maxSimilarity = 0;
      for (const failedTags of failedReqTags) {
        const sim = jaccardSimilarity(req.tags, failedTags);
        if (sim > maxSimilarity) maxSimilarity = sim;
      }
      score += maxSimilarity * 30;

      return {
        requirementId: req.id,
        seqId: req.seqId,
        title: req.title,
        riskLevel: req.riskLevel || 'medium',
        riskScore: Math.min(100, Math.round(score)),
        factors: {
          complexity: Math.round(complexityScore),
          riskLevel: riskMap[req.riskLevel || 'medium'] || 10,
          noCoverage: !coveredReqIds.has(req.id),
          similarityToFailed: Math.round(maxSimilarity * 100) / 100,
        },
      };
    });

    predictions.sort((a, b) => b.riskScore - a.riskScore);

    return c.json({ predictions });
  } catch (error: any) {
    console.error('Failure risk error:', error);
    return c.json({ message: 'Failed to compute failure risk' }, 500);
  }
});

// ── GET /:projectId/supplier-risk ───────────────────────────────────────────

predictive.get('/:projectId/supplier-risk', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const project = await ensureAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    if (!user.orgId) return c.json({ predictions: [] });

    const suppliers = await prisma.supplier.findMany({
      where: { orgId: user.orgId },
      include: {
        audits: {
          where: { status: 'completed' },
          orderBy: { auditDate: 'asc' },
        },
      },
    });

    const predictions = suppliers.map((supplier) => {
      const auditScores = supplier.audits
        .filter((a) => a.score !== null)
        .map((a) => a.score as number);

      // Audit trend: negative slope = declining (max 30)
      const auditSlope = auditScores.length >= 2 ? linearSlope(auditScores) : 0;
      const auditTrendScore = Math.min(30, Math.max(0, -auditSlope * 3));

      // Defect rate (max 30)
      const defectRate = supplier.defectRate ?? 0;
      const defectScore = Math.min(30, defectRate * 30);

      // Overdue audits (max 20)
      const now = new Date();
      const isOverdue = supplier.nextAuditDate && supplier.nextAuditDate < now;
      const overdueScore = isOverdue ? 20 : 0;

      // Open actions placeholder (max 20) - based on qualification status
      const statusMap: Record<string, number> = {
        disqualified: 20, conditional: 12, pending: 8, qualified: 0,
      };
      const actionScore = statusMap[supplier.qualificationStatus] || 0;

      const totalScore = Math.min(100, Math.round(
        auditTrendScore + defectScore + overdueScore + actionScore
      ));

      return {
        supplierId: supplier.id,
        name: supplier.name,
        category: supplier.category,
        riskScore: totalScore,
        qualificationStatus: supplier.qualificationStatus,
        factors: {
          auditTrend: Math.round(auditTrendScore),
          defectRate: Math.round(defectScore),
          overdueAudit: overdueScore,
          openActions: actionScore,
        },
      };
    });

    predictions.sort((a, b) => b.riskScore - a.riskScore);

    return c.json({ predictions });
  } catch (error: any) {
    console.error('Supplier risk error:', error);
    return c.json({ message: 'Failed to compute supplier risk' }, 500);
  }
});

// ── GET /:projectId/capa-recurrence ─────────────────────────────────────────

predictive.get('/:projectId/capa-recurrence', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const project = await ensureAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const capas = await prisma.cAPA.findMany({
      where: {
        projectId,
        status: 'closed',
        createdAt: { gte: sixMonthsAgo },
      },
      select: { id: true, rootCause: true, title: true, createdAt: true },
    });

    // Group by root cause
    const rootCauseGroups: Record<string, { count: number; capas: typeof capas }> = {};
    for (const capa of capas) {
      const cause = capa.rootCause || 'Unknown';
      if (!rootCauseGroups[cause]) rootCauseGroups[cause] = { count: 0, capas: [] };
      rootCauseGroups[cause].count++;
      rootCauseGroups[cause].capas.push(capa);
    }

    // Flag categories with >2 CAPAs in 6 months
    const patterns = Object.entries(rootCauseGroups)
      .filter(([, group]) => group.count > 2)
      .map(([rootCause, group]) => ({
        rootCause,
        frequency: group.count,
        severity: group.count > 5 ? 'high' : group.count > 3 ? 'medium' : 'low',
        recentCapas: group.capas.map((c) => ({
          id: c.id,
          title: c.title,
          createdAt: c.createdAt.toISOString(),
        })),
      }))
      .sort((a, b) => b.frequency - a.frequency);

    return c.json({ patterns });
  } catch (error: any) {
    console.error('CAPA recurrence error:', error);
    return c.json({ message: 'Failed to compute CAPA recurrence' }, 500);
  }
});

// ── GET /:projectId/process-trend ───────────────────────────────────────────

predictive.get('/:projectId/process-trend', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const project = await ensureAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const batches = await prisma.batchRecord.findMany({
      where: { projectId, yieldActual: { not: null } },
      select: { productName: true, batchNumber: true, yieldActual: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by product
    const productBatches: Record<string, { yields: number[]; batchNumbers: string[] }> = {};
    for (const batch of batches) {
      if (!productBatches[batch.productName]) {
        productBatches[batch.productName] = { yields: [], batchNumbers: [] };
      }
      productBatches[batch.productName].yields.push(batch.yieldActual as number);
      productBatches[batch.productName].batchNumbers.push(batch.batchNumber);
    }

    const predictions = Object.entries(productBatches).map(([product, data]) => {
      // Take last 10 batches for trend
      const recentYields = data.yields.slice(-10);
      const slope = linearSlope(recentYields);
      const avgYield = mean(recentYields);
      const lastYield = recentYields[recentYields.length - 1] || 0;

      // Project yield 5 batches ahead
      const projectedYield = lastYield + slope * 5;

      return {
        product,
        batchCount: data.yields.length,
        averageYield: Math.round(avgYield * 10) / 10,
        lastYield: Math.round(lastYield * 10) / 10,
        slopePerBatch: Math.round(slope * 100) / 100,
        projectedYield: Math.round(projectedYield * 10) / 10,
        trend: slope > 0.1 ? 'improving' : slope < -0.1 ? 'declining' : 'stable',
        alert: slope < -0.5 ? 'warning' : slope < -1 ? 'critical' : null,
      };
    });

    predictions.sort((a, b) => a.slopePerBatch - b.slopePerBatch);

    return c.json({ predictions });
  } catch (error: any) {
    console.error('Process trend error:', error);
    return c.json({ message: 'Failed to compute process trends' }, 500);
  }
});

// ── GET /:projectId/training-gap ────────────────────────────────────────────

predictive.get('/:projectId/training-gap', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const project = await ensureAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    if (!user.orgId) return c.json({ predictions: { expiringUsers: [], lowCompletionRoles: [], highFailureCourses: [] } });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Users with expiring training (<30 days)
    const expiringRecords = await prisma.trainingRecord.findMany({
      where: {
        status: 'completed',
        validUntil: { lte: thirtyDaysFromNow, gte: new Date() },
      },
      include: { course: { select: { title: true } } },
    });

    // Get user info for expiring records
    const expiringUserIds = [...new Set(expiringRecords.map((r) => r.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: expiringUserIds } },
      select: { id: true, name: true, role: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const expiringUsers = expiringRecords.map((r) => ({
      userId: r.userId,
      userName: userMap.get(r.userId)?.name || 'Unknown',
      userRole: userMap.get(r.userId)?.role || 'unknown',
      courseName: r.course.title,
      validUntil: r.validUntil?.toISOString() || null,
      daysRemaining: r.validUntil
        ? Math.ceil((r.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
    }));

    // Roles with low completion rates
    const allPlans = await prisma.trainingPlan.findMany({
      where: { orgId: user.orgId },
      select: { role: true, courses: true },
    });

    const allRecords = await prisma.trainingRecord.findMany({
      select: { userId: true, courseId: true, status: true },
    });

    const orgUsers = await prisma.user.findMany({
      where: { orgId: user.orgId },
      select: { id: true, role: true },
    });

    const roleCompletionMap: Record<string, { total: number; completed: number }> = {};
    for (const plan of allPlans) {
      const roleUsers = orgUsers.filter((u) => u.role === plan.role);
      const totalAssignments = roleUsers.length * plan.courses.length;
      if (totalAssignments === 0) continue;

      let completed = 0;
      for (const u of roleUsers) {
        for (const courseId of plan.courses) {
          const rec = allRecords.find((r) => r.userId === u.id && r.courseId === courseId && r.status === 'completed');
          if (rec) completed++;
        }
      }

      if (!roleCompletionMap[plan.role]) {
        roleCompletionMap[plan.role] = { total: 0, completed: 0 };
      }
      roleCompletionMap[plan.role].total += totalAssignments;
      roleCompletionMap[plan.role].completed += completed;
    }

    const lowCompletionRoles = Object.entries(roleCompletionMap)
      .map(([role, data]) => ({
        role,
        completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
        totalAssignments: data.total,
        completed: data.completed,
      }))
      .filter((r) => r.completionRate < 80)
      .sort((a, b) => a.completionRate - b.completionRate);

    // Courses with high failure rates
    const courses = await prisma.course.findMany({
      where: { orgId: user.orgId },
      include: { records: true },
    });

    const highFailureCourses = courses
      .map((course) => {
        const completedRecords = course.records.filter((r) => r.status === 'completed');
        const failedRecords = course.records.filter(
          (r) => r.status === 'completed' && r.score !== null && r.score < 70
        );
        return {
          courseId: course.id,
          courseName: course.title,
          totalAttempts: completedRecords.length,
          failedAttempts: failedRecords.length,
          failureRate: completedRecords.length > 0
            ? Math.round((failedRecords.length / completedRecords.length) * 100)
            : 0,
        };
      })
      .filter((c) => c.failureRate > 20 && c.totalAttempts >= 3)
      .sort((a, b) => b.failureRate - a.failureRate);

    return c.json({
      predictions: {
        expiringUsers: expiringUsers.sort((a, b) => (a.daysRemaining || 999) - (b.daysRemaining || 999)),
        lowCompletionRoles,
        highFailureCourses,
      },
    });
  } catch (error: any) {
    console.error('Training gap error:', error);
    return c.json({ message: 'Failed to compute training gaps' }, 500);
  }
});

export default predictive;
