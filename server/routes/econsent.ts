import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const econsent = new Hono();

econsent.use('*', authMiddleware);

// List consent forms
econsent.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const forms = await prisma.consentForm.findMany({
      where: { projectId },
      include: { signatures: true },
      orderBy: { updatedAt: 'desc' },
    });

    const formsWithStats = forms.map((form) => {
      const totalSigs = form.signatures.length;
      const passed = form.signatures.filter((s) => s.comprehensionPassed).length;
      const withdrawn = form.signatures.filter((s) => s.withdrawnAt !== null).length;

      return {
        ...form,
        signatureCount: totalSigs,
        comprehensionPassRate: totalSigs > 0 ? Math.round((passed / totalSigs) * 100) : 0,
        withdrawalCount: withdrawn,
      };
    });

    return c.json({ consentForms: formsWithStats });
  } catch (error: any) {
    console.error('List consent forms error:', error);
    return c.json({ message: 'Failed to list consent forms' }, 500);
  }
});

// Create consent form
econsent.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }

    const project = await findAccessibleProject(body.projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const form = await prisma.consentForm.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        version: body.version ?? '1.0',
        content: body.content ?? '',
        language: body.language ?? 'en',
        comprehensionQuestions: body.comprehensionQuestions ?? null,
        requireComprehension: body.requireComprehension ?? true,
        reconsentOnAmendment: body.reconsentOnAmendment ?? true,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'consent_form',
      entityId: form.id,
      newValue: form,
    });

    return c.json({ consentForm: form }, 201);
  } catch (error: any) {
    console.error('Create consent form error:', error);
    return c.json({ message: 'Failed to create consent form' }, 500);
  }
});

// Get consent form with signatures
econsent.get('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const form = await prisma.consentForm.findUnique({
      where: { id },
      include: {
        signatures: { orderBy: { signedAt: 'desc' } },
      },
    });

    if (!form) return c.json({ message: 'Consent form not found' }, 404);

    const project = await findAccessibleProject(form.projectId, user.orgId);
    if (!project) return c.json({ message: 'Consent form not found' }, 404);

    return c.json({ consentForm: form });
  } catch (error: any) {
    console.error('Get consent form error:', error);
    return c.json({ message: 'Failed to get consent form' }, 500);
  }
});

// Update consent form (creates new version if active)
econsent.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.consentForm.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Consent form not found' }, 404);

    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Consent form not found' }, 404);

    if (existing.status === 'active') {
      // Create a new version — increment version
      const parts = existing.version.split('.');
      const major = parseInt(parts[0], 10);
      const minor = parseInt(parts[1] || '0', 10);
      const newVersion = `${major}.${minor + 1}`;

      const newForm = await prisma.consentForm.create({
        data: {
          projectId: existing.projectId,
          title: body.title ?? existing.title,
          version: newVersion,
          status: 'draft',
          content: body.content ?? existing.content,
          language: body.language ?? existing.language,
          comprehensionQuestions: body.comprehensionQuestions ?? existing.comprehensionQuestions,
          requireComprehension: body.requireComprehension ?? existing.requireComprehension,
          reconsentOnAmendment: body.reconsentOnAmendment ?? existing.reconsentOnAmendment,
        },
      });

      await logAudit({
        projectId: existing.projectId,
        userId: user.userId,
        action: 'create',
        entityType: 'consent_form',
        entityId: newForm.id,
        previousValue: { version: existing.version },
        newValue: { version: newVersion },
        reason: 'New version created from active form',
      });

      return c.json({ consentForm: newForm, message: 'New version created' }, 201);
    }

    const updated = await prisma.consentForm.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        content: body.content ?? existing.content,
        language: body.language ?? existing.language,
        comprehensionQuestions: body.comprehensionQuestions ?? existing.comprehensionQuestions,
        requireComprehension: body.requireComprehension ?? existing.requireComprehension,
        reconsentOnAmendment: body.reconsentOnAmendment ?? existing.reconsentOnAmendment,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'consent_form',
      entityId: id,
      previousValue: existing,
      newValue: updated,
    });

    return c.json({ consentForm: updated });
  } catch (error: any) {
    console.error('Update consent form error:', error);
    return c.json({ message: 'Failed to update consent form' }, 500);
  }
});

