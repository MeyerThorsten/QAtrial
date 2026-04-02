import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomFieldDefinition } from '../types';
import { useAuditStore } from './useAuditStore';

interface CustomFieldsState {
  definitions: CustomFieldDefinition[];
  values: Record<string, Record<string, unknown>>; // entityId -> fieldId -> value

  addDefinition: (def: CustomFieldDefinition) => void;
  updateDefinition: (id: string, patch: Partial<CustomFieldDefinition>) => void;
  removeDefinition: (id: string) => void;

  setFieldValue: (entityId: string, fieldId: string, value: unknown) => void;
  getFieldValues: (entityId: string) => Record<string, unknown>;
}

export const useCustomFieldsStore = create<CustomFieldsState>()(
  persist(
    (set, get) => ({
      definitions: [],
      values: {},

      addDefinition: (def) => {
        set((state) => ({ definitions: [...state.definitions, def] }));
        useAuditStore.getState().log('create', 'custom_field_definition', def.id, undefined, JSON.stringify({ name: def.name, type: def.type }));
      },

      updateDefinition: (id, patch) => {
        const prev = get().definitions.find((d) => d.id === id);
        set((state) => ({
          definitions: state.definitions.map((d) =>
            d.id === id ? { ...d, ...patch } : d
          ),
        }));
        useAuditStore.getState().log(
          'update',
          'custom_field_definition',
          id,
          prev ? JSON.stringify({ name: prev.name }) : undefined,
          JSON.stringify(patch)
        );
      },

      removeDefinition: (id) => {
        const prev = get().definitions.find((d) => d.id === id);
        set((state) => ({
          definitions: state.definitions.filter((d) => d.id !== id),
        }));
        useAuditStore.getState().log('delete', 'custom_field_definition', id, prev ? JSON.stringify({ name: prev.name }) : undefined);
      },

      setFieldValue: (entityId, fieldId, value) => {
        const prev = get().values[entityId]?.[fieldId];
        set((state) => ({
          values: {
            ...state.values,
            [entityId]: {
              ...state.values[entityId],
              [fieldId]: value,
            },
          },
        }));
        useAuditStore.getState().log(
          'update',
          'custom_field_value',
          `${entityId}:${fieldId}`,
          prev !== undefined ? JSON.stringify(prev) : undefined,
          JSON.stringify(value)
        );
      },

      getFieldValues: (entityId) => {
        return get().values[entityId] ?? {};
      },
    }),
    { name: 'qatrial:custom-fields' }
  )
);
