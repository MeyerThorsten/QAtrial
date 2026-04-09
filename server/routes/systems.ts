import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const systems = new Hono();

systems.use('*', authMiddleware);

async function findAccessibleSystem(id: string, orgId: string | null) {
  if (!orgId) {
    return null;
  }

  return prisma.computerizedSystem.findFirst({
    where: { id, orgId },
  });
}

// List overdue systems (must be before /:id)
systems.get('/overdue', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ message: 'orgId required' }, 400);
    }

    const now = new Date();
    const items = await prisma.computerizedSystem.findMany({
      where: {
        orgId: user.orgId,
        validationStatus: { not: 'retired' },
        nextReviewDate: { lt: now },
      },
      include: { reviews: { orderBy: { reviewDate: 'desc' }, take: 1 } },
      orderBy: { nextReviewDate: 'asc' },
    });

    return c.json({ systems: items });
  } catch (error: any) {
    console.error('List overdue systems error:', error);
    return c.json({ message: 'Failed to list overdue systems' }, 500);
  }
});

// List systems by orgId
systems.get('/', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ message: 'orgId required' }, 400);
    }

    const items = await prisma.computerizedSystem.findMany({
      where: { orgId: user.orgId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ systems: items });
  } catch (error: any) {
    console.error('List systems error:', error);
    return c.json({ message: 'Failed to list systems' }, 500);
  }
});

// Create system
systems.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ message: 'orgId required' }, 400);
    }
    const body = await c.req.json();

    if (!body.name) {
      return c.json({ message: 'name is required' }, 400);
    }

    const validCategories = [1, 3, 4, 5];
    if (body.gampCategory && !validCategories.includes(body.gampCategory)) {
      return c.json({ message: `gampCategory must be one of: ${validCategories.join(', ')}` }, 400);
    }

    const item = await prisma.computerizedSystem.create({
      data: {
        orgId: user.orgId,
        name: body.name,
        vendor: body.vendor ?? '',
        version: body.version ?? '',
        gampCategory: body.gampCategory ?? 4,
        validationStatus: body.validationStatus ?? 'planned',
        riskLevel: body.riskLevel ?? 'medium',
        description: body.description ?? '',
        nextReviewDate: body.nextReviewDate ? new Date(body.nextReviewDate) : null,
      },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'system.created', { system: item });
    }

    return c.json({ system: item }, 201);
  } catch (error: any) {
    console.error('Create system error:', error);
    return c.json({ message: 'Failed to create system' }, 500);
  }
});

// Get single system with reviews
systems.get('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    if (!user.orgId) {
      return c.json({ message: 'orgId required' }, 400);
    }

    const item = await prisma.computerizedSystem.findFirst({
      where: { id, orgId: user.orgId },
      include: { reviews: { orderBy: { reviewDate: 'desc' } } },
    });

    if (!item) {
      return c.json({ message: 'System not found' }, 404);
    }

    return c.json({ system: item });
  } catch (error: any) {
    console.error('Get system error:', error);
    return c.json({ message: 'Failed to get system' }, 500);
  }
});

// Update system
systems.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await findAccessibleSystem(id, user.orgId);
    if (!existing) {
      return c.json({ message: 'System not found' }, 404);
    }

    const item = await prisma.computerizedSystem.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        vendor: body.vendor ?? existing.vendor,
        version: body.version ?? existing.version,
        gampCategory: body.gampCategory ?? existing.gampCategory,
        validationStatus: body.validationStatus ?? existing.validationStatus,
        riskLevel: body.riskLevel ?? existing.riskLevel,
        description: body.description ?? existing.description,
        lastReviewDate: body.lastReviewDate ? new Date(body.lastReviewDate) : existing.lastReviewDate,
        nextReviewDate: body.nextReviewDate ? new Date(body.nextReviewDate) : existing.nextReviewDate,
      },
    });

    return c.json({ system: item });
  } catch (error: any) {
    console.error('Update system error:', error);
    return c.json({ message: 'Failed to update system' }, 500);
  }
});

// Delete system
systems.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await findAccessibleSystem(id, user.orgId);
    if (!existing) {
      return c.json({ message: 'System not found' }, 404);
    }

    await prisma.computerizedSystem.delete({ where: { id } });

    return c.json({ message: 'System deleted' });
  } catch (error: any) {
    console.error('Delete system error:', error);
    return c.json({ message: 'Failed to delete system' }, 500);
  }
});

// Create periodic review
systems.post('/:id/reviews', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const system = await findAccessibleSystem(id, user.orgId);
    if (!system) {
      return c.json({ message: 'System not found' }, 404);
    }

    const review = await prisma.periodicReview.create({
      data: {
        systemId: id,
        reviewDate: body.reviewDate ? new Date(body.reviewDate) : new Date(),
        reviewer: body.reviewer ?? user.userId,
        status: body.status ?? 'scheduled',
        nextReviewDate: body.nextReviewDate ? new Date(body.nextReviewDate) : null,
      },
    });

    return c.json({ review }, 201);
  } catch (error: any) {
    console.error('Create review error:', error);
    return c.json({ message: 'Failed to create review' }, 500);
  }
});

// Update periodic review
systems.put('/:id/reviews/:reviewId', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id, reviewId } = c.req.param();
    const body = await c.req.json();

    const system = await findAccessibleSystem(id, user.orgId);
    if (!system) {
      return c.json({ message: 'System not found' }, 404);
    }

    const existing = await prisma.periodicReview.findUnique({ where: { id: reviewId } });
    if (!existing || existing.systemId !== id) {
      return c.json({ message: 'Review not found' }, 404);
    }

    const review = await prisma.periodicReview.update({
      where: { id: reviewId },
      data: {
        status: body.status ?? existing.status,
        stillInUse: body.stillInUse !== undefined ? body.stillInUse : existing.stillInUse,
        changesNoted: body.changesNoted !== undefined ? body.changesNoted : existing.changesNoted,
        incidentsNoted: body.incidentsNoted !== undefined ? body.incidentsNoted : existing.incidentsNoted,
        regulatoryChanges: body.regulatoryChanges !== undefined ? body.regulatoryChanges : existing.regulatoryChanges,
        accessReviewed: body.accessReviewed !== undefined ? body.accessReviewed : existing.accessReviewed,
        findings: body.findings !== undefined ? body.findings : existing.findings,
        nextReviewDate: body.nextReviewDate ? new Date(body.nextReviewDate) : existing.nextReviewDate,
      },
    });

    // If review completed, update system's review dates
    if (body.status === 'completed') {
      await prisma.computerizedSystem.update({
        where: { id },
        data: {
          lastReviewDate: new Date(),
          nextReviewDate: review.nextReviewDate,
        },
      });
    }

    return c.json({ review });
  } catch (error: any) {
    console.error('Update review error:', error);
    return c.json({ message: 'Failed to update review' }, 500);
  }
});

// Retire system
systems.put('/:id/retire', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await findAccessibleSystem(id, user.orgId);
    if (!existing) {
      return c.json({ message: 'System not found' }, 404);
    }

    const item = await prisma.computerizedSystem.update({
      where: { id },
      data: {
        validationStatus: 'retired',
        retiredDate: new Date(),
      },
    });

    return c.json({ system: item });
  } catch (error: any) {
    console.error('Retire system error:', error);
    return c.json({ message: 'Failed to retire system' }, 500);
  }
});

export default systems;
