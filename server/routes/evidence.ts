import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const evidence = new Hono();

evidence.use('*', authMiddleware);

const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// POST /upload — multipart form upload
evidence.post('/upload', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.parseBody();

    const projectId = body['projectId'] as string;
    const entityType = body['entityType'] as string;
    const entityId = body['entityId'] as string;
    const description = (body['description'] as string) ?? '';
    const file = body['file'];

    if (!projectId || !entityType || !entityId) {
      return c.json({ message: 'projectId, entityType, and entityId are required' }, 400);
    }

    if (!file || !(file instanceof File)) {
      return c.json({ message: 'file is required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const uploadDir = path.join(UPLOADS_ROOT, projectId);
    ensureDir(uploadDir);

    const fileId = randomUUID();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = path.join(uploadDir, `${fileId}-${safeFileName}`);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(storagePath, Buffer.from(arrayBuffer));

    // Determine version: count existing evidence for same entity + fileName
    const existingCount = await prisma.evidence.count({
      where: { projectId, entityType, entityId, fileName: file.name },
    });

    const record = await prisma.evidence.create({
      data: {
        projectId,
        entityType,
        entityId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        storagePath,
        description,
        version: existingCount + 1,
        uploadedBy: user.userId,
      },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'upload_evidence',
      entityType: 'evidence',
      entityId: record.id,
      newValue: { fileName: file.name, entityType, entityId },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'evidence.uploaded', { evidence: record });
    }

    return c.json({ evidence: record }, 201);
  } catch (error: any) {
    console.error('Upload evidence error:', error);
    return c.json({ message: 'Failed to upload evidence' }, 500);
  }
});

// GET / — list evidence for entity
evidence.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    const entityId = c.req.query('entityId');
    const entityType = c.req.query('entityType');

    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const accessibleProject = await findAccessibleProject(projectId, user.orgId);
    if (!accessibleProject) {
      return c.json({ evidence: [] });
    }

    const where: any = { projectId };
    if (entityId) where.entityId = entityId;
    if (entityType) where.entityType = entityType;

    const items = await prisma.evidence.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ evidence: items });
  } catch (error: any) {
    console.error('List evidence error:', error);
    return c.json({ message: 'Failed to list evidence' }, 500);
  }
});

// GET /completeness — evidence completeness stats
evidence.get('/completeness', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const accessibleProject = await findAccessibleProject(projectId, user.orgId);
    if (!accessibleProject) {
      return c.json({
        summary: { requirements: { total: 0, withEvidence: 0 }, tests: { total: 0, withEvidence: 0 } },
        requirements: [],
        tests: [],
      });
    }

    const requirements = await prisma.requirement.findMany({
      where: { projectId },
      select: { id: true, seqId: true, title: true },
    });

    const tests = await prisma.test.findMany({
      where: { projectId },
      select: { id: true, seqId: true, title: true },
    });

    const evidenceRecords = await prisma.evidence.findMany({
      where: { projectId },
      select: { entityType: true, entityId: true },
    });

    const evidenceSet = new Set(
      evidenceRecords.map((e) => `${e.entityType}:${e.entityId}`)
    );

    const requirementStats = requirements.map((r) => ({
      id: r.id,
      seqId: r.seqId,
      title: r.title,
      hasEvidence: evidenceSet.has(`requirement:${r.id}`),
    }));

    const testStats = tests.map((t) => ({
      id: t.id,
      seqId: t.seqId,
      title: t.title,
      hasEvidence: evidenceSet.has(`test:${t.id}`),
    }));

    const totalRequirements = requirements.length;
    const coveredRequirements = requirementStats.filter((r) => r.hasEvidence).length;
    const totalTests = tests.length;
    const coveredTests = testStats.filter((t) => t.hasEvidence).length;

    return c.json({
      summary: {
        requirements: { total: totalRequirements, withEvidence: coveredRequirements },
        tests: { total: totalTests, withEvidence: coveredTests },
      },
      requirements: requirementStats,
      tests: testStats,
    });
  } catch (error: any) {
    console.error('Evidence completeness error:', error);
    return c.json({ message: 'Failed to get evidence completeness' }, 500);
  }
});

// GET /:id/download — stream file download
evidence.get('/:id/download', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const record = await prisma.evidence.findUnique({ where: { id } });

    if (!record) {
      return c.json({ message: 'Evidence not found' }, 404);
    }

    const accessibleProject = await findAccessibleProject(record.projectId, user.orgId);
    if (!accessibleProject) {
      return c.json({ message: 'Evidence not found' }, 404);
    }

    if (!fs.existsSync(record.storagePath)) {
      return c.json({ message: 'File not found on disk' }, 404);
    }

    const fileBuffer = fs.readFileSync(record.storagePath);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': record.mimeType,
        'Content-Disposition': `attachment; filename="${record.fileName}"`,
        'Content-Length': String(record.fileSize),
      },
    });
  } catch (error: any) {
    console.error('Download evidence error:', error);
    return c.json({ message: 'Failed to download evidence' }, 500);
  }
});

// DELETE /:id — delete file + record
evidence.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const record = await prisma.evidence.findUnique({ where: { id } });
    if (!record) {
      return c.json({ message: 'Evidence not found' }, 404);
    }

    const accessibleProject = await findAccessibleProject(record.projectId, user.orgId);
    if (!accessibleProject) {
      return c.json({ message: 'Evidence not found' }, 404);
    }

    // Delete file from disk
    if (fs.existsSync(record.storagePath)) {
      fs.unlinkSync(record.storagePath);
    }

    await prisma.evidence.delete({ where: { id } });

    await logAudit({
      projectId: record.projectId,
      userId: user.userId,
      action: 'delete_evidence',
      entityType: 'evidence',
      entityId: id,
      previousValue: { fileName: record.fileName, entityType: record.entityType, entityId: record.entityId },
    });

    return c.json({ message: 'Evidence deleted' });
  } catch (error: any) {
    console.error('Delete evidence error:', error);
    return c.json({ message: 'Failed to delete evidence' }, 500);
  }
});

export default evidence;
