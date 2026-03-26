import type { RequirementStatus, TestStatus } from '../types';

export const REQUIREMENT_STATUSES: RequirementStatus[] = ['Draft', 'Active', 'Closed'];
export const TEST_STATUSES: TestStatus[] = ['Not Run', 'Passed', 'Failed'];

export const REQUIREMENT_STATUS_COLORS: Record<RequirementStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Active: 'bg-blue-100 text-blue-700',
  Closed: 'bg-green-100 text-green-700',
};

export const TEST_STATUS_COLORS: Record<TestStatus, string> = {
  'Not Run': 'bg-gray-100 text-gray-700',
  Passed: 'bg-green-100 text-green-700',
  Failed: 'bg-red-100 text-red-700',
};

export const CHART_COLORS = {
  requirement: {
    Draft: '#9ca3af',
    Active: '#3b82f6',
    Closed: '#22c55e',
  },
  test: {
    'Not Run': '#9ca3af',
    Passed: '#22c55e',
    Failed: '#ef4444',
  },
};
