import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIGapAnalysis } from '../types';
import { useAuditStore } from './useAuditStore';

/** A persisted gap analysis run with metadata */
export interface GapAnalysisRun {
  id: string;
  /** ISO timestamp when the analysis was performed */
  analyzedAt: string;
  /** Country context for the analysis */
  country: string;
  /** Vertical context */
  vertical?: string;
  /** Standards analyzed against */
  standards: string[];
  /** Individual gap findings */
  gaps: AIGapAnalysis[];
  /** Overall readiness percentage (0-100) */
  readinessScore: number;
  /** AI provider that generated the analysis */
  providerId: string;
  /** Model used */
  model: string;
  /** Whether this run has been reviewed by a human */
  reviewed: boolean;
  /** Who reviewed it */
  reviewedBy?: string;
  /** ISO timestamp of review */
  reviewedAt?: string;
}

interface GapState {
  runs: GapAnalysisRun[];
  addRun: (data: Omit<GapAnalysisRun, 'id' | 'reviewed'>) => GapAnalysisRun;
  markReviewed: (runId: string, reviewedBy: string) => void;
  deleteRun: (runId: string) => void;
  getLatestRun: () => GapAnalysisRun | undefined;
  /** Get gaps that are missing or partial from the latest run */
  getCriticalGaps: () => AIGapAnalysis[];
}

let gapRunCounter = 0;

export const useGapStore = create<GapState>()(
  persist(
    (set, get) => ({
      runs: [],

      addRun: (data) => {
        gapRunCounter += 1;
        const id = `gap-run-${Date.now()}-${gapRunCounter}`;
        const run: GapAnalysisRun = { id, reviewed: false, ...data };
        set((state) => ({ runs: [...state.runs, run] }));

        useAuditStore.getState().log(
          'create', 'gap_analysis', id,
          undefined,
          JSON.stringify({
            standards: data.standards,
            gapCount: data.gaps.length,
            readinessScore: data.readinessScore,
          }),
        );

        return run;
      },

      markReviewed: (runId, reviewedBy) => {
        set((state) => ({
          runs: state.runs.map((r) =>
            r.id === runId
              ? { ...r, reviewed: true, reviewedBy, reviewedAt: new Date().toISOString() }
              : r
          ),
        }));

        useAuditStore.getState().log(
          'approve', 'gap_analysis', runId,
          undefined, JSON.stringify({ reviewedBy }),
        );
      },

      deleteRun: (runId) => {
        set((state) => ({ runs: state.runs.filter((r) => r.id !== runId) }));
        useAuditStore.getState().log('delete', 'gap_analysis', runId);
      },

      getLatestRun: () => {
        const runs = get().runs;
        if (runs.length === 0) return undefined;
        return runs[runs.length - 1];
      },

      getCriticalGaps: () => {
        const latest = get().getLatestRun();
        if (!latest) return [];
        return latest.gaps.filter((g) => g.status === 'missing' || g.status === 'partial');
      },
    }),
    { name: 'qatrial:gap-analysis' }
  )
);
