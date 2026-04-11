import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Trash2, ChevronUp, ChevronDown, Eye, Save, GripVertical,
  Type, AlignLeft, Hash, Calendar, List, CheckSquare, Circle, Upload, PenTool, Heading,
} from 'lucide-react';

interface FormFieldDef {
  id: string;
  order: number;
  label: string;
  type: string;
  required: boolean;
  options: string[] | null;
  placeholder: string | null;
  helpText: string | null;
  validation: Record<string, any> | null;
  conditional: { dependsOnField: string; showWhen: string } | null;
}

interface FormBuilderProps {
  templateName: string;
  templateDescription: string;
  entityType: string;
  fields: FormFieldDef[];
  onSave: (data: {
    name: string;
    description: string;
    entityType: string;
    fields: FormFieldDef[];
  }) => void;
  onPreview: () => void;
  saving?: boolean;
}

const FIELD_TYPES = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'textarea', label: 'Text Area', icon: AlignLeft },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'select', label: 'Dropdown', icon: List },
  { type: 'multi_select', label: 'Multi Select', icon: List },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio', icon: Circle },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'signature', label: 'Signature', icon: PenTool },
  { type: 'section_header', label: 'Section Header', icon: Heading },
];

export function FormBuilder({ templateName, templateDescription, entityType, fields: initialFields, onSave, onPreview, saving }: FormBuilderProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(templateName);
  const [description, setDescription] = useState(templateDescription);
  const [entType, setEntType] = useState(entityType);
  const [fields, setFields] = useState<FormFieldDef[]>(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const addField = useCallback((type: string) => {
    const newField: FormFieldDef = {
      id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      order: fields.length,
      label: FIELD_TYPES.find((ft) => ft.type === type)?.label || 'New Field',
      type,
      required: false,
      options: ['select', 'multi_select', 'radio'].includes(type) ? ['Option 1', 'Option 2'] : null,
      placeholder: null,
      helpText: null,
      validation: null,
      conditional: null,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  }, [fields.length]);

  const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === fieldId);
      if (idx < 0) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy.map((f, i) => ({ ...f, order: i }));
    });
  }, []);

  const removeField = useCallback((fieldId: string) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId).map((f, i) => ({ ...f, order: i })));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  }, [selectedFieldId]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormFieldDef>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    );
  }, []);

  const handleSave = () => {
    onSave({ name, description, entityType: entType, fields });
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Left panel: field palette */}
      <div className="col-span-3 bg-surface border border-border rounded-xl p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-text-primary mb-3">{t('forms.fieldPalette')}</h3>
        <div className="space-y-1">
          {FIELD_TYPES.map((ft) => {
            const Icon = ft.icon;
            return (
              <button
                key={ft.type}
                onClick={() => addField(ft.type)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover rounded-lg transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-text-tertiary shrink-0" />
                {ft.label}
                <Plus className="w-3 h-3 ml-auto text-text-tertiary" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Center: form preview with fields */}
      <div className="col-span-5 bg-surface border border-border rounded-xl p-4 overflow-y-auto">
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('forms.templateName')}
            className="w-full text-lg font-semibold bg-transparent border-b border-border focus:border-accent outline-none pb-1 text-text-primary"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('forms.templateDescription')}
            className="w-full text-sm bg-transparent border-b border-border focus:border-accent outline-none pb-1 text-text-secondary"
          />
          <select
            value={entType}
            onChange={(e) => setEntType(e.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1 bg-surface text-text-secondary"
          >
            <option value="custom">{t('forms.entityCustom')}</option>
            <option value="deviation_investigation">{t('forms.entityDeviation')}</option>
            <option value="complaint_intake">{t('forms.entityComplaint')}</option>
            <option value="audit_checklist">{t('forms.entityAudit')}</option>
          </select>
        </div>

        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-text-tertiary">
            <p className="text-sm">{t('forms.addFieldsHint')}</p>
          </div>
        )}

        <div className="space-y-2">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              onClick={() => setSelectedFieldId(field.id)}
              className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedFieldId === field.id
                  ? 'border-accent bg-accent-subtle/30'
                  : 'border-border hover:border-text-tertiary'
              }`}
            >
              <GripVertical className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                {field.type === 'section_header' ? (
                  <h4 className="text-sm font-semibold text-text-primary">{field.label}</h4>
                ) : (
                  <>
                    <label className="text-sm font-medium text-text-primary">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="mt-1 text-xs text-text-tertiary capitalize">{field.type.replace('_', ' ')}</div>
                    {field.helpText && (
                      <p className="text-xs text-text-tertiary mt-0.5">{field.helpText}</p>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); moveField(field.id, 'up'); }}
                  disabled={idx === 0}
                  className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveField(field.id, 'down'); }}
                  disabled={idx === fields.length - 1}
                  className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                  className="p-0.5 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
          >
            <Eye className="w-4 h-4" />
            {t('forms.preview')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? t('common.saving') : t('forms.saveTemplate')}
          </button>
        </div>
      </div>

      {/* Right panel: field properties */}
      <div className="col-span-4 bg-surface border border-border rounded-xl p-4 overflow-y-auto">
        {selectedField ? (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">{t('forms.fieldProperties')}</h3>

            {/* Label */}
            <div>
              <label className="text-xs font-medium text-text-secondary">{t('forms.fieldLabel')}</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            {/* Required toggle */}
            {selectedField.type !== 'section_header' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedField.required}
                  onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                  className="rounded border-border"
                  id="field-required"
                />
                <label htmlFor="field-required" className="text-sm text-text-secondary">
                  {t('forms.required')}
                </label>
              </div>
            )}

            {/* Placeholder */}
            {!['section_header', 'checkbox', 'radio', 'file', 'signature'].includes(selectedField.type) && (
              <div>
                <label className="text-xs font-medium text-text-secondary">{t('forms.placeholder')}</label>
                <input
                  type="text"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value || null })}
                  className="w-full mt-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            )}

            {/* Help text */}
            <div>
              <label className="text-xs font-medium text-text-secondary">{t('forms.helpText')}</label>
              <input
                type="text"
                value={selectedField.helpText || ''}
                onChange={(e) => updateField(selectedField.id, { helpText: e.target.value || null })}
                className="w-full mt-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            {/* Options editor (for select/radio/multi_select) */}
            {['select', 'multi_select', 'radio'].includes(selectedField.type) && (
              <div>
                <label className="text-xs font-medium text-text-secondary">{t('forms.options')}</label>
                <div className="space-y-1 mt-1">
                  {(selectedField.options || []).map((opt, i) => (
                    <div key={i} className="flex gap-1">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(selectedField.options || [])];
                          newOpts[i] = e.target.value;
                          updateField(selectedField.id, { options: newOpts });
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                      <button
                        onClick={() => {
                          const newOpts = (selectedField.options || []).filter((_, j) => j !== i);
                          updateField(selectedField.id, { options: newOpts });
                        }}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOpts = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                      updateField(selectedField.id, { options: newOpts });
                    }}
                    className="text-xs text-accent hover:underline"
                  >
                    + {t('forms.addOption')}
                  </button>
                </div>
              </div>
            )}

            {/* Validation rules */}
            {['text', 'textarea', 'number'].includes(selectedField.type) && (
              <div>
                <label className="text-xs font-medium text-text-secondary">{t('forms.validation')}</label>
                <div className="space-y-2 mt-1">
                  {selectedField.type === 'number' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-text-tertiary">Min</label>
                        <input
                          type="number"
                          value={selectedField.validation?.min ?? ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, min: e.target.value ? Number(e.target.value) : undefined },
                          })}
                          className="w-full px-2 py-1 text-sm border border-border rounded bg-surface"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-tertiary">Max</label>
                        <input
                          type="number"
                          value={selectedField.validation?.max ?? ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, max: e.target.value ? Number(e.target.value) : undefined },
                          })}
                          className="w-full px-2 py-1 text-sm border border-border rounded bg-surface"
                        />
                      </div>
                    </div>
                  )}
                  {['text', 'textarea'].includes(selectedField.type) && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-text-tertiary">{t('forms.minLength')}</label>
                          <input
                            type="number"
                            value={selectedField.validation?.minLength ?? ''}
                            onChange={(e) => updateField(selectedField.id, {
                              validation: { ...selectedField.validation, minLength: e.target.value ? Number(e.target.value) : undefined },
                            })}
                            className="w-full px-2 py-1 text-sm border border-border rounded bg-surface"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-tertiary">{t('forms.maxLength')}</label>
                          <input
                            type="number"
                            value={selectedField.validation?.maxLength ?? ''}
                            onChange={(e) => updateField(selectedField.id, {
                              validation: { ...selectedField.validation, maxLength: e.target.value ? Number(e.target.value) : undefined },
                            })}
                            className="w-full px-2 py-1 text-sm border border-border rounded bg-surface"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-text-tertiary">{t('forms.pattern')}</label>
                        <input
                          type="text"
                          value={selectedField.validation?.pattern ?? ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, pattern: e.target.value || undefined },
                          })}
                          placeholder="e.g. ^[A-Z].*"
                          className="w-full px-2 py-1 text-sm border border-border rounded bg-surface"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Conditional logic */}
            {selectedField.type !== 'section_header' && fields.length > 1 && (
              <div>
                <label className="text-xs font-medium text-text-secondary">{t('forms.conditional')}</label>
                <div className="mt-1 space-y-2">
                  <select
                    value={selectedField.conditional?.dependsOnField || ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        updateField(selectedField.id, { conditional: null });
                      } else {
                        updateField(selectedField.id, {
                          conditional: {
                            dependsOnField: e.target.value,
                            showWhen: selectedField.conditional?.showWhen || '',
                          },
                        });
                      }
                    }}
                    className="w-full px-2 py-1 text-sm border border-border rounded bg-surface"
                  >
                    <option value="">{t('forms.noCondition')}</option>
                    {fields
                      .filter((f) => f.id !== selectedField.id && f.type !== 'section_header')
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                  </select>
                  {selectedField.conditional?.dependsOnField && (
                    <input
                      type="text"
                      value={selectedField.conditional.showWhen}
                      onChange={(e) =>
                        updateField(selectedField.id, {
                          conditional: {
                            dependsOnField: selectedField.conditional!.dependsOnField,
                            showWhen: e.target.value,
                          },
                        })
                      }
                      placeholder={t('forms.showWhenValue')}
                      className="w-full px-2 py-1 text-sm border border-border rounded bg-surface"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-tertiary text-sm">
            {t('forms.selectFieldHint')}
          </div>
        )}
      </div>
    </div>
  );
}
