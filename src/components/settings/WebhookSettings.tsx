import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Play, ToggleLeft, ToggleRight, Pencil, X, Loader2 } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';

interface Webhook {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
  lastTriggered: string | null;
  lastStatus: number | null;
  createdAt: string;
}

const ALL_EVENTS = [
  'requirement.created',
  'requirement.updated',
  'requirement.deleted',
  'test.created',
  'test.updated',
  'test.failed',
  'capa.created',
  'capa.status_changed',
  'approval.requested',
  'approval.approved',
  'approval.rejected',
  'signature.created',
  'evidence.uploaded',
];

export function WebhookSettings() {
  const { t } = useTranslation();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formSecret, setFormSecret] = useState('');
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [formEnabled, setFormEnabled] = useState(true);

  const loadWebhooks = useCallback(async () => {
    try {
      const data = await apiFetch<{ webhooks: Webhook[] }>('/webhooks');
      setWebhooks(data.webhooks);
    } catch (err) {
      console.error('Failed to load webhooks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWebhooks();
  }, [loadWebhooks]);

  const resetForm = () => {
    setFormName('');
    setFormUrl('');
    setFormSecret('');
    setFormEvents([]);
    setFormEnabled(true);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (webhook: Webhook) => {
    setFormName(webhook.name);
    setFormUrl(webhook.url);
    setFormSecret('');
    setFormEvents(webhook.events);
    setFormEnabled(webhook.enabled);
    setEditingId(webhook.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      name: formName,
      url: formUrl,
      secret: formSecret || undefined,
      events: formEvents,
      enabled: formEnabled,
    };

    try {
      if (editingId) {
        await apiFetch(`/webhooks/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/webhooks', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      resetForm();
      loadWebhooks();
    } catch (err) {
      console.error('Failed to save webhook:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/webhooks/${id}`, { method: 'DELETE' });
      loadWebhooks();
    } catch (err) {
      console.error('Failed to delete webhook:', err);
    }
  };

  const handleToggle = async (webhook: Webhook) => {
    try {
      await apiFetch(`/webhooks/${webhook.id}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !webhook.enabled }),
      });
      loadWebhooks();
    } catch (err) {
      console.error('Failed to toggle webhook:', err);
    }
  };

  const handleTest = async (id: string) => {
    setTesting(id);
    try {
      const result = await apiFetch<{ success: boolean; status: number; statusText: string }>(
        `/webhooks/${id}/test`,
        { method: 'POST' },
      );
      if (result.success) {
        loadWebhooks();
      }
    } catch (err) {
      console.error('Failed to test webhook:', err);
    } finally {
      setTesting(null);
    }
  };

  const toggleEvent = (event: string) => {
    setFormEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">{t('webhooks.title')}</h3>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('webhooks.addWebhook')}
        </button>
      </div>

      {webhooks.length === 0 ? (
        <div className="text-sm text-text-tertiary bg-surface-secondary rounded-lg p-6 text-center">
          {t('webhooks.noWebhooks')}
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{wh.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                        wh.enabled
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {wh.enabled ? t('webhooks.enabled') : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5 truncate">{wh.url}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {wh.events.map((ev) => (
                      <span
                        key={ev}
                        className="text-xs bg-accent-subtle text-accent-text px-1.5 py-0.5 rounded-md"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                    {wh.lastTriggered && (
                      <span>
                        {t('webhooks.lastTriggered')}: {new Date(wh.lastTriggered).toLocaleString()}
                      </span>
                    )}
                    {wh.lastStatus !== null && (
                      <span
                        className={
                          wh.lastStatus >= 200 && wh.lastStatus < 300
                            ? 'text-green-600'
                            : 'text-red-500'
                        }
                      >
                        Status: {wh.lastStatus}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTest(wh.id)}
                    disabled={testing === wh.id}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-accent hover:bg-accent-subtle transition-colors"
                    title={t('webhooks.test')}
                  >
                    {testing === wh.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggle(wh)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors"
                    title={t('webhooks.enabled')}
                  >
                    {wh.enabled ? (
                      <ToggleRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(wh)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors"
                    title={t('common.edit')}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(wh.id)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">
                {editingId ? t('common.edit') : t('webhooks.addWebhook')}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  {t('webhooks.name')}
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="My Webhook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  {t('webhooks.url')}
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  {t('webhooks.secret')}
                </label>
                <input
                  type="password"
                  value={formSecret}
                  onChange={(e) => setFormSecret(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder={editingId ? '(unchanged)' : 'Optional signing secret'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  {t('webhooks.events')}
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  {ALL_EVENTS.map((event) => (
                    <label
                      key={event}
                      className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer hover:text-text-primary"
                    >
                      <input
                        type="checkbox"
                        checked={formEvents.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      {event}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                {t('webhooks.enabled')}
              </label>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={!formName || !formUrl}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
