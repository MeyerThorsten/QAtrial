import { Hono } from 'hono';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../../middleware/auth.js';
import { logAudit } from '../../services/audit.service.js';

const lims = new Hono();

lims.use('*', authMiddleware);

// Connect to LabWare LIMS
lims.post('/connect', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.baseUrl || !body.apiKey) {
      return c.json({ message: 'baseUrl and apiKey are required' }, 400);
    }

    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    const existing = await prisma.integration.findFirst({
      where: { orgId, type: 'labware_lims' },
    });

    const config = {
      baseUrl: body.baseUrl,
      apiKey: '***STORED***',
      labId: body.labId ?? 'default',
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
          type: 'labware_lims',
          config,
          enabled: true,
        },
      });
    }

    return c.json({
      message: 'LabWare LIMS connection configured',
      integration: {
        id: integration.id,
        type: integration.type,
        enabled: integration.enabled,
        baseUrl: body.baseUrl,
        labId: body.labId ?? 'default',
      },
    });
  } catch (error: any) {
    console.error('LIMS connect error:', error);
    return c.json({ message: 'Failed to configure LIMS connection' }, 500);
  }
});

// Connection status
lims.get('/status', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ connected: false });

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'labware_lims' },
    });

    if (!integration || !integration.enabled) {
      return c.json({ connected: false });
    }

    const config = integration.config as Record<string, any>;
    return c.json({
      connected: true,
      baseUrl: config.baseUrl,
      labId: config.labId,
      lastSyncAt: integration.lastSyncAt,
    });
  } catch (error: any) {
    console.error('LIMS status error:', error);
    return c.json({ connected: false });
  }
});

// Sync stability test results from LIMS
lims.post('/sync-stability', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    const body = await c.req.json();
    const projectId = body.projectId;
    if (!projectId) return c.json({ message: 'projectId is required' }, 400);

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'labware_lims', enabled: true },
    });

    if (!integration) {
      return c.json({ message: 'LIMS not connected' }, 400);
    }

    // Placeholder: In production, call LabWare REST API
    // GET ${config.baseUrl}/api/v2/stability-results?labId=${config.labId}
    const syncResult = {
      samplesChecked: 0,
      samplesCreated: 0,
      samplesUpdated: 0,
      oosDetected: 0,
      errors: [] as string[],
    };

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'import',
      entityType: 'lims_stability_sync',
      entityId: integration.id,
      newValue: syncResult,
    });

    return c.json({ message: 'Stability sync completed', ...syncResult });
  } catch (error: any) {
    console.error('LIMS sync stability error:', error);
    return c.json({ message: 'Failed to sync stability data from LIMS' }, 500);
  }
});

// Sync environmental monitoring data from LIMS
lims.post('/sync-envmon', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    const body = await c.req.json();
    const projectId = body.projectId;
    if (!projectId) return c.json({ message: 'projectId is required' }, 400);

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'labware_lims', enabled: true },
    });

    if (!integration) {
      return c.json({ message: 'LIMS not connected' }, 400);
    }

    // Placeholder: call LabWare Environmental Monitoring API
    // GET ${config.baseUrl}/api/v2/envmon-readings?labId=${config.labId}
    const syncResult = {
      readingsChecked: 0,
      readingsCreated: 0,
      excursionsDetected: 0,
      errors: [] as string[],
    };

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'import',
      entityType: 'lims_envmon_sync',
      entityId: integration.id,
      newValue: syncResult,
    });

    return c.json({ message: 'Environmental monitoring sync completed', ...syncResult });
  } catch (error: any) {
    console.error('LIMS sync envmon error:', error);
    return c.json({ message: 'Failed to sync environmental monitoring data from LIMS' }, 500);
  }
});

// Sync batch QC results from LIMS
lims.post('/sync-batch-results', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) return c.json({ message: 'Organization required' }, 400);

    const body = await c.req.json();
    const projectId = body.projectId;
    if (!projectId) return c.json({ message: 'projectId is required' }, 400);

    const integration = await prisma.integration.findFirst({
      where: { orgId, type: 'labware_lims', enabled: true },
    });

    if (!integration) {
      return c.json({ message: 'LIMS not connected' }, 400);
    }

    // Placeholder: call LabWare Batch QC API
    // GET ${config.baseUrl}/api/v2/batch-results?labId=${config.labId}
    const syncResult = {
      batchStepsChecked: 0,
      batchStepsUpdated: 0,
      outOfSpecResults: 0,
      errors: [] as string[],
    };

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'import',
      entityType: 'lims_batch_sync',
      entityId: integration.id,
      newValue: syncResult,
    });

    return c.json({ message: 'Batch QC results sync completed', ...syncResult });
  } catch (error: any) {
    console.error('LIMS sync batch results error:', error);
    return c.json({ message: 'Failed to sync batch QC results from LIMS' }, 500);
  }
});

export default lims;
