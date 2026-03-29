import { useTranslation } from 'react-i18next';
import {
  Pill, Dna, HeartPulse, FlaskConical, Microscope,
  Truck, Monitor, Sparkles, Plane, Beaker, SkipForward,
} from 'lucide-react';
import { VERTICAL_DEFINITIONS, COUNTRY_REGISTRY } from '../../templates/registry';

interface Props {
  countryCode: string;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

/** Map icon name from registry to actual lucide component */
const ICON_MAP: Record<string, React.ReactNode> = {
  Pill: <Pill className="w-5 h-5" />,
  Dna: <Dna className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Microscope: <Microscope className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
  Beaker: <Beaker className="w-5 h-5" />,
};

export function StepVertical({ countryCode, selected, onSelect, onBack, onNext }: Props) {
  const { t } = useTranslation();

  const countryEntry = COUNTRY_REGISTRY.find((c) => c.code === countryCode);
  const availableIds = countryEntry?.availableVerticals ?? [];
  const verticals = VERTICAL_DEFINITIONS.filter((v) => availableIds.includes(v.id));

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary mb-1">{t('wizard.selectVertical')}</h2>
        <p className="text-sm text-text-tertiary">{t('wizard.selectVerticalDesc')}</p>
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {verticals.map((v) => {
          const isSelected = selected === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-accent bg-accent-subtle'
                  : 'border-border hover:border-text-tertiary bg-surface'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${isSelected ? 'text-accent' : 'text-text-tertiary'}`}>
                  {ICON_MAP[v.icon] ?? <FlaskConical className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium text-sm ${isSelected ? 'text-accent-text' : 'text-text-primary'}`}>
                      {t(v.name)}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5">{t(v.focusKey)}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {v.primaryStandards.slice(0, 3).map((std) => (
                      <span key={std} className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-surface-tertiary text-text-secondary">
                        {std}
                      </span>
                    ))}
                    {v.primaryStandards.length > 3 && (
                      <span className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-surface-tertiary text-text-tertiary">
                        +{v.primaryStandards.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Skip option */}
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selected === null
              ? 'border-accent bg-accent-subtle'
              : 'border-border hover:border-text-tertiary bg-surface'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`${selected === null ? 'text-accent' : 'text-text-tertiary'}`}>
              <SkipForward className="w-5 h-5" />
            </div>
            <span className={`text-sm font-medium ${selected === null ? 'text-accent-text' : 'text-text-secondary'}`}>
              {t('wizard.skipVertical')}
            </span>
          </div>
        </button>
      </div>

      {/* Footer */}
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
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}
