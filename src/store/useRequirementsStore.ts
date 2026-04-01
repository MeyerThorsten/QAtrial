import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Requirement, RequirementStatus } from '../types';
import { generateId } from '../lib/idGenerator';
import { useTestsStore } from './useTestsStore';
import { useAuditStore } from './useAuditStore';

interface RequirementsState {
  requirements: Requirement[];
  reqCounter: number;
  addRequirement: (data: { title: string; description: string; status: RequirementStatus; tags?: string[]; riskLevel?: Requirement['riskLevel']; regulatoryRef?: string; evidenceHints?: string[] }) => void;
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
          tags: data.tags,
          riskLevel: data.riskLevel,
          regulatoryRef: data.regulatoryRef,
          evidenceHints: data.evidenceHints,
        };
        set({ requirements: [...get().requirements, newReq], reqCounter: reqCounter + 1 });

        // Auto-log audit event
        useAuditStore.getState().log(
          'create', 'requirement', newReq.id,
          undefined, JSON.stringify({ title: newReq.title, status: newReq.status }),
        );
      },

      updateRequirement: (id, data) => {
        const existing = get().requirements.find((r) => r.id === id);
        const previousSnapshot = existing
          ? JSON.stringify({ title: existing.title, status: existing.status, description: existing.description })
          : undefined;

        set({
          requirements: get().requirements.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
        });

        // Auto-log audit event
        const action = data.status && existing && data.status !== existing.status
          ? 'status_change' as const
          : 'update' as const;
        useAuditStore.getState().log(
          action, 'requirement', id,
          previousSnapshot,
          JSON.stringify(data),
        );
      },

      deleteRequirement: (id) => {
        const existing = get().requirements.find((r) => r.id === id);
        useTestsStore.getState().removeRequirementLink(id);
        set({ requirements: get().requirements.filter((r) => r.id !== id) });

        // Auto-log audit event
        useAuditStore.getState().log(
          'delete', 'requirement', id,
          existing ? JSON.stringify({ title: existing.title }) : undefined,
        );
      },

      setRequirements: (reqs, counter) => {
        set({ requirements: reqs, reqCounter: counter });
      },
    }),
    { name: 'qatrial:requirements' }
  )
);
