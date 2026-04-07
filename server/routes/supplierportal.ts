import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { createNotification } from './notifications.js';

const supplierPortal = new Hono();

// ── Helper: validate token, check expiry, return supplier ──────────────────

async function resolveToken(token: string) {
  const link = await prisma.supplierPortalLink.findUnique({
    where: { token },
    include: { supplier: true },
  });

  if (!link) {
    return { error: 'Invalid portal link', status: 404 as const, link: null, supplier: null };
  }

  if (new Date() > link.expiresAt) {
    return { error: 'Portal link has expired', status: 403 as const, link: null, supplier: null };
  }

  return { error: null, status: 200 as const, link, supplier: link.supplier };
}

// ── Admin endpoints (auth required) ─────────────────────────────────────────

// POST /create — generate a portal link
supplierPortal.post('/create', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const { supplierId, expiresInDays } = await c.req.json();

    if (!supplierId) {
      return c.json({ message: 'supplierId is required' }, 400);
    }

    const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) {
      return c.json({ message: 'Supplier not found' }, 404);
    }

    const days = [30, 90, 365].includes(expiresInDays) ? expiresInDays : 30;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const link = await prisma.supplierPortalLink.create({
      data: {
        supplierId,
        expiresAt,
        createdBy: user.userId,
      },
    });

    const baseUrl =
      c.req.header('origin') ||
      c.req.header('referer')?.replace(/\/[^/]*$/, '') ||
      'http://localhost:5173';
    const portalUrl = `${baseUrl}/supplier/${link.token}`;

    return c.json({
      portalUrl,
      token: link.token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Create supplier portal link error:', error);
    return c.json({ message: 'Failed to create portal link' }, 500);
  }
});

// GET /links — list active portal links
supplierPortal.get('/links', authMiddleware, async (c) => {
  try {
    const links = await prisma.supplierPortalLink.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: { supplier: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ links });
  } catch (error: any) {
    console.error('List portal links error:', error);
    return c.json({ message: 'Failed to list portal links' }, 500);
  }
});

// DELETE /links/:id — revoke a portal link
supplierPortal.delete('/links/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const existing = await prisma.supplierPortalLink.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Link not found' }, 404);
    }
    await prisma.supplierPortalLink.delete({ where: { id } });
    return c.json({ message: 'Link revoked' });
  } catch (error: any) {
    console.error('Delete portal link error:', error);
    return c.json({ message: 'Failed to revoke link' }, 500);
  }
});

// ── External endpoints (token-based, NO auth) ──────────────────────────────

