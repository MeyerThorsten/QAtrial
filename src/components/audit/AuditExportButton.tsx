import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, CheckCircle, Loader2 } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useAuditStore } from '../../store/useAuditStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { getApiBase } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';

interface Props {
  projectId: string;
}

export function AuditExportButton({ projectId }: Props) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const { user } = useAuth();
  const isServerMode = mode === 'server';
  const canExport = roleHasPermission(user?.role, 'canExport');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ dataSize: number; reportSize: number } | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(null);

    try {
      if (isServerMode) {
        await exportFromServer();
      } else {
        await exportFromLocalStorage();
      }
    } catch {
      // Fallback to local
      await exportFromLocalStorage();
    }

    setLoading(false);
  };

  const exportFromServer = async () => {
    const token = localStorage.getItem('qatrial:token');
    const apiBase = getApiBase();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Fetch data export
    const dataRes = await fetch(`${apiBase}/export/${projectId}/data`, { headers });
    const dataBlob = await dataRes.blob();
    downloadBlob(dataBlob, `audit-data-${projectId}-${dateStamp()}.json`);

    // Fetch report export
    const reportRes = await fetch(`${apiBase}/export/${projectId}/report`, { headers });
    const reportBlob = await reportRes.blob();
    downloadBlob(reportBlob, `audit-report-${projectId}-${dateStamp()}.html`);

    setSuccess({
      dataSize: Math.round(dataBlob.size / 1024),
      reportSize: Math.round(reportBlob.size / 1024),
    });
  };

  const exportFromLocalStorage = async () => {
    const project = useProjectStore.getState().project;
    const requirements = useRequirementsStore.getState().requirements;
    const tests = useTestsStore.getState().tests;
    const auditEntries = useAuditStore.getState().entries;

    // JSON data export
    const dataExport = {
      exportedAt: new Date().toISOString(),
      projectId,
      project,
      requirements,
      tests,
      auditTrail: auditEntries,
    };

    const dataJson = JSON.stringify(dataExport, null, 2);
    const dataBlob = new Blob([dataJson], { type: 'application/json' });
    downloadBlob(dataBlob, `audit-data-${projectId}-${dateStamp()}.json`);

    // HTML report export
    const reportHtml = generateHtmlReport(project, requirements, tests, auditEntries);
    const reportBlob = new Blob([reportHtml], { type: 'text/html' });
    downloadBlob(reportBlob, `audit-report-${projectId}-${dateStamp()}.html`);

    setSuccess({
      dataSize: Math.round(dataBlob.size / 1024),
      reportSize: Math.round(reportBlob.size / 1024),
    });

    // Log export action
    useAuditStore.getState().log('export', 'project', projectId);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const dateStamp = () => new Date().toISOString().slice(0, 10);

  const generateHtmlReport = (
    project: ReturnType<typeof useProjectStore.getState>['project'],
    requirements: ReturnType<typeof useRequirementsStore.getState>['requirements'],
    tests: ReturnType<typeof useTestsStore.getState>['tests'],
    auditEntries: ReturnType<typeof useAuditStore.getState>['entries'],
  ): string => {
    const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Audit Report - ${escape(project?.name || projectId)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem; color: #333; }
    h1 { border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; }
    h2 { color: #1e40af; margin-top: 2rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
    th, td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
    .badge-passed { background: #dcfce7; color: #166534; }
    .badge-failed { background: #fce7e7; color: #991b1b; }
    .badge-draft { background: #f3f4f6; color: #6b7280; }
    .meta { color: #6b7280; font-size: 0.875rem; }
    .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #d1d5db; font-size: 0.75rem; color: #9ca3af; }
  </style>
</head>
<body>
  <h1>Audit Report</h1>
  <p class="meta">Project: <strong>${escape(project?.name || projectId)}</strong> | Generated: ${new Date().toISOString()} | QAtrial</p>

  <h2>Summary</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Requirements</td><td>${requirements.length}</td></tr>
    <tr><td>Tests</td><td>${tests.length}</td></tr>
    <tr><td>Audit Entries</td><td>${auditEntries.length}</td></tr>
    <tr><td>Signatures</td><td>${auditEntries.filter((e) => e.signature).length}</td></tr>
  </table>

  <h2>Requirements</h2>
  <table>
    <tr><th>ID</th><th>Title</th><th>Status</th></tr>
    ${requirements.map((r) => `<tr><td>${escape(r.id)}</td><td>${escape(r.title)}</td><td>${escape(r.status)}</td></tr>`).join('\n    ')}
  </table>

  <h2>Tests</h2>
  <table>
    <tr><th>ID</th><th>Title</th><th>Status</th><th>Linked Reqs</th></tr>
    ${tests.map((t) => `<tr><td>${escape(t.id)}</td><td>${escape(t.title)}</td><td>${escape(t.status)}</td><td>${t.linkedRequirementIds.join(', ')}</td></tr>`).join('\n    ')}
  </table>

  <h2>Audit Trail</h2>
  <table>
    <tr><th>Timestamp</th><th>Action</th><th>User</th><th>Entity</th><th>Reason</th><th>Signature</th></tr>
    ${auditEntries.map((e) => `<tr>
      <td>${escape(e.timestamp)}</td>
      <td>${escape(e.action)}</td>
      <td>${escape(e.userName)}</td>
      <td>${escape(e.entityType)}/${escape(e.entityId)}</td>
      <td>${escape(e.reason || '')}</td>
      <td>${e.signature ? escape(`${e.signature.meaning} by ${e.signature.signerName}`) : ''}</td>
    </tr>`).join('\n    ')}
  </table>

  <div class="footer">
    <p>This report was generated by QAtrial. All records are subject to electronic signature verification and audit trail integrity checks.</p>
  </div>
</body>
</html>`;
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleExport}
        disabled={loading || !canExport}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        {loading ? t('common.loading') : t('audit.exportCSV').replace('(CSV)', '')}
      </button>

      {!canExport && (
        <span className="text-xs text-text-tertiary">
          Export not available for your role
        </span>
      )}

      {success && (
        <span className="inline-flex items-center gap-1 text-xs text-success">
          <CheckCircle className="w-3.5 h-3.5" />
          {t('evidence.fileSize', { size: success.dataSize })} + {t('evidence.fileSize', { size: success.reportSize })}
        </span>
      )}
    </div>
  );
}
