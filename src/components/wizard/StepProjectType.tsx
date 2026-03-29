import { Monitor, Cpu, ShieldCheck, FileX, FlaskConical, Stethoscope, Building2, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PROJECT_TYPES = [
  { type: 'software', icon: <Monitor className="w-6 h-6" /> },
  { type: 'embedded', icon: <Cpu className="w-6 h-6" /> },
  { type: 'quality_system', icon: <Building2 className="w-6 h-6" /> },
  { type: 'validation', icon: <FlaskConical className="w-6 h-6" /> },
  { type: 'clinical', icon: <Stethoscope className="w-6 h-6" /> },
  { type: 'compliance', icon: <ShieldCheck className="w-6 h-6" /> },
  { type: 'supplier_quality', icon: <Package className="w-6 h-6" /> },
  { type: 'empty', icon: <FileX className="w-6 h-6" /> },
] as const;

interface Props {
  selected: string;
  onSelect: (type: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepProjectType({ selected, onSelect, onBack, onNext }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-1">{t('wizard.selectType')}</h2>
      <p className="text-sm text-text-tertiary mb-4">{t('wizard.selectTypeDesc')}</p>

      <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {PROJECT_TYPES.map(({ type, icon }) => {
          const isSelected = selected === type;
          const nameKey = `projectTypes.${type}.name`;
          const descKey = `projectTypes.${type}.desc`;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-accent bg-accent-subtle'
                  : 'border-border hover:border-text-tertiary bg-surface'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${isSelected ? 'text-accent' : 'text-text-tertiary'}`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${isSelected ? 'text-accent-text' : 'text-text-primary'}`}>
                    {t(nameKey)}
                  </span>
                  <p className="text-sm text-text-secondary mt-0.5">{t(descKey)}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
        >
          {t('common.back')}
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium"
        >
          {selected === 'empty' ? t('wizard.emptyStart') : t('common.next')}
        </button>
      </div>
    </div>
  );
}
