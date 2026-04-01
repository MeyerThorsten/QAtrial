import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuditStore } from './useAuditStore';

// ── Evidence & Attachment types ──────────────────────────────────────────────

export type EvidenceType =
  | 'screenshot'
  | 'log_file'
  | 'test_output'
  | 'configuration'
  | 'approval_record'
  | 'training_record'
  | 'certificate'
  | 'photo'
  | 'document'
  | 'other';

export interface EvidenceAttachment {
  id: string;
  /** Linked requirement or test ID */
  entityId: string;
  entityType: 'requirement' | 'test' | 'capa' | 'risk_assessment';
  /** Human-readable name */
  name: string;
  /** File name (original) */
  fileName: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  sizeBytes: number;
  /** Evidence classification */
  evidenceType: EvidenceType;
  /** Description of what this evidence proves */
  description?: string;
  /**
   * Storage: In client-only mode, we store a base64 data URL.
   * In server mode, this would be a storage path/URL.
   */
  dataUrl?: string;
  /** External URL (for linked evidence not stored locally) */
  externalUrl?: string;
  /** SHA-256 hash of the file for integrity verification */
  hash?: string;
  /** Who uploaded it */
  uploadedBy: string;
  uploadedAt: string;
  /** Review status */
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

// ── Store ────────────────────────────────────────────────────────────────────

interface EvidenceState {
  attachments: EvidenceAttachment[];
  addAttachment: (data: Omit<EvidenceAttachment, 'id' | 'uploadedAt' | 'reviewed'>) => EvidenceAttachment;
  removeAttachment: (id: string) => void;
  markReviewed: (id: string, reviewedBy: string) => void;
  getForEntity: (entityId: string) => EvidenceAttachment[];
  getCompletenessForEntity: (entityId: string, expectedTypes: EvidenceType[]) => {
    complete: boolean;
    present: EvidenceType[];
    missing: EvidenceType[];
    percentage: number;
  };
}

let evidenceIdCounter = 0;

export const useEvidenceStore = create<EvidenceState>()(
  persist(
    (set, get) => ({
      attachments: [],

      addAttachment: (data) => {
        evidenceIdCounter += 1;
        const id = `ev-${Date.now()}-${evidenceIdCounter}`;
        const attachment: EvidenceAttachment = {
          id,
          ...data,
          uploadedAt: new Date().toISOString(),
          reviewed: false,
        };
        set((state) => ({ attachments: [...state.attachments, attachment] }));

        useAuditStore.getState().log(
          'create', 'evidence', id,
          undefined,
          JSON.stringify({ entityId: data.entityId, fileName: data.fileName, evidenceType: data.evidenceType }),
        );

        return attachment;
      },

      removeAttachment: (id) => {
        const existing = get().attachments.find((a) => a.id === id);
        set((state) => ({
          attachments: state.attachments.filter((a) => a.id !== id),
        }));

        if (existing) {
          useAuditStore.getState().log(
            'delete', 'evidence', id,
            JSON.stringify({ entityId: existing.entityId, fileName: existing.fileName }),
          );
        }
      },

      markReviewed: (id, reviewedBy) => {
        set((state) => ({
          attachments: state.attachments.map((a) =>
            a.id === id
              ? { ...a, reviewed: true, reviewedBy, reviewedAt: new Date().toISOString() }
              : a
          ),
        }));

        useAuditStore.getState().log('approve', 'evidence', id, undefined, JSON.stringify({ reviewedBy }));
      },

      getForEntity: (entityId) => {
        return get().attachments.filter((a) => a.entityId === entityId);
      },

      getCompletenessForEntity: (entityId, expectedTypes) => {
        const entityAttachments = get().attachments.filter((a) => a.entityId === entityId);
        const presentTypes = new Set(entityAttachments.map((a) => a.evidenceType));
        const present = expectedTypes.filter((t) => presentTypes.has(t));
        const missing = expectedTypes.filter((t) => !presentTypes.has(t));
        return {
          complete: missing.length === 0,
          present,
          missing,
          percentage: expectedTypes.length > 0 ? Math.round((present.length / expectedTypes.length) * 100) : 100,
        };
      },
    }),
    {
      name: 'qatrial:evidence',
      // Don't persist dataUrl to avoid localStorage bloat — in production, use server storage
      partialize: (state) => ({
        attachments: state.attachments.map((a) => ({
          ...a,
          dataUrl: a.dataUrl && a.dataUrl.length > 100000 ? undefined : a.dataUrl,
        })),
      }),
    }
  )
);
