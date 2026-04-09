import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const projects = new Hono();

projects.use('*', authMiddleware);

projects.get('/', async (c) => {
  try {
    const user = getUser(c);

    const workspaces = await prisma.workspace.findMany({
      where: { orgId: user.orgId ?? undefined },
      select: { id: true },
    });
    const workspaceIds = workspaces.map((w) => w.id);

    const items = await prisma.project.findMany({
      where: { workspaceId: { in: workspaceIds } },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ projects: items });
  } catch (error: any) {
    console.error('List projects error:', error);
    return c.json({ message: 'Failed to list projects' }, 500);
  }
});

projects.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.name) {
      return c.json({ message: 'Project name is required' }, 400);
    }

    if (!body.workspaceId) {
      const workspace = await prisma.workspace.findFirst({
        where: { orgId: user.orgId ?? undefined },
      });
      if (!workspace) {
        return c.json({ message: 'No workspace found for user' }, 400);
      }
      body.workspaceId = workspace.id;
    }

    const project = await prisma.project.create({
      data: {
        workspaceId: body.workspaceId,
        name: body.name,
        description: body.description ?? '',
        owner: body.owner ?? user.email,
        version: body.version ?? '1.0',
        country: body.country ?? '',
        vertical: body.vertical ?? null,
        modules: body.modules ?? [],
        type: body.type ?? 'software',
      },
    });

    await logAudit({
      projectId: project.id,
      userId: user.userId,
      action: 'create',
      entityType: 'project',
      entityId: project.id,
      newValue: project,
    });

    return c.json({ project }, 201);
  } catch (error: any) {
    console.error('Create project error:', error);
    return c.json({ message: 'Failed to create project' }, 500);
  }
});

projects.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            requirements: true,
            tests: true,
            risks: true,
            capas: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    return c.json({ project });
  } catch (error: any) {
    console.error('Get project error:', error);
    return c.json({ message: 'Failed to get project' }, 500);
  }
});

projects.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        owner: body.owner ?? existing.owner,
        version: body.version ?? existing.version,
        country: body.country ?? existing.country,
        vertical: body.vertical !== undefined ? body.vertical : existing.vertical,
        modules: body.modules ?? existing.modules,
        type: body.type ?? existing.type,
      },
    });

    await logAudit({
      projectId: project.id,
      userId: user.userId,
      action: 'update',
      entityType: 'project',
      entityId: project.id,
      previousValue: existing,
      newValue: project,
    });

    return c.json({ project });
  } catch (error: any) {
    console.error('Update project error:', error);
    return c.json({ message: 'Failed to update project' }, 500);
  }
});

projects.delete('/:id', requirePermission('canDelete'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ message: 'Project not found' }, 404);
    }

    await prisma.project.delete({ where: { id } });

    return c.json({ message: 'Project deleted' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return c.json({ message: 'Failed to delete project' }, 500);
  }
});

export default projects;
