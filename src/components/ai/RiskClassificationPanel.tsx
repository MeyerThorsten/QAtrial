'use no memo';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, Check, Pencil, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLLMStore } from '../../store/useLLMStore';
import { classifyRisk, type RiskClassContext } from '../../ai/prompts/riskClassification';
import type { AIRiskClassification, RiskLevel } from '../../types';

interface Props {
  requirementId: string;
  onClose: () => void;
}

function confidenceColor(c: number): string {
  if (c >= 0.9) return 'text-success';
  if (c >= 0.7) return 'text-warning';
  return 'text-danger';
}

function confidenceBg(c: number): string {
  if (c >= 0.9) return 'bg-success/10';
  if (c >= 0.7) return 'bg-warning/10';
  return 'bg-danger/10';
}

function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'text-danger bg-danger/10';
    case 'high':
      return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
    case 'medium':
      return 'text-warning bg-warning/10';
    case 'low':
      return 'text-success bg-success/10';
  }
}

function computeRiskLevel(severity: number, likelihood: number): RiskLevel {
  const score = severity * likelihood;
  if (score >= 15) return 'critical';
  if (score >= 10) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

export function RiskClassificationPanel({ requirementId, onClose }: Props) {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const updateRequirement = useRequirementsStore((s) => s.updateRequirement);
  const requirement = requirements.find((r) => r.id === requirementId);
  const project = useProjectStore((s) => s.project);
  const hasProvider = useLLMStore((s) => s.hasAnyProvider());

  const [classification, setClassification] = useState<AIRiskClassification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classify = useCallback(async () => {
    if (!requirement) return;

    setLoading(true);
    setError(null);

    try {
      const ctx: RiskClassContext = {
        requirement: {
          id: requirement.id,
          title: requirement.title,
          description: requirement.description,
        },
        vertical: project?.vertical,
        country: project?.country ?? 'US',
        riskTaxonomy: 'generic', // Will be resolved from vertical config if available
        allRequirements: requirements.map((r) => ({ id: r.id, title: r.title })),
      };

      const result = await classifyRisk(ctx);
      setClassification(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [requirement, requirements, project]);

  useEffect(() => {
    if (hasProvider && requirement) {
      classify();
    }
  }, [hasProvider, requirement, classify]);

  function handleAccept() {
    if (!classification) return;

    const riskLevel = computeRiskLevel(
      classification.proposedSeverity,
      classification.proposedLikelihood,
    );

    updateRequirement(requirementId, {
      riskLevel,
    });

    onClose();
  }

  if (!requirement) return null;

  const riskScore = classification
    ? classification.proposedSeverity * classification.proposedLikelihood
    : 0;
  const riskLevel = classification
    ? computeRiskLevel(classification.proposedSeverity, classification.proposedLikelihood)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
      onClick={onClose}
    >
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-accent" />
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {t('ai.classifyRisk')}
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">
                {requirement.id}: {requirement.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!hasProvider ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-warning mb-3" />
              <p className="text-sm text-text-secondary">{t('ai.noProvider')}</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
              <p className="text-sm text-text-secondary">{t('ai.generating')}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-danger mb-3" />
              <p className="text-sm text-danger">{error}</p>
              <button
                onClick={classify}
                className="mt-3 px-4 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent-subtle/80 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : classification ? (
            <div className="space-y-4">
              {/* Confidence */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-tertiary">
                  {t('ai.confidence')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${confidenceColor(classification.confidence)} ${confidenceBg(classification.confidence)}`}
                >
                  {Math.round(classification.confidence * 100)}%
                </span>
              </div>

              {/* Risk scores grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-text-tertiary mb-1">{t('risk.severity')}</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {classification.proposedSeverity}
                  </p>
                  <p className="text-xs text-text-tertiary">/5</p>
                </div>
                <div className="bg-surface rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-text-tertiary mb-1">
                    {t('risk.likelihood')}
                  </p>
                  <p className="text-2xl font-bold text-text-primary">
                    {classification.proposedLikelihood}
                  </p>
                  <p className="text-xs text-text-tertiary">/5</p>
                </div>
              </div>

              {/* Risk score and level */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-text-tertiary mb-1">{t('risk.riskScore')}</p>
                  <p className="text-2xl font-bold text-text-primary">{riskScore}</p>
                  <p className="text-xs text-text-tertiary">/25</p>
                </div>
                <div className="bg-surface rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-text-tertiary mb-1">{t('risk.riskLevel')}</p>
                  {riskLevel && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${riskLevelColor(riskLevel)}`}
                    >
                      {t(`risk.${riskLevel}`)}
                    </span>
                  )}
                </div>
              </div>

              {/* Safety class */}
              {classification.safetyClass && (
                <div className="bg-surface rounded-lg border border-border p-3">
                  <p className="text-xs text-text-tertiary mb-1">Safety Class</p>
                  <p className="text-sm font-medium text-text-primary">
                    {classification.safetyClass}
                  </p>
                </div>
              )}

              {/* Reasoning */}
              <div className="bg-surface rounded-lg border border-border p-3">
                <p className="text-xs font-medium text-text-tertiary mb-1">Reasoning</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {classification.reasoning}
                </p>
              </div>

              {/* Model info */}
              <p className="text-xs text-text-tertiary text-right">
                Model: {classification.generatedBy}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {classification && !loading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-danger bg-danger/10 rounded-lg hover:bg-danger/20 transition-colors font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('ai.reject')}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                {t('common.edit')}
              </button>
              <button
                onClick={handleAccept}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                {t('ai.accept')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
