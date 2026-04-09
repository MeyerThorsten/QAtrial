import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical, Plus, AlertTriangle, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';
import { getProjectId } from '../../lib/projectUtils';

interface BatchStep {
  id: string;
  stepNumber: number;
  instruction: string;
  expectedValue: string | null;
  actualValue: string | null;
  unit: string | null;
  inSpec: boolean | null;
  deviation: boolean;
  deviationNote: string | null;
  performedBy: string | null;
  performedAt: string | null;
}

interface BatchRecord {
  id: string;
  productName: string;
  batchNumber: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  yieldActual: number | null;
  yieldExpected: number | null;
  releasedBy: string | null;
  releasedAt: string | null;
  steps?: BatchStep[];
}

export function BatchRecordForm() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token, user } = useAuth();
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedBatch, setExpandedBatch] = useState<BatchRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [releasePassword, setReleasePassword] = useState('');
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // New batch form state
  const [newBatch, setNewBatch] = useState({
    productName: '', batchNumber: '', startDate: '', yieldExpected: '',
  });
  // New step form
  const [newStep, setNewStep] = useState({ instruction: '', expectedValue: '', unit: '' });
  const projectId = getProjectId(project);
  const canEdit = roleHasPermission(user?.role, 'canEdit');
  const canApprove = roleHasPermission(user?.role, 'canApprove');

  const fetchBatches = async () => {
    if (!projectId || !token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ batches: BatchRecord[] }>(`/batches?projectId=${projectId}`);
      setBatches(data.batches || []);
    } catch (err) {
      console.error('Failed to fetch batches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchDetail = async (id: string) => {
    if (!token) return;
    try {
      const data = await apiFetch<{ batch: BatchRecord }>(`/batches/${id}`);
      setExpandedBatch(data.batch);
    } catch (err) {
      console.error('Failed to fetch batch detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch batch detail');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [projectId, token]);

  const handleCreateBatch = async () => {
    if (!projectId || !token || !newBatch.productName || !newBatch.batchNumber) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch('/batches', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          ...newBatch,
          yieldExpected: newBatch.yieldExpected ? parseFloat(newBatch.yieldExpected) : null,
        }),
      });
      setShowCreateForm(false);
      setNewBatch({ productName: '', batchNumber: '', startDate: '', yieldExpected: '' });
      setError('');
      fetchBatches();
    } catch (err) {
      console.error('Failed to create batch:', err);
      setError(err instanceof Error ? err.message : 'Failed to create batch');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (!token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch(`/batches/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setError('');
      fetchBatches();
      if (expandedId === id) {
        fetchBatchDetail(id);
      }
    } catch (err) {
      console.error('Failed to update batch status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update batch status');
    }
  };

  const handleRelease = async (id: string) => {
    if (!token || !releasePassword) return;
    if (!canApprove) {
      setError('Insufficient permissions: requires canApprove');
      return;
    }
    try {
      await apiFetch(`/batches/${id}/release`, {
        method: 'PUT',
        body: JSON.stringify({ password: releasePassword }),
      });
      setReleasingId(null);
      setReleasePassword('');
      setError('');
      fetchBatches();
      if (expandedId === id) {
        fetchBatchDetail(id);
      }
    } catch (err) {
      console.error('Failed to release batch:', err);
      setError(err instanceof Error ? err.message : 'Release failed');
    }
  };

  const handleAddStep = async (batchId: string) => {
    if (!token || !newStep.instruction) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch(`/batches/${batchId}/steps`, {
        method: 'POST',
        body: JSON.stringify(newStep),
      });
      setNewStep({ instruction: '', expectedValue: '', unit: '' });
      setError('');
      fetchBatchDetail(batchId);
    } catch (err) {
      console.error('Failed to add step:', err);
      setError(err instanceof Error ? err.message : 'Failed to add step');
    }
  };

  const handleUpdateStep = async (batchId: string, stepId: string, data: any) => {
    if (!token) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch(`/batches/${batchId}/steps/${stepId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      setError('');
      fetchBatchDetail(batchId);
    } catch (err) {
      console.error('Failed to update step:', err);
      setError(err instanceof Error ? err.message : 'Failed to update step');
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    review: 'bg-purple-100 text-purple-700',
    released: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedBatch(null);
    } else {
      setExpandedId(id);
      fetchBatchDetail(id);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('batches.title')}</h2>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('batches.createBatch')}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">{t('batches.createBatch')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder={t('batches.productNamePlaceholder')}
              value={newBatch.productName}
              onChange={(e) => setNewBatch({ ...newBatch, productName: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <input
              type="text"
              placeholder={t('batches.batchNumberPlaceholder')}
              value={newBatch.batchNumber}
              onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <input
              type="date"
              value={newBatch.startDate}
              onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <input
              type="number"
              placeholder={t('batches.yieldExpectedPlaceholder')}
              value={newBatch.yieldExpected}
              onChange={(e) => setNewBatch({ ...newBatch, yieldExpected: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreateBatch} className="px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90">
              {t('common.save')}
            </button>
            <button onClick={() => setShowCreateForm(false)} className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Batch List */}
      {batches.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <FlaskConical className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
          <p className="text-text-tertiary">{t('batches.noBatches')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-surface rounded-xl border border-border overflow-hidden">
              {/* Batch Header */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-hover transition-colors"
                onClick={() => toggleExpand(batch.id)}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{batch.productName}</h3>
                    <p className="text-xs text-text-tertiary">{t('batches.batchNum')}: {batch.batchNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[batch.status]}`}>
                    {t(`batches.status_${batch.status}`)}
                  </span>
                  {batch.yieldExpected && batch.yieldActual && (
                    <span className="text-xs text-text-secondary">
                      {t('batches.yield')}: {batch.yieldActual}/{batch.yieldExpected}
                    </span>
                  )}
                  {/* Status action buttons */}
                  {canEdit && batch.status === 'draft' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(batch.id, 'in_progress'); }}
                      className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      {t('batches.start')}
                    </button>
                  )}
                  {canEdit && batch.status === 'in_progress' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(batch.id, 'review'); }}
                      className="px-2 py-1 text-xs font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600"
                    >
                      {t('batches.submitForReview')}
                    </button>
                  )}
                  {canApprove && batch.status === 'review' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setReleasingId(batch.id); }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
                    >
                      <Lock className="w-3 h-3" />
                      {t('batches.release')}
                    </button>
                  )}
                  {expandedId === batch.id ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                </div>
              </div>

              {/* Release Password Dialog */}
              {canApprove && releasingId === batch.id && (
                <div className="px-4 py-3 border-t border-border bg-green-50">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{t('batches.releaseSignature')}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="password"
                      placeholder={t('signature.password')}
                      value={releasePassword}
                      onChange={(e) => setReleasePassword(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-green-300 bg-white text-text-primary text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                    <button
                      onClick={() => handleRelease(batch.id)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      {t('batches.confirmRelease')}
                    </button>
                    <button
                      onClick={() => { setReleasingId(null); setReleasePassword(''); }}
                      className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-white border border-border rounded-lg"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}

              {/* Expanded: Steps */}
              {expandedId === batch.id && expandedBatch && (
                <div className="border-t border-border px-4 py-3 space-y-3">
                  <h4 className="text-sm font-semibold text-text-primary">{t('batches.steps')}</h4>

                  {expandedBatch.steps && expandedBatch.steps.length > 0 ? (
                    <div className="space-y-2">
                      {expandedBatch.steps.map((step) => (
                        <div key={step.id} className={`rounded-lg border p-3 text-sm ${step.deviation ? 'border-red-300 bg-red-50' : 'border-border bg-surface-secondary'}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium text-text-primary">#{step.stepNumber}</span>
                              <span className="ml-2 text-text-secondary">{step.instruction}</span>
                            </div>
                            {step.deviation && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <AlertTriangle className="w-3 h-3" />
                                {t('batches.deviation')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                            {step.expectedValue && <span>{t('batches.expected')}: {step.expectedValue} {step.unit || ''}</span>}
                            {step.actualValue && <span>{t('batches.actual')}: {step.actualValue} {step.unit || ''}</span>}
                            {step.inSpec !== null && (
                              <span className={step.inSpec ? 'text-green-600' : 'text-red-600'}>
                                {step.inSpec ? t('batches.inSpec') : t('batches.outOfSpec')}
                              </span>
                            )}
                          </div>
                          {/* Inline edit for actual value when batch is in_progress */}
                          {canEdit && batch.status === 'in_progress' && !step.actualValue && (
                            <div className="flex gap-2 mt-2">
                              <input
                                type="text"
                                placeholder={t('batches.enterActualValue')}
                                className="px-2 py-1 text-xs rounded-lg border border-border bg-surface text-text-primary flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value;
                                    handleUpdateStep(batch.id, step.id, { actualValue: val, inSpec: true });
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-tertiary">{t('batches.noSteps')}</p>
                  )}

                  {/* Add Step */}
                  {canEdit && (batch.status === 'draft' || batch.status === 'in_progress') && (
                    <div className="bg-surface-secondary rounded-lg p-3 space-y-2">
                      <h5 className="text-xs font-semibold text-text-secondary">{t('batches.addStep')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder={t('batches.instructionPlaceholder')}
                          value={newStep.instruction}
                          onChange={(e) => setNewStep({ ...newStep, instruction: e.target.value })}
                          className="px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 md:col-span-2"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={t('batches.expectedValuePlaceholder')}
                            value={newStep.expectedValue}
                            onChange={(e) => setNewStep({ ...newStep, expectedValue: e.target.value })}
                            className="px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs flex-1 focus:outline-none focus:ring-2 focus:ring-accent/50"
                          />
                          <input
                            type="text"
                            placeholder={t('batches.unitPlaceholder')}
                            value={newStep.unit}
                            onChange={(e) => setNewStep({ ...newStep, unit: e.target.value })}
                            className="px-2 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs w-16 focus:outline-none focus:ring-2 focus:ring-accent/50"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddStep(batch.id)}
                        className="px-2 py-1 text-xs font-medium text-white bg-accent rounded-lg hover:bg-accent/90"
                      >
                        {t('batches.addStep')}
                      </button>
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
