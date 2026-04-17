import { Hono } from 'hono';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, requireRole, getUser, JWT_SECRET } from '../middleware/auth.js';

interface AuditModePayload {
  type: 'audit_mode';
  projectId: string;
  createdBy: string;
  createdAt: string;
}

type AuditLinkExpiry = '24h' | '72h' | '7d';

function buildTraceabilityLinks(tests: Array<{ id: string; linkedRequirementIds: string[] }>) {
  return tests.flatMap((test) =>
    test.linkedRequirementIds.map((requirementId) => ({
      requirementId,
      testId: test.id,
    })),
  );
}

async function findProjectForOrg(projectId: string, orgId: string | null) {
  if (!orgId) return null;

  return prisma.project.findFirst({
    where: {
      id: projectId,
      workspace: { orgId },
    },
    select: { id: true },
  });
}

function parseExpiry(expiresIn: string): AuditLinkExpiry {
  switch (expiresIn) {
    case '24h': return '24h';
    case '72h': return '72h';
    case '7d': return '7d';
    default: return '24h';
  }
}

function expiryToMs(expiresIn: AuditLinkExpiry): number {
  switch (expiresIn) {
    case '24h': return 24 * 60 * 60 * 1000;
    case '72h': return 72 * 60 * 60 * 1000;
    case '7d': return 7 * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}

function verifyAuditToken(token: string): AuditModePayload {
  const decoded = jwt.verify(token, JWT_SECRET) as AuditModePayload;
  if (decoded.type !== 'audit_mode') {
    throw new Error('Not an audit mode token');
  }
  return decoded;
}

const auditMode = new Hono();

// ── Create audit link (admin only) ──────────────────────────────────────────

auditMode.post('/create', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const user = getUser(c);
    const { projectId, expiresIn } = await c.req.json();

    if (!projectId) {
      return c.json({ message: 'projectId is required' }, 400);
    }

    // Verify project exists and belongs to the user's org
    const project = await findProjectForOrg(projectId, user.orgId);

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const expiry = parseExpiry(expiresIn || '24h');
    const expiresAt = new Date(Date.now() + expiryToMs(expiry));

    const payload: AuditModePayload = {
      type: 'audit_mode',
      projectId,
      createdBy: user.userId,
      createdAt: new Date().toISOString(),
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiry });

    const baseUrl = c.req.header('origin') || c.req.header('referer')?.replace(/\/[^/]*$/, '') || 'http://localhost:5173';
    const auditUrl = `${baseUrl}/audit/${token}`;

    return c.json({
      auditUrl,
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Create audit link error:', error);
    return c.json({ message: 'Failed to create audit link' }, 500);
  }
});

// ── Read-only audit endpoints (token-based auth) ────────────────────────────

