import type { LLMProvider, LLMPurpose } from '../types';

/**
 * Resolves the best provider for a given purpose.
 * 1. Enabled providers matching the specific purpose, sorted by priority (lower first).
 * 2. Falls back to providers with purpose 'all'.
 * 3. Returns null if none found.
 */
export function resolveProvider(
  purpose: LLMPurpose,
  providers: LLMProvider[],
): LLMProvider | null {
  const enabled = providers.filter((p) => p.enabled);

  // Direct match: providers whose purpose array includes the specific purpose
  const directMatch = enabled
    .filter((p) => p.purpose.includes(purpose))
    .sort((a, b) => a.priority - b.priority);

  if (directMatch.length > 0) {
    return directMatch[0];
  }

  // Fallback: providers with purpose 'all'
  const fallback = enabled
    .filter((p) => p.purpose.includes('all'))
    .sort((a, b) => a.priority - b.priority);

  if (fallback.length > 0) {
    return fallback[0];
  }

  return null;
}
