import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, AlertTriangle, Check, Beaker } from 'lucide-react';

interface BatchStep {
  id: string;
  stepNumber: number;
  instruction: string;
  expectedValue?: string;
  unit?: string;
  actualValue?: string;
  inSpec?: boolean;
  deviation: boolean;
  deviationNote?: string;
}

interface MobileBatchEntryProps {
  batchNumber: string;
  productName: string;
  steps: BatchStep[];
  onSaveStep: (stepId: string, actualValue: string, deviation: boolean, deviationNote?: string) => void;
  onComplete: () => void;
}

export function MobileBatchEntry({
  batchNumber,
  productName,
  steps,
  onSaveStep,
  onComplete,
}: MobileBatchEntryProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actualValue, setActualValue] = useState(steps[0]?.actualValue || '');
  const [deviation, setDeviation] = useState(steps[0]?.deviation || false);
  const [deviationNote, setDeviationNote] = useState(steps[0]?.deviationNote || '');
  const [saved, setSaved] = useState(false);

  const step = steps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const loadStep = (index: number) => {
    setCurrentIndex(index);
    setActualValue(steps[index]?.actualValue || '');
    setDeviation(steps[index]?.deviation || false);
    setDeviationNote(steps[index]?.deviationNote || '');
    setSaved(false);
  };

  const handleSave = () => {
    onSaveStep(step.id, actualValue, deviation, deviation ? deviationNote : undefined);
    setSaved(true);
  };

  const handleNext = () => {
    if (!saved) handleSave();
    if (!isLast) loadStep(currentIndex + 1);
  };

  const handlePrev = () => {
    if (!isFirst) loadStep(currentIndex - 1);
  };

  if (!step) return null;

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Beaker className="w-5 h-5 text-accent" />
          <div>
            <p className="text-sm font-semibold text-text-primary">{productName}</p>
            <p className="text-xs text-text-tertiary">{t('mobile.batch')}: {batchNumber}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-surface-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-text-tertiary mt-1">
          {t('mobile.stepOf', { current: currentIndex + 1, total: steps.length })}
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Instruction */}
        <div className="p-4 bg-surface rounded-xl border border-border">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">{t('mobile.instruction')}</p>
          <p className="text-lg font-medium text-text-primary leading-relaxed">{step.instruction}</p>
          {step.expectedValue && (
            <p className="text-sm text-text-secondary mt-2">
              {t('mobile.expected')}: <span className="font-medium">{step.expectedValue}</span>
              {step.unit && <span className="text-text-tertiary ml-1">{step.unit}</span>}
            </p>
          )}
        </div>

        {/* Actual Value Input */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">{t('mobile.actualValue')}</label>
          <input
            type="text"
            value={actualValue}
            onChange={(e) => { setActualValue(e.target.value); setSaved(false); }}
            className="w-full px-4 py-4 text-xl bg-surface border-2 border-border rounded-xl text-text-primary text-center focus:outline-none focus:border-accent transition-colors"
            placeholder={step.unit || '---'}
            inputMode="decimal"
          />
        </div>

        {/* Deviation Toggle */}
        <div className="space-y-3">
          <button
            onClick={() => { setDeviation(!deviation); setSaved(false); }}
            className={`w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 text-base font-medium transition-all ${
              deviation
                ? 'border-danger bg-danger/10 text-danger'
                : 'border-border bg-surface text-text-secondary hover:border-warning'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            {deviation ? t('mobile.deviationActive') : t('mobile.reportDeviation')}
          </button>

          {deviation && (
            <textarea
              value={deviationNote}
              onChange={(e) => { setDeviationNote(e.target.value); setSaved(false); }}
              placeholder={t('mobile.deviationNotePlaceholder')}
              className="w-full px-4 py-3 text-base bg-surface border-2 border-danger/30 rounded-xl text-text-primary resize-none focus:outline-none focus:border-danger"
              rows={3}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-surface border-t border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border text-text-secondary disabled:opacity-30 hover:bg-surface-hover transition-colors text-base"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('common.back')}
        </button>

        <button
          onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-medium transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-accent text-white hover:bg-accent-hover'
          }`}
        >
          <Check className="w-5 h-5" />
          {saved ? t('mobile.saved') : t('common.save')}
        </button>

        {isLast ? (
          <button
            onClick={onComplete}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-600 text-white font-medium text-base hover:bg-green-700 transition-colors"
          >
            {t('mobile.finishBatch')}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border text-text-secondary hover:bg-surface-hover transition-colors text-base"
          >
            {t('common.next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
