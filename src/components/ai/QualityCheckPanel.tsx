import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, AlertCircle, Info, Check, Loader2 } from 'lucide-react';
import { checkRequirementQuality, type QualityIssue } from '../../ai/prompts/qualityCheck';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useProjectStore } from '../../store/useProjectStore';
import type { Requirement } from '../../types';

interface QualityCheckPanelProps {
  requirement: Requirement;
  onClose: () => void;
}

const SEVERITY_ICONS = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const SEVERITY_COLORS = {
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-accent',
};

const SEVERITY_BG = {
  error: 'bg-danger/10 border-danger/20',
  warning: 'bg-warning/10 border-warning/20',
  info: 'bg-accent-subtle border-accent/20',
};

const TYPE_KEYS: Record<QualityIssue['type'], string> = {
  vague: 'quality.vague',
  untestable: 'quality.untestable',
  ambiguous: 'quality.ambiguous',
  incomplete: 'quality.incomplete',
  duplicate_risk: 'quality.duplicateRisk',
  missing_criteria: 'quality.missingCriteria',
};

export function QualityCheckPanel({ requirement, onClose }: QualityCheckPanelProps) {
  const { t } = useTranslation();
  const updateRequirement = useRequirementsStore((s) => s.updateRequirement);
  const project = useProjectStore((s) => s.project);

  const [issues, setIssues] = useState<QualityIssue[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Run quality check on mount
  useState(() => {
    (async () => {
      try {
        const result = await checkRequirementQuality({
          requirement: {
            id: requirement.id,
            title: requirement.title,
            description: requirement.description,
          },
          vertical: project?.vertical,
        });
        setIssues(result);
      } catch (err: any) {
        setError(err.message || 'Quality check failed');
      } finally {
        setLoading(false);
      }
    })();
  });

  const handleApplySuggestion = (issue: QualityIssue) => {
    // Append or replace description with the suggestion
    const currentDesc = requirement.description || '';
    const newDesc = issue.suggestion.length > currentDesc.length
      ? issue.suggestion
      : `${currentDesc}\n\n[Improved]: ${issue.suggestion}`;

    updateRequirement(requirement.id, { description: newDesc });

    // Remove the applied issue from the list
    setIssues((prev) => prev?.filter((i) => i !== issue) ?? null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-text-primary">{t('quality.checkQuality')}</h2>
            <p className="text-xs text-text-tertiary mt-0.5">{requirement.id}: {requirement.title}</p>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
              <span className="ml-2 text-sm text-text-secondary">{t('quality.checking')}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-danger shrink-0" />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          {issues !== null && !loading && (
            <>
              {issues.length === 0 ? (
                <div className="flex items-center gap-2 p-4 bg-badge-passed-bg/30 rounded-lg">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-sm text-text-primary font-medium">{t('quality.noIssues')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary font-medium">
                    {t('quality.issuesFound', { count: issues.length })}
                  </p>

                  {issues.map((issue, i) => {
                    const Icon = SEVERITY_ICONS[issue.severity];
                    return (
                      <div key={i} className={`border rounded-lg p-3 ${SEVERITY_BG[issue.severity]}`}>
                        <div className="flex items-start gap-2">
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${SEVERITY_COLORS[issue.severity]}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold uppercase ${SEVERITY_COLORS[issue.severity]}`}>
                                {t(TYPE_KEYS[issue.type])}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                issue.severity === 'error'
                                  ? 'bg-danger/20 text-danger'
                                  : issue.severity === 'warning'
                                    ? 'bg-warning/20 text-warning'
                                    : 'bg-accent/20 text-accent'
                              }`}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-sm text-text-primary">{issue.message}</p>
                            <p className="text-xs text-text-secondary mt-1.5 italic">
                              {issue.suggestion}
                            </p>
                            <button
                              onClick={() => handleApplySuggestion(issue)}
                              className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-accent bg-accent-subtle rounded-md hover:bg-accent/20 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              {t('quality.applySuggestion')}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
