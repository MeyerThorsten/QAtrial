import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkflowDefinition, WorkflowInstance } from '../types';
import { useAuditStore } from './useAuditStore';

interface WorkflowState {
  definitions: WorkflowDefinition[];
  instances: WorkflowInstance[];

  addDefinition: (def: WorkflowDefinition) => void;
  updateDefinition: (id: string, patch: Partial<WorkflowDefinition>) => void;
  removeDefinition: (id: string) => void;

  startWorkflow: (definitionId: string, entityType: string, entityId: string) => WorkflowInstance | null;
  approveStep: (instanceId: string, userId: string, action: 'approved' | 'rejected', reason?: string) => void;

  getActiveWorkflows: (entityId?: string) => WorkflowInstance[];
  getMyPendingApprovals: (userId: string) => WorkflowInstance[];
}

let idCounter = 0;
function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

const DEFAULT_DEFINITIONS: WorkflowDefinition[] = [
  {
    id: 'wf-req-approval',
    name: 'Requirement Approval',
    trigger: 'manual',
    entityType: 'requirement',
    enabled: true,
    steps: [
      { id: 'step-review', name: 'Review', type: 'review', requiredApprovers: 1, slaHours: 48 },
      { id: 'step-approve', name: 'Approve', type: 'approval', requiredApprovers: 1, slaHours: 72 },
      { id: 'step-sign', name: 'Sign', type: 'sign', requiredApprovers: 1, slaHours: 24 },
    ],
  },
  {
    id: 'wf-design-gate',
    name: 'Design Gate Review',
    trigger: 'manual',
    entityType: 'design_item',
    enabled: true,
    steps: [
      { id: 'step-dg-review', name: 'Review', type: 'review', requiredApprovers: 1, slaHours: 48 },
      { id: 'step-dg-approve', name: 'Gate Approval', type: 'approval', requiredApprovers: 2, slaHours: 72 },
      { id: 'step-dg-sign', name: 'Sign Off', type: 'sign', requiredApprovers: 1, slaHours: 24 },
    ],
  },
];

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      definitions: DEFAULT_DEFINITIONS,
      instances: [],

      addDefinition: (def) => {
        set((state) => ({ definitions: [...state.definitions, def] }));
        useAuditStore.getState().log('create', 'workflow_definition', def.id, undefined, JSON.stringify({ name: def.name }));
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
          'workflow_definition',
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
        useAuditStore.getState().log('delete', 'workflow_definition', id, prev ? JSON.stringify({ name: prev.name }) : undefined);
      },

      startWorkflow: (definitionId, entityType, entityId) => {
        const def = get().definitions.find((d) => d.id === definitionId);
        if (!def || !def.enabled) return null;

        const instance: WorkflowInstance = {
          id: generateId('wfi'),
          workflowId: definitionId,
          entityType,
          entityId,
          currentStepIndex: 0,
          status: 'active',
          approvals: [],
          startedAt: new Date().toISOString(),
        };

        set((state) => ({ instances: [...state.instances, instance] }));
        useAuditStore.getState().log(
          'create',
          'workflow_instance',
          instance.id,
          undefined,
          JSON.stringify({ workflowName: def.name, entityType, entityId })
        );

        return instance;
      },

      approveStep: (instanceId, userId, action, reason?) => {
        const instance = get().instances.find((i) => i.id === instanceId);
        if (!instance || instance.status !== 'active') return;

        const def = get().definitions.find((d) => d.id === instance.workflowId);
        if (!def) return;

        const currentStep = def.steps[instance.currentStepIndex];
        if (!currentStep) return;

        const approval = {
          stepId: currentStep.id,
          userId,
          action,
          timestamp: new Date().toISOString(),
          reason,
        };

        const updatedApprovals = [...instance.approvals, approval];

        // Count approvals for current step
        const stepApprovals = updatedApprovals.filter(
          (a) => a.stepId === currentStep.id && a.action === 'approved'
        );
        const stepRejections = updatedApprovals.filter(
          (a) => a.stepId === currentStep.id && a.action === 'rejected'
        );

        let newStepIndex = instance.currentStepIndex;
        let newStatus: 'active' | 'completed' | 'cancelled' | 'escalated' = instance.status;
        let completedAt: string | undefined;

        if (stepRejections.length > 0) {
          newStatus = 'cancelled';
          completedAt = new Date().toISOString();
        } else if (stepApprovals.length >= currentStep.requiredApprovers) {
          // Move to next step
          if (instance.currentStepIndex >= def.steps.length - 1) {
            newStatus = 'completed';
            completedAt = new Date().toISOString();
          } else {
            newStepIndex = instance.currentStepIndex + 1;
          }
        }

        set((state) => ({
          instances: state.instances.map((i) =>
            i.id === instanceId
              ? {
                  ...i,
                  approvals: updatedApprovals,
                  currentStepIndex: newStepIndex,
                  status: newStatus,
                  completedAt,
                }
              : i
          ),
        }));

        useAuditStore.getState().log(
          action === 'approved' ? 'approve' : 'reject',
          'workflow_instance',
          instanceId,
          `Step: ${currentStep.name}`,
          `Action: ${action}`,
          reason
        );
      },

      getActiveWorkflows: (entityId?) => {
        const instances = get().instances.filter((i) => i.status === 'active');
        if (entityId) return instances.filter((i) => i.entityId === entityId);
        return instances;
      },

      getMyPendingApprovals: (userId) => {
        // Return active instances where the user hasn't already acted on the current step
        return get().instances.filter((i) => {
          if (i.status !== 'active') return false;
          const def = get().definitions.find((d) => d.id === i.workflowId);
          if (!def) return false;
          const currentStep = def.steps[i.currentStepIndex];
          if (!currentStep) return false;
          const alreadyActed = i.approvals.some(
            (a) => a.stepId === currentStep.id && a.userId === userId
          );
          return !alreadyActed;
        });
      },
    }),
    { name: 'qatrial:workflow' }
  )
);
