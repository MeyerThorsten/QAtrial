import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, TrendingDown, TrendingUp, Minus, Building2, RotateCcw,
  GraduationCap, Loader2, RefreshCw, Target,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { getProjectId } from '../../lib/projectUtils';

interface FailureRisk {
  requirementId: string;
  seqId: string;
  title: string;
  riskLevel: string;
  riskScore: number;
  factors: {
    complexity: number;
    riskLevel: number;
    noCoverage: boolean;
    similarityToFailed: number;
  };
}

interface SupplierRisk {
  supplierId: string;
  name: string;
  category: string;
  riskScore: number;
  qualificationStatus: string;
  factors: {
    auditTrend: number;
    defectRate: number;
    overdueAudit: number;
    openActions: number;
  };
}

interface CAPAPattern {
  rootCause: string;
  frequency: number;
  severity: string;
  recentCapas: { id: string; title: string; createdAt: string }[];
}

interface ProcessTrend {
  product: string;
  batchCount: number;
  averageYield: number;
  lastYield: number;
  slopePerBatch: number;
  projectedYield: number;
  trend: 'improving' | 'declining' | 'stable';
  alert: string | null;
}

interface TrainingGaps {
  expiringUsers: {
    userId: string;
    userName: string;
    userRole: string;
    courseName: string;
    validUntil: string | null;
    daysRemaining: number | null;
  }[];
  lowCompletionRoles: {
    role: string;
    completionRate: number;
    totalAssignments: number;
    completed: number;
  }[];
  highFailureCourses: {
    courseId: string;
    courseName: string;
    totalAttempts: number;
    failedAttempts: number;
    failureRate: number;
  }[];
}

type PredictiveTab = 'failure' | 'supplier' | 'capa' | 'process' | 'training';

