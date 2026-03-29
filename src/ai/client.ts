import type { CompletionRequest, CompletionResponse } from './types';
import { resolveProvider } from './provider';
import { useLLMStore } from '../store/useLLMStore';

/**
 * Unified AI completion client.
 * Routes requests to the appropriate provider based on purpose,
 * handles Anthropic and OpenAI-compatible APIs, and tracks usage.
 */
export async function complete(req: CompletionRequest): Promise<CompletionResponse> {
  const { providers, trackUsage } = useLLMStore.getState();
  const provider = resolveProvider(req.purpose, providers);

  if (!provider) {
    throw new Error(`No AI provider configured for purpose: ${req.purpose}`);
  }

  const maxTokens = req.maxTokens ?? provider.maxTokens;
  const temperature = req.temperature ?? provider.temperature;

  let text: string;
  let inputTokens: number;
  let outputTokens: number;

  if (provider.type === 'anthropic') {
    const url = `${provider.baseUrl.replace(/\/$/, '')}/v1/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: req.prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(
        `Anthropic API error ${response.status}: ${errorBody || response.statusText}`,
      );
    }

    const data = await response.json();
    text = data.content?.[0]?.text ?? '';
    inputTokens = data.usage?.input_tokens ?? 0;
    outputTokens = data.usage?.output_tokens ?? 0;
  } else {
    // openai-compatible
    const url = `${provider.baseUrl.replace(/\/$/, '')}/chat/completions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(provider.apiKey
          ? { Authorization: `Bearer ${provider.apiKey}` }
          : {}),
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: req.prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(
        `OpenAI-compatible API error ${response.status}: ${errorBody || response.statusText}`,
      );
    }

    const data = await response.json();
    text = data.choices?.[0]?.message?.content ?? '';
    inputTokens = data.usage?.prompt_tokens ?? 0;
    outputTokens = data.usage?.completion_tokens ?? 0;
  }

  trackUsage(provider.id, inputTokens, outputTokens);

  return {
    text,
    model: provider.model,
    providerId: provider.id,
    tokensUsed: { input: inputTokens, output: outputTokens },
  };
}
