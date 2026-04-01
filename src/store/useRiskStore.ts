import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RiskAssessment, Severity, Likelihood, RiskLevel } from '../types';
import { useAuditStore } from './useAuditStore';

interface RiskState {
  assessments: RiskAssessment[];
  addAssessment: (data: Omit<RiskAssessment, 'id'>) => RiskAssessment;
  updateAssessment: (id: string, data: Partial<Omit<RiskAssessment, 'id'>>) => void;
  deleteAssessment: (id: string) => void;
  getForRequirement: (requirementId: string) => RiskAssessment | undefined;
  getAllForRequirement: (requirementId: string) => RiskAssessment[];
}

let riskIdCounter = 0;

function generateRiskId(): string {
  riskIdCounter += 1;
  return `risk-${Date.now()}-${riskIdCounter}`;
}

export function calculateRiskLevel(severity: Severity, likelihood: Likelihood): RiskLevel {
  const score = severity * likelihood;
  if (score >= 16) return 'critical';
  if (score >= 9) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

export const useRiskStore = create<RiskState>()(
  persist(
    (set, get) => ({
      assessments: [],

      addAssessment: (data) => {
        const id = generateRiskId();
        const assessment: RiskAssessment = { id, ...data };
        set((state) => ({ assessments: [...state.assessments, assessment] }));

        useAuditStore.getState().log(
          'create', 'risk_assessment', id,
          undefined,
          JSON.stringify({ requirementId: data.requirementId, riskLevel: data.riskLevel, classifiedBy: data.classifiedBy }),
        );

        return assessment;
      },

      updateAssessment: (id, data) => {
        const existing = get().assessments.find((a) => a.id === id);
        set((state) => ({
          assessments: state.assessments.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        }));

        useAuditStore.getState().log(
          'update', 'risk_assessment', id,
          existing ? JSON.stringify({ riskLevel: existing.riskLevel }) : undefined,
          JSON.stringify(data),
        );
      },

      deleteAssessment: (id) => {
        const existing = get().assessments.find((a) => a.id === id);
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        }));

        useAuditStore.getState().log(
          'delete', 'risk_assessment', id,
          existing ? JSON.stringify({ requirementId: existing.requirementId }) : undefined,
        );
      },

      getForRequirement: (requirementId) => {
        // Return the latest assessment for this requirement
        const matching = get().assessments
          .filter((a) => a.requirementId === requirementId)
          .sort((a, b) => new Date(b.classifiedAt).getTime() - new Date(a.classifiedAt).getTime());
        return matching[0];
      },

      getAllForRequirement: (requirementId) => {
        return get().assessments.filter((a) => a.requirementId === requirementId);
      },
    }),
    { name: 'qatrial:risk-assessments' }
  )
);
