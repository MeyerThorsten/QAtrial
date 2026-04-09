import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Barcode, Plus, Download, CheckCircle2, XCircle } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

interface UDIRecord {
  id: string;
  deviceIdentifier: string;
  productionId: string | null;
  productName: string;
  deviceDescription: string;
  brandName: string;
  versionModelNo: string;
  companyName: string;
  gudidSubmitted: boolean;
  eudamedRegistered: boolean;
}

export function UDIManager() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token, user } = useAuth();
  const [udis, setUdis] = useState<UDIRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');
  const canExport = roleHasPermission(user?.role, 'canExport');

  const fetchUDIs = async () => {
    if (!projectId || !token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ udis: UDIRecord[] }>(`/udi?projectId=${projectId}`);
      setUdis(data.udis || []);
    } catch (err) {
      console.error('Failed to fetch UDIs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch UDIs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUDIs();
  }, [projectId, token]);

  const handleCreate = async (formData: any) => {
    if (!projectId || !token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch('/udi', {
        method: 'POST',
        body: JSON.stringify({ ...formData, projectId }),
      });
      setShowForm(false);
      setError('');
      fetchUDIs();
    } catch (err) {
      console.error('Failed to create UDI:', err);
      setError(err instanceof Error ? err.message : 'Failed to create UDI');
    }
  };

  const handleExport = async (format: 'gudid' | 'eudamed') => {
    if (!projectId || !token) return;
    if (!canExport) {
      setError('Insufficient permissions: requires canExport');
      return;
    }
    try {
      const data = await apiFetch<{ gudidExport?: any; eudamedExport?: any }>(`/udi/${format}-export?projectId=${projectId}`);
      const exportData = format === 'gudid' ? data.gudidExport : data.eudamedExport;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${format}-export-${projectId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Failed to export ${format} data:`, err);
      setError(err instanceof Error ? err.message : `Failed to export ${format} data`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Barcode className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('udi.title')}</h2>
        </div>
        <div className="flex items-center gap-2">
          {canExport && (
            <>
              <button
                onClick={() => handleExport('gudid')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('udi.exportGUDID')}
              </button>
              <button
                onClick={() => handleExport('eudamed')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('udi.exportEUDAMED')}
              </button>
            </>
          )}
          {canEdit && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('udi.addUDI')}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {udis.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">{t('udi.noUDIs')}</div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('udi.deviceIdentifier')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('udi.productName')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('udi.brandName')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('udi.version')}</th>
                <th className="text-center px-4 py-2.5 font-medium text-text-secondary">{t('udi.gudid')}</th>
                <th className="text-center px-4 py-2.5 font-medium text-text-secondary">{t('udi.eudamed')}</th>
              </tr>
            </thead>
            <tbody>
              {udis.map((udi) => (
                <tr key={udi.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-2.5 font-mono text-text-primary text-xs">{udi.deviceIdentifier}</td>
                  <td className="px-4 py-2.5 text-text-primary">{udi.productName}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{udi.brandName || '-'}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{udi.versionModelNo || '-'}</td>
                  <td className="px-4 py-2.5 text-center">
                    {udi.gudidSubmitted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {udi.eudamedRegistered ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add UDI Modal */}
      {showForm && <UDIForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}
    </div>
  );
}

function UDIForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [deviceIdentifier, setDeviceIdentifier] = useState('');
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [versionModelNo, setVersionModelNo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [deviceDescription, setDeviceDescription] = useState('');
  const [productionId, setProductionId] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('udi.addUDI')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('udi.deviceIdentifierPlaceholder')} value={deviceIdentifier} onChange={(e) => setDeviceIdentifier(e.target.value)} />
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('udi.productNamePlaceholder')} value={productName} onChange={(e) => setProductName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('udi.brandNamePlaceholder')} value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('udi.versionPlaceholder')} value={versionModelNo} onChange={(e) => setVersionModelNo(e.target.value)} />
          </div>
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('udi.companyNamePlaceholder')} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <textarea className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" rows={2} placeholder={t('udi.descriptionPlaceholder')} value={deviceDescription} onChange={(e) => setDeviceDescription(e.target.value)} />
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('udi.productionIdPlaceholder')} value={productionId} onChange={(e) => setProductionId(e.target.value)} />
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ deviceIdentifier, productName, brandName, versionModelNo, companyName, deviceDescription, productionId: productionId || undefined })}
            disabled={!deviceIdentifier || !productName}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UDIManager;
