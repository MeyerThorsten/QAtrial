export type RequirementStatus = 'Draft' | 'Active' | 'Closed';
export type TestStatus = 'Not Run' | 'Passed' | 'Failed';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  status: TestStatus;
  linkedRequirementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  version: 1;
  exportedAt: string;
  requirements: Requirement[];
  tests: Test[];
  counters: { reqCounter: number; testCounter: number };
}

export interface EvaluationMetrics {
  totalRequirements: number;
  totalTests: number;
  coveragePercent: number;
  coveredRequirements: Requirement[];
  orphanedRequirements: Requirement[];
  orphanedTests: Test[];
  requirementStatusCounts: Record<RequirementStatus, number>;
  testStatusCounts: Record<TestStatus, number>;
}

export interface DashboardFilters {
  requirementStatus: RequirementStatus | 'All';
  testStatus: TestStatus | 'All';
}

export type ViewTab = 'requirements' | 'tests' | 'dashboard';
