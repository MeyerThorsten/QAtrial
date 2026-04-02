import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import * as crypto from 'crypto';

const webhooks = new Hono();

webhooks.use('*', authMiddleware);

// GET / — list webhooks for org
webhooks.get('/', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ webhooks: [] });
    }

    const items = await prisma.webhook.findMany({
      where: { orgId: user.orgId },
      orderBy: { createdAt: 'desc' },
    });

    // Mask secrets in response
    const masked = items.map((w) => ({
      ...w,
      secret: w.secret ? '********' : '',
    }));

    return c.json({ webhooks: masked });
  } catch (error: any) {
    console.error('List webhooks error:', error);
    return c.json({ message: 'Failed to list webhooks' }, 500);
  }
});

// POST / — create webhook
webhooks.post('/', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.name || !body.url) {
      return c.json({ message: 'name and url are required' }, 400);
    }

    if (!user.orgId) {
      return c.json({ message: 'User must belong to an organization' }, 400);
    }

    // Validate URL format
    try {
      new URL(body.url);
    } catch {
      return c.json({ message: 'Invalid URL format' }, 400);
    }

    const webhook = await prisma.webhook.create({
      data: {
        orgId: user.orgId,
        name: body.name,
        url: body.url,
        secret: body.secret || '',
        events: body.events || [],
        enabled: body.enabled !== false,
      },
    });

    return c.json({ webhook }, 201);
  } catch (error: any) {
    console.error('Create webhook error:', error);
    return c.json({ message: 'Failed to create webhook' }, 500);
  }
});

// PUT /:id — update webhook
webhooks.put('/:id', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.webhook.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Webhook not found' }, 404);
    }

    if (existing.orgId !== user.orgId) {
      return c.json({ message: 'Forbidden' }, 403);
    }

    if (body.url) {
      try {
        new URL(body.url);
      } catch {
        return c.json({ message: 'Invalid URL format' }, 400);
      }
    }

    const webhook = await prisma.webhook.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        url: body.url ?? existing.url,
        secret: body.secret !== undefined ? body.secret : existing.secret,
        events: body.events ?? existing.events,
        enabled: body.enabled !== undefined ? body.enabled : existing.enabled,
      },
    });

    return c.json({ webhook });
  } catch (error: any) {
    console.error('Update webhook error:', error);
    return c.json({ message: 'Failed to update webhook' }, 500);
  }
});

// DELETE /:id — delete webhook
webhooks.delete('/:id', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.webhook.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Webhook not found' }, 404);
    }

    if (existing.orgId !== user.orgId) {
      return c.json({ message: 'Forbidden' }, 403);
    }

    await prisma.webhook.delete({ where: { id } });
    return c.json({ message: 'Webhook deleted' });
  } catch (error: any) {
    console.error('Delete webhook error:', error);
    return c.json({ message: 'Failed to delete webhook' }, 500);
  }
});

// POST /:id/test — send test event
webhooks.post('/:id/test', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const webhook = await prisma.webhook.findUnique({ where: { id } });
    if (!webhook) {
      return c.json({ message: 'Webhook not found' }, 404);
    }

    if (webhook.orgId !== user.orgId) {
      return c.json({ message: 'Forbidden' }, 403);
    }

    const body = JSON.stringify({
      event: 'webhook.test',
      timestamp: new Date().toISOString(),
      payload: {
        message: 'This is a test webhook from QAtrial',
        webhookId: webhook.id,
        webhookName: webhook.name,
      },
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'QAtrial-Webhook/1.0',
    };

    if (webhook.secret) {
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(body)
        .digest('hex');
      headers['X-QAtrial-Signature'] = signature;
    }

    const res = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(10_000),
    });

    await prisma.webhook.update({
      where: { id },
      data: {
        lastTriggered: new Date(),
        lastStatus: res.status,
      },
    });

    return c.json({
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
    });
  } catch (error: any) {
    console.error('Test webhook error:', error);
    return c.json({
      success: false,
      status: 0,
      statusText: error.message || 'Network error',
    }, 500);
  }
});

export default webhooks;
