import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface StepDef {
  id?: string;
  order: number;
  name: string;
  type: string;
  assigneeRole: string;
  requiredApprovers: number;
  slaHours?: number | null;
}

interface ActionRecord {
  id?: string;
  stepOrder: number;
  userId: string;
  userName: string;
  action: string;
  reason?: string | null;
  timestamp: string;
}

interface Props {
  steps: StepDef[];
  currentStep: number;
  status: string; // active, completed, cancelled, escalated, on_hold
  actions: ActionRecord[];
}

export function WorkflowStatus({ steps, currentStep, status, actions }: Props) {
  const { t } = useTranslation();

  const getStepStatus = (index: number) => {
    if (status === 'cancelled') {
      const rejectedAction = actions.find((a) => a.stepOrder === index && a.action === 'rejected');
      if (rejectedAction) return 'rejected';
      if (index < currentStep) return 'completed';
      return 'future';
    }
    if (status === 'completed') {
      return index < steps.length ? 'completed' : 'future';
    }
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'future';
  };

  const getStepActions = (index: number) => {
    return actions.filter((a) => a.stepOrder === index);
  };

  const statusBadge = () => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> {t('workflows.statusCompleted')}</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full"><XCircle className="w-3 h-3" /> {t('workflows.statusCancelled')}</span>;
      case 'escalated':
        return <span className="inline-flex items-center gap-1 text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full"><AlertTriangle className="w-3 h-3" /> {t('workflows.statusEscalated')}</span>;
      case 'on_hold':
        return <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> {t('workflows.statusOnHold')}</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs bg-accent-subtle text-accent px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> {t('workflows.statusActive')}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary">{t('workflows.progress')}</span>
        {statusBadge()}
      </div>

      {/* Horizontal step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const stepStatus = getStepStatus(i);
          const stepActions = getStepActions(i);
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center min-w-[80px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stepStatus === 'completed' ? 'bg-green-500 text-white' :
                  stepStatus === 'active' ? 'bg-accent text-white' :
                  stepStatus === 'rejected' ? 'bg-red-500 text-white' :
                  'bg-surface-secondary border-2 border-border text-text-tertiary'
                }`}>
                  {stepStatus === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                   stepStatus === 'rejected' ? <XCircle className="w-4 h-4" /> :
                   stepStatus === 'active' ? <Clock className="w-4 h-4" /> :
                   <Circle className="w-4 h-4" />}
                </div>
                <span className={`text-xs mt-1 text-center leading-tight ${
                  stepStatus === 'active' ? 'text-accent font-medium' :
                  stepStatus === 'completed' ? 'text-green-600' :
                  stepStatus === 'rejected' ? 'text-red-600' :
                  'text-text-tertiary'
                }`}>
                  {step.name || `Step ${i + 1}`}
                </span>
                <span className="text-[10px] text-text-tertiary">{step.assigneeRole.replace(/_/g, ' ')}</span>
                {/* Show who acted */}
                {stepActions.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {stepActions.map((a, j) => (
                      <div key={j} className="text-[10px] text-text-tertiary text-center">
                        {a.userName.split('@')[0]} - {a.action}
                        {a.timestamp && (
                          <div>{new Date(a.timestamp).toLocaleDateString()}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  getStepStatus(i) === 'completed' ? 'bg-green-500' :
                  getStepStatus(i) === 'rejected' ? 'bg-red-500' :
                  'bg-border'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
