import { useTranslation } from 'react-i18next';
import { AlertTriangle, TrendingDown, Activity, BarChart3, Building2 } from 'lucide-react';

interface Anomaly {
  type: 'deviation_spike' | 'yield_drop' | 'oos_trend' | 'complaint_spike' | 'supplier_degradation';
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  entityType?: string;
  entityId?: string;
  value: number;
  threshold: number;
  detectedAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  deviation_spike: <AlertTriangle className="w-5 h-5" />,
  yield_drop: <TrendingDown className="w-5 h-5" />,
  oos_trend: <Activity className="w-5 h-5" />,
  complaint_spike: <BarChart3 className="w-5 h-5" />,
  supplier_degradation: <Building2 className="w-5 h-5" />,
};

const typeLabels: Record<string, string> = {
  deviation_spike: 'analytics.typeDeviation',
  yield_drop: 'analytics.typeYield',
  oos_trend: 'analytics.typeOOS',
  complaint_spike: 'analytics.typeComplaint',
  supplier_degradation: 'analytics.typeSupplier',
};

export function AnomalyCard({ anomaly, onInvestigate }: { anomaly: Anomaly; onInvestigate?: (anomaly: Anomaly) => void }) {
  const { t } = useTranslation();

  const isCritical = anomaly.severity === 'critical';
  const borderColor = isCritical ? 'border-l-red-500' : 'border-l-amber-500';
  const severityBadge = isCritical
    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';

  const iconColor = isCritical
    ? 'text-red-500'
    : 'text-amber-500';

  return (
    <div className={`bg-surface rounded-xl border border-border border-l-4 ${borderColor} p-4 space-y-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={iconColor}>
            {typeIcons[anomaly.type] || <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityBadge}`}>
                {isCritical ? t('analytics.critical') : t('analytics.warning')}
              </span>
              <span className="text-xs text-text-tertiary">
                {t(typeLabels[anomaly.type] || 'analytics.typeDeviation')}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-text-primary">{anomaly.title}</h4>
            <p className="text-xs text-text-secondary mt-1">{anomaly.description}</p>
          </div>
        </div>
      </div>

      {/* Metric display */}
      <div className="flex items-center justify-between bg-surface-secondary rounded-lg px-3 py-2">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-text-tertiary">{t('analytics.current')}: </span>
            <span className={`font-bold ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>{anomaly.value}</span>
          </div>
          <div>
            <span className="text-text-tertiary">{t('analytics.threshold')}: </span>
            <span className="font-medium text-text-primary">{anomaly.threshold}</span>
          </div>
        </div>
        <div className="w-24 bg-border rounded-full h-2">
          <div
            className={`h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{
              width: `${Math.min(100, Math.abs(anomaly.value / (anomaly.threshold || 1)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-tertiary">
          {new Date(anomaly.detectedAt).toLocaleString()}
        </span>
        {onInvestigate && (
          <button
            onClick={() => onInvestigate(anomaly)}
            className="text-xs text-accent hover:underline font-medium"
          >
            {t('analytics.investigate')}
          </button>
        )}
      </div>
    </div>
  );
}
