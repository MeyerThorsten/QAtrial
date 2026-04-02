import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';

const dashboard = new Hono();

dashboard.use('*', authMiddleware);

// ── Compliance Readiness Score ──────────────────────────────────────────────

dashboard.get('/:projectId/readiness', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const requirements = await prisma.requirement.findMany({
      where: { projectId },
    });

    const tests = await prisma.test.findMany({
      where: { projectId },
    });

    const links = await prisma.requirementTestLink.findMany({
      where: { projectId },
    });

    const signatures = await prisma.signature.findMany({
      where: { projectId },
    });

    const totalReqs = requirements.length;
    const totalTests = tests.length;

    // 1. Requirement Coverage (25%) — reqs with Active or Closed status
    const activeOrClosed = requirements.filter(
      (r: any) => r.status === 'Active' || r.status === 'Closed',
    ).length;
    const reqCoverage = totalReqs > 0 ? Math.round((activeOrClosed / totalReqs) * 100) : 0;

    // 2. Test Coverage (25%) — reqs that have at least one linked test
    const reqIdsWithTests = new Set(links.map((l: any) => l.requirementId));
    const testCoverage = totalReqs > 0 ? Math.round((reqIdsWithTests.size / totalReqs) * 100) : 0;

    // 3. Test Pass Rate (20%)
    const passedTests = tests.filter((t: any) => t.status === 'Passed').length;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // 4. Risk Assessed (15%)
    const assessedReqs = requirements.filter((r: any) => r.riskLevel != null && r.riskLevel !== '').length;
    const riskAssessed = totalReqs > 0 ? Math.round((assessedReqs / totalReqs) * 100) : 0;

    // 5. Signature Completeness (15%) — reqs that have at least one approval signature
    const reqIdsWithSigs = new Set(
      signatures
        .filter((s: any) => s.entityType === 'requirement' && s.meaning === 'approved')
        .map((s: any) => s.entityId),
    );
    const signatureCompleteness = totalReqs > 0
      ? Math.round((reqIdsWithSigs.size / totalReqs) * 100)
      : 0;

    // Weighted score
    const weighted =
      reqCoverage * 0.25 +
      testCoverage * 0.25 +
      passRate * 0.20 +
      riskAssessed * 0.15 +
      signatureCompleteness * 0.15;

    let overallScore = Math.round(weighted);

    // Critical risk penalty
    const hasCritical = requirements.some((r: any) => r.riskLevel === 'critical');
    if (hasCritical && overallScore > 0) {
      overallScore = Math.max(0, overallScore - 10);
    }

    return c.json({
      overallScore,
      hasCriticalRisk: hasCritical,
      metrics: {
        reqCoverage: { value: reqCoverage, weight: 0.25 },
        testCoverage: { value: testCoverage, weight: 0.25 },
        passRate: { value: passRate, weight: 0.20 },
        riskAssessed: { value: riskAssessed, weight: 0.15 },
        signatureCompleteness: { value: signatureCompleteness, weight: 0.15 },
      },
      totals: {
        requirements: totalReqs,
        tests: totalTests,
        passedTests,
        signatures: signatures.length,
      },
    });
  } catch (error: any) {
    console.error('Readiness error:', error);
    return c.json({ message: 'Failed to compute readiness' }, 500);
  }
});

// ── Missing Evidence ────────────────────────────────────────────────────────

dashboard.get('/:projectId/missing-evidence', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const requirements = await prisma.requirement.findMany({
      where: { projectId },
      select: { id: true, title: true, status: true },
    });

    const tests = await prisma.test.findMany({
      where: { projectId },
      select: { id: true, title: true, status: true },
    });

    const evidence = await prisma.evidence.findMany({
      where: { projectId },
      select: { entityType: true, entityId: true },
    });

    const evidenceEntityIds = new Set(
      evidence.map((e: any) => `${e.entityType}:${e.entityId}`),
    );

    const missingReqs = requirements
      .filter((r: any) => !evidenceEntityIds.has(`requirement:${r.id}`))
      .map((r: any) => ({ type: 'requirement', id: r.id, title: r.title, status: r.status }));

    const missingTests = tests
      .filter((t: any) => !evidenceEntityIds.has(`test:${t.id}`))
      .map((t: any) => ({ type: 'test', id: t.id, title: t.title, status: t.status }));

    return c.json({
      missing: [...missingReqs, ...missingTests],
      summary: {
        totalRequirements: requirements.length,
        totalTests: tests.length,
        missingRequirements: missingReqs.length,
        missingTests: missingTests.length,
      },
    });
  } catch (error: any) {
    console.error('Missing evidence error:', error);
    return c.json({ message: 'Failed to compute missing evidence' }, 500);
  }
});