// Activate consent form
econsent.put('/:id/activate', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.consentForm.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Consent form not found' }, 404);

    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Consent form not found' }, 404);

    if (existing.status !== 'draft') {
      return c.json({ message: 'Only draft consent forms can be activated' }, 400);
    }

    const updated = await prisma.consentForm.update({
      where: { id },
      data: { status: 'active' },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'status_change',
      entityType: 'consent_form',
      entityId: id,
      previousValue: { status: 'draft' },
      newValue: { status: 'active' },
    });

    return c.json({ consentForm: updated });
  } catch (error: any) {
    console.error('Activate consent form error:', error);
    return c.json({ message: 'Failed to activate consent form' }, 500);
  }
});

// Supersede consent form
econsent.put('/:id/supersede', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.consentForm.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Consent form not found' }, 404);

    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Consent form not found' }, 404);

    if (existing.status !== 'active') {
      return c.json({ message: 'Only active consent forms can be superseded' }, 400);
    }

    const updated = await prisma.consentForm.update({
      where: { id },
      data: { status: 'superseded' },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'status_change',
      entityType: 'consent_form',
      entityId: id,
      previousValue: { status: 'active' },
      newValue: { status: 'superseded' },
      reason: body.reason,
    });

    return c.json({ consentForm: updated });
  } catch (error: any) {
    console.error('Supersede consent form error:', error);
    return c.json({ message: 'Failed to supersede consent form' }, 500);
  }
});

// Sign consent form
econsent.post('/:id/sign', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const form = await prisma.consentForm.findUnique({ where: { id } });
    if (!form) return c.json({ message: 'Consent form not found' }, 404);

    const project = await findAccessibleProject(form.projectId, user.orgId);
    if (!project) return c.json({ message: 'Consent form not found' }, 404);

    if (form.status !== 'active') {
      return c.json({ message: 'Only active consent forms can be signed' }, 400);
    }

    if (!body.subjectId) {
      return c.json({ message: 'subjectId is required' }, 400);
    }

    // Calculate comprehension pass/fail
    let comprehensionPassed = true;
    if (form.requireComprehension && body.comprehensionScore !== undefined) {
      comprehensionPassed = body.comprehensionScore >= 80; // 80% threshold
    }

    const signature = await prisma.consentSignature.create({
      data: {
        consentFormId: id,
        subjectId: body.subjectId,
        comprehensionScore: body.comprehensionScore ?? null,
        comprehensionPassed,
        method: body.method ?? 'electronic',
        witnessName: body.witnessName ?? null,
        witnessSignedAt: body.witnessName ? new Date() : null,
        ipAddress: c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? null,
      },
    });

    await logAudit({
      projectId: form.projectId,
      userId: user.userId,
      action: 'sign',
      entityType: 'consent_signature',
      entityId: signature.id,
      newValue: { consentFormId: id, subjectId: body.subjectId, method: body.method },
    });

    return c.json({ signature }, 201);
  } catch (error: any) {
    console.error('Sign consent form error:', error);
    return c.json({ message: 'Failed to record consent signature' }, 500);
  }
});

