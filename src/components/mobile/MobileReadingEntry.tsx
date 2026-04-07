import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Check, AlertTriangle, ArrowLeft } from 'lucide-react';

interface MonitoringPointData {
  id: string;
  name: string;
  zone: string;
  type: string;
  unit: string;
  alertThreshold?: number;
  actionThreshold?: number;
  lastReading?: { value: number; timestamp: string };
}

interface MobileReadingEntryProps {
  points: MonitoringPointData[];
  onSaveReading: (pointId: string, value: number) => void;
  onBack?: () => void;
}

export function MobileReadingEntry({ points, onSaveReading, onBack }: MobileReadingEntryProps) {
  const { t } = useTranslation();
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPointData | null>(null);
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!selectedPoint || !value) return;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    onSaveReading(selectedPoint.id, numValue);
    setSaved(true);
    setTimeout(() => {
      setSelectedPoint(null);
      setValue('');
      setSaved(false);
    }, 1000);
  };

  const getExcursionStatus = (point: MonitoringPointData, val: number): 'ok' | 'alert' | 'action' => {
    if (point.actionThreshold !== undefined && val >= point.actionThreshold) return 'action';
    if (point.alertThreshold !== undefined && val >= point.alertThreshold) return 'alert';
    return 'ok';
  };

  // Point detail view
  if (selectedPoint) {
    const numValue = parseFloat(value);
    const status = !isNaN(numValue) ? getExcursionStatus(selectedPoint, numValue) : 'ok';

    return (
      <div className="min-h-screen bg-surface-secondary flex flex-col">
        <div className="bg-surface border-b border-border px-4 py-3">
          <button
            onClick={() => { setSelectedPoint(null); setValue(''); setSaved(false); }}
            className="flex items-center gap-2 text-text-secondary mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('common.back')}</span>
          </button>
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-accent" />
            <div>
              <p className="text-base font-semibold text-text-primary">{selectedPoint.name}</p>
              <p className="text-xs text-text-tertiary">{selectedPoint.zone} - {selectedPoint.type}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6">
          {/* Last reading */}
          {selectedPoint.lastReading && (
            <div className="p-4 bg-surface rounded-xl border border-border">
              <p className="text-xs text-text-tertiary uppercase tracking-wider">{t('mobile.lastReading')}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {selectedPoint.lastReading.value} <span className="text-base text-text-tertiary">{selectedPoint.unit}</span>
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                {new Date(selectedPoint.lastReading.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          {/* Thresholds */}
          <div className="grid grid-cols-2 gap-3">
            {selectedPoint.alertThreshold !== undefined && (
              <div className="p-3 bg-warning/10 border border-warning/30 rounded-xl text-center">
                <p className="text-xs text-warning uppercase tracking-wider">{t('mobile.alertThreshold')}</p>
                <p className="text-lg font-bold text-warning">{selectedPoint.alertThreshold} {selectedPoint.unit}</p>
              </div>
            )}
            {selectedPoint.actionThreshold !== undefined && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-center">
                <p className="text-xs text-danger uppercase tracking-wider">{t('mobile.actionThreshold')}</p>
                <p className="text-lg font-bold text-danger">{selectedPoint.actionThreshold} {selectedPoint.unit}</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div>
            <label className="text-sm font-medium text-text-secondary block mb-2">{t('mobile.newReading')}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setSaved(false); }}
              className={`w-full px-4 py-6 text-3xl bg-surface border-2 rounded-xl text-center focus:outline-none transition-colors ${
                status === 'action'
                  ? 'border-danger text-danger'
                  : status === 'alert'
                  ? 'border-warning text-warning'
                  : 'border-border text-text-primary focus:border-accent'
              }`}
              placeholder={selectedPoint.unit}
              inputMode="decimal"
              autoFocus
            />
            {status !== 'ok' && (
              <div className={`mt-2 flex items-center gap-2 text-sm font-medium ${status === 'action' ? 'text-danger' : 'text-warning'}`}>
                <AlertTriangle className="w-4 h-4" />
                {status === 'action' ? t('mobile.actionExcursion') : t('mobile.alertExcursion')}
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface border-t border-border px-4 py-3">
          <button
            onClick={handleSave}
            disabled={!value || isNaN(parseFloat(value))}
            className={`w-full py-4 rounded-xl text-lg font-medium transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-accent text-white hover:bg-accent-hover disabled:opacity-50'
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                {t('mobile.saved')}
              </span>
            ) : (
              t('mobile.saveReading')
            )}
          </button>
        </div>
      </div>
    );
  }

  // Point list view
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      <div className="bg-surface border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">{t('mobile.envMonitoring')}</h2>
          </div>
          {onBack && (
            <button onClick={onBack} className="text-sm text-text-secondary">
              {t('common.back')}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-2">
        {points.map((point) => (
          <button
            key={point.id}
            onClick={() => setSelectedPoint(point)}
            className="w-full text-left p-4 bg-surface rounded-xl border border-border hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-text-primary">{point.name}</p>
                <p className="text-sm text-text-tertiary">{point.zone} - {point.type}</p>
              </div>
              <div className="text-right">
                {point.lastReading ? (
                  <>
                    <p className="text-lg font-bold text-text-primary">
                      {point.lastReading.value} {point.unit}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(point.lastReading.timestamp).toLocaleTimeString()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-text-tertiary">{t('mobile.noReading')}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
