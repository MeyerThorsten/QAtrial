import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, X, Copy, Check, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import { useAuth } from '../../hooks/useAuth';
import { roleHasPermission } from '../../lib/permissions';

interface SupplierOption {
  id: string;
  name: string;
}

type ExpiryOption = 30 | 90 | 365;

export function ShareSupplierLink() {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [expiry, setExpiry] = useState<ExpiryOption>(30);
  const [generating, setGenerating] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !canEdit) return null;

  const fetchSuppliers = async () => {
    if (!token) return;
    setError(null);
    try {
      const data = await apiFetch<{ suppliers: any[] }>('/suppliers');
      setSuppliers((data.suppliers || []).map((s: any) => ({ id: s.id, name: s.name })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch suppliers');
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchSuppliers();
  };

  const handleGenerate = async () => {
    if (!selectedSupplierId) return;
    setGenerating(true);
    setError(null);
    setPortalUrl(null);

    try {
      const res = await apiFetch<{ portalUrl: string; token: string; expiresAt: string }>(
        '/supplier-portal/create',
        {
          method: 'POST',
          body: JSON.stringify({
            supplierId: selectedSupplierId,
            expiresInDays: expiry,
          }),
        },
      );
      setPortalUrl(res.portalUrl);
      setExpiresAt(res.expiresAt);
    } catch (err: any) {
      setError(err.message || 'Failed to generate portal link');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!portalUrl) return;
    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = portalUrl;
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
    setPortalUrl(null);
    setExpiresAt(null);
    setError(null);
    setCopied(false);
    setSelectedSupplierId('');
  };

  const expiryOptions: { value: ExpiryOption; label: string }[] = [
    { value: 30, label: t('supplierPortal.expiry30d') },
    { value: 90, label: t('supplierPortal.expiry90d') },
    { value: 365, label: t('supplierPortal.expiry1y') },
  ];

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
      >
        <Link2 className="w-4 h-4" />
        {t('supplierPortal.sharePortal')}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={handleClose}>
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-accent" />
                <h2 className="text-base font-semibold text-text-primary">{t('supplierPortal.sharePortal')}</h2>
              </div>
              <button onClick={handleClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">{t('supplierPortal.warning')}</p>
              </div>

              {/* Supplier selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('supplierPortal.selectSupplier')}
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="">{t('supplierPortal.selectSupplierPlaceholder')}</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Expiry selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('supplierPortal.expiryLabel')}
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
              {!portalUrl && (
                <button
                  onClick={handleGenerate}
                  disabled={generating || !selectedSupplierId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  <Link2 className="w-4 h-4" />
                  {generating ? t('common.saving') : t('supplierPortal.generateLink')}
                </button>
              )}

              {/* Generated URL */}
              {portalUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={portalUrl}
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
                      {t('supplierPortal.expiresAt', { date: new Date(expiresAt).toLocaleString() })}
                    </p>
                  )}
                </div>
              )}

              {/* Error */}
              {error && <p className="text-xs text-danger">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
