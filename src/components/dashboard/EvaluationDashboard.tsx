import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEvaluationData } from '../../hooks/useEvaluationData';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { CHART_COLORS } from '../../lib/constants';
import { CoverageCard } from './CoverageCard';
import { StatusChart } from './StatusChart';
import { TraceabilityMatrix } from './TraceabilityMatrix';
import { OrphanedRequirements } from './OrphanedRequirements';
import { OrphanedTests } from './OrphanedTests';
import { FilterBar } from './FilterBar';
import { ComplianceReadiness } from './ComplianceReadiness';
import { GapAnalysisView } from './GapAnalysisView';
import { RiskMatrixView } from './RiskMatrixView';
import { EvidenceCompleteness } from './EvidenceCompleteness';
import { CAPAFunnel } from './CAPAFunnel';
import { TrendCharts } from './TrendCharts';
import { PortfolioDashboard } from './PortfolioDashboard';
import type { DashboardFilters } from '../../types';

type DashboardTab = 'overview' | 'compliance' | 'risk' | 'evidence' | 'capa' | 'trends' | 'portfolio';

export function EvaluationDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [filters, setFilters] = useState<DashboardFilters>({
    requirementStatus: 'All',
    testStatus: 'All',
  });

  const metrics = useEvaluationData(filters);
  const allRequirements = useRequirementsStore((s) => s.requirements);
  const allTests = useTestsStore((s) => s.tests);

  // Apply filters for the matrix
  const filteredReqs = filters.requirementStatus !== 'All'
    ? allRequirements.filter((r) => r.status === filters.requirementStatus)
    : allRequirements;
  const filteredTests = filters.testStatus !== 'All'
    ? allTests.filter((t) => t.status === filters.testStatus)
    : allTests;

  const reqChartData = Object.entries(metrics.requirementStatusCounts).map(([name, value]) => ({
    name,
    value,
    color: CHART_COLORS.requirement[name as keyof typeof CHART_COLORS.requirement],
  }));

  const testChartData = Object.entries(metrics.testStatusCounts).map(([name, value]) => ({
    name,
    value,
    color: CHART_COLORS.test[name as keyof typeof CHART_COLORS.test],
  }));

  const tabs: { id: DashboardTab; labelKey: string }[] = [
    { id: 'overview', labelKey: 'dashboard.tabOverview' },
    { id: 'compliance', labelKey: 'dashboard.tabCompliance' },
    { id: 'risk', labelKey: 'dashboard.tabRisk' },
    { id: 'evidence', labelKey: 'dashboard.tabEvidence' },
    { id: 'capa', labelKey: 'dashboard.tabCAPA' },
    { id: 'trends', labelKey: 'dashboard.tabTrends' },
    { id: 'portfolio', labelKey: 'dashboard.tabPortfolio' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Dashboard tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <>
          <FilterBar filters={filters} onChange={setFilters} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CoverageCard
              coveragePercent={metrics.coveragePercent}
              covered={metrics.totalRequirements - metrics.orphanedRequirements.length}
              total={metrics.totalRequirements}
            />
            <StatusChart title={t('dashboard.reqStatusChart')} data={reqChartData} type="pie" />
            <StatusChart title={t('dashboard.testStatusChart')} data={testChartData} type="bar" />
          </div>

          <TraceabilityMatrix filteredRequirements={filteredReqs} filteredTests={filteredTests} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OrphanedRequirements requirements={metrics.orphanedRequirements} />
            <OrphanedTests tests={metrics.orphanedTests} />
          </div>
        </>
      )}

      {/* Compliance tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <ComplianceReadiness />
          <GapAnalysisView />
        </div>
      )}

      {/* Risk tab */}
      {activeTab === 'risk' && <RiskMatrixView />}

      {/* Evidence tab */}
      {activeTab === 'evidence' && <EvidenceCompleteness />}

      {/* CAPA tab */}
      {activeTab === 'capa' && <CAPAFunnel />}

      {/* Trends tab */}
      {activeTab === 'trends' && <TrendCharts />}

      {/* Portfolio tab */}
      {activeTab === 'portfolio' && <PortfolioDashboard />}
    </div>
  );
}
