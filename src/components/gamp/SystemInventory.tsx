import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Server, Plus, RefreshCw, AlertTriangle, Archive } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';

interface ComputerizedSystem {
  id: string;
  name: string;
  vendor: string;
  version: string;
  gampCategory: number;
  validationStatus: string;
  riskLevel: string;
  description: string;
  lastReviewDate: string | null;
  nextReviewDate: string | null;
  retiredDate: string | null;
  reviews?: any[];
}

const GAMP_COLORS: Record<number, string> = {
  1: 'bg-gray-200 text-gray-700',
  3: 'bg-blue-100 text-blue-700',
  4: 'bg-amber-100 text-amber-700',
  5: 'bg-red-100 text-red-700',
};

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  validated: 'bg-green-100 text-green-700',
  retired: 'bg-red-100 text-red-600',
};

const RISK_COLORS: Record<string, string> = {
  low: 'text-green-600',
  medium: 'text-amber-600',
  high: 'text-red-600',
};

export function SystemInventory() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [systems, setSystems] = useState<ComputerizedSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [_selectedSystem, _setSelectedSystem] = useState<ComputerizedSystem | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [error, setError] = useState('');
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const fetchSystems = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ systems: ComputerizedSystem[] }>('/systems');
      setSystems(data.systems || []);
    } catch (err) {
      console.error('Failed to fetch systems:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch systems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, [token]);

  const handleCreate = async (formData: any) => {
    if (!token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch('/systems', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowForm(false);
      setError('');
      fetchSystems();
    } catch (err) {
      console.error('Failed to create system:', err);
      setError(err instanceof Error ? err.message : 'Failed to create system');
    }
  };

  const handleRetire = async (id: string) => {
    if (!token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch(`/systems/${id}/retire`, {
        method: 'PUT',
      });
      fetchSystems();
    } catch (err) {
      console.error('Failed to retire system:', err);
      setError(err instanceof Error ? err.message : 'Failed to retire system');
    }
  };

  const handleScheduleReview = async (systemId: string, reviewData: any) => {
    if (!token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch(`/systems/${systemId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
      setShowReviewForm(null);
      fetchSystems();
    } catch (err) {
      console.error('Failed to schedule review:', err);
      setError(err instanceof Error ? err.message : 'Failed to schedule review');
    }
  };

  const isOverdue = (nextReviewDate: string | null) => {
    if (!nextReviewDate) return false;
    return new Date(nextReviewDate) < new Date();
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
          <Server className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('systems.title')}</h2>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('systems.addSystem')}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {systems.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">{t('systems.noSystems')}</div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('systems.name')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('systems.vendor')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('systems.version')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('systems.gampCategory')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('systems.validationStatus')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('systems.riskLevel')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('systems.nextReview')}</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((sys) => (
                <tr
                  key={sys.id}
                  className={`border-b border-border last:border-0 hover:bg-surface-hover transition-colors ${
                    isOverdue(sys.nextReviewDate) && sys.validationStatus !== 'retired' ? 'bg-amber-50 dark:bg-amber-950/20' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-text-primary">{sys.name}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{sys.vendor || '-'}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{sys.version || '-'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${GAMP_COLORS[sys.gampCategory] || ''}`}>
                      Cat {sys.gampCategory}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[sys.validationStatus] || ''}`}>
                      {t(`systems.status_${sys.validationStatus}`)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`font-medium text-xs ${RISK_COLORS[sys.riskLevel] || ''}`}>
                      {t(`systems.risk_${sys.riskLevel}`)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {sys.nextReviewDate ? (
                      <span className={`text-xs ${isOverdue(sys.nextReviewDate) ? 'text-red-600 font-bold flex items-center gap-1' : 'text-text-secondary'}`}>
                        {isOverdue(sys.nextReviewDate) && <AlertTriangle className="w-3 h-3" />}
                        {new Date(sys.nextReviewDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-xs text-text-tertiary">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      {canEdit && (
                        <button
                          onClick={() => setShowReviewForm(sys.id)}
                          className="p-1 rounded hover:bg-surface-hover text-text-tertiary hover:text-accent transition-colors"
                          title={t('systems.scheduleReview')}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canEdit && sys.validationStatus !== 'retired' && (
                        <button
                          onClick={() => handleRetire(sys.id)}
                          className="p-1 rounded hover:bg-surface-hover text-text-tertiary hover:text-red-500 transition-colors"
                          title={t('systems.retire')}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add System Modal */}
      {showForm && (
        <SystemForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {/* Schedule Review Modal */}
      {showReviewForm && (
        <ReviewForm
          systemId={showReviewForm}
          onSave={(data) => handleScheduleReview(showReviewForm, data)}
          onCancel={() => setShowReviewForm(null)}
        />
      )}
    </div>
  );
}

function SystemForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [version, setVersion] = useState('');
  const [gampCategory, setGampCategory] = useState(4);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [description, setDescription] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('systems.addSystem')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('systems.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('systems.vendor')} value={vendor} onChange={(e) => setVendor(e.target.value)} />
            <input className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('systems.version')} value={version} onChange={(e) => setVersion(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={gampCategory} onChange={(e) => setGampCategory(Number(e.target.value))}>
              <option value={1}>GAMP Cat 1 - Infrastructure</option>
              <option value={3}>GAMP Cat 3 - Non-configured</option>
              <option value={4}>GAMP Cat 4 - Configured</option>
              <option value={5}>GAMP Cat 5 - Custom</option>
            </select>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
              <option value="low">{t('systems.risk_low')}</option>
              <option value="medium">{t('systems.risk_medium')}</option>
              <option value="high">{t('systems.risk_high')}</option>
            </select>
          </div>
          <textarea className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" rows={2} placeholder={t('systems.descriptionPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">{t('systems.nextReview')}</label>
            <input type="date" className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ name, vendor, version, gampCategory, riskLevel, description, nextReviewDate: nextReviewDate || undefined })}
            disabled={!name}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ systemId: _systemId, onSave, onCancel }: { systemId: string; onSave: (data: any) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().slice(0, 10));
  const [reviewer, setReviewer] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">{t('systems.scheduleReview')}</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">{t('systems.reviewDate')}</label>
            <input type="date" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
          </div>
          <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" placeholder={t('systems.reviewerPlaceholder')} value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">{t('systems.nextReview')}</label>
            <input type="date" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover">{t('common.cancel')}</button>
          <button
            onClick={() => onSave({ reviewDate, reviewer, nextReviewDate: nextReviewDate || undefined })}
            disabled={!reviewer}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {t('systems.scheduleReview')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemInventory;
