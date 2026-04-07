import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Plus, Clock, AlertTriangle, X } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import type { QTask, TaskPriority, TaskStatus } from '../../types';

interface TaskPanelProps {
  entityType?: string;
  entityId?: string;
  projectId: string;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_CYCLE: TaskStatus[] = ['open', 'in_progress', 'completed'];

const LS_KEY = 'qatrial:tasks';

function getLocalTasks(projectId: string, entityType?: string, entityId?: string): QTask[] {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as QTask[];
    return all.filter((t) => {
      if (t.projectId !== projectId) return false;
      if (entityType && entityId) return t.entityType === entityType && t.entityId === entityId;
      return true;
    });
  } catch {
    return [];
  }
}

function saveLocalTask(task: QTask) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as QTask[];
    all.push(task);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch {
    // silent
  }
}

function updateLocalTask(id: string, updates: Partial<QTask>) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as QTask[];
    const updated = all.map((t) => (t.id === id ? { ...t, ...updates } : t));
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  } catch {
    // silent
  }
}

function deleteLocalTask(id: string) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as QTask[];
    localStorage.setItem(LS_KEY, JSON.stringify(all.filter((t) => t.id !== id)));
  } catch {
    // silent
  }
}

function isOverdue(task: QTask): boolean {
  if (task.status === 'completed') return false;
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date();
}

export function TaskPanel({ entityType, entityId, projectId }: TaskPanelProps) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const { user } = useAuth();
  const isServer = mode === 'server';

  const [tasks, setTasks] = useState<QTask[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formAssignee, setFormAssignee] = useState('');
  const [formAssigneeName, setFormAssigneeName] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; email: string }[]>([]);

  const fetchTasks = useCallback(async () => {
    if (isServer) {
      try {
        let url = `/tasks?projectId=${projectId}`;
        if (entityType && entityId) {
          // Filter client-side since API doesn't support entityType/entityId filter directly
          const res = await apiFetch<{ tasks: QTask[] }>(url);
          setTasks(
            res.tasks.filter(
              (t) => (!entityType || t.entityType === entityType) && (!entityId || t.entityId === entityId)
            )
          );
          return;
        }
        const res = await apiFetch<{ tasks: QTask[] }>(url);
        setTasks(res.tasks);
      } catch {
        // silent
      }
    } else {
      setTasks(getLocalTasks(projectId, entityType, entityId));
    }
  }, [isServer, projectId, entityType, entityId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (isServer) {
      apiFetch<{ users: { id: string; name: string; email: string }[] }>('/users')
        .then((res) => setTeamMembers(res.users || []))
        .catch(() => {});
    }
  }, [isServer]);

  const handleCreate = async () => {
    if (!formTitle.trim()) return;

    const assigneeId = formAssignee || user?.id || 'local-user';
    const assigneeName = formAssigneeName || user?.name || user?.email || 'You';

    if (isServer) {
      try {
        await apiFetch('/tasks', {
          method: 'POST',
          body: JSON.stringify({
            projectId,
            title: formTitle,
            assigneeId,
            assigneeName,
            dueDate: formDueDate || undefined,
            priority: formPriority,
            entityType,
            entityId,
          }),
        });
        resetForm();
        fetchTasks();
      } catch {
        // silent
      }
    } else {
      const task: QTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        projectId,
        title: formTitle,
        description: '',
        assigneeId,
        assigneeName,
        dueDate: formDueDate || undefined,
        priority: formPriority,
        status: 'open',
        entityType,
        entityId,
        createdBy: user?.id || 'local-user',
        createdAt: new Date().toISOString(),
      };
      saveLocalTask(task);
      resetForm();
      fetchTasks();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormTitle('');
    setFormAssignee('');
    setFormAssigneeName('');
    setFormDueDate('');
    setFormPriority('medium');
  };

  const handleStatusToggle = async (task: QTask) => {
    const currentIndex = STATUS_CYCLE.indexOf(task.status as TaskStatus);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];

    if (isServer) {
      try {
        if (nextStatus === 'completed') {
          await apiFetch(`/tasks/${task.id}/complete`, { method: 'PUT' });
        } else {
          await apiFetch(`/tasks/${task.id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: nextStatus }),
          });
        }
        fetchTasks();
      } catch {
        // silent
      }
    } else {
      updateLocalTask(task.id, {
        status: nextStatus,
        completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
      });
      fetchTasks();
    }
  };

  const handleDelete = async (id: string) => {
    if (isServer) {
      try {
        await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
      } catch {
        // silent
      }
    } else {
      deleteLocalTask(id);
      fetchTasks();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-text-tertiary" />
          <h3 className="text-sm font-semibold text-text-primary">{t('tasks.title')}</h3>
          <span className="text-xs text-text-tertiary">({tasks.length})</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? t('common.cancel') : t('tasks.add')}
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="p-3 bg-surface border border-border rounded-lg space-y-2">
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder={t('tasks.titlePlaceholder')}
            className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <div className="grid grid-cols-3 gap-2">
            {isServer ? (
              <select
                value={formAssignee}
                onChange={(e) => {
                  setFormAssignee(e.target.value);
                  const member = teamMembers.find((m) => m.id === e.target.value);
                  setFormAssigneeName(member?.name || member?.email || '');
                }}
                className="px-2 py-1.5 text-sm bg-surface-secondary border border-border rounded-lg text-text-primary"
              >
                <option value="">{t('tasks.selectAssignee')}</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.email}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={formAssigneeName}
                onChange={(e) => setFormAssigneeName(e.target.value)}
                placeholder={t('tasks.assigneePlaceholder')}
                className="px-2 py-1.5 text-sm bg-surface-secondary border border-border rounded-lg text-text-primary"
              />
            )}
            <input
              type="date"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              className="px-2 py-1.5 text-sm bg-surface-secondary border border-border rounded-lg text-text-primary"
            />
            <select
              value={formPriority}
              onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
              className="px-2 py-1.5 text-sm bg-surface-secondary border border-border rounded-lg text-text-primary"
            >
              <option value="low">{t('tasks.priority_low')}</option>
              <option value="medium">{t('tasks.priority_medium')}</option>
              <option value="high">{t('tasks.priority_high')}</option>
              <option value="critical">{t('tasks.priority_critical')}</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={!formTitle.trim()}
            className="w-full py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {t('tasks.create')}
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-1">
        {tasks.length === 0 && (
          <p className="text-sm text-text-tertiary py-3 text-center">{t('tasks.empty')}</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
              isOverdue(task)
                ? 'border-danger/40 bg-danger/5'
                : 'border-border bg-surface hover:bg-surface-hover'
            }`}
          >
            <button
              onClick={() => handleStatusToggle(task)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                task.status === 'completed'
                  ? 'bg-accent border-accent text-white'
                  : task.status === 'in_progress'
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent'
              }`}
              title={t(`tasks.status_${task.status}`)}
            >
              {task.status === 'completed' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {task.status === 'in_progress' && <div className="w-2 h-2 rounded-full bg-accent" />}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${
                  task.status === 'completed'
                    ? 'line-through text-text-tertiary'
                    : 'text-text-primary'
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-text-tertiary">{task.assigneeName || t('tasks.unassigned')}</span>
                {task.dueDate && (
                  <span className={`text-xs ${isOverdue(task) ? 'text-danger font-medium' : 'text-text-tertiary'}`}>
                    <Clock className="w-3 h-3 inline mr-0.5" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>

            {isOverdue(task) && <AlertTriangle className="w-4 h-4 text-danger shrink-0" />}

            <button
              onClick={() => handleDelete(task.id)}
              className="text-text-tertiary hover:text-danger transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
