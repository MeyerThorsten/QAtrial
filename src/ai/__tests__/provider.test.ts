import { resolveProvider } from '../provider';
import type { LLMProvider } from '../../types';

function makeProvider(overrides: Partial<LLMProvider> = {}): LLMProvider {
  return {
    id: 'test-provider',
    name: 'Test Provider',
    type: 'openai-compatible',
    baseUrl: 'http://localhost:1234',
    apiKey: 'test-key',
    model: 'test-model',
    purpose: ['all'],
    maxTokens: 4096,
    temperature: 0.7,
    enabled: true,
    priority: 10,
    ...overrides,
  };
}

describe('resolveProvider', () => {
  it('returns direct match by specific purpose', () => {
    const providers: LLMProvider[] = [
      makeProvider({ id: 'general', purpose: ['all'], priority: 10 }),
      makeProvider({ id: 'test-gen', purpose: ['test_generation'], priority: 5 }),
    ];

    const result = resolveProvider('test_generation', providers);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('test-gen');
  });

  it('falls back to provider with purpose "all"', () => {
    const providers: LLMProvider[] = [
      makeProvider({ id: 'general', purpose: ['all'], priority: 10 }),
    ];

    const result = resolveProvider('gap_analysis', providers);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('general');
  });

  it('returns null when no provider matches', () => {
    const providers: LLMProvider[] = [
      makeProvider({ id: 'test-gen', purpose: ['test_generation'], priority: 5 }),
    ];

    const result = resolveProvider('gap_analysis', providers);
    expect(result).toBeNull();
  });

  it('returns null when all providers are disabled', () => {
    const providers: LLMProvider[] = [
      makeProvider({ id: 'a', purpose: ['all'], enabled: false }),
      makeProvider({ id: 'b', purpose: ['test_generation'], enabled: false }),
    ];

    const result = resolveProvider('test_generation', providers);
    expect(result).toBeNull();
  });

  it('selects lower priority number (higher priority) provider', () => {
    const providers: LLMProvider[] = [
      makeProvider({ id: 'low-priority', purpose: ['test_generation'], priority: 100 }),
      makeProvider({ id: 'high-priority', purpose: ['test_generation'], priority: 1 }),
      makeProvider({ id: 'mid-priority', purpose: ['test_generation'], priority: 50 }),
    ];

    const result = resolveProvider('test_generation', providers);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('high-priority');
  });

  it('prefers direct match over "all" fallback regardless of priority', () => {
    const providers: LLMProvider[] = [
      makeProvider({ id: 'general', purpose: ['all'], priority: 1 }),
      makeProvider({ id: 'specific', purpose: ['risk_classification'], priority: 100 }),
    ];

    const result = resolveProvider('risk_classification', providers);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('specific');
  });

  it('returns null for empty providers array', () => {
    const result = resolveProvider('test_generation', []);
    expect(result).toBeNull();
  });
});
