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

/**
 * Lazy reference to auth store to avoid circular dependency.
 * Set by useAuthStore on module init via setAuthStoreRef().
 */
let authStoreRef: (() => { id: string; name: string } | null) | null = null;

/** Called by useAuthStore to inject itself, breaking circular deps. */
export function setAuthStoreRef(getter: () => { id: string; name: string } | null): void {
  authStoreRef = getter;
}

function getCurrentUser(): { id: string; name: string } {
  if (authStoreRef) {
    const user = authStoreRef();
    if (user) return user;
  }
  return { id: 'system', name: 'System' };
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      entries: [],

      log: (action, entityType, entityId, previousValue?, newValue?, reason?) => {
        const user = getCurrentUser();
        const entry: AuditEntry = {
          id: generateAuditId(),
          timestamp: new Date().toISOString(),
          userId: user.id,
          userName: user.name,
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
