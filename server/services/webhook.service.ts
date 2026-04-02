import { prisma } from '../index.js';
import * as crypto from 'crypto';

/**
 * Dispatch a webhook event to all matching enabled webhooks for the given org.
 * Fire-and-forget: logs failures but never throws.
 */
export async function dispatchWebhook(
  orgId: string,
  event: string,
  payload: any,
): Promise<void> {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: {
        orgId,
        enabled: true,
        events: { has: event },
      },
    });

    if (webhooks.length === 0) return;

    const promises = webhooks.map(async (webhook) => {
      const body = JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        payload,
      });

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'QAtrial-Webhook/1.0',
      };

      // If secret is configured, add HMAC-SHA256 signature
      if (webhook.secret) {
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(body)
          .digest('hex');
        headers['X-QAtrial-Signature'] = signature;
      }

      try {
        const res = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body,
          signal: AbortSignal.timeout(10_000), // 10s timeout
        });

        await prisma.webhook.update({
          where: { id: webhook.id },
          data: {
            lastTriggered: new Date(),
            lastStatus: res.status,
          },
        });
      } catch (err: any) {
        console.error(`Webhook delivery failed for ${webhook.id} (${webhook.url}):`, err.message);
        await prisma.webhook.update({
          where: { id: webhook.id },
          data: {
            lastTriggered: new Date(),
            lastStatus: 0, // 0 indicates network error
          },
        }).catch(() => {}); // Don't fail if update fails
      }
    });

    // Fire all in parallel, don't await blocking
    Promise.allSettled(promises).catch(() => {});
  } catch (err: any) {
    console.error('dispatchWebhook error:', err.message);
  }
}
