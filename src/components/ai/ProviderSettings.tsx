'use no memo';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useLLMStore } from '../../store/useLLMStore';
import type { LLMProvider, LLMProviderType, LLMPurpose } from '../../types';

const ALL_PURPOSES: LLMPurpose[] = [
  'all',
  'test_generation',
  'gap_analysis',
  'risk_classification',
  'report_narrative',
  'requirement_decomp',
  'capa',
];

const PURPOSE_LABELS: Record<LLMPurpose, string> = {
  all: 'All',
  test_generation: 'Test Generation',
  gap_analysis: 'Gap Analysis',
  risk_classification: 'Risk Classification',
  report_narrative: 'Report Narrative',
  requirement_decomp: 'Requirement Decomp',
  capa: 'CAPA',
};

interface ProviderFormData {
  id: string;
  name: string;
  type: LLMProviderType;
  baseUrl: string;
  apiKey: string;
  model: string;
  purpose: LLMPurpose[];
  maxTokens: number;
  temperature: number;
  priority: number;
  enabled: boolean;
}

interface ProviderPreset {
  id: string;
  name: string;
  type: LLMProviderType;
  baseUrl: string;
  models: string[];
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  needsApiKey: boolean;
  description: string;
}

const PRESETS: ProviderPreset[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    models: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-20250506'],
    defaultModel: 'claude-sonnet-4-20250514',
    temperature: 0.2,
    maxTokens: 4096,
    needsApiKey: true,
    description: 'Claude models — best for regulatory precision and structured output',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-4o', 'gpt-4o-mini', 'o3-mini'],
    defaultModel: 'gpt-4.1',
    temperature: 0.2,
    maxTokens: 4096,
    needsApiKey: true,
    description: 'GPT models — fast, widely supported',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    type: 'openai-compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'anthropic/claude-sonnet-4', 'anthropic/claude-haiku-4',
      'openai/gpt-4.1', 'openai/gpt-4o',
      'google/gemini-2.5-pro', 'google/gemini-2.5-flash',
      'meta-llama/llama-4-maverick',
      'deepseek/deepseek-r1',
      'qwen/qwen3-235b-a22b',
    ],
    defaultModel: 'anthropic/claude-sonnet-4',
    temperature: 0.2,
    maxTokens: 4096,
    needsApiKey: true,
    description: 'Unified API for 200+ models — pay per token, no subscriptions',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    type: 'openai-compatible',
    baseUrl: 'http://localhost:11434/v1',
    models: ['llama3.1:8b', 'llama3.1:70b', 'qwen2.5:14b', 'mistral:7b', 'gemma2:9b', 'deepseek-r1:14b'],
    defaultModel: 'llama3.1:8b',
    temperature: 0.3,
    maxTokens: 2048,
    needsApiKey: false,
    description: 'Run models locally — no API key needed, data stays on your machine',
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (Local)',
    type: 'openai-compatible',
    baseUrl: 'http://localhost:1234/v1',
    models: ['local-model'],
    defaultModel: 'local-model',
    temperature: 0.3,
    maxTokens: 2048,
    needsApiKey: false,
    description: 'LM Studio local server — use whatever model you have loaded',
  },
];

const emptyForm: ProviderFormData = {
  id: '',
  name: '',
  type: 'anthropic',
  baseUrl: 'https://api.anthropic.com',
  apiKey: '',
  model: '',
  purpose: ['all'],
  maxTokens: 4096,
  temperature: 0.2,
  priority: 1,
  enabled: true,
};

