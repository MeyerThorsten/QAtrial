import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Thermometer, Plus, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

interface MonitoringPointData {
  id: string;
  name: string;
  zone: string;
  type: string;
  unit: string;
  alertThreshold: number | null;
  actionThreshold: number | null;
}

interface ReadingData {
  id: string;
  value: number;
  timestamp: string;
  excursion: boolean;
  excursionType: string | null;
  actionTaken: string | null;
}

interface Excursion {
  id: string;
  value: number;
  timestamp: string;
  excursionType: string | null;
  point?: { name: string; zone: string; type: string };
}

export function EnvironmentalMonitoring() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token, user } = useAuth();
  const [points, setPoints] = useState<MonitoringPointData[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [readings, setReadings] = useState<ReadingData[]>([]);
  const [showPointForm, setShowPointForm] = useState(false);
  const [showReadingForm, setShowReadingForm] = useState<string | null>(null);
  const [error, setError] = useState('');
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const fetchData = async () => {
    if (!projectId || !token) return;
    setLoading(true);
    setError('');
    try {
      const [pointsData, excursionsData] = await Promise.all([
        apiFetch<{ points: MonitoringPointData[] }>(`/envmon/points?projectId=${projectId}`),
        apiFetch<{ excursions: Excursion[] }>(`/envmon/excursions?projectId=${projectId}`),
      ]);
      setPoints(pointsData.points || []);
      setExcursions(excursionsData.excursions || []);
    } catch (err) {
      console.error('Failed to fetch envmon data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch environmental monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, token]);

  const loadReadings = async (id: string) => {
    const data = await apiFetch<{ readings: ReadingData[] }>(`/envmon/points/${id}/readings`);
    setReadings(data.readings || []);
  };

  const handleExpand = async (id: string) => {
    if (expanded === id) {
      setExpanded(null);
      setReadings([]);
      return;
    }
    setExpanded(id);
    if (!token) return;
    try {
      await loadReadings(id);
    } catch (err) {
      console.error('Failed to fetch readings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch readings');
    }
  };

  const handleCreatePoint = async (formData: any) => {
    if (!projectId || !token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch('/envmon/points', {
        method: 'POST',
        body: JSON.stringify({ ...formData, projectId }),
      });
      setShowPointForm(false);
      setError('');
      fetchData();
    } catch (err) {
      console.error('Failed to create point:', err);
      setError(err instanceof Error ? err.message : 'Failed to create monitoring point');
    }
  };

  const handleAddReading = async (pointId: string, value: number) => {
    if (!token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch(`/envmon/points/${pointId}/readings`, {
        method: 'POST',
        body: JSON.stringify({ value }),
      });
      setShowReadingForm(null);
      setError('');
      setExpanded(pointId);
      await loadReadings(pointId);
      fetchData();
    } catch (err) {
      console.error('Failed to add reading:', err);
      setError(err instanceof Error ? err.message : 'Failed to add reading');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  const expandedPoint = points.find((p) => p.id === expanded);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('envmon.title')}</h2>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowPointForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('envmon.addPoint')}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Excursion Alert Banner */}
      {excursions.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">
              {t('envmon.excursions')} ({excursions.length})
            </h3>
          </div>
          <div className="space-y-1">
            {excursions.slice(0, 5).map((ex) => (
              <div key={ex.id} className="flex items-center justify-between text-xs">
                <span className="text-red-600 dark:text-red-400">
                  {ex.point?.name} ({ex.point?.zone}) - {ex.value} ({ex.excursionType})
                </span>
                <span className="text-red-500">{new Date(ex.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitoring Points Table */}
      {points.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">{t('envmon.noPoints')}</div>
      ) : (
        <div className="space-y-3">
          {points.map((point) => (
            <div key={point.id} className="bg-surface rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => handleExpand(point.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Thermometer className="w-4 h-4 text-text-tertiary" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-text-primary">{point.name}</span>
                    <span className="text-xs text-text-tertiary ml-2">{point.zone}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-surface-secondary text-text-secondary">{point.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  {point.alertThreshold !== null && (
                    <span className="text-xs text-amber-600">{t('envmon.alert')}: {point.alertThreshold}{point.unit}</span>
                  )}
                  {point.actionThreshold !== null && (
                    <span className="text-xs text-red-600">{t('envmon.action')}: {point.actionThreshold}{point.unit}</span>
                  )}
                  {canEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowReadingForm(point.id); }}
                      className="px-2 py-1 text-xs font-medium text-accent border border-accent rounded hover:bg-accent/10"
                    >
                      + {t('envmon.addReading')}
                    </button>
                  )}
                  {expanded === point.id ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                </div>
              </button>

              {/* Expanded: Readings + Chart */}
              {expanded === point.id && readings.length > 0 && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  {/* Chart */}
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={[...readings].reverse().map((r) => ({
                      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      value: r.value,
                      excursion: r.excursion,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      {expandedPoint?.alertThreshold !== null && expandedPoint?.alertThreshold !== undefined && (
                        <ReferenceLine y={expandedPoint.alertThreshold} stroke="#eab308" strokeDasharray="5 5" label={{ value: 'Alert', fill: '#eab308', fontSize: 10 }} />
                      )}
                      {expandedPoint?.actionThreshold !== null && expandedPoint?.actionThreshold !== undefined && (
                        <ReferenceLine y={expandedPoint.actionThreshold} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Action', fill: '#ef4444', fontSize: 10 }} />
                      )}
                      <Line type="monotone" dataKey="value" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Readings list */}
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-surface-secondary">
                          <th className="text-left px-3 py-1.5 font-medium text-text-secondary">{t('envmon.timestamp')}</th>
                          <th className="text-left px-3 py-1.5 font-medium text-text-secondary">{t('envmon.value')}</th>
                          <th className="text-center px-3 py-1.5 font-medium text-text-secondary">{t('envmon.excursion')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {readings.map((r) => (
                          <tr key={r.id} className={`border-t border-border ${r.excursion ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                            <td className="px-3 py-1.5">{new Date(r.timestamp).toLocaleString()}</td>
                            <td className="px-3 py-1.5 font-mono">{r.value} {expandedPoint?.unit}</td>
                            <td className="px-3 py-1.5 text-center">
                              {r.excursion && (
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${
                                  r.excursionType === 'action' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {r.excursionType}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Point Modal */}
      {canEdit && showPointForm && <PointForm onSave={handleCreatePoint} onCancel={() => setShowPointForm(false)} />}

      {/* Add Reading Modal */}
      {canEdit && showReadingForm && (
        <ReadingForm
          pointId={showReadingForm}
          unit={points.find((p) => p.id === showReadingForm)?.unit || ''}
          onSave={(val) => handleAddReading(showReadingForm, val)}
          onCancel={() => setShowReadingForm(null)}
        />
      )}
    </div>
  );
}

function PointForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [type, setType] = useState('temperature');
  const [unit, setUnit] = useState('\u00b0C');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [actionThreshold, setActionThreshold] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('envmon.addPoint')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('envmon.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('envmon.zonePlaceholder')} value={zone} onChange={(e) => setZone(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="temperature">{t('envmon.type_temperature')}</option>
              <option value="humidity">{t('envmon.type_humidity')}</option>
              <option value="particle">{t('envmon.type_particle')}</option>
              <option value="pressure">{t('envmon.type_pressure')}</option>
            </select>
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('envmon.unit')} value={unit} onChange={(e) => setUnit(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('envmon.alertThreshold')} value={alertThreshold} onChange={(e) => setAlertThreshold(e.target.value)} />
            <input type="number" className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('envmon.actionThreshold')} value={actionThreshold} onChange={(e) => setActionThreshold(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ name, zone, type, unit, alertThreshold: alertThreshold ? Number(alertThreshold) : undefined, actionThreshold: actionThreshold ? Number(actionThreshold) : undefined })}
            disabled={!name || !zone}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadingForm({ pointId: _pointId, unit, onSave, onCancel }: { pointId: string; unit: string; onSave: (value: number) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-sm mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('envmon.addReading')}</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary"
              placeholder={t('envmon.valuePlaceholder')}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            <span className="text-sm text-text-tertiary">{unit}</span>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave(Number(value))}
            disabled={!value}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('envmon.record')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnvironmentalMonitoring;
