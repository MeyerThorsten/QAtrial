import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Plus, Play, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

interface ScheduledReport {
  id: string;
  orgId: string;
  projectId: string;
  reportType: string;
  schedule: string;
  scheduleHuman: string;
  recipients: string[];
  format: string;
  enabled: boolean;
  lastRunAt: string | null;
  lastStatus: string | null;
  createdBy: string;
}

const REPORT_TYPES = [
  { id: 'validation_summary', label: 'Validation Summary' },
  { id: 'executive_brief', label: 'Executive Brief' },
  { id: 'gap_analysis', label: 'Gap Analysis' },
  { id: 'risk_assessment', label: 'Risk Assessment' },
  { id: 'traceability', label: 'Traceability Matrix' },
];

const SCHEDULE_PRESETS = [
  { label: 'Daily at 8:00', cron: '0 8 * * *' },
  { label: 'Weekly Monday 8:00', cron: '0 8 * * 1' },
  { label: 'Weekly Friday 17:00', cron: '0 17 * * 5' },
  { label: 'Monthly 1st at 9:00', cron: '0 9 1 * *' },
  { label: 'Monthly 15th at 9:00', cron: '0 9 15 * *' },
];

export function ScheduledReports() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    reportType: 'validation_summary',
    schedule: '0 8 * * 1',
    recipients: '',
    format: 'html',
  });
  const [error, setError] = useState('');

  const fetchReports = async () => {
    if (!token) return;
    try {
      const data: any = await apiFetch('/api/scheduled-reports', {});
      setReports(data.scheduledReports || []);
    } catch (err: any) {
      console.error('Fetch scheduled reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);

  const handleSave = async () => {
    setError('');
    try {
      const body = {
        projectId,
        reportType: formData.reportType,
        schedule: formData.schedule,
        recipients: formData.recipients
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean),
        format: formData.format,
      };

      if (editId) {
        await apiFetch(`/api/scheduled-reports/${editId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await apiFetch('/api/scheduled-reports', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ reportType: 'validation_summary', schedule: '0 8 * * 1', recipients: '', format: 'html' });
      fetchReports();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/api/scheduled-reports/${id}`, { method: 'DELETE' });
      fetchReports();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  };

  const handleToggle = async (report: ScheduledReport) => {
    try {
      await apiFetch(`/api/scheduled-reports/${report.id}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !report.enabled }),
      });
      fetchReports();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle');
    }
  };

  const handleRunNow = async (id: string) => {
    try {
      const data: any = await apiFetch(`/api/scheduled-reports/${id}/run-now`, { method: 'POST' });
      fetchReports();
      alert(`Report generated. Pass rate: ${data.report?.summary?.passRate ?? 0}%`);
    } catch (err: any) {
      setError(err.message || 'Failed to run');
    }
  };

  const handleEdit = (report: ScheduledReport) => {
    setEditId(report.id);
    setFormData({
      reportType: report.reportType,
      schedule: report.schedule,
      recipients: report.recipients.join(', '),
      format: report.format,
    });
    setShowForm(true);
  };

  if (!projectId) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>{t('scheduledReports.noProject')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          {t('scheduledReports.title')}
        </h2>
        {canEdit && (
          <button
            onClick={() => {
              setEditId(null);
              setFormData({ reportType: 'validation_summary', schedule: '0 8 * * 1', recipients: '', format: 'html' });
              setShowForm(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            <Plus className="w-4 h-4" />
            {t('scheduledReports.new')}
          </button>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowForm(false)}>
          <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">
                {editId ? t('scheduledReports.edit') : t('scheduledReports.new')}
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('scheduledReports.reportType')}</label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  {REPORT_TYPES.map((rt) => (
                    <option key={rt.id} value={rt.id}>{rt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('scheduledReports.schedule')}</label>
                <select
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  {SCHEDULE_PRESETS.map((sp) => (
                    <option key={sp.cron} value={sp.cron}>{sp.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('scheduledReports.recipients')}</label>
                <input
                  type="text"
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  placeholder="email1@co.com, email2@co.com"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('scheduledReports.format')}</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="html">HTML</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-lg">
                {t('common.cancel')}
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-accent text-white rounded-lg">
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports list */}
      {reports.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>{t('scheduledReports.empty')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-tertiary">
                <th className="text-left py-2 px-3">{t('scheduledReports.reportType')}</th>
                <th className="text-left py-2 px-3">{t('scheduledReports.schedule')}</th>
                <th className="text-left py-2 px-3">{t('scheduledReports.recipients')}</th>
                <th className="text-left py-2 px-3">{t('scheduledReports.lastRun')}</th>
                <th className="text-left py-2 px-3">{t('scheduledReports.status')}</th>
                <th className="text-right py-2 px-3">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-border hover:bg-surface-hover">
                  <td className="py-2 px-3 text-text-primary">
                    {REPORT_TYPES.find((rt) => rt.id === report.reportType)?.label || report.reportType}
                  </td>
                  <td className="py-2 px-3 text-text-secondary">{report.scheduleHuman}</td>
                  <td className="py-2 px-3 text-text-secondary">
                    {report.recipients.length > 0 ? report.recipients.join(', ') : '-'}
                  </td>
                  <td className="py-2 px-3 text-text-secondary">
                    {report.lastRunAt ? new Date(report.lastRunAt).toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-3">
                    <button onClick={() => handleToggle(report)}>
                      {report.enabled ? (
                        <ToggleRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-text-tertiary" />
                      )}
                    </button>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleRunNow(report.id)}
                        className="p-1 text-text-tertiary hover:text-accent"
                        title={t('scheduledReports.runNow')}
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleEdit(report)}
                            className="p-1 text-text-tertiary hover:text-accent"
                            title={t('common.edit')}
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="p-1 text-text-tertiary hover:text-red-500"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
