import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const suppliers = new Hono();

suppliers.use('*', authMiddleware);

// List suppliers by orgId
suppliers.get('/', async (c) => {
  try {
    const user = getUser(c);
    const orgId = c.req.query('orgId') || user.orgId;
    if (!orgId) {
      return c.json({ message: 'orgId is required' }, 400);
    }

    const items = await prisma.supplier.findMany({
      where: { orgId },
      include: { audits: { orderBy: { auditDate: 'desc' }, take: 1 } },
      orderBy: { name: 'asc' },
    });

    return c.json({ suppliers: items });
  } catch (error: any) {
    console.error('List suppliers error:', error);
    return c.json({ message: 'Failed to list suppliers' }, 500);
  }
});

// Get single supplier with audits
suppliers.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const item = await prisma.supplier.findUnique({
      where: { id },
      include: { audits: { orderBy: { auditDate: 'desc' } } },
    });

    if (!item) {
      return c.json({ message: 'Supplier not found' }, 404);
    }

    return c.json({ supplier: item });
  } catch (error: any) {
    console.error('Get supplier error:', error);
    return c.json({ message: 'Failed to get supplier' }, 500);
  }
});

// Get supplier scorecard
suppliers.get('/:id/scorecard', async (c) => {
  try {
    const { id } = c.req.param();
    const item = await prisma.supplier.findUnique({
      where: { id },
      include: { audits: { orderBy: { auditDate: 'desc' } } },
    });

    if (!item) {
      return c.json({ message: 'Supplier not found' }, 404);
    }

    const completedAudits = item.audits.filter((a) => a.status === 'completed' && a.score !== null);
    const avgAuditScore = completedAudits.length > 0
      ? Math.round(completedAudits.reduce((sum, a) => sum + (a.score || 0), 0) / completedAudits.length)
      : null;

    return c.json({
      scorecard: {
        id: item.id,
        name: item.name,
        category: item.category,
        riskLevel: item.riskLevel,
        qualificationStatus: item.qualificationStatus,
        overallScore: item.overallScore,
        defectRate: item.defectRate,
        onTimeDelivery: item.onTimeDelivery,
        avgAuditScore,
        lastAuditDate: item.lastAuditDate,
        nextAuditDate: item.nextAuditDate,
        totalAudits: item.audits.length,
        completedAudits: completedAudits.length,
      },
    });
  } catch (error: any) {
    console.error('Get supplier scorecard error:', error);
    return c.json({ message: 'Failed to get supplier scorecard' }, 500);
  }
});

// Create supplier
suppliers.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const orgId = body.orgId || user.orgId;
    if (!orgId || !body.name) {
      return c.json({ message: 'orgId and name are required' }, 400);
    }

    const item = await prisma.supplier.create({
      data: {
        orgId,
        name: body.name,
        category: body.category ?? 'component',
        riskLevel: body.riskLevel ?? 'medium',
        qualificationStatus: body.qualificationStatus ?? 'pending',
        overallScore: body.overallScore ?? null,
        defectRate: body.defectRate ?? null,
        onTimeDelivery: body.onTimeDelivery ?? null,
        lastAuditDate: body.lastAuditDate ? new Date(body.lastAuditDate) : null,
        nextAuditDate: body.nextAuditDate ? new Date(body.nextAuditDate) : null,
      },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'supplier.created', { supplier: item });
    }

    return c.json({ supplier: item }, 201);
  } catch (error: any) {
    console.error('Create supplier error:', error);
    return c.json({ message: 'Failed to create supplier' }, 500);
  }
});