// ── Approval Status ─────────────────────────────────────────────────────────

dashboard.get('/:projectId/approval-status', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const approvals = await prisma.approval.findMany({
      where: { projectId },
    });

    // Group by entity type, then by status
    const grouped: Record<string, Record<string, number>> = {};

    for (const a of approvals as any[]) {
      const et = a.entityType || 'unknown';
      if (!grouped[et]) {
        grouped[et] = { pending: 0, approved: 0, rejected: 0 };
      }
      const status = (a.status || 'pending').toLowerCase();
      if (status in grouped[et]) {
        grouped[et][status]++;
      } else {
        grouped[et][status] = 1;
      }
    }

    // Totals
    const totals = { pending: 0, approved: 0, rejected: 0 };
    for (const a of approvals as any[]) {
      const status = (a.status || 'pending').toLowerCase();
      if (status in totals) {
        (totals as any)[status]++;
      }
    }

    return c.json({
      byEntityType: grouped,
      totals,
      total: approvals.length,
    });
  } catch (error: any) {
    console.error('Approval status error:', error);
    return c.json({ message: 'Failed to compute approval status' }, 500);
  }
});

// ── CAPA Aging ──────────────────────────────────────────────────────────────

dashboard.get('/:projectId/capa-aging', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const capas = await prisma.capa.findMany({
      where: {
        projectId,
        status: { not: 'resolved' },
      },
      orderBy: { createdAt: 'asc' },
    });

    const now = Date.now();
    const buckets = { '0-7d': 0, '7-30d': 0, '30-90d': 0, '90d+': 0 };

    const items = (capas as any[]).map((capa) => {
      const ageMs = now - new Date(capa.createdAt).getTime();
      const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

      let bucket: keyof typeof buckets;
      if (ageDays <= 7) bucket = '0-7d';
      else if (ageDays <= 30) bucket = '7-30d';
      else if (ageDays <= 90) bucket = '30-90d';
      else bucket = '90d+';

      buckets[bucket]++;

      return {
        id: capa.id,
        title: capa.title,
        status: capa.status,
        ageDays,
        bucket,
        createdAt: capa.createdAt,
      };
    });

    return c.json({
      items,
      buckets,
      totalOpen: capas.length,
    });
  } catch (error: any) {
    console.error('CAPA aging error:', error);
    return c.json({ message: 'Failed to compute CAPA aging' }, 500);
  }
});

// ── Risk Summary ────────────────────────────────────────────────────────────

dashboard.get('/:projectId/risk-summary', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const requirements = await prisma.requirement.findMany({
      where: { projectId },
      select: { id: true, title: true, riskLevel: true, riskScore: true, severity: true, likelihood: true },
    });

    const counts: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      unassessed: 0,
    };

    const matrix: Record<string, any[]> = {};

    for (const req of requirements as any[]) {
      const level = req.riskLevel?.toLowerCase() || 'unassessed';
      if (level in counts) {
        counts[level]++;
      } else {
        counts['unassessed']++;
      }

      // Build matrix data (severity x likelihood)
      if (req.severity != null && req.likelihood != null) {
        const key = `${req.severity}-${req.likelihood}`;
        if (!matrix[key]) matrix[key] = [];
        matrix[key].push({ id: req.id, title: req.title, riskLevel: req.riskLevel });
      }
    }

    return c.json({
      counts,
      total: requirements.length,
      matrix,
    });
  } catch (error: any) {
    console.error('Risk summary error:', error);
    return c.json({ message: 'Failed to compute risk summary' }, 500);
  }
});

export default dashboard;
