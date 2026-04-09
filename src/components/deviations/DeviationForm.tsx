import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

const CLASSIFICATIONS = ['minor', 'major', 'critical'];
const STATUS_ORDER = ['detected', 'investigating', 'root_cause_identified', 'capa_created', 'closed'];

const NEXT_STATUS: Record<string, string> = {
  detected: 'investigating',
  investigating: 'root_cause_identified',
  root_cause_identified: 'capa_created',
  capa_created: 'closed',
};

interface Props {
  deviation?: any;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function DeviationForm({ deviation, onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const project = useProjectStore((s) => s.project);

  const [title, setTitle] = useState('');
  const [classification, setClassification] = useState('minor');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const projectId = getProjectId(project);
  const isEdit = !!deviation;
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  useEffect(() => {
    if (deviation) {
      setTitle(deviation.title || '');
      setClassification(deviation.classification || 'minor');
      setArea(deviation.area || '');
      setDescription(deviation.description || '');
    }
  }, [deviation]);

  const handleSave = async () => {
    if (!canEdit) { setError('Insufficient permissions: requires canEdit'); return; }
    if (!title.trim()) { setError(t('deviations.titleRequired')); return; }
    setSaving(true);
    setError('');

    const payload: any = { title, classification, area, description };
    if (!isEdit) payload.projectId = projectId;

    try {
      await apiFetch(isEdit ? `/deviations/${deviation.id}` : '/deviations', {
        method: isEdit ? 'PUT' : 'POST',
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
    <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
      <h3 className="text-lg font-semibold text-text-primary">
        {isEdit ? t('deviations.edit') : t('deviations.create')}
      </h3>

      {isEdit && deviation && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-mono text-text-tertiary">{deviation.deviationNumber}</span>
          <div className="flex items-center gap-1">
            {STATUS_ORDER.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${
                  STATUS_ORDER.indexOf(deviation.status) >= i ? 'bg-accent' : 'bg-border'
                }`} />
                {i < STATUS_ORDER.length - 1 && (
                  <div className={`w-4 h-0.5 ${
                    STATUS_ORDER.indexOf(deviation.status) > i ? 'bg-accent' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <span className="text-xs text-accent font-medium">{deviation.status.replace(/_/g, ' ')}</span>
          {NEXT_STATUS[deviation.status] && (
            <span className="text-xs text-text-tertiary">
              {t('deviations.nextAction')}: {NEXT_STATUS[deviation.status].replace(/_/g, ' ')}
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('deviations.deviationTitle')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('deviations.classification')}</label>
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {CLASSIFICATIONS.map((cl) => (
              <option key={cl} value={cl}>{t(`deviations.class_${cl}`)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{t('deviations.area')}</label>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          disabled={!canEdit}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder={t('deviations.areaPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{t('deviations.description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!canEdit}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !canEdit}
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
