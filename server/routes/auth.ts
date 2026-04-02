import { Hono } from 'hono';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../index.js';
import { authMiddleware, getUser, signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../middleware/auth.js';

const auth = new Hono();

auth.post('/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ message: 'Email, password, and name are required' }, 400);
    }

    if (password.length < 8) {
      return c.json({ message: 'Password must be at least 8 characters' }, 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ message: 'Email already registered' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const org = await prisma.organization.create({
      data: { name: `${name}'s Organization` },
    });

    const workspace = await prisma.workspace.create({
      data: { name: 'Default Workspace', orgId: org.id },
    });

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'admin',
        orgId: org.id,
      },
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return c.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, orgId: user.orgId },
      accessToken,
      refreshToken,
      workspaceId: workspace.id,
    }, 201);
  } catch (error: any) {
    console.error('Register error:', error);
    return c.json({ message: 'Registration failed' }, 500);
  }
});

auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ message: 'Email and password are required' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ message: 'Invalid email or password' }, 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return c.json({ message: 'Invalid email or password' }, 401);
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return c.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, orgId: user.orgId },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ message: 'Login failed' }, 500);
  }
});

auth.post('/refresh', async (c) => {
  try {
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
      return c.json({ message: 'Refresh token is required' }, 400);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    return c.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    console.error('Refresh error:', error);
    return c.json({ message: 'Invalid refresh token' }, 401);
  }
});

auth.get('/me', authMiddleware, async (c) => {
  try {
    const jwtUser = getUser(c);
    const user = await prisma.user.findUnique({
      where: { id: jwtUser.userId },
      select: { id: true, email: true, name: true, role: true, orgId: true, createdAt: true },
    });

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error: any) {
    console.error('Me error:', error);
    return c.json({ message: 'Failed to get user info' }, 500);
  }
});

export default auth;
