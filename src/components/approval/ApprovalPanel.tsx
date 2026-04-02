import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck, ShieldAlert, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useAuditStore } from '../../store/useAuditStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { isApproved, getApprovalSignature } from '../../lib/approvalHelpers';

type ApprovalStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

interface Props {
  entityType: string;
  entityId: string;
  projectId: string;
  currentStatus?: string;
  open: boolean;
  onClose: () => void;
}

interface ApprovalHistoryEntry {
  id: string;
  action: string;
  userName: string;
  timestamp: string;
  reason?: string;
  signerName?: string;
  meaning?: string;
}

const STATUS_STYLES: Record<ApprovalStatus, string> = {
  draft: 'bg-badge-draft-bg text-badge-draft-text',
  in_review: 'bg-accent-subtle text-accent',
  approved: 'bg-badge-passed-bg text-badge-passed-text',
  rejected: 'bg-danger-subtle text-danger',
};

export function ApprovalPanel({ entityType, entityId, projectId, currentStatus: _currentStatus, open, onClose }: Props) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const isServerMode = mode === 'server';

  const auditEntries = useAuditStore((s) => s.entries);
  const auditLog = useAuditStore((s) => s.log);
  const currentUser = useAuthStore((s) => s.currentUser);
  const { user: authUser } = useAuth();

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectField, setShowRejectField] = useState(false);
  const [loading, setLoading] = useState(false);

  const approved = isApproved(entityId);
  const approvalSig = getApprovalSignature(entityId);

  // Derive approval status from audit trail
  const approvalStatus = useMemo((): ApprovalStatus => {
    if (approved) return 'approved';

    // Check for pending review or rejection
    const entityEntries = auditEntries.filter((e) => e.entityId === entityId);
    for (let i = entityEntries.length - 1; i >= 0; i--) {
      const entry = entityEntries[i];
      if (entry.action === 'reject' && entry.signature?.meaning === 'rejected') return 'rejected';
      if (entry.action === 'approve' && !entry.signature) return 'in_review';
    }

    return 'draft';
  }, [auditEntries, entityId, approved]);

  // Approval history
  const history = useMemo((): ApprovalHistoryEntry[] => {
    return auditEntries
      .filter(
        (e) =>
          e.entityId === entityId &&
          (e.action === 'approve' || e.action === 'reject' || e.action === 'sign'),
      )
      .map((e) => ({
        id: e.id,
        action: e.action,
        userName: e.userName,
        timestamp: e.timestamp,
        reason: e.reason,
        signerName: e.signature?.signerName,
        meaning: e.signature?.meaning,
      }))
      .reverse();
  }, [auditEntries, entityId]);

  const getUserName = () =>
    currentUser?.displayName || authUser?.name || 'Anonymous';

  const handleRequestApproval = async () => {
    setLoading(true);
    try {
      if (isServerMode) {
        await apiFetch(`/approval/${entityType}/${entityId}/request`, {
          method: 'POST',
          body: JSON.stringify({ projectId }),
        });
      }
      auditLog('approve', entityType, entityId, undefined, undefined, 'Approval requested');
    } catch {
      // Fallback to local
      auditLog('approve', entityType, entityId, undefined, undefined, 'Approval requested');
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      if (isServerMode) {
        await apiFetch(`/approval/${entityType}/${entityId}/approve`, {
          method: 'POST',
          body: JSON.stringify({ projectId }),
        });
      }
      // Log approval with signature
      auditLog('approve', entityType, entityId, undefined, undefined, 'Approved');
      const entries = useAuditStore.getState().entries;
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        useAuditStore.setState((state) => ({
          entries: state.entries.map((e) =>
            e.id === lastEntry.id
              ? {
                  ...e,
                  signature: {
                    signerId: currentUser?.id || authUser?.id || 'anonymous',
                    signerName: getUserName(),
                    signerRole: currentUser?.role || authUser?.role || 'User',
                    timestamp: new Date().toISOString(),
                    meaning: 'approved' as const,
                    method: currentUser ? 'password-verified' : 'password-unverified',
                  },
                }
              : e,
          ),
        }));
      }
    } catch {
      auditLog('approve', entityType, entityId, undefined, undefined, 'Approved');
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setLoading(true);
    try {
      if (isServerMode) {
        await apiFetch(`/approval/${entityType}/${entityId}/reject`, {
          method: 'POST',
          body: JSON.stringify({ projectId, reason: rejectReason }),
        });
      }
      auditLog('reject', entityType, entityId, undefined, undefined, rejectReason);
      const entries = useAuditStore.getState().entries;
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        useAuditStore.setState((state) => ({
          entries: state.entries.map((e) =>
            e.id === lastEntry.id
              ? {
                  ...e,
                  signature: {
                    signerId: currentUser?.id || authUser?.id || 'anonymous',
                    signerName: getUserName(),
                    signerRole: currentUser?.role || authUser?.role || 'User',
                    timestamp: new Date().toISOString(),
                    meaning: 'rejected' as const,
                    method: currentUser ? 'password-verified' : 'password-unverified',
                  },
                }
              : e,
          ),
        }));
      }
    } catch {
      auditLog('reject', entityType, entityId, undefined, undefined, rejectReason);
    }
    setShowRejectField(false);
    setRejectReason('');
    setLoading(false);
  };

  const handleRevoke = async () => {
    setLoading(true);
    try {
      if (isServerMode) {
        await apiFetch(`/approval/${entityType}/${entityId}/revoke`, {
          method: 'POST',
          body: JSON.stringify({ projectId }),
        });
      }
      auditLog('reject', entityType, entityId, undefined, undefined, 'Approval revoked');
    } catch {
      auditLog('reject', entityType, entityId, undefined, undefined, 'Approval revoked');
    }
    setLoading(false);
  };

  const formatDate = (iso: string): string => {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">{t('approval.status')}</h2>
            <span className="font-mono text-xs text-text-tertiary">{entityId}</span>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Current status badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">{t('approval.status')}:</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ${
                STATUS_STYLES[approvalStatus]
              }`}
            >
              {approvalStatus === 'draft' && t('approval.draft')}
              {approvalStatus === 'in_review' && t('approval.inReview')}
              {approvalStatus === 'approved' && t('approval.approved')}
              {approvalStatus === 'rejected' && t('approval.rejected')}
            </span>
          </div>

          {/* Approved info */}
          {approvalStatus === 'approved' && approvalSig && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-badge-passed-bg/30 border border-badge-passed-text/20">
              <CheckCircle className="w-4 h-4 text-badge-passed-text shrink-0" />
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-text-primary">
                  {t('approval.approvedBy', { name: approvalSig.signerName })}
                </p>
                <p className="text-xs text-text-tertiary">{formatDate(approvalSig.timestamp)}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {approvalStatus === 'draft' && (
              <button
                onClick={handleRequestApproval}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50"
              >
                <Clock className="w-4 h-4" />
                {t('approval.requestApproval')}
              </button>
            )}

            {approvalStatus === 'in_review' && (
              <div className="space-y-2">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-success rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t('approval.approve')}
                </button>

                {!showRejectField ? (
                  <button
                    onClick={() => setShowRejectField(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm text-danger bg-danger-subtle rounded-lg hover:bg-danger/20 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    {t('approval.reject')}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder={t('approval.rejectReason')}
                      rows={3}
                      className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleReject}
                        disabled={loading || !rejectReason.trim()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-danger rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50"
                      >
                        {t('approval.reject')}
                      </button>
                      <button
                        onClick={() => { setShowRejectField(false); setRejectReason(''); }}
                        className="px-3 py-2 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {approvalStatus === 'approved' && (
              <button
                onClick={handleRevoke}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm text-danger bg-danger-subtle rounded-lg hover:bg-danger/20 transition-colors font-medium disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4" />
                {t('approval.revoke')}
              </button>
            )}
          </div>

          {/* Approval history */}
          {history.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">{t('approval.history')}</h3>
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-surface border border-border-subtle"
                  >
                    {entry.action === 'approve' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-danger mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary">
                        {entry.signerName || entry.userName}
                        {' - '}
                        <span className="text-text-tertiary capitalize">{entry.meaning || entry.action}</span>
                      </p>
                      <p className="text-xs text-text-tertiary">{formatDate(entry.timestamp)}</p>
                      {entry.reason && (
                        <p className="text-xs text-text-secondary mt-0.5">{entry.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
