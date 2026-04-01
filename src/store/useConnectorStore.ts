import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConnectorConfig, SyncRecord, ConnectorStatus } from '../connectors/types';

interface ConnectorState {
  connectors: ConnectorConfig[];
  syncRecords: SyncRecord[];

  addConnector: (config: ConnectorConfig) => void;
  updateConnector: (id: string, data: Partial<ConnectorConfig>) => void;
  removeConnector: (id: string) => void;
  setStatus: (id: string, status: ConnectorStatus, error?: string) => void;
  addSyncRecord: (record: SyncRecord) => void;
  getSyncRecordsForConnector: (connectorId: string) => SyncRecord[];
  getConnectorById: (id: string) => ConnectorConfig | undefined;
}

export const useConnectorStore = create<ConnectorState>()(
  persist(
    (set, get) => ({
      connectors: [],
      syncRecords: [],

      addConnector: (config) => {
        set((state) => ({ connectors: [...state.connectors, config] }));
      },

      updateConnector: (id, data) => {
        set((state) => ({
          connectors: state.connectors.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      removeConnector: (id) => {
        set((state) => ({
          connectors: state.connectors.filter((c) => c.id !== id),
          syncRecords: state.syncRecords.filter((r) => r.connectorId !== id),
        }));
      },

      setStatus: (id, status, error) => {
        set((state) => ({
          connectors: state.connectors.map((c) =>
            c.id === id ? { ...c, status, error, lastSyncAt: status === 'connected' ? new Date().toISOString() : c.lastSyncAt } : c
          ),
        }));
      },

      addSyncRecord: (record) => {
        set((state) => ({ syncRecords: [...state.syncRecords, record] }));
      },

      getSyncRecordsForConnector: (connectorId) => {
        return get().syncRecords.filter((r) => r.connectorId === connectorId);
      },

      getConnectorById: (id) => {
        return get().connectors.find((c) => c.id === id);
      },
    }),
    {
      name: 'qatrial:connectors',
      // Don't persist sensitive auth data
      partialize: (state) => ({
        connectors: state.connectors.map((c) => ({
          ...c,
          settings: { ...c.settings, apiKey: undefined, token: undefined },
        })),
        syncRecords: state.syncRecords,
      }),
    }
  )
);
