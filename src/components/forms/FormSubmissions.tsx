import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, Eye, ThumbsUp, Search, Loader2 } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { getProjectId } from '../../lib/projectUtils';

interface Submission {
  id: string;
  templateId: string;
  projectId: string;
  entityType: string | null;
  entityId: string | null;
  data: Record<string, any>;
  submittedBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  template?: { name: string; entityType: string };
}

interface FieldDef {
  id: string;
  label: string;
  type: string;
}

interface FormSubmissionsProps {
  templateId?: string;
}

export function FormSubmissions({ templateId }: FormSubmissionsProps) {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [search, setSearch] = useState('');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (templateId) params.set('templateId', templateId);
      if (projectId) params.set('projectId', projectId);

      const { submissions: data } = await apiFetch<{ submissions: Submission[] }>(
        `/forms/submissions?${params.toString()}`
      );
      setSubmissions(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [templateId, projectId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // When expanding a submission, fetch template fields for rendering
  const handleExpand = useCallback(async (sub: Submission) => {
    if (expandedId === sub.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(sub.id);
    try {
      const { template } = await apiFetch<{ template: any }>(
        `/forms/templates/${sub.templateId}`
      );
      setFields(template.fields || []);
    } catch {
      setFields([]);
    }
  }, [expandedId]);

  const handleReview = useCallback(async (submissionId: string, status: 'reviewed' | 'approved') => {
    try {
      await apiFetch(`/forms/submissions/${submissionId}/review`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status } : s))
      );
    } catch {
      // silent
    }
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'reviewed':
        return <ThumbsUp className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filtered = search
    ? submissions.filter(
        (s) =>
          s.template?.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.submittedBy.toLowerCase().includes(search.toLowerCase()) ||
          s.status.toLowerCase().includes(search.toLowerCase())
      )
    : submissions;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('forms.searchSubmissions')}
          className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-8">{t('forms.noSubmissions')}</p>
      )}

      <div className="space-y-2">
        {filtered.map((sub) => (
          <div key={sub.id} className="border border-border rounded-lg overflow-hidden">
            <div
              onClick={() => handleExpand(sub)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-hover transition-colors"
            >
              {statusIcon(sub.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {sub.template?.name || t('forms.unknownTemplate')}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t('forms.submittedByAt', {
                    user: sub.submittedBy,
                    date: new Date(sub.createdAt).toLocaleDateString(),
                  })}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  sub.status === 'approved'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : sub.status === 'reviewed'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {sub.status}
              </span>
              <Eye className="w-4 h-4 text-text-tertiary" />
            </div>

            {expandedId === sub.id && (
              <div className="px-4 pb-4 pt-2 border-t border-border bg-surface-secondary">
                <div className="space-y-2">
                  {fields.map((field) => {
                    const value = sub.data[field.id];
                    if (value === undefined || value === null || value === '') return null;
                    return (
                      <div key={field.id}>
                        <span className="text-xs font-medium text-text-tertiary">{field.label}</span>
                        <p className="text-sm text-text-primary">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                      </div>
                    );
                  })}
                  {fields.length === 0 && (
                    <pre className="text-xs text-text-secondary bg-surface p-2 rounded overflow-auto">
                      {JSON.stringify(sub.data, null, 2)}
                    </pre>
                  )}
                </div>

                {sub.status === 'submitted' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => handleReview(sub.id, 'reviewed')}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {t('forms.markReviewed')}
                    </button>
                    <button
                      onClick={() => handleReview(sub.id, 'approved')}
                      className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {t('forms.approve')}
                    </button>
                  </div>
                )}
                {sub.status === 'reviewed' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => handleReview(sub.id, 'approved')}
                      className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {t('forms.approve')}
                    </button>
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
