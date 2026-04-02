import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, X, Copy, Check, AlertTriangle, Link2 } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';

type ExpiryOption = '24h' | '72h' | '7d';

export function ShareAuditLink() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const project = useProjectStore((s) => s.project);

  const [open, setOpen] = useState(false);
  const [expiry, setExpiry] = useState<ExpiryOption>('24h');
  const [generating, setGenerating] = useState(false);
  const [auditUrl, setAuditUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show for admin users
  if (!user || user.role !== 'admin') return null;

  const handleGenerate = async () => {
    if (!project) return;
    setGenerating(true);
    setError(null);
    setAuditUrl(null);

    try {
      const res = await apiFetch<{ auditUrl: string; token: string; expiresAt: string }>(
        '/audit-mode/create',
        {
          method: 'POST',
          body: JSON.stringify({
            projectId: (project as any).id || project.name,
            expiresIn: expiry,
          }),
        },
      );
      setAuditUrl(res.auditUrl);
      setExpiresAt(res.expiresAt);
    } catch (err: any) {
      setError(err.message || 'Failed to generate audit link');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!auditUrl) return;
    try {
      await navigator.clipboard.writeText(auditUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = auditUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAuditUrl(null);
    setExpiresAt(null);
    setError(null);
    setCopied(false);
  };

  const expiryOptions: { value: ExpiryOption; label: string }[] = [
    { value: '24h', label: t('auditMode.24h') },
    { value: '72h', label: t('auditMode.72h') },
    { value: '7d', label: t('auditMode.7d') },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
      >
        <Eye className="w-4 h-4" />
        {t('auditMode.shareLink')}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={handleClose}>
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                <h2 className="text-base font-semibold text-text-primary">{t('auditMode.shareLink')}</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4 space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">{t('auditMode.warning')}</p>
              </div>

              {/* Expiry selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('auditMode.expiry')}
                </label>
                <div className="flex gap-2">
                  {expiryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setExpiry(opt.value)}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                        expiry === opt.value
                          ? 'border-accent bg-accent-subtle text-accent font-medium'
                          : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              {!auditUrl && (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  <Link2 className="w-4 h-4" />
                  {generating ? t('common.loading') : t('auditMode.generateLink')}
                </button>
              )}

              {/* Generated URL */}
              {auditUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={auditUrl}
                      readOnly
                      className="flex-1 text-xs font-mono bg-surface-secondary border border-border rounded-lg px-3 py-2 text-text-primary"
                    />
                    <button
                      onClick={handleCopy}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? t('auditMode.copied') : t('auditMode.copyLink')}
                    </button>
                  </div>
                  {expiresAt && (
                    <p className="text-xs text-text-tertiary">
                      {t('auditMode.expires', { date: new Date(expiresAt).toLocaleString() })}
                    </p>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-xs text-danger">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
