import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const udi = new Hono();

udi.use('*', authMiddleware);

// GUDID export (must be before /:id)
udi.get('/gudid-export', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.uDI.findMany({ where: { projectId } });

    const gudidData = items.map((item) => ({
      deviceIdentifier: item.deviceIdentifier,
      deviceDescription: item.deviceDescription,
      brandName: item.brandName,
      versionModelNumber: item.versionModelNo,
      companyName: item.companyName,
      productionIdentifier: item.productionId,
      labeledContains: item.labelContent ? JSON.parse(item.labelContent) : null,
      devicePublishDate: item.createdAt.toISOString(),
      gudidSubmitted: item.gudidSubmitted,
    }));

    return c.json({ gudidExport: gudidData, count: gudidData.length });
  } catch (error: any) {
    console.error('GUDID export error:', error);
    return c.json({ message: 'Failed to export GUDID data' }, 500);
  }
});

// EUDAMED export
udi.get('/eudamed-export', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.uDI.findMany({ where: { projectId } });

    const eudamedData = items.map((item) => ({
      udiDi: item.deviceIdentifier,
      productName: item.productName,
      manufacturerName: item.companyName,
      brandName: item.brandName,
      model: item.versionModelNo,
      description: item.deviceDescription,
      productionIdentifier: item.productionId,
      eudamedRegistered: item.eudamedRegistered,
      registrationDate: item.createdAt.toISOString(),
    }));

    return c.json({ eudamedExport: eudamedData, count: eudamedData.length });
  } catch (error: any) {
    console.error('EUDAMED export error:', error);
    return c.json({ message: 'Failed to export EUDAMED data' }, 500);
  }
});

// List UDIs by projectId
udi.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.uDI.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ udis: items });
  } catch (error: any) {
    console.error('List UDIs error:', error);
    return c.json({ message: 'Failed to list UDIs' }, 500);
  }
});

// Create UDI
udi.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.deviceIdentifier || !body.productName) {
      return c.json({ message: 'projectId, deviceIdentifier, and productName are required' }, 400);
    }

    const item = await prisma.uDI.create({
      data: {
        projectId: body.projectId,
        deviceIdentifier: body.deviceIdentifier,
        productionId: body.productionId ?? null,
        productName: body.productName,
        deviceDescription: body.deviceDescription ?? '',
        brandName: body.brandName ?? '',
        versionModelNo: body.versionModelNo ?? '',
        companyName: body.companyName ?? '',
        gudidSubmitted: body.gudidSubmitted ?? false,
        eudamedRegistered: body.eudamedRegistered ?? false,
        labelContent: body.labelContent ? JSON.stringify(body.labelContent) : null,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'udi',
      entityId: item.id,
      newValue: item,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'udi.created', { udi: item });
    }

    return c.json({ udi: item }, 201);
  } catch (error: any) {
    console.error('Create UDI error:', error);
    return c.json({ message: 'Failed to create UDI' }, 500);
  }
});

// Get single UDI
udi.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const item = await prisma.uDI.findUnique({ where: { id } });

    if (!item) {
      return c.json({ message: 'UDI not found' }, 404);
    }

    return c.json({ udi: item });
  } catch (error: any) {
    console.error('Get UDI error:', error);
    return c.json({ message: 'Failed to get UDI' }, 500);
  }
});

// Update UDI
udi.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.uDI.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'UDI not found' }, 404);
    }

    const item = await prisma.uDI.update({
      where: { id },
      data: {
        deviceIdentifier: body.deviceIdentifier ?? existing.deviceIdentifier,
        productionId: body.productionId !== undefined ? body.productionId : existing.productionId,
        productName: body.productName ?? existing.productName,
        deviceDescription: body.deviceDescription ?? existing.deviceDescription,
        brandName: body.brandName ?? existing.brandName,
        versionModelNo: body.versionModelNo ?? existing.versionModelNo,
        companyName: body.companyName ?? existing.companyName,
        gudidSubmitted: body.gudidSubmitted !== undefined ? body.gudidSubmitted : existing.gudidSubmitted,
        eudamedRegistered: body.eudamedRegistered !== undefined ? body.eudamedRegistered : existing.eudamedRegistered,
        labelContent: body.labelContent ? JSON.stringify(body.labelContent) : existing.labelContent,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'udi',
      entityId: item.id,
      previousValue: existing,
      newValue: item,
    });

    return c.json({ udi: item });
  } catch (error: any) {
    console.error('Update UDI error:', error);
    return c.json({ message: 'Failed to update UDI' }, 500);
  }
});

// Delete UDI
udi.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.uDI.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'UDI not found' }, 404);
    }

    await prisma.uDI.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'udi',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'UDI deleted' });
  } catch (error: any) {
    console.error('Delete UDI error:', error);
    return c.json({ message: 'Failed to delete UDI' }, 500);
  }
});

export default udi;
