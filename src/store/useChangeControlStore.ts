import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChangeControlConfig, IndustryVertical } from '../types';

interface ChangeControlState {
  config: ChangeControlConfig;
  setConfig: (config: Partial<ChangeControlConfig>) => void;
  isApprovalRequired: (entityType: string) => boolean;
}

const DEFAULT_CONFIG: ChangeControlConfig = {
  requireApprovalFor: [],
  minimumApprovers: 1,
  requireReason: false,
  requireSignature: false,
  autoRevertOnChange: false,
};

/** Strict verticals that require full change control (pharma, medical devices, biotech). */
const STRICT_VERTICALS: IndustryVertical[] = ['pharma', 'medical_devices', 'biotech'];

/** All entity types that strict verticals require approval for. */
const ALL_ENTITY_TYPES = ['requirement', 'test', 'report', 'risk_assessment', 'document'];

export function getConfigForVertical(vertical?: IndustryVertical): ChangeControlConfig {
  if (vertical && STRICT_VERTICALS.includes(vertical)) {
    return {
      requireApprovalFor: [...ALL_ENTITY_TYPES],
      minimumApprovers: 2,
      requireReason: true,
      requireSignature: true,
      autoRevertOnChange: true,
    };
  }
  return { ...DEFAULT_CONFIG };
}

export const useChangeControlStore = create<ChangeControlState>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_CONFIG },

      setConfig: (partial) => {
        set((state) => ({
          config: { ...state.config, ...partial },
        }));
      },

      isApprovalRequired: (entityType) => {
        return get().config.requireApprovalFor.includes(entityType);
      },
    }),
    { name: 'qatrial:change-control' }
  )
);
