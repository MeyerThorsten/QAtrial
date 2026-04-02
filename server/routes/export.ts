import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';

const exportRoutes = new Hono();

exportRoutes.use('*', authMiddleware);

/**
 * Gather all project data for export.
 */
async function gatherProjectData(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;

  const [requirements, tests, risks, capas, approvals, signatures, auditLogs, evidences] =
    await Promise.all([
      prisma.requirement.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } }),
      prisma.test.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } }),
      prisma.risk.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } }),
      prisma.cAPA.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } }),
      prisma.approval.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } }),
      prisma.signature.findMany({ where: { projectId }, orderBy: { timestamp: 'asc' } }),
      prisma.auditLog.findMany({ where: { projectId }, orderBy: { timestamp: 'asc' } }),
      prisma.evidence.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } }),
    ]);

  return { project, requirements, tests, risks, capas, approvals, signatures, auditLogs, evidences };
}

/**
 * Build an HTML report from project data.
 */
function buildHtmlReport(data: NonNullable<Awaited<ReturnType<typeof gatherProjectData>>>): string {
  const { project, requirements, tests, risks, capas, approvals, signatures, auditLogs, evidences } = data;
  const now = new Date().toISOString();

  const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Build traceability matrix
  const traceRows = requirements.map((req) => {
    const linkedTests = tests.filter((t) => t.linkedRequirementIds.includes(req.id));
    const linkedRisks = risks.filter((r) => r.requirementId === req.id);
    const reqEvidence = evidences.filter((e) => e.entityType === 'requirement' && e.entityId === req.id);
    const reqApprovals = approvals.filter((a) => a.entityType === 'requirement' && a.entityId === req.id);
    return `<tr>
      <td>${escHtml(req.seqId)}</td>
      <td>${escHtml(req.title)}</td>
      <td>${escHtml(req.status)}</td>
      <td>${linkedTests.map((t) => escHtml(t.seqId)).join(', ') || '—'}</td>
      <td>${linkedRisks.map((r) => `${r.riskLevel} (${r.riskScore})`).join(', ') || '—'}</td>
      <td>${reqEvidence.length > 0 ? `${reqEvidence.length} file(s)` : '—'}</td>
      <td>${reqApprovals.length > 0 ? reqApprovals[0].status : '—'}</td>
    </tr>`;
  }).join('\n');

  // Test results summary
  const testStatusCounts: Record<string, number> = {};
  tests.forEach((t) => { testStatusCounts[t.status] = (testStatusCounts[t.status] || 0) + 1; });
  const testSummaryRows = Object.entries(testStatusCounts)
    .map(([status, count]) => `<tr><td>${escHtml(status)}</td><td>${count}</td></tr>`)
    .join('\n');

  // Risk matrix summary
  const riskLevelCounts: Record<string, number> = {};
  risks.forEach((r) => { riskLevelCounts[r.riskLevel] = (riskLevelCounts[r.riskLevel] || 0) + 1; });
  const riskSummaryRows = Object.entries(riskLevelCounts)
    .map(([level, count]) => `<tr><td>${escHtml(level)}</td><td>${count}</td></tr>`)
    .join('\n');

  // CAPA summary
  const capaStatusCounts: Record<string, number> = {};
  capas.forEach((ca) => { capaStatusCounts[ca.status] = (capaStatusCounts[ca.status] || 0) + 1; });
  const capaSummaryRows = Object.entries(capaStatusCounts)
    .map(([status, count]) => `<tr><td>${escHtml(status)}</td><td>${count}</td></tr>`)
    .join('\n');

  // Approval/signature log
  const approvalLogRows = approvals.map((a) => `<tr>
    <td>${escHtml(a.entityType)}</td>
    <td>${a.entityId.slice(0, 8)}</td>
    <td>${escHtml(a.status)}</td>
    <td>${a.requestedBy.slice(0, 8)}</td>
    <td>${a.reviewedBy?.slice(0, 8) ?? '—'}</td>
    <td>${a.reviewedAt ? new Date(a.reviewedAt).toISOString() : '—'}</td>
    <td>${escHtml(a.reason ?? '—')}</td>
  </tr>`).join('\n');

  const signatureLogRows = signatures.map((s) => `<tr>
    <td>${escHtml(s.userName)}</td>
    <td>${escHtml(s.userRole)}</td>
    <td>${escHtml(s.meaning)}</td>
    <td>${escHtml(s.entityType)}</td>
    <td>${s.entityId.slice(0, 8)}</td>
    <td>${new Date(s.timestamp).toISOString()}</td>
    <td>${escHtml(s.reason)}</td>
  </tr>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QAtrial Export — ${escHtml(project.name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; background: #fff; padding: 2rem; max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #16213e; }
    h2 { font-size: 1.3rem; margin: 2rem 0 0.75rem; color: #0f3460; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.25rem; }
    .meta { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.85rem; }
    th, td { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
    tr:nth-child(even) { background: #f8fafc; }
    .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>QAtrial Project Export: ${escHtml(project.name)}</h1>
  <div class="meta">
    <p><strong>Version:</strong> ${escHtml(project.version)} | <strong>Country:</strong> ${escHtml(project.country || '—')} | <strong>Vertical:</strong> ${escHtml(project.vertical || '—')} | <strong>Type:</strong> ${escHtml(project.type)}</p>
    <p><strong>Generated:</strong> ${now}</p>
    <p>${escHtml(project.description)}</p>
  </div>

  <h2>Traceability Matrix</h2>
  <table>
    <thead>
      <tr><th>Req ID</th><th>Title</th><th>Status</th><th>Linked Tests</th><th>Risks</th><th>Evidence</th><th>Approval</th></tr>
    </thead>
    <tbody>${traceRows || '<tr><td colspan="7">No requirements</td></tr>'}</tbody>
  </table>

  <h2>Requirements (${requirements.length})</h2>
  <table>
    <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Risk Level</th><th>Regulatory Ref</th></tr></thead>
    <tbody>
      ${requirements.map((r) => `<tr><td>${escHtml(r.seqId)}</td><td>${escHtml(r.title)}</td><td>${escHtml(r.status)}</td><td>${escHtml(r.riskLevel || '—')}</td><td>${escHtml(r.regulatoryRef || '—')}</td></tr>`).join('\n')}
    </tbody>
  </table>

  <h2>Test Results Summary</h2>
  <table>
    <thead><tr><th>Status</th><th>Count</th></tr></thead>
    <tbody>${testSummaryRows || '<tr><td colspan="2">No tests</td></tr>'}</tbody>
  </table>

  <h2>Tests (${tests.length})</h2>
  <table>
    <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Linked Requirements</th></tr></thead>
    <tbody>
      ${tests.map((t) => `<tr><td>${escHtml(t.seqId)}</td><td>${escHtml(t.title)}</td><td>${escHtml(t.status)}</td><td>${t.linkedRequirementIds.join(', ') || '—'}</td></tr>`).join('\n')}
    </tbody>
  </table>

  <h2>Risk Summary</h2>
  <table>
    <thead><tr><th>Risk Level</th><th>Count</th></tr></thead>
    <tbody>${riskSummaryRows || '<tr><td colspan="2">No risks</td></tr>'}</tbody>
  </table>

  <h2>CAPA Summary</h2>
  <table>
    <thead><tr><th>Status</th><th>Count</th></tr></thead>
    <tbody>${capaSummaryRows || '<tr><td colspan="2">No CAPAs</td></tr>'}</tbody>
  </table>

  <h2>CAPAs (${capas.length})</h2>
  <table>
    <thead><tr><th>Title</th><th>Status</th><th>Root Cause</th><th>Corrective Action</th><th>Preventive Action</th></tr></thead>
    <tbody>
      ${capas.map((ca) => `<tr><td>${escHtml(ca.title)}</td><td>${escHtml(ca.status)}</td><td>${escHtml(ca.rootCause || '—')}</td><td>${escHtml(ca.correctiveAction || '—')}</td><td>${escHtml(ca.preventiveAction || '—')}</td></tr>`).join('\n')}
    </tbody>
  </table>

  <h2>Approval Log (${approvals.length})</h2>
  <table>
    <thead><tr><th>Entity Type</th><th>Entity ID</th><th>Status</th><th>Requested By</th><th>Reviewed By</th><th>Reviewed At</th><th>Reason</th></tr></thead>
    <tbody>${approvalLogRows || '<tr><td colspan="7">No approvals</td></tr>'}</tbody>
  </table>

  <h2>Signature Log (${signatures.length})</h2>
  <table>
    <thead><tr><th>Name</th><th>Role</th><th>Meaning</th><th>Entity Type</th><th>Entity ID</th><th>Timestamp</th><th>Reason</th></tr></thead>
    <tbody>${signatureLogRows || '<tr><td colspan="7">No signatures</td></tr>'}</tbody>
  </table>

  <h2>Audit Trail (${auditLogs.length} entries)</h2>
  <table>
    <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity Type</th><th>Entity ID</th><th>Reason</th></tr></thead>
    <tbody>
      ${auditLogs.slice(0, 200).map((a) => `<tr><td>${new Date(a.timestamp).toISOString()}</td><td>${a.userId.slice(0, 8)}</td><td>${escHtml(a.action)}</td><td>${escHtml(a.entityType)}</td><td>${a.entityId.slice(0, 8)}</td><td>${escHtml(a.reason || '—')}</td></tr>`).join('\n')}
      ${auditLogs.length > 200 ? `<tr><td colspan="6"><em>... and ${auditLogs.length - 200} more entries (see JSON data for full log)</em></td></tr>` : ''}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated by QAtrial &mdash; Regulated Quality Workspace &mdash; ${now}</p>
  </div>
</body>
</html>`;
}

// GET /:projectId — overview with URLs
exportRoutes.get('/:projectId', async (c) => {
  try {
    const { projectId } = c.req.param();

    const data = await gatherProjectData(projectId);
    if (!data) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const baseUrl = new URL(c.req.url);
    const base = `${baseUrl.protocol}//${baseUrl.host}/api/export/${projectId}`;

    const evidenceFiles = data.evidences.map((e) => ({
      id: e.id,
      fileName: e.fileName,
      entityType: e.entityType,
      entityId: e.entityId,
      downloadUrl: `${baseUrl.protocol}//${baseUrl.host}/api/evidence/${e.id}/download`,
    }));

    return c.json({
      projectId,
      projectName: data.project.name,
      dataUrl: `${base}/data`,
      reportUrl: `${base}/report`,
      bundleUrl: `${base}/bundle`,
      evidenceFiles,
      counts: {
        requirements: data.requirements.length,
        tests: data.tests.length,
        risks: data.risks.length,
        capas: data.capas.length,
        approvals: data.approvals.length,
        signatures: data.signatures.length,
        auditLogs: data.auditLogs.length,
        evidenceFiles: data.evidences.length,
      },
    });
  } catch (error: any) {
    console.error('Export overview error:', error);
    return c.json({ message: 'Failed to generate export overview' }, 500);
  }
});

// GET /:projectId/report — HTML report
exportRoutes.get('/:projectId/report', async (c) => {
  try {
    const { projectId } = c.req.param();

    const data = await gatherProjectData(projectId);
    if (!data) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const html = buildHtmlReport(data);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="qatrial-report-${projectId.slice(0, 8)}.html"`,
      },
    });
  } catch (error: any) {
    console.error('Export report error:', error);
    return c.json({ message: 'Failed to generate report' }, 500);
  }
});

// GET /:projectId/data — JSON data dump
exportRoutes.get('/:projectId/data', async (c) => {
  try {
    const { projectId } = c.req.param();

    const data = await gatherProjectData(projectId);
    if (!data) {
      return c.json({ message: 'Project not found' }, 404);
    }

    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="qatrial-data-${projectId.slice(0, 8)}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Export data error:', error);
    return c.json({ message: 'Failed to generate data export' }, 500);
  }
});

// GET /:projectId/bundle — combined bundle (JSON with embedded HTML)
exportRoutes.get('/:projectId/bundle', async (c) => {
  try {
    const { projectId } = c.req.param();

    const data = await gatherProjectData(projectId);
    if (!data) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const html = buildHtmlReport(data);

    const bundle = {
      exportedAt: new Date().toISOString(),
      format: 'qatrial-bundle-v1',
      project: data.project,
      data: {
        requirements: data.requirements,
        tests: data.tests,
        risks: data.risks,
        capas: data.capas,
        approvals: data.approvals,
        signatures: data.signatures,
        auditLogs: data.auditLogs,
        evidences: data.evidences.map((e) => ({
          id: e.id,
          fileName: e.fileName,
          entityType: e.entityType,
          entityId: e.entityId,
          fileSize: e.fileSize,
          mimeType: e.mimeType,
          uploadedBy: e.uploadedBy,
          createdAt: e.createdAt,
        })),
      },
      htmlReport: html,
    };

    return new Response(JSON.stringify(bundle, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="qatrial-bundle-${projectId.slice(0, 8)}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Export bundle error:', error);
    return c.json({ message: 'Failed to generate bundle export' }, 500);
  }
});

// ── CSV Export Helpers ─────────────────────────────────────────────────────

const CSV_BOM = '\ufeff'; // UTF-8 BOM for Excel compatibility

function escapeCsvField(value: string | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // Always quote fields for safety
  return `"${str.replace(/"/g, '""')}"`;
}

function formatCsvDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toISOString();
}

