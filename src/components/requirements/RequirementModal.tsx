import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { REQUIREMENT_STATUSES } from '../../lib/constants';
import type { Requirement, RequirementStatus } from '../../types';

interface Props {
  open: boolean;
  requirement?: Requirement | null;
  onSave: (data: { title: string; description: string; status: RequirementStatus }) => void;
  onClose: () => void;
}

export function RequirementModal({ open, requirement, onSave, onClose }: Props) {
  if (!open) return null;

  return (
    <RequirementModalContent
      key={requirement?.id ?? 'new'}
      requirement={requirement}
      onSave={onSave}
      onClose={onClose}
    />
  );
}

function RequirementModalContent({ requirement, onSave, onClose }: Omit<Props, 'open'>) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(() => requirement?.title ?? '');
  const [description, setDescription] = useState(() => requirement?.description ?? '');
  const [status, setStatus] = useState<RequirementStatus>(() => requirement?.status ?? 'Draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {requirement ? t('requirements.editRequirement') : t('requirements.newRequirement')}
          </h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('requirements.title')} *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              placeholder={t('requirements.titlePlaceholder')}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('requirements.description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              placeholder={t('requirements.descriptionPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('requirements.status')}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RequirementStatus)}
              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            >
              {REQUIREMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{t(`statuses.${s}`)}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={!title.trim()} className="px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
