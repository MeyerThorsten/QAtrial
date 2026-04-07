import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle } from 'lucide-react';

interface ComplaintData {
  id?: string;
  productName: string;
  reportDate: string;
  severity: string;
  patientImpact: boolean;
  description: string;
  reporterType: string;
  regulatoryReportable: boolean;
  fscaRequired: boolean;
  investigationStatus?: string;
  rootCause?: string;
}

interface ComplaintFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ComplaintData) => void;
  initialData?: ComplaintData | null;
}

export function ComplaintForm({ open, onClose, onSave, initialData }: ComplaintFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ComplaintData>({
    productName: '',
    reportDate: new Date().toISOString().slice(0, 10),
    severity: 'minor',
    patientImpact: false,
    description: '',
    reporterType: 'customer',
    regulatoryReportable: false,
    fscaRequired: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        reportDate: initialData.reportDate
          ? new Date(initialData.reportDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    } else {
      setFormData({
        productName: '',
        reportDate: new Date().toISOString().slice(0, 10),
        severity: 'minor',
        patientImpact: false,
        description: '',
        reporterType: 'customer',
        regulatoryReportable: false,
        fscaRequired: false,
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const severityColors: Record<string, string> = {
    minor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    major: 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">
              {initialData?.id ? t('complaints.editComplaint') : t('complaints.createComplaint')}
            </h2>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('complaints.productName')} *
            </label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder={t('complaints.productNamePlaceholder')}
            />
          </div>

          {/* Report Date */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('complaints.reportDate')} *
            </label>
            <input
              type="date"
              required
              value={formData.reportDate}
              onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('complaints.severity')} *
            </label>
            <div className="flex gap-2">
              {['minor', 'major', 'critical'].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: sev })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.severity === sev
                      ? severityColors[sev]
                      : 'bg-surface border-border text-text-secondary hover:bg-surface-hover'
                  }`}
                >
                  {t(`complaints.sev_${sev}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Impact Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.patientImpact}
                onChange={(e) => setFormData({ ...formData, patientImpact: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm font-medium text-text-secondary">{t('complaints.patientImpact')}</span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('complaints.description')} *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              placeholder={t('complaints.descriptionPlaceholder')}
            />
          </div>

          {/* Reporter Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('complaints.reporterType')}
            </label>
            <select
              value={formData.reporterType}
              onChange={(e) => setFormData({ ...formData, reporterType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="customer">{t('complaints.reporter_customer')}</option>
              <option value="internal">{t('complaints.reporter_internal')}</option>
              <option value="regulatory">{t('complaints.reporter_regulatory')}</option>
              <option value="field">{t('complaints.reporter_field')}</option>
            </select>
          </div>

          {/* Regulatory Reportable Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.regulatoryReportable}
                onChange={(e) => setFormData({ ...formData, regulatoryReportable: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm font-medium text-text-secondary">{t('complaints.regulatoryReportable')}</span>
          </div>

          {/* FSCA Required Toggle (Medical Device specific) */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fscaRequired}
                onChange={(e) => setFormData({ ...formData, fscaRequired: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm font-medium text-text-secondary">{t('complaints.fscaRequired')}</span>
          </div>

          {/* Root Cause (only for editing) */}
          {initialData?.id && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('complaints.rootCause')}
              </label>
              <textarea
                rows={2}
                value={formData.rootCause ?? ''}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                placeholder={t('complaints.rootCausePlaceholder')}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
