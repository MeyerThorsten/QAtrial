import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck } from 'lucide-react';
import { useAuditStore } from '../../store/useAuditStore';
import type { ElectronicSignature, SignatureMeaning } from '../../types';

interface Props {
  open: boolean;
  entityType: string;
  entityId: string;
  entityTitle: string;
  onSign: (signature: ElectronicSignature) => void;
  onCancel: () => void;
}

const MEANINGS: SignatureMeaning[] = ['authored', 'reviewed', 'approved', 'verified', 'rejected'];

export function SignatureModal({ open, entityType, entityId, entityTitle, onSign, onCancel }: Props) {
  const { t } = useTranslation();
  const auditLog = useAuditStore((s) => s.log);

  const [meaning, setMeaning] = useState<SignatureMeaning>('approved');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ reason?: string; password?: string }>({});

  if (!open) return null;

  const validate = (): boolean => {
    const newErrors: { reason?: string; password?: string } = {};
    if (!reason.trim()) {
      newErrors.reason = t('common.required');
    }
    if (!password.trim()) {
      newErrors.password = t('common.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSign = () => {
    if (!validate()) return;

    const signature: ElectronicSignature = {
      signerId: 'current-user',
      signerName: 'Current User',
      signerRole: 'Quality Manager',
      timestamp: new Date().toISOString(),
      meaning,
      method: 'password',
    };

    // Log to audit trail
    const action = meaning === 'approved' ? 'approve' : meaning === 'rejected' ? 'reject' : 'sign';
    auditLog(action, entityType, entityId, undefined, undefined, reason);

    // Also log the full signature entry with signature details
    const entries = useAuditStore.getState().entries;
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      // Patch the last entry with signature info
      useAuditStore.setState((state) => ({
        entries: state.entries.map((e) =>
          e.id === lastEntry.id ? { ...e, signature, reason: reason.trim() } : e
        ),
      }));
    }

    onSign(signature);

    // Reset form
    setMeaning('approved');
    setReason('');
    setPassword('');
    setErrors({});
  };

  const handleCancel = () => {
    setMeaning('approved');
    setReason('');
    setPassword('');
    setErrors({});
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={handleCancel}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">{t('signature.title')}</h2>
          </div>
          <button onClick={handleCancel} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Action context */}
          <div className="bg-surface-tertiary rounded-lg px-3 py-2">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary capitalize">{meaning}</span>{' '}
              <span className="font-mono text-xs text-accent">{entityId}</span>{' '}
              <span>- {entityTitle}</span>
            </p>
          </div>

          {/* Meaning selector */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t('signature.meaning')}
            </label>
            <div className="space-y-1.5">
              {MEANINGS.map((m) => (
                <label
                  key={m}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    meaning === m
                      ? 'bg-accent-subtle border border-accent'
                      : 'bg-surface border border-border hover:bg-surface-hover'
                  }`}
                >
                  <input
                    type="radio"
                    name="meaning"
                    value={m}
                    checked={meaning === m}
                    onChange={() => setMeaning(m)}
                    className="accent-accent"
                  />
                  <span className="text-sm text-text-primary">{t(`signature.${m}`)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('signature.reasonLabel')} <span className="text-danger">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined }));
              }}
              placeholder={t('signature.reasonPlaceholder')}
              rows={3}
              className={`w-full px-3 py-2 bg-input-bg border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors resize-none ${
                errors.reason ? 'border-danger' : 'border-input-border'
              }`}
            />
            {errors.reason && <p className="text-xs text-danger mt-0.5">{errors.reason}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('signature.password')} <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder={t('signature.authenticate')}
              className={`w-full px-3 py-2 bg-input-bg border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors ${
                errors.password ? 'border-danger' : 'border-input-border'
              }`}
            />
            {errors.password && <p className="text-xs text-danger mt-0.5">{errors.password}</p>}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-text-tertiary italic leading-relaxed">
            {t('signature.disclaimer')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSign}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('signature.signAndApply')}
          </button>
        </div>
      </div>
    </div>
  );
}
