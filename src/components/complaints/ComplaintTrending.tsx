import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { AlertTriangle, Plus, TrendingUp, Clock } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { ComplaintForm } from './ComplaintForm';
import { getProjectId } from '../../lib/projectUtils';

const SEVERITY_COLORS: Record<string, string> = {
  minor: '#eab308',
  major: '#f97316',
  critical: '#ef4444',
};

interface TrendingData {
  byMonth: { month: string; count: number }[];
  bySeverity: Record<string, number>;
  byProduct: { product: string; count: number }[];
  meanTimeToResolution: number;
  openCount: number;
  closedCount: number;
  total: number;
}

export function ComplaintTrending() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token, user } = useAuth();
  const [trending, setTrending] = useState<TrendingData | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<any>(null);
  const [error, setError] = useState('');
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const fetchData = async () => {
    if (!projectId || !token) return;
    setLoading(true);
    setError('');
    try {
      const [trendData, listData] = await Promise.all([
        apiFetch<{ trending: TrendingData }>(`/complaints/trending?projectId=${projectId}`),
        apiFetch<{ complaints: any[] }>(`/complaints?projectId=${projectId}`),
      ]);
      setTrending(trendData.trending);
      setComplaints(listData.complaints || []);
    } catch (err) {
      console.error('Failed to fetch complaint data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch complaint data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, token]);

  const handleSave = async (data: any) => {
    if (!projectId || !token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch(data.id ? `/complaints/${data.id}` : '/complaints', {
        method: data.id ? 'PUT' : 'POST',
        body: JSON.stringify({ ...data, projectId }),
      });
      setShowForm(false);
      setEditingComplaint(null);
      setError('');
      fetchData();
    } catch (err) {
      console.error('Failed to save complaint:', err);
      setError(err instanceof Error ? err.message : 'Failed to save complaint');
    }
  };

  const severityPieData = trending
    ? Object.entries(trending.bySeverity)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name: t(`complaints.sev_${name}`), value, fill: SEVERITY_COLORS[name] }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('complaints.title')}</h2>
        </div>
        {canEdit && (
          <button
            onClick={() => { setEditingComplaint(null); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('complaints.addComplaint')}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {trending && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-xs text-text-tertiary font-medium uppercase">{t('complaints.totalComplaints')}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{trending.total}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-xs text-text-tertiary font-medium uppercase">{t('complaints.openComplaints')}</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">{trending.openCount}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-xs text-text-tertiary font-medium uppercase">{t('complaints.closedComplaints')}</p>
            <p className="text-2xl font-bold text-green-500 mt-1">{trending.closedCount}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-text-tertiary" />
              <p className="text-xs text-text-tertiary font-medium uppercase">{t('complaints.mttr')}</p>
            </div>
            <p className="text-2xl font-bold text-text-primary mt-1">{trending.meanTimeToResolution}d</p>
          </div>
        </div>
      )}

      {/* Charts Row */}
      {trending && trending.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Complaints by Month */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-accent" />
              {t('complaints.byMonth')}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trending.byMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* By Severity (Pie) */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t('complaints.bySeverity')}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={severityPieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                  {severityPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* By Product (Bar) */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t('complaints.byProduct')}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trending.byProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="product" tick={{ fontSize: 10 }} stroke="var(--color-text-tertiary)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-secondary">
              <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('complaints.productName')}</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('complaints.severity')}</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('complaints.status')}</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('complaints.reportDate')}</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('complaints.patientImpact')}</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-tertiary">
                  {t('complaints.noComplaints')}
                </td>
              </tr>
            ) : (
              complaints.map((comp) => (
                <tr key={comp.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3 text-text-primary font-medium">{comp.productName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      comp.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      comp.severity === 'major' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {t(`complaints.sev_${comp.severity}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      comp.investigationStatus === 'closed' ? 'bg-green-100 text-green-700' :
                      comp.investigationStatus === 'resolved' ? 'bg-blue-100 text-blue-700' :
                      comp.investigationStatus === 'investigating' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {t(`complaints.status_${comp.investigationStatus}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(comp.reportDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {comp.patientImpact && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        {t('common.yes')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {canEdit && (
                      <button
                        onClick={() => { setEditingComplaint(comp); setShowForm(true); }}
                        className="text-xs text-accent hover:underline"
                      >
                        {t('common.edit')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ComplaintForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingComplaint(null); }}
        onSave={handleSave}
        initialData={editingComplaint}
      />
    </div>
  );
}
