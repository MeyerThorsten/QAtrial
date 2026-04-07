import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Send, Check, Users } from 'lucide-react';

interface MobileComplaintFormProps {
  products: { id: string; name: string }[];
  onSubmit: (data: {
    productName: string;
    severity: string;
    description: string;
    patientImpact: boolean;
  }) => void;
  onBack?: () => void;
}

export function MobileComplaintForm({ products, onSubmit, onBack }: MobileComplaintFormProps) {
  const { t } = useTranslation();
  const [product, setProduct] = useState('');
  const [severity, setSeverity] = useState<string>('');
  const [description, setDescription] = useState('');
  const [patientImpact, setPatientImpact] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = product && severity && description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      productName: product,
      severity,
      description,
      patientImpact,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">{t('mobile.complaintSubmitted')}</h2>
          <p className="text-sm text-text-tertiary">{t('mobile.complaintSubmittedDesc')}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setProduct('');
              setSeverity('');
              setDescription('');
              setPatientImpact(false);
            }}
            className="px-6 py-3 bg-accent text-white rounded-xl text-base font-medium hover:bg-accent-hover transition-colors"
          >
            {t('mobile.newComplaint')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      <div className="bg-surface border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h2 className="text-base font-semibold text-text-primary">{t('mobile.complaintTitle')}</h2>
          </div>
          {onBack && (
            <button onClick={onBack} className="text-sm text-text-secondary">
              {t('common.back')}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Product Selection */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">{t('mobile.product')}</label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full px-4 py-3.5 text-base bg-surface border-2 border-border rounded-xl text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="">{t('mobile.selectProduct')}</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Severity Selector */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">{t('mobile.severity')}</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'minor', label: t('mobile.severityMinor'), color: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
              { value: 'major', label: t('mobile.severityMajor'), color: 'border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
              { value: 'critical', label: t('mobile.severityCritical'), color: 'border-red-400 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => setSeverity(s.value)}
                className={`py-4 rounded-xl border-2 text-base font-medium transition-all ${
                  severity === s.value
                    ? s.color
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">{t('mobile.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('mobile.complaintDescPlaceholder')}
            className="w-full px-4 py-3.5 text-base bg-surface border-2 border-border rounded-xl text-text-primary resize-none focus:outline-none focus:border-accent"
            rows={5}
          />
        </div>

        {/* Patient Impact Toggle */}
        <button
          onClick={() => setPatientImpact(!patientImpact)}
          className={`w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 text-base font-medium transition-all ${
            patientImpact
              ? 'border-danger bg-danger/10 text-danger'
              : 'border-border bg-surface text-text-secondary hover:border-warning'
          }`}
        >
          <Users className="w-5 h-5" />
          {patientImpact ? t('mobile.patientImpactYes') : t('mobile.patientImpactNo')}
        </button>
      </div>

      {/* Submit */}
      <div className="bg-surface border-t border-border px-4 py-3">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent text-white text-lg font-medium hover:bg-accent-hover disabled:opacity-50 transition-all"
        >
          <Send className="w-5 h-5" />
          {t('mobile.submitComplaint')}
        </button>
      </div>
    </div>
  );
}