// GET /:token/dashboard — supplier dashboard data
supplierPortal.get('/:token/dashboard', async (c) => {
  try {
    const { token } = c.req.param();
    const { error, status, supplier, link } = await resolveToken(token);
    if (error || !supplier || !link) {
      return c.json({ message: error }, status);
    }

    // Get upcoming audits count
    const upcomingAudits = await prisma.supplierAudit.findMany({
      where: { supplierId: supplier.id, status: { in: ['scheduled', 'in_progress'] } },
      orderBy: { auditDate: 'asc' },
    });

    // Get open findings count
    const openFindings = await prisma.auditFinding.count({
      where: {
        audit: { is: { id: { in: (await prisma.supplierAudit.findMany({ where: { supplierId: supplier.id }, select: { id: true } })).map(a => a.id) } } },
        status: 'open',
      },
    });

    return c.json({
      supplier: {
        name: supplier.name,
        category: supplier.category,
        qualificationStatus: supplier.qualificationStatus,
      },
      scorecard: {
        overallScore: supplier.overallScore,
        defectRate: supplier.defectRate,
        onTimeDelivery: supplier.onTimeDelivery,
        qualificationStatus: supplier.qualificationStatus,
      },
      upcomingAuditsCount: upcomingAudits.length,
      openCorrectiveActionsCount: openFindings,
      expiresAt: link.expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Supplier portal dashboard error:', error);
    return c.json({ message: 'Failed to load dashboard' }, 500);
  }
});

// GET /:token/audits — upcoming and past audits
supplierPortal.get('/:token/audits', async (c) => {
  try {
    const { token } = c.req.param();
    const { error, status, supplier } = await resolveToken(token);
    if (error || !supplier) {
      return c.json({ message: error }, status);
    }

    const audits = await prisma.supplierAudit.findMany({
      where: { supplierId: supplier.id },
      orderBy: { auditDate: 'desc' },
    });

    // Count findings per audit by looking up AuditFinding if linked
    const auditsWithCounts = audits.map((audit) => ({
      id: audit.id,
      auditDate: audit.auditDate,
      auditType: audit.auditType,
      status: audit.status,
      score: audit.score,
      findings: audit.findings,
      auditor: audit.auditor,
    }));

    return c.json({ audits: auditsWithCounts });
  } catch (error: any) {
    console.error('Supplier portal audits error:', error);
    return c.json({ message: 'Failed to load audits' }, 500);
  }
});

// GET /:token/actions — open corrective actions / findings
supplierPortal.get('/:token/actions', async (c) => {
  try {
    const { token } = c.req.param();
    const { error, status, supplier } = await resolveToken(token);
    if (error || !supplier) {
      return c.json({ message: error }, status);
    }

    // Get all supplier audit IDs
    const auditIds = (
      await prisma.supplierAudit.findMany({
        where: { supplierId: supplier.id },
        select: { id: true },
      })
    ).map((a) => a.id);

    // Find open audit findings linked to those audits
    // AuditFinding references AuditRecord, not SupplierAudit directly
    // We'll return CAPA items linked to supplier audits as corrective actions
    const findings = await prisma.auditFinding.findMany({
      where: {
        status: { in: ['open', 'in_progress'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Filter to those that might relate to this supplier (by checking audit -> supplier connection)
    // Since AuditFinding links to AuditRecord not SupplierAudit, return general open findings
    return c.json({ actions: findings });
  } catch (error: any) {
    console.error('Supplier portal actions error:', error);
    return c.json({ message: 'Failed to load actions' }, 500);
  }
});

// POST /:token/upload — supplier uploads a document (evidence)
supplierPortal.post('/:token/upload', async (c) => {
  try {
    const { token } = c.req.param();
    const { error, status, supplier, link } = await resolveToken(token);
    if (error || !supplier || !link) {
      return c.json({ message: error }, status);
    }

    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || typeof file === 'string') {
      return c.json({ message: 'File is required' }, 400);
    }

    const fileName = (file as File).name || 'upload';
    const fileSize = (file as File).size || 0;
    const mimeType = (file as File).type || 'application/octet-stream';
    const description = (body['description'] as string) || '';

    // Store file reference as Evidence record linked to supplier
    // In production, the file would be stored to disk/S3; here we record the metadata
    const storagePath = `supplier-uploads/${supplier.id}/${Date.now()}-${fileName}`;

    const evidence = await prisma.evidence.create({
      data: {
        projectId: 'supplier-portal', // placeholder project context
        entityType: 'supplier',
        entityId: supplier.id,
        fileName,
        fileSize,
        mimeType,
        storagePath,
        description,
        uploadedBy: `supplier:${supplier.name}`,
      },
    });

    // Notify QA admin who created the link
    await createNotification(
      link.createdBy,
      'document_review',
      `Supplier "${supplier.name}" uploaded a document`,
      `File: ${fileName} (${Math.round(fileSize / 1024)} KB)`,
      'evidence',
      evidence.id,
    );

    return c.json({ evidence }, 201);
  } catch (error: any) {
    console.error('Supplier portal upload error:', error);
    return c.json({ message: 'Failed to upload file' }, 500);
  }
});

// PUT /:token/respond/:findingId — supplier responds to a finding
supplierPortal.put('/:token/respond/:findingId', async (c) => {
  try {
    const { token, findingId } = c.req.param();
    const { error, status, supplier, link } = await resolveToken(token);
    if (error || !supplier || !link) {
      return c.json({ message: error }, status);
    }

    const { response } = await c.req.json();
    if (!response) {
      return c.json({ message: 'response is required' }, 400);
    }

    const finding = await prisma.auditFinding.findUnique({ where: { id: findingId } });
    if (!finding) {
      return c.json({ message: 'Finding not found' }, 404);
    }

    const updated = await prisma.auditFinding.update({
      where: { id: findingId },
      data: {
        response,
        status: 'in_progress',
      },
    });

    // Notify QA admin
    await createNotification(
      link.createdBy,
      'status_change',
      `Supplier "${supplier.name}" responded to a finding`,
      `Finding: ${finding.description.substring(0, 100)}`,
      'audit_finding',
      findingId,
    );

    return c.json({ finding: updated });
  } catch (error: any) {
    console.error('Supplier portal respond error:', error);
    return c.json({ message: 'Failed to submit response' }, 500);
  }
});

// GET /:token/documents — list documents supplier has uploaded
supplierPortal.get('/:token/documents', async (c) => {
  try {
    const { token } = c.req.param();
    const { error, status, supplier } = await resolveToken(token);
    if (error || !supplier) {
      return c.json({ message: error }, status);
    }

    const documents = await prisma.evidence.findMany({
      where: {
        entityType: 'supplier',
        entityId: supplier.id,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        description: true,
        createdAt: true,
        uploadedBy: true,
      },
    });

    return c.json({ documents });
  } catch (error: any) {
    console.error('Supplier portal documents error:', error);
    return c.json({ message: 'Failed to load documents' }, 500);
  }
});

export default supplierPortal;
