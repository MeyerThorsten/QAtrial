import { useMemo } from 'react';
import { useRequirementsStore } from '../store/useRequirementsStore';
import { useTestsStore } from '../store/useTestsStore';
import type { DashboardFilters, EvaluationMetrics } from '../types';

export function useEvaluationData(filters?: DashboardFilters): EvaluationMetrics {
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  return useMemo(() => {
    const filteredReqs = filters?.requirementStatus && filters.requirementStatus !== 'All'
      ? requirements.filter((r) => r.status === filters.requirementStatus)
      : requirements;

    const filteredTests = filters?.testStatus && filters.testStatus !== 'All'
      ? tests.filter((t) => t.status === filters.testStatus)
      : tests;

    const coveredRequirements = filteredReqs.filter((req) =>
      filteredTests.some((t) => t.linkedRequirementIds.includes(req.id))
    );
    const orphanedRequirements = filteredReqs.filter(
      (req) => !filteredTests.some((t) => t.linkedRequirementIds.includes(req.id))
    );
    const orphanedTests = filteredTests.filter((t) => t.linkedRequirementIds.length === 0);

    const coveragePercent = filteredReqs.length > 0
      ? (coveredRequirements.length / filteredReqs.length) * 100
      : 0;

    const requirementStatusCounts = { Draft: 0, Active: 0, Closed: 0 };
    for (const r of filteredReqs) {
      requirementStatusCounts[r.status]++;
    }

    const testStatusCounts = { 'Not Run': 0, Passed: 0, Failed: 0 };
    for (const t of filteredTests) {
      testStatusCounts[t.status]++;
    }

    return {
      totalRequirements: filteredReqs.length,
      totalTests: filteredTests.length,
      coveragePercent,
      coveredRequirements,
      orphanedRequirements,
      orphanedTests,
      requirementStatusCounts,
      testStatusCounts,
    };
  }, [requirements, tests, filters?.requirementStatus, filters?.testStatus]);
}
