import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';

interface MetricDef {
  labelKey: string;
  weight: number;
  value: number;
}

function getColor(pct: number): { text: string; bar: string } {
  if (pct >= 80) return { text: 'text-success', bar: 'bg-success' };
  if (pct >= 50) return { text: 'text-warning', bar: 'bg-warning' };
  return { text: 'text-danger', bar: 'bg-danger' };
}

export function ComplianceReadiness() {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  const metrics = useMemo<MetricDef[]>(() => {
    const totalReqs = requirements.length;

    // 1. Requirement Coverage (25%) — % of reqs that have at least a description
    // In a template context this would compare against template reqs; here we use active/closed ratio
    const activeOrClosed = requirements.filter(
      (r) => r.status === 'Active' || r.status === 'Closed',
    ).length;
    const reqCoverage = totalReqs > 0 ? Math.round((activeOrClosed / totalReqs) * 100) : 0;

    // 2. Test Coverage (25%) — % of reqs with linked tests
    const reqsWithTests = requirements.filter((req) =>
      tests.some((t) => t.linkedRequirementIds.includes(req.id)),
    ).length;
    const testCoverage = totalReqs > 0 ? Math.round((reqsWithTests / totalReqs) * 100) : 0;

    // 3. Test Pass Rate (20%) — % of tests passing
    const totalTests = tests.length;
    const passedTests = tests.filter((t) => t.status === 'Passed').length;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // 4. Risk Assessed (15%) — % of reqs with riskLevel set
    const assessedReqs = requirements.filter((r) => r.riskLevel != null).length;
    const riskAssessed = totalReqs > 0 ? Math.round((assessedReqs / totalReqs) * 100) : 0;

    // 5. Signature Completeness (15%) — placeholder, always 0%
    const signatureCompleteness = 0;

    return [
      { labelKey: 'dashboard.reqCoverage', weight: 0.25, value: reqCoverage },
      { labelKey: 'dashboard.testCoverage', weight: 0.25, value: testCoverage },
      { labelKey: 'dashboard.testPassRate', weight: 0.2, value: passRate },
      { labelKey: 'dashboard.riskAssessed', weight: 0.15, value: riskAssessed },
      { labelKey: 'dashboard.signatureCompleteness', weight: 0.15, value: signatureCompleteness },
    ];
  }, [requirements, tests]);

  const hasCriticalRisk = useMemo(
    () => requirements.some((r) => r.riskLevel === 'critical'),
    [requirements],
  );

  const overallScore = useMemo(() => {
    let weighted = 0;
    for (const m of metrics) {
      weighted += m.value * m.weight;
    }
    let score = Math.round(weighted);
    // Apply penalty for critical risk
    if (hasCriticalRisk && score > 0) {
      score = Math.max(0, score - 10);
    }
    return score;
  }, [metrics, hasCriticalRisk]);

  const overallColor = getColor(overallScore);

  // SVG circular progress constants
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        {t('dashboard.complianceReadiness')}
      </h3>

      <div className="flex items-start gap-6">
        {/* Circular progress */}
        <div className="relative shrink-0">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              className="stroke-surface-tertiary"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              className={overallColor.bar.replace('bg-', 'stroke-')}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 64 64)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${overallColor.text}`}>{overallScore}%</span>
            <span className="text-[10px] text-text-tertiary">{t('dashboard.readinessScore')}</span>
          </div>
        </div>

        {/* Metric breakdown */}
        <div className="flex-1 space-y-3">
          {metrics.map((m) => {
            const color = getColor(m.value);
            return (
              <div key={m.labelKey}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">
                    {t(m.labelKey)}{' '}
                    <span className="text-text-tertiary">({Math.round(m.weight * 100)}%)</span>
                  </span>
                  <span className={`text-xs font-medium ${color.text}`}>{m.value}%</span>
                </div>
                <div className="w-full bg-surface-tertiary rounded-full h-1.5">
                  <div
                    className={`${color.bar} h-1.5 rounded-full transition-all`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            );
          })}

          {hasCriticalRisk && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/30 px-3 py-2">
              <span className="text-danger text-xs font-medium">
                {t('dashboard.criticalGapPenalty')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
