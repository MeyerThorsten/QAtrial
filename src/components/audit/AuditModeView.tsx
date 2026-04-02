import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, Printer, Download, AlertTriangle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

type AuditTab = 'overview' | 'requirements' | 'tests' | 'traceability' | 'evidence' | 'audit-trail' | 'signatures';

interface AuditModeViewProps {
  token: string;
}

async function auditFetch<T>(token: string, endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}/audit-mode/${token}/${endpoint}`);
  if (res.status === 410) throw new Error('expired');
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export function AuditModeView({ token }: AuditModeViewProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AuditTab>('overview');
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [project, setProject] = useState<any>(null);
  const [auditMeta, setAuditMeta] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [traceability, setTraceability] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [signatures, setSignatures] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projData, reqData, testData, traceData, evidData, trailData, sigData] = await Promise.all([
          auditFetch<any>(token, 'project'),
          auditFetch<any>(token, 'requirements'),
          auditFetch<any>(token, 'tests'),
          auditFetch<any>(token, 'traceability'),
          auditFetch<any>(token, 'evidence'),
          auditFetch<any>(token, 'audit-trail'),
          auditFetch<any>(token, 'signatures'),
        ]);

        setProject(projData.project);
        setAuditMeta(projData.auditMeta);
        setRequirements(reqData.requirements || []);
        setTests(testData.tests || []);
        setTraceability(traceData);
        setEvidence(evidData.evidence || []);
        setAuditTrail(trailData.trail || []);
        setSignatures(sigData.signatures || []);
      } catch (err: any) {
        if (err.message === 'expired') {
          setExpired(true);
        } else {
          setError('Failed to load audit data');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const passRate = useMemo(() => {
    if (tests.length === 0) return 0;
    return Math.round((tests.filter((t) => t.status === 'Passed').length / tests.length) * 100);
  }, [tests]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <div className="bg-surface rounded-xl border border-border p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-lg font-bold text-text-primary mb-2">{t('auditMode.expired')}</h2>
          <p className="text-sm text-text-secondary">This audit link is no longer valid. Please request a new link from the project administrator.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <div className="bg-surface rounded-xl border border-border p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-danger mx-auto mb-4" />
          <h2 className="text-lg font-bold text-text-primary mb-2">Error</h2>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  const tabs: { id: AuditTab; label: string }[] = [
    { id: 'overview', label: t('auditMode.overview') },
    { id: 'requirements', label: t('nav.requirements') },
    { id: 'tests', label: t('nav.tests') },
    { id: 'traceability', label: t('auditMode.traceability') },
    { id: 'evidence', label: t('evidence.title') },
    { id: 'audit-trail', label: t('audit.title') },
    { id: 'signatures', label: t('auditMode.signatures') },
  ];

  const handlePrint = () => window.print();

  const handleDownloadReport = () => {
    window.open(`${API_BASE}/audit-mode/${token}/report`, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Warning banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('auditMode.readOnly')} &mdash; {auditMeta?.createdAt && t('auditMode.expires', { date: new Date(auditMeta.createdAt).toLocaleDateString() })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/50 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              {t('auditMode.print')}
            </button>
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/50 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {t('auditMode.downloadReport')}
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center">
                <span className="text-xs font-bold text-white">QA</span>
              </div>
              <h1 className="text-lg font-bold text-text-primary">{t('auditMode.title')}</h1>
              {project && (
                <>
                  <span className="text-border">/</span>
                  <span className="text-sm font-medium text-text-secondary">{project.name}</span>
                </>
              )}
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                {t('auditMode.readOnly')}
              </span>
            </div>
            {auditMeta?.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <Clock className="w-3.5 h-3.5" />
                <span>Link created: {new Date(auditMeta.createdAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Tab nav */}
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <SummaryCard label="Requirements" value={requirements.length} />
              <SummaryCard label="Tests" value={tests.length} />
              <SummaryCard label="Pass Rate" value={`${passRate}%`} />
              <SummaryCard label="Signatures" value={signatures.length} />
            </div>

            {/* Project info */}
            {project && (
              <div className="bg-surface rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Project Details</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-text-tertiary">Name</dt><dd className="font-medium text-text-primary">{project.name}</dd></div>
                  <div><dt className="text-text-tertiary">Version</dt><dd className="font-medium text-text-primary">{project.version || '-'}</dd></div>
                  <div><dt className="text-text-tertiary">Country</dt><dd className="font-medium text-text-primary">{project.country || '-'}</dd></div>
                  <div><dt className="text-text-tertiary">Vertical</dt><dd className="font-medium text-text-primary">{project.vertical || '-'}</dd></div>
                  <div className="col-span-2"><dt className="text-text-tertiary">Description</dt><dd className="font-medium text-text-primary">{project.description || '-'}</dd></div>
                </dl>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requirements' && (
          <ReadOnlyTable
            title="Requirements"
            columns={['ID', 'Title', 'Status', 'Risk Level']}
            rows={requirements.map((r) => [r.id, r.title, r.status, r.riskLevel || '-'])}
          />
        )}

        {activeTab === 'tests' && (
          <ReadOnlyTable
            title="Tests"
            columns={['ID', 'Title', 'Status']}
            rows={tests.map((t) => [t.id, t.title, t.status])}
          />
        )}

        {activeTab === 'traceability' && traceability && (
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Traceability Matrix</h3>
            <div className="text-sm text-text-secondary mb-3">
              {traceability.requirements?.length || 0} requirements, {traceability.tests?.length || 0} tests, {traceability.links?.length || 0} links
            </div>
            <ReadOnlyTable
              title=""
              columns={['Requirement ID', 'Test ID']}
              rows={(traceability.links || []).map((l: any) => [l.requirementId, l.testId])}
            />
          </div>
        )}

        {activeTab === 'evidence' && (
          <ReadOnlyTable
            title="Evidence"
            columns={['Entity', 'File Name', 'Type', 'Size', 'Uploaded By', 'Date']}
            rows={evidence.map((e) => [
              `${e.entityType} ${e.entityId}`,
              e.fileName,
              e.evidenceType || '-',
              e.fileSize ? `${Math.round(e.fileSize / 1024)} KB` : '-',
              e.uploadedBy || '-',
              e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '-',
            ])}
          />
        )}

        {activeTab === 'audit-trail' && (
          <ReadOnlyTable
            title="Audit Trail"
            columns={['Action', 'Entity', 'User', 'Date', 'Reason']}
            rows={auditTrail.map((a) => [
              a.action,
              `${a.entityType} ${a.entityId || ''}`,
              a.userName || a.userId || '-',
              a.createdAt ? new Date(a.createdAt).toLocaleString() : '-',
              a.reason || '-',
            ])}
          />
        )}

        {activeTab === 'signatures' && (
          <ReadOnlyTable
            title="Signatures"
            columns={['Entity', 'Meaning', 'Signed By', 'Date']}
            rows={signatures.map((s) => [
              `${s.entityType} ${s.entityId}`,
              s.meaning,
              s.signerName || s.signerId || '-',
              s.createdAt ? new Date(s.createdAt).toLocaleString() : '-',
            ])}
          />
        )}
      </main>
    </div>
  );
}

// ── Helper Components ───────────────────────────────────────────────────────

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 text-center">
      <div className="text-2xl font-bold text-accent">{value}</div>
      <div className="text-xs text-text-tertiary mt-1">{label}</div>
    </div>
  );
}

function ReadOnlyTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      {title && <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>}
      {rows.length === 0 ? (
        <p className="text-sm text-text-tertiary">No data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {columns.map((col) => (
                  <th key={col} className="text-left py-2 px-3 font-medium text-text-secondary whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 px-3 text-text-primary">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
