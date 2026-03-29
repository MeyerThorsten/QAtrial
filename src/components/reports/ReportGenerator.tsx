'use no memo';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  GitBranch,
  Search,
  ShieldAlert,
  Briefcase,
  Package,
  Loader2,
  Download,
  AlertTriangle,
} from 'lucide-react';
import type { ReportType, ReportConfig, ReportSection } from '../../types';
import { useProjectStore } from '../../store/useProjectStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { generateVSR } from '../../ai/prompts/vsrReport';
import { generateExecutiveBrief } from '../../ai/prompts/executiveBrief';
import { ReportPreview } from './ReportPreview';

interface ReportTypeCard {
  type: ReportType;
  labelKey: string;
  description: string;
  icon: React.ReactNode;
}

const REPORT_TYPES: ReportTypeCard[] = [
  {
    type: 'validation_summary',
    labelKey: 'reports.validationSummary',
    description: 'Complete VSR with executive summary, traceability, and conclusion.',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    type: 'traceability_matrix',
    labelKey: 'reports.traceabilityExport',
    description: 'Full requirement-to-test traceability with coverage analysis.',
    icon: <GitBranch className="w-6 h-6" />,
  },
  {
    type: 'gap_analysis',
    labelKey: 'reports.gapReport',
    description: 'Regulatory gap analysis against applicable standards.',
    icon: <Search className="w-6 h-6" />,
  },
  {
    type: 'risk_assessment',
    labelKey: 'reports.riskReport',
    description: 'Risk assessment summary with mitigation strategies.',
    icon: <ShieldAlert className="w-6 h-6" />,
  },
  {
    type: 'executive_brief',
    labelKey: 'reports.executiveBrief',
    description: 'C-level compliance status brief with key metrics and actions.',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    type: 'submission_package',
    labelKey: 'reports.submissionPackage',
    description: 'Regulatory submission package for target authority.',
    icon: <Package className="w-6 h-6" />,
  },
];

const TARGET_AUTHORITIES = [
  { value: 'fda', label: 'FDA (United States)' },
  { value: 'ema', label: 'EMA (European Union)' },
  { value: 'mhra', label: 'MHRA (United Kingdom)' },
  { value: 'pmda', label: 'PMDA (Japan)' },
  { value: 'hc', label: 'Health Canada' },
  { value: 'tga', label: 'TGA (Australia)' },
  { value: 'anvisa', label: 'ANVISA (Brazil)' },
  { value: 'nmpa', label: 'NMPA (China)' },
];

