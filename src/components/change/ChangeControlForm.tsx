import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

const TYPES = ['product', 'process', 'document', 'system', 'supplier'];
const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];
const STATUS_ORDER = ['initiated', 'assessment', 'approval', 'implementation', 'verification', 'closed'];

const NEXT_STATUS: Record<string, string> = {
  initiated: 'assessment',
  assessment: 'approval',
  approval: 'implementation',
  implementation: 'verification',
  verification: 'closed',
};

interface Props {
  changeControl?: any;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function ChangeControlForm({ changeControl, onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const project = useProjectStore((s) => s.project);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('document');
  const [description, setDescription] = useState('');
  const [justification, setJustification] = useState('');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [impactAssessment, setImpactAssessment] = useState('');
  const [affectedDocuments, setAffectedDocuments] = useState('');
  const [affectedTraining, setAffectedTraining] = useState('');
  const [affectedValidation, setAffectedValidation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const projectId = getProjectId(project);
  const isEdit = !!changeControl;
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  useEffect(() => {
    if (changeControl) {
      setTitle(changeControl.title || '');
      setType(changeControl.type || 'document');
      setDescription(changeControl.description || '');
      setJustification(changeControl.justification || '');
      setRiskLevel(changeControl.riskLevel || 'medium');
      setImpactAssessment(changeControl.impactAssessment || '');
      setAffectedDocuments((changeControl.affectedDocuments || []).join(', '));
      setAffectedTraining((changeControl.affectedTraining || []).join(', '));
      setAffectedValidation((changeControl.affectedValidation || []).join(', '));
    }
  }, [changeControl]);

  const handleSave = async () => {
    if (!canEdit) { setError('Insufficient permissions: requires canEdit'); return; }
    if (!title.trim()) { setError(t('changeControl.titleRequired')); return; }
    setSaving(true);
    setError('');

    const payload: any = {
      title,
      type,
      description,
      justification,
      riskLevel,
      impactAssessment: impactAssessment || null,
      affectedDocuments: affectedDocuments ? affectedDocuments.split(',').map((s) => s.trim()).filter(Boolean) : [],
      affectedTraining: affectedTraining ? affectedTraining.split(',').map((s) => s.trim()).filter(Boolean) : [],
      affectedValidation: affectedValidation ? affectedValidation.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };

    if (!isEdit) {
      payload.projectId = projectId;
    }

    try {
      await apiFetch(isEdit ? `/change-control/${changeControl.id}` : '/change-control', {
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

  const handleAdvanceStatus = async () => {
    if (!changeControl || !canEdit) return;
    const next = NEXT_STATUS[changeControl.status];
    if (!next) return;
    setSaving(true);
    try {
      await apiFetch(`/change-control/${changeControl.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: next }),
      });
      setError('');
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to advance status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
      <h3 className="text-lg font-semibold text-text-primary">
        {isEdit ? t('changeControl.edit') : t('changeControl.create')}
      </h3>

      {isEdit && changeControl && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-text-tertiary">{changeControl.changeNumber}</span>
          <div className="flex items-center gap-1">
            {STATUS_ORDER.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${
                  STATUS_ORDER.indexOf(changeControl.status) >= i ? 'bg-accent' : 'bg-border'
                }`} />
                {i < STATUS_ORDER.length - 1 && (
                  <div className={`w-4 h-0.5 ${
                    STATUS_ORDER.indexOf(changeControl.status) > i ? 'bg-accent' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <span className="text-xs text-accent font-medium">{changeControl.status}</span>
          {NEXT_STATUS[changeControl.status] && (
            <button
              onClick={handleAdvanceStatus}
              disabled={saving || !canEdit}
              className="text-xs px-2 py-1 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
            >
              {t('changeControl.advanceTo', { status: NEXT_STATUS[changeControl.status] })}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.type')}</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {TYPES.map((tp) => (
              <option key={tp} value={tp}>{t(`changeControl.type_${tp}`)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!canEdit}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.justification')}</label>
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          disabled={!canEdit}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.riskLevel')}</label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {RISK_LEVELS.map((rl) => (
              <option key={rl} value={rl}>{rl}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.impactAssessment')}</label>
          <input
            type="text"
            value={impactAssessment}
            onChange={(e) => setImpactAssessment(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.affectedDocuments')}</label>
          <input
            type="text"
            value={affectedDocuments}
            onChange={(e) => setAffectedDocuments(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t('changeControl.commaSeparated')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.affectedTraining')}</label>
          <input
            type="text"
            value={affectedTraining}
            onChange={(e) => setAffectedTraining(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t('changeControl.commaSeparated')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('changeControl.affectedValidation')}</label>
          <input
            type="text"
            value={affectedValidation}
            onChange={(e) => setAffectedValidation(e.target.value)}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t('changeControl.commaSeparated')}
          />
        </div>
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
