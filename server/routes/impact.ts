import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const impact = new Hono();

impact.use('*', authMiddleware);

interface GraphNode {
  id: string;
  type: string;
  label: string;
  status?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

// Get impact chain for a requirement
impact.get('/requirement/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const requirement = await prisma.requirement.findUnique({ where: { id } });
    if (!requirement) {
      return c.json({ message: 'Requirement not found' }, 404);
    }

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Add the requirement as root node
    nodes.push({
      id: requirement.id,
      type: 'requirement',
      label: `${requirement.seqId}: ${requirement.title}`,
      status: requirement.status,
    });

    // Find linked tests
    const tests = await prisma.test.findMany({
      where: {
        projectId: requirement.projectId,
        linkedRequirementIds: { has: requirement.id },
      },
    });
    for (const test of tests) {
      nodes.push({ id: test.id, type: 'test', label: `${test.seqId}: ${test.title}`, status: test.status });
      edges.push({ source: requirement.id, target: test.id, relationship: 'verified_by' });
    }

    // Find linked risks
    const risks = await prisma.risk.findMany({
      where: { requirementId: requirement.id, projectId: requirement.projectId },
    });
    for (const risk of risks) {
      nodes.push({ id: risk.id, type: 'risk', label: `Risk: ${risk.riskLevel} (${risk.riskScore})`, status: risk.riskLevel });
      edges.push({ source: requirement.id, target: risk.id, relationship: 'risk_assessed_by' });
    }

    // Find linked CAPAs (by linkedTestId matching any test)
    const testIds = tests.map((t) => t.id);
    if (testIds.length > 0) {
      const capas = await prisma.cAPA.findMany({
        where: { projectId: requirement.projectId, linkedTestId: { in: testIds } },
      });
      for (const capa of capas) {
        nodes.push({ id: capa.id, type: 'capa', label: `CAPA: ${capa.title}`, status: capa.status });
        edges.push({ source: capa.linkedTestId!, target: capa.id, relationship: 'capa_from' });
      }
    }

    // Find linked evidence
    const evidence = await prisma.evidence.findMany({
      where: { projectId: requirement.projectId, entityType: 'requirement', entityId: requirement.id },
    });
    for (const ev of evidence) {
      nodes.push({ id: ev.id, type: 'evidence', label: `Evidence: ${ev.fileName}` });
      edges.push({ source: requirement.id, target: ev.id, relationship: 'evidenced_by' });
    }

    // Find linked approvals
    const approvals = await prisma.approval.findMany({
      where: { projectId: requirement.projectId, entityType: 'requirement', entityId: requirement.id },
    });
    for (const appr of approvals) {
      nodes.push({ id: appr.id, type: 'approval', label: `Approval: ${appr.status}`, status: appr.status });
      edges.push({ source: requirement.id, target: appr.id, relationship: 'approved_by' });
    }

    return c.json({ nodes, edges });
  } catch (error: any) {
    console.error('Impact analysis (requirement) error:', error);
    return c.json({ message: 'Failed to get impact analysis' }, 500);
  }
});

// Get impact chain for a test
impact.get('/test/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const test = await prisma.test.findUnique({ where: { id } });
    if (!test) {
      return c.json({ message: 'Test not found' }, 404);
    }

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    nodes.push({ id: test.id, type: 'test', label: `${test.seqId}: ${test.title}`, status: test.status });

    // Find linked requirements
    if (test.linkedRequirementIds.length > 0) {
      const requirements = await prisma.requirement.findMany({
        where: { id: { in: test.linkedRequirementIds } },
      });
      for (const req of requirements) {
        nodes.push({ id: req.id, type: 'requirement', label: `${req.seqId}: ${req.title}`, status: req.status });
        edges.push({ source: req.id, target: test.id, relationship: 'verified_by' });
      }
    }

    // Find linked CAPAs
    const capas = await prisma.cAPA.findMany({
      where: { projectId: test.projectId, linkedTestId: test.id },
    });
    for (const capa of capas) {
      nodes.push({ id: capa.id, type: 'capa', label: `CAPA: ${capa.title}`, status: capa.status });
      edges.push({ source: test.id, target: capa.id, relationship: 'capa_from' });
    }

    // Find evidence for this test
    const evidence = await prisma.evidence.findMany({
      where: { projectId: test.projectId, entityType: 'test', entityId: test.id },
    });
    for (const ev of evidence) {
      nodes.push({ id: ev.id, type: 'evidence', label: `Evidence: ${ev.fileName}` });
      edges.push({ source: test.id, target: ev.id, relationship: 'evidenced_by' });
    }

    return c.json({ nodes, edges });
  } catch (error: any) {
    console.error('Impact analysis (test) error:', error);
    return c.json({ message: 'Failed to get impact analysis' }, 500);
  }
});

// "What if" analysis for a requirement change
impact.get('/whatif/requirement/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const requirement = await prisma.requirement.findUnique({ where: { id } });
    if (!requirement) {
      return c.json({ message: 'Requirement not found' }, 404);
    }

    // Find all tests linked to this requirement
    const affectedTests = await prisma.test.findMany({
      where: {
        projectId: requirement.projectId,
        linkedRequirementIds: { has: requirement.id },
      },
    });

    // Find risks linked to this requirement
    const affectedRisks = await prisma.risk.findMany({
      where: { requirementId: requirement.id, projectId: requirement.projectId },
    });

    // Find CAPAs linked through affected tests
    const testIds = affectedTests.map((t) => t.id);
    const affectedCapas = testIds.length > 0
      ? await prisma.cAPA.findMany({
          where: { projectId: requirement.projectId, linkedTestId: { in: testIds } },
        })
      : [];

    // Find approvals for this requirement
    const affectedApprovals = await prisma.approval.findMany({
      where: { projectId: requirement.projectId, entityType: 'requirement', entityId: requirement.id },
    });

    // Find evidence for this requirement
    const affectedEvidence = await prisma.evidence.findMany({
      where: { projectId: requirement.projectId, entityType: 'requirement', entityId: requirement.id },
    });

    return c.json({
      requirement: { id: requirement.id, seqId: requirement.seqId, title: requirement.title },
      impact: {
        testsAffected: affectedTests.map((t) => ({ id: t.id, seqId: t.seqId, title: t.title, status: t.status })),
        risksAffected: affectedRisks.map((r) => ({ id: r.id, riskLevel: r.riskLevel, riskScore: r.riskScore })),
        capasAffected: affectedCapas.map((ca) => ({ id: ca.id, title: ca.title, status: ca.status })),
        approvalsAffected: affectedApprovals.map((a) => ({ id: a.id, status: a.status })),
        evidenceAffected: affectedEvidence.map((e) => ({ id: e.id, fileName: e.fileName })),
        summary: {
          totalAffected: affectedTests.length + affectedRisks.length + affectedCapas.length + affectedApprovals.length + affectedEvidence.length,
          testsCount: affectedTests.length,
          risksCount: affectedRisks.length,
          capasCount: affectedCapas.length,
          approvalsCount: affectedApprovals.length,
          evidenceCount: affectedEvidence.length,
          revalidationNeeded: affectedApprovals.some((a) => a.status === 'approved'),
          retestingNeeded: affectedTests.some((t) => t.status === 'Passed'),
        },
      },
    });
  } catch (error: any) {
    console.error('What-if analysis error:', error);
    return c.json({ message: 'Failed to perform what-if analysis' }, 500);
  }
});

export default impact;
