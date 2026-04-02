import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DesignControlItem, DesignPhase, DocumentRecord } from '../types';
import { useAuditStore } from './useAuditStore';

const PHASE_ORDER: DesignPhase[] = [
  'user_needs',
  'design_input',
  'design_output',
  'verification',
  'validation',
  'transfer',
  'released',
];

interface DesignControlState {
  designItems: DesignControlItem[];
  documentRecords: DocumentRecord[];

  addDesignItem: (item: DesignControlItem) => void;
  updateDesignItem: (id: string, patch: Partial<DesignControlItem>) => void;
  deleteDesignItem: (id: string) => void;

  addDocumentRecord: (record: DocumentRecord) => void;
  updateDocumentRecord: (id: string, patch: Partial<DocumentRecord>) => void;
  deleteDocumentRecord: (id: string) => void;

  getItemsByPhase: (phase: DesignPhase) => DesignControlItem[];
  getItemsForProject: (projectId: string) => DesignControlItem[];
  advancePhase: (itemId: string) => boolean;
}

let idCounter = 0;

function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export const useDesignControlStore = create<DesignControlState>()(
  persist(
    (set, get) => ({
      designItems: [],
      documentRecords: [],

      addDesignItem: (item) => {
        set((state) => ({ designItems: [...state.designItems, item] }));
        useAuditStore.getState().log('create', 'design_item', item.id, undefined, JSON.stringify({ title: item.title, phase: item.phase }));
      },

      updateDesignItem: (id, patch) => {
        const prev = get().designItems.find((i) => i.id === id);
        set((state) => ({
          designItems: state.designItems.map((i) =>
            i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
          ),
        }));
        useAuditStore.getState().log(
          'update',
          'design_item',
          id,
          prev ? JSON.stringify({ title: prev.title, status: prev.status, phase: prev.phase }) : undefined,
          JSON.stringify(patch)
        );
      },

      deleteDesignItem: (id) => {
        const prev = get().designItems.find((i) => i.id === id);
        set((state) => ({
          designItems: state.designItems.filter((i) => i.id !== id),
        }));
        useAuditStore.getState().log('delete', 'design_item', id, prev ? JSON.stringify({ title: prev.title }) : undefined);
      },

      addDocumentRecord: (record) => {
        set((state) => ({ documentRecords: [...state.documentRecords, record] }));
        useAuditStore.getState().log('create', 'document_record', record.id, undefined, JSON.stringify({ title: record.title, type: record.type }));
      },

      updateDocumentRecord: (id, patch) => {
        const prev = get().documentRecords.find((r) => r.id === id);
        set((state) => ({
          documentRecords: state.documentRecords.map((r) =>
            r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
          ),
        }));
        useAuditStore.getState().log(
          'update',
          'document_record',
          id,
          prev ? JSON.stringify({ title: prev.title, status: prev.status }) : undefined,
          JSON.stringify(patch)
        );
      },

      deleteDocumentRecord: (id) => {
        const prev = get().documentRecords.find((r) => r.id === id);
        set((state) => ({
          documentRecords: state.documentRecords.filter((r) => r.id !== id),
        }));
        useAuditStore.getState().log('delete', 'document_record', id, prev ? JSON.stringify({ title: prev.title }) : undefined);
      },

      getItemsByPhase: (phase) => {
        return get().designItems.filter((i) => i.phase === phase);
      },

      getItemsForProject: (projectId) => {
        return get().designItems.filter((i) => i.projectId === projectId);
      },

      advancePhase: (itemId) => {
        const item = get().designItems.find((i) => i.id === itemId);
        if (!item || item.status !== 'approved') return false;

        const currentIndex = PHASE_ORDER.indexOf(item.phase);
        if (currentIndex < 0 || currentIndex >= PHASE_ORDER.length - 1) return false;

        const nextPhase = PHASE_ORDER[currentIndex + 1];
        const previousPhase = item.phase;

        set((state) => ({
          designItems: state.designItems.map((i) =>
            i.id === itemId
              ? { ...i, phase: nextPhase, status: 'draft' as const, updatedAt: new Date().toISOString() }
              : i
          ),
        }));

        useAuditStore.getState().log(
          'status_change',
          'design_item',
          itemId,
          previousPhase,
          nextPhase,
          `Phase advanced from ${previousPhase} to ${nextPhase}`
        );

        return true;
      },
    }),
    { name: 'qatrial:design-control' }
  )
);

export { PHASE_ORDER, generateId };
