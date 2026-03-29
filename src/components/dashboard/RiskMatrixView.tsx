import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLLMStore } from '../../store/useLLMStore';
import { classifyRisk } from '../../ai/prompts/riskClassification';
import type { Requirement, RiskLevel, Severity, Likelihood } from '../../types';

type CellCoord = { severity: Severity; likelihood: Likelihood };

/**
 * Map a riskLevel string to approximate matrix coordinates
 * when no explicit severity/likelihood data exists.
 */
function riskLevelToCoords(level: RiskLevel): CellCoord {
  switch (level) {
    case 'critical':
      return { severity: 5, likelihood: 5 };
    case 'high':
      return { severity: 4, likelihood: 4 };
    case 'medium':
      return { severity: 3, likelihood: 3 };
    case 'low':
      return { severity: 2, likelihood: 2 };
  }
}

/**
 * Return the risk zone color based on the product of severity * likelihood.
 */
function zoneColor(sev: number, lik: number): string {
  const score = sev * lik;
  if (score >= 16) return 'bg-red-500/80';
  if (score >= 9) return 'bg-orange-400/70';
  if (score >= 4) return 'bg-yellow-400/60';
  return 'bg-green-400/60';
}

function zoneLabel(sev: number, lik: number): RiskLevel {
  const score = sev * lik;
  if (score >= 16) return 'critical';
  if (score >= 9) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

const SEVERITY_LABELS = ['Negligible', 'Minor', 'Moderate', 'Major', 'Critical'];
const LIKELIHOOD_LABELS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];

