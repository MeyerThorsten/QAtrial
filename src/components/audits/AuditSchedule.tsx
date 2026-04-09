import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck, Plus, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

interface AuditData {
  id: string;
  type: string;
  title: string;
  scheduledDate: string;
  actualDate: string | null;
  status: string;
  scope: string;
  leadAuditor: string;
  reportSummary: string | null;
  findings: FindingData[];
  overdue?: boolean;
}

interface FindingData {
  id: string;
  classification: string;
  area: string;
  description: string;
  responsibleParty: string | null;
  dueDate: string | null;
  capaId: string | null;
  status: string;
  response: string | null;
}

const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  scheduled: { color: 'bg-blue-100 text-blue-700', icon: Clock },
  in_progress: { color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled: { color: 'bg-gray-100 text-gray-600', icon: XCircle },
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  observation: 'bg-gray-100 text-gray-700',
  minor: 'bg-amber-100 text-amber-700',
  major: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export function AuditSchedule() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token, user } = useAuth();
  const [audits, setAudits] = useState<AuditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showFindingForm, setShowFindingForm] = useState<string | null>(null);
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const fetchAudits = async () => {
    if (!projectId || !token) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ audits: AuditData[] }>(`/audit-records?projectId=${encodeURIComponent(projectId)}`);
      const now = new Date();
      const enriched = (data.audits || []).map((a: AuditData) => ({
        ...a,
        overdue: new Date(a.scheduledDate) < now && a.status === 'scheduled',
      }));
      setAudits(enriched);
      setError('');
    } catch (err) {
      console.error('Failed to fetch audits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [projectId, token]);

  const handleCreate = async (formData: any) => {
    if (!projectId || !token || !canEdit) return;
    try {
      await apiFetch('/audit-records', {
        method: 'POST',
        body: JSON.stringify({ ...formData, projectId }),
      });
      setShowForm(false);
      setError('');
      fetchAudits();
    } catch (err) {
      console.error('Failed to schedule audit:', err);
      setError(err instanceof Error ? err.message : 'Failed to schedule audit');
    }
  };

  const handleComplete = async (id: string) => {
    if (!token || !canEdit) return;
    const summary = prompt(t('auditRecords.reportSummaryPrompt'));
    if (summary === null) return;
    try {
      await apiFetch(`/audit-records/${id}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ reportSummary: summary }),
      });
      setError('');
      fetchAudits();
    } catch (err) {
      console.error('Failed to complete audit:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete audit');
    }
  };

  const handleAddFinding = async (auditId: string, findingData: any) => {
    if (!token || !canEdit) return;
    try {
      await apiFetch(`/audit-records/${auditId}/findings`, {
        method: 'POST',
        body: JSON.stringify(findingData),
      });
      setShowFindingForm(null);
      setError('');
      fetchAudits();
    } catch (err) {
      console.error('Failed to add finding:', err);
      setError(err instanceof Error ? err.message : 'Failed to add finding');
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
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('auditRecords.title')}</h2>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('auditRecords.scheduleAudit')}
          </button>
        )}
      </div>

      {audits.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">{t('auditRecords.noAudits')}</div>
      ) : (
        <div className="space-y-3">
          {audits.map((audit) => {
            const config = STATUS_CONFIG[audit.status] || STATUS_CONFIG.scheduled;
            const StatusIcon = config.icon;

            return (
              <div
                key={audit.id}
                className={`bg-surface rounded-xl border overflow-hidden ${
                  audit.overdue ? 'border-red-300 dark:border-red-700' : 'border-border'
                }`}
              >
                {/* Audit Header */}
                <button
                  onClick={() => setExpanded(expanded === audit.id ? null : audit.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-4 h-4 ${audit.overdue ? 'text-red-500' : 'text-text-tertiary'}`} />
                    <div className="text-left">
                      <span className="text-sm font-medium text-text-primary">{audit.title}</span>
                      {audit.overdue && (
                        <span className="ml-2 inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">{t('auditRecords.overdue')}</span>
                      )}
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                      {t(`auditRecords.status_${audit.status}`)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-secondary text-text-secondary">{audit.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-tertiary">{new Date(audit.scheduledDate).toLocaleDateString()}</span>
                    <span className="text-xs text-text-tertiary">{audit.leadAuditor}</span>
                    {audit.findings.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-surface-secondary text-text-secondary">
                        {audit.findings.length} {t('auditRecords.findings')}
                      </span>
                    )}
                    {expanded === audit.id ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {expanded === audit.id && (
                  <div className="border-t border-border px-4 py-4 space-y-4">
                    {audit.scope && (
                      <div>
                        <p className="text-xs font-medium text-text-secondary">{t('auditRecords.scope')}</p>
                        <p className="text-sm text-text-primary">{audit.scope}</p>
                      </div>
                    )}

                    {audit.reportSummary && (
                      <div>
                        <p className="text-xs font-medium text-text-secondary">{t('auditRecords.reportSummary')}</p>
                        <p className="text-sm text-text-primary">{audit.reportSummary}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowFindingForm(audit.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-accent border border-accent rounded-lg hover:bg-accent/10"
                        >
                          <Plus className="w-3 h-3" />
                          {t('auditRecords.addFinding')}
                        </button>
                        {audit.status !== 'completed' && audit.status !== 'cancelled' && (
                          <button
                            onClick={() => handleComplete(audit.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {t('auditRecords.completeAudit')}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Findings List */}
                    {audit.findings.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-text-secondary mb-2">{t('auditRecords.findings')}</h4>
                        <div className="space-y-2">
                          {audit.findings.map((finding) => (
                            <div key={finding.id} className="flex items-start gap-3 p-2 rounded-lg bg-surface-secondary">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${CLASSIFICATION_COLORS[finding.classification] || ''}`}>
                                {t(`auditRecords.class_${finding.classification}`)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-text-primary">{finding.description}</p>
                                <p className="text-xs text-text-tertiary mt-0.5">
                                  {finding.area}
                                  {finding.responsibleParty && ` - ${finding.responsibleParty}`}
                                  {finding.dueDate && ` - Due: ${new Date(finding.dueDate).toLocaleDateString()}`}
                                </p>
                              </div>
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-xs ${
                                finding.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {finding.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Audit Modal */}
      {showForm && <AuditForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}

      {/* Add Finding Modal */}
      {showFindingForm && (
        <FindingForm
          onSave={(data) => handleAddFinding(showFindingForm, data)}
          onCancel={() => setShowFindingForm(null)}
        />
      )}
    </div>
  );
}

function AuditForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('internal');
  const [scheduledDate, setScheduledDate] = useState('');
  const [leadAuditor, setLeadAuditor] = useState('');
  const [scope, setScope] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('auditRecords.scheduleAudit')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('auditRecords.titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="internal">{t('auditRecords.type_internal')}</option>
              <option value="external">{t('auditRecords.type_external')}</option>
              <option value="supplier">{t('auditRecords.type_supplier')}</option>
              <option value="regulatory">{t('auditRecords.type_regulatory')}</option>
            </select>
            <div>
              <input type="date" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
            </div>
          </div>
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('auditRecords.leadAuditorPlaceholder')} value={leadAuditor} onChange={(e) => setLeadAuditor(e.target.value)} />
          <textarea className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" rows={2} placeholder={t('auditRecords.scopePlaceholder')} value={scope} onChange={(e) => setScope(e.target.value)} />
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ title, type, scheduledDate, leadAuditor, scope })}
            disabled={!title || !scheduledDate || !leadAuditor}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('auditRecords.scheduleAudit')}
          </button>
        </div>
      </div>
    </div>
  );
}

function FindingForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [classification, setClassification] = useState('observation');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [responsibleParty, setResponsibleParty] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('auditRecords.addFinding')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={classification} onChange={(e) => setClassification(e.target.value)}>
            <option value="observation">{t('auditRecords.class_observation')}</option>
            <option value="minor">{t('auditRecords.class_minor')}</option>
            <option value="major">{t('auditRecords.class_major')}</option>
            <option value="critical">{t('auditRecords.class_critical')}</option>
          </select>
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('auditRecords.areaPlaceholder')} value={area} onChange={(e) => setArea(e.target.value)} />
          <textarea className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" rows={3} placeholder={t('auditRecords.findingDescPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('auditRecords.responsiblePartyPlaceholder')} value={responsibleParty} onChange={(e) => setResponsibleParty(e.target.value)} />
            <input type="date" className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ classification, area, description, responsibleParty: responsibleParty || undefined, dueDate: dueDate || undefined })}
            disabled={!area || !description}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditSchedule;