auditMode.get('/:token/project', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const project = await prisma.project.findUnique({
      where: { id: payload.projectId },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    return c.json({
      project,
      auditMeta: {
        createdAt: payload.createdAt,
        createdBy: payload.createdBy,
      },
    });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

auditMode.get('/:token/requirements', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const requirements = await prisma.requirement.findMany({
      where: { projectId: payload.projectId },
      orderBy: { createdAt: 'asc' },
    });

    return c.json({ requirements });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

auditMode.get('/:token/tests', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const tests = await prisma.test.findMany({
      where: { projectId: payload.projectId },
      orderBy: { createdAt: 'asc' },
    });

    return c.json({ tests });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

auditMode.get('/:token/traceability', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const requirements = await prisma.requirement.findMany({
      where: { projectId: payload.projectId },
      orderBy: { createdAt: 'asc' },
    });

    const tests = await prisma.test.findMany({
      where: { projectId: payload.projectId },
      orderBy: { createdAt: 'asc' },
    });

    const links = buildTraceabilityLinks(tests);

    return c.json({ requirements, tests, links });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

auditMode.get('/:token/evidence', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const evidence = await prisma.evidence.findMany({
      where: { projectId: payload.projectId },
      select: {
        id: true,
        entityType: true,
        entityId: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        description: true,
        uploadedBy: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return c.json({ evidence });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

auditMode.get('/:token/audit-trail', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const trail = await prisma.auditLog.findMany({
      where: { projectId: payload.projectId },
      orderBy: { timestamp: 'desc' },
    });

    return c.json({ trail });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

auditMode.get('/:token/signatures', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const signatures = await prisma.signature.findMany({
      where: { projectId: payload.projectId },
      orderBy: { timestamp: 'desc' },
    });

    return c.json({ signatures });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

auditMode.get('/:token/report', async (c) => {
  try {
    const { token } = c.req.param();
    const payload = verifyAuditToken(token);

    const project = await prisma.project.findUnique({
      where: { id: payload.projectId },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const requirements = await prisma.requirement.findMany({
      where: { projectId: payload.projectId },
      orderBy: { createdAt: 'asc' },
    });

    const tests = await prisma.test.findMany({
      where: { projectId: payload.projectId },
      orderBy: { createdAt: 'asc' },
    });

    const signatures = await prisma.signature.findMany({
      where: { projectId: payload.projectId },
      orderBy: { timestamp: 'desc' },
    });

    const trail = await prisma.auditLog.findMany({
      where: { projectId: payload.projectId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Generate HTML report
    const totalTests = tests.length;
    const passedTests = tests.filter((t: any) => t.status === 'Passed').length;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>QAtrial Audit Report - ${project.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 20px; color: #1a1a2e; }
    h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
    h2 { color: #334155; margin-top: 32px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
    .badge-pass { background: #dcfce7; color: #166534; }
    .badge-fail { background: #fecaca; color: #991b1b; }
    .badge-draft { background: #e0e7ff; color: #3730a3; }
    .meta { color: #64748b; font-size: 14px; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0; }
    .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
    .summary-card .value { font-size: 28px; font-weight: 700; color: #6366f1; }
    .summary-card .label { font-size: 12px; color: #64748b; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>QAtrial Audit Report</h1>
  <p class="meta">Project: <strong>${project.name}</strong> | Generated: ${new Date().toISOString()} | Read-Only Audit View</p>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="value">${requirements.length}</div>
      <div class="label">Requirements</div>
    </div>
    <div class="summary-card">
      <div class="value">${tests.length}</div>
      <div class="label">Tests</div>
    </div>
    <div class="summary-card">
      <div class="value">${passRate}%</div>
      <div class="label">Pass Rate</div>
    </div>
  </div>

  <h2>Requirements</h2>
  <table>
    <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Risk Level</th></tr></thead>
    <tbody>
      ${requirements.map((r: any) => `<tr><td>${r.id}</td><td>${r.title}</td><td><span class="badge badge-draft">${r.status}</span></td><td>${r.riskLevel || '-'}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>Tests</h2>
  <table>
    <thead><tr><th>ID</th><th>Title</th><th>Status</th></tr></thead>
    <tbody>
      ${tests.map((t: any) => `<tr><td>${t.id}</td><td>${t.title}</td><td><span class="badge ${t.status === 'Passed' ? 'badge-pass' : t.status === 'Failed' ? 'badge-fail' : 'badge-draft'}">${t.status}</span></td></tr>`).join('')}
    </tbody>
  </table>

  <h2>Signatures</h2>
  <table>
    <thead><tr><th>Entity</th><th>Meaning</th><th>Signed By</th><th>Date</th></tr></thead>
    <tbody>
      ${signatures.map((s: any) => `<tr><td>${s.entityType} ${s.entityId}</td><td>${s.meaning}</td><td>${s.userName || s.userId}</td><td>${new Date(s.timestamp).toISOString()}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>Recent Audit Trail</h2>
  <table>
    <thead><tr><th>Action</th><th>Entity</th><th>User</th><th>Date</th><th>Reason</th></tr></thead>
    <tbody>
      ${trail.map((a: any) => `<tr><td>${a.action}</td><td>${a.entityType} ${a.entityId}</td><td>${a.userId}</td><td>${new Date(a.timestamp).toISOString()}</td><td>${a.reason || '-'}</td></tr>`).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>This report was generated by QAtrial Audit Mode. All data is read-only and represents a point-in-time snapshot.</p>
  </div>
</body>
</html>`;

    return c.html(html);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Audit link has expired' }, 410);
    }
    return c.json({ message: 'Invalid audit token' }, 401);
  }
});

export default auditMode;