export function RiskMatrixView() {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const updateRequirement = useRequirementsStore((s) => s.updateRequirement);
  const project = useProjectStore((s) => s.project);
  const hasProvider = useLLMStore((s) => s.hasAnyProvider());

  const [selectedCell, setSelectedCell] = useState<CellCoord | null>(null);
  const [classifying, setClassifying] = useState(false);

  // Build grid data: map each req with a riskLevel to a cell
  const grid = useMemo(() => {
    const cells = new Map<string, Requirement[]>();
    for (const req of requirements) {
      if (!req.riskLevel) continue;
      const coords = riskLevelToCoords(req.riskLevel);
      const key = `${coords.severity}-${coords.likelihood}`;
      const existing = cells.get(key) || [];
      existing.push(req);
      cells.set(key, existing);
    }
    return cells;
  }, [requirements]);

  const summary = useMemo(() => {
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    for (const req of requirements) {
      if (!req.riskLevel) continue;
      switch (req.riskLevel) {
        case 'critical': critical++; break;
        case 'high': high++; break;
        case 'medium': medium++; break;
        case 'low': low++; break;
      }
    }
    return { critical, high, medium, low };
  }, [requirements]);

  const unassessedCount = useMemo(
    () => requirements.filter((r) => !r.riskLevel).length,
    [requirements],
  );

  const selectedReqs = useMemo(() => {
    if (!selectedCell) return [];
    const key = `${selectedCell.severity}-${selectedCell.likelihood}`;
    return grid.get(key) || [];
  }, [selectedCell, grid]);

  const handleClassifyAll = useCallback(async () => {
    if (!hasProvider) return;
    setClassifying(true);
    try {
      const unassessed = requirements.filter((r) => !r.riskLevel);
      for (const req of unassessed) {
        try {
          const result = await classifyRisk({
            requirement: { id: req.id, title: req.title, description: req.description },
            vertical: project?.vertical,
            country: project?.country || 'US',
            riskTaxonomy: 'generic',
            allRequirements: requirements.map((r) => ({ id: r.id, title: r.title })),
          });
          const score = result.proposedSeverity * result.proposedLikelihood;
          let level: RiskLevel;
          if (score >= 16) level = 'critical';
          else if (score >= 9) level = 'high';
          else if (score >= 4) level = 'medium';
          else level = 'low';
          updateRequirement(req.id, { riskLevel: level });
        } catch {
          // Skip individual failures, continue with remaining
        }
      }
    } finally {
      setClassifying(false);
    }
  }, [requirements, hasProvider, project, updateRequirement]);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{t('dashboard.riskMatrix')}</h3>
          {unassessedCount > 0 && hasProvider && (
            <button
              onClick={handleClassifyAll}
              disabled={classifying}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              {classifying
                ? t('ai.generating')
                : t('dashboard.classifyAllUnassessed', { count: unassessedCount })}
            </button>
          )}
        </div>

        <p className="text-sm text-text-secondary mb-4">
          {t('dashboard.riskSummary', {
            critical: summary.critical,
            high: summary.high,
            medium: summary.medium,
            low: summary.low,
          })}
          {unassessedCount > 0 && (
            <span className="ml-2 text-text-tertiary">
              + {unassessedCount} {t('dashboard.unassessed')}
            </span>
          )}
        </p>

        {/* 5x5 matrix grid */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* Y-axis label */}
            <div className="flex">
              <div className="w-24 shrink-0" />
              <div className="flex-1">
                <div className="text-center text-xs font-medium text-text-secondary mb-2">
                  {t('risk.severity')}
                </div>
              </div>
            </div>

            <div className="flex">
              {/* Y-axis */}
              <div className="w-24 shrink-0 flex flex-col-reverse">
                {([1, 2, 3, 4, 5] as const).map((lik) => (
                  <div
                    key={lik}
                    className="h-16 flex items-center justify-end pr-2"
                  >
                    <span className="text-xs text-text-secondary text-right">
                      {lik} - {LIKELIHOOD_LABELS[lik - 1]}
                    </span>
                  </div>
                ))}
                <div className="h-6" />
              </div>

              {/* Grid */}
              <div>
                <div className="grid grid-cols-5 gap-1">
                  {/* Severity headers */}
                  {([1, 2, 3, 4, 5] as const).map((sev) => (
                    <div key={sev} className="h-6 flex items-center justify-center">
                      <span className="text-xs text-text-secondary">{sev}</span>
                    </div>
                  ))}

                  {/* Matrix cells — iterate likelihood 5 down to 1, severity 1 to 5 */}
                  {([5, 4, 3, 2, 1] as const).map((lik) =>
                    ([1, 2, 3, 4, 5] as const).map((sev) => {
                      const key = `${sev}-${lik}`;
                      const cellReqs = grid.get(key) || [];
                      const isSelected =
                        selectedCell?.severity === sev && selectedCell?.likelihood === lik;

                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedCell({ severity: sev, likelihood: lik })}
                          className={`h-16 w-16 rounded-lg ${zoneColor(sev, lik)} flex items-center justify-center transition-all hover:ring-2 hover:ring-primary/50 ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          {cellReqs.length > 0 && (
                            <span className="text-sm font-bold text-white drop-shadow-sm">
                              {cellReqs.length}
                            </span>
                          )}
                        </button>
                      );
                    }),
                  )}
                </div>

                {/* Severity labels */}
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {SEVERITY_LABELS.map((label) => (
                    <div key={label} className="w-16 text-center">
                      <span className="text-[10px] text-text-tertiary">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Y-axis title */}
            <div className="flex mt-1">
              <div className="w-24 shrink-0 text-center">
                <span className="text-xs font-medium text-text-secondary">
                  {t('risk.likelihood')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-400/60" />
            <span className="text-text-secondary">{t('risk.low')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-400/60" />
            <span className="text-text-secondary">{t('risk.medium')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-orange-400/70" />
            <span className="text-text-secondary">{t('risk.high')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-500/80" />
            <span className="text-text-secondary">{t('risk.critical')}</span>
          </div>
        </div>
      </div>

      {/* Selected cell details */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        {selectedCell ? (
          <>
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              {t('dashboard.requirementsInCell', {
                sev: selectedCell.severity,
                lik: selectedCell.likelihood,
              })}
              <span
                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  {
                    critical: 'bg-red-100 text-red-700',
                    high: 'bg-orange-100 text-orange-700',
                    medium: 'bg-yellow-100 text-yellow-700',
                    low: 'bg-green-100 text-green-700',
                  }[zoneLabel(selectedCell.severity, selectedCell.likelihood)]
                }`}
              >
                {t(`risk.${zoneLabel(selectedCell.severity, selectedCell.likelihood)}`)}
              </span>
            </h4>

            {selectedReqs.length === 0 ? (
              <p className="text-sm text-text-secondary">
                {t('dashboard.noRequirementsInCell')}
              </p>
            ) : (
              <div className="space-y-2">
                {selectedReqs.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
                  >
                    <span className="text-xs font-mono text-text-tertiary">{req.id}</span>
                    <span className="text-sm text-text-primary">{req.title}</span>
                    {req.riskLevel && (
                      <span
                        className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          {
                            critical: 'bg-red-100 text-red-700',
                            high: 'bg-orange-100 text-orange-700',
                            medium: 'bg-yellow-100 text-yellow-700',
                            low: 'bg-green-100 text-green-700',
                          }[req.riskLevel]
                        }`}
                      >
                        {t(`risk.${req.riskLevel}`)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-text-secondary">{t('dashboard.clickCellHint')}</p>
        )}
      </div>
    </div>
  );
}
