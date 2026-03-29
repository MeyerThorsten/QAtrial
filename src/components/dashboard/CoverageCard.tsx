import { useTranslation } from 'react-i18next';

interface Props {
  coveragePercent: number;
  covered: number;
  total: number;
}

export function CoverageCard({ coveragePercent, covered, total }: Props) {
  const { t } = useTranslation();
  const rounded = Math.round(coveragePercent);
  const color = rounded >= 80 ? 'text-success' : rounded >= 50 ? 'text-warning' : 'text-danger';
  const barColor = rounded >= 80 ? 'bg-success' : rounded >= 50 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
      <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">{t('dashboard.coverage')}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${color}`}>{rounded}%</span>
        <span className="text-sm text-text-secondary">{t('dashboard.coveredOf', { covered, total })}</span>
      </div>
      <div className="mt-3 w-full bg-surface-tertiary rounded-full h-2">
        <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${rounded}%` }} />
      </div>
    </div>
  );
}
