import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTestsStore } from '../../store/useTestsStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLLMStore } from '../../store/useLLMStore';
import { suggestCAPA } from '../../ai/prompts/capaSuggestion';
import type { CAPAResult } from '../../ai/prompts/capaSuggestion';

type CAPAStatus = 'open' | 'in_progress' | 'resolved';

interface CAPARecord {
  testId: string;
  status: CAPAStatus;
  suggestion?: CAPAResult;
}

export function CAPAFunnel() {
  const { t } = useTranslation();
  const tests = useTestsStore((s) => s.tests);
  const requirements = useRequirementsStore((s) => s.requirements);
  const project = useProjectStore((s) => s.project);
  const hasProvider = useLLMStore((s) => s.hasAnyProvider());

  // Local CAPA tracking state
  const [capaRecords, setCapaRecords] = useState<Record<string, CAPARecord>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  const failedTests = useMemo(
    () => tests.filter((test) => test.status === 'Failed'),
    [tests],
  );

  const summary = useMemo(() => {
    const total = failedTests.length;
    let open = 0;
    let inProgress = 0;
    let resolved = 0;

    for (const test of failedTests) {
      const record = capaRecords[test.id];
      if (!record || record.status === 'open') open++;
      else if (record.status === 'in_progress') inProgress++;
      else if (record.status === 'resolved') resolved++;
    }

    return { total, open, inProgress, resolved };
  }, [failedTests, capaRecords]);

  const getLinkedReq = useCallback(
    (reqIds: string[]) => {
      if (reqIds.length === 0) return null;
      return requirements.find((r) => r.id === reqIds[0]) || null;
    },
    [requirements],
  );

  const handleSuggestCAPA = useCallback(
    async (testId: string) => {
      const test = tests.find((t) => t.id === testId);
      if (!test) return;

      const linkedReq = getLinkedReq(test.linkedRequirementIds);
      setGeneratingFor(testId);
      setExpandedTest(testId);

      try {
        const result = await suggestCAPA({
          failedTest: {
            id: test.id,
            title: test.title,
            description: test.description,
          },
          linkedRequirement: linkedReq
            ? { id: linkedReq.id, title: linkedReq.title, description: linkedReq.description }
            : { id: 'N/A', title: 'No linked requirement', description: '' },
          vertical: project?.vertical,
          country: project?.country || 'US',
        });

        setCapaRecords((prev) => ({
          ...prev,
          [testId]: {
            testId,
            status: 'in_progress',
            suggestion: result,
          },
        }));
      } catch {
        // Silently fail — user can retry
      } finally {
        setGeneratingFor(null);
      }
    },
    [tests, getLinkedReq, project],
  );

  const handleStatusChange = useCallback((testId: string, status: CAPAStatus) => {
    setCapaRecords((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        testId,
        status,
      },
    }));
  }, []);

  const getStatusColor = (status: CAPAStatus): string => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
    }
  };

  const getStatusLabel = (status: CAPAStatus): string => {
    switch (status) {
      case 'open':
        return t('dashboard.capaOpen');
      case 'in_progress':
        return t('dashboard.capaInProgress');
      case 'resolved':
        return t('dashboard.capaResolved');
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            {t('dashboard.capaTotalFailed')}
          </p>
          <p className="text-2xl font-bold text-text-primary">{summary.total}</p>
        </div>
        <div className="bg-surface rounded-xl border border-red-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
            {t('dashboard.capaOpen')}
          </p>
          <p className="text-2xl font-bold text-red-700">{summary.open}</p>
        </div>
        <div className="bg-surface rounded-xl border border-amber-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            {t('dashboard.capaInProgress')}
          </p>
          <p className="text-2xl font-bold text-amber-700">{summary.inProgress}</p>
        </div>
        <div className="bg-surface rounded-xl border border-green-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            {t('dashboard.capaResolved')}
          </p>
          <p className="text-2xl font-bold text-green-700">{summary.resolved}</p>
        </div>
      </div>

      {/* Failed tests list */}
      <div className="bg-surface rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('dashboard.capaFunnel')}
          </h3>
        </div>

        {failedTests.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-text-tertiary">
            {t('dashboard.capaNoFailedTests')}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {failedTests.map((test) => {
              const record = capaRecords[test.id];
              const status: CAPAStatus = record?.status || 'open';
              const linkedReq = getLinkedReq(test.linkedRequirementIds);
              const isExpanded = expandedTest === test.id;
              const isGenerating = generatingFor === test.id;

              return (
                <div key={test.id} className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Status indicator */}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
                    >
                      {getStatusLabel(status)}
                    </span>

                    {/* Test info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-text-tertiary">{test.id}</span>
                        <span className="text-sm font-medium text-text-primary truncate">
                          {test.title}
                        </span>
                      </div>
                      {linkedReq && (
                        <p className="text-xs text-text-tertiary mt-0.5">
                          {t('dashboard.capaLinkedReq')}: {linkedReq.id} - {linkedReq.title}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {hasProvider && (
                        <button
                          onClick={() => handleSuggestCAPA(test.id)}
                          disabled={isGenerating}
                          className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
                        >
                          {isGenerating ? t('ai.generating') : t('dashboard.capaSuggestAI')}
                        </button>
                      )}

                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(test.id, e.target.value as CAPAStatus)}
                        className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary"
                      >
                        <option value="open">{t('dashboard.capaOpen')}</option>
                        <option value="in_progress">{t('dashboard.capaInProgress')}</option>
                        <option value="resolved">{t('dashboard.capaResolved')}</option>
                      </select>

                      {record?.suggestion && (
                        <button
                          onClick={() => setExpandedTest(isExpanded ? null : test.id)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-secondary transition-colors"
                        >
                          {isExpanded ? t('dashboard.capaCollapse') : t('dashboard.capaExpand')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CAPA suggestion panel */}
                  {isExpanded && record?.suggestion && (
                    <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-primary">
                        {t('dashboard.capaSuggestionTitle')}
                      </h4>

                      <div>
                        <p className="text-xs font-semibold text-text-secondary mb-1">
                          {t('dashboard.capaRootCause')}
                        </p>
                        <p className="text-sm text-text-primary">{record.suggestion.rootCause}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-text-secondary mb-1">
                          {t('dashboard.capaContainment')}
                        </p>
                        <p className="text-sm text-text-primary">{record.suggestion.containment}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-text-secondary mb-1">
                          {t('dashboard.capaCorrectiveAction')}
                        </p>
                        <p className="text-sm text-text-primary">
                          {record.suggestion.correctiveAction}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-text-secondary mb-1">
                          {t('dashboard.capaPreventiveAction')}
                        </p>
                        <p className="text-sm text-text-primary">
                          {record.suggestion.preventiveAction}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-text-secondary mb-1">
                          {t('dashboard.capaEffectivenessCheck')}
                        </p>
                        <p className="text-sm text-text-primary">
                          {record.suggestion.effectivenessCheck}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Generating indicator */}
                  {isExpanded && isGenerating && (
                    <div className="mt-4 rounded-lg border border-border bg-surface-secondary p-4 flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-sm text-text-secondary">{t('ai.generating')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
