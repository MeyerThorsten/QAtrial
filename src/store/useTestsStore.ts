import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Test, TestStatus } from '../types';
import { generateId } from '../lib/idGenerator';
import { useAuditStore } from './useAuditStore';

interface TestsState {
  tests: Test[];
  testCounter: number;
  addTest: (data: { title: string; description: string; status: TestStatus; linkedRequirementIds: string[] }) => void;
  updateTest: (id: string, data: Partial<Omit<Test, 'id' | 'createdAt'>>) => void;
  deleteTest: (id: string) => void;
  removeRequirementLink: (reqId: string) => void;
  setTests: (tests: Test[], counter: number) => void;
}

export const useTestsStore = create<TestsState>()(
  persist(
    (set, get) => ({
      tests: [],
      testCounter: 1,

      addTest: (data) => {
        const { testCounter } = get();
        const now = new Date().toISOString();
        const newTest: Test = {
          id: generateId('TST', testCounter),
          title: data.title,
          description: data.description,
          status: data.status,
          linkedRequirementIds: data.linkedRequirementIds,
          createdAt: now,
          updatedAt: now,
        };
        set({ tests: [...get().tests, newTest], testCounter: testCounter + 1 });

        // Auto-log audit event
        useAuditStore.getState().log(
          'create', 'test', newTest.id,
          undefined, JSON.stringify({ title: newTest.title, status: newTest.status }),
        );

        // Log link events
        for (const reqId of data.linkedRequirementIds) {
          useAuditStore.getState().log('link', 'test', newTest.id, undefined, reqId);
        }
      },

      updateTest: (id, data) => {
        const existing = get().tests.find((t) => t.id === id);
        const previousSnapshot = existing
          ? JSON.stringify({ title: existing.title, status: existing.status })
          : undefined;

        // Detect link/unlink changes
        if (data.linkedRequirementIds && existing) {
          const prev = new Set(existing.linkedRequirementIds);
          const next = new Set(data.linkedRequirementIds);
          for (const reqId of data.linkedRequirementIds) {
            if (!prev.has(reqId)) {
              useAuditStore.getState().log('link', 'test', id, undefined, reqId);
            }
          }
          for (const reqId of existing.linkedRequirementIds) {
            if (!next.has(reqId)) {
              useAuditStore.getState().log('unlink', 'test', id, reqId, undefined);
            }
          }
        }

        set({
          tests: get().tests.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          ),
        });

        // Auto-log audit event
        const action = data.status && existing && data.status !== existing.status
          ? 'status_change' as const
          : 'update' as const;
        useAuditStore.getState().log(
          action, 'test', id,
          previousSnapshot,
          JSON.stringify(data),
        );
      },

      deleteTest: (id) => {
        const existing = get().tests.find((t) => t.id === id);
        set({ tests: get().tests.filter((t) => t.id !== id) });

        // Auto-log audit event
        useAuditStore.getState().log(
          'delete', 'test', id,
          existing ? JSON.stringify({ title: existing.title }) : undefined,
        );
      },

      removeRequirementLink: (reqId) => {
        const affectedTests = get().tests.filter((t) => t.linkedRequirementIds.includes(reqId));
        set({
          tests: get().tests.map((t) => ({
            ...t,
            linkedRequirementIds: t.linkedRequirementIds.filter((id) => id !== reqId),
          })),
        });

        // Auto-log unlink events
        for (const test of affectedTests) {
          useAuditStore.getState().log('unlink', 'test', test.id, reqId, undefined);
        }
      },

      setTests: (tests, counter) => {
        set({ tests, testCounter: counter });
      },
    }),
    { name: 'qatrial:tests' }
  )
);
