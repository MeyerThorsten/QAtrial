import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Plus, Download, AlertTriangle, FileText, MessageSquare, Shield } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';

interface PMSSummary {
  totalEntries: number;
  byType: Record<string, number>;
  complaintCount: number;
  openComplaints: number;
  capaCount: number;
  openCapas: number;
  fieldActions: number;
  byMonth: { month: string; count: number }[];
}

interface PMSEntry {
  id: string;
  entryType: string;
  title: string;
  description: string;
  source: string;
  date: string;
  severity: string | null;
  actionTaken: string | null;
}

const TYPE_ICONS: Record<string, any> = {
  complaint_summary: AlertTriangle,
  literature: FileText,
  field_action: Shield,
  customer_feedback: MessageSquare,
  capa_summary: Activity,
};

const TYPE_COLORS: Record<string, string> = {
  complaint_summary: 'bg-red-100 text-red-700',
  literature: 'bg-blue-100 text-blue-700',
  field_action: 'bg-amber-100 text-amber-700',
  customer_feedback: 'bg-green-100 text-green-700',
  capa_summary: 'bg-purple-100 text-purple-700',
};

export function PMSDashboard() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token } = useAuth();
  const [summary, setSummary] = useState<PMSSummary | null>(null);
  const [entries, setEntries] = useState<PMSEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchData = async () => {
    if (!project?.name || !token) return;
    setLoading(true);
    try {
      const [summaryRes, entriesRes] = await Promise.all([
        fetch(`${apiBase}/api/pms/${project.name}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiBase}/api/pms/${project.name}/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data.summary);
      }
      if (entriesRes.ok) {
        const data = await entriesRes.json();
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.error('Failed to fetch PMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [project?.name, token]);

  const handleCreateEntry = async (formData: any) => {
    if (!project?.name || !token) return;
    try {
      const res = await fetch(`${apiBase}/api/pms/${project.name}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create PMS entry:', err);
    }
  };

  const handleExportPSUR = async () => {
    if (!project?.name || !token) return;
    try {
      const res = await fetch(`${apiBase}/api/pms/${project.name}/psur-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data.psurData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `psur-data-${project.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export PSUR data:', err);
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
          <Activity className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('pms.title')}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPSUR}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('pms.generatePSUR')}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('pms.addEntry')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.complaintCount}</p>
            <p className="text-xs text-text-tertiary">{t('pms.complaints')}</p>
            <p className="text-xs text-red-500">{summary.openComplaints} {t('pms.open')}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{summary.capaCount}</p>
            <p className="text-xs text-text-tertiary">{t('pms.capas')}</p>
            <p className="text-xs text-amber-500">{summary.openCapas} {t('pms.open')}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{summary.fieldActions}</p>
            <p className="text-xs text-text-tertiary">{t('pms.fieldActions')}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.byType.literature || 0}</p>
            <p className="text-xs text-text-tertiary">{t('pms.literature')}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.byType.customer_feedback || 0}</p>
            <p className="text-xs text-text-tertiary">{t('pms.customerFeedback')}</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">{t('pms.timeline')}</h3>
        {entries.length === 0 ? (
          <p className="text-center text-sm text-text-tertiary py-8">{t('pms.noEntries')}</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const Icon = TYPE_ICONS[entry.entryType] || Activity;
              return (
                <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors">
                  <div className={`p-1.5 rounded-lg ${TYPE_COLORS[entry.entryType] || 'bg-gray-100 text-gray-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{entry.title}</span>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-xs ${TYPE_COLORS[entry.entryType] || ''}`}>
                        {t(`pms.type_${entry.entryType}`)}
                      </span>
                      {entry.severity && (
                        <span className="text-xs text-text-tertiary">({entry.severity})</span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-xs text-text-tertiary mt-0.5 truncate">{entry.description}</p>
                    )}
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {new Date(entry.date).toLocaleDateString()}
                      {entry.source && ` - ${entry.source}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showForm && (
        <PMSEntryForm onSave={handleCreateEntry} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
}

function PMSEntryForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [entryType, setEntryType] = useState('complaint_summary');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const [severity, setSeverity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('pms.addEntry')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={entryType} onChange={(e) => setEntryType(e.target.value)}>
            <option value="complaint_summary">{t('pms.type_complaint_summary')}</option>
            <option value="literature">{t('pms.type_literature')}</option>
            <option value="field_action">{t('pms.type_field_action')}</option>
            <option value="customer_feedback">{t('pms.type_customer_feedback')}</option>
            <option value="capa_summary">{t('pms.type_capa_summary')}</option>
          </select>
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('pms.titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" rows={3} placeholder={t('pms.descriptionPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('pms.sourcePlaceholder')} value={source} onChange={(e) => setSource(e.target.value)} />
            <input type="date" className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('pms.severityPlaceholder')} value={severity} onChange={(e) => setSeverity(e.target.value)} />
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ entryType, title, description, source, severity: severity || undefined, date })}
            disabled={!title}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PMSDashboard;
