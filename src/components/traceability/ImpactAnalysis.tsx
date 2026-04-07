import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, AlertTriangle, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface GraphNode {
  id: string;
  type: string;
  label: string;
  status?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

interface WhatIfSummary {
  totalAffected: number;
  testsCount: number;
  risksCount: number;
  capasCount: number;
  approvalsCount: number;
  evidenceCount: number;
  revalidationNeeded: boolean;
  retestingNeeded: boolean;
}

interface WhatIfResult {
  requirement: { id: string; seqId: string; title: string };
  impact: {
    testsAffected: any[];
    risksAffected: any[];
    capasAffected: any[];
    approvalsAffected: any[];
    evidenceAffected: any[];
    summary: WhatIfSummary;
  };
}

const TYPE_COLORS: Record<string, string> = {
  requirement: 'bg-blue-100 text-blue-700 border-blue-200',
  test: 'bg-green-100 text-green-700 border-green-200',
  risk: 'bg-red-100 text-red-700 border-red-200',
  capa: 'bg-amber-100 text-amber-700 border-amber-200',
  evidence: 'bg-purple-100 text-purple-700 border-purple-200',
  approval: 'bg-teal-100 text-teal-700 border-teal-200',
};

export function ImpactAnalysis() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [entityType, setEntityType] = useState<'requirement' | 'test'>('requirement');
  const [entityId, setEntityId] = useState('');
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [_edges, setEdges] = useState<GraphEdge[]>([]);
  const [whatIf, setWhatIf] = useState<WhatIfResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchImpact = async () => {
    if (!entityId || !token) return;
    setLoading(true);
    setError('');
    setWhatIf(null);
    try {
      const res = await fetch(`${apiBase}/api/impact/${entityType}/${entityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Not found');
        setNodes([]);
        setEdges([]);
        return;
      }
      const data = await res.json();
      setNodes(data.nodes || []);
      setEdges(data.edges || []);

      // Also fetch what-if for requirements
      if (entityType === 'requirement') {
        const whatIfRes = await fetch(`${apiBase}/api/impact/whatif/requirement/${entityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (whatIfRes.ok) {
          setWhatIf(await whatIfRes.json());
        }
      }
    } catch (err) {
      console.error('Impact analysis error:', err);
      setError('Failed to fetch impact data');
    } finally {
      setLoading(false);
    }
  };

  // Group nodes by type
  const groupedNodes: Record<string, GraphNode[]> = {};
  for (const node of nodes) {
    if (!groupedNodes[node.type]) groupedNodes[node.type] = [];
    groupedNodes[node.type].push(node);
  }

  const rootNode = nodes.find((n) => n.id === entityId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitBranch className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-text-primary">{t('impact.title')}</h2>
      </div>

      {/* Search Bar */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">{t('impact.entityType')}</label>
            <select
              className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as 'requirement' | 'test')}
            >
              <option value="requirement">{t('impact.requirement')}</option>
              <option value="test">{t('impact.test')}</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-text-secondary mb-1">{t('impact.entityId')}</label>
            <input
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary"
              placeholder={t('impact.entityIdPlaceholder')}
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchImpact()}
            />
          </div>
          <button
            onClick={fetchImpact}
            disabled={!entityId || loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {t('impact.analyze')}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}

      {/* What-If Summary */}
      {whatIf && (
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">{t('impact.whatIfTitle')}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{whatIf.impact.summary.totalAffected}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">{t('impact.totalAffected')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{whatIf.impact.summary.testsCount}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">{t('impact.testsAffected')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{whatIf.impact.summary.risksCount}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">{t('impact.risksAffected')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{whatIf.impact.summary.capasCount}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">{t('impact.capasAffected')}</p>
            </div>
          </div>
          {(whatIf.impact.summary.revalidationNeeded || whatIf.impact.summary.retestingNeeded) && (
            <div className="mt-3 flex gap-2">
              {whatIf.impact.summary.retestingNeeded && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{t('impact.retestingNeeded')}</span>
              )}
              {whatIf.impact.summary.revalidationNeeded && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{t('impact.revalidationNeeded')}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Impact Tree */}
      {nodes.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">{t('impact.impactChain')}</h3>

          {/* Root node */}
          {rootNode && (
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${TYPE_COLORS[rootNode.type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              <span className="text-xs font-bold uppercase">{rootNode.type}</span>
              <span className="text-sm">{rootNode.label}</span>
              {rootNode.status && (
                <span className="text-xs opacity-75">({rootNode.status})</span>
              )}
            </div>
          )}

          {/* Grouped children */}
          {Object.entries(groupedNodes)
            .filter(([type]) => type !== entityType)
            .map(([type, typeNodes]) => (
              <div key={type} className="ml-6 space-y-2">
                <div className="flex items-center gap-1 text-text-tertiary">
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">{type}s ({typeNodes.length})</span>
                </div>
                <div className="ml-5 space-y-1">
                  {typeNodes.map((node) => (
                    <div
                      key={node.id}
                      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-sm mr-2 mb-1 ${TYPE_COLORS[node.type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                    >
                      <span>{node.label}</span>
                      {node.status && (
                        <span className="text-xs opacity-75">({node.status})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {!loading && nodes.length === 0 && !error && (
        <div className="text-center py-12 text-text-tertiary">
          <GitBranch className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>{t('impact.noData')}</p>
          <p className="text-xs mt-1">{t('impact.noDataDesc')}</p>
        </div>
      )}
    </div>
  );
}

export default ImpactAnalysis;
