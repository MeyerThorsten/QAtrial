import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const documents = new Hono();

documents.use('*', authMiddleware);

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['in_review'],
  in_review: ['approved', 'draft'],
  approved: ['effective', 'draft'],
  effective: ['superseded', 'retired'],
  superseded: [],
  retired: [],
};

function isValidTransition(from: string, to: string): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// List documents by projectId
documents.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const items = await prisma.document.findMany({
      where: { projectId },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
    });

    return c.json({ documents: items });
  } catch (error: any) {
    console.error('List documents error:', error);
    return c.json({ message: 'Failed to list documents' }, 500);
  }
});

// Get single document with all versions
documents.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const item = await prisma.document.findUnique({
      where: { id },
      include: { versions: { orderBy: { createdAt: 'desc' } } },
    });

    if (!item) {
      return c.json({ message: 'Document not found' }, 404);
    }

    return c.json({ document: item });
  } catch (error: any) {
    console.error('Get document error:', error);
    return c.json({ message: 'Failed to get document' }, 500);
  }
});

// Create document
documents.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.projectId || !body.title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }

    const doc = await prisma.document.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        type: body.type ?? 'sop',
        currentVersion: '1.0',
        status: 'draft',
        createdBy: user.userId,
      },
    });

    // Create initial version
    await prisma.documentVersion.create({
      data: {
        documentId: doc.id,
        version: '1.0',
        content: body.content ?? '',
        changeReason: 'Initial version',
        author: user.userId,
      },
    });

    await logAudit({
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'document',
      entityId: doc.id,
      newValue: doc,
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'document.created', { document: doc });
    }

    return c.json({ document: doc }, 201);
  } catch (error: any) {
    console.error('Create document error:', error);
    return c.json({ message: 'Failed to create document' }, 500);
  }
});

// Update document metadata
documents.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Document not found' }, 404);
    }

    const doc = await prisma.document.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        type: body.type ?? existing.type,
      },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'document',
      entityId: doc.id,
      previousValue: existing,
      newValue: doc,
    });

    return c.json({ document: doc });
  } catch (error: any) {
    console.error('Update document error:', error);
    return c.json({ message: 'Failed to update document' }, 500);
  }
});

// Delete document
documents.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Document not found' }, 404);
    }

    await prisma.document.delete({ where: { id } });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'delete',
      entityType: 'document',
      entityId: id,
      previousValue: existing,
    });

    return c.json({ message: 'Document deleted' });
  } catch (error: any) {
    console.error('Delete document error:', error);
    return c.json({ message: 'Failed to delete document' }, 500);
  }
});

// Create new version (changeReason required)
documents.post('/:id/versions', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const doc = await prisma.document.findUnique({
      where: { id },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!doc) {
      return c.json({ message: 'Document not found' }, 404);
    }

    if (!body.changeReason) {
      return c.json({ message: 'changeReason is required for new version' }, 400);
    }

    // Increment version
    const currentParts = doc.currentVersion.split('.');
    const major = parseInt(currentParts[0], 10);
    const minor = parseInt(currentParts[1] || '0', 10);
    const newVersion = body.majorVersion ? `${major + 1}.0` : `${major}.${minor + 1}`;

    const version = await prisma.documentVersion.create({
      data: {
        documentId: id,
        version: newVersion,
        content: body.content ?? doc.versions[0]?.content ?? '',
        changeReason: body.changeReason,
        author: user.userId,
      },
    });

    // Update document's current version and reset to draft
    await prisma.document.update({
      where: { id },
      data: {
        currentVersion: newVersion,
        status: 'draft',
      },
    });

    await logAudit({
      projectId: doc.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'document_version',
      entityId: version.id,
      newValue: version,
      reason: body.changeReason,
    });

    return c.json({ version }, 201);
  } catch (error: any) {
    console.error('Create document version error:', error);
    return c.json({ message: 'Failed to create document version' }, 500);
  }
});

// Submit for review / approve / make effective
documents.put('/:id/review', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const doc = await prisma.document.findUnique({
      where: { id },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!doc) {
      return c.json({ message: 'Document not found' }, 404);
    }

    const targetStatus = body.status;
    if (!targetStatus) {
      return c.json({ message: 'status is required (in_review, approved, effective)' }, 400);
    }

    if (!isValidTransition(doc.status, targetStatus)) {
      return c.json({
        message: `Invalid status transition from '${doc.status}' to '${targetStatus}'. Valid next states: ${VALID_TRANSITIONS[doc.status]?.join(', ') || 'none'}`,
      }, 400);
    }

    const updateData: any = { status: targetStatus };

    // Update latest version with reviewer/approver info
    if (doc.versions.length > 0) {
      const versionUpdate: any = {};
      if (targetStatus === 'in_review') {
        versionUpdate.reviewedBy = null; // Reset reviewer
      } else if (targetStatus === 'approved') {
        versionUpdate.approvedBy = user.userId;
      } else if (targetStatus === 'effective') {
        versionUpdate.effectiveDate = new Date();
      }

      if (Object.keys(versionUpdate).length > 0) {
        await prisma.documentVersion.update({
          where: { id: doc.versions[0].id },
          data: versionUpdate,
        });
      }
    }

    const updated = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    await logAudit({
      projectId: doc.projectId,
      userId: user.userId,
      action: 'status_change',
      entityType: 'document',
      entityId: id,
      previousValue: { status: doc.status },
      newValue: { status: targetStatus },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'document.status_changed', {
        document: updated,
        previousStatus: doc.status,
        newStatus: targetStatus,
      });
    }

    return c.json({ document: updated });
  } catch (error: any) {
    console.error('Document review error:', error);
    return c.json({ message: 'Failed to update document review status' }, 500);
  }
});

// Supersede document with new version
documents.put('/:id/supersede', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      return c.json({ message: 'Document not found' }, 404);
    }

    if (doc.status !== 'effective') {
      return c.json({ message: 'Only effective documents can be superseded' }, 400);
    }

    const updated = await prisma.document.update({
      where: { id },
      data: { status: 'superseded' },
    });

    await logAudit({
      projectId: doc.projectId,
      userId: user.userId,
      action: 'status_change',
      entityType: 'document',
      entityId: id,
      previousValue: { status: 'effective' },
      newValue: { status: 'superseded' },
    });

    return c.json({ document: updated });
  } catch (error: any) {
    console.error('Supersede document error:', error);
    return c.json({ message: 'Failed to supersede document' }, 500);
  }
});

// Retire document
documents.put('/:id/retire', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      return c.json({ message: 'Document not found' }, 404);
    }

    if (doc.status !== 'effective') {
      return c.json({ message: 'Only effective documents can be retired' }, 400);
    }

    const updated = await prisma.document.update({
      where: { id },
      data: { status: 'retired' },
    });

    await logAudit({
      projectId: doc.projectId,
      userId: user.userId,
      action: 'status_change',
      entityType: 'document',
      entityId: id,
      previousValue: { status: 'effective' },
      newValue: { status: 'retired' },
    });

    return c.json({ document: updated });
  } catch (error: any) {
    console.error('Retire document error:', error);
    return c.json({ message: 'Failed to retire document' }, 500);
  }
});

export default documents;
