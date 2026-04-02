import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';
import * as bcrypt from 'bcryptjs';

const signatures = new Hono();

signatures.use('*', authMiddleware);

// POST / — create signature (re-verify password per 21 CFR Part 11)
signatures.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const { projectId, entityType, entityId, meaning, reason, password } = body;

    if (!projectId || !entityType || !entityId || !meaning || !reason || !password) {
      return c.json({
        message: 'projectId, entityType, entityId, meaning, reason, and password are required',
      }, 400);
    }

    const validMeanings = ['authored', 'reviewed', 'approved', 'verified', 'rejected'];
    if (!validMeanings.includes(meaning)) {
      return c.json({ message: `meaning must be one of: ${validMeanings.join(', ')}` }, 400);
    }

    // Re-verify password: fetch user from DB and compare with bcrypt
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser) {
      return c.json({ message: 'User not found' }, 404);
    }

    const passwordValid = await bcrypt.compare(password, dbUser.passwordHash);
    if (!passwordValid) {
      return c.json({ message: 'Invalid password — signature rejected' }, 403);
    }

    // Create immutable signature record
    const signature = await prisma.signature.create({
      data: {
        projectId,
        userId: user.userId,
        userName: dbUser.name,
        userRole: user.role,
        meaning,
        reason,
        method: 'password',
        entityType,
        entityId,
      },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'create_signature',
      entityType: 'signature',
      entityId: signature.id,
      newValue: {
        meaning,
        entityType,
        entityId,
        userName: dbUser.name,
      },
      reason,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'signature.created', { signature });
    }

    return c.json({ signature }, 201);
  } catch (error: any) {
    console.error('Create signature error:', error);
    return c.json({ message: 'Failed to create signature' }, 500);
  }
});

// GET / — list signatures for entity
signatures.get('/', async (c) => {
  try {
    const entityId = c.req.query('entityId');
    const entityType = c.req.query('entityType');
    const projectId = c.req.query('projectId');

    if (!entityId) {
      return c.json({ message: 'entityId query parameter is required' }, 400);
    }

    const where: any = { entityId };
    if (entityType) where.entityType = entityType;
    if (projectId) where.projectId = projectId;

    const items = await prisma.signature.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    });

    return c.json({ signatures: items });
  } catch (error: any) {
    console.error('List signatures error:', error);
    return c.json({ message: 'Failed to list signatures' }, 500);
  }
});

// GET /:id — get single signature with full details
signatures.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const signature = await prisma.signature.findUnique({ where: { id } });

    if (!signature) {
      return c.json({ message: 'Signature not found' }, 404);
    }

    return c.json({ signature });
  } catch (error: any) {
    console.error('Get signature error:', error);
    return c.json({ message: 'Failed to get signature' }, 500);
  }
});

// No update or delete endpoints — signatures are IMMUTABLE

export default signatures;
