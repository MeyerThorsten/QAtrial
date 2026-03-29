import { useTranslation } from 'react-i18next';
import { REQUIREMENT_STATUSES, TEST_STATUSES } from '../../lib/constants';
import type { DashboardFilters } from '../../types';

interface Props {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-sm text-text-secondary">{t('dashboard.reqStatus')}</label>
        <select
          value={filters.requirementStatus}
          onChange={(e) => onChange({ ...filters, requirementStatus: e.target.value as DashboardFilters['requirementStatus'] })}
          className="px-2 py-1.5 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="All">{t('common.all')}</option>
          {REQUIREMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{t(`statuses.${s}`)}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-text-secondary">{t('dashboard.testStatus')}</label>
        <select
          value={filters.testStatus}
          onChange={(e) => onChange({ ...filters, testStatus: e.target.value as DashboardFilters['testStatus'] })}
          className="px-2 py-1.5 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="All">{t('common.all')}</option>
          {TEST_STATUSES.map((s) => (
            <option key={s} value={s}>{t(`statuses.${s}`)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
