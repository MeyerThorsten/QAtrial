import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileEdit, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuth } from '../../hooks/useAuth';
import { ChangeControlForm } from './ChangeControlForm';
import { WorkflowStatus } from '../workflows/WorkflowStatus';

const RISK_COLORS: Record<string, string> = {
  low: 'bg-green-500/10 text-green-600',
  medium: 'bg-yellow-500/10 text-yellow-600',
  high: 'bg-orange-500/10 text-orange-600',
  critical: 'bg-red-500/10 text-red-600',
};

export function ChangeControlTracker() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [workflowExec, setWorkflowExec] = useState<any>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchData = useCallback(async () => {
    if (!project?.name || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/change-control?projectId=${project.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.changeControls || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [project?.name, token, apiBase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchExecution = async (executionId: string) => {
    try {
      const res = await fetch(`${apiBase}/api/workflows/executions/${executionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWorkflowExec(data.execution);
      }
    } catch {
      // ignore
    }
  };

  const handleExpand = (cc: any) => {
    if (expandedId === cc.id) {
      setExpandedId(null);
      setWorkflowExec(null);
    } else {
      setExpandedId(cc.id);
      if (cc.workflowExecutionId) {
        fetchExecution(cc.workflowExecutionId);
      } else {
        setWorkflowExec(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${apiBase}/api/change-control/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      // ignore
    }
  };

  const handleAddTask = async (ccId: string) => {
    if (!newTaskTitle.trim()) return;
    try {
      await fetch(`${apiBase}/api/change-control/${ccId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTaskTitle, assignee: newTaskAssignee, dueDate: newTaskDue || null }),
      });
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setNewTaskDue('');
      fetchData();
    } catch {
      // ignore
    }
  };

  const handleCompleteTask = async (ccId: string, taskId: string) => {
    try {
      await fetch(`${apiBase}/api/change-control/${ccId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' }),
      });
      fetchData();
    } catch {
      // ignore
    }
  };

  const handleVerifyEffectiveness = async (ccId: string) => {
    try {
      await fetch(`${apiBase}/api/change-control/${ccId}/verify-effectiveness`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      // ignore
    }
  };

  if (showForm || editing) {
    return (
      <ChangeControlForm
        changeControl={editing}
        onSaved={() => { setShowForm(false); setEditing(null); fetchData(); }}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('changeControl.title')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-accent bg-accent-subtle rounded-lg hover:bg-accent/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('changeControl.create')}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">
          <p>{t('changeControl.noItems')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((cc) => (
            <div key={cc.id} className="bg-surface rounded-xl border border-border overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
                onClick={() => handleExpand(cc)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-text-tertiary">{cc.changeNumber}</span>
                  <span className="text-sm font-medium text-text-primary">{cc.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_COLORS[cc.riskLevel] || ''}`}>
                    {cc.riskLevel}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-subtle text-accent">{cc.status}</span>
                  <span className="text-xs text-text-tertiary">{cc.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(cc); }}
                    className="p-1 text-text-tertiary hover:text-accent transition-colors"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(cc.id); }}
                    className="p-1 text-text-tertiary hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedId === cc.id && (
                <div className="border-t border-border p-5 space-y-5">
                  {/* Status timeline */}
                  <div className="flex items-center gap-1">
                    {['initiated', 'assessment', 'approval', 'implementation', 'verification', 'closed'].map((s, i, arr) => (
                      <div key={s} className="flex items-center">
                        <div className={`text-xs px-2 py-1 rounded ${
                          s === cc.status ? 'bg-accent text-white font-medium' :
                          arr.indexOf(cc.status) > i ? 'bg-green-500/10 text-green-600' :
                          'bg-surface-secondary text-text-tertiary'
                        }`}>
                          {s}
                        </div>
                        {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-text-tertiary mx-0.5" />}
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {cc.description && (
                    <div>
                      <span className="text-xs font-medium text-text-secondary">{t('changeControl.description')}</span>
                      <p className="text-sm text-text-primary mt-1">{cc.description}</p>
                    </div>
                  )}

                  {/* Workflow status */}
                  {workflowExec && workflowExec.template && (
                    <WorkflowStatus
                      steps={workflowExec.template.steps}
                      currentStep={workflowExec.currentStep}
                      status={workflowExec.status}
                      actions={workflowExec.actions || []}
                    />
                  )}

                  {/* Implementation tasks */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">{t('changeControl.tasks')}</h4>
                    {(cc.tasks || []).length === 0 ? (
                      <p className="text-xs text-text-tertiary">{t('changeControl.noTasks')}</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-text-tertiary text-xs">
                            <th className="pb-1">{t('changeControl.taskTitle')}</th>
                            <th className="pb-1">{t('changeControl.taskAssignee')}</th>
                            <th className="pb-1">{t('changeControl.taskDue')}</th>
                            <th className="pb-1">{t('changeControl.taskStatus')}</th>
                            <th className="pb-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(cc.tasks || []).map((task: any) => (
                            <tr key={task.id} className="border-t border-border">
                              <td className="py-1.5 text-text-primary">{task.title}</td>
                              <td className="py-1.5 text-text-secondary">{task.assignee}</td>
                              <td className="py-1.5 text-text-secondary">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                              </td>
                              <td className="py-1.5">
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  task.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                                  task.status === 'overdue' ? 'bg-red-500/10 text-red-600' :
                                  'bg-yellow-500/10 text-yellow-600'
                                }`}>
                                  {task.status}
                                </span>
                              </td>
                              <td className="py-1.5">
                                {task.status !== 'completed' && (
                                  <button
                                    onClick={() => handleCompleteTask(cc.id, task.id)}
                                    className="text-xs text-accent hover:underline"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Add task form */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="flex-1 px-2 py-1.5 bg-surface-secondary border border-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder={t('changeControl.newTaskPlaceholder')}
                      />
                      <input
                        type="text"
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                        className="w-28 px-2 py-1.5 bg-surface-secondary border border-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder={t('changeControl.taskAssignee')}
                      />
                      <input
                        type="date"
                        value={newTaskDue}
                        onChange={(e) => setNewTaskDue(e.target.value)}
                        className="px-2 py-1.5 bg-surface-secondary border border-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <button
                        onClick={() => handleAddTask(cc.id)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs bg-accent text-white rounded hover:bg-accent/90 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        {t('changeControl.addTask')}
                      </button>
                    </div>
                  </div>

                  {/* Effectiveness verification */}
                  {cc.status === 'verification' && (
                    <div className="bg-surface-secondary rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-text-primary mb-2">{t('changeControl.effectivenessVerification')}</h4>
                      {cc.effectivenessVerified ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          {t('changeControl.effectivenessVerified')}
                          {cc.effectivenessCheckDate && (
                            <span className="text-text-tertiary text-xs">
                              ({new Date(cc.effectivenessCheckDate).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleVerifyEffectiveness(cc.id)}
                          className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {t('changeControl.verifyEffectiveness')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
