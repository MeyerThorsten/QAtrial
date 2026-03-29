import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { CHART_COLORS } from '../../lib/constants';

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  unassessed: '#9ca3af',
};

export function TrendCharts() {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  // 1. Requirements by Status
  const reqStatusData = useMemo(() => {
    const counts: Record<string, number> = { Draft: 0, Active: 0, Closed: 0 };
    for (const req of requirements) {
      counts[req.status] = (counts[req.status] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: CHART_COLORS.requirement[name as keyof typeof CHART_COLORS.requirement] || '#9ca3af',
    }));
  }, [requirements]);

  // 2. Tests by Status
  const testStatusData = useMemo(() => {
    const counts: Record<string, number> = { 'Not Run': 0, Passed: 0, Failed: 0 };
    for (const test of tests) {
      counts[test.status] = (counts[test.status] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: CHART_COLORS.test[name as keyof typeof CHART_COLORS.test] || '#9ca3af',
    }));
  }, [tests]);

  // 3. Risk Distribution
  const riskData = useMemo(() => {
    const counts: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      unassessed: 0,
    };
    for (const req of requirements) {
      const level = req.riskLevel || 'unassessed';
      counts[level] = (counts[level] || 0) + 1;
    }
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: RISK_COLORS[name],
      }));
  }, [requirements]);

  // 4. Coverage by Category (using tags as categories; fall back to status grouping)
  const coverageByCategory = useMemo(() => {
    // Group requirements by their first tag, or "Uncategorized"
    const categories = new Map<string, { total: number; covered: number }>();

    for (const req of requirements) {
      const category =
        req.tags && req.tags.length > 0 ? req.tags[0] : req.riskLevel || 'Uncategorized';
      const label = category.charAt(0).toUpperCase() + category.slice(1);

      if (!categories.has(label)) {
        categories.set(label, { total: 0, covered: 0 });
      }
      const entry = categories.get(label)!;
      entry.total++;

      // Check if this requirement has linked tests
      const hasTest = tests.some((test) => test.linkedRequirementIds.includes(req.id));
      if (hasTest) entry.covered++;
    }

    return Array.from(categories.entries()).map(([name, data]) => ({
      name,
      coverage: data.total > 0 ? Math.round((data.covered / data.total) * 100) : 0,
      total: data.total,
      covered: data.covered,
    }));
  }, [requirements, tests]);

  const hasData = requirements.length > 0 || tests.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {t('dashboard.trends')}
        </h3>
        <p className="text-sm text-text-secondary">
          {t('dashboard.trendsDescription')}
        </p>
      </div>

      {!hasData ? (
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm flex items-center justify-center h-40">
          <span className="text-sm text-text-tertiary">{t('common.noData')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requirements by Status */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
              {t('dashboard.trendReqByStatus')}
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reqStatusData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {reqStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-3 justify-center">
              {reqStatusData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* Tests by Status */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
              {t('dashboard.trendTestByStatus')}
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testStatusData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {testStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-3 justify-center">
              {testStatusData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution (Pie) */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
              {t('dashboard.trendRiskDistribution')}
            </h4>
            {riskData.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-sm text-text-tertiary">
                {t('common.noData')}
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {riskData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Coverage by Category */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
              {t('dashboard.trendCoverageByCategory')}
            </h4>
            {coverageByCategory.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-sm text-text-tertiary">
                {t('common.noData')}
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coverageByCategory}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(value: unknown) =>
                        [`${value}%`, t('dashboard.coverage')]
                      }
                    />
                    <Bar dataKey="coverage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
