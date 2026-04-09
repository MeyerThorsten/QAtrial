import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useAuditStore } from '../../store/useAuditStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import type { ElectronicSignature, SignatureMeaning } from '../../types';

interface Props {
  open: boolean;
  entityType: string;
  entityId: string;
  projectId?: string;
  meaning?: SignatureMeaning;
  onComplete: (signature: ElectronicSignature, signatureId?: string, reason?: string) => void;
  onClose: () => void;
}

const MEANINGS: SignatureMeaning[] = ['authored', 'reviewed', 'approved', 'verified', 'rejected'];

export function EnhancedSignatureModal({
  open,
  entityType,
  entityId,
  projectId,
  meaning: initialMeaning,
  onComplete,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const isServerMode = mode === 'server';

  const auditLog = useAuditStore((s) => s.log);
  const currentUser = useAuthStore((s) => s.currentUser);
  const verifyForSignature = useAuthStore((s) => s.verifyForSignature);
  const isSignatureValid = useAuthStore((s) => s.isSignatureValid);
  const { user: authUser } = useAuth();
  const currentRole = currentUser?.role || authUser?.role || null;
  const canApprove = roleHasPermission(currentRole, 'canApprove');
  const canSign = roleHasPermission(currentRole, 'canSign');

  const [meaning, setMeaning] = useState<SignatureMeaning>(initialMeaning || 'approved');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ reason?: string; password?: string; auth?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ signatureId: string; timestamp: string } | null>(null);

  const allowedMeanings = useMemo(
    () =>
      MEANINGS.filter((value) => {
        if (['reviewed', 'approved', 'rejected'].includes(value)) {
          return canApprove;
        }

        return canSign;
      }),
    [canApprove, canSign],
  );

  useEffect(() => {
    if (!open) return;

    if (initialMeaning && allowedMeanings.includes(initialMeaning)) {
      setMeaning(initialMeaning);
      return;
    }

    if (!allowedMeanings.includes(meaning)) {
      setMeaning(allowedMeanings[0] ?? 'authored');
    }
  }, [allowedMeanings, initialMeaning, meaning, open]);

  if (!open) return null;

  const validate = (): boolean => {
    const newErrors: { reason?: string; password?: string; auth?: string } = {};
    if (!reason.trim()) {
      newErrors.reason = t('common.required');
    }
    if (!allowedMeanings.includes(meaning)) {
      newErrors.auth = 'You do not have permission to apply this signature meaning.';
    }
    if ((isServerMode || !isSignatureValid()) && !password.trim()) {
      newErrors.password = t('common.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSign = async () => {
    if (!validate()) return;
    if (!allowedMeanings.includes(meaning)) return;

    setLoading(true);
    setErrors({});

    // Verify password
    if (!isSignatureValid()) {
      if (isServerMode) {
        try {
          await apiFetch('/auth/verify-password', {
            method: 'POST',
            body: JSON.stringify({ password }),
          });
        } catch {
          setErrors({ auth: t('signature.authFailed') });
          setLoading(false);
          return;
        }
      } else if (currentUser) {
        const verified = verifyForSignature(password);
        if (!verified) {
          setErrors({ auth: t('signature.authFailed') });
          setLoading(false);
          return;
        }
      }
    }

    const timestamp = new Date().toISOString();
    const signature: ElectronicSignature = {
      signerId: currentUser?.id || authUser?.id || 'anonymous',
      signerName: currentUser?.displayName || authUser?.name || 'Anonymous User',
      signerRole: currentUser?.title || currentUser?.role || authUser?.role || 'User',
      timestamp,
      meaning,
      method: isServerMode ? 'server-verified' : currentUser ? 'password-verified' : 'password-unverified',
    };

    let signatureId = `sig-${Date.now()}`;

    if (isServerMode) {
      try {
        if (!projectId) {
          setErrors({ auth: 'Missing project context for signature' });
          setLoading(false);
          return;
        }

        const result = await apiFetch<{
          signature: {
            id: string;
            timestamp: string;
          };
        }>('/signatures', {
          method: 'POST',
          body: JSON.stringify({
            projectId,
            entityType,
            entityId,
            meaning,
            reason,
            password,
          }),
        });
        signatureId = result.signature.id;
        signature.timestamp = result.signature.timestamp;
      } catch (error) {
        setErrors({
          auth: error instanceof Error ? error.message : t('signature.authFailed'),
        });
        setLoading(false);
        return;
      }
    }

    // Log to audit trail
    const action = meaning === 'approved' ? 'approve' : meaning === 'rejected' ? 'reject' : 'sign';
    auditLog(action, entityType, entityId, undefined, undefined, reason);

    // Patch the last entry with signature info
    const entries = useAuditStore.getState().entries;
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      useAuditStore.setState((state) => ({
        entries: state.entries.map((e) =>
          e.id === lastEntry.id ? { ...e, signature, reason: reason.trim() } : e,
        ),
      }));
    }

    setSuccess({ signatureId, timestamp: signature.timestamp });
    onComplete(signature, signatureId, reason.trim());
  };

  const handleClose = () => {
    setMeaning(initialMeaning || 'approved');
    setReason('');
    setPassword('');
    setErrors({});
    setSuccess(null);
    setLoading(false);
    onClose();
  };

  const formatDate = (iso: string): string => {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={handleClose}>
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
          <button onClick={handleClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {success ? (
            /* Success state */
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-badge-passed-bg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-badge-passed-text" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{t('signature.signAndApply')}</p>
                <p className="text-xs text-text-tertiary mt-1">
                  ID: <span className="font-mono">{success.signatureId}</span>
                </p>
                <p className="text-xs text-text-tertiary">{formatDate(success.timestamp)}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Entity context */}
              <div className="bg-surface-tertiary rounded-lg px-3 py-2">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary capitalize">{entityType}</span>{' '}
                  <span className="font-mono text-xs text-accent">{entityId}</span>
                </p>
              </div>

              {/* Meaning selector */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('signature.meaning')}
                </label>
                <div className="space-y-1.5">
                  {allowedMeanings.map((m) => (
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
                  {allowedMeanings.length === 0 && (
                    <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                      No allowed signature actions are available for your role.
                    </div>
                  )}
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

              {/* Auth error */}
              {errors.auth && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {errors.auth}
                </div>
              )}

              {/* Identity info */}
              {(currentUser || authUser) && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-subtle border border-accent/20">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <div className="text-xs text-text-secondary">
                    <span className="font-medium text-text-primary">
                      {currentUser?.displayName || authUser?.name}
                    </span>
                    <span className="mx-1">&middot;</span>
                    <span>{currentUser?.role || authUser?.role}</span>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-xs text-text-tertiary italic leading-relaxed">
                {t('signature.disclaimer')}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          {success ? (
            <button
              onClick={handleClose}
              className="px-4 py-1.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium"
            >
              {t('common.close')}
            </button>
          ) : (
            <>
              <button
                onClick={handleClose}
                className="px-3 py-1.5 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSign}
                disabled={loading || allowedMeanings.length === 0 || !allowedMeanings.includes(meaning)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('signature.signAndApply')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
