import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── AI artifact provenance & history ─────────────────────────────────────────

export type AIArtifactType =
  | 'test_generation'
  | 'risk_classification'
  | 'gap_analysis'
  | 'capa_suggestion'
  | 'executive_brief'
  | 'vsr_report';

export interface AIProvenance {
  /** Which LLM provider was used */
  providerId: string;
  /** Model name/ID */
  model: string;
  /** Temperature used */
  temperature: number;
  /** Max tokens requested */
  maxTokens: number;
  /** Tokens actually consumed */
  tokensUsed: { input: number; output: number };
}

export interface AIArtifactRecord {
  id: string;
  /** What type of artifact was generated */
  type: AIArtifactType;
  /** When it was generated */
  generatedAt: string;
  /** Full provenance (who generated, with what model/params) */
  provenance: AIProvenance;
  /** The input context (requirement IDs, project context, etc.) */
  inputContext: Record<string, unknown>;
  /** The raw AI response text (for debugging/audit) */
  rawResponse: string;
  /** The parsed/structured output */
  parsedOutput: unknown;
  /** Whether the AI response was valid JSON / passed schema validation */
  validationPassed: boolean;
  /** Validation errors if any */
  validationErrors?: string[];
  /** Number of retry attempts needed */
  retryCount: number;
  /** Who triggered the generation */
  triggeredBy: string;
  /** Related entity IDs (requirement, test, etc.) */
  relatedEntityIds: string[];
  /** Human review status */
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  /** Whether the artifact was accepted/applied */
  accepted: boolean;
  acceptedAt?: string;
}

// ── Store ────────────────────────────────────────────────────────────────────

interface AIHistoryState {
  artifacts: AIArtifactRecord[];
  addArtifact: (data: Omit<AIArtifactRecord, 'id'>) => AIArtifactRecord;
  markReviewed: (id: string, reviewedBy: string) => void;
  markAccepted: (id: string) => void;
  getByType: (type: AIArtifactType) => AIArtifactRecord[];
  getForEntity: (entityId: string) => AIArtifactRecord[];
  getRerunHistory: (type: AIArtifactType, entityId: string) => AIArtifactRecord[];
  /** Get stats on AI usage */
  getStats: () => {
    totalGenerations: number;
    totalTokens: { input: number; output: number };
    acceptanceRate: number;
    avgRetries: number;
    byType: Record<AIArtifactType, number>;
  };
}

let artifactIdCounter = 0;

export const useAIHistoryStore = create<AIHistoryState>()(
  persist(
    (set, get) => ({
      artifacts: [],

      addArtifact: (data) => {
        artifactIdCounter += 1;
        const id = `ai-${Date.now()}-${artifactIdCounter}`;
        const record: AIArtifactRecord = { id, ...data };
        set((state) => ({ artifacts: [...state.artifacts, record] }));
        return record;
      },

      markReviewed: (id, reviewedBy) => {
        set((state) => ({
          artifacts: state.artifacts.map((a) =>
            a.id === id
              ? { ...a, reviewed: true, reviewedBy, reviewedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      markAccepted: (id) => {
        set((state) => ({
          artifacts: state.artifacts.map((a) =>
            a.id === id
              ? { ...a, accepted: true, acceptedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      getByType: (type) => {
        return get().artifacts.filter((a) => a.type === type);
      },

      getForEntity: (entityId) => {
        return get().artifacts.filter((a) => a.relatedEntityIds.includes(entityId));
      },

      getRerunHistory: (type, entityId) => {
        return get().artifacts
          .filter((a) => a.type === type && a.relatedEntityIds.includes(entityId))
          .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
      },

      getStats: () => {
        const artifacts = get().artifacts;
        const totalTokens = artifacts.reduce(
          (acc, a) => ({
            input: acc.input + a.provenance.tokensUsed.input,
            output: acc.output + a.provenance.tokensUsed.output,
          }),
          { input: 0, output: 0 },
        );

        const accepted = artifacts.filter((a) => a.accepted).length;
        const retries = artifacts.reduce((sum, a) => sum + a.retryCount, 0);

        const byType = {} as Record<AIArtifactType, number>;
        for (const a of artifacts) {
          byType[a.type] = (byType[a.type] || 0) + 1;
        }

        return {
          totalGenerations: artifacts.length,
          totalTokens,
          acceptanceRate: artifacts.length > 0 ? accepted / artifacts.length : 0,
          avgRetries: artifacts.length > 0 ? retries / artifacts.length : 0,
          byType,
        };
      },
    }),
    { name: 'qatrial:ai-history' }
  )
);
