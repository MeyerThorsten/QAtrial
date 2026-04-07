import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface PeriodicReviewWizardProps {
  systemId: string;
  reviewId?: string;
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = ['stillInUse', 'changes', 'incidents', 'regulatory', 'access', 'findings', 'summary'];

export function PeriodicReviewWizard({ systemId, reviewId, onComplete, onCancel }: PeriodicReviewWizardProps) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [step, setStep] = useState(0);
  const [stillInUse, setStillInUse] = useState(true);
  const [changesNoted, setChangesNoted] = useState('');
  const [incidentsNoted, setIncidentsNoted] = useState('');
  const [regulatoryChanges, setRegulatoryChanges] = useState('');
  const [accessReviewed, setAccessReviewed] = useState(false);
  const [findings, setFindings] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [previousReview, setPreviousReview] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Fetch previous review data
    const fetchPrevious = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${apiBase}/api/systems/${systemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.system.reviews && data.system.reviews.length > 0) {
            setPreviousReview(data.system.reviews[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch system:', err);
      }
    };
    fetchPrevious();
  }, [systemId, token]);

  const handleComplete = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const url = reviewId
        ? `${apiBase}/api/systems/${systemId}/reviews/${reviewId}`
        : `${apiBase}/api/systems/${systemId}/reviews`;
      const method = reviewId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: 'completed',
          stillInUse,
          changesNoted: changesNoted || null,
          incidentsNoted: incidentsNoted || null,
          regulatoryChanges: regulatoryChanges || null,
          accessReviewed,
          findings: findings || null,
          nextReviewDate: nextReviewDate || undefined,
          reviewDate: new Date().toISOString(),
        }),
      });
      onComplete();
    } catch (err) {
      console.error('Failed to complete review:', err);
    } finally {
      setSaving(false);
    }
  };

  const canNext = () => {
    if (step === STEPS.length - 1) return true;
    return true; // All steps are optional except completion
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        {/* Progress */}
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary mb-3">{t('systems.periodicReview')}</h3>
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-text-tertiary mt-2">
            {t('wizard.stepOf', { step: step + 1, total: STEPS.length })}
          </p>
        </div>

        {/* Previous review summary */}
        {previousReview && step === 0 && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-surface-secondary border border-border">
            <p className="text-xs font-medium text-text-secondary mb-1">{t('systems.previousReview')}</p>
            <p className="text-xs text-text-tertiary">
              {new Date(previousReview.reviewDate).toLocaleDateString()} - {previousReview.reviewer}
              {previousReview.findings && ` - ${previousReview.findings.slice(0, 100)}...`}
            </p>
          </div>
        )}

        {/* Step content */}
        <div className="px-6 py-6 min-h-[200px]">
          {step === 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">{t('systems.reviewStillInUse')}</h4>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={stillInUse} onChange={() => setStillInUse(true)} className="accent-accent" />
                  <span className="text-sm text-text-primary">{t('common.yes')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!stillInUse} onChange={() => setStillInUse(false)} className="accent-accent" />
                  <span className="text-sm text-text-primary">{t('common.no')}</span>
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">{t('systems.reviewChanges')}</h4>
              <textarea
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary"
                rows={4}
                placeholder={t('systems.reviewChangesPlaceholder')}
                value={changesNoted}
                onChange={(e) => setChangesNoted(e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">{t('systems.reviewIncidents')}</h4>
              <textarea
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary"
                rows={4}
                placeholder={t('systems.reviewIncidentsPlaceholder')}
                value={incidentsNoted}
                onChange={(e) => setIncidentsNoted(e.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">{t('systems.reviewRegulatory')}</h4>
              <textarea
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary"
                rows={4}
                placeholder={t('systems.reviewRegulatoryPlaceholder')}
                value={regulatoryChanges}
                onChange={(e) => setRegulatoryChanges(e.target.value)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">{t('systems.reviewAccess')}</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={accessReviewed} onChange={(e) => setAccessReviewed(e.target.checked)} className="accent-accent" />
                <span className="text-sm text-text-primary">{t('systems.accessReviewConfirm')}</span>
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">{t('systems.reviewFindings')}</h4>
              <textarea
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary"
                rows={4}
                placeholder={t('systems.reviewFindingsPlaceholder')}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">{t('systems.reviewSummary')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-secondary">{t('systems.reviewStillInUse')}</span>
                  <span className="text-text-primary font-medium">{stillInUse ? t('common.yes') : t('common.no')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-secondary">{t('systems.reviewChanges')}</span>
                  <span className="text-text-primary">{changesNoted || t('common.none')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-secondary">{t('systems.reviewIncidents')}</span>
                  <span className="text-text-primary">{incidentsNoted || t('common.none')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-secondary">{t('systems.reviewAccess')}</span>
                  <span className="text-text-primary">{accessReviewed ? t('common.yes') : t('common.no')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-secondary">{t('systems.reviewFindings')}</span>
                  <span className="text-text-primary">{findings || t('common.none')}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('systems.nextReview')}</label>
                <input type="date" className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t border-border flex justify-between">
          <button
            onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? t('common.cancel') : t('common.back')}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
            >
              {t('common.next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saving ? t('common.saving') : t('systems.completeReview')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PeriodicReviewWizard;