export function ProviderSettings() {
  const { t } = useTranslation();
  const providers = useLLMStore((s) => s.providers);
  const usage = useLLMStore((s) => s.usage);
  const addProvider = useLLMStore((s) => s.addProvider);
  const updateProvider = useLLMStore((s) => s.updateProvider);
  const removeProvider = useLLMStore((s) => s.removeProvider);
  const testConnection = useLLMStore((s) => s.testConnection);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProviderFormData>(emptyForm);
  const [testResults, setTestResults] = useState<
    Record<string, { ok: boolean; latencyMs: number; error?: string }>
  >({});
  const [testing, setTesting] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const currentPreset = activePreset ? PRESETS.find((p) => p.id === activePreset) ?? null : null;

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setActivePreset(null);
    setModalOpen(true);
  }

  function openEdit(provider: LLMProvider) {
    setEditingId(provider.id);
    setForm({ ...provider });
    // Try to match to a preset for model dropdown
    const match = PRESETS.find((p) => p.baseUrl === provider.baseUrl);
    setActivePreset(match?.id ?? null);
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.model.trim()) return;

    if (editingId) {
      const { id: _unusedId, ...data } = form;
      void _unusedId;
      updateProvider(editingId, data);
    } else {
      const id =
        form.id.trim() ||
        form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
          '-' +
          Date.now().toString(36);
      addProvider({ ...form, id });
    }
    setModalOpen(false);
  }

  async function handleTest(id: string) {
    setTesting(id);
    const result = await testConnection(id);
    setTestResults((prev) => ({ ...prev, [id]: result }));
    setTesting(null);
  }

  function togglePurpose(purpose: LLMPurpose) {
    setForm((prev) => ({
      ...prev,
      purpose: prev.purpose.includes(purpose)
        ? prev.purpose.filter((p) => p !== purpose)
        : [...prev.purpose, purpose],
    }));
  }

  // Build purpose routing summary
  const purposeRouting: Record<string, string> = {};
  for (const purpose of ALL_PURPOSES) {
    const matching = providers
      .filter((p) => p.enabled && (p.purpose.includes(purpose) || p.purpose.includes('all')))
      .sort((a, b) => a.priority - b.priority);
    purposeRouting[purpose] = matching[0]?.name ?? '---';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          {t('ai.providerSettings')}
        </h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('ai.addProvider')}
        </button>
      </div>

      {/* Provider list */}
      {providers.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <p className="text-text-secondary">{t('ai.noProvider')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {providers.map((provider) => {
            const result = testResults[provider.id];
            const providerUsage = usage[provider.id];
            return (
              <div
                key={provider.id}
                className="bg-surface rounded-xl border border-border p-4 flex items-center gap-4"
              >
                {/* Status indicator */}
                <div className="shrink-0">
                  {result ? (
                    result.ok ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-danger" />
                    )
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary truncate">
                      {provider.name}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-accent-subtle text-accent font-medium">
                      {provider.type}
                    </span>
                    {!provider.enabled && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-surface-tertiary text-text-tertiary">
                        disabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-tertiary">
                    <span className="font-mono">{provider.model}</span>
                    <span>
                      {provider.purpose.map((p) => PURPOSE_LABELS[p]).join(', ')}
                    </span>
                    {result?.ok && (
                      <span>{t('ai.avgLatency', { ms: result.latencyMs })}</span>
                    )}
                    {result && !result.ok && (
                      <span className="text-danger">{t('ai.unreachable')}</span>
                    )}
                  </div>
                </div>

                {/* Usage */}
                {providerUsage && (
                  <div className="text-xs text-text-tertiary text-right shrink-0">
                    <div>
                      {providerUsage.inputTokens.toLocaleString()} {t('ai.inputTokens')}
                    </div>
                    <div>
                      {providerUsage.outputTokens.toLocaleString()} {t('ai.outputTokens')}
                    </div>
                    <div>{providerUsage.calls} calls</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTest(provider.id)}
                    disabled={testing === provider.id}
                    className="p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
                  >
                    {testing === provider.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(provider)}
                    className="p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeProvider(provider.id)}
                    className="p-1.5 text-text-tertiary hover:text-danger rounded-lg hover:bg-danger-subtle transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Purpose routing summary */}
      {providers.length > 0 && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-surface-tertiary border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">
              {t('ai.purposeRouting')}
            </h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {ALL_PURPOSES.map((purpose) => (
                <tr key={purpose} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-2 text-text-secondary font-medium">
                    {PURPOSE_LABELS[purpose]}
                  </td>
                  <td className="px-4 py-2 text-text-primary">
                    {purposeRouting[purpose]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Token usage summary */}
      {providers.length > 0 && Object.keys(usage).length > 0 && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-surface-tertiary border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">
              {t('ai.tokenUsage')}
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left text-xs font-semibold text-text-tertiary uppercase">
                  Provider
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-text-tertiary uppercase">
                  {t('ai.inputTokens')}
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-text-tertiary uppercase">
                  {t('ai.outputTokens')}
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-text-tertiary uppercase">
                  Calls
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(usage).map(([providerId, u]) => {
                const providerName =
                  providers.find((p) => p.id === providerId)?.name ?? providerId;
                return (
                  <tr key={providerId} className="border-b border-border-subtle last:border-0">
                    <td className="px-4 py-2 text-text-primary">{providerName}</td>
                    <td className="px-4 py-2 text-text-secondary text-right font-mono">
                      {u.inputTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-text-secondary text-right font-mono">
                      {u.outputTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-text-secondary text-right font-mono">
                      {u.calls}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">
                {editingId ? t('common.edit') : t('ai.addProvider')}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4 space-y-4">
              {/* Quick presets — only for new providers */}
              {!editingId && (
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    Quick Setup
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            name: preset.name,
                            type: preset.type,
                            baseUrl: preset.baseUrl,
                            model: preset.defaultModel,
                            temperature: preset.temperature,
                            maxTokens: preset.maxTokens,
                          }));
                          setActivePreset(preset.id);
                        }}
                        className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors text-center ${
                          activePreset === preset.id
                            ? 'border-accent bg-accent-subtle text-accent'
                            : 'border-border bg-surface-tertiary text-text-secondary hover:border-accent/50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                  {activePreset && (
                    <p className="text-[11px] text-text-tertiary mt-1.5">
                      {PRESETS.find((p) => p.id === activePreset)?.description}
                    </p>
                  )}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Claude Sonnet"
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => {
                    const type = e.target.value as LLMProviderType;
                    setForm((f) => ({
                      ...f,
                      type,
                      baseUrl:
                        type === 'anthropic'
                          ? 'https://api.anthropic.com'
                          : f.baseUrl === 'https://api.anthropic.com'
                            ? ''
                            : f.baseUrl,
                    }));
                    setActivePreset(null);
                  }}
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                >
                  <option value="anthropic">Anthropic</option>
                  <option value="openai-compatible">OpenAI-compatible</option>
                </select>
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  value={form.baseUrl}
                  onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
                  placeholder={form.type === 'anthropic' ? 'https://api.anthropic.com' : 'https://api.openai.com/v1'}
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors font-mono"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  API Key
                  {currentPreset && !currentPreset.needsApiKey && (
                    <span className="ml-2 text-[10px] text-text-tertiary font-normal">(not required for local)</span>
                  )}
                </label>
                <input
                  type="password"
                  value={form.apiKey}
                  onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                  placeholder={currentPreset && !currentPreset.needsApiKey ? 'Not required' : 'sk-...'}
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors font-mono"
                />
              </div>

              {/* Model — dropdown if preset has models, otherwise text input */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Model
                </label>
                {currentPreset && currentPreset.models.length > 1 ? (
                  <select
                    value={form.model}
                    onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors font-mono"
                  >
                    {currentPreset.models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                    placeholder="e.g. claude-sonnet-4-20250514"
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors font-mono"
                  />
                )}
              </div>

              {/* Purposes (multi-select checkboxes) */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">
                  Purposes
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_PURPOSES.map((purpose) => (
                    <label
                      key={purpose}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                        form.purpose.includes(purpose)
                          ? 'bg-accent-subtle text-accent border-accent/30'
                          : 'bg-surface-tertiary text-text-tertiary border-border hover:border-border'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.purpose.includes(purpose)}
                        onChange={() => togglePurpose(purpose)}
                        className="sr-only"
                      />
                      {PURPOSE_LABELS[purpose]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Max tokens + Temperature row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={form.maxTokens}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, maxTokens: Number(e.target.value) }))
                    }
                    min={100}
                    max={100000}
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Temperature
                  </label>
                  <input
                    type="number"
                    value={form.temperature}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        temperature: Number(e.target.value),
                      }))
                    }
                    min={0}
                    max={2}
                    step={0.1}
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Priority + Enabled row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Priority (lower = first)
                  </label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priority: Number(e.target.value) }))
                    }
                    min={1}
                    max={100}
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enabled}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, enabled: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-input-border text-accent focus:ring-accent/40"
                    />
                    <span className="text-sm text-text-primary">Enabled</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.model.trim()}
                className="px-4 py-1.5 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
