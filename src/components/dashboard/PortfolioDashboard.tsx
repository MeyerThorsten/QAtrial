import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '../../store/useProjectStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';

type ProjectHealth = 'on_track' | 'at_risk' | 'blocked';

function getHealthColor(health: ProjectHealth): string {
  switch (health) {
    case 'on_track':
      return 'bg-green-100 text-green-700';
    case 'at_risk':
      return 'bg-amber-100 text-amber-700';
    case 'blocked':
      return 'bg-red-100 text-red-700';
  }
}

function getHealthBarColor(health: ProjectHealth): string {
  switch (health) {
    case 'on_track':
      return 'bg-success';
    case 'at_risk':
      return 'bg-warning';
    case 'blocked':
      return 'bg-danger';
  }
}

// Country code to flag emoji
function countryFlag(code?: string): string {
  if (!code || code.length !== 2) return '';
  const offset = 0x1f1e6;
  const a = code.toUpperCase().charCodeAt(0) - 65 + offset;
  const b = code.toUpperCase().charCodeAt(1) - 65 + offset;
  return String.fromCodePoint(a, b);
}

export function PortfolioDashboard() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  const projectData = useMemo(() => {
    if (!project) return null;

    const totalReqs = requirements.length;
    const totalTests = tests.length;

    // Calculate readiness score
    const activeOrClosed = requirements.filter(
      (r) => r.status === 'Active' || r.status === 'Closed',
    ).length;
    const reqScore = totalReqs > 0 ? (activeOrClosed / totalReqs) * 100 : 0;

    const reqsWithTests = requirements.filter((req) =>
      tests.some((test) => test.linkedRequirementIds.includes(req.id)),
    ).length;
    const testCoverageScore = totalReqs > 0 ? (reqsWithTests / totalReqs) * 100 : 0;

    const passedTests = tests.filter((test) => test.status === 'Passed').length;
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    const readiness = Math.round((reqScore * 0.3 + testCoverageScore * 0.4 + passRate * 0.3));

    let health: ProjectHealth;
    if (readiness >= 70) health = 'on_track';
    else if (readiness >= 40) health = 'at_risk';
    else health = 'blocked';

    // Find the vertical display name
    const verticalKey = project.vertical
      ? `verticals.${project.vertical}.name`
      : '';

    return {
      name: project.name,
      country: project.country || 'US',
      vertical: verticalKey,
      readiness,
      health,
      totalReqs,
      totalTests,
      lastUpdated: project.createdAt,
    };
  }, [project, requirements, tests]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {t('dashboard.portfolio')}
        </h3>
        <p className="text-sm text-text-secondary">
          {t('dashboard.portfolioDescription')}
        </p>
      </div>

      {/* Portfolio table */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {!projectData ? (
          <div className="flex items-center justify-center h-40 text-sm text-text-tertiary">
            {t('common.noData')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioProject')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioCountry')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioVertical')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioReadiness')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioStatus')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioReqs')}
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioTests')}
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t('dashboard.portfolioLastUpdated')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-text-primary">
                      {projectData.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-lg" title={projectData.country}>
                      {countryFlag(projectData.country)}
                    </span>
                    <span className="ml-1.5 text-xs text-text-tertiary">
                      {projectData.country}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-text-secondary">
                    {projectData.vertical ? t(projectData.vertical) : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-surface-tertiary rounded-full h-2">
                        <div
                          className={`${getHealthBarColor(projectData.health)} h-2 rounded-full transition-all`}
                          style={{ width: `${projectData.readiness}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-primary">
                        {projectData.readiness}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getHealthColor(projectData.health)}`}
                    >
                      {t(`dashboard.portfolioHealth_${projectData.health}`)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-text-secondary">
                    {projectData.totalReqs}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-text-secondary">
                    {projectData.totalTests}
                  </td>
                  <td className="px-4 py-4 text-right text-xs text-text-tertiary">
                    {new Date(projectData.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enterprise upsell */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1">
              {t('dashboard.portfolioEnterpriseTitle')}
            </h4>
            <p className="text-sm text-text-secondary">
              {t('dashboard.portfolioEnterpriseDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
