import { useTranslation } from 'react-i18next';

interface MetaData {
  name: string;
  description: string;
  owner: string;
  version: string;
}

interface Props {
  meta: MetaData;
  onChange: (meta: MetaData) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepMetadata({ meta, onChange, onBack, onNext }: Props) {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta.name.trim()) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-1">{t('wizard.projectInfo')}</h2>
        <p className="text-sm text-text-tertiary mb-4">{t('wizard.projectInfoDesc')}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{t('wizard.projectName')} *</label>
        <input
          type="text"
          value={meta.name}
          onChange={(e) => onChange({ ...meta, name: e.target.value })}
          className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          placeholder={t('wizard.projectNamePlaceholder')}
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{t('wizard.description')}</label>
        <textarea
          value={meta.description}
          onChange={(e) => onChange({ ...meta, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          placeholder={t('wizard.descriptionPlaceholder')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('wizard.owner')}</label>
          <input
            type="text"
            value={meta.owner}
            onChange={(e) => onChange({ ...meta, owner: e.target.value })}
            className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            placeholder={t('wizard.ownerPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{t('wizard.version')}</label>
          <input
            type="text"
            value={meta.version}
            onChange={(e) => onChange({ ...meta, version: e.target.value })}
            className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            placeholder="1.0"
          />
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
        >
          {t('common.back')}
        </button>
        <button
          type="submit"
          disabled={!meta.name.trim()}
          className="px-6 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {t('common.next')}
        </button>
      </div>
    </form>
  );
}
