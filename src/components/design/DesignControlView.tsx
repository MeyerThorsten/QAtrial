import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  ChevronRight,
  LinkIcon,
  FlaskConical,
  X,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Edit2,
} from 'lucide-react';
import { useDesignControlStore, PHASE_ORDER } from '../../store/useDesignControlStore';
import { useProjectStore } from '../../store/useProjectStore';
import type { DesignControlItem, DesignPhase } from '../../types';

const PHASE_LABELS: Record<DesignPhase, string> = {
  user_needs: 'designControl.phases.userNeeds',
  design_input: 'designControl.phases.designInput',
  design_output: 'designControl.phases.designOutput',
  verification: 'designControl.phases.verification',
  validation: 'designControl.phases.validation',
  transfer: 'designControl.phases.transfer',
  released: 'designControl.phases.released',
};

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; className: string }> = {
  draft: { icon: <Clock className="w-3 h-3" />, className: 'bg-surface-hover text-text-secondary' },
  in_review: { icon: <Edit2 className="w-3 h-3" />, className: 'bg-warning-subtle text-warning' },
  approved: { icon: <CheckCircle2 className="w-3 h-3" />, className: 'bg-success-subtle text-success' },
  rejected: { icon: <XCircle className="w-3 h-3" />, className: 'bg-danger-subtle text-danger' },
};

let createCounter = 0;
function generateItemId(): string {
  createCounter += 1;
  return `dci-${Date.now()}-${createCounter}`;
}

export function DesignControlView() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const designItems = useDesignControlStore((s) => s.designItems);
  const addDesignItem = useDesignControlStore((s) => s.addDesignItem);
  const updateDesignItem = useDesignControlStore((s) => s.updateDesignItem);
  const deleteDesignItem = useDesignControlStore((s) => s.deleteDesignItem);
  const advancePhase = useDesignControlStore((s) => s.advancePhase);

  const [selectedItem, setSelectedItem] = useState<DesignControlItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<DesignPhase | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const projectId = project?.name ?? 'default';

  const itemsByPhase = useMemo(() => {
    const map: Record<DesignPhase, DesignControlItem[]> = {
      user_needs: [],
      design_input: [],
      design_output: [],
      verification: [],
      validation: [],
      transfer: [],
      released: [],
    };
    for (const item of designItems) {
      if (item.projectId === projectId && map[item.phase]) {
        map[item.phase].push(item);
      }
    }
    return map;
  }, [designItems, projectId]);

  const handleCreate = (phase: DesignPhase) => {
    if (!newTitle.trim()) return;
    const now = new Date().toISOString();
    addDesignItem({
      id: generateItemId(),
      projectId,
      phase,
      title: newTitle.trim(),
      description: newDescription.trim(),
      status: 'draft',
      linkedRequirementIds: [],
      linkedTestIds: [],
      attachments: [],
      createdAt: now,
      updatedAt: now,
    });
    setNewTitle('');
    setNewDescription('');
    setShowCreateForm(null);
  };

  const handleStatusChange = (itemId: string, status: DesignControlItem['status']) => {
    updateDesignItem(itemId, { status });
    if (selectedItem?.id === itemId) {
      setSelectedItem({ ...selectedItem, status });
    }
  };

  const handleAdvance = (itemId: string) => {
    advancePhase(itemId);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{t('designControl.title')}</h2>
          <p className="text-sm text-text-secondary">{t('designControl.description')}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PHASE_ORDER.map((phase) => (
          <div
            key={phase}
            className="flex-shrink-0 w-64 bg-surface rounded-xl border border-border"
          >
            {/* Column Header */}
            <div className="px-3 py-2.5 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">
                  {t(PHASE_LABELS[phase])}
                </h3>
                <span className="text-xs text-text-tertiary bg-surface-hover rounded-full px-2 py-0.5">
                  {itemsByPhase[phase].length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[120px]">
              {itemsByPhase[phase].map((item) => {
                const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.draft;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="w-full text-left bg-surface-elevated rounded-lg border border-border p-3 hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-medium ${statusCfg.className}`}>
                        {statusCfg.icon}
                        {t(`designControl.statuses.${item.status}`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                      <span className="inline-flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        {item.linkedRequirementIds.length}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FlaskConical className="w-3 h-3" />
                        {item.linkedTestIds.length}
                      </span>
                      {item.attachments.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {item.attachments.length}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Add button */}
              {showCreateForm === phase ? (
                <div className="bg-surface-elevated rounded-lg border border-border p-3 space-y-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t('designControl.titlePlaceholder')}
                    className="w-full text-sm bg-surface border border-border rounded-md px-2 py-1.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreate(phase);
                      if (e.key === 'Escape') setShowCreateForm(null);
                    }}
                  />
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder={t('designControl.descriptionPlaceholder')}
                    className="w-full text-sm bg-surface border border-border rounded-md px-2 py-1.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCreate(phase)}
                      className="text-xs px-2.5 py-1 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
                    >
                      {t('common.add')}
                    </button>
                    <button
                      onClick={() => { setShowCreateForm(null); setNewTitle(''); setNewDescription(''); }}
                      className="text-xs px-2.5 py-1 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCreateForm(phase)}
                  className="w-full flex items-center justify-center gap-1 text-xs text-text-tertiary hover:text-accent py-2 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('designControl.addItem')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setSelectedItem(null)}>
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-text-primary truncate">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Phase & Status */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-tertiary">{t('designControl.phase')}:</span>
                <span className="text-sm font-medium text-text-primary">{t(PHASE_LABELS[selectedItem.phase])}</span>
              </div>

              <div>
                <span className="text-xs text-text-tertiary block mb-1">{t('designControl.status')}:</span>
                <div className="flex gap-2">
                  {(['draft', 'in_review', 'approved', 'rejected'] as const).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedItem.id, s)}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                          selectedItem.status === s
                            ? cfg.className + ' ring-1 ring-accent'
                            : 'bg-surface-hover text-text-tertiary hover:text-text-secondary'
                        }`}
                      >
                        {cfg.icon}
                        {t(`designControl.statuses.${s}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div>
                  <span className="text-xs text-text-tertiary block mb-1">{t('requirements.description')}:</span>
                  <p className="text-sm text-text-secondary">{selectedItem.description}</p>
                </div>
              )}

              {/* Linked counts */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <LinkIcon className="w-4 h-4" />
                    <span>{t('designControl.linkedRequirements')}</span>
                  </div>
                  <p className="text-lg font-semibold text-text-primary mt-1">
                    {selectedItem.linkedRequirementIds.length}
                  </p>
                </div>
                <div className="bg-surface rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <FlaskConical className="w-4 h-4" />
                    <span>{t('designControl.linkedTests')}</span>
                  </div>
                  <p className="text-lg font-semibold text-text-primary mt-1">
                    {selectedItem.linkedTestIds.length}
                  </p>
                </div>
              </div>

              {/* Advance Phase Button */}
              {selectedItem.status === 'approved' && selectedItem.phase !== 'released' && (
                <button
                  onClick={() => handleAdvance(selectedItem.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                >
                  <ChevronRight className="w-4 h-4" />
                  {t('designControl.advancePhase')}
                </button>
              )}

              {/* Delete */}
              <button
                onClick={() => {
                  deleteDesignItem(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-danger bg-danger-subtle rounded-lg hover:bg-danger/10 transition-colors text-sm"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignControlView;
