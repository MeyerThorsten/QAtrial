import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuditStore } from './useAuditStore';

// ── CAPA types ───────────────────────────────────────────────────────────────

export type CAPAStatus = 'open' | 'investigation' | 'in_progress' | 'verification' | 'resolved' | 'closed';

export interface CAPASuggestion {
  rootCause: string;
  containment: string;
  correctiveAction: string;
  preventiveAction: string;
  effectivenessCheck: string;
}

export interface CAPARecord {
  id: string;
  /** The failed test that triggered this CAPA */
  testId: string;
  /** Linked requirement IDs */
  linkedRequirementIds: string[];
  /** Current lifecycle status */
  status: CAPAStatus;
  /** AI-generated suggestion (if any) */
  suggestion?: CAPASuggestion;
  /** Human-entered root cause (may differ from AI suggestion) */
  rootCause?: string;
  /** Human-entered corrective action */
  correctiveAction?: string;
  /** Human-entered preventive action */
  preventiveAction?: string;
  /** Assigned owner */
  ownerId?: string;
  ownerName?: string;
  /** Due date for resolution */
  dueDate?: string;
  /** Priority */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** AI provenance */
  aiProviderId?: string;
  aiModel?: string;
  aiGeneratedAt?: string;
  /** Review status */
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  /** Timestamps */
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

// ── Store ────────────────────────────────────────────────────────────────────

interface CAPAState {
  records: CAPARecord[];
  addRecord: (data: {
    testId: string;
    linkedRequirementIds: string[];
    priority: CAPARecord['priority'];
    suggestion?: CAPASuggestion;
    aiProviderId?: string;
    aiModel?: string;
  }) => CAPARecord;
  updateRecord: (id: string, data: Partial<Omit<CAPARecord, 'id' | 'createdAt'>>) => void;
  updateStatus: (id: string, status: CAPAStatus) => void;
  deleteRecord: (id: string) => void;
  getForTest: (testId: string) => CAPARecord | undefined;
  getByStatus: (status: CAPAStatus) => CAPARecord[];
  getSummary: () => { total: number; open: number; inProgress: number; resolved: number; closed: number };
}

let capaIdCounter = 0;

export const useCAPAStore = create<CAPAState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (data) => {
        capaIdCounter += 1;
        const id = `capa-${Date.now()}-${capaIdCounter}`;
        const now = new Date().toISOString();
        const record: CAPARecord = {
          id,
          testId: data.testId,
          linkedRequirementIds: data.linkedRequirementIds,
          status: 'open',
          suggestion: data.suggestion,
          priority: data.priority,
          aiProviderId: data.aiProviderId,
          aiModel: data.aiModel,
          aiGeneratedAt: data.suggestion ? now : undefined,
          reviewed: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ records: [...state.records, record] }));

        useAuditStore.getState().log(
          'create', 'capa', id,
          undefined,
          JSON.stringify({ testId: data.testId, priority: data.priority }),
        );

        return record;
      },

      updateRecord: (id, data) => {
        const existing = get().records.find((r) => r.id === id);
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
        }));

        useAuditStore.getState().log(
          'update', 'capa', id,
          existing ? JSON.stringify({ status: existing.status }) : undefined,
          JSON.stringify(data),
        );
      },

      updateStatus: (id, status) => {
        const existing = get().records.find((r) => r.id === id);
        const now = new Date().toISOString();
        const extra: Partial<CAPARecord> = { status, updatedAt: now };
        if (status === 'resolved') extra.resolvedAt = now;
        if (status === 'closed') extra.closedAt = now;

        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...extra } : r
          ),
        }));

        useAuditStore.getState().log(
          'status_change', 'capa', id,
          existing?.status,
          status,
        );
      },

      deleteRecord: (id) => {
        set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
        useAuditStore.getState().log('delete', 'capa', id);
      },

      getForTest: (testId) => {
        return get().records.find((r) => r.testId === testId);
      },

      getByStatus: (status) => {
        return get().records.filter((r) => r.status === status);
      },

      getSummary: () => {
        const records = get().records;
        return {
          total: records.length,
          open: records.filter((r) => r.status === 'open' || r.status === 'investigation').length,
          inProgress: records.filter((r) => r.status === 'in_progress' || r.status === 'verification').length,
          resolved: records.filter((r) => r.status === 'resolved').length,
          closed: records.filter((r) => r.status === 'closed').length,
        };
      },
    }),
    { name: 'qatrial:capa' }
  )
);
