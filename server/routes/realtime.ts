import { Hono } from 'hono';
import { JWT_SECRET } from '../middleware/auth.js';
import { realtimeService } from '../services/realtime.service.js';

const realtime = new Hono();

// SSE endpoint - auth via query param for EventSource compatibility
realtime.get('/events', async (c) => {
  // EventSource doesn't support custom headers, so accept token as query param
  const token = c.req.query('token');
  const projectId = c.req.query('projectId');

  if (!token || !projectId) {
    return c.json({ message: 'token and projectId query params required' }, 400);
  }

  // Verify token manually
  let userId = 'anonymous';
  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type === 'refresh') {
      return c.json({ message: 'Cannot use refresh token for API access' }, 401);
    }
    userId = decoded.userId || 'anonymous';
  } catch {
    return c.json({ message: 'Invalid token' }, 401);
  }

  const clientId = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return realtimeService.createSSEStream(c, clientId, userId, projectId);
});

export default realtime;
