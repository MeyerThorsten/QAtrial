import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { findAccessibleProject, listAccessibleProjectIds } from '../lib/projectAccess.js';
import { authMiddleware, getUser, requirePermission, roleHasPermission } from '../middleware/auth.js';
import { createNotification } from './notifications.js';

const tasks = new Hono();

tasks.use('*', authMiddleware);

// GET / — list tasks (filter by projectId, assigneeId, status)
tasks.get('/', async (c) => {
  try {
    const user = getUser(c);
    const projectId = c.req.query('projectId');
    const assigneeId = c.req.query('assigneeId');
    const status = c.req.query('status');

    const where: any = {};
    if (projectId) {
      const project = await findAccessibleProject(projectId, user.orgId);
      if (!project) return c.json({ message: 'Project not found' }, 404);
      where.projectId = projectId;
    } else {
      const accessibleProjectIds = await listAccessibleProjectIds(user.orgId);
      if (accessibleProjectIds.length === 0) {
        return c.json({ tasks: [] });
      }
      where.projectId = { in: accessibleProjectIds };
    }
    if (assigneeId) where.assigneeId = assigneeId;
    if (status) where.status = status;

    const items = await prisma.qTask.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ tasks: items });
  } catch (error: any) {
    console.error('List tasks error:', error);
    return c.json({ message: 'Failed to list tasks' }, 500);
  }
});

// GET /my-tasks — tasks assigned to current user
tasks.get('/my-tasks', async (c) => {
  try {
    const user = getUser(c);
    const accessibleProjectIds = await listAccessibleProjectIds(user.orgId);
    if (accessibleProjectIds.length === 0) {
      return c.json({ tasks: [] });
    }

    const items = await prisma.qTask.findMany({
      where: {
        assigneeId: user.userId,
        projectId: { in: accessibleProjectIds },
      },
      orderBy: { createdAt: 'desc' },
    });
    return c.json({ tasks: items });
  } catch (error: any) {
    console.error('My tasks error:', error);
    return c.json({ message: 'Failed to list my tasks' }, 500);
  }
});

// GET /overdue — overdue tasks (dueDate < now, status != completed)
tasks.get('/overdue', async (c) => {
  try {
    const user = getUser(c);
    const accessibleProjectIds = await listAccessibleProjectIds(user.orgId);
    if (accessibleProjectIds.length === 0) {
      return c.json({ tasks: [] });
    }

    const items = await prisma.qTask.findMany({
      where: {
        projectId: { in: accessibleProjectIds },
        dueDate: { lt: new Date() },
        status: { not: 'completed' },
      },
      orderBy: { dueDate: 'asc' },
    });
    return c.json({ tasks: items });
  } catch (error: any) {
    console.error('Overdue tasks error:', error);
    return c.json({ message: 'Failed to list overdue tasks' }, 500);
  }
});

// POST / — create task
tasks.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { projectId, title, description, assigneeId, assigneeName, dueDate, priority, entityType, entityId } = body;

    if (!projectId || !title || !assigneeId) {
      return c.json({ message: 'projectId, title, and assigneeId are required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const task = await prisma.qTask.create({
      data: {
        projectId,
        title,
        description: description || '',
        assigneeId,
        assigneeName: assigneeName || '',
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium',
        status: 'open',
        entityType: entityType || null,
        entityId: entityId || null,
        createdBy: user.userId,
      },
    });

    // Notify assignee
    if (assigneeId !== user.userId) {
      await createNotification(
        assigneeId,
        'approval_needed',
        `New task assigned: ${title}`,
        description ? description.substring(0, 200) : '',
        'task',
        task.id,
        projectId,
      );
    }

    return c.json({ task }, 201);
  } catch (error: any) {
    console.error('Create task error:', error);
    return c.json({ message: 'Failed to create task' }, 500);
  }
});

// PUT /:id — update task
tasks.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.qTask.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Task not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Task not found' }, 404);

    const changedKeys = Object.keys(body).filter((key) => body[key] !== undefined);
    const statusOnlyUpdate = changedKeys.length > 0 && changedKeys.every((key) => key === 'status');
    const canEditTask = roleHasPermission(user.role, 'canEdit');
    const isAssignee = existing.assigneeId === user.userId;

    if (!canEditTask && !(statusOnlyUpdate && isAssignee)) {
      return c.json({ message: 'Not authorized to update this task' }, 403);
    }

    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.assigneeId !== undefined) data.assigneeId = body.assigneeId;
    if (body.assigneeName !== undefined) data.assigneeName = body.assigneeName;
    if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.status !== undefined) {
      data.status = body.status;
      if (body.status === 'completed') data.completedAt = new Date();
      if (body.status !== 'completed') data.completedAt = null;
    }

    const updated = await prisma.qTask.update({ where: { id }, data });

    // Notify on reassignment
    if (body.assigneeId && body.assigneeId !== existing.assigneeId) {
      await createNotification(
        body.assigneeId,
        'approval_needed',
        `Task reassigned to you: ${updated.title}`,
        updated.description.substring(0, 200),
        'task',
        updated.id,
        updated.projectId,
      );
    }

    return c.json({ task: updated });
  } catch (error: any) {
    console.error('Update task error:', error);
    return c.json({ message: 'Failed to update task' }, 500);
  }
});

// DELETE /:id
tasks.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const existing = await prisma.qTask.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Task not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Task not found' }, 404);
    await prisma.qTask.delete({ where: { id } });
    return c.json({ message: 'Task deleted' });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return c.json({ message: 'Failed to delete task' }, 500);
  }
});

// PUT /:id/complete — mark completed
tasks.put('/:id/complete', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const existing = await prisma.qTask.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Task not found' }, 404);
    const project = await findAccessibleProject(existing.projectId, user.orgId);
    if (!project) return c.json({ message: 'Task not found' }, 404);
    if (!roleHasPermission(user.role, 'canEdit') && existing.assigneeId !== user.userId) {
      return c.json({ message: 'Not authorized to complete this task' }, 403);
    }

    const updated = await prisma.qTask.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() },
    });

    return c.json({ task: updated });
  } catch (error: any) {
    console.error('Complete task error:', error);
    return c.json({ message: 'Failed to complete task' }, 500);
  }
});

export default tasks;
