import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const submissions = new Hono();

submissions.use('*', authMiddleware);

// ── Section templates per submission type ──────────────────────────────────

const SECTION_TEMPLATES: Record<string, string[]> = {
  fda_510k: [
    'Device Description',
    'Predicate Comparison',
    'Software Documentation',
    'V&V Summary',
    'Risk Analysis',
    'Biocompatibility',
    'Performance Testing',
    'Labeling',
  ],
  eu_mdr_td: [
    'Device Description',
    'Design & Manufacturing',
    'GSPR Checklist',
    'Benefit-Risk',
    'V&V',
    'Clinical Evaluation',
    'PMS Plan',
  ],
  pmda_sted: [
    'Device Description',
    'Design V&V',
    'Software Documentation',
    'Risk Management',
    'Clinical Evidence',
    'Labeling',
  ],
  ectd_module3: [
    'Drug Substance',
    'Drug Product',
    'Quality Overall Summary',
  ],
};

// Helper: generate section content from project data
async function generateSectionsFromProject(projectId: string, submissionType: string) {
  const sectionNames = SECTION_TEMPLATES[submissionType] || [];

  // Gather project data
  const [requirements, tests, risks, capas, evidences, complaints] = await Promise.all([
    prisma.requirement.findMany({ where: { projectId } }),
    prisma.test.findMany({ where: { projectId } }),
    prisma.risk.findMany({ where: { projectId } }),
    prisma.cAPA.findMany({ where: { projectId } }),
    prisma.evidence.findMany({ where: { projectId } }),
    prisma.complaint.findMany({ where: { projectId } }),
  ]);

  const totalReqs = requirements.length;
  const activeReqs = requirements.filter((r) => r.status === 'Active').length;
  const totalTests = tests.length;
  const passedTests = tests.filter((t) => t.status === 'Passed').length;
  const failedTests = tests.filter((t) => t.status === 'Failed').length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  const highRisks = risks.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical').length;
  const openCapas = capas.filter((c) => c.status === 'open').length;
  const evidenceCount = evidences.length;

  // Coverage: requirements that have at least one linked test
  const linkedReqIds = new Set(tests.flatMap((t) => t.linkedRequirementIds));
  const coveredReqs = requirements.filter((r) => linkedReqIds.has(r.id)).length;
  const coveragePct = totalReqs > 0 ? Math.round((coveredReqs / totalReqs) * 100) : 0;

  const sections = sectionNames.map((name) => {
    let content = '';

    switch (name) {
      case 'Device Description':
      case 'Drug Substance':
      case 'Drug Product':
        content = `Total Requirements: ${totalReqs} (${activeReqs} active)\nEvidence Attachments: ${evidenceCount}\nTraceability Coverage: ${coveragePct}%`;
        break;
      case 'Predicate Comparison':
      case 'Design & Manufacturing':
      case 'Design V&V':
        content = `Requirements: ${totalReqs}\nTests: ${totalTests} (${passedTests} passed, ${failedTests} failed)\nPass Rate: ${passRate}%`;
        break;
      case 'Software Documentation':
        content = `Total Requirements: ${totalReqs}\nActive: ${activeReqs}\nTraceability Coverage: ${coveragePct}%\nEvidence Count: ${evidenceCount}`;
        break;
      case 'V&V Summary':
      case 'V&V':
        content = `Total Tests: ${totalTests}\nPassed: ${passedTests}\nFailed: ${failedTests}\nPass Rate: ${passRate}%\nTraceability Coverage: ${coveragePct}%`;
        break;
      case 'Risk Analysis':
      case 'Risk Management':
      case 'Benefit-Risk':
        content = `Total Risk Assessments: ${risks.length}\nHigh/Critical Risks: ${highRisks}\nOpen CAPAs: ${openCapas}\nComplaints: ${complaints.length}`;
        break;
      case 'Biocompatibility':
      case 'Performance Testing':
      case 'Clinical Evidence':
      case 'Clinical Evaluation':
        content = `Evidence Count: ${evidenceCount}\nTest Results: ${passedTests}/${totalTests} passed\nComplaints: ${complaints.length}`;
        break;
      case 'Labeling':
        content = `Requirements with regulatory references: ${requirements.filter((r) => r.regulatoryRef).length}\nEvidence Count: ${evidenceCount}`;
        break;
      case 'GSPR Checklist':
        content = `Total Requirements: ${totalReqs}\nActive: ${activeReqs}\nCoverage: ${coveragePct}%\nRisk Assessments: ${risks.length}`;
        break;
      case 'PMS Plan':
        content = `Complaints: ${complaints.length}\nOpen CAPAs: ${openCapas}\nHigh/Critical Risks: ${highRisks}`;
        break;
      case 'Quality Overall Summary':
        content = `Requirements: ${totalReqs}\nTests: ${totalTests} (Pass Rate: ${passRate}%)\nRisks: ${risks.length} (${highRisks} high/critical)\nCAPAs: ${capas.length} (${openCapas} open)\nEvidence: ${evidenceCount}\nTraceability: ${coveragePct}%`;
        break;
      default:
        content = `Auto-generated section. Requirements: ${totalReqs}, Tests: ${totalTests}, Evidence: ${evidenceCount}`;
    }

    return { name, content, status: 'draft' as const };
  });

  return sections;
}