// Withdraw consent
econsent.put('/signatures/:sigId/withdraw', async (c) => {
  try {
    const user = getUser(c);
    const { sigId } = c.req.param();
    const body = await c.req.json();

    const signature = await prisma.consentSignature.findUnique({
      where: { id: sigId },
      include: { consentForm: true },
    });

    if (!signature) return c.json({ message: 'Signature not found' }, 404);

    const project = await findAccessibleProject(signature.consentForm.projectId, user.orgId);
    if (!project) return c.json({ message: 'Signature not found' }, 404);

    if (signature.withdrawnAt) {
      return c.json({ message: 'Consent already withdrawn' }, 400);
    }

    const updated = await prisma.consentSignature.update({
      where: { id: sigId },
      data: {
        withdrawnAt: new Date(),
        withdrawalReason: body.reason ?? '',
      },
    });

    await logAudit({
      projectId: signature.consentForm.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'consent_signature',
      entityId: sigId,
      previousValue: { withdrawnAt: null },
      newValue: { withdrawnAt: updated.withdrawnAt, withdrawalReason: body.reason },
    });

    return c.json({ signature: updated });
  } catch (error: any) {
    console.error('Withdraw consent error:', error);
    return c.json({ message: 'Failed to withdraw consent' }, 500);
  }
});

// Statistics
econsent.get('/:id/statistics', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const form = await prisma.consentForm.findUnique({
      where: { id },
      include: { signatures: true },
    });

    if (!form) return c.json({ message: 'Consent form not found' }, 404);

    const project = await findAccessibleProject(form.projectId, user.orgId);
    if (!project) return c.json({ message: 'Consent form not found' }, 404);

    const totalSigs = form.signatures.length;
    const activeSigs = form.signatures.filter((s) => !s.withdrawnAt).length;
    const withdrawnSigs = form.signatures.filter((s) => s.withdrawnAt !== null).length;
    const passedComprehension = form.signatures.filter((s) => s.comprehensionPassed).length;
    const scores = form.signatures.filter((s) => s.comprehensionScore !== null).map((s) => s.comprehensionScore!);
    const avgComprehension = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    return c.json({
      totalSignatures: totalSigs,
      activeConsents: activeSigs,
      withdrawnConsents: withdrawnSigs,
      consentRate: totalSigs > 0 ? Math.round((activeSigs / totalSigs) * 100) : 0,
      withdrawalRate: totalSigs > 0 ? Math.round((withdrawnSigs / totalSigs) * 100) : 0,
      comprehensionPassRate: totalSigs > 0 ? Math.round((passedComprehension / totalSigs) * 100) : 0,
      avgComprehensionScore: avgComprehension,
    });
  } catch (error: any) {
    console.error('Consent statistics error:', error);
    return c.json({ message: 'Failed to get consent statistics' }, 500);
  }
});

// Re-consent needed
econsent.get('/reconsent-needed', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');

    // Get all active consent forms with reconsentOnAmendment enabled
    const where: any = { status: 'active', reconsentOnAmendment: true };
    if (projectId) {
      const project = await findAccessibleProject(projectId, user.orgId);
      if (!project) return c.json({ message: 'Project not found' }, 404);
      where.projectId = projectId;
    }

    const activeForms = await prisma.consentForm.findMany({
      where,
      include: { signatures: true },
    });

    // Find superseded forms that have the same project and title prefix
    const reconsentNeeded: { subjectId: string; formId: string; formTitle: string; signedVersion: string; currentVersion: string }[] = [];

    for (const form of activeForms) {
      // Find signatures from older versions of the same-titled form
      const olderForms = await prisma.consentForm.findMany({
        where: {
          projectId: form.projectId,
          title: form.title,
          status: 'superseded',
        },
        include: {
          signatures: {
            where: { withdrawnAt: null },
          },
        },
      });

      for (const olderForm of olderForms) {
        for (const sig of olderForm.signatures) {
          // Check if subject has signed the current version
          const hasCurrentSig = form.signatures.some(
            (s) => s.subjectId === sig.subjectId && !s.withdrawnAt
          );
          if (!hasCurrentSig) {
            reconsentNeeded.push({
              subjectId: sig.subjectId,
              formId: form.id,
              formTitle: form.title,
              signedVersion: olderForm.version,
              currentVersion: form.version,
            });
          }
        }
      }
    }

    return c.json({ reconsentNeeded });
  } catch (error: any) {
    console.error('Re-consent needed error:', error);
    return c.json({ message: 'Failed to check re-consent needs' }, 500);
  }
});

export default econsent;
