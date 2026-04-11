import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, List, Loader2, Trash2, Edit2 } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { getProjectId } from '../../lib/projectUtils';
import { FormBuilder } from './FormBuilder';
import { FormRenderer } from './FormRenderer';
import { FormSubmissions } from './FormSubmissions';

interface Template {
  id: string;
  name: string;
  description: string;
  entityType: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

type ManagerView = 'list' | 'builder' | 'preview' | 'submissions' | 'fill';

export function FormManagerView() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);

  const [view, setView] = useState<ManagerView>('list');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const { templates: data } = await apiFetch<{ templates: Template[] }>('/forms/templates');
      setTemplates(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleNewTemplate = () => {
    setActiveTemplate(null);
    setView('builder');
  };

  const handleEditTemplate = (template: Template) => {
    setActiveTemplate(template);
    setView('builder');
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm(t('forms.confirmDelete'))) return;
    try {
      await apiFetch(`/forms/templates/${id}`, { method: 'DELETE' });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // silent
    }
  };

  const handleSaveTemplate = async (data: {
    name: string;
    description: string;
    entityType: string;
    fields: any[];
  }) => {
    setSaving(true);
    try {
      if (activeTemplate) {
        // Update existing
        await apiFetch(`/forms/templates/${activeTemplate.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            entityType: data.entityType,
          }),
        });

        // Sync fields: delete all then re-create
        for (const existingField of activeTemplate.fields) {
          await apiFetch(
            `/forms/templates/${activeTemplate.id}/fields/${existingField.id}`,
            { method: 'DELETE' }
          );
        }
        for (const field of data.fields) {
          await apiFetch(`/forms/templates/${activeTemplate.id}/fields`, {
            method: 'POST',
            body: JSON.stringify(field),
          });
        }
      } else {
        // Create new
        await apiFetch('/forms/templates', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      await fetchTemplates();
      setView('list');
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setView('preview');
  };

  const handleFillForm = (template: Template) => {
    setActiveTemplate(template);
    setView('fill');
  };

  const handleViewSubmissions = (template: Template) => {
    setActiveTemplate(template);
    setView('submissions');
  };

  if (loading && view === 'list') {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-text-tertiary" />
      </div>
    );
  }

  // Builder view
  if (view === 'builder') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {t('common.back')}
          </button>
          <span className="text-text-tertiary">/</span>
          <span className="text-sm font-medium text-text-primary">
            {activeTemplate ? t('forms.editTemplate') : t('forms.newTemplate')}
          </span>
        </div>
        <FormBuilder
          templateName={activeTemplate?.name || ''}
          templateDescription={activeTemplate?.description || ''}
          entityType={activeTemplate?.entityType || 'custom'}
          fields={activeTemplate?.fields?.map((f: any) => ({
            id: f.id,
            order: f.order,
            label: f.label,
            type: f.type,
            required: f.required,
            options: f.options,
            placeholder: f.placeholder,
            helpText: f.helpText,
            validation: f.validation,
            conditional: f.conditional,
          })) || []}
          onSave={handleSaveTemplate}
          onPreview={handlePreview}
          saving={saving}
        />
      </div>
    );
  }

  // Preview view
  if (view === 'preview' && activeTemplate) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('builder')}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {t('common.back')}
          </button>
          <span className="text-text-tertiary">/</span>
          <span className="text-sm font-medium text-text-primary">{t('forms.preview')}</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <FormRenderer
            templateId={activeTemplate.id}
            projectId={projectId || ''}
            readOnly
          />
        </div>
      </div>
    );
  }

  // Fill form view
  if (view === 'fill' && activeTemplate) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {t('common.back')}
          </button>
          <span className="text-text-tertiary">/</span>
          <span className="text-sm font-medium text-text-primary">{t('forms.fillForm')}</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <FormRenderer
            templateId={activeTemplate.id}
            projectId={projectId || ''}
            onSubmit={() => {
              setView('list');
            }}
          />
        </div>
      </div>
    );
  }

  // Submissions view
  if (view === 'submissions') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {t('common.back')}
          </button>
          <span className="text-text-tertiary">/</span>
          <span className="text-sm font-medium text-text-primary">
            {t('forms.submissions')} {activeTemplate ? `- ${activeTemplate.name}` : ''}
          </span>
        </div>
        <FormSubmissions templateId={activeTemplate?.id} />
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('forms.title')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTemplate(null); setView('submissions'); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
          >
            <List className="w-4 h-4" />
            {t('forms.allSubmissions')}
          </button>
          <button
            onClick={handleNewTemplate}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('forms.newTemplate')}
          </button>
        </div>
      </div>

      {templates.length === 0 && (
        <div className="text-center py-16 text-text-tertiary">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t('forms.noTemplates')}</p>
          <p className="text-xs mt-1">{t('forms.createFirstHint')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-surface border border-border rounded-xl p-4 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">{tmpl.name}</h3>
                {tmpl.description && (
                  <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2">{tmpl.description}</p>
                )}
              </div>
              <span className="text-xs px-2 py-0.5 bg-accent-subtle text-accent rounded-full">
                {tmpl.entityType}
              </span>
            </div>
            <p className="text-xs text-text-tertiary mb-3">
              {tmpl.fields.length} {t('forms.fieldsCount')} | {new Date(tmpl.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => handleFillForm(tmpl)}
                className="flex-1 px-2 py-1.5 text-xs bg-accent text-white rounded-lg hover:bg-accent/90"
              >
                {t('forms.fillForm')}
              </button>
              <button
                onClick={() => handleViewSubmissions(tmpl)}
                className="px-2 py-1.5 text-xs border border-border rounded-lg hover:bg-surface-hover text-text-secondary"
              >
                <List className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleEditTemplate(tmpl)}
                className="px-2 py-1.5 text-xs border border-border rounded-lg hover:bg-surface-hover text-text-secondary"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDeleteTemplate(tmpl.id)}
                className="px-2 py-1.5 text-xs border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
