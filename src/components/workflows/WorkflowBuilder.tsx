import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';

interface SkipCondition {
  field: string;
  operator: string;
  value: string;
}

interface StepDraft {
  name: string;
  type: string;
  assigneeRole: string;
  requiredApprovers: number;
  slaHours: number | null;
  escalateTo: string;
  logic: string;
  skipCondition: SkipCondition | null;
  rejectAction: string;
  rejectTarget: number | null;
}

interface TemplateDraft {
  id?: string;
  name: string;
  description: string;
  entityType: string;
  enabled: boolean;
  steps: StepDraft[];
}

const ENTITY_TYPES = ['requirement', 'document', 'capa', 'batch', 'design_item', 'change_control'];
const STEP_TYPES = ['approval', 'review', 'sign', 'notify'];
const ROLES = ['admin', 'qa_manager', 'qa_engineer', 'auditor', 'reviewer'];
const CONDITION_OPERATORS = ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'contains', 'in'];
const CONDITION_FIELDS = ['status', 'riskLevel', 'severity', 'classification', 'type', 'area', 'priority'];

const emptyStep = (): StepDraft => ({
  name: '',
  type: 'approval',
  assigneeRole: 'qa_manager',
  requiredApprovers: 1,
  slaHours: null,
  escalateTo: '',
  logic: 'and',
  skipCondition: null,
  rejectAction: 'cancel',
  rejectTarget: null,
});

const emptyTemplate = (): TemplateDraft => ({
  name: '',
  description: '',
  entityType: 'requirement',
  enabled: true,
  steps: [emptyStep()],
});

