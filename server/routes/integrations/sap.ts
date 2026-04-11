import { Hono } from 'hono';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../../middleware/auth.js';
import { logAudit } from '../../services/audit.service.js';

const sap = new Hono();

sap.use('*', authMiddleware);

// Connect to SAP QM
sap.post('/connect', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.baseUrl || !body.client || !body.username || !body.password) {
      return c.json({ message: 'baseUrl, client, username, and password are required' }, 400);
    }

    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    // Upsert integration config
    const existing = await prisma.integration.findFirst({
      where: { orgId, type: 'sap_qm' },
    });

    const config = {
      baseUrl: body.baseUrl,
      client: body.client,
      username: body.username,
      // In production, encrypt the password before storage
      password: '***STORED***',
      system: body.system ?? 'PRD',
    };

    let integration;
    if (existing) {
      integration = await prisma.integration.update({
        where: { id: existing.id },
        data: { config, enabled: true },
      });
    } else {
      integration = await prisma.integration.create({
        data: {
          orgId,
          type: 'sap_qm',
          config,
          enabled: true,
        },
      });
    }

    return c.json({
      message: 'SAP QM connection configured',
      integration: {
        id: integration.id,
        type: integration.type,
        enabled: integration.enabled,
        baseUrl: body.baseUrl,
        client: body.client,
        system: body.system ?? 'PRD',
      },
    });
  } catch (error: any) {
    console.error('SAP connect error:', error);
    return c.json({ message: 'Failed to configure SAP connection' }, 500);
  }
});

// Connection status
sap.get('/status', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ connected: false });

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'sap_qm' },
    });

    if (!integration || !integration.enabled) {
      return c.json({ connected: false });
    }

    const config = integration.config as Record<string, any>;
    return c.json({
      connected: true,
      baseUrl: config.baseUrl,
      client: config.client,
      system: config.system,
      lastSyncAt: integration.lastSyncAt,
    });
  } catch (error: any) {
    console.error('SAP status error:', error);
    return c.json({ connected: false });
  }
});

// Sync batch inspection data from SAP QM
sap.post('/sync-batches', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    const body = await c.req.json();
    const projectId = body.projectId;
    if (!projectId) return c.json({ message: 'projectId is required' }, 400);

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'sap_qm', enabled: true },
    });

    if (!integration) {
      return c.json({ message: 'SAP QM not connected' }, 400);
    }

    const config = integration.config as Record<string, any>;

    // Placeholder: In production, this would call SAP OData/RFC
    // e.g. GET ${config.baseUrl}/sap/opu/odata/sap/API_BATCH_SRV/A_Batch?$filter=Material eq '...'
    // For now, simulate fetching and return a sync summary
    const syncResult = {
      batchesChecked: 0,
      batchesCreated: 0,
      batchesUpdated: 0,
      errors: [] as string[],
    };

    // Update last sync timestamp
    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'import',
      entityType: 'sap_batch_sync',
      entityId: integration.id,
      newValue: syncResult,
    });

    return c.json({ message: 'Batch sync completed', ...syncResult });
  } catch (error: any) {
    console.error('SAP sync batches error:', error);
    return c.json({ message: 'Failed to sync batches from SAP' }, 500);
  }
});

// Sync supplier master data from SAP
sap.post('/sync-suppliers', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'sap_qm', enabled: true },
    });

    if (!integration) {
      return c.json({ message: 'SAP QM not connected' }, 400);
    }

    // Placeholder: call SAP Business Partner API
    // GET ${config.baseUrl}/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier
    const syncResult = {
      suppliersChecked: 0,
      suppliersCreated: 0,
      suppliersUpdated: 0,
      errors: [] as string[],
    };

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    return c.json({ message: 'Supplier sync completed', ...syncResult });
  } catch (error: any) {
    console.error('SAP sync suppliers error:', error);
    return c.json({ message: 'Failed to sync suppliers from SAP' }, 500);
  }
});

// Sync material data from SAP
sap.post('/sync-materials', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'sap_qm', enabled: true },
    });

    if (!integration) {
      return c.json({ message: 'SAP QM not connected' }, 400);
    }

    // Placeholder: call SAP Material Master API
    // GET ${config.baseUrl}/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product
    const syncResult = {
      materialsChecked: 0,
      materialsCreated: 0,
      materialsUpdated: 0,
      errors: [] as string[],
    };

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    return c.json({ message: 'Material sync completed', ...syncResult });
  } catch (error: any) {
    console.error('SAP sync materials error:', error);
    return c.json({ message: 'Failed to sync materials from SAP' }, 500);
  }
});

export default sap;
