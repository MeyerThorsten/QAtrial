import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Inbox, CheckCircle2, XCircle, UserPlus, Clock, Plus, Settings2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowStatus } from './WorkflowStatus';

interface ExecutionItem {
  id: string;
  templateId: string;
  entityType: string;
  entityId: string;
  projectId: string;
  currentStep: number;
  status: string;
  startedAt: string;
  template: {
    name: string;
    steps: {
      id: string;
      order: number;
      name: string;
      type: string;
      assigneeRole: string;
      requiredApprovers: number;
      slaHours: number | null;
      escalateTo: string | null;
    }[];
  };
  actions: {
    id: string;
    stepOrder: number;
    userId: string;
    userName: string;
    action: string;
    reason: string | null;
    timestamp: string;
  }[];
}

export function WorkflowInbox() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [pending, setPending] = useState<ExecutionItem[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'inbox' | 'templates'>('inbox');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editTemplateId, setEditTemplateId] = useState<string | undefined>();
  const [actionReason, setActionReason] = useState<Record<string, string>>({});
  const [delegateTo, setDelegateTo] = useState<Record<string, string>>({});
  const [selectedExecution, setSelectedExecution] = useState<ExecutionItem | null>(null);

  const canAdmin = roleHasPermission(user?.role, 'canAdmin');

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pendingRes, templatesRes] = await Promise.all([
        apiFetch<{ executions: ExecutionItem[] }>('/workflows/executions/my-pending'),
        apiFetch<{ templates: any[] }>('/workflows/templates'),
      ]);
      setPending(pendingRes.executions || []);
      setTemplates(templatesRes.templates || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (executionId: string, action: string) => {
    try {
      const body: any = { action, reason: actionReason[executionId] || '' };
      if (action === 'delegated') {
        body.delegatedTo = delegateTo[executionId] || '';
      }
      await apiFetch(`/workflows/executions/${executionId}/act`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform workflow action');
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!canAdmin) {
      setError('Insufficient permissions: requires canAdmin');
      return;
    }
    try {
      await apiFetch(`/workflows/templates/${id}`, {
        method: 'DELETE',
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  const getSlaRemaining = (exec: ExecutionItem) => {
    const step = exec.template.steps[exec.currentStep];
    if (!step?.slaHours) return null;
    const startedAt = new Date(exec.startedAt).getTime();
    const deadline = startedAt + step.slaHours * 60 * 60 * 1000;
    const remaining = deadline - Date.now();
    if (remaining <= 0) return t('workflows.overdue');
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (showBuilder) {
    return (
      <WorkflowBuilder
        templateId={editTemplateId}
        onSaved={() => { setShowBuilder(false); setEditTemplateId(undefined); fetchData(); }}
        onCancel={() => { setShowBuilder(false); setEditTemplateId(undefined); }}
      />
    );
  }

  if (selectedExecution) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedExecution(null)}
          className="text-sm text-accent hover:underline"
        >
          {t('common.back')}
        </button>
        <WorkflowStatus
          steps={selectedExecution.template.steps}
          currentStep={selectedExecution.currentStep}
          status={selectedExecution.status}
          actions={selectedExecution.actions}
        />
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

      {/* Tab switcher */}
      <div className="flex items-center gap-4 border-b border-border pb-2">
        <button
          onClick={() => setView('inbox')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-lg transition-colors ${
            view === 'inbox'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          <Inbox className="w-4 h-4" />
          {t('workflows.inbox')} ({pending.length})
        </button>
        <button
          onClick={() => setView('templates')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-lg transition-colors ${
            view === 'templates'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          {t('workflows.templates')} ({templates.length})
        </button>
      </div>

      {view === 'inbox' && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-text-tertiary">
              <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>{t('workflows.noInboxItems')}</p>
            </div>
          ) : (
            pending.map((exec) => {
              const currentStepDef = exec.template.steps[exec.currentStep];
              const sla = getSlaRemaining(exec);
              return (
                <div key={exec.id} className="bg-surface rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">{exec.template.name}</h4>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {exec.entityType.replace(/_/g, ' ')} &middot; {t('workflows.stepN', { n: exec.currentStep + 1 })}: {currentStepDef?.name || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {sla && (
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          sla === t('workflows.overdue') ? 'bg-red-500/10 text-red-600' : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {sla}
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedExecution(exec)}
                        className="text-xs text-accent hover:underline"
                      >
                        {t('workflows.viewProgress')}
                      </button>
                    </div>
                  </div>

                  {/* Reason input */}
                  <div>
                    <input
                      type="text"
                      value={actionReason[exec.id] || ''}
                      onChange={(e) => setActionReason({ ...actionReason, [exec.id]: e.target.value })}
                      className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder={t('workflows.reasonPlaceholder')}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleAction(exec.id, 'approved')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t('workflows.approve')}
                    </button>
                    <button
                      onClick={() => handleAction(exec.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {t('workflows.reject')}
                    </button>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={delegateTo[exec.id] || ''}
                        onChange={(e) => setDelegateTo({ ...delegateTo, [exec.id]: e.target.value })}
                        className="px-2 py-1.5 bg-surface-secondary border border-border rounded text-text-primary text-xs w-32 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder={t('workflows.delegateToPlaceholder')}
                      />
                      <button
                        onClick={() => handleAction(exec.id, 'delegated')}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <UserPlus className="w-3 h-3" />
                        {t('workflows.delegate')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {view === 'templates' && (
        <div className="space-y-4">
          {canAdmin && (
            <div className="flex justify-end">
              <button
                onClick={() => { setEditTemplateId(undefined); setShowBuilder(true); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('workflows.createTemplate')}
              </button>
            </div>
          )}

          {templates.length === 0 ? (
            <div className="text-center py-12 text-text-tertiary">
              <p>{t('workflows.noTemplates')}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {templates.map((tpl: any) => (
                <div key={tpl.id} className="bg-surface rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{tpl.name}</h4>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {tpl.entityType.replace(/_/g, ' ')} &middot; {tpl.steps?.length || 0} {t('workflows.steps').toLowerCase()} &middot;{' '}
                      {tpl.enabled ? t('workflows.active') : t('workflows.disabled')}
                    </p>
                  </div>
                  {canAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditTemplateId(tpl.id); setShowBuilder(true); }}
                        className="text-xs text-accent hover:underline"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => deleteTemplate(tpl.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