interface Props {
  templateId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function WorkflowBuilder({ templateId, onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [template, setTemplate] = useState<TemplateDraft>(emptyTemplate());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const canAdmin = roleHasPermission(user?.role, 'canAdmin');

  useEffect(() => {
    if (templateId && token) {
      apiFetch<{ template: any }>(`/workflows/templates/${templateId}`)
        .then((data) => {
          if (data.template) {
            setTemplate({
              id: data.template.id,
              name: data.template.name,
              description: data.template.description,
              entityType: data.template.entityType,
              enabled: data.template.enabled,
              steps: data.template.steps.map((s: any) => ({
                name: s.name,
                type: s.type,
                assigneeRole: s.assigneeRole,
                requiredApprovers: s.requiredApprovers,
                slaHours: s.slaHours,
                escalateTo: s.escalateTo || '',
                logic: s.logic || 'and',
                skipCondition: s.skipCondition || null,
                rejectAction: s.rejectAction || 'cancel',
                rejectTarget: s.rejectTarget ?? null,
              })),
            });
          }
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load template'));
    }
  }, [templateId, token]);

  const addStep = () => {
    setTemplate({ ...template, steps: [...template.steps, emptyStep()] });
  };

  const removeStep = (index: number) => {
    if (template.steps.length <= 1) return;
    setTemplate({ ...template, steps: template.steps.filter((_, i) => i !== index) });
  };

  const updateStep = (index: number, field: keyof StepDraft, value: any) => {
    const steps = [...template.steps];
    steps[index] = { ...steps[index], [field]: value };
    setTemplate({ ...template, steps });
  };

  const moveStep = (from: number, to: number) => {
    if (to < 0 || to >= template.steps.length) return;
    const steps = [...template.steps];
    const [moved] = steps.splice(from, 1);
    steps.splice(to, 0, moved);
    setTemplate({ ...template, steps });
  };

  const toggleSkipCondition = (index: number) => {
    const steps = [...template.steps];
    if (steps[index].skipCondition) {
      steps[index] = { ...steps[index], skipCondition: null };
    } else {
      steps[index] = { ...steps[index], skipCondition: { field: 'status', operator: 'eq', value: '' } };
    }
    setTemplate({ ...template, steps });
  };

  const updateSkipCondition = (index: number, field: keyof SkipCondition, value: string) => {
    const steps = [...template.steps];
    const cond = steps[index].skipCondition;
    if (!cond) return;
    steps[index] = { ...steps[index], skipCondition: { ...cond, [field]: value } };
    setTemplate({ ...template, steps });
  };

  const handleSave = async () => {
    if (!canAdmin) {
      setError('Insufficient permissions: requires canAdmin');
      return;
    }
    if (!template.name.trim()) {
      setError(t('workflows.nameRequired'));
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      name: template.name,
      description: template.description,
      entityType: template.entityType,
      enabled: template.enabled,
      steps: template.steps.map((s, i) => ({
        order: i,
        name: s.name || `Step ${i + 1}`,
        type: s.type,
        assigneeRole: s.assigneeRole,
        requiredApprovers: s.requiredApprovers,
        slaHours: s.slaHours || null,
        escalateTo: s.escalateTo || null,
        logic: s.logic,
        skipCondition: s.skipCondition,
        rejectAction: s.rejectAction,
        rejectTarget: s.rejectAction === 'goto_step' ? s.rejectTarget : null,
      })),
    };

    try {
      await apiFetch(template.id ? `/workflows/templates/${template.id}` : '/workflows/templates', {
        method: template.id ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      setError('');
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
      <h3 className="text-lg font-semibold text-text-primary">
        {template.id ? t('workflows.editTemplate') : t('workflows.createTemplate')}
      </h3>

      {error && (
        <div className="bg-red-500/10 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('workflows.templateName')}</label>
          <input
            type="text"
            value={template.name}
            onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            disabled={!canAdmin}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t('workflows.templateNamePlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('workflows.entityType')}</label>
          <select
            value={template.entityType}
            onChange={(e) => setTemplate({ ...template, entityType: e.target.value })}
            disabled={!canAdmin}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {ENTITY_TYPES.map((et) => (
              <option key={et} value={et}>{et.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{t('workflows.description')}</label>
        <textarea
          value={template.description}
          onChange={(e) => setTemplate({ ...template, description: e.target.value })}
          disabled={!canAdmin}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          rows={2}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={template.enabled}
          onChange={(e) => setTemplate({ ...template, enabled: e.target.checked })}
          disabled={!canAdmin}
          className="rounded border-border"
        />
        <span className="text-sm text-text-secondary">{t('workflows.enabled')}</span>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-primary">{t('workflows.steps')}</h4>
          <button
            onClick={addStep}
            disabled={!canAdmin}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('workflows.addStep')}
          </button>
        </div>

        {template.steps.map((step, i) => (
          <div key={i} className="bg-surface-secondary rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm font-medium text-text-primary">
                  {t('workflows.stepN', { n: i + 1 })}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveStep(i, i - 1)}
                    disabled={!canAdmin || i === 0}
                    className="text-xs text-text-tertiary hover:text-text-primary disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveStep(i, i + 1)}
                    disabled={!canAdmin || i === template.steps.length - 1}
                    className="text-xs text-text-tertiary hover:text-text-primary disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeStep(i)}
                disabled={!canAdmin || template.steps.length <= 1}
                className="text-text-tertiary hover:text-red-500 disabled:opacity-30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-text-tertiary mb-1">{t('workflows.stepName')}</label>
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => updateStep(i, 'name', e.target.value)}
                  disabled={!canAdmin}
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder={`Step ${i + 1}`}
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">{t('workflows.stepType')}</label>
                <select
                  value={step.type}
                  onChange={(e) => updateStep(i, 'type', e.target.value)}
                  disabled={!canAdmin}
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {STEP_TYPES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">{t('workflows.assigneeRole')}</label>
                <select
                  value={step.assigneeRole}
                  onChange={(e) => updateStep(i, 'assigneeRole', e.target.value)}
                  disabled={!canAdmin}
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">{t('workflows.requiredApprovers')}</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={step.requiredApprovers}
                  onChange={(e) => updateStep(i, 'requiredApprovers', parseInt(e.target.value) || 1)}
                  disabled={!canAdmin}
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">{t('workflows.slaHours')}</label>
                <input
                  type="number"
                  min={0}
                  value={step.slaHours ?? ''}
                  onChange={(e) => updateStep(i, 'slaHours', e.target.value ? parseInt(e.target.value) : null)}
                  disabled={!canAdmin}
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder={t('workflows.optional')}
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">{t('workflows.escalateTo')}</label>
                <select
                  value={step.escalateTo}
                  onChange={(e) => updateStep(i, 'escalateTo', e.target.value)}
                  disabled={!canAdmin}
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">{t('workflows.none')}</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conditional Routing Section */}
            <div className="border-t border-border pt-3 space-y-3">
              <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">{t('workflows.conditionalRouting')}</h5>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Logic Toggle */}
                <div>
                  <label className="block text-xs text-text-tertiary mb-1">{t('workflows.approvalLogic')}</label>
                  <select
                    value={step.logic}
                    onChange={(e) => updateStep(i, 'logic', e.target.value)}
                    disabled={!canAdmin}
                    className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="and">{t('workflows.logicAnd')}</option>
                    <option value="or">{t('workflows.logicOr')}</option>
                  </select>
                </div>

                {/* Reject Action */}
                <div>
                  <label className="block text-xs text-text-tertiary mb-1">{t('workflows.rejectAction')}</label>
                  <select
                    value={step.rejectAction}
                    onChange={(e) => updateStep(i, 'rejectAction', e.target.value)}
                    disabled={!canAdmin}
                    className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="cancel">{t('workflows.rejectCancel')}</option>
                    <option value="restart">{t('workflows.rejectRestart')}</option>
                    <option value="goto_step">{t('workflows.rejectGotoStep')}</option>
                  </select>
                </div>

                {/* Reject Target (only visible if goto_step) */}
                {step.rejectAction === 'goto_step' && (
                  <div>
                    <label className="block text-xs text-text-tertiary mb-1">{t('workflows.rejectTargetStep')}</label>
                    <select
                      value={step.rejectTarget ?? 0}
                      onChange={(e) => updateStep(i, 'rejectTarget', parseInt(e.target.value))}
                      disabled={!canAdmin}
                      className="w-full px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {template.steps.map((_, si) => (
                        <option key={si} value={si}>
                          {t('workflows.stepN', { n: si + 1 })} {template.steps[si].name ? `- ${template.steps[si].name}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Skip Condition */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={step.skipCondition !== null}
                    onChange={() => toggleSkipCondition(i)}
                    disabled={!canAdmin}
                    className="rounded border-border"
                  />
                  <span className="text-xs text-text-secondary">{t('workflows.enableSkipCondition')}</span>
                </div>

                {step.skipCondition && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-text-tertiary">{t('workflows.skipIf')}</span>
                    <select
                      value={step.skipCondition.field}
                      onChange={(e) => updateSkipCondition(i, 'field', e.target.value)}
                      disabled={!canAdmin}
                      className="px-2 py-1 bg-surface border border-border rounded text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {CONDITION_FIELDS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <select
                      value={step.skipCondition.operator}
                      onChange={(e) => updateSkipCondition(i, 'operator', e.target.value)}
                      disabled={!canAdmin}
                      className="px-2 py-1 bg-surface border border-border rounded text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {CONDITION_OPERATORS.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={step.skipCondition.value}
                      onChange={(e) => updateSkipCondition(i, 'value', e.target.value)}
                      disabled={!canAdmin}
                      className="px-2 py-1 bg-surface border border-border rounded text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent w-32"
                      placeholder={t('workflows.conditionValue')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !canAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? t('common.saving') : t('common.save')}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>
    </div>
  );
}
