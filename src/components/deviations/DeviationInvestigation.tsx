import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileEdit, Trash2, Search, Zap, AlertTriangle } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { DeviationForm } from './DeviationForm';
import { DeviationTrending } from './DeviationTrending';
import { getProjectId } from '../../lib/projectUtils';

const CLASSIFICATION_COLORS: Record<string, string> = {
  minor: 'bg-yellow-500/10 text-yellow-600',
  major: 'bg-orange-500/10 text-orange-600',
  critical: 'bg-red-500/10 text-red-600',
};

const INVESTIGATION_METHODS = ['fishbone', 'five_why', 'ishikawa', 'other'];

export function DeviationInvestigation() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token, user } = useAuth();
  const [deviations, setDeviations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showTrending, setShowTrending] = useState(false);
  const [investigationMethod, setInvestigationMethod] = useState('fishbone');
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [rootCauseText, setRootCauseText] = useState('');
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');
  const canDelete = roleHasPermission(user?.role, 'canDelete');

  const fetchData = useCallback(async () => {
    if (!projectId || !token) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ deviations: any[] }>(`/deviations?projectId=${encodeURIComponent(projectId)}`);
      setDeviations(data.deviations || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deviations');
    } finally {
      setLoading(false);
    }
  }, [projectId, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!canDelete) {
      setError('Insufficient permissions: requires canDelete');
      return;
    }
    try {
      await apiFetch(`/deviations/${id}`, {
        method: 'DELETE',
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deviation');
    }
  };

  const handleInvestigate = async (devId: string) => {
    if (!canEdit) return;
    try {
      await apiFetch(`/deviations/${devId}/investigate`, {
        method: 'PUT',
        body: JSON.stringify({ method: investigationMethod, notes: investigationNotes }),
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update investigation');
    }
  };

  const handleRootCause = async (devId: string) => {
    if (!canEdit) return;
    try {
      await apiFetch(`/deviations/${devId}/root-cause`, {
        method: 'PUT',
        body: JSON.stringify({ rootCause: rootCauseText }),
      });
      setRootCauseText('');
      setError('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record root cause');
    }
  };

  const handleCreateCapa = async (devId: string) => {
    if (!canEdit) return;
    try {
      await apiFetch(`/deviations/${devId}/create-capa`, {
        method: 'PUT',
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create CAPA');
    }
  };

  const handleExpand = (dev: any) => {
    if (expandedId === dev.id) {
      setExpandedId(null);
    } else {
      setExpandedId(dev.id);
      setInvestigationMethod(dev.investigationMethod || 'fishbone');
      setInvestigationNotes(dev.investigationNotes || '');
      setRootCauseText(dev.rootCause || '');
    }
  };

  if (showForm || editing) {
    return (
      <DeviationForm
        deviation={editing}
        onSaved={() => { setShowForm(false); setEditing(null); fetchData(); }}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  if (showTrending) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowTrending(false)}
          className="text-sm text-accent hover:underline"
        >
          {t('common.back')}
        </button>
        <DeviationTrending />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('deviations.title')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTrending(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Search className="w-4 h-4" />
            {t('deviations.trending')}
          </button>
          {canEdit && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('deviations.create')}
            </button>
          )}
        </div>
      </div>

      {deviations.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>{t('deviations.noItems')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deviations.map((dev) => (
            <div key={dev.id} className="bg-surface rounded-xl border border-border overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
                onClick={() => handleExpand(dev)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-text-tertiary">{dev.deviationNumber}</span>
                  <span className="text-sm font-medium text-text-primary">{dev.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CLASSIFICATION_COLORS[dev.classification] || ''}`}>
                    {dev.classification}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-subtle text-accent">
                    {dev.status.replace(/_/g, ' ')}
                  </span>
                  {dev.area && <span className="text-xs text-text-tertiary">{dev.area}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditing(dev); }}
                      className="p-1 text-text-tertiary hover:text-accent transition-colors"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(dev.id); }}
                      className="p-1 text-text-tertiary hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {expandedId === dev.id && (
                <div className="border-t border-border p-5 space-y-5">
                  {/* Description */}
                  {dev.description && (
                    <div>
                      <span className="text-xs font-medium text-text-secondary">{t('deviations.description')}</span>
                      <p className="text-sm text-text-primary mt-1">{dev.description}</p>
                    </div>
                  )}

                  {/* Investigation panel */}
                  {canEdit && (dev.status === 'detected' || dev.status === 'investigating') && (
                    <div className="bg-surface-secondary rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-text-primary">{t('deviations.investigation')}</h4>
                      <div>
                        <label className="block text-xs text-text-tertiary mb-1">{t('deviations.method')}</label>
                        <select
                          value={investigationMethod}
                          onChange={(e) => setInvestigationMethod(e.target.value)}
                          className="w-full px-2 py-1.5 bg-surface border border-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {INVESTIGATION_METHODS.map((m) => (
                            <option key={m} value={m}>{t(`deviations.method_${m}`)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-text-tertiary mb-1">{t('deviations.investigationNotes')}</label>
                        <textarea
                          value={investigationNotes}
                          onChange={(e) => setInvestigationNotes(e.target.value)}
                          className="w-full px-2 py-1.5 bg-surface border border-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                          rows={3}
                        />
                      </div>
                      <button
                        onClick={() => handleInvestigate(dev.id)}
                        className="text-sm px-3 py-1.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        {dev.status === 'detected' ? t('deviations.startInvestigation') : t('deviations.updateInvestigation')}
                      </button>
                    </div>
                  )}

                  {/* Root cause entry */}
                  {canEdit && dev.status === 'investigating' && (
                    <div className="bg-surface-secondary rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-text-primary">{t('deviations.rootCause')}</h4>
                      <textarea
                        value={rootCauseText}
                        onChange={(e) => setRootCauseText(e.target.value)}
                        className="w-full px-2 py-1.5 bg-surface border border-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        rows={2}
                        placeholder={t('deviations.rootCausePlaceholder')}
                      />
                      <button
                        onClick={() => handleRootCause(dev.id)}
                        className="text-sm px-3 py-1.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        {t('deviations.recordRootCause')}
                      </button>
                    </div>
                  )}

                  {/* Show recorded root cause */}
                  {dev.rootCause && dev.status !== 'investigating' && (
                    <div>
                      <span className="text-xs font-medium text-text-secondary">{t('deviations.rootCause')}</span>
                      <p className="text-sm text-text-primary mt-1">{dev.rootCause}</p>
                    </div>
                  )}

                  {/* Create CAPA button */}
                  {canEdit && dev.status === 'root_cause_identified' && !dev.capaId && (
                    <button
                      onClick={() => handleCreateCapa(dev.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      {t('deviations.createCapa')}
                    </button>
                  )}

                  {/* CAPA link */}
                  {dev.capaId && (
                    <div className="text-sm text-text-secondary">
                      {t('deviations.linkedCapa')}: <span className="text-accent font-mono">{dev.capaId}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
