import { Hono } from 'hono';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, requireRole, requirePermission, getUser, VALID_ROLES } from '../middleware/auth.js';

const users = new Hono();

users.use('*', authMiddleware);

function deriveDisplayName(email: string): string {
  const localPart = email.split('@')[0] || 'User';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'User';
}

users.get('/team', async (c) => {
  try {
    const user = getUser(c);

    if (!user.orgId) {
      return c.json({ orgName: 'Organization', members: [] });
    }

    const [org, members] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: user.orgId },
        select: { name: true },
      }),
      prisma.user.findMany({
        where: { orgId: user.orgId },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return c.json({
      orgName: org?.name ?? 'Organization',
      members,
    });
  } catch (error: any) {
    console.error('Load team error:', error);
    return c.json({ message: 'Failed to load team' }, 500);
  }
});

users.get('/', async (c) => {
  try {
    const user = getUser(c);

    if (!user.orgId) {
      return c.json({ users: [] });
    }

    const items = await prisma.user.findMany({
      where: { orgId: user.orgId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return c.json({ users: items });
  } catch (error: any) {
    console.error('List users error:', error);
    return c.json({ message: 'Failed to list users' }, 500);
  }
});

// All valid roles including legacy for backward compat
const ALL_VALID_ROLES = [...VALID_ROLES, 'editor', 'viewer'];

users.post('/invite', requirePermission('canAdmin'), async (c) => {
  try {
    const currentUser = getUser(c);
    const body = await c.req.json();

    if (!body.email) {
      return c.json({ message: 'Email is required' }, 400);
    }

    const requestedRole = body.role ?? 'qa_engineer';
    if (!ALL_VALID_ROLES.includes(requestedRole)) {
      return c.json({
        message: `Invalid role. Valid roles: ${VALID_ROLES.join(', ')}`,
      }, 400);
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return c.json({ message: 'User with this email already exists' }, 409);
    }

    // Generate a temporary password; in production, send an email invite instead
    const tempPassword = crypto.randomUUID().slice(0, 12);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const inviteeName = typeof body.name === 'string' && body.name.trim().length > 0
      ? body.name.trim()
      : deriveDisplayName(body.email);

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: inviteeName,
        role: requestedRole,
        orgId: currentUser.orgId,
      },
    });

    return c.json({
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      temporaryPassword: tempPassword,
    }, 201);
  } catch (error: any) {
    console.error('Invite user error:', error);
    return c.json({ message: 'Failed to invite user' }, 500);
  }
});

users.put('/:id/role', requirePermission('canAdmin'), async (c) => {
  try {
    const currentUser = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    if (!body.role || !ALL_VALID_ROLES.includes(body.role)) {
      return c.json({
        message: `Valid role is required. Options: ${VALID_ROLES.join(', ')}`,
      }, 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return c.json({ message: 'User not found' }, 404);
    }

    if (targetUser.orgId !== currentUser.orgId) {
      return c.json({ message: 'Cannot modify users outside your organization' }, 403);
    }

    if (targetUser.id === currentUser.userId && body.role !== 'admin') {
      return c.json({ message: 'Cannot demote yourself' }, 400);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: body.role },
      select: { id: true, email: true, name: true, role: true },
    });

    return c.json({ user: updated });
  } catch (error: any) {
    console.error('Update user role error:', error);
    return c.json({ message: 'Failed to update user role' }, 500);
  }
});

export default users;