export function ReportGenerator() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [format, setFormat] = useState<'html' | 'pdf'>('html');
  const [includeSignatures, setIncludeSignatures] = useState(false);
  const [targetAuthority, setTargetAuthority] = useState('fda');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportConfig, setReportConfig] = useState<ReportConfig | null>(null);

  async function handleGenerate() {
    if (!selectedType || !project) return;

    setGenerating(true);
    setError(null);
    setReportConfig(null);

    try {
      let sections: ReportSection[] = [];

      switch (selectedType) {
        case 'validation_summary': {
          sections = await generateVSR(project, requirements, tests);
          break;
        }

        case 'traceability_matrix': {
          const coveredIds = new Set(tests.flatMap((t) => t.linkedRequirementIds));
          const rows = requirements.map((req) => {
            const linked = tests.filter((t) => t.linkedRequirementIds.includes(req.id));
            return `| ${req.id} | ${req.title} | ${req.status} | ${linked.map((t) => `${t.id} (${t.status})`).join(', ') || 'None'} |`;
          });
          const coveredCount = requirements.filter((r) => coveredIds.has(r.id)).length;
          sections = [
            {
              title: 'Traceability Matrix',
              content: `| Requirement | Title | Status | Linked Tests |\n|---|---|---|---|\n${rows.join('\n')}\n\nCoverage: ${coveredCount} of ${requirements.length} requirements covered (${requirements.length > 0 ? ((coveredCount / requirements.length) * 100).toFixed(1) : '0.0'}%)`,
              aiGenerated: false,
            },
          ];
          break;
        }

        case 'gap_analysis': {
          const gaps = requirements.filter((r) => {
            const hasTests = tests.some((t) => t.linkedRequirementIds.includes(r.id));
            return !hasTests;
          });
          sections = [
            {
              title: 'Gap Analysis Summary',
              content: `Requirements without test coverage: ${gaps.length} of ${requirements.length}\n\n${gaps.length > 0 ? gaps.map((r) => `- ${r.id}: ${r.title} (${r.status})`).join('\n') : 'All requirements have test coverage.'}`,
              aiGenerated: false,
            },
          ];
          break;
        }

        case 'risk_assessment': {
          const byRisk = {
            critical: requirements.filter((r) => r.riskLevel === 'critical'),
            high: requirements.filter((r) => r.riskLevel === 'high'),
            medium: requirements.filter((r) => r.riskLevel === 'medium'),
            low: requirements.filter((r) => r.riskLevel === 'low'),
            unassessed: requirements.filter((r) => !r.riskLevel),
          };
          sections = [
            {
              title: 'Risk Assessment Summary',
              content: `Risk Distribution:\n- Critical: ${byRisk.critical.length}\n- High: ${byRisk.high.length}\n- Medium: ${byRisk.medium.length}\n- Low: ${byRisk.low.length}\n- Unassessed: ${byRisk.unassessed.length}\n\n${byRisk.critical.length > 0 ? `Critical Requirements:\n${byRisk.critical.map((r) => `- ${r.id}: ${r.title}`).join('\n')}` : 'No critical risk requirements.'}`,
              aiGenerated: false,
            },
          ];
          break;
        }

        case 'executive_brief': {
          const coveredReqIds = new Set(tests.flatMap((t) => t.linkedRequirementIds));
          const coveredReqs = requirements.filter((r) => coveredReqIds.has(r.id)).length;
          const briefText = await generateExecutiveBrief({
            projectName: project.name,
            country: project.country || 'US',
            vertical: project.vertical,
            standards: [],
            totalReqs: requirements.length,
            coveredReqs,
            coveragePct: requirements.length > 0 ? (coveredReqs / requirements.length) * 100 : 0,
            totalTests: tests.length,
            passedTests: tests.filter((t) => t.status === 'Passed').length,
            failedTests: tests.filter((t) => t.status === 'Failed').length,
            criticalRisks: requirements.filter((r) => r.riskLevel === 'critical').length,
            highRisks: requirements.filter((r) => r.riskLevel === 'high').length,
            missingClauses: 0,
          });
          sections = [
            {
              title: 'Executive Compliance Brief',
              content: briefText,
              aiGenerated: true,
            },
          ];
          break;
        }

        case 'submission_package': {
          const authority = TARGET_AUTHORITIES.find((a) => a.value === targetAuthority);
          sections = [
            {
              title: 'Submission Package Cover',
              content: `Regulatory Submission Package\nTarget Authority: ${authority?.label || targetAuthority}\nProject: ${project.name} v${project.version}\nDate: ${new Date().toISOString().split('T')[0]}\n\nThis package contains validation documentation for regulatory submission.`,
              aiGenerated: false,
            },
          ];
          // For a full submission, include VSR sections as well
          const vsrSections = await generateVSR(project, requirements, tests);
          sections = [...sections, ...vsrSections];
          break;
        }
      }

      const config: ReportConfig = {
        type: selectedType,
        projectId: project.name,
        format,
        includeSignatures,
        targetAuthority: selectedType === 'submission_package' ? targetAuthority : undefined,
        generatedAt: new Date().toISOString(),
        generatedBy: project.owner || 'System',
        sections,
      };

      setReportConfig(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  }

  // If we have a generated report, show the preview
  if (reportConfig) {
    return (
      <ReportPreview
        config={reportConfig}
        onBack={() => setReportConfig(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {t('reports.selectType')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt.type}
              onClick={() => setSelectedType(rt.type)}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                selectedType === rt.type
                  ? 'bg-accent-subtle border-accent ring-2 ring-accent/20'
                  : 'bg-surface border-border hover:border-accent/40 hover:bg-surface-hover'
              }`}
            >
              <div
                className={`shrink-0 p-2 rounded-lg ${
                  selectedType === rt.type
                    ? 'bg-accent text-text-inverse'
                    : 'bg-surface-tertiary text-text-secondary'
                }`}
              >
                {rt.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-primary">
                  {t(rt.labelKey)}
                </div>
                <div className="text-xs text-text-tertiary mt-0.5 line-clamp-2">
                  {rt.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration */}
      {selectedType && (
        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Format */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                {t('reports.format')}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'html' | 'pdf')}
                className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
              >
                <option value="html">HTML</option>
                <option value="pdf">PDF (coming soon)</option>
              </select>
            </div>

            {/* Target Authority (only for submission packages) */}
            {selectedType === 'submission_package' && (
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  {t('reports.targetAuthority')}
                </label>
                <select
                  value={targetAuthority}
                  onChange={(e) => setTargetAuthority(e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                >
                  {TARGET_AUTHORITIES.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Include Signatures Toggle */}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSignatures}
              onChange={(e) => setIncludeSignatures(e.target.checked)}
              className="w-4 h-4 rounded border-input-border text-accent focus:ring-accent/40"
            />
            <span className="text-sm text-text-primary">
              {t('reports.includeSignatures')}
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-subtle text-danger text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={generating || !project}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('reports.generating')}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {t('reports.generate')}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* No project warning */}
      {!project && (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <p className="text-text-secondary">
            Create a project first to generate reports.
          </p>
        </div>
      )}
    </div>
  );
}
