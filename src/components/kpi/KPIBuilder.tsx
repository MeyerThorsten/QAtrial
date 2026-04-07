import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { KPIWidgetCard } from './KPIWidgetCard';

interface MetricsCatalog {
  dataSource: string;
  metrics: string[];
  groupByOptions: string[];
}

const CHART_TYPES = ['counter', 'trend', 'bar', 'pie', 'table', 'gauge'];
const SIZE_OPTIONS = ['small', 'medium', 'large'];

interface WidgetDraft {
  type: string;
  title: string;
  dataSource: string;
  metric: string;
  groupBy: string;
  filters: { projectId?: string; dateRange?: { from?: string; to?: string } };
  size: string;
}

interface Props {
  dashboardId: string;
  widgetId?: string;
  existingWidget?: any;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function KPIBuilder({ dashboardId, widgetId, existingWidget, onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const [catalog, setCatalog] = useState<MetricsCatalog[]>([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [widget, setWidget] = useState<WidgetDraft>(() => {
    if (existingWidget) {
      return {
        type: existingWidget.type,
        title: existingWidget.title,
        dataSource: existingWidget.dataSource,
        metric: existingWidget.metric,
        groupBy: existingWidget.groupBy || '',
        filters: existingWidget.filters || {},
        size: existingWidget.size || 'medium',
      };
    }
    return {
      type: 'counter',
      title: '',
      dataSource: '',
      metric: '',
      groupBy: '',
      filters: {},
      size: 'medium',
    };
  });

  // Fetch catalog
  useEffect(() => {
    if (!token) return;
    fetch(`${apiBase}/api/kpi/metrics/available`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setCatalog(data.catalog || []))
      .catch(() => {});
  }, [token, apiBase]);

  const currentSource = catalog.find((c) => c.dataSource === widget.dataSource);
  const metricsForSource = currentSource?.metrics || [];
  const groupByForSource = currentSource?.groupByOptions || [];

  // Auto-suggest title
  const suggestTitle = () => {
    if (widget.title) return;
    const parts = [];
    if (widget.dataSource) parts.push(widget.dataSource.charAt(0).toUpperCase() + widget.dataSource.slice(1));
    if (widget.metric) parts.push(widget.metric.replace(/_/g, ' '));
    if (widget.groupBy) parts.push(`by ${widget.groupBy}`);
    setWidget({ ...widget, title: parts.join(' - ') || '' });
  };

  const handleSave = async () => {
    if (!widget.title.trim()) {
      setError(t('kpi.titleRequired'));
      return;
    }
    if (!widget.dataSource || !widget.metric) {
      setError(t('kpi.sourceAndMetricRequired'));
      return;
    }
    setSaving(true);
    setError('');

    try {
      const url = widgetId
        ? `${apiBase}/api/kpi/dashboards/${dashboardId}/widgets/${widgetId}`
        : `${apiBase}/api/kpi/dashboards/${dashboardId}/widgets`;
      const method = widgetId ? 'PUT' : 'POST';

      const payload = {
        type: widget.type,
        title: widget.title,
        dataSource: widget.dataSource,
        metric: widget.metric,
        groupBy: widget.groupBy || null,
        filters: Object.keys(widget.filters).length > 0 ? widget.filters : null,
        size: widget.size,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to save');
        return;
      }

      onSaved?.();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
      <h3 className="text-lg font-semibold text-text-primary">
        {widgetId ? t('kpi.editWidget') : t('kpi.addWidget')}
      </h3>

      {error && (
        <div className="bg-red-500/10 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>
      )}

      {/* Step indicators */}
      <div className="flex items-center gap-2 text-xs">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`w-7 h-7 rounded-full flex items-center justify-center font-medium transition-colors ${
              step === s
                ? 'bg-accent text-white'
                : step > s
                ? 'bg-green-500 text-white'
                : 'bg-surface-secondary text-text-tertiary border border-border'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Step 1: Data Source */}
      {step === 1 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-secondary">{t('kpi.selectDataSource')}</label>
          <div className="grid grid-cols-3 gap-2">
            {catalog.map((c) => (
              <button
                key={c.dataSource}
                onClick={() => {
                  setWidget({ ...widget, dataSource: c.dataSource, metric: '', groupBy: '' });
                  setStep(2);
                }}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  widget.dataSource === c.dataSource
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {c.dataSource.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Metric */}
      {step === 2 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-secondary">{t('kpi.selectMetric')}</label>
          <div className="grid grid-cols-3 gap-2">
            {metricsForSource.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setWidget({ ...widget, metric: m });
                  setStep(3);
                }}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  widget.metric === m
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {m.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          {metricsForSource.length === 0 && (
            <p className="text-sm text-text-tertiary">{t('kpi.selectDataSourceFirst')}</p>
          )}
        </div>
      )}

      {/* Step 3: Chart Type */}
      {step === 3 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-secondary">{t('kpi.selectChartType')}</label>
          <div className="grid grid-cols-3 gap-2">
            {CHART_TYPES.map((ct) => (
              <button
                key={ct}
                onClick={() => {
                  setWidget({ ...widget, type: ct });
                  setStep(4);
                }}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  widget.type === ct
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {ct}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: GroupBy */}
      {step === 4 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-secondary">{t('kpi.selectGroupBy')}</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setWidget({ ...widget, groupBy: '' });
                setStep(5);
              }}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                !widget.groupBy
                  ? 'border-accent bg-accent-subtle text-accent'
                  : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {t('kpi.noGrouping')}
            </button>
            {groupByForSource.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setWidget({ ...widget, groupBy: g });
                  setStep(5);
                }}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  widget.groupBy === g
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {g.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Filters */}
      {step === 5 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-secondary">{t('kpi.optionalFilters')}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-tertiary mb-1">{t('kpi.projectId')}</label>
              <input
                type="text"
                value={widget.filters.projectId || ''}
                onChange={(e) => setWidget({
                  ...widget,
                  filters: { ...widget.filters, projectId: e.target.value || undefined },
                })}
                className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('kpi.optionalProjectId')}
              />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1">{t('kpi.dateFrom')}</label>
              <input
                type="date"
                value={widget.filters.dateRange?.from || ''}
                onChange={(e) => setWidget({
                  ...widget,
                  filters: {
                    ...widget.filters,
                    dateRange: { ...widget.filters.dateRange, from: e.target.value || undefined },
                  },
                })}
                className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1">{t('kpi.dateTo')}</label>
              <input
                type="date"
                value={widget.filters.dateRange?.to || ''}
                onChange={(e) => setWidget({
                  ...widget,
                  filters: {
                    ...widget.filters,
                    dateRange: { ...widget.filters.dateRange, to: e.target.value || undefined },
                  },
                })}
                className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1">{t('kpi.widgetSize')}</label>
              <select
                value={widget.size}
                onChange={(e) => setWidget({ ...widget, size: e.target.value })}
                className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => { setStep(6); suggestTitle(); }}
            className="mt-2 px-3 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent/20 transition-colors"
          >
            {t('common.next')}
          </button>
        </div>
      )}

      {/* Step 6: Title + Preview */}
      {step === 6 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('kpi.widgetTitle')}</label>
            <input
              type="text"
              value={widget.title}
              onChange={(e) => setWidget({ ...widget, title: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder={t('kpi.widgetTitlePlaceholder')}
            />
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? t('kpi.hidePreview') : t('kpi.showPreview')}
          </button>

          {showPreview && (
            <div className="border border-border rounded-lg p-4 bg-surface-secondary">
              <KPIWidgetCard
                widget={{
                  id: 'preview',
                  type: widget.type,
                  title: widget.title || 'Preview',
                  dataSource: widget.dataSource,
                  metric: widget.metric,
                  groupBy: widget.groupBy || null,
                  size: widget.size,
                }}
                data={{
                  labels: widget.groupBy ? ['Category A', 'Category B', 'Category C'] : ['Value'],
                  values: widget.groupBy ? [12, 8, 5] : [25],
                  total: 25,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            {t('common.back')}
          </button>
        )}
        {step < 6 && widget.dataSource && (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent/20 transition-colors"
          >
            {t('common.next')}
          </button>
        )}
        {step === 6 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? t('common.saving') : t('common.save')}
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>
    </div>
  );
}
