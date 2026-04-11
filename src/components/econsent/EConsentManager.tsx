import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Users, AlertTriangle, Check, XCircle, Loader2, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import { useProjectStore } from '../../store/useProjectStore';
import { getProjectId } from '../../lib/projectUtils';

interface ConsentForm {
  id: string;
  projectId: string;
  title: string;
  version: string;
  status: string;
  content: string;
  language: string;
  comprehensionQuestions: any;
  requireComprehension: boolean;
  reconsentOnAmendment: boolean;
  signatureCount: number;
  comprehensionPassRate: number;
  withdrawalCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ConsentSignature {
  id: string;
  consentFormId: string;
  subjectId: string;
  signedAt: string;
  comprehensionScore: number | null;
  comprehensionPassed: boolean;
  withdrawnAt: string | null;
  withdrawalReason: string | null;
  witnessName: string | null;
  witnessSignedAt: string | null;
  method: string;
}

interface Statistics {
  totalSignatures: number;
  activeConsents: number;
  withdrawnConsents: number;
  consentRate: number;
  withdrawalRate: number;
  comprehensionPassRate: number;
  avgComprehensionScore: number | null;
}

interface ReconsentItem {
  subjectId: string;
  formId: string;
  formTitle: string;
  signedVersion: string;
  currentVersion: string;
}

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export function EConsentManager() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);

  const [forms, setForms] = useState<ConsentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<ConsentSignature[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [reconsentNeeded, setReconsentNeeded] = useState<ReconsentItem[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [showSignForm, setShowSignForm] = useState(false);

  // Editor state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editQuestions, setEditQuestions] = useState<ComprehensionQuestion[]>([]);
  const [editRequireComprehension, setEditRequireComprehension] = useState(true);
  const [editReconsentOnAmendment, setEditReconsentOnAmendment] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sign form state
  const [signSubjectId, setSignSubjectId] = useState('');
  const [signComprehensionScore, setSignComprehensionScore] = useState<number | undefined>(undefined);
  const [signMethod, setSignMethod] = useState('electronic');
  const [signWitnessName, setSignWitnessName] = useState('');
  const [signing, setSigning] = useState(false);

  const loadForms = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await apiFetch<{ consentForms: ConsentForm[] }>(`/econsent?projectId=${projectId}`);
      setForms(data.consentForms);
    } catch {
      setForms([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const loadReconsentNeeded = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await apiFetch<{ reconsentNeeded: ReconsentItem[] }>(`/econsent/reconsent-needed?projectId=${projectId}`);
      setReconsentNeeded(data.reconsentNeeded);
    } catch {
      setReconsentNeeded([]);
    }
  }, [projectId]);

  useEffect(() => {
    loadForms();
    loadReconsentNeeded();
  }, [loadForms, loadReconsentNeeded]);

  const loadFormDetails = async (formId: string) => {
    setSelectedFormId(formId);
    try {
      const [formData, statsData] = await Promise.all([
        apiFetch<{ consentForm: ConsentForm & { signatures: ConsentSignature[] } }>(`/econsent/${formId}`),
        apiFetch<Statistics>(`/econsent/${formId}/statistics`),
      ]);
      setSignatures(formData.consentForm.signatures);
      setStatistics(statsData);
    } catch {
      setSignatures([]);
      setStatistics(null);
    }
  };

  const openEditor = (form?: ConsentForm) => {
    if (form) {
      setEditingId(form.id);
      setEditTitle(form.title);
      setEditContent(form.content);
      setEditQuestions(form.comprehensionQuestions ?? []);
      setEditRequireComprehension(form.requireComprehension);
      setEditReconsentOnAmendment(form.reconsentOnAmendment);
    } else {
      setEditingId(null);
      setEditTitle('');
      setEditContent('');
      setEditQuestions([]);
      setEditRequireComprehension(true);
      setEditReconsentOnAmendment(true);
    }
    setShowEditor(true);
  };

  const saveForm = async () => {
    if (!projectId || !editTitle.trim()) return;
    setSaving(true);
    try {
      const payload = {
        projectId,
        title: editTitle,
        content: editContent,
        comprehensionQuestions: editQuestions.length > 0 ? editQuestions : null,
        requireComprehension: editRequireComprehension,
        reconsentOnAmendment: editReconsentOnAmendment,
      };

      if (editingId) {
        await apiFetch(`/econsent/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/econsent', { method: 'POST', body: JSON.stringify(payload) });
      }

      setShowEditor(false);
      await loadForms();
    } catch (err) {
      console.error('Save consent form failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const activateForm = async (formId: string) => {
    try {
      await apiFetch(`/econsent/${formId}/activate`, { method: 'PUT' });
      await loadForms();
      if (selectedFormId === formId) await loadFormDetails(formId);
    } catch (err) {
      console.error('Activate failed:', err);
    }
  };

  const supersedeForm = async (formId: string) => {
    try {
      await apiFetch(`/econsent/${formId}/supersede`, {
        method: 'PUT',
        body: JSON.stringify({ reason: 'Superseded by new version' }),
      });
      await loadForms();
      await loadReconsentNeeded();
    } catch (err) {
      console.error('Supersede failed:', err);
    }
  };

  const signConsent = async () => {
    if (!selectedFormId || !signSubjectId.trim()) return;
    setSigning(true);
    try {
      await apiFetch(`/econsent/${selectedFormId}/sign`, {
        method: 'POST',
        body: JSON.stringify({
          subjectId: signSubjectId,
          comprehensionScore: signComprehensionScore,
          method: signMethod,
          witnessName: signWitnessName || undefined,
        }),
      });
      setShowSignForm(false);
      setSignSubjectId('');
      setSignComprehensionScore(undefined);
      setSignMethod('electronic');
      setSignWitnessName('');
      await loadFormDetails(selectedFormId);
      await loadForms();
    } catch (err) {
      console.error('Sign failed:', err);
    } finally {
      setSigning(false);
    }
  };

  const withdrawConsent = async (sigId: string) => {
    try {
      await apiFetch(`/econsent/signatures/${sigId}/withdraw`, {
        method: 'PUT',
        body: JSON.stringify({ reason: 'Subject requested withdrawal' }),
      });
      if (selectedFormId) await loadFormDetails(selectedFormId);
      await loadForms();
    } catch (err) {
      console.error('Withdraw failed:', err);
    }
  };

  const addQuestion = () => {
    setEditQuestions([...editQuestions, { question: '', options: ['', ''], correctIndex: 0 }]);
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...editQuestions];
    (updated[idx] as any)[field] = value;
    setEditQuestions(updated);
  };

  const addOption = (qIdx: number) => {
    const updated = [...editQuestions];
    updated[qIdx].options.push('');
    setEditQuestions(updated);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...editQuestions];
    updated[qIdx].options[oIdx] = value;
    setEditQuestions(updated);
  };

  const removeQuestion = (idx: number) => {
    setEditQuestions(editQuestions.filter((_, i) => i !== idx));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md"><Check className="w-3 h-3" />{t('econsent.active')}</span>;
      case 'superseded':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md">{t('econsent.superseded')}</span>;
      case 'withdrawn':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-md"><XCircle className="w-3 h-3" />{t('econsent.withdrawn')}</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded-md">{t('econsent.draft')}</span>;
    }
  };

  if (!projectId) {
    return <div className="text-center text-text-tertiary py-12">{t('econsent.noProject')}</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('econsent.title')}</h2>
        <button
          onClick={() => openEditor()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('econsent.newForm')}
        </button>
      </div>

      {/* Re-consent Needed Banner */}
      {reconsentNeeded.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-700">{t('econsent.reconsentNeeded')}</h4>
            <p className="text-xs text-amber-600 mt-1">
              {reconsentNeeded.length} {t('econsent.subjectsNeedReconsent')}
            </p>
            <ul className="mt-2 space-y-1">
              {reconsentNeeded.slice(0, 5).map((item, i) => (
                <li key={i} className="text-xs text-amber-600">
                  {item.subjectId}: {item.formTitle} (v{item.signedVersion} → v{item.currentVersion})
                </li>
              ))}
              {reconsentNeeded.length > 5 && (
                <li className="text-xs text-amber-600 italic">...{t('common.and')} {reconsentNeeded.length - 5} {t('econsent.more')}</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Form List */}
      <div className="space-y-3">
        {forms.length === 0 ? (
          <div className="text-center py-12 text-text-tertiary">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>{t('econsent.noForms')}</p>
          </div>
        ) : (
          forms.map((form) => (
            <div key={form.id} className="bg-surface border border-border rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-hover transition-colors"
                onClick={() => selectedFormId === form.id ? setSelectedFormId(null) : loadFormDetails(form.id)}
              >
                <div className="flex items-center gap-3">
                  {selectedFormId === form.id ? <ChevronDown className="w-4 h-4 text-text-tertiary" /> : <ChevronRight className="w-4 h-4 text-text-tertiary" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{form.title}</span>
                      <span className="text-xs text-text-tertiary">v{form.version}</span>
                      {getStatusBadge(form.status)}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                      <span><Users className="w-3 h-3 inline mr-1" />{form.signatureCount} {t('econsent.signatures')}</span>
                      <span>{t('econsent.passRate')}: {form.comprehensionPassRate}%</span>
                      {form.withdrawalCount > 0 && (
                        <span className="text-red-500">{form.withdrawalCount} {t('econsent.withdrawals')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {form.status === 'draft' && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditor(form); }}
                        className="px-2 py-1 text-xs font-medium text-accent bg-accent-subtle rounded hover:opacity-80 transition-opacity"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); activateForm(form.id); }}
                        className="px-2 py-1 text-xs font-medium text-green-600 bg-green-500/10 rounded hover:opacity-80 transition-opacity"
                      >
                        {t('econsent.activate')}
                      </button>
                    </>
                  )}
                  {form.status === 'active' && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFormId(form.id); setShowSignForm(true); }}
                        className="px-2 py-1 text-xs font-medium text-accent bg-accent-subtle rounded hover:opacity-80 transition-opacity"
                      >
                        {t('econsent.recordSignature')}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); supersedeForm(form.id); }}
                        className="px-2 py-1 text-xs font-medium text-amber-600 bg-amber-500/10 rounded hover:opacity-80 transition-opacity"
                      >
                        {t('econsent.supersede')}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Expanded: Signatures + Statistics */}
              {selectedFormId === form.id && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  {/* Statistics */}
                  {statistics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-surface-secondary rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-text-primary">{statistics.consentRate}%</div>
                        <div className="text-xs text-text-secondary">{t('econsent.consentRate')}</div>
                      </div>
                      <div className="bg-surface-secondary rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-red-500">{statistics.withdrawalRate}%</div>
                        <div className="text-xs text-text-secondary">{t('econsent.withdrawalRate')}</div>
                      </div>
                      <div className="bg-surface-secondary rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-text-primary">{statistics.comprehensionPassRate}%</div>
                        <div className="text-xs text-text-secondary">{t('econsent.comprehensionPassRate')}</div>
                      </div>
                      <div className="bg-surface-secondary rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-text-primary">{statistics.avgComprehensionScore ?? '-'}%</div>
                        <div className="text-xs text-text-secondary">{t('econsent.avgComprehension')}</div>
                      </div>
                    </div>
                  )}

                  {/* Signature list */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">{t('econsent.signatureList')}</h4>
                    {signatures.length === 0 ? (
                      <p className="text-sm text-text-tertiary">{t('econsent.noSignatures')}</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-text-tertiary border-b border-border">
                            <th className="text-left py-1.5 font-medium">{t('econsent.subjectId')}</th>
                            <th className="text-left py-1.5 font-medium">{t('econsent.signedAt')}</th>
                            <th className="text-left py-1.5 font-medium">{t('econsent.comprehension')}</th>
                            <th className="text-left py-1.5 font-medium">{t('econsent.method')}</th>
                            <th className="text-left py-1.5 font-medium">{t('econsent.status')}</th>
                            <th className="text-right py-1.5 font-medium">{t('common.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {signatures.map((sig) => (
                            <tr key={sig.id} className="border-b border-border/50 last:border-b-0">
                              <td className="py-2 text-text-primary font-mono text-xs">{sig.subjectId}</td>
                              <td className="py-2 text-text-secondary text-xs">{new Date(sig.signedAt).toLocaleDateString()}</td>
                              <td className="py-2">
                                {sig.comprehensionScore !== null ? (
                                  <span className={`text-xs font-medium ${sig.comprehensionPassed ? 'text-green-600' : 'text-red-500'}`}>
                                    {sig.comprehensionScore}%
                                  </span>
                                ) : (
                                  <span className="text-xs text-text-tertiary">-</span>
                                )}
                              </td>
                              <td className="py-2 text-xs text-text-secondary">{sig.method}</td>
                              <td className="py-2">
                                {sig.withdrawnAt ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-md">
                                    <XCircle className="w-3 h-3" />{t('econsent.withdrawn')}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                                    <Check className="w-3 h-3" />{t('econsent.active')}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 text-right">
                                {!sig.withdrawnAt && (
                                  <button
                                    onClick={() => withdrawConsent(sig.id)}
                                    className="text-xs text-red-500 hover:underline"
                                  >
                                    {t('econsent.withdraw')}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Sign Form Modal */}
      {showSignForm && selectedFormId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowSignForm(false)}>
          <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">{t('econsent.recordSignature')}</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('econsent.subjectId')}</label>
                <input
                  type="text"
                  value={signSubjectId}
                  onChange={(e) => setSignSubjectId(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="SUBJ-001"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('econsent.comprehensionScore')}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={signComprehensionScore ?? ''}
                  onChange={(e) => setSignComprehensionScore(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="80"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('econsent.method')}</label>
                <select
                  value={signMethod}
                  onChange={(e) => setSignMethod(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="electronic">{t('econsent.method_electronic')}</option>
                  <option value="wet_ink">{t('econsent.method_wet_ink')}</option>
                  <option value="remote">{t('econsent.method_remote')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('econsent.witnessName')} ({t('econsent.optional')})</label>
                <input
                  type="text"
                  value={signWitnessName}
                  onChange={(e) => setSignWitnessName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Witness name"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button onClick={() => setShowSignForm(false)} className="px-4 py-1.5 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors">
                {t('common.cancel')}
              </button>
              <button
                onClick={signConsent}
                disabled={signing || !signSubjectId.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {signing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {t('econsent.sign')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowEditor(false)}>
          <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border shrink-0">
              <h3 className="text-base font-semibold text-text-primary">
                {editingId ? t('econsent.editForm') : t('econsent.newForm')}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('econsent.formTitle')}</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Informed Consent Form"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('econsent.content')}</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                  placeholder="Consent form content (Markdown supported)..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={editRequireComprehension}
                    onChange={(e) => setEditRequireComprehension(e.target.checked)}
                    className="rounded border-border"
                  />
                  {t('econsent.requireComprehension')}
                </label>
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={editReconsentOnAmendment}
                    onChange={(e) => setEditReconsentOnAmendment(e.target.checked)}
                    className="rounded border-border"
                  />
                  {t('econsent.reconsentOnAmendment')}
                </label>
              </div>

              {/* Comprehension Questions Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-text-secondary">{t('econsent.comprehensionQuestions')}</label>
                  <button
                    onClick={addQuestion}
                    className="text-xs text-accent hover:underline"
                  >
                    + {t('econsent.addQuestion')}
                  </button>
                </div>
                <div className="space-y-3">
                  {editQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-surface-secondary rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm bg-surface text-text-primary border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder={`Question ${qIdx + 1}`}
                        />
                        <button onClick={() => removeQuestion(qIdx)} className="text-red-500 hover:opacity-70">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 ml-4">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctIndex === oIdx}
                            onChange={() => updateQuestion(qIdx, 'correctIndex', oIdx)}
                            className="shrink-0"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                            className="flex-1 px-2 py-1 text-xs bg-surface text-text-primary border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder={`Option ${oIdx + 1}`}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(qIdx)}
                        className="ml-4 text-xs text-accent hover:underline"
                      >
                        + {t('econsent.addOption')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2 shrink-0">
              <button onClick={() => setShowEditor(false)} className="px-4 py-1.5 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors">
                {t('common.cancel')}
              </button>
              <button
                onClick={saveForm}
                disabled={saving || !editTitle.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EConsentManager;
