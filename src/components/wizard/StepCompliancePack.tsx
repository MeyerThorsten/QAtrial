import { useTranslation } from 'react-i18next';
import { Monitor, HeartPulse, Pill, Shield, ArrowRight } from 'lucide-react';
import { COMPLIANCE_PACKS, type CompliancePack } from '../../templates/packs';

const ICON_MAP: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-6 h-6" />,
  HeartPulse: <HeartPulse className="w-6 h-6" />,
  Pill: <Pill className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
};

interface StepCompliancePackProps {
  onSelectPack: (pack: CompliancePack) => void;
  onSkip: () => void;
}

export function StepCompliancePack({ onSelectPack, onSkip }: StepCompliancePackProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{t('packs.title')}</h2>
        <p className="text-sm text-text-secondary mt-1">{t('packs.description')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COMPLIANCE_PACKS.map((pack) => (
          <button
            key={pack.id}
            onClick={() => onSelectPack(pack)}
            className="group relative flex flex-col items-start p-4 rounded-xl border border-border bg-surface hover:border-accent hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-2 w-full">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center text-accent shrink-0">
                {ICON_MAP[pack.icon] ?? <Monitor className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary truncate">{t(pack.name)}</h3>
                <p className="text-xs text-text-tertiary">
                  {t('packs.modules', { count: pack.modules.length })}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              {t(pack.description)}
            </p>
            <div className="flex flex-wrap gap-1">
              {pack.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-accent-text bg-accent-subtle px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onSkip}
          className="text-sm text-text-secondary hover:text-accent transition-colors underline underline-offset-2"
        >
          {t('packs.orScratch')}
        </button>
      </div>
    </div>
  );
}
