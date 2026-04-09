import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { KPIWidgetCard } from './KPIWidgetCard';
import { KPIBuilder } from './KPIBuilder';

interface Dashboard {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  isPublic: boolean;
  widgets: Widget[];
}

interface Widget {
  id: string;
  type: string;
  title: string;
  dataSource: string;
  metric: string;
  groupBy?: string | null;
  filters?: any;
  position: number;
  size: string;
}

interface WidgetData {
  widgetId: string;
  data: { labels: string[]; values: number[]; total?: number };
}

interface Props {
  dashboardId: string;
  onBack: () => void;
}

export function KPIDashboardView({ dashboardId, onBack }: Props) {
  const { t } = useTranslation();
  const { token, user } = useAuth();

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [widgetData, setWidgetData] = useState<WidgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingWidget, setAddingWidget] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiFetch<{ dashboard: Dashboard }>(`/kpi/dashboards/${dashboardId}`);
      if (data.dashboard) setDashboard(data.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    }
  }, [token, dashboardId]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiFetch<{ widgets: WidgetData[] }>(`/kpi/dashboards/${dashboardId}/data`);
      if (data.widgets) setWidgetData(data.widgets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load widget data');
    }
    setLoading(false);
  }, [token, dashboardId]);

  useEffect(() => {
    fetchDashboard();
    fetchData();
  }, [fetchDashboard, fetchData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getWidgetData = (widgetId: string) => {
    const found = widgetData.find((w) => w.widgetId === widgetId);
    return found?.data || { labels: [], values: [], total: 0 };
  };

  const deleteWidget = async (widgetId: string) => {
    if (!token) return;
    try {
      await apiFetch(`/kpi/dashboards/${dashboardId}/widgets/${widgetId}`, {
        method: 'DELETE',
      });
      await fetchDashboard();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete widget');
    }
  };

  const handleWidgetSaved = async () => {
    setAddingWidget(false);
    setEditingWidgetId(null);
    await fetchDashboard();
    await fetchData();
  };

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  const canManage = !!user
    && roleHasPermission(user.role, 'canEdit')
    && (dashboard.createdBy === user.id || roleHasPermission(user.role, 'canAdmin'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{dashboard.name}</h2>
            {dashboard.description && (
              <p className="text-sm text-text-secondary">{dashboard.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchData(); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('kpi.refresh')}
          </button>
          {canManage && (
            <button
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                editMode
                  ? 'text-accent bg-accent-subtle'
                  : 'text-text-secondary bg-surface border border-border hover:bg-surface-hover'
              }`}
            >
              <Edit className="w-4 h-4" />
              {editMode ? t('kpi.doneEditing') : t('kpi.editDashboard')}
            </button>
          )}
          {editMode && canManage && (
            <button
              onClick={() => setAddingWidget(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('kpi.addWidget')}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Widget Builder */}
      {addingWidget && (
        <KPIBuilder
          dashboardId={dashboardId}
          onSaved={handleWidgetSaved}
          onCancel={() => setAddingWidget(false)}
        />
      )}

      {editingWidgetId && (
        <KPIBuilder
          dashboardId={dashboardId}
          widgetId={editingWidgetId}
          existingWidget={dashboard.widgets.find((w) => w.id === editingWidgetId)}
          onSaved={handleWidgetSaved}
          onCancel={() => setEditingWidgetId(null)}
        />
      )}

      {/* Widget Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      ) : dashboard.widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-text-tertiary">
          <p className="text-sm">{t('kpi.noWidgets')}</p>
          {!addingWidget && canManage && (
            <button
              onClick={() => setAddingWidget(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('kpi.addWidget')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboard.widgets.map((widget) => (
            <div key={widget.id} className={`relative ${widget.size === 'large' ? 'md:col-span-2' : ''}`}>
              {editMode && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                  <button
                    onClick={() => setEditingWidgetId(widget.id)}
                    className="p-1 rounded bg-surface/80 backdrop-blur-sm text-text-tertiary hover:text-accent transition-colors border border-border"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="p-1 rounded bg-surface/80 backdrop-blur-sm text-text-tertiary hover:text-red-500 transition-colors border border-border"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <KPIWidgetCard widget={widget} data={getWidgetData(widget.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
