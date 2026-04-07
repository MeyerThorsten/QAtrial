import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { createNotification } from './notifications.js';

const comments = new Hono();

comments.use('*', authMiddleware);

// GET / — list comments for entity (threaded: parent + children)
comments.get('/', async (c) => {
  try {
    const entityType = c.req.query('entityType');
    const entityId = c.req.query('entityId');

    if (!entityType || !entityId) {
      return c.json({ message: 'entityType and entityId are required' }, 400);
    }

    const allComments = await prisma.comment.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'asc' },
    });

    // Build threaded structure
    const parentComments = allComments.filter((c) => !c.parentId);
    const childMap: Record<string, typeof allComments> = {};
    for (const comment of allComments) {
      if (comment.parentId) {
        if (!childMap[comment.parentId]) childMap[comment.parentId] = [];
        childMap[comment.parentId].push(comment);
      }
    }

    const threaded = parentComments.map((parent) => ({
      ...parent,
      replies: childMap[parent.id] || [],
    }));

    return c.json({ comments: threaded });
  } catch (error: any) {
    console.error('List comments error:', error);
    return c.json({ message: 'Failed to list comments' }, 500);
  }
});

// POST / — create comment
comments.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { entityType, entityId, projectId, content, parentId } = body;

    if (!entityType || !entityId || !projectId || !content) {
      return c.json({ message: 'entityType, entityId, projectId, and content are required' }, 400);
    }

    const comment = await prisma.comment.create({
      data: {
        entityType,
        entityId,
        projectId,
        userId: user.userId,
        userName: user.email,
        content,
        parentId: parentId || null,
      },
    });

    // Parse @mentions and create notifications
    const mentionRegex = /@(\S+)/g;
    let match;
    const mentionedNames = new Set<string>();
    while ((match = mentionRegex.exec(content)) !== null) {
      mentionedNames.add(match[1]);
    }

    if (mentionedNames.size > 0) {
      // Look up mentioned users by email or name
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { email: { in: Array.from(mentionedNames) } },
            { name: { in: Array.from(mentionedNames) } },
          ],
        },
      });

      for (const mentionedUser of users) {
        if (mentionedUser.id !== user.userId) {
          await createNotification(
            mentionedUser.id,
            'comment_mention',
            `${user.email} mentioned you in a comment`,
            content.substring(0, 200),
            entityType,
            entityId,
            projectId,
          );
        }
      }
    }

    return c.json({ comment }, 201);
  } catch (error: any) {
    console.error('Create comment error:', error);
    return c.json({ message: 'Failed to create comment' }, 500);
  }
});

// PUT /:id — edit comment (only by author)
comments.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { content } = body;

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Comment not found' }, 404);
    if (existing.userId !== user.userId) {
      return c.json({ message: 'You can only edit your own comments' }, 403);
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return c.json({ comment: updated });
  } catch (error: any) {
    console.error('Update comment error:', error);
    return c.json({ message: 'Failed to update comment' }, 500);
  }
});

// DELETE /:id — delete (only by author or admin)
comments.delete('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Comment not found' }, 404);
    if (existing.userId !== user.userId && user.role !== 'admin') {
      return c.json({ message: 'Not authorized to delete this comment' }, 403);
    }

    await prisma.comment.delete({ where: { id } });
    return c.json({ message: 'Comment deleted' });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    return c.json({ message: 'Failed to delete comment' }, 500);
  }
});

export default comments;
