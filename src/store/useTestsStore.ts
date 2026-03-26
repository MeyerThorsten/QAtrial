import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Test, TestStatus } from '../types';
import { generateId } from '../lib/idGenerator';

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
      },

      updateTest: (id, data) => {
        set({
          tests: get().tests.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          ),
        });
      },

      deleteTest: (id) => {
        set({ tests: get().tests.filter((t) => t.id !== id) });
      },

      removeRequirementLink: (reqId) => {
        set({
          tests: get().tests.map((t) => ({
            ...t,
            linkedRequirementIds: t.linkedRequirementIds.filter((id) => id !== reqId),
          })),
        });
      },

      setTests: (tests, counter) => {
        set({ tests, testCounter: counter });
      },
    }),
    { name: 'qatrial:tests' }
  )
);