function buildRequirementsCsv(requirements: any[]): string {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Tags', 'Risk Level', 'Regulatory Ref', 'Created', 'Updated'];
  const rows = requirements.map((r) => [
    escapeCsvField(r.seqId),
    escapeCsvField(r.title),
    escapeCsvField(r.description),
    escapeCsvField(r.status),
    escapeCsvField(Array.isArray(r.tags) ? r.tags.join(', ') : ''),
    escapeCsvField(r.riskLevel),
    escapeCsvField(r.regulatoryRef),
    escapeCsvField(formatCsvDate(r.createdAt)),
    escapeCsvField(formatCsvDate(r.updatedAt)),
  ]);

  return CSV_BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function buildTestsCsv(tests: any[]): string {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Linked Requirements', 'Created', 'Updated'];
  const rows = tests.map((t) => [
    escapeCsvField(t.seqId),
    escapeCsvField(t.title),
    escapeCsvField(t.description),
    escapeCsvField(t.status),
    escapeCsvField(Array.isArray(t.linkedRequirementIds) ? t.linkedRequirementIds.join(', ') : ''),
    escapeCsvField(formatCsvDate(t.createdAt)),
    escapeCsvField(formatCsvDate(t.updatedAt)),
  ]);

  return CSV_BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function buildRisksCsv(risks: any[]): string {
  const headers = ['ID', 'Requirement ID', 'Severity', 'Likelihood', 'Detectability', 'Risk Score', 'Risk Level', 'Mitigation', 'Created'];
  const rows = risks.map((r) => [
    escapeCsvField(r.id?.slice(0, 8)),
    escapeCsvField(r.requirementId),
    escapeCsvField(String(r.severity)),
    escapeCsvField(String(r.likelihood)),
    escapeCsvField(String(r.detectability ?? '')),
    escapeCsvField(String(r.riskScore)),
    escapeCsvField(r.riskLevel),
    escapeCsvField(r.mitigationStrategy),
    escapeCsvField(formatCsvDate(r.createdAt)),
  ]);

  return CSV_BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function buildCapaCsv(capas: any[]): string {
  const headers = ['ID', 'Title', 'Status', 'Root Cause', 'Corrective Action', 'Preventive Action', 'Created'];
  const rows = capas.map((ca) => [
    escapeCsvField(ca.id?.slice(0, 8)),
    escapeCsvField(ca.title),
    escapeCsvField(ca.status),
    escapeCsvField(ca.rootCause),
    escapeCsvField(ca.correctiveAction),
    escapeCsvField(ca.preventiveAction),
    escapeCsvField(formatCsvDate(ca.createdAt)),
  ]);

  return CSV_BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// GET /:projectId/csv — CSV export
exportRoutes.get('/:projectId/csv', async (c) => {
  try {
    const { projectId } = c.req.param();
    const type = c.req.query('type') ?? 'requirements';

    const data = await gatherProjectData(projectId);
    if (!data) {
      return c.json({ message: 'Project not found' }, 404);
    }

    let csv: string;
    let filename: string;

    switch (type) {
      case 'requirements':
        csv = buildRequirementsCsv(data.requirements);
        filename = `qatrial-requirements-${projectId.slice(0, 8)}.csv`;
        break;

      case 'tests':
        csv = buildTestsCsv(data.tests);
        filename = `qatrial-tests-${projectId.slice(0, 8)}.csv`;
        break;

      case 'all': {
        // Combine all entity types with section separators
        const sections = [
          '# REQUIREMENTS',
          buildRequirementsCsv(data.requirements).replace(CSV_BOM, ''),
          '',
          '# TESTS',
          buildTestsCsv(data.tests).replace(CSV_BOM, ''),
          '',
          '# RISKS',
          buildRisksCsv(data.risks).replace(CSV_BOM, ''),
          '',
          '# CAPA',
          buildCapaCsv(data.capas).replace(CSV_BOM, ''),
        ];
        csv = CSV_BOM + sections.join('\n');
        filename = `qatrial-all-${projectId.slice(0, 8)}.csv`;
        break;
      }

      default:
        return c.json({ message: 'Invalid type. Use: requirements, tests, or all' }, 400);
    }

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('CSV export error:', error);
    return c.json({ message: 'Failed to export CSV' }, 500);
  }
});

export default exportRoutes;
