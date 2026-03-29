import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { isApproved } from '../../lib/approvalHelpers';

interface EvidenceRow {
  reqId: string;
  title: string;
  hasTests: boolean;
  hasRiskAssessment: boolean;
  hasApprovalSignature: boolean;
  evidenceScore: number;
}

function scoreColor(score: number): string {
  if (score === 100) return 'bg-green-50 border-green-200';
  if (score > 0) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

function scoreBadgeColor(score: number): string {
  if (score === 100) return 'bg-green-100 text-green-700';
  if (score > 0) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function progressBarColor(score: number): string {
  if (score === 100) return 'bg-success';
  if (score > 0) return 'bg-warning';
  return 'bg-danger';
}

export function EvidenceCompleteness() {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  const rows = useMemo<EvidenceRow[]>(() => {
    const result: EvidenceRow[] = requirements.map((req) => {
      const hasTests = tests.some((test) =>
        test.linkedRequirementIds.includes(req.id),
      );
      const hasRiskAssessment = req.riskLevel != null;
      const hasApprovalSignature = isApproved(req.id);

      // Evidence score: each category is worth 33.3%
      let score = 0;
      if (hasTests) score += 33;
      if (hasRiskAssessment) score += 33;
      if (hasApprovalSignature) score += 34;

      return {
        reqId: req.id,
        title: req.title,
        hasTests,
        hasRiskAssessment,
        hasApprovalSignature,
        evidenceScore: score,
      };
    });

    // Sort by evidence score ascending (most gaps first)
    result.sort((a, b) => a.evidenceScore - b.evidenceScore);
    return result;
  }, [requirements, tests]);

  const completeCount = useMemo(
    () => rows.filter((r) => r.evidenceScore === 100).length,
    [rows],
  );

  const totalCount = rows.length;
  const completePct = totalCount > 0 ? Math.round((completeCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('dashboard.evidenceCompleteness')}
          </h3>
          <span className="text-sm font-medium text-text-secondary">
            {completeCount} {t('dashboard.evidenceOfTotal', { total: totalCount })}
          </span>
        </div>

        <div className="w-full bg-surface-tertiary rounded-full h-3">
          <div
            className={`${progressBarColor(completePct)} h-3 rounded-full transition-all`}
            style={{ width: `${completePct}%` }}
          />
        </div>
        <p className="text-xs text-text-tertiary mt-2">
          {t('dashboard.evidenceSummary', {
            complete: completeCount,
            total: totalCount,
          })}
        </p>
      </div>

      {/* Evidence table */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {totalCount === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-text-tertiary">
            {t('common.noData')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('requirements.id')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('requirements.title')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.evidenceHasTests')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.evidenceHasRisk')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.evidenceHasApproval')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.evidenceScore')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.reqId}
                    className={`border-b border-border/50 ${scoreColor(row.evidenceScore)}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-text-tertiary">
                      {row.reqId}
                    </td>
                    <td className="px-4 py-3 text-text-primary">{row.title}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={row.hasTests ? 'text-success' : 'text-danger'}>
                        {row.hasTests ? '\u2713' : '\u2717'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={row.hasRiskAssessment ? 'text-success' : 'text-danger'}>
                        {row.hasRiskAssessment ? '\u2713' : '\u2717'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={row.hasApprovalSignature ? 'text-success' : 'text-danger'}>
                        {row.hasApprovalSignature ? '\u2713' : '\u2717'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${scoreBadgeColor(row.evidenceScore)}`}
                      >
                        {row.evidenceScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
