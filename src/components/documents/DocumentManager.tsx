import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, History } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

interface DocumentVersion {
  id: string;
  version: string;
  content: string;
  changeReason: string | null;
  author: string;
  reviewedBy: string | null;
  approvedBy: string | null;
  effectiveDate: string | null;
  createdAt: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
  currentVersion: string;
  status: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  versions?: DocumentVersion[];
}

export function DocumentManager() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token, user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<Document | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNewVersionForm, setShowNewVersionForm] = useState<string | null>(null);
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');
  const canApprove = roleHasPermission(user?.role, 'canApprove');

  // Create form
  const [newDoc, setNewDoc] = useState({ title: '', type: 'sop', content: '' });
  // New version form
  const [newVersion, setNewVersion] = useState({ content: '', changeReason: '', majorVersion: false });

  const fetchDocuments = async () => {
    if (!projectId || !token) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ documents: Document[] }>(`/documents?projectId=${encodeURIComponent(projectId)}`);
      setDocuments(data.documents || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocDetail = async (id: string) => {
    if (!token) return;
    try {
      const data = await apiFetch<{ document: Document }>(`/documents/${id}`);
      setExpandedDoc(data.document);
      setError('');
    } catch (err) {
      console.error('Failed to fetch document detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch document detail');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [projectId, token]);

  const handleCreate = async () => {
    if (!projectId || !token || !newDoc.title || !canEdit) return;
    try {
      await apiFetch('/documents', {
        method: 'POST',
        body: JSON.stringify({ projectId, ...newDoc }),
      });
      setShowCreateForm(false);
      setNewDoc({ title: '', type: 'sop', content: '' });
      setError('');
      fetchDocuments();
    } catch (err) {
      console.error('Failed to create document:', err);
      setError(err instanceof Error ? err.message : 'Failed to create document');
    }
  };

  const handleCreateVersion = async (docId: string) => {
    if (!token || !newVersion.changeReason || !canEdit) return;
    try {
      await apiFetch(`/documents/${docId}/versions`, {
        method: 'POST',
        body: JSON.stringify(newVersion),
      });
      setShowNewVersionForm(null);
      setNewVersion({ content: '', changeReason: '', majorVersion: false });
      setError('');
      fetchDocuments();
      if (expandedId === docId) fetchDocDetail(docId);
    } catch (err) {
      console.error('Failed to create version:', err);
      setError(err instanceof Error ? err.message : 'Failed to create document version');
    }
  };

  const handleReview = async (docId: string, status: string) => {
    if (!token) return;
    try {
      await apiFetch(`/documents/${docId}/review`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setError('');
      fetchDocuments();
      if (expandedId === docId) fetchDocDetail(docId);
    } catch (err) {
      console.error('Failed to update review status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update review status');
    }
  };

  const handleRetire = async (docId: string) => {
    if (!token || !canApprove) return;
    try {
      await apiFetch(`/documents/${docId}/retire`, {
        method: 'PUT',
      });
      setError('');
      fetchDocuments();
    } catch (err) {
      console.error('Failed to retire document:', err);
      setError(err instanceof Error ? err.message : 'Failed to retire document');
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    in_review: 'bg-purple-100 text-purple-700',
    approved: 'bg-blue-100 text-blue-700',
    effective: 'bg-green-100 text-green-700',
    superseded: 'bg-yellow-100 text-yellow-700',
    retired: 'bg-red-100 text-red-700',
  };

  const typeColors: Record<string, string> = {
    sop: 'bg-blue-100 text-blue-700',
    work_instruction: 'bg-purple-100 text-purple-700',
    policy: 'bg-green-100 text-green-700',
    form: 'bg-orange-100 text-orange-700',
    specification: 'bg-red-100 text-red-700',
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedDoc(null);
    } else {
      setExpandedId(id);
      fetchDocDetail(id);
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('documents.title')}</h2>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('documents.createDocument')}
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">{t('documents.createDocument')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder={t('documents.titlePlaceholder')}
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <select
              value={newDoc.type}
              onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="sop">{t('documents.type_sop')}</option>
              <option value="work_instruction">{t('documents.type_work_instruction')}</option>
              <option value="policy">{t('documents.type_policy')}</option>
              <option value="form">{t('documents.type_form')}</option>
              <option value="specification">{t('documents.type_specification')}</option>
            </select>
          </div>
          <textarea
            rows={4}
            placeholder={t('documents.contentPlaceholder')}
            value={newDoc.content}
            onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90">
              {t('common.save')}
            </button>
            <button onClick={() => setShowCreateForm(false)} className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <FileText className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
          <p className="text-text-tertiary">{t('documents.noDocuments')}</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('documents.docTitle')}</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('documents.type')}</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('documents.version')}</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('documents.status')}</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('documents.lastModified')}</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <Fragment key={doc.id}>
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 text-text-primary font-medium">{doc.title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[doc.type] || 'bg-gray-100 text-gray-700'}`}>
                        {t(`documents.type_${doc.type}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">v{doc.currentVersion}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                        {t(`documents.status_${doc.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(doc.id)}
                          className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                          title={t('documents.viewVersions')}
                        >
                          <History className="w-3 h-3" />
                        </button>
                        {canEdit && doc.status === 'draft' && (
                          <button
                            onClick={() => handleReview(doc.id, 'in_review')}
                            className="text-xs text-purple-600 hover:underline"
                          >
                            {t('documents.submitForReview')}
                          </button>
                        )}
                        {canApprove && doc.status === 'in_review' && (
                          <button
                            onClick={() => handleReview(doc.id, 'approved')}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {t('documents.approve')}
                          </button>
                        )}
                        {canApprove && doc.status === 'approved' && (
                          <button
                            onClick={() => handleReview(doc.id, 'effective')}
                            className="text-xs text-green-600 hover:underline"
                          >
                            {t('documents.makeEffective')}
                          </button>
                        )}
                        {canApprove && doc.status === 'effective' && (
                          <button
                            onClick={() => handleRetire(doc.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            {t('documents.retire')}
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => setShowNewVersionForm(showNewVersionForm === doc.id ? null : doc.id)}
                            className="text-xs text-accent hover:underline"
                          >
                            {t('documents.newVersion')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* New Version Form */}
                  {canEdit && showNewVersionForm === doc.id && (
                    <tr key={`${doc.id}-newversion`}>
                      <td colSpan={6} className="px-4 py-3 bg-surface-secondary">
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-text-primary">{t('documents.newVersion')}</h4>
                          <input
                            type="text"
                            required
                            placeholder={t('documents.changeReasonPlaceholder')}
                            value={newVersion.changeReason}
                            onChange={(e) => setNewVersion({ ...newVersion, changeReason: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                          />
                          <textarea
                            rows={3}
                            placeholder={t('documents.contentPlaceholder')}
                            value={newVersion.content}
                            onChange={(e) => setNewVersion({ ...newVersion, content: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                          />
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-xs text-text-secondary">
                              <input
                                type="checkbox"
                                checked={newVersion.majorVersion}
                                onChange={(e) => setNewVersion({ ...newVersion, majorVersion: e.target.checked })}
                                className="rounded"
                              />
                              {t('documents.majorVersion')}
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCreateVersion(doc.id)}
                              className="px-2 py-1 text-xs font-medium text-white bg-accent rounded-lg hover:bg-accent/90"
                            >
                              {t('common.save')}
                            </button>
                            <button
                              onClick={() => setShowNewVersionForm(null)}
                              className="px-2 py-1 text-xs font-medium text-text-secondary bg-surface border border-border rounded-lg"
                            >
                              {t('common.cancel')}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Version History */}
                  {expandedId === doc.id && expandedDoc && expandedDoc.versions && (
                    <tr key={`${doc.id}-versions`}>
                      <td colSpan={6} className="px-4 py-3 bg-surface-secondary">
                        <h4 className="text-xs font-semibold text-text-primary mb-2">{t('documents.versionHistory')}</h4>
                        <div className="space-y-2">
                          {expandedDoc.versions.map((ver) => (
                            <div key={ver.id} className="flex items-start justify-between bg-surface rounded-lg border border-border p-3 text-xs">
                              <div>
                                <span className="font-medium text-text-primary">v{ver.version}</span>
                                <span className="ml-2 text-text-tertiary">{new Date(ver.createdAt).toLocaleDateString()}</span>
                                {ver.changeReason && (
                                  <p className="text-text-secondary mt-1">{ver.changeReason}</p>
                                )}
                              </div>
                              <div className="text-right text-text-tertiary">
                                {ver.approvedBy && <p>{t('documents.approvedBy')}: {ver.approvedBy}</p>}
                                {ver.effectiveDate && <p>{t('documents.effectiveDate')}: {new Date(ver.effectiveDate).toLocaleDateString()}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
