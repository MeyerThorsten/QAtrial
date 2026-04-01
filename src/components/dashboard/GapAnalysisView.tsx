import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLLMStore } from '../../store/useLLMStore';
import { useGapStore } from '../../store/useGapStore';
import { analyzeGaps } from '../../ai/prompts/gapAnalysis';
import type { AIGapAnalysis, GapStatus } from '../../types';

interface StandardSummary {
  standard: string;
  total: number;
  covered: number;
  partial: number;
  missing: number;
}

const STATUS_COLORS: Record<GapStatus, { bg: string; text: string; bar: string }> = {
  covered: { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-success' },
  partial: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-warning' },
  missing: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-danger' },
};

export function GapAnalysisView() {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);
  const project = useProjectStore((s) => s.project);
  const hasProvider = useLLMStore((s) => s.hasAnyProvider());

  const addRequirement = useRequirementsStore((s) => s.addRequirement);
  const gapStore = useGapStore();

  const [results, setResults] = useState<AIGapAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedReqs, setGeneratedReqs] = useState<Set<string>>(new Set());

  const handleRunAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const country = project?.country || 'US';
      const vertical = project?.vertical;
      const applicableStandards: string[] = [];

      // Collect standards from requirements' regulatoryRef fields
      for (const req of requirements) {
        if (req.regulatoryRef && !applicableStandards.includes(req.regulatoryRef)) {
          applicableStandards.push(req.regulatoryRef);
        }
      }

      // If no standards found from refs, use a generic fallback
      if (applicableStandards.length === 0) {
        applicableStandards.push('21 CFR Part 11', 'EU Annex 11');
        if (vertical === 'medical_devices') {
          applicableStandards.push('IEC 62304', 'ISO 14971', 'ISO 13485');
        }
        if (vertical === 'pharma' || vertical === 'biotech') {
          applicableStandards.push('ICH Q9', 'ICH Q10');
        }
      }

      const gaps = await analyzeGaps({
        country,
        vertical,
        applicableStandards,
        requirements: requirements.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
        })),
        tests: tests.map((t) => ({
          id: t.id,
          title: t.title,
          linkedRequirementIds: t.linkedRequirementIds,
        })),
      });

      setResults(gaps);
      setGeneratedReqs(new Set());

      // Persist the gap analysis run
      const covered = gaps.filter((g) => g.status === 'covered').length;
      const partial = gaps.filter((g) => g.status === 'partial').length;
      const weighted = covered + partial * 0.5;
      const readiness = gaps.length > 0 ? Math.round((weighted / gaps.length) * 100) : 0;

      gapStore.addRun({
        analyzedAt: new Date().toISOString(),
        country: country,
        vertical: vertical,
        standards: applicableStandards,
        gaps,
        readinessScore: readiness,
        providerId: 'current',
        model: 'current',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [requirements, tests, project, gapStore]);

  const standardSummaries = useMemo<StandardSummary[]>(() => {
    const map = new Map<string, StandardSummary>();
    for (const gap of results) {
      let entry = map.get(gap.standard);
      if (!entry) {
        entry = { standard: gap.standard, total: 0, covered: 0, partial: 0, missing: 0 };
        map.set(gap.standard, entry);
      }
      entry.total++;
      entry[gap.status]++;
    }
    return Array.from(map.values());
  }, [results]);

  const overallReadiness = useMemo(() => {
    if (results.length === 0) return 0;
    const covered = results.filter((r) => r.status === 'covered').length;
    const partial = results.filter((r) => r.status === 'partial').length;
    const weighted = covered + partial * 0.5;
    return Math.round((weighted / results.length) * 100);
  }, [results]);

  const criticalGaps = useMemo(
    () => results.filter((r) => r.status === 'missing' || r.status === 'partial'),
    [results],
  );

  /** Create a real requirement from a gap suggestion */
  const handleGenerateRequirement = useCallback((gap: AIGapAnalysis) => {
    const key = `${gap.standard}-${gap.clause}`;
    if (generatedReqs.has(key)) return;

    addRequirement({
      title: `[${gap.standard}] ${gap.clause}`,
      description: gap.suggestion || `Requirement to address ${gap.status} coverage for ${gap.standard} clause ${gap.clause}`,
      status: 'Draft',
      tags: ['auto-generated', 'gap-analysis', gap.standard.toLowerCase().replace(/\s+/g, '-')],
      regulatoryRef: `${gap.standard} ${gap.clause}`,
      riskLevel: gap.status === 'missing' ? 'high' : 'medium',
    });

    setGeneratedReqs((prev) => new Set(prev).add(key));
  }, [addRequirement, generatedReqs]);

  /** Create requirements for all critical gaps */
  const handleGenerateAllReqs = useCallback(() => {
    for (const gap of criticalGaps) {
      handleGenerateRequirement(gap);
    }
  }, [criticalGaps, handleGenerateRequirement]);

  if (!hasProvider) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8 text-center">
        <p className="text-text-secondary">{t('ai.noProvider')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Run button + readiness bar */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('dashboard.gapAnalysis')}
          </h3>
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {loading ? t('ai.generating') : t('ai.gapAnalysis')}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">
                {t('dashboard.overallReadiness', { percent: overallReadiness })}
              </span>
              <span className="text-sm font-bold text-text-primary">{overallReadiness}%</span>
            </div>
            <div className="w-full bg-surface-tertiary rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  overallReadiness >= 80
                    ? 'bg-success'
                    : overallReadiness >= 50
                      ? 'bg-warning'
                      : 'bg-danger'
                }`}
                style={{ width: `${overallReadiness}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results table grouped by standard */}
      {standardSummaries.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-text-primary mb-4">
            {t('dashboard.gapAnalysis')} — {t('dashboard.standard')}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 text-text-secondary font-medium">
                    {t('dashboard.standard')}
                  </th>
                  <th className="py-2 px-4 text-text-secondary font-medium text-center">
                    {t('dashboard.totalClauses')}
                  </th>
                  <th className="py-2 px-4 text-text-secondary font-medium">
                    {t('dashboard.covered')}
                  </th>
                  <th className="py-2 px-4 text-text-secondary font-medium">
                    {t('dashboard.partial')}
                  </th>
                  <th className="py-2 px-4 text-text-secondary font-medium">
                    {t('dashboard.missing')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {standardSummaries.map((s) => {
                  const covPct = s.total > 0 ? (s.covered / s.total) * 100 : 0;
                  const partPct = s.total > 0 ? (s.partial / s.total) * 100 : 0;
                  const missPct = s.total > 0 ? (s.missing / s.total) * 100 : 0;

                  return (
                    <tr key={s.standard} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-text-primary">{s.standard}</td>
                      <td className="py-3 px-4 text-center text-text-secondary">{s.total}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-surface-tertiary rounded-full h-2">
                            <div
                              className="bg-success h-2 rounded-full transition-all"
                              style={{ width: `${covPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary w-8 text-right">
                            {s.covered}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-surface-tertiary rounded-full h-2">
                            <div
                              className="bg-warning h-2 rounded-full transition-all"
                              style={{ width: `${partPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary w-8 text-right">
                            {s.partial}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-surface-tertiary rounded-full h-2">
                            <div
                              className="bg-danger h-2 rounded-full transition-all"
                              style={{ width: `${missPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary w-8 text-right">
                            {s.missing}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Critical Gaps section */}
      {results.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-text-primary">
              {t('dashboard.criticalGaps')}
            </h4>
            {criticalGaps.length > 0 && (
              <button
                onClick={handleGenerateAllReqs}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-hover transition-colors"
              >
                {t('dashboard.generateAllReqs')} ({criticalGaps.length - generatedReqs.size} remaining)
              </button>
            )}
          </div>

          {criticalGaps.length === 0 ? (
            <p className="text-sm text-text-secondary">{t('dashboard.noCriticalGaps')}</p>
          ) : (
            <div className="space-y-3">
              {criticalGaps.map((gap, idx) => (
                <div
                  key={`${gap.standard}-${gap.clause}-${idx}`}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/50 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[gap.status].bg} ${STATUS_COLORS[gap.status].text}`}
                      >
                        {t(`ai.gapStatus.${gap.status}`)}
                      </span>
                      <span className="text-xs text-text-tertiary">{gap.standard}</span>
                    </div>
                    <p className="text-sm font-medium text-text-primary">
                      {t('dashboard.clauseRef')}: {gap.clause}
                    </p>
                    {gap.suggestion && (
                      <p className="text-xs text-text-secondary mt-1">{gap.suggestion}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleGenerateRequirement(gap)}
                    disabled={generatedReqs.has(`${gap.standard}-${gap.clause}`)}
                    className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      generatedReqs.has(`${gap.standard}-${gap.clause}`)
                        ? 'border-success/30 bg-success/10 text-success cursor-default'
                        : 'border-border text-text-primary hover:bg-surface-secondary'
                    }`}
                  >
                    {generatedReqs.has(`${gap.standard}-${gap.clause}`)
                      ? t('common.created')
                      : t('dashboard.generateRequirement')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && !loading && !error && (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <p className="text-text-secondary">{t('dashboard.noGapResults')}</p>
        </div>
      )}
    </div>
  );
}