// List submissions by projectId
submissions.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const items = await prisma.submissionPackage.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });

    return c.json({ submissions: items });
  } catch (error: any) {
    console.error('List submissions error:', error);
    return c.json({ message: 'Failed to list submissions' }, 500);
  }
});

// Create submission package
submissions.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.type || !body.title || !body.targetAuthority) {
      return c.json({ message: 'projectId, type, title, and targetAuthority are required' }, 400);
    }

    const validTypes = ['fda_510k', 'eu_mdr_td', 'pmda_sted', 'ectd_module3'];
    if (!validTypes.includes(body.type)) {
      return c.json({ message: `type must be one of: ${validTypes.join(', ')}` }, 400);
    }

    const project = await findAccessibleProject(body.projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const sectionNames = SECTION_TEMPLATES[body.type] || [];
    const sections = sectionNames.map((name) => ({ name, content: '', status: 'draft' }));

    const item = await prisma.submissionPackage.create({
      data: {
        projectId: body.projectId,
        type: body.type,
        title: body.title,
        status: 'draft',
        targetAuthority: body.targetAuthority,
        sections: sections as any,
        createdBy: user.userId,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'submission',
      entityId: item.id,
      newValue: item,
    });

    return c.json({ submission: item }, 201);
  } catch (error: any) {
    console.error('Create submission error:', error);
    return c.json({ message: 'Failed to create submission' }, 500);
  }
});

// Get single submission
submissions.get('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const item = await prisma.submissionPackage.findUnique({ where: { id } });

    if (!item) return c.json({ message: 'Submission not found' }, 404);

    const project = await findAccessibleProject(item.projectId, user.orgId);
    if (!project) return c.json({ message: 'Submission not found' }, 404);

    return c.json({ submission: item });
  } catch (error: any) {
    console.error('Get submission error:', error);
    return c.json({ message: 'Failed to get submission' }, 500);
  }
});

// Update submission
submissions.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.submissionPackage.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Submission not found' }, 404);

    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Submission not found' }, 404);

    const item = await prisma.submissionPackage.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        status: body.status ?? existing.status,
        sections: body.sections ?? existing.sections,
        targetAuthority: body.targetAuthority ?? existing.targetAuthority,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'submission',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
    });

    return c.json({ submission: item });
  } catch (error: any) {
    console.error('Update submission error:', error);
    return c.json({ message: 'Failed to update submission' }, 500);
  }
});

// Delete submission
submissions.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.submissionPackage.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Submission not found' }, 404);

    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Submission not found' }, 404);

    await prisma.submissionPackage.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'submission',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Submission deleted' });
  } catch (error: any) {
    console.error('Delete submission error:', error);
    return c.json({ message: 'Failed to delete submission' }, 500);
  }
});

// Generate sections from project data
submissions.post('/:id/generate', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.submissionPackage.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Submission not found' }, 404);

    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Submission not found' }, 404);

    const sections = await generateSectionsFromProject(existing.projectId, existing.type);

    const item = await prisma.submissionPackage.update({
      where: { id },
      data: {
        sections: sections as any,
        generatedAt: new Date(),
        status: 'in_progress',
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'submission',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
      reason: 'Auto-generated sections from project data',
    });

    return c.json({ submission: item });
  } catch (error: any) {
    console.error('Generate submission sections error:', error);
    return c.json({ message: 'Failed to generate submission sections' }, 500);
  }
});

// Export as structured JSON
submissions.get('/:id/export', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const item = await prisma.submissionPackage.findUnique({ where: { id } });
    if (!item) return c.json({ message: 'Submission not found' }, 404);

    const project = await findAccessibleProject(item.projectId, user.orgId);
    if (!project) return c.json({ message: 'Submission not found' }, 404);

    const exportData = {
      id: item.id,
      type: item.type,
      title: item.title,
      status: item.status,
      targetAuthority: item.targetAuthority,
      sections: item.sections,
      generatedAt: item.generatedAt,
      submittedAt: item.submittedAt,
      projectName: project.name,
      exportedAt: new Date().toISOString(),
    };

    return c.json({ export: exportData });
  } catch (error: any) {
    console.error('Export submission error:', error);
    return c.json({ message: 'Failed to export submission' }, 500);
  }
});

// Mark as submitted
submissions.put('/:id/submit', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.submissionPackage.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Submission not found' }, 404);

    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Submission not found' }, 404);

    const item = await prisma.submissionPackage.update({
      where: { id },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'status_change',
      entityType: 'submission',
      entityId: item.id,
      previousValue: { status: existing.status },
      newValue: { status: 'submitted' },
    });

    return c.json({ submission: item });
  } catch (error: any) {
    console.error('Submit submission error:', error);
    return c.json({ message: 'Failed to submit submission' }, 500);
  }
});

export default submissions;
