import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Loader2 } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';

interface FieldDef {
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

interface FormRendererProps {
  templateId: string;
  projectId: string;
  entityType?: string;
  entityId?: string;
  onSubmit?: (submissionId: string) => void;
  readOnly?: boolean;
  initialData?: Record<string, any>;
}

export function FormRenderer({
  templateId,
  projectId,
  entityType,
  entityId,
  onSubmit,
  readOnly = false,
  initialData,
}: FormRendererProps) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!templateId) return;
    apiFetch<{ template: any }>(`/forms/templates/${templateId}`)
      .then(({ template }) => {
        setFields(template.fields || []);
        setTemplateName(template.name);
        if (initialData) setFormData(initialData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [templateId, initialData]);

  const setValue = useCallback((fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[fieldId];
      return copy;
    });
  }, []);

  const isFieldVisible = useCallback(
    (field: FieldDef) => {
      if (!field.conditional) return true;
      const depValue = formData[field.conditional.dependsOnField];
      return String(depValue) === String(field.conditional.showWhen);
    },
    [formData]
  );

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    for (const field of fields) {
      if (!isFieldVisible(field)) continue;
      const val = formData[field.id];

      if (field.required && (val === undefined || val === null || val === '')) {
        errs[field.id] = t('forms.validationRequired');
        continue;
      }

      if (val !== undefined && val !== '' && field.validation) {
        const v = field.validation;
        if (v.min !== undefined && Number(val) < v.min) {
          errs[field.id] = t('forms.validationMin', { min: v.min });
        }
        if (v.max !== undefined && Number(val) > v.max) {
          errs[field.id] = t('forms.validationMax', { max: v.max });
        }
        if (v.minLength !== undefined && String(val).length < v.minLength) {
          errs[field.id] = t('forms.validationMinLength', { min: v.minLength });
        }
        if (v.maxLength !== undefined && String(val).length > v.maxLength) {
          errs[field.id] = t('forms.validationMaxLength', { max: v.maxLength });
        }
        if (v.pattern) {
          try {
            if (!new RegExp(v.pattern).test(String(val))) {
              errs[field.id] = t('forms.validationPattern');
            }
          } catch {
            // invalid pattern, skip
          }
        }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fields, formData, isFieldVisible, t]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { submission } = await apiFetch<{ submission: any }>('/forms/submissions', {
        method: 'POST',
        body: JSON.stringify({
          templateId,
          projectId,
          data: formData,
          entityType,
          entityId,
        }),
      });
      onSubmit?.(submission.id);
    } catch (err: any) {
      setErrors({ _form: err.message || t('forms.submitError') });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templateName && (
        <h3 className="text-lg font-semibold text-text-primary">{templateName}</h3>
      )}

      {errors._form && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {errors._form}
        </div>
      )}

      {fields.map((field) => {
        if (!isFieldVisible(field)) return null;

        if (field.type === 'section_header') {
          return (
            <div key={field.id} className="pt-4 pb-1 border-b border-border">
              <h4 className="text-sm font-semibold text-text-primary">{field.label}</h4>
            </div>
          );
        }

        const error = errors[field.id];
        const val = formData[field.id] ?? '';

        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {field.helpText && (
              <p className="text-xs text-text-tertiary mb-1">{field.helpText}</p>
            )}

            {field.type === 'text' && (
              <input
                type="text"
                value={val}
                onChange={(e) => setValue(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                disabled={readOnly}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                  error ? 'border-red-400' : 'border-border'
                }`}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={val}
                onChange={(e) => setValue(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                disabled={readOnly}
                rows={3}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y ${
                  error ? 'border-red-400' : 'border-border'
                }`}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={val}
                onChange={(e) => setValue(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                disabled={readOnly}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                  error ? 'border-red-400' : 'border-border'
                }`}
              />
            )}

            {field.type === 'date' && (
              <input
                type="date"
                value={val}
                onChange={(e) => setValue(field.id, e.target.value)}
                disabled={readOnly}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                  error ? 'border-red-400' : 'border-border'
                }`}
              />
            )}

            {field.type === 'select' && (
              <select
                value={val}
                onChange={(e) => setValue(field.id, e.target.value)}
                disabled={readOnly}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                  error ? 'border-red-400' : 'border-border'
                }`}
              >
                <option value="">{field.placeholder || t('forms.selectOption')}</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.type === 'multi_select' && (
              <div className="space-y-1">
                {(field.options || []).map((opt) => {
                  const selected = Array.isArray(val) ? val.includes(opt) : false;
                  return (
                    <label key={opt} className="flex items-center gap-2 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={readOnly}
                        onChange={() => {
                          const current = Array.isArray(val) ? val : [];
                          setValue(
                            field.id,
                            selected ? current.filter((v: string) => v !== opt) : [...current, opt]
                          );
                        }}
                        className="rounded border-border"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            )}

            {field.type === 'checkbox' && (
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={!!val}
                  onChange={(e) => setValue(field.id, e.target.checked)}
                  disabled={readOnly}
                  className="rounded border-border"
                />
                {field.placeholder || field.label}
              </label>
            )}

            {field.type === 'radio' && (
              <div className="space-y-1">
                {(field.options || []).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-text-secondary">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt}
                      checked={val === opt}
                      onChange={() => setValue(field.id, opt)}
                      disabled={readOnly}
                      className="border-border"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {field.type === 'file' && (
              <input
                type="file"
                disabled={readOnly}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue(field.id, file.name);
                }}
                className="text-sm text-text-secondary"
              />
            )}

            {field.type === 'signature' && (
              <div className="border border-border rounded-lg p-4 text-center text-sm text-text-tertiary bg-surface-secondary">
                {val ? (
                  <span className="text-text-primary">{t('forms.signed')}: {val}</span>
                ) : readOnly ? (
                  <span>{t('forms.noSignature')}</span>
                ) : (
                  <button
                    onClick={() => setValue(field.id, `Signed at ${new Date().toISOString()}`)}
                    className="px-3 py-1.5 bg-accent text-white rounded-lg text-sm hover:bg-accent/90"
                  >
                    {t('forms.clickToSign')}
                  </button>
                )}
              </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
      })}

      {!readOnly && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {t('forms.submit')}
        </button>
      )}
    </div>
  );
}
