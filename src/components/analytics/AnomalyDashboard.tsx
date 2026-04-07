import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, TrendingDown, BarChart3, Building2, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProjectStore } from '../../store/useProjectStore';
import { AnomalyCard } from './AnomalyCard';

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

type AnomalyFilter = 'all' | 'deviation_spike' | 'yield_drop' | 'oos_trend' | 'complaint_spike' | 'supplier_degradation';

export function AnomalyDashboard() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const project = useProjectStore((s) => s.project);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnomalyFilter>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const projectId = (project as any)?.id || 'default';

  const fetchAnomalies = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/analytics/${projectId}/anomalies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnomalies(data.anomalies || []);
      }
    } catch (err) {
      console.error('Failed to fetch anomalies:', err);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, [token, apiBase, projectId]);

  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchAnomalies, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnomalies]);

  const filtered = filter === 'all' ? anomalies : anomalies.filter((a) => a.type === filter);
  const criticalCount = anomalies.filter((a) => a.severity === 'critical').length;
  const warningCount = anomalies.filter((a) => a.severity === 'warning').length;

  const typeCounts: Record<string, number> = {};
  for (const a of anomalies) {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  }

  const handleInvestigate = (anomaly: Anomaly) => {
    // In a full app, this would navigate to the related entity
    console.log('Investigate anomaly:', anomaly);
  };

  const filterButtons: { id: AnomalyFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t('analytics.filterAll'), icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'deviation_spike', label: t('analytics.typeDeviation'), icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { id: 'yield_drop', label: t('analytics.typeYield'), icon: <TrendingDown className="w-3.5 h-3.5" /> },
    { id: 'oos_trend', label: t('analytics.typeOOS'), icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'complaint_spike', label: t('analytics.typeComplaint'), icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'supplier_degradation', label: t('analytics.typeSupplier'), icon: <Building2 className="w-3.5 h-3.5" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-secondary flex items-center justify-center">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">{anomalies.length}</div>
            <div className="text-xs text-text-tertiary">{t('analytics.totalAnomalies')}</div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-xs text-text-tertiary">{t('analytics.critical')}</div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
            <div className="text-xs text-text-tertiary">{t('analytics.warning')}</div>
          </div>
        </div>
      </div>

      {/* Type breakdown */}
      {anomalies.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">{t('analytics.byType')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { type: 'deviation_spike', icon: <AlertTriangle className="w-4 h-4" />, label: t('analytics.typeDeviation') },
              { type: 'yield_drop', icon: <TrendingDown className="w-4 h-4" />, label: t('analytics.typeYield') },
              { type: 'oos_trend', icon: <Activity className="w-4 h-4" />, label: t('analytics.typeOOS') },
              { type: 'complaint_spike', icon: <BarChart3 className="w-4 h-4" />, label: t('analytics.typeComplaint') },
              { type: 'supplier_degradation', icon: <Building2 className="w-4 h-4" />, label: t('analytics.typeSupplier') },
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2 text-xs">
                <span className="text-text-tertiary">{item.icon}</span>
                <span className="text-text-secondary">{item.label}:</span>
                <span className="font-bold text-text-primary">{typeCounts[item.type] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter + Refresh */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {filterButtons.map((fb) => (
            <button
              key={fb.id}
              onClick={() => setFilter(fb.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                filter === fb.id
                  ? 'border-accent bg-accent-subtle text-accent font-medium'
                  : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {fb.icon}
              {fb.label}
              {fb.id !== 'all' && typeCounts[fb.id] ? ` (${typeCounts[fb.id]})` : ''}
            </button>
          ))}
        </div>
        <button
          onClick={fetchAnomalies}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t('analytics.refresh')}
        </button>
      </div>

      {/* Anomaly List */}
      {filtered.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-text-primary mb-1">{t('analytics.noAnomalies')}</h3>
          <p className="text-xs text-text-tertiary">{t('analytics.noAnomaliesDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((anomaly, idx) => (
            <AnomalyCard
              key={`${anomaly.type}-${anomaly.entityId || idx}`}
              anomaly={anomaly}
              onInvestigate={handleInvestigate}
            />
          ))}
        </div>
      )}

      {/* Last refresh */}
      <div className="text-center">
        <span className="text-xs text-text-tertiary">
          {t('analytics.lastRefresh')}: {lastRefresh.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

export default AnomalyDashboard;
