import { Hono } from 'hono';
import { authMiddleware, getUser, requireRole } from '../middleware/auth.js';

const aiRoutes = new Hono();

aiRoutes.use('*', authMiddleware);

// ── Environment-based provider config ──────────────────────────────────────

interface ServerProvider {
  id: string;
  name: string;
  type: 'anthropic' | 'openai-compatible';
  baseUrl: string;
  apiKey: string;
  model: string;
}

function getServerProvider(): ServerProvider | null {
  const type = process.env.AI_PROVIDER_TYPE;
  const key = process.env.AI_PROVIDER_KEY;
  const model = process.env.AI_PROVIDER_MODEL;

  if (!type || !key || !model) return null;

  const baseUrl = process.env.AI_PROVIDER_URL ?? (
    type === 'anthropic'
      ? 'https://api.anthropic.com'
      : 'https://api.openai.com/v1'
  );

  return {
    id: 'env-provider',
    name: `${type} (env)`,
    type: type as 'anthropic' | 'openai-compatible',
    baseUrl,
    apiKey: key,
    model,
  };
}

// ── LLM completion logic (mirrors client.ts) ───────────────────────────────

async function llmComplete(
  provider: ServerProvider,
  prompt: string,
  maxTokens: number = 2048,
  temperature: number = 0.3,
): Promise<{ text: string; model: string; tokensUsed: { input: number; output: number } }> {
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
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Anthropic API error ${response.status}: ${errorBody || response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.content?.[0]?.text ?? '',
      model: provider.model,
      tokensUsed: {
        input: data.usage?.input_tokens ?? 0,
        output: data.usage?.output_tokens ?? 0,
      },
    };
  } else {
    // openai-compatible
    const url = `${provider.baseUrl.replace(/\/$/, '')}/chat/completions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`OpenAI-compatible API error ${response.status}: ${errorBody || response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content ?? '',
      model: provider.model,
      tokensUsed: {
        input: data.usage?.prompt_tokens ?? 0,
        output: data.usage?.completion_tokens ?? 0,
      },
    };
  }
}

// ── POST /complete ─────────────────────────────────────────────────────────

aiRoutes.post('/complete', async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, purpose, maxTokens, temperature } = body;

    if (!prompt) {
      return c.json({ message: 'prompt is required' }, 400);
    }

    const provider = getServerProvider();
    if (!provider) {
      return c.json(
        { message: 'No AI provider configured. Set AI_PROVIDER_TYPE, AI_PROVIDER_KEY, and AI_PROVIDER_MODEL environment variables.' },
        503,
      );
    }

    const result = await llmComplete(provider, prompt, maxTokens, temperature);

    return c.json({
      text: result.text,
      model: result.model,
      providerId: provider.id,
      tokensUsed: result.tokensUsed,
    });
  } catch (error: any) {
    console.error('AI complete error:', error);
    return c.json({ message: error.message || 'AI completion failed' }, 500);
  }
});

// ── GET /providers ─────────────────────────────────────────────────────────

aiRoutes.get('/providers', async (c) => {
  try {
    const provider = getServerProvider();
    if (!provider) {
      return c.json({ providers: [] });
    }

    // Return provider info WITHOUT the api key
    return c.json({
      providers: [
        {
          id: provider.id,
          name: provider.name,
          type: provider.type,
          baseUrl: provider.baseUrl,
          model: provider.model,
          hasKey: true,
        },
      ],
    });
  } catch (error: any) {
    console.error('List providers error:', error);
    return c.json({ message: 'Failed to list providers' }, 500);
  }
});

// ── POST /providers ────────────────────────────────────────────────────────

aiRoutes.post('/providers', requireRole('admin', 'owner'), async (c) => {
  try {
    // Since we use env vars, this endpoint documents how to configure.
    // In a future version this would store to DB.
    return c.json({
      message: 'Provider configuration is managed via environment variables: AI_PROVIDER_TYPE, AI_PROVIDER_URL, AI_PROVIDER_KEY, AI_PROVIDER_MODEL',
      envVars: {
        AI_PROVIDER_TYPE: process.env.AI_PROVIDER_TYPE ?? '(not set)',
        AI_PROVIDER_URL: process.env.AI_PROVIDER_URL ?? '(not set)',
        AI_PROVIDER_MODEL: process.env.AI_PROVIDER_MODEL ?? '(not set)',
        AI_PROVIDER_KEY: process.env.AI_PROVIDER_KEY ? '***configured***' : '(not set)',
      },
    });
  } catch (error: any) {
    console.error('Add provider error:', error);
    return c.json({ message: 'Failed to configure provider' }, 500);
  }
});

// ── DELETE /providers/:id ──────────────────────────────────────────────────

aiRoutes.delete('/providers/:id', requireRole('admin', 'owner'), async (c) => {
  try {
    return c.json({
      message: 'Provider configuration is managed via environment variables. Remove AI_PROVIDER_* env vars to disable.',
    });
  } catch (error: any) {
    console.error('Delete provider error:', error);
    return c.json({ message: 'Failed to delete provider' }, 500);
  }
});

// ── POST /providers/:id/test ───────────────────────────────────────────────

aiRoutes.post('/providers/:id/test', async (c) => {
  try {
    const provider = getServerProvider();
    if (!provider) {
      return c.json({ ok: false, error: 'No provider configured' }, 503);
    }

    const start = performance.now();
    try {
      const result = await llmComplete(provider, 'Respond with exactly: OK', 10, 0);
      const latencyMs = Math.round(performance.now() - start);
      return c.json({ ok: true, latencyMs, model: result.model, text: result.text });
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return c.json({ ok: false, latencyMs, error: err.message });
    }
  } catch (error: any) {
    console.error('Test provider error:', error);
    return c.json({ message: 'Failed to test provider' }, 500);
  }
});

export default aiRoutes;
