import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Download,
  FileText,
  ChevronDown,
  ChevronRight,
  Clock,
  ShieldCheck,
  Inbox,
} from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuditStore } from '../../store/useAuditStore';
import { useApiAudit } from '../../hooks/useApiAudit';
import { getProjectId } from '../../lib/projectUtils';
import type { AuditEntry } from '../../types';

interface Props {
  entityId?: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-badge-active-bg text-badge-active-text',
  update: 'bg-accent-subtle text-accent',
  delete: 'bg-danger-subtle text-danger',
  status_change: 'bg-badge-draft-bg text-badge-draft-text',
  link: 'bg-accent-subtle text-accent',
  unlink: 'bg-badge-notrun-bg text-badge-notrun-text',
  approve: 'bg-badge-passed-bg text-badge-passed-text',
  reject: 'bg-danger-subtle text-danger',
  sign: 'bg-accent-subtle text-accent',
  export: 'bg-badge-draft-bg text-badge-draft-text',
  generate_report: 'bg-badge-draft-bg text-badge-draft-text',
  ai_generate: 'bg-accent-subtle text-accent',
  ai_accept: 'bg-badge-passed-bg text-badge-passed-text',
  ai_reject: 'bg-danger-subtle text-danger',
  login: 'bg-badge-active-bg text-badge-active-text',
  logout: 'bg-badge-notrun-bg text-badge-notrun-text',
  import: 'bg-badge-draft-bg text-badge-draft-text',
};

function humanizeAction(action: string): string {
  return action.replace(/_/g, ' ');
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' ' + d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function toDateInputValue(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function AuditTrailViewer({ entityId }: Props) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const isServerMode = mode === 'server';
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);
  const allEntries = useAuditStore((s) => s.entries);
  const auditApi = useApiAudit(isServerMode ? projectId : '');
  const sourceEntries = isServerMode && projectId ? auditApi.entries : allEntries;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [dateFrom, setDateFrom] = useState(toDateInputValue(thirtyDaysAgo));
  const [dateTo, setDateTo] = useState(toDateInputValue(now));
  const [expandedDiffs, setExpandedDiffs] = useState<Set<string>>(new Set());

  const filteredEntries = useMemo(() => {
    let entries = entityId
      ? sourceEntries.filter((e) => e.entityId === entityId)
      : sourceEntries;

    const from = new Date(dateFrom + 'T00:00:00').getTime();
    const to = new Date(dateTo + 'T23:59:59').getTime();

    entries = entries.filter((e) => {
      const ts = new Date(e.timestamp).getTime();
      return ts >= from && ts <= to;
    });

    // Sort newest first
    return [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [dateFrom, dateTo, entityId, sourceEntries]);

  const toggleDiff = (id: string) => {
    setExpandedDiffs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exportCSV = () => {
    if (isServerMode && projectId) {
      void auditApi.exportCsv();
      return;
    }

    const headers = ['Timestamp', 'Action', 'User', 'Entity Type', 'Entity ID', 'Previous Value', 'New Value', 'Reason', 'Signature Meaning', 'Signer'];
    const rows = filteredEntries.map((e) => [
      e.timestamp,
      e.action,
      e.userName,
      e.entityType,
      e.entityId,
      e.previousValue ?? '',
      e.newValue ?? '',
      e.reason ?? '',
      e.signature?.meaning ?? '',
      e.signature?.signerName ?? '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  const getActionLabel = (action: string): string => {
    const translated = t(`audit.actions.${action}`);
    return translated === `audit.actions.${action}` ? humanizeAction(action) : translated;
  };

  const renderDiff = (entry: AuditEntry) => {
    if (!entry.previousValue && !entry.newValue) return null;
    const isExpanded = expandedDiffs.has(entry.id);

    return (
      <div className="mt-2">
        <button
          onClick={() => toggleDiff(entry.id)}
          className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
        >
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {t('audit.viewDiff')}
        </button>
        {isExpanded && (
          <div className="mt-1.5 rounded-lg border border-border bg-surface-tertiary p-3 text-xs font-mono space-y-2">
            {entry.previousValue && (
              <div>
                <span className="text-danger font-medium">- Previous:</span>
                <pre className="mt-0.5 text-text-secondary whitespace-pre-wrap break-words">{entry.previousValue}</pre>
              </div>
            )}
            {entry.newValue && (
              <div>
                <span className="text-success font-medium">+ New:</span>
                <pre className="mt-0.5 text-text-secondary whitespace-pre-wrap break-words">{entry.newValue}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSignature = (entry: AuditEntry) => {
    if (!entry.signature) return null;
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>
          {t('audit.signedBy', {
            meaning: t(`signature.${entry.signature.meaning}`),
            name: entry.signature.signerName,
          })}
        </span>
        <span className="text-text-tertiary">({entry.signature.method})</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 print:space-y-2">
      {/* Filters & Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-secondary">{t('common.search')}</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-1.5 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
          />
          <span className="text-text-tertiary text-sm">-</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-1.5 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t('audit.exportCSV')}
          </button>
          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            {t('audit.exportPDF')}
          </button>
        </div>
      </div>

      {/* Timeline */}
      {filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
          <Inbox className="w-10 h-10 mb-3" />
          <p className="text-sm font-medium">{t('common.noData')}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border print:hidden" />

          <div className="space-y-0">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="relative flex gap-4 pb-4">
                {/* Timeline dot */}
                <div className="relative z-10 mt-1.5 flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center ${
                      entry.signature ? 'bg-accent' : 'bg-surface-tertiary'
                    }`}
                  >
                    {entry.signature ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                    )}
                  </div>
                </div>

                {/* Entry content */}
                <div className="flex-1 bg-surface rounded-lg border border-border p-3 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {/* Action badge */}
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        ACTION_COLORS[entry.action] ?? 'bg-surface-tertiary text-text-secondary'
                      }`}
                    >
                      {getActionLabel(entry.action)}
                    </span>

                    {/* Entity type + ID */}
                    <span className="text-xs text-text-tertiary font-mono">
                      {entry.entityType}/{entry.entityId}
                    </span>

                    {/* Timestamp */}
                    <span className="text-xs text-text-tertiary ml-auto">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>

                  {/* User */}
                  <p className="text-sm text-text-secondary">
                    {entry.userName}
                  </p>

                  {/* Reason */}
                  {entry.reason && (
                    <div className="mt-1.5 text-xs text-text-secondary">
                      <span className="font-medium text-text-primary">{t('audit.reason')}:</span>{' '}
                      {entry.reason}
                    </div>
                  )}

                  {/* Diff */}
                  {(entry.previousValue || entry.newValue) && renderDiff(entry)}

                  {/* Signature details */}
                  {renderSignature(entry)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
