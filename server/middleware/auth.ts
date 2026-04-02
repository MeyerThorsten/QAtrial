import type { Context, Next } from 'hono';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'qatrial-dev-secret-change-in-production';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  orgId: string | null;
}

// Helper to get the user from context (stored as a plain property to avoid Hono generic complexity)
export function getUser(c: Context): JwtPayload {
  return (c as any)._user as JwtPayload;
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { type?: string };
    if (decoded.type === 'refresh') {
      return c.json({ message: 'Cannot use refresh token for API access' }, 401);
    }
    (c as any)._user = decoded;
    await next();
  } catch {
    return c.json({ message: 'Invalid or expired token' }, 401);
  }
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ message: 'Authentication required' }, 401);
    }
    if (!roles.includes(user.role)) {
      return c.json({ message: `Requires one of roles: ${roles.join(', ')}` }, 403);
    }
    await next();
  };
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { type?: string };
  if (decoded.type !== 'refresh') {
    throw new Error('Not a refresh token');
  }
  return decoded;
}
