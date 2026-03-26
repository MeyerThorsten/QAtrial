import { REQUIREMENT_STATUSES, TEST_STATUSES } from '../../lib/constants';
import type { DashboardFilters } from '../../types';

interface Props {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Req-Status:</label>
        <select
          value={filters.requirementStatus}
          onChange={(e) => onChange({ ...filters, requirementStatus: e.target.value as DashboardFilters['requirementStatus'] })}
          className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">Alle</option>
          {REQUIREMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Test-Status:</label>
        <select
          value={filters.testStatus}
          onChange={(e) => onChange({ ...filters, testStatus: e.target.value as DashboardFilters['testStatus'] })}
          className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">Alle</option>
          {TEST_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
