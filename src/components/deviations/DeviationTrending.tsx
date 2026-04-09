import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { getProjectId } from '../../lib/projectUtils';

const CLASSIFICATION_COLORS: Record<string, string> = {
  minor: '#eab308',
  major: '#f97316',
  critical: '#ef4444',
};

const AREA_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316'];

interface TrendingData {
  total: number;
  openCount: number;
  closedCount: number;
  byClassification: { classification: string; count: number }[];
  byArea: { area: string; count: number }[];
  byMonth: { month: string; count: number }[];
  byRootCause: { rootCause: string; count: number }[];
}

export function DeviationTrending() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token } = useAuth();
  const [trending, setTrending] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const projectId = getProjectId(project);

  useEffect(() => {
    if (!projectId || !token) return;
    setLoading(true);
    apiFetch<{ trending: TrendingData }>(`/deviations/trending?projectId=${encodeURIComponent(projectId)}`)
      .then((data) => {
        if (data.trending) setTrending(data.trending);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!trending || trending.total === 0) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        <p>{t('deviations.noTrendingData')}</p>
      </div>
    );
  }

  const pieData = trending.byClassification.map((d) => ({
    name: d.classification,
    value: d.count,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary">{t('deviations.trendingTitle')}</h3>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">{trending.total}</div>
          <div className="text-xs text-text-tertiary">{t('deviations.totalDeviations')}</div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">{trending.openCount}</div>
          <div className="text-xs text-text-tertiary">{t('deviations.open')}</div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{trending.closedCount}</div>
          <div className="text-xs text-text-tertiary">{t('deviations.closed')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deviations by month (line) */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3">{t('deviations.byMonth')}</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trending.byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By classification (pie) */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3">{t('deviations.byClassification')}</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={CLASSIFICATION_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* By area (bar) */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3">{t('deviations.byArea')}</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trending.byArea}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="area" tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {trending.byArea.map((_, i) => (
                  <Cell key={i} fill={AREA_COLORS[i % AREA_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Root cause categories (horizontal bar) */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3">{t('deviations.rootCauseCategories')}</h4>
          {trending.byRootCause.length === 0 ? (
            <p className="text-xs text-text-tertiary text-center py-8">{t('deviations.noRootCauses')}</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trending.byRootCause} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
                <YAxis type="category" dataKey="rootCause" width={120} tick={{ fontSize: 10 }} stroke="var(--color-text-tertiary)" />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