export function PredictiveView() {
  const { t } = useTranslation();
  ;
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);

  const [activeTab, setActiveTab] = useState<PredictiveTab>('failure');
  const [loading, setLoading] = useState(false);
  const [failureRisks, setFailureRisks] = useState<FailureRisk[]>([]);
  const [supplierRisks, setSupplierRisks] = useState<SupplierRisk[]>([]);
  const [capaPatterns, setCAPAPatterns] = useState<CAPAPattern[]>([]);
  const [processTrends, setProcessTrends] = useState<ProcessTrend[]>([]);
  const [trainingGaps, setTrainingGaps] = useState<TrainingGaps>({ expiringUsers: [], lowCompletionRoles: [], highFailureCourses: [] });

  const fetchData = useCallback(async (tab: PredictiveTab) => {
    if (!projectId) return;
    setLoading(true);
    try {
      switch (tab) {
        case 'failure': {
          const { predictions } = await apiFetch<{ predictions: FailureRisk[] }>(
            `/predictive/${projectId}/failure-risk`
          );
          setFailureRisks(predictions);
          break;
        }
        case 'supplier': {
          const { predictions } = await apiFetch<{ predictions: SupplierRisk[] }>(
            `/predictive/${projectId}/supplier-risk`
          );
          setSupplierRisks(predictions);
          break;
        }
        case 'capa': {
          const { patterns } = await apiFetch<{ patterns: CAPAPattern[] }>(
            `/predictive/${projectId}/capa-recurrence`
          );
          setCAPAPatterns(patterns);
          break;
        }
        case 'process': {
          const { predictions } = await apiFetch<{ predictions: ProcessTrend[] }>(
            `/predictive/${projectId}/process-trend`
          );
          setProcessTrends(predictions);
          break;
        }
        case 'training': {
          const { predictions } = await apiFetch<{ predictions: TrainingGaps }>(
            `/predictive/${projectId}/training-gap`
          );
          setTrainingGaps(predictions);
          break;
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const riskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const riskScoreBg = (score: number) => {
    if (score >= 70) return 'bg-red-100 dark:bg-red-900/30';
    if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-green-100 dark:bg-green-900/30';
  };

  const tabs: { id: PredictiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'failure', label: t('predictive.failureRisk'), icon: <Target className="w-4 h-4" /> },
    { id: 'supplier', label: t('predictive.supplierRisk'), icon: <Building2 className="w-4 h-4" /> },
    { id: 'capa', label: t('predictive.capaRecurrence'), icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'process', label: t('predictive.processStability'), icon: <TrendingDown className="w-4 h-4" /> },
    { id: 'training', label: t('predictive.trainingGaps'), icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => fetchData(activeTab)}
          className="ml-auto p-2 text-text-tertiary hover:text-text-secondary"
          title={t('predictive.refresh')}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-text-tertiary" />
        </div>
      )}

      {/* Failure Risk */}
      {!loading && activeTab === 'failure' && (
        <div className="space-y-3">
          <p className="text-sm text-text-tertiary">{t('predictive.failureRiskDesc')}</p>
          {failureRisks.length === 0 ? (
            <p className="text-sm text-text-tertiary text-center py-8">{t('predictive.noData')}</p>
          ) : (
            <div className="space-y-2">
              {failureRisks.slice(0, 20).map((risk) => (
                <div key={risk.requirementId} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${riskScoreBg(risk.riskScore)} ${riskScoreColor(risk.riskScore)}`}>
                    {risk.riskScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {risk.seqId}: {risk.title}
                    </p>
                    <div className="flex gap-3 text-xs text-text-tertiary mt-0.5">
                      <span>{t('predictive.complexity')}: {risk.factors.complexity}</span>
                      <span>{t('predictive.riskLevel')}: {risk.riskLevel}</span>
                      {risk.factors.noCoverage && (
                        <span className="text-yellow-500">{t('predictive.noTestCoverage')}</span>
                      )}
                      {risk.factors.similarityToFailed > 0 && (
                        <span className="text-red-500">
                          {t('predictive.similarToFailed', { pct: Math.round(risk.factors.similarityToFailed * 100) })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Supplier Risk */}
      {!loading && activeTab === 'supplier' && (
        <div className="space-y-3">
          <p className="text-sm text-text-tertiary">{t('predictive.supplierRiskDesc')}</p>
          {supplierRisks.length === 0 ? (
            <p className="text-sm text-text-tertiary text-center py-8">{t('predictive.noData')}</p>
          ) : (
            <div className="space-y-2">
              {supplierRisks.map((risk) => (
                <div key={risk.supplierId} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${riskScoreBg(risk.riskScore)} ${riskScoreColor(risk.riskScore)}`}>
                    {risk.riskScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{risk.name}</p>
                    <div className="flex gap-3 text-xs text-text-tertiary mt-0.5">
                      <span>{risk.category}</span>
                      <span>{risk.qualificationStatus}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-text-tertiary space-y-0.5">
                    <div>{t('predictive.auditTrend')}: {risk.factors.auditTrend}</div>
                    <div>{t('predictive.defectRate')}: {risk.factors.defectRate}</div>
                    {risk.factors.overdueAudit > 0 && (
                      <div className="text-red-500">{t('predictive.overdueAudit')}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CAPA Recurrence */}
      {!loading && activeTab === 'capa' && (
        <div className="space-y-3">
          <p className="text-sm text-text-tertiary">{t('predictive.capaRecurrenceDesc')}</p>
          {capaPatterns.length === 0 ? (
            <p className="text-sm text-text-tertiary text-center py-8">{t('predictive.noPatterns')}</p>
          ) : (
            <div className="space-y-3">
              {capaPatterns.map((pattern) => (
                <div key={pattern.rootCause} className="p-4 bg-surface border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="w-4 h-4 text-yellow-500" />
                    <h4 className="text-sm font-semibold text-text-primary">{pattern.rootCause}</h4>
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${
                      pattern.severity === 'high'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : pattern.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {pattern.frequency}x {t('predictive.in6Months')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {pattern.recentCapas.slice(0, 5).map((capa) => (
                      <div key={capa.id} className="text-xs text-text-tertiary flex justify-between">
                        <span>{capa.title}</span>
                        <span>{new Date(capa.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Process Stability */}
      {!loading && activeTab === 'process' && (
        <div className="space-y-3">
          <p className="text-sm text-text-tertiary">{t('predictive.processStabilityDesc')}</p>
          {processTrends.length === 0 ? (
            <p className="text-sm text-text-tertiary text-center py-8">{t('predictive.noData')}</p>
          ) : (
            <div className="space-y-2">
              {processTrends.map((item) => (
                <div key={item.product} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg">
                  {item.trend === 'improving' ? (
                    <TrendingUp className="w-5 h-5 text-green-500 shrink-0" />
                  ) : item.trend === 'declining' ? (
                    <TrendingDown className="w-5 h-5 text-red-500 shrink-0" />
                  ) : (
                    <Minus className="w-5 h-5 text-text-tertiary shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{item.product}</p>
                    <div className="flex gap-3 text-xs text-text-tertiary mt-0.5">
                      <span>{item.batchCount} {t('predictive.batches')}</span>
                      <span>{t('predictive.avgYield')}: {item.averageYield}%</span>
                      <span>{t('predictive.lastYield')}: {item.lastYield}%</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className={`font-medium ${
                      item.trend === 'declining' ? 'text-red-500' : item.trend === 'improving' ? 'text-green-500' : 'text-text-tertiary'
                    }`}>
                      {item.slopePerBatch > 0 ? '+' : ''}{item.slopePerBatch}%/{t('predictive.batch')}
                    </div>
                    <div className="text-text-tertiary">
                      {t('predictive.projected')}: {item.projectedYield}%
                    </div>
                    {item.alert && (
                      <div className="text-yellow-500 flex items-center gap-1 justify-end mt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        {item.alert}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Training Gaps */}
      {!loading && activeTab === 'training' && (
        <div className="space-y-6">
          <p className="text-sm text-text-tertiary">{t('predictive.trainingGapsDesc')}</p>

          {/* Expiring Users */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              {t('predictive.expiringCertifications')} ({trainingGaps.expiringUsers.length})
            </h4>
            {trainingGaps.expiringUsers.length === 0 ? (
              <p className="text-xs text-text-tertiary">{t('predictive.noExpiring')}</p>
            ) : (
              <div className="space-y-1">
                {trainingGaps.expiringUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-surface border border-border rounded-lg text-sm">
                    <AlertTriangle className={`w-4 h-4 shrink-0 ${
                      (user.daysRemaining || 999) <= 7 ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <span className="font-medium text-text-primary">{user.userName}</span>
                    <span className="text-text-tertiary">-</span>
                    <span className="text-text-secondary">{user.courseName}</span>
                    <span className="ml-auto text-xs text-text-tertiary">
                      {user.daysRemaining !== null
                        ? t('predictive.daysRemaining', { days: user.daysRemaining })
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low completion roles */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              {t('predictive.lowCompletionRoles')} ({trainingGaps.lowCompletionRoles.length})
            </h4>
            {trainingGaps.lowCompletionRoles.length === 0 ? (
              <p className="text-xs text-text-tertiary">{t('predictive.allRolesCompliant')}</p>
            ) : (
              <div className="space-y-1">
                {trainingGaps.lowCompletionRoles.map((role) => (
                  <div key={role.role} className="flex items-center gap-2 p-2 bg-surface border border-border rounded-lg text-sm">
                    <div className="flex-1">
                      <span className="font-medium text-text-primary capitalize">{role.role.replace('_', ' ')}</span>
                    </div>
                    <div className="text-right text-xs">
                      <div className={`font-medium ${role.completionRate < 50 ? 'text-red-500' : 'text-yellow-500'}`}>
                        {role.completionRate}%
                      </div>
                      <div className="text-text-tertiary">{role.completed}/{role.totalAssignments}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* High failure courses */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              {t('predictive.highFailureCourses')} ({trainingGaps.highFailureCourses.length})
            </h4>
            {trainingGaps.highFailureCourses.length === 0 ? (
              <p className="text-xs text-text-tertiary">{t('predictive.noHighFailure')}</p>
            ) : (
              <div className="space-y-1">
                {trainingGaps.highFailureCourses.map((course) => (
                  <div key={course.courseId} className="flex items-center gap-2 p-2 bg-surface border border-border rounded-lg text-sm">
                    <div className="flex-1">
                      <span className="font-medium text-text-primary">{course.courseName}</span>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-medium text-red-500">{course.failureRate}% {t('predictive.failRate')}</div>
                      <div className="text-text-tertiary">{course.failedAttempts}/{course.totalAttempts} {t('predictive.failed')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
