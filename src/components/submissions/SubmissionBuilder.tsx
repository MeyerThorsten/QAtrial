import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Download, Send, RefreshCw, Trash2, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

interface SubmissionSection {
  name: string;
  content: string;
  status: string;
}

interface SubmissionPackage {
  id: string;
  projectId: string;
  type: string;
  title: string;
  status: string;
  targetAuthority: string;
  sections: SubmissionSection[];
  generatedAt: string | null;
  submittedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const SUBMISSION_TYPES = [
  { id: 'fda_510k', label: 'FDA 510(k)', authority: 'FDA', description: 'Premarket notification for medical devices' },
  { id: 'eu_mdr_td', label: 'EU MDR Technical Documentation', authority: 'Notified Body', description: 'MDR Annex II/III documentation' },
  { id: 'pmda_sted', label: 'PMDA STED', authority: 'PMDA', description: 'Summary Technical Documentation for Japan' },
  { id: 'ectd_module3', label: 'eCTD Module 3', authority: 'EMA', description: 'Quality module for pharmaceutical submissions' },
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  submitted: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

export function SubmissionBuilder() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');
  const canApprove = roleHasPermission(user?.role, 'canApprove');

  const [submissions, setSubmissions] = useState<SubmissionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionPackage | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [createType, setCreateType] = useState('');
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    if (!token || !projectId) return;
    try {
      const data: any = await apiFetch(`/api/submissions?projectId=${projectId}`, {});
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      console.error('Fetch submissions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token, projectId]);

  const handleCreate = async () => {
    if (!createType || !createTitle.trim()) return;
    setError('');
    const typeInfo = SUBMISSION_TYPES.find((t) => t.id === createType);
    try {
      await apiFetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          type: createType,
          title: createTitle.trim(),
          targetAuthority: typeInfo?.authority ?? 'Unknown',
         }),
      });
      setShowCreate(false);
      setCreateTitle('');
      setCreateType('');
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    }
  };

  const handleGenerate = async (id: string) => {
    try {
      const data: any = await apiFetch(`/api/submissions/${id}/generate`, { method: 'POST' });
      setSelectedSubmission(data.submission);
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to generate');
    }
  };

  const handleExport = async (id: string) => {
    try {
      const data: any = await apiFetch(`/api/submissions/${id}/export`, {});
      const blob = new Blob([JSON.stringify(data.export, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submission-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to export');
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      const data: any = await apiFetch(`/api/submissions/${id}/submit`, { method: 'PUT' });
      setSelectedSubmission(data.submission);
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/api/submissions/${id}`, { method: 'DELETE' });
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  };

  const handleSaveSection = async (sectionIndex: number) => {
    if (!selectedSubmission) return;
    const sections = [...(selectedSubmission.sections as SubmissionSection[])];
    sections[sectionIndex] = { ...sections[sectionIndex], content: editContent };
    try {
      const data: any = await apiFetch(`/api/submissions/${selectedSubmission.id}`, {
        method: 'PUT',
        body: JSON.stringify({ sections  }),
      });
      setSelectedSubmission(data.submission);
      setEditingSection(null);
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to save section');
    }
  };

  const toggleSection = (idx: number) => {
    const next = new Set(expandedSections);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpandedSections(next);
  };

  if (!projectId) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>{t('submissions.noProject')}</p>
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

  // Detail view
  if (selectedSubmission) {
    const sections = (selectedSubmission.sections || []) as SubmissionSection[];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              {t('common.back')}
            </button>
            <h2 className="text-lg font-semibold text-text-primary">{selectedSubmission.title}</h2>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedSubmission.status] || ''}`}>
              {selectedSubmission.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && selectedSubmission.status !== 'submitted' && (
              <button
                onClick={() => handleGenerate(selectedSubmission.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90"
              >
                <RefreshCw className="w-4 h-4" />
                {t('submissions.generate')}
              </button>
            )}
            <button
              onClick={() => handleExport(selectedSubmission.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover"
            >
              <Download className="w-4 h-4" />
              {t('submissions.export')}
            </button>
            {canApprove && selectedSubmission.status !== 'submitted' && (
              <button
                onClick={() => handleSubmit(selectedSubmission.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                {t('submissions.submit')}
              </button>
            )}
          </div>
        </div>

        <div className="text-sm text-text-secondary">
          {t('submissions.type')}: <strong>{SUBMISSION_TYPES.find((t) => t.id === selectedSubmission.type)?.label}</strong>
          {' | '}
          {t('submissions.authority')}: <strong>{selectedSubmission.targetAuthority}</strong>
          {selectedSubmission.generatedAt && (
            <>
              {' | '}
              {t('submissions.generatedAt')}: {new Date(selectedSubmission.generatedAt).toLocaleString()}
            </>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="space-y-2">
          {sections.map((section, idx) => (
            <div key={idx} className="border border-border rounded-lg bg-surface">
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-text-primary">{section.name}</span>
                {expandedSections.has(idx) ? (
                  <ChevronUp className="w-4 h-4 text-text-tertiary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-tertiary" />
                )}
              </button>
              {expandedSections.has(idx) && (
                <div className="px-4 pb-4 border-t border-border">
                  {editingSection === idx ? (
                    <div className="space-y-2 mt-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={8}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveSection(idx)}
                          className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg"
                        >
                          {t('common.save')}
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-3 py-1.5 text-sm border border-border rounded-lg"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <pre className="whitespace-pre-wrap text-sm text-text-secondary font-mono">
                        {section.content || t('submissions.noContent')}
                      </pre>
                      {canEdit && selectedSubmission.status !== 'submitted' && (
                        <button
                          onClick={() => {
                            setEditingSection(idx);
                            setEditContent(section.content || '');
                          }}
                          className="mt-2 inline-flex items-center gap-1 text-sm text-accent hover:underline"
                        >
                          <Edit3 className="w-3 h-3" />
                          {t('common.edit')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List view with create
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          {t('submissions.title')}
        </h2>
        {canEdit && (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            <Plus className="w-4 h-4" />
            {t('submissions.new')}
          </button>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowCreate(false)}>
          <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">{t('submissions.new')}</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('submissions.selectType')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {SUBMISSION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCreateType(type.id)}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        createType === type.id
                          ? 'border-accent bg-accent-subtle'
                          : 'border-border hover:bg-surface-hover'
                      }`}
                    >
                      <div className="font-medium text-sm text-text-primary">{type.label}</div>
                      <div className="text-xs text-text-tertiary mt-0.5">{type.description}</div>
                      <div className="text-xs text-accent mt-1">{type.authority}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('submissions.packageTitle')}</label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder={t('submissions.titlePlaceholder')}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border border-border rounded-lg">
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreate}
                disabled={!createType || !createTitle.trim()}
                className="px-4 py-2 text-sm bg-accent text-white rounded-lg disabled:opacity-50"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions list */}
      {submissions.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>{t('submissions.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelectedSubmission(sub)}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
            >
              <div>
                <div className="font-medium text-text-primary">{sub.title}</div>
                <div className="text-sm text-text-tertiary">
                  {SUBMISSION_TYPES.find((t) => t.id === sub.type)?.label} | {sub.targetAuthority}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[sub.status] || ''}`}>
                  {sub.status}
                </span>
                {canEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(sub.id);
                    }}
                    className="p-1 text-text-tertiary hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
