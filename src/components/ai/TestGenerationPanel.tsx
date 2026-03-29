'use no memo';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, Check, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLLMStore } from '../../store/useLLMStore';
import { generateTestCases, type TestGenContext } from '../../ai/prompts/generateTests';
import type { AIGeneratedTestCase } from '../../types';

interface Props {
  requirementId: string;
  onClose: () => void;
}

function confidenceColor(c: number): string {
  if (c >= 0.9) return 'text-success';
  if (c >= 0.7) return 'text-warning';
  return 'text-danger';
}

function confidenceBg(c: number): string {
  if (c >= 0.9) return 'bg-success/10';
  if (c >= 0.7) return 'bg-warning/10';
  return 'bg-danger/10';
}

export function TestGenerationPanel({ requirementId, onClose }: Props) {
  const { t } = useTranslation();
  const requirement = useRequirementsStore((s) =>
    s.requirements.find((r) => r.id === requirementId),
  );
  const tests = useTestsStore((s) => s.tests);
  const addTest = useTestsStore((s) => s.addTest);
  const project = useProjectStore((s) => s.project);
  const hasProvider = useLLMStore((s) => s.hasAnyProvider());

  const [generatedTests, setGeneratedTests] = useState<AIGeneratedTestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!requirement) return;

    setLoading(true);
    setError(null);

    try {
      const existingLinked = tests
        .filter((t) => t.linkedRequirementIds.includes(requirementId))
        .map((t) => ({ title: t.title }));

      const ctx: TestGenContext = {
        requirement: {
          id: requirement.id,
          title: requirement.title,
          description: requirement.description,
        },
        country: project?.country ?? 'US',
        vertical: project?.vertical,
        applicableStandards: requirement.evidenceHints ?? [],
        existingTests: existingLinked,
        riskLevel: requirement.riskLevel,
        projectType: project?.type,
      };

      const results = await generateTestCases(ctx);
      setGeneratedTests(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [requirement, tests, requirementId, project]);

  useEffect(() => {
    if (hasProvider && requirement) {
      generate();
    }
  }, [hasProvider, requirement, generate]);

  function acceptTest(index: number) {
    const tc = generatedTests[index];
    addTest({
      title: tc.title,
      description: `${tc.description}\n\nSteps:\n${tc.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nExpected: ${tc.expectedResult}${tc.standard ? `\nStandard: ${tc.standard}` : ''}`,
      status: 'Not Run',
      linkedRequirementIds: [requirementId],
    });
    setGeneratedTests((prev) =>
      prev.map((item, i) => (i === index ? { ...item, accepted: true } : item)),
    );
  }

  function rejectTest(index: number) {
    setGeneratedTests((prev) => prev.filter((_, i) => i !== index));
  }

  function acceptAll() {
    generatedTests
      .filter((tc) => !tc.accepted)
      .forEach((_, i) => {
        const realIndex = generatedTests.findIndex(
          (tc, idx) => idx >= i && !tc.accepted,
        );
        if (realIndex >= 0) acceptTest(realIndex);
      });
  }

  function acceptHighConfidence() {
    generatedTests.forEach((tc, i) => {
      if (!tc.accepted && tc.confidence >= 0.9) {
        acceptTest(i);
      }
    });
  }

  const pendingTests = generatedTests.filter((tc) => !tc.accepted);
  const highConfidenceCount = pendingTests.filter((tc) => tc.confidence >= 0.9).length;

  if (!requirement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
      onClick={onClose}
    >
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-border max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {t('ai.generatedTests', { reqId: requirementId })}
            </h3>
            <p className="text-xs text-text-tertiary mt-0.5">{requirement.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!hasProvider ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-warning mb-3" />
              <p className="text-sm text-text-secondary">{t('ai.noProvider')}</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
              <p className="text-sm text-text-secondary">{t('ai.generating')}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-danger mb-3" />
              <p className="text-sm text-danger">{error}</p>
              <button
                onClick={generate}
                className="mt-3 px-4 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent-subtle/80 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : generatedTests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-text-secondary">No test cases generated.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedTests.map((tc, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${
                    tc.accepted
                      ? 'border-success/30 bg-success/5 opacity-60'
                      : 'border-border bg-surface'
                  }`}
                >
                  {/* Confidence + Title */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${confidenceColor(tc.confidence)} ${confidenceBg(tc.confidence)}`}
                      >
                        {Math.round(tc.confidence * 100)}%
                      </span>
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {tc.title}
                      </h4>
                    </div>
                    {tc.accepted && (
                      <span className="text-xs text-success font-medium shrink-0">
                        {t('ai.accept')}ed
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-secondary mb-2">{tc.description}</p>

                  {/* Steps */}
                  <div className="mb-2">
                    <p className="text-xs font-medium text-text-tertiary mb-1">Steps:</p>
                    <ol className="list-decimal list-inside text-xs text-text-secondary space-y-0.5">
                      {tc.steps.map((step, si) => (
                        <li key={si}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Expected result */}
                  <div className="mb-2">
                    <p className="text-xs font-medium text-text-tertiary">
                      Expected Result:
                    </p>
                    <p className="text-xs text-text-secondary">{tc.expectedResult}</p>
                  </div>

                  {/* Standard reference */}
                  {tc.standard && (
                    <p className="text-xs text-accent font-mono mb-2">{tc.standard}</p>
                  )}

                  {/* Action buttons */}
                  {!tc.accepted && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle">
                      <button
                        onClick={() => acceptTest(index)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-success bg-success/10 rounded-lg hover:bg-success/20 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        {t('ai.accept')}
                      </button>
                      <button
                        onClick={() => openEditInline(index)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => rejectTest(index)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-danger bg-danger/10 rounded-lg hover:bg-danger/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        {t('ai.reject')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {generatedTests.length > 0 && !loading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
            >
              {t('common.cancel')}
            </button>
            <div className="flex items-center gap-2">
              {highConfidenceCount > 0 && (
                <button
                  onClick={acceptHighConfidence}
                  className="px-4 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent-subtle/80 transition-colors font-medium"
                >
                  {t('ai.acceptHighConfidence', { count: highConfidenceCount })}
                </button>
              )}
              {pendingTests.length > 0 && (
                <button
                  onClick={acceptAll}
                  className="px-4 py-1.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium"
                >
                  {t('ai.acceptAll', { count: pendingTests.length })}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Placeholder for edit-in-place (opens the test content for inline modification)
function openEditInline(_index: number) {
  // Future: inline edit mode for the test case before accepting
  // For now, accept and edit in the test table after
}
