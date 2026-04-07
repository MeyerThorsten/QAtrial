import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TestTube2, Plus, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';

interface Study {
  id: string;
  productName: string;
  studyType: string;
  conditions: string;
  startDate: string;
  durationMonths: number;
  status: string;
  samples?: Sample[];
}

interface Sample {
  id: string;
  timePointMonths: number;
  testDate: string | null;
  parameter: string;
  result: string | null;
  specification: string | null;
  inSpec: boolean | null;
  oosFlag: boolean;
  ootFlag: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  long_term: 'Long Term',
  accelerated: 'Accelerated',
  intermediate: 'Intermediate',
  stress: 'Stress',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  terminated: 'bg-red-100 text-red-700',
};

export function StabilityStudy() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSampleForm, setShowSampleForm] = useState<string | null>(null);
  const [trending, setTrending] = useState<Record<string, any[]> | null>(null);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchStudies = async () => {
    if (!project?.name || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/stability?projectId=${project?.name ?? ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudies(data.studies || []);
      }
    } catch (err) {
      console.error('Failed to fetch studies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, [project?.name, token]);

  const handleExpand = async (id: string) => {
    if (expanded === id) {
      setExpanded(null);
      setTrending(null);
      return;
    }
    setExpanded(id);
    if (!token) return;
    try {
      const [detailRes, trendRes] = await Promise.all([
        fetch(`${apiBase}/api/stability/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBase}/api/stability/${id}/trending`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (detailRes.ok) {
        const data = await detailRes.json();
        setStudies((prev) => prev.map((s) => (s.id === id ? { ...s, samples: data.study.samples } : s)));
      }
      if (trendRes.ok) {
        const data = await trendRes.json();
        setTrending(data.trending);
      }
    } catch (err) {
      console.error('Failed to fetch study details:', err);
    }
  };

  const handleCreate = async (formData: any) => {
    if (!project?.name || !token) return;
    try {
      const res = await fetch(`${apiBase}/api/stability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, projectId: project?.name ?? "" }),
      });
      if (res.ok) {
        setShowForm(false);
        fetchStudies();
      }
    } catch (err) {
      console.error('Failed to create study:', err);
    }
  };

  const handleAddSample = async (studyId: string, sampleData: any) => {
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/stability/${studyId}/samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(sampleData),
      });
      if (res.ok) {
        setShowSampleForm(null);
        handleExpand(studyId);
      }
    } catch (err) {
      console.error('Failed to add sample:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube2 className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('stability.title')}</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('stability.addStudy')}
        </button>
      </div>

      {studies.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">{t('stability.noStudies')}</div>
      ) : (
        <div className="space-y-3">
          {studies.map((study) => (
            <div key={study.id} className="bg-surface rounded-xl border border-border overflow-hidden">
              {/* Study Header */}
              <button
                onClick={() => handleExpand(study.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-sm font-medium text-text-primary">{study.productName}</span>
                    <span className="text-xs text-text-tertiary ml-2">{TYPE_LABELS[study.studyType] || study.studyType}</span>
                  </div>
                  <span className="text-xs text-text-secondary">{study.conditions}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[study.status] || ''}`}>
                    {t(`stability.status_${study.status}`)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-tertiary">
                    {new Date(study.startDate).toLocaleDateString()} - {study.durationMonths}mo
                  </span>
                  {expanded === study.id ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                </div>
              </button>

              {/* Expanded Content */}
              {expanded === study.id && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  {/* Sample Results Table */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-text-primary">{t('stability.samples')}</h4>
                    <button
                      onClick={() => setShowSampleForm(study.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-accent border border-accent rounded-lg hover:bg-accent/10"
                    >
                      <Plus className="w-3 h-3" />
                      {t('stability.addSample')}
                    </button>
                  </div>

                  {study.samples && study.samples.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-surface-secondary">
                            <th className="text-left px-3 py-1.5 font-medium text-text-secondary">{t('stability.timePoint')}</th>
                            <th className="text-left px-3 py-1.5 font-medium text-text-secondary">{t('stability.parameter')}</th>
                            <th className="text-left px-3 py-1.5 font-medium text-text-secondary">{t('stability.result')}</th>
                            <th className="text-left px-3 py-1.5 font-medium text-text-secondary">{t('stability.specification')}</th>
                            <th className="text-center px-3 py-1.5 font-medium text-text-secondary">{t('stability.inSpec')}</th>
                            <th className="text-center px-3 py-1.5 font-medium text-text-secondary">{t('stability.flags')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {study.samples.map((sample) => (
                            <tr key={sample.id} className={`border-t border-border ${sample.oosFlag ? 'bg-red-50 dark:bg-red-950/20' : sample.ootFlag ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                              <td className="px-3 py-1.5">{sample.timePointMonths}mo</td>
                              <td className="px-3 py-1.5">{sample.parameter}</td>
                              <td className="px-3 py-1.5 font-mono">{sample.result || '-'}</td>
                              <td className="px-3 py-1.5 text-text-tertiary">{sample.specification || '-'}</td>
                              <td className="px-3 py-1.5 text-center">
                                {sample.inSpec === true && <span className="text-green-600 font-medium">Pass</span>}
                                {sample.inSpec === false && <span className="text-red-600 font-medium">Fail</span>}
                                {sample.inSpec === null && '-'}
                              </td>
                              <td className="px-3 py-1.5 text-center">
                                {sample.oosFlag && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium">
                                    <AlertTriangle className="w-3 h-3" /> OOS
                                  </span>
                                )}
                                {sample.ootFlag && !sample.oosFlag && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-medium">
                                    <AlertTriangle className="w-3 h-3" /> OOT
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-text-tertiary text-center py-4">{t('stability.noSamples')}</p>
                  )}

                  {/* Trending Chart */}
                  {trending && Object.keys(trending).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-text-primary">{t('stability.trending')}</h4>
                      {Object.entries(trending).map(([param, dataPoints]) => {
                        const chartData = dataPoints.map((dp: any) => ({
                          timePoint: dp.timePoint,
                          result: dp.result ? parseFloat(dp.result) : null,
                        })).filter((dp: any) => dp.result !== null);

                        if (chartData.length === 0) return null;

                        return (
                          <div key={param} className="bg-surface-secondary rounded-lg p-3">
                            <p className="text-xs font-medium text-text-secondary mb-2">{param}</p>
                            <ResponsiveContainer width="100%" height={120}>
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="timePoint" tick={{ fontSize: 10 }} label={{ value: 'Months', position: 'insideBottomRight', offset: -5, fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="result" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Study Modal */}
      {showForm && <StudyForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}

      {/* Add Sample Modal */}
      {showSampleForm && (
        <SampleForm
          onSave={(data) => handleAddSample(showSampleForm, data)}
          onCancel={() => setShowSampleForm(null)}
        />
      )}
    </div>
  );
}

function StudyForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [productName, setProductName] = useState('');
  const [studyType, setStudyType] = useState('long_term');
  const [conditions, setConditions] = useState('25\u00b0C/60%RH');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [durationMonths, setDurationMonths] = useState(36);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('stability.addStudy')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('stability.productNamePlaceholder')} value={productName} onChange={(e) => setProductName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={studyType} onChange={(e) => setStudyType(e.target.value)}>
              <option value="long_term">Long Term</option>
              <option value="accelerated">Accelerated</option>
              <option value="intermediate">Intermediate</option>
              <option value="stress">Stress</option>
            </select>
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('stability.conditionsPlaceholder')} value={conditions} onChange={(e) => setConditions(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">{t('stability.startDate')}</label>
              <input type="date" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">{t('stability.durationMonths')}</label>
              <input type="number" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ productName, studyType, conditions, startDate, durationMonths })}
            disabled={!productName || !conditions}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

function SampleForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [timePointMonths, setTimePointMonths] = useState(0);
  const [parameter, setParameter] = useState('');
  const [result, setResult] = useState('');
  const [specification, setSpecification] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('stability.addSample')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">{t('stability.timePoint')}</label>
              <input type="number" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={timePointMonths} onChange={(e) => setTimePointMonths(Number(e.target.value))} />
            </div>
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary mt-5" placeholder={t('stability.parameterPlaceholder')} value={parameter} onChange={(e) => setParameter(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('stability.resultPlaceholder')} value={result} onChange={(e) => setResult(e.target.value)} />
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('stability.specPlaceholder')} value={specification} onChange={(e) => setSpecification(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ timePointMonths, parameter, result: result || undefined, specification: specification || undefined })}
            disabled={!parameter}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StabilityStudy;
