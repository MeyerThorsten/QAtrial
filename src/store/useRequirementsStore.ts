import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Requirement, RequirementStatus } from '../types';
import { generateId } from '../lib/idGenerator';
import { useTestsStore } from './useTestsStore';

interface RequirementsState {
  requirements: Requirement[];
  reqCounter: number;
  addRequirement: (data: { title: string; description: string; status: RequirementStatus }) => void;
  updateRequirement: (id: string, data: Partial<Omit<Requirement, 'id' | 'createdAt'>>) => void;
  deleteRequirement: (id: string) => void;
  setRequirements: (reqs: Requirement[], counter: number) => void;
}

export const useRequirementsStore = create<RequirementsState>()(
  persist(
    (set, get) => ({
      requirements: [],
      reqCounter: 1,

      addRequirement: (data) => {
        const { reqCounter } = get();
        const now = new Date().toISOString();
        const newReq: Requirement = {
          id: generateId('REQ', reqCounter),
          title: data.title,
          description: data.description,
          status: data.status,
          createdAt: now,
          updatedAt: now,
        };
        set({ requirements: [...get().requirements, newReq], reqCounter: reqCounter + 1 });
      },

      updateRequirement: (id, data) => {
        set({
          requirements: get().requirements.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
        });
      },

      deleteRequirement: (id) => {
        useTestsStore.getState().removeRequirementLink(id);
        set({ requirements: get().requirements.filter((r) => r.id !== id) });
      },

      setRequirements: (reqs, counter) => {
        set({ requirements: reqs, reqCounter: counter });
      },
    }),
    { name: 'qatrial:requirements' }
  )
);
