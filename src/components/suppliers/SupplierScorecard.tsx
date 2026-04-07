import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Plus, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Supplier {
  id: string;
  name: string;
  category: string;
  riskLevel: string;
  qualificationStatus: string;
  overallScore: number | null;
  defectRate: number | null;
  onTimeDelivery: number | null;
  lastAuditDate: string | null;
  nextAuditDate: string | null;
  audits?: any[];
}

export function SupplierScorecard() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuditForm, setShowAuditForm] = useState<string | null>(null);

  // Add supplier form state
  const [newSupplier, setNewSupplier] = useState({ name: '', category: 'component', riskLevel: 'medium' });
  const [newAudit, setNewAudit] = useState({ auditDate: '', auditor: '', auditType: 'routine', score: '', findings: '' });

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchSuppliers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers || []);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [token]);

  const handleAddSupplier = async () => {
    if (!token || !newSupplier.name) return;
    try {
      const res = await fetch(`${apiBase}/api/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newSupplier),
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewSupplier({ name: '', category: 'component', riskLevel: 'medium' });
        fetchSuppliers();
      }
    } catch (err) {
      console.error('Failed to add supplier:', err);
    }
  };

  const handleAddAudit = async (supplierId: string) => {
    if (!token || !newAudit.auditDate || !newAudit.auditor) return;
    try {
      const res = await fetch(`${apiBase}/api/suppliers/${supplierId}/audits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newAudit,
          score: newAudit.score ? parseInt(newAudit.score) : null,
        }),
      });
      if (res.ok) {
        setShowAuditForm(null);
        setNewAudit({ auditDate: '', auditor: '', auditType: 'routine', score: '', findings: '' });
        fetchSuppliers();
      }
    } catch (err) {
      console.error('Failed to add audit:', err);
    }
  };

  const riskColors: Record<string, string> = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  const qualColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    qualified: 'bg-green-100 text-green-700',
    conditional: 'bg-yellow-100 text-yellow-700',
    disqualified: 'bg-red-100 text-red-700',
  };

  const scoreColor = (score: number | null) => {
    if (score === null) return 'text-text-tertiary';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('suppliers.title')}</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('suppliers.addSupplier')}
        </button>
      </div>

      {/* Add Supplier Form */}
      {showAddForm && (
        <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">{t('suppliers.addSupplier')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder={t('suppliers.namePlaceholder')}
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <select
              value={newSupplier.category}
              onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="component">{t('suppliers.cat_component')}</option>
              <option value="service">{t('suppliers.cat_service')}</option>
              <option value="raw_material">{t('suppliers.cat_raw_material')}</option>
              <option value="contract_manufacturer">{t('suppliers.cat_contract_manufacturer')}</option>
            </select>
            <select
              value={newSupplier.riskLevel}
              onChange={(e) => setNewSupplier({ ...newSupplier, riskLevel: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="low">{t('risk.low')}</option>
              <option value="medium">{t('risk.medium')}</option>
              <option value="high">{t('risk.high')}</option>
              <option value="critical">{t('risk.critical')}</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddSupplier} className="px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90">
              {t('common.save')}
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Supplier Cards */}
      {suppliers.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <Building2 className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
          <p className="text-text-tertiary">{t('suppliers.noSuppliers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-surface rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{supplier.name}</h3>
                  <p className="text-xs text-text-tertiary capitalize">{t(`suppliers.cat_${supplier.category}`)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[supplier.riskLevel]}`}>
                    {t(`risk.${supplier.riskLevel}`)}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${qualColors[supplier.qualificationStatus]}`}>
                    {t(`suppliers.qual_${supplier.qualificationStatus}`)}
                  </span>
                </div>
              </div>

              {/* Score Gauge */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-tertiary">{t('suppliers.overallScore')}</span>
                    <span className={`text-lg font-bold ${scoreColor(supplier.overallScore)}`}>
                      {supplier.overallScore !== null ? supplier.overallScore : '--'}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (supplier.overallScore ?? 0) >= 80 ? 'bg-green-500' :
                        (supplier.overallScore ?? 0) >= 60 ? 'bg-yellow-500' :
                        (supplier.overallScore ?? 0) >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${supplier.overallScore ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-tertiary">{t('suppliers.defectRate')}</span>
                  <p className="font-medium text-text-primary">
                    {supplier.defectRate !== null ? `${supplier.defectRate}%` : '--'}
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary">{t('suppliers.onTimeDelivery')}</span>
                  <p className="font-medium text-text-primary">
                    {supplier.onTimeDelivery !== null ? `${supplier.onTimeDelivery}%` : '--'}
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary">{t('suppliers.lastAudit')}</span>
                  <p className="font-medium text-text-primary">
                    {supplier.lastAuditDate ? new Date(supplier.lastAuditDate).toLocaleDateString() : '--'}
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary">{t('suppliers.nextAudit')}</span>
                  <p className="font-medium text-text-primary">
                    {supplier.nextAuditDate ? new Date(supplier.nextAuditDate).toLocaleDateString() : '--'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setExpandedId(expandedId === supplier.id ? null : supplier.id)}
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  {expandedId === supplier.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {t('suppliers.viewAudits')}
                </button>
                <button
                  onClick={() => setShowAuditForm(showAuditForm === supplier.id ? null : supplier.id)}
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  <Calendar className="w-3 h-3" />
                  {t('suppliers.addAudit')}
                </button>
              </div>

              {/* Add Audit Form */}
              {showAuditForm === supplier.id && (
                <div className="bg-surface-secondary rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={newAudit.auditDate}
                      onChange={(e) => setNewAudit({ ...newAudit, auditDate: e.target.value })}
                      className="px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    <input
                      type="text"
                      placeholder={t('suppliers.auditorPlaceholder')}
                      value={newAudit.auditor}
                      onChange={(e) => setNewAudit({ ...newAudit, auditor: e.target.value })}
                      className="px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder={t('suppliers.scorePlaceholder')}
                      value={newAudit.score}
                      onChange={(e) => setNewAudit({ ...newAudit, score: e.target.value })}
                      className="px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    <select
                      value={newAudit.auditType}
                      onChange={(e) => setNewAudit({ ...newAudit, auditType: e.target.value })}
                      className="px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <option value="routine">{t('suppliers.audit_routine')}</option>
                      <option value="for_cause">{t('suppliers.audit_for_cause')}</option>
                      <option value="re_qualification">{t('suppliers.audit_re_qualification')}</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder={t('suppliers.findingsPlaceholder')}
                    value={newAudit.findings}
                    onChange={(e) => setNewAudit({ ...newAudit, findings: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleAddAudit(supplier.id)} className="px-2 py-1 text-xs font-medium text-white bg-accent rounded-lg hover:bg-accent/90">
                      {t('common.save')}
                    </button>
                    <button onClick={() => setShowAuditForm(null)} className="px-2 py-1 text-xs font-medium text-text-secondary bg-surface border border-border rounded-lg">
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}

              {/* Audit History */}
              {expandedId === supplier.id && supplier.audits && supplier.audits.length > 0 && (
                <div className="bg-surface-secondary rounded-lg p-3 space-y-2">
                  {supplier.audits.map((audit: any) => (
                    <div key={audit.id} className="flex items-center justify-between text-xs border-b border-border pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="font-medium text-text-primary">{new Date(audit.auditDate).toLocaleDateString()}</span>
                        <span className="text-text-tertiary ml-2">{audit.auditor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-text-secondary capitalize">{audit.auditType.replace('_', ' ')}</span>
                        {audit.score !== null && (
                          <span className={`font-bold ${scoreColor(audit.score)}`}>{audit.score}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
