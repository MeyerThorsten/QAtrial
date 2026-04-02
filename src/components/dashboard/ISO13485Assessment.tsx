import { useMemo, useState } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useLLMStore } from '../../store/useLLMStore';
import { clausesBySection, staticGapAssessment, type ISO13485Clause } from '../../lib/iso13485Clauses';
import { assessQMSRGap } from '../../ai/prompts/qmsrGap';
import { useProjectStore } from '../../store/useProjectStore';

type AssessmentMode = 'static' | 'ai';

interface ClauseResult {
  clause: ISO13485Clause;
  status: 'covered' | 'partial' | 'gap';
  matchedReqIds: string[];
  aiEvidence?: string;
  aiRecommendation?: string;
}

const STATUS_CONFIG = {
  covered: { icon: ShieldCheck, color: 'text-success', bg: 'bg-success-subtle', label: 'Covered' },
  partial: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning-subtle', label: 'Partial' },
  gap: { icon: XCircle, color: 'text-danger', bg: 'bg-danger-subtle', label: 'Gap' },
} as const;

const CRITICALITY_COLORS = {
  critical: 'bg-danger-subtle text-danger',
  high: 'bg-warning-subtle text-warning',
  medium: 'bg-badge-active-bg text-badge-active-text',
  low: 'bg-badge-draft-bg text-badge-draft-text',
};

