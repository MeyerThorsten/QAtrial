import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { TEST_STATUSES } from '../../lib/constants';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import type { Test, TestStatus } from '../../types';

interface Props {
  open: boolean;
  test?: Test | null;
  onSave: (data: { title: string; description: string; status: TestStatus; linkedRequirementIds: string[] }) => void;
  onClose: () => void;
}

export function TestModal({ open, test, onSave, onClose }: Props) {
  if (!open) return null;

  return (
    <TestModalContent
      key={test?.id ?? 'new'}
      test={test}
      onSave={onSave}
      onClose={onClose}
    />
  );
}

function TestModalContent({ test, onSave, onClose }: Omit<Props, 'open'>) {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const [title, setTitle] = useState(() => test?.title ?? '');
  const [description, setDescription] = useState(() => test?.description ?? '');
  const [status, setStatus] = useState<TestStatus>(() => test?.status ?? 'Not Run');
  const [linkedReqIds, setLinkedReqIds] = useState<string[]>(
    () => [...(test?.linkedRequirementIds ?? [])]
  );

  const toggleReq = (reqId: string) => {
    setLinkedReqIds((prev) =>
      prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), status, linkedRequirementIds: linkedReqIds });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-text-primary">
            {test ? t('tests.editTest') : t('tests.newTest')}
          </h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('tests.title')} *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              placeholder={t('tests.titlePlaceholder')}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('tests.description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              placeholder={t('tests.descriptionPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('tests.status')}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TestStatus)}
              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            >
              {TEST_STATUSES.map((s) => (
                <option key={s} value={s}>{t(`statuses.${s}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('tests.linkedRequirements', { count: linkedReqIds.length })}
            </label>
            {requirements.length === 0 ? (
              <p className="text-sm text-text-tertiary italic">{t('tests.noRequirementsAvailable')}</p>
            ) : (
              <div className="border border-input-border rounded-lg max-h-40 overflow-y-auto">
                {requirements.map((req) => (
                  <label
                    key={req.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-surface-hover cursor-pointer border-b border-border-subtle last:border-0 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={linkedReqIds.includes(req.id)}
                      onChange={() => toggleReq(req.id)}
                      className="rounded border-input-border text-accent focus:ring-accent"
                    />
                    <span className="text-xs font-mono text-text-tertiary">{req.id}</span>
                    <span className="text-sm text-text-primary truncate">{req.title}</span>
                  </label>
                ))}
              </div>
            )}
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