// Update supplier (auto-calculate overallScore, auto-requalification)
suppliers.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.supplier.findUnique({
      where: { id },
      include: { audits: { where: { status: 'completed' }, orderBy: { auditDate: 'desc' }, take: 5 } },
    });
    if (!existing) {
      return c.json({ message: 'Supplier not found' }, 404);
    }

    // Auto-calculate overallScore from latest audit scores + metrics
    let overallScore = body.overallScore ?? existing.overallScore;
    const defectRate = body.defectRate !== undefined ? body.defectRate : existing.defectRate;
    const onTimeDelivery = body.onTimeDelivery !== undefined ? body.onTimeDelivery : existing.onTimeDelivery;

    if (existing.audits.length > 0 || defectRate !== null || onTimeDelivery !== null) {
      let scoreComponents: number[] = [];

      // Latest audit score (40% weight)
      if (existing.audits.length > 0 && existing.audits[0].score !== null) {
        scoreComponents.push(existing.audits[0].score!);
      }

      // Delivery performance (30% weight) — convert percentage to 0-100
      if (onTimeDelivery !== null && onTimeDelivery !== undefined) {
        scoreComponents.push(Math.min(100, Math.max(0, onTimeDelivery)));
      }

      // Defect rate (30% weight) — invert: 0% defects = 100 score
      if (defectRate !== null && defectRate !== undefined) {
        scoreComponents.push(Math.max(0, 100 - defectRate * 10));
      }

      if (scoreComponents.length > 0) {
        overallScore = Math.round(scoreComponents.reduce((a, b) => a + b, 0) / scoreComponents.length);
      }
    }

    // Auto-requalification: if overallScore drops below 50, set to 'conditional'
    let qualificationStatus = body.qualificationStatus ?? existing.qualificationStatus;
    if (overallScore !== null && overallScore < 50 && qualificationStatus === 'qualified') {
      qualificationStatus = 'conditional';
    }

    const item = await prisma.supplier.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        category: body.category ?? existing.category,
        riskLevel: body.riskLevel ?? existing.riskLevel,
        qualificationStatus,
        overallScore,
        defectRate,
        onTimeDelivery,
        lastAuditDate: body.lastAuditDate ? new Date(body.lastAuditDate) : existing.lastAuditDate,
        nextAuditDate: body.nextAuditDate ? new Date(body.nextAuditDate) : existing.nextAuditDate,
      },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'supplier.updated', { supplier: item, previous: existing });
    }

    return c.json({ supplier: item });
  } catch (error: any) {
    console.error('Update supplier error:', error);
    return c.json({ message: 'Failed to update supplier' }, 500);
  }
});

// Delete supplier
suppliers.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const existing = await prisma.supplier.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Supplier not found' }, 404);
    }

    await prisma.supplier.delete({ where: { id } });

    return c.json({ message: 'Supplier deleted' });
  } catch (error: any) {
    console.error('Delete supplier error:', error);
    return c.json({ message: 'Failed to delete supplier' }, 500);
  }
});

// Create supplier audit
suppliers.post('/:id/audits', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      return c.json({ message: 'Supplier not found' }, 404);
    }

    if (!body.auditDate || !body.auditor) {
      return c.json({ message: 'auditDate and auditor are required' }, 400);
    }

    const audit = await prisma.supplierAudit.create({
      data: {
        supplierId: id,
        auditDate: new Date(body.auditDate),
        auditType: body.auditType ?? 'routine',
        findings: body.findings ?? null,
        score: body.score ?? null,
        auditor: body.auditor,
        status: body.status ?? 'scheduled',
        nextAuditDate: body.nextAuditDate ? new Date(body.nextAuditDate) : null,
      },
    });

    // Update supplier's lastAuditDate and nextAuditDate
    await prisma.supplier.update({
      where: { id },
      data: {
        lastAuditDate: new Date(body.auditDate),
        nextAuditDate: body.nextAuditDate ? new Date(body.nextAuditDate) : supplier.nextAuditDate,
      },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'supplier.audit_created', { audit, supplier });
    }

    return c.json({ audit }, 201);
  } catch (error: any) {
    console.error('Create supplier audit error:', error);
    return c.json({ message: 'Failed to create supplier audit' }, 500);
  }
});

export default suppliers;