export function ISO13485Assessment() {
  const requirements = useRequirementsStore((s) => s.requirements);
  const hasProvider = useLLMStore((s) => s.hasAnyProvider());
  const project = useProjectStore((s) => s.project);
  const addRequirement = useRequirementsStore((s) => s.addRequirement);

  const [mode, setMode] = useState<AssessmentMode>('static');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [aiResults, setAiResults] = useState<ClauseResult[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedClauses, setGeneratedClauses] = useState<Set<string>>(new Set());

  // Static assessment — always available, no AI needed
  const staticResults = useMemo<ClauseResult[]>(() => {
    const raw = staticGapAssessment(requirements.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
    })));
    return raw.map((r) => ({ clause: r.clause, status: r.status, matchedReqIds: r.matchedReqIds }));
  }, [requirements]);

  const activeResults = mode === 'ai' && aiResults ? aiResults : staticResults;

  // Summary stats
  const stats = useMemo(() => {
    const covered = activeResults.filter((r) => r.status === 'covered').length;
    const partial = activeResults.filter((r) => r.status === 'partial').length;
    const gap = activeResults.filter((r) => r.status === 'gap').length;
    const total = activeResults.length;
    const readiness = total > 0 ? Math.round(((covered + partial * 0.5) / total) * 100) : 0;
    return { covered, partial, gap, total, readiness };
  }, [activeResults]);

  // Group by section
  const sections = useMemo(() => {
    const sectionMap = clausesBySection();
    return Array.from(sectionMap.entries()).map(([sectionName, clauses]) => {
      const results = clauses.map((c) =>
        activeResults.find((r) => r.clause.clause === c.clause) ?? { clause: c, status: 'gap' as const, matchedReqIds: [] }
      );
      const sectionCovered = results.filter((r) => r.status === 'covered').length;
      const sectionTotal = results.length;
      return { name: sectionName, results, covered: sectionCovered, total: sectionTotal };
    });
  }, [activeResults]);

  const toggleSection = (name: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const expandAll = () => setExpandedSections(new Set(sections.map((s) => s.name)));
  const collapseAll = () => setExpandedSections(new Set());

  // AI assessment
  const runAiAssessment = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const results = await assessQMSRGap({
        requirements: requirements.map((r) => ({ id: r.id, title: r.title, description: r.description })),
        vertical: project?.vertical ?? 'medical_devices',
      });
      // Map AI results back to our clause structure
      const mapped: ClauseResult[] = staticResults.map((sr) => {
        const aiMatch = results.find((r) => r.iso13485Clause === sr.clause.clause);
        if (aiMatch) {
          return {
            ...sr,
            status: aiMatch.status === 'compliant' ? 'covered' : aiMatch.status === 'partial' ? 'partial' : 'gap',
            aiEvidence: aiMatch.evidence,
            aiRecommendation: aiMatch.recommendation,
          };
        }
        return sr;
      });
      setAiResults(mapped);
      setMode('ai');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : String(err));
    } finally {
      setAiLoading(false);
    }
  };

  // Generate requirement from gap
  const handleGenerateReq = (clause: ISO13485Clause, recommendation?: string) => {
    if (generatedClauses.has(clause.clause)) return;
    addRequirement({
      title: `[ISO 13485 §${clause.clause}] ${clause.title}`,
      description: recommendation || clause.description,
      status: 'Draft',
      tags: ['iso-13485', 'qmsr', 'auto-generated'],
      regulatoryRef: `ISO 13485:2016 §${clause.clause}`,
      riskLevel: clause.criticality === 'critical' ? 'critical' : clause.criticality === 'high' ? 'high' : 'medium',
    });
    setGeneratedClauses((prev) => new Set(prev).add(clause.clause));
  };

  const reqMap = useMemo(() => new Map(requirements.map((r) => [r.id, r])), [requirements]);

  return (
    <div className="space-y-6">
      {/* Header with mode toggle and summary */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">ISO 13485:2016 Gap Assessment</h3>
            <p className="text-sm text-text-secondary mt-0.5">
              QMSR (21 CFR 820) compliance — {stats.total} clauses analyzed
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setMode('static')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'static' ? 'bg-accent text-text-inverse' : 'bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Keyword Match
              </button>
              <button
                onClick={() => { if (aiResults) setMode('ai'); else if (hasProvider) runAiAssessment(); }}
                disabled={aiLoading}
                className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                  mode === 'ai' ? 'bg-accent text-text-inverse' : 'bg-surface text-text-secondary hover:bg-surface-hover'
                } ${!hasProvider && !aiResults ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={!hasProvider ? 'Configure an AI provider in Settings first' : ''}
              >
                <Sparkles className="w-3 h-3" />
                {aiLoading ? 'Analyzing...' : 'AI Analysis'}
              </button>
            </div>
          </div>
        </div>

        {aiError && (
          <div className="mb-4 rounded-lg bg-danger-subtle border border-danger/30 p-3 text-sm text-danger">{aiError}</div>
        )}

        {/* Readiness score */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${
              stats.readiness >= 80 ? 'text-success' : stats.readiness >= 50 ? 'text-warning' : 'text-danger'
            }`}>
              {stats.readiness}%
            </span>
            <span className="text-sm text-text-secondary">readiness</span>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success" /> {stats.covered} covered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-warning" /> {stats.partial} partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger" /> {stats.gap} gaps
            </span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-surface-tertiary rounded-full h-3 flex overflow-hidden">
          <div className="bg-success h-3 transition-all" style={{ width: `${(stats.covered / stats.total) * 100}%` }} />
          <div className="bg-warning h-3 transition-all" style={{ width: `${(stats.partial / stats.total) * 100}%` }} />
          <div className="bg-danger h-3 transition-all" style={{ width: `${(stats.gap / stats.total) * 100}%` }} />
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={expandAll} className="text-xs text-text-tertiary hover:text-text-secondary">Expand all</button>
          <span className="text-text-tertiary">·</span>
          <button onClick={collapseAll} className="text-xs text-text-tertiary hover:text-text-secondary">Collapse all</button>
        </div>
      </div>

      {/* Sections accordion */}
      {sections.map((section) => {
        const expanded = expandedSections.has(section.name);
        const sectionPct = section.total > 0 ? Math.round((section.covered / section.total) * 100) : 0;
        return (
          <div key={section.name} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection(section.name)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-hover transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {expanded ? <ChevronDown className="w-4 h-4 text-text-tertiary" /> : <ChevronRight className="w-4 h-4 text-text-tertiary" />}
                <span className="font-semibold text-text-primary">{section.name}</span>
                <span className="text-xs text-text-tertiary">({section.results.length} clauses)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-surface-tertiary rounded-full h-2 overflow-hidden flex">
                  {(() => {
                    const cov = section.results.filter((r) => r.status === 'covered').length;
                    const par = section.results.filter((r) => r.status === 'partial').length;
                    const gap = section.results.filter((r) => r.status === 'gap').length;
                    const t = section.total;
                    return (
                      <>
                        <div className="bg-success h-2" style={{ width: `${(cov / t) * 100}%` }} />
                        <div className="bg-warning h-2" style={{ width: `${(par / t) * 100}%` }} />
                        <div className="bg-danger h-2" style={{ width: `${(gap / t) * 100}%` }} />
                      </>
                    );
                  })()}
                </div>
                <span className="text-xs font-medium text-text-secondary w-8 text-right">{sectionPct}%</span>
              </div>
            </button>

            {expanded && (
              <div className="border-t border-border divide-y divide-border-subtle">
                {section.results.map((result) => {
                  const cfg = STATUS_CONFIG[result.status];
                  const Icon = cfg.icon;
                  const isGenerated = generatedClauses.has(result.clause.clause);
                  return (
                    <div key={result.clause.clause} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-text-tertiary">§{result.clause.clause}</span>
                            <span className="font-medium text-sm text-text-primary">{result.clause.title}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${CRITICALITY_COLORS[result.clause.criticality]}`}>
                              {result.clause.criticality}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-1">{result.clause.description}</p>

                          {/* Matched requirements */}
                          {result.matchedReqIds.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {result.matchedReqIds.map((id) => (
                                <span key={id} className="inline-flex items-center rounded-md bg-accent-subtle px-1.5 py-0.5 text-[10px] font-mono text-accent-text" title={reqMap.get(id)?.title}>
                                  {id}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* AI evidence & recommendation */}
                          {mode === 'ai' && result.aiEvidence && (
                            <div className="mt-2 text-xs text-text-secondary bg-surface-tertiary rounded-lg p-2">
                              <strong>Evidence:</strong> {result.aiEvidence}
                            </div>
                          )}
                          {mode === 'ai' && result.aiRecommendation && (
                            <div className="mt-1 text-xs text-warning bg-warning-subtle rounded-lg p-2">
                              <strong>Recommendation:</strong> {result.aiRecommendation}
                            </div>
                          )}
                        </div>

                        {/* Action button for gaps/partial */}
                        {result.status !== 'covered' && (
                          <button
                            onClick={() => handleGenerateReq(result.clause, result.aiRecommendation)}
                            disabled={isGenerated}
                            className={`shrink-0 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                              isGenerated
                                ? 'bg-success-subtle text-success'
                                : 'bg-surface-tertiary text-text-primary hover:bg-surface-hover border border-border'
                            }`}
                          >
                            {isGenerated ? 'Created' : '+ Req'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
