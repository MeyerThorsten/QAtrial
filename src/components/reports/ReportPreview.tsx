'use no memo';

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  FileDown,
} from 'lucide-react';
import type { ReportConfig } from '../../types';
import { exportReportAsPDF } from '../../lib/pdfExport';

interface ReportPreviewProps {
  config: ReportConfig;
  onBack: () => void;
}

export function ReportPreview({ config, onBack }: ReportPreviewProps) {
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);
  const [approvedSections, setApprovedSections] = useState<Set<number>>(new Set());
  const [activeTocIndex, setActiveTocIndex] = useState<number | null>(null);
  const projectLabel = config.projectName || config.projectId;

  function toggleApproval(index: number) {
    setApprovedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    if (!reportRef.current) return;

    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${config.type} - ${projectLabel}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; line-height: 1.6; }
    h1 { font-size: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
    h2 { font-size: 18px; margin-top: 32px; color: #1e40af; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    .ai-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px; }
    .meta { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
    pre { white-space: pre-wrap; font-family: inherit; }
  </style>
</head>
<body>
  <h1>${getReportTitle(config.type)}</h1>
  <div class="meta">
    <p>Project: ${projectLabel} | Generated: ${new Date(config.generatedAt).toLocaleString()} | By: ${config.generatedBy}</p>
  </div>
  ${config.sections
    .map(
      (section, i) => `
  <h2>${i + 1}. ${section.title}${section.aiGenerated ? '<span class="ai-badge">AI-generated</span>' : ''}</h2>
  <pre>${escapeHtml(section.content)}</pre>`,
    )
    .join('\n')}
  ${
    config.includeSignatures
      ? `
  <h2>Signatures</h2>
  <table>
    <tr><th>Role</th><th>Name</th><th>Date</th><th>Signature</th></tr>
    <tr><td>Author</td><td></td><td></td><td></td></tr>
    <tr><td>Reviewer</td><td></td><td></td><td></td></tr>
    <tr><td>Approver</td><td></td><td></td><td></td></tr>
  </table>`
      : ''
  }
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.type}-${config.projectId}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function scrollToSection(index: number) {
    setActiveTocIndex(index);
    const el = document.getElementById(`report-section-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReportAsPDF(config, {
              title: getReportTitle(config.type),
              organization: projectLabel,
              pageNumbers: true,
              includeTimestamp: true,
            })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            {t('reports.download')}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table of Contents */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Contents
            </h3>
            <nav className="space-y-1">
              {config.sections.map((section, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(i)}
                  className={`w-full flex items-center gap-1.5 text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    activeTocIndex === i
                      ? 'bg-accent-subtle text-accent font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {i + 1}. {section.title}
                  </span>
                  {section.aiGenerated && (
                    <Sparkles className="w-3 h-3 shrink-0 text-accent" />
                  )}
                </button>
              ))}
            </nav>

            {/* Approval progress */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs text-text-tertiary mb-1">
                Approved: {approvedSections.size} / {config.sections.length}
              </div>
              <div className="w-full h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{
                    width: `${config.sections.length > 0 ? (approvedSections.size / config.sections.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="flex-1 min-w-0 space-y-4">
          {/* Report Header */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h1 className="text-xl font-bold text-text-primary">
              {getReportTitle(config.type)}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-text-tertiary">
              <span>Project: {projectLabel}</span>
              <span>Generated: {new Date(config.generatedAt).toLocaleString()}</span>
              <span>By: {config.generatedBy}</span>
              <span>Format: {config.format.toUpperCase()}</span>
            </div>
          </div>

          {/* Sections */}
          {config.sections.map((section, i) => (
            <div
              key={i}
              id={`report-section-${i}`}
              className="bg-surface rounded-xl border border-border overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-tertiary">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">
                    {i + 1}. {section.title}
                  </span>
                  {section.aiGenerated && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-accent-subtle text-accent font-medium">
                      <Sparkles className="w-3 h-3" />
                      AI-generated
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleApproval(i)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    approvedSections.has(i)
                      ? 'bg-success/10 text-success border border-success/30'
                      : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {approvedSections.has(i) ? 'Approved' : t('reports.approveSection')}
                </button>
              </div>

              {/* Section Content */}
              <div className="px-6 py-4">
                <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">
                  {section.content}
                </pre>
              </div>
            </div>
          ))}

          {/* Signature Block */}
          {config.includeSignatures && (
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-surface-tertiary">
                <span className="text-sm font-semibold text-text-primary">
                  Signatures
                </span>
              </div>
              <div className="p-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-text-tertiary uppercase">
                        Role
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-text-tertiary uppercase">
                        Name
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-text-tertiary uppercase">
                        Date
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-text-tertiary uppercase">
                        Signature
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Author', 'Reviewer', 'Approver'].map((role) => (
                      <tr key={role} className="border-b border-border-subtle last:border-0">
                        <td className="py-3 px-3 text-text-primary font-medium">{role}</td>
                        <td className="py-3 px-3 text-text-tertiary">________________</td>
                        <td className="py-3 px-3 text-text-tertiary">________________</td>
                        <td className="py-3 px-3 text-text-tertiary">________________</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getReportTitle(type: string): string {
  const titles: Record<string, string> = {
    validation_summary: 'Validation Summary Report (VSR)',
    traceability_matrix: 'Traceability Matrix Export',
    gap_analysis: 'Gap Analysis Report',
    risk_assessment: 'Risk Assessment Report',
    executive_brief: 'Executive Compliance Brief',
    submission_package: 'Regulatory Submission Package',
  };
  return titles[type] || type;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
