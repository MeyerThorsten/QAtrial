import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useProjectStore } from '../../store/useProjectStore';

interface ExportPanelProps {
  open: boolean;
  onClose: () => void;
}

type ExportType = 'requirements' | 'tests' | 'all';

const CSV_BOM = '\ufeff';

function escapeCsvField(value: string | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export function ExportPanel({ open, onClose }: ExportPanelProps) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const isServer = mode === 'server';
  const project = useProjectStore((s) => s.project);
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  const [exportType, setExportType] = useState<ExportType>('requirements');
  const [exporting, setExporting] = useState(false);

  const triggerDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildRequirementsCsv = (): string => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Tags', 'Risk Level', 'Regulatory Ref', 'Created', 'Updated'];
    const rows = requirements.map((r) => [
      escapeCsvField(r.id),
      escapeCsvField(r.title),
      escapeCsvField(r.description),
      escapeCsvField(r.status),
      escapeCsvField(r.tags?.join(', ') ?? ''),
      escapeCsvField(r.riskLevel ?? ''),
      escapeCsvField(r.regulatoryRef ?? ''),
      escapeCsvField(r.createdAt),
      escapeCsvField(r.updatedAt),
    ]);
    return CSV_BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const buildTestsCsv = (): string => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Linked Requirements', 'Created', 'Updated'];
    const rows = tests.map((t) => [
      escapeCsvField(t.id),
      escapeCsvField(t.title),
      escapeCsvField(t.description),
      escapeCsvField(t.status),
      escapeCsvField(t.linkedRequirementIds.join(', ')),
      escapeCsvField(t.createdAt),
      escapeCsvField(t.updatedAt),
    ]);
    return CSV_BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handleExport = async () => {
    setExporting(true);

    if (isServer && project) {
      // Server mode: fetch from API
      try {
        const projectId = (project as any).id ?? project.name;
        const token = localStorage.getItem('qatrial:token');
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${API_BASE}/export/${projectId}/csv?type=${exportType}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error('Export failed');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qatrial-${exportType}-${projectId.slice(0, 8)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        // Fallback to local export
        exportLocally();
      }
    } else {
      exportLocally();
    }

    setExporting(false);
  };

  const exportLocally = () => {
    const name = project?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'export';

    switch (exportType) {
      case 'requirements':
        triggerDownload(buildRequirementsCsv(), `qatrial-requirements-${name}.csv`);
        break;
      case 'tests':
        triggerDownload(buildTestsCsv(), `qatrial-tests-${name}.csv`);
        break;
      case 'all':
        triggerDownload(
          CSV_BOM + [
            '# REQUIREMENTS',
            buildRequirementsCsv().replace(CSV_BOM, ''),
            '',
            '# TESTS',
            buildTestsCsv().replace(CSV_BOM, ''),
          ].join('\n'),
          `qatrial-all-${name}.csv`,
        );
        break;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">{t('import.exportCsv')}</h2>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-2">
              {t('reports.selectType')}
            </label>
            <div className="space-y-1">
              {[
                { key: 'requirements' as ExportType, label: t('import.exportRequirements'), count: requirements.length },
                { key: 'tests' as ExportType, label: t('import.exportTests'), count: tests.length },
                { key: 'all' as ExportType, label: t('import.exportAll'), count: requirements.length + tests.length },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exportType"
                      value={opt.key}
                      checked={exportType === opt.key}
                      onChange={() => setExportType(opt.key)}
                      className="accent-accent"
                    />
                    <span className="text-sm text-text-secondary">{opt.label}</span>
                  </div>
                  <span className="text-xs text-text-tertiary">{opt.count} items</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {t('import.exportCsv')}
          </button>
        </div>
      </div>
    </div>
  );
}
