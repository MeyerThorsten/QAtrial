import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, BarChart3, Lock, Globe, Trash2, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { KPIDashboardView } from './KPIDashboardView';

interface DashboardSummary {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  isPublic: boolean;
  widgetCount: number;
  createdAt: string;
  updatedAt: string;
}

export function KPIDashboardManager() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const [dashboards, setDashboards] = useState<DashboardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);

  // Create form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPublic, setNewPublic] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboards = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/kpi/dashboards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDashboards(data.dashboards || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboards();
  }, [token, apiBase]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setError(t('kpi.nameRequired'));
      return;
    }
    setError('');
    try {
      const res = await fetch(`${apiBase}/api/kpi/dashboards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName, description: newDesc, isPublic: newPublic }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to create');
        return;
      }
      const data = await res.json();
      setCreating(false);
      setNewName('');
      setNewDesc('');
      setNewPublic(true);
      await fetchDashboards();
      setSelectedDashboardId(data.dashboard.id);
    } catch {
      setError('Network error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${apiBase}/api/kpi/dashboards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDashboards();
    } catch { /* ignore */ }
  };

  // If a dashboard is selected, show the dashboard view
  if (selectedDashboardId) {
    return (
      <KPIDashboardView
        dashboardId={selectedDashboardId}
        onBack={() => {
          setSelectedDashboardId(null);
          fetchDashboards();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{t('kpi.title')}</h2>
          <p className="text-sm text-text-secondary">{t('kpi.subtitle')}</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          {t('kpi.createDashboard')}
        </button>
      </div>

      {/* Create Form */}
      {creating && (
        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">{t('kpi.createDashboard')}</h3>
          {error && (
            <div className="bg-red-500/10 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('kpi.dashboardName')}</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('kpi.dashboardNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('kpi.description')}</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('kpi.descriptionPlaceholder')}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newPublic}
              onChange={(e) => setNewPublic(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm text-text-secondary">{t('kpi.publicDashboard')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
            >
              {t('kpi.create')}
            </button>
            <button
              onClick={() => { setCreating(false); setError(''); }}
              className="px-4 py-2 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      ) : dashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-text-tertiary">
          <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">{t('kpi.noDashboards')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dash) => (
            <div
              key={dash.id}
              className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group relative"
              onClick={() => setSelectedDashboardId(dash.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary truncate">{dash.name}</h3>
                  {dash.description && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{dash.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  {dash.isPublic ? (
                    <Globe className="w-3.5 h-3.5 text-green-500" aria-label={t('kpi.public')} />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-text-tertiary" aria-label={t('kpi.private')} />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 text-xs text-text-tertiary">
                <span className="inline-flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  {t('kpi.widgetCount', { count: dash.widgetCount })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {dash.createdBy === user?.id ? t('kpi.you') : dash.createdBy.slice(0, 8)}
                </span>
              </div>

              {/* Delete button — only visible on hover */}
              {(dash.createdBy === user?.id || user?.role === 'admin') && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(dash.id); }}
                  className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
