/**
 * PDF Export Utility
 *
 * Generates print-optimized HTML documents that can be saved as PDF
 * via the browser's print dialog (Ctrl/Cmd+P → Save as PDF).
 *
 * For production/server-side PDF generation, integrate a library like
 * Puppeteer, wkhtmltopdf, or a commercial PDF API. This client-side
 * approach works for V1 without server dependencies.
 */

import type { ReportConfig } from '../types';

interface PDFOptions {
  /** Document title */
  title: string;
  /** Page orientation */
  orientation?: 'portrait' | 'landscape';
  /** Include page numbers */
  pageNumbers?: boolean;
  /** Include generation timestamp */
  includeTimestamp?: boolean;
  /** Company/organization name for header */
  organization?: string;
  /** Document classification (e.g., "CONFIDENTIAL") */
  classification?: string;
}

/**
 * Generate a print-optimized HTML document from a report config.
 * Opens in a new window with print styles applied.
 */
export function exportReportAsPDF(config: ReportConfig, options: PDFOptions): void {
  const html = buildPrintHTML(config, options);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // Popup blocked — fall back to download
    downloadHTML(html, `${config.type}-${config.projectId}.html`);
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  // Delay print to allow CSS to load
  setTimeout(() => printWindow.print(), 500);
}

/**
 * Download a report as HTML file (fallback when popup is blocked).
 */
export function downloadHTML(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildPrintHTML(config: ReportConfig, options: PDFOptions): string {
  const orientation = options.orientation || 'portrait';
  const now = new Date().toLocaleString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(options.title)}</title>
  <style>
    @page {
      size: A4 ${orientation};
      margin: 20mm 15mm 25mm 15mm;
      @top-center { content: "${escapeHtml(options.organization || 'QAtrial')}"; font-size: 9pt; color: #666; }
      @bottom-left { content: "${escapeHtml(options.title)}"; font-size: 8pt; color: #999; }
      @bottom-right { content: "Page " counter(page) " of " counter(pages); font-size: 8pt; color: #999; }
    }

    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Cover page */
    .cover {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      text-align: center;
    }
    .cover h1 { font-size: 28pt; color: #1e40af; margin-bottom: 16px; }
    .cover .project { font-size: 16pt; color: #374151; margin-bottom: 8px; }
    .cover .meta { font-size: 10pt; color: #6b7280; margin-top: 24px; }
    ${options.classification ? `.cover .classification { font-size: 12pt; color: #dc2626; font-weight: bold; text-transform: uppercase; margin-top: 16px; letter-spacing: 2px; border: 2px solid #dc2626; padding: 4px 16px; }` : ''}

    /* Table of Contents */
    .toc { page-break-after: always; }
    .toc h2 { font-size: 16pt; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 4px; }
    .toc-entry { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dotted #d1d5db; }
    .toc-entry span:first-child { color: #374151; }
    .toc-entry span:last-child { color: #6b7280; }

    /* Sections */
    h2 { font-size: 16pt; color: #1e40af; margin-top: 24pt; page-break-after: avoid; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .section { page-break-inside: avoid; margin-bottom: 16pt; }
    .ai-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 1px 6px; border-radius: 3px; font-size: 8pt; margin-left: 8px; vertical-align: middle; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; margin: 8pt 0; font-size: 9pt; }
    th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; color: #374151; }

    /* Content */
    pre { white-space: pre-wrap; word-break: break-word; font-family: inherit; font-size: 10pt; line-height: 1.6; }

    /* Signature block */
    .signatures { margin-top: 32pt; }
    .signatures table { font-size: 10pt; }
    .signatures td { min-height: 40px; vertical-align: bottom; }

    /* Print utilities */
    .no-print { display: none !important; }
    @media screen {
      body { max-width: 800px; margin: 20px auto; padding: 20px; }
      .cover { min-height: 60vh; }
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover">
    ${options.classification ? `<div class="classification">${escapeHtml(options.classification)}</div>` : ''}
    <h1>${escapeHtml(getReportTitle(config.type))}</h1>
    <div class="project">${escapeHtml(config.projectId)}</div>
    <div class="meta">
      <p>Generated: ${escapeHtml(new Date(config.generatedAt).toLocaleString())}</p>
      <p>Generated By: ${escapeHtml(config.generatedBy)}</p>
      ${config.targetAuthority ? `<p>Target Authority: ${escapeHtml(config.targetAuthority.toUpperCase())}</p>` : ''}
      <p>Document ID: ${escapeHtml(config.type)}-${escapeHtml(config.projectId)}-${new Date(config.generatedAt).toISOString().split('T')[0]}</p>
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="toc">
    <h2>Table of Contents</h2>
    ${config.sections.map((s, i) => `
    <div class="toc-entry">
      <span>${i + 1}. ${escapeHtml(s.title)}${s.aiGenerated ? ' <span class="ai-badge">AI</span>' : ''}</span>
      <span>${i + 1}</span>
    </div>`).join('')}
    ${config.includeSignatures ? `
    <div class="toc-entry">
      <span>${config.sections.length + 1}. Signatures</span>
      <span>${config.sections.length + 1}</span>
    </div>` : ''}
  </div>

  <!-- Sections -->
  ${config.sections.map((s, i) => `
  <div class="section">
    <h2>${i + 1}. ${escapeHtml(s.title)}${s.aiGenerated ? '<span class="ai-badge">AI-generated</span>' : ''}</h2>
    <pre>${escapeHtml(s.content)}</pre>
  </div>`).join('')}

  ${config.includeSignatures ? `
  <!-- Signatures -->
  <div class="signatures">
    <h2>${config.sections.length + 1}. Signatures</h2>
    <p style="font-size: 9pt; color: #6b7280;">By signing below, the undersigned certifies that they have reviewed this document and the information contained herein is accurate and complete.</p>
    <table>
      <thead>
        <tr>
          <th style="width:20%">Role</th>
          <th style="width:25%">Print Name</th>
          <th style="width:30%">Signature</th>
          <th style="width:25%">Date</th>
        </tr>
      </thead>
      <tbody>
        ${['Author', 'Reviewer', 'Quality Assurance', 'Approver'].map((role) => `
        <tr>
          <td>${role}</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  <!-- Footer -->
  <div style="margin-top: 40pt; padding-top: 8pt; border-top: 1px solid #e5e7eb; font-size: 8pt; color: #9ca3af; text-align: center;">
    Generated by QAtrial — ${escapeHtml(now)}
  </div>
</body>
</html>`;
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
