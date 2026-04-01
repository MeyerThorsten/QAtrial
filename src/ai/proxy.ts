/**
 * AI Proxy Client
 *
 * When a backend server is available, AI requests route through the server proxy
 * instead of calling LLM APIs directly from the browser. This:
 * 1. Keeps API keys on the server (not in localStorage)
 * 2. Enables server-side audit logging of AI usage
 * 3. Allows rate limiting and cost controls
 * 4. Supports caching of identical requests
 *
 * The proxy endpoint accepts the same CompletionRequest and returns CompletionResponse.
 *
 * Configuration:
 * - Set VITE_AI_PROXY_URL environment variable to enable proxy mode
 * - When proxy URL is set, all AI requests go through it
 * - When not set, falls back to direct browser-to-API calls (current behavior)
 */

import type { CompletionRequest, CompletionResponse } from './types';

/** Check if proxy mode is enabled */
export function isProxyEnabled(): boolean {
  return !!getProxyUrl();
}

/** Get the configured proxy URL */
function getProxyUrl(): string | undefined {
  // Vite injects env vars at build time
  try {
    return import.meta.env?.VITE_AI_PROXY_URL || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Send a completion request through the server proxy.
 * The proxy handles provider selection, API key management, and usage tracking.
 */
export async function proxyComplete(req: CompletionRequest): Promise<CompletionResponse> {
  const proxyUrl = getProxyUrl();
  if (!proxyUrl) {
    throw new Error('AI proxy not configured. Set VITE_AI_PROXY_URL environment variable.');
  }

  const response = await fetch(`${proxyUrl.replace(/\/$/, '')}/api/ai/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Auth token would be included here when auth is implemented
      // 'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({
      prompt: req.prompt,
      purpose: req.purpose,
      maxTokens: req.maxTokens,
      temperature: req.temperature,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`AI proxy error ${response.status}: ${errorBody || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.text,
    model: data.model,
    providerId: data.providerId,
    tokensUsed: data.tokensUsed,
  };
}
