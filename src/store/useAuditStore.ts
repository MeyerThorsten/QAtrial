import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuditAction, AuditEntry } from '../types';

interface AuditState {
  entries: AuditEntry[];
  log: (
    action: AuditAction,
    entityType: string,
    entityId: string,
    previousValue?: string,
    newValue?: string,
    reason?: string
  ) => void;
  getEntriesForEntity: (entityId: string) => AuditEntry[];
  getEntriesByDateRange: (from: Date, to: Date) => AuditEntry[];
  clearEntries: () => void;
}

let auditIdCounter = 0;

function generateAuditId(): string {
  auditIdCounter += 1;
  return `audit-${Date.now()}-${auditIdCounter}`;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      entries: [],

      log: (action, entityType, entityId, previousValue?, newValue?, reason?) => {
        const entry: AuditEntry = {
          id: generateAuditId(),
          timestamp: new Date().toISOString(),
          userId: 'current-user',
          userName: 'Current User',
          action,
          entityType,
          entityId,
          previousValue,
          newValue,
          reason,
        };
        set((state) => ({ entries: [...state.entries, entry] }));
      },

      getEntriesForEntity: (entityId) => {
        return get().entries.filter((e) => e.entityId === entityId);
      },

      getEntriesByDateRange: (from, to) => {
        const fromMs = from.getTime();
        const toMs = to.getTime();
        return get().entries.filter((e) => {
          const ts = new Date(e.timestamp).getTime();
          return ts >= fromMs && ts <= toMs;
        });
      },

      clearEntries: () => set({ entries: [] }),
    }),
    { name: 'qatrial:audit' }
  )
);
