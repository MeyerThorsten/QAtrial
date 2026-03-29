import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LLMProvider, LLMPurpose } from '../types';
import { resolveProvider } from '../ai/provider';
import { complete } from '../ai/client';

interface UsageRecord {
  inputTokens: number;
  outputTokens: number;
  calls: number;
}

interface LLMState {
  providers: LLMProvider[];
  usage: Record<string, UsageRecord>;

  addProvider: (provider: LLMProvider) => void;
  updateProvider: (id: string, data: Partial<Omit<LLMProvider, 'id'>>) => void;
  removeProvider: (id: string) => void;
  trackUsage: (providerId: string, input: number, output: number) => void;
  getProviderForPurpose: (purpose: LLMPurpose) => LLMProvider | null;
  hasAnyProvider: () => boolean;
  testConnection: (id: string) => Promise<{ ok: boolean; latencyMs: number; error?: string }>;
}

export const useLLMStore = create<LLMState>()(
  persist(
    (set, get) => ({
      providers: [],
      usage: {},

      addProvider: (provider) => {
        set({ providers: [...get().providers, provider] });
      },

      updateProvider: (id, data) => {
        set({
          providers: get().providers.map((p) =>
            p.id === id ? { ...p, ...data } : p,
          ),
        });
      },

      removeProvider: (id) => {
        set({ providers: get().providers.filter((p) => p.id !== id) });
      },

      trackUsage: (providerId, input, output) => {
        const current = get().usage[providerId] ?? {
          inputTokens: 0,
          outputTokens: 0,
          calls: 0,
        };
        set({
          usage: {
            ...get().usage,
            [providerId]: {
              inputTokens: current.inputTokens + input,
              outputTokens: current.outputTokens + output,
              calls: current.calls + 1,
            },
          },
        });
      },

      getProviderForPurpose: (purpose) => {
        return resolveProvider(purpose, get().providers);
      },

      hasAnyProvider: () => {
        return get().providers.some((p) => p.enabled);
      },

      testConnection: async (id) => {
        const provider = get().providers.find((p) => p.id === id);
        if (!provider) {
          return { ok: false, latencyMs: 0, error: 'Provider not found' };
        }

        const start = performance.now();
        try {
          await complete({
            prompt: 'Respond with exactly: OK',
            purpose: provider.purpose[0] ?? 'all',
            maxTokens: 10,
            temperature: 0,
          });
          const latencyMs = Math.round(performance.now() - start);
          return { ok: true, latencyMs };
        } catch (err) {
          const latencyMs = Math.round(performance.now() - start);
          return {
            ok: false,
            latencyMs,
            error: err instanceof Error ? err.message : String(err),
          };
        }
      },
    }),
    { name: 'qatrial:llm' },
  ),
);
