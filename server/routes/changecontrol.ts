import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const changecontrol = new Hono();

changecontrol.use('*', authMiddleware);

const VALID_TRANSITIONS: Record<string, string[]> = {
  initiated: ['assessment'],
  assessment: ['approval'],
  approval: ['implementation'],
  implementation: ['verification'],
  verification: ['closed'],
};

// GET /trending — change controls by type/month/status
changecontrol.get('/trending', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) return c.json({ message: 'projectId required' }, 400);

    const all = await prisma.changeControl.findMany({ where: { projectId } });

    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    for (const cc of all) {
      byType[cc.type] = (byType[cc.type] || 0) + 1;
      byStatus[cc.status] = (byStatus[cc.status] || 0) + 1;
      const month = cc.createdAt.toISOString().slice(0, 7);
      byMonth[month] = (byMonth[month] || 0) + 1;
    }

    return c.json({
      trending: {
        total: all.length,
        byType: Object.entries(byType).map(([type, count]) => ({ type, count })),
        byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
        byMonth: Object.entries(byMonth).sort().map(([month, count]) => ({ month, count })),
      },
    });
  } catch (error: any) {
    console.error('Change control trending error:', error);
    return c.json({ message: 'Failed to get trending data' }, 500);
  }
});

// GET / — list change controls by projectId
changecontrol.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) return c.json({ message: 'projectId required' }, 400);

    const items = await prisma.changeControl.findMany({
      where: { projectId },
      include: { tasks: true },
      orderBy: { createdAt: 'desc' },
    });
    return c.json({ changeControls: items });
  } catch (error: any) {
    console.error('List change controls error:', error);
    return c.json({ message: 'Failed to list change controls' }, 500);
  }
});

// POST / — create (auto-generate CC-NNN number)
changecontrol.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { projectId, title, type, description, justification, riskLevel, impactAssessment, affectedDocuments, affectedTraining, affectedValidation } = body;

    if (!projectId || !title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }

    // Auto-generate change number
    const count = await prisma.changeControl.count({ where: { projectId } });
    const changeNumber = `CC-${String(count + 1).padStart(3, '0')}`;

    const cc = await prisma.changeControl.create({
      data: {
        projectId,
        title,
        changeNumber,
        type: type || 'document',
        description: description || '',
        justification: justification || '',
        status: 'initiated',
        riskLevel: riskLevel || 'medium',
        initiatedBy: user.userId,
        impactAssessment: impactAssessment || null,
        affectedDocuments: affectedDocuments || [],
        affectedTraining: affectedTraining || [],
        affectedValidation: affectedValidation || [],
      },
      include: { tasks: true },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'change_control_created',
      entityType: 'change_control',
      entityId: cc.id,
      newValue: { changeNumber, title, type: cc.type },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'changecontrol.created', { changeControl: cc });
    }

    return c.json({ changeControl: cc }, 201);
  } catch (error: any) {
    console.error('Create change control error:', error);
    return c.json({ message: 'Failed to create change control' }, 500);
  }
});

// GET /:id — get with tasks
changecontrol.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const cc = await prisma.changeControl.findUnique({
      where: { id },
      include: { tasks: { orderBy: { createdAt: 'asc' } } },
    });
    if (!cc) return c.json({ message: 'Change control not found' }, 404);
    return c.json({ changeControl: cc });
  } catch (error: any) {
    console.error('Get change control error:', error);
    return c.json({ message: 'Failed to get change control' }, 500);
  }
});

// PUT /:id — update (with status transition validation)
changecontrol.put('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.changeControl.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Change control not found' }, 404);

    // Validate status transition if status is changing
    if (body.status && body.status !== existing.status) {
      const allowed = VALID_TRANSITIONS[existing.status];
      if (!allowed || !allowed.includes(body.status)) {
        return c.json({ message: `Cannot transition from ${existing.status} to ${body.status}` }, 400);
      }
    }

    const cc = await prisma.changeControl.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        type: body.type ?? existing.type,
        description: body.description ?? existing.description,
        justification: body.justification ?? existing.justification,
        status: body.status ?? existing.status,
        riskLevel: body.riskLevel ?? existing.riskLevel,
        impactAssessment: body.impactAssessment ?? existing.impactAssessment,
        affectedDocuments: body.affectedDocuments ?? existing.affectedDocuments,
        affectedTraining: body.affectedTraining ?? existing.affectedTraining,
        affectedValidation: body.affectedValidation ?? existing.affectedValidation,
        workflowExecutionId: body.workflowExecutionId ?? existing.workflowExecutionId,
        effectivenessCheckDate: body.effectivenessCheckDate ? new Date(body.effectivenessCheckDate) : existing.effectivenessCheckDate,
      },
      include: { tasks: true },
    });

    await logAudit({
      projectId: existing.projectId,
      userId: user.userId,
      action: 'change_control_updated',
      entityType: 'change_control',
      entityId: id,
      previousValue: { status: existing.status },
      newValue: { status: cc.status },
    });

    return c.json({ changeControl: cc });
  } catch (error: any) {
    console.error('Update change control error:', error);
    return c.json({ message: 'Failed to update change control' }, 500);
  }
});

// DELETE /:id — delete
changecontrol.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    await prisma.changeControl.delete({ where: { id } });
    return c.json({ message: 'Change control deleted' });
  } catch (error: any) {
    console.error('Delete change control error:', error);
    return c.json({ message: 'Failed to delete change control' }, 500);
  }
});

// POST /:id/tasks — add implementation task
changecontrol.post('/:id/tasks', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const cc = await prisma.changeControl.findUnique({ where: { id } });
    if (!cc) return c.json({ message: 'Change control not found' }, 404);

    const task = await prisma.changeTask.create({
      data: {
        changeControlId: id,
        title: body.title || 'Untitled Task',
        assignee: body.assignee || '',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: 'open',
      },
    });

    return c.json({ task }, 201);
  } catch (error: any) {
    console.error('Add change task error:', error);
    return c.json({ message: 'Failed to add task' }, 500);
  }
});

// PUT /:id/tasks/:taskId — update task
changecontrol.put('/:id/tasks/:taskId', async (c) => {
  try {
    const { taskId } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.changeTask.findUnique({ where: { id: taskId } });
    if (!existing) return c.json({ message: 'Task not found' }, 404);

    const task = await prisma.changeTask.update({
      where: { id: taskId },
      data: {
        title: body.title ?? existing.title,
        assignee: body.assignee ?? existing.assignee,
        dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
        status: body.status ?? existing.status,
        completedAt: body.status === 'completed' ? new Date() : existing.completedAt,
      },
    });

    return c.json({ task });
  } catch (error: any) {
    console.error('Update change task error:', error);
    return c.json({ message: 'Failed to update task' }, 500);
  }
});

// PUT /:id/start-approval — create workflow execution for this change control
changecontrol.put('/:id/start-approval', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { templateId } = body;

    if (!templateId) return c.json({ message: 'templateId is required' }, 400);

    const cc = await prisma.changeControl.findUnique({ where: { id } });
    if (!cc) return c.json({ message: 'Change control not found' }, 404);

    const template = await prisma.workflowTemplate.findUnique({
      where: { id: templateId },
      include: { steps: true },
    });
    if (!template) return c.json({ message: 'Workflow template not found' }, 404);

    const execution = await prisma.workflowExecution.create({
      data: {
        templateId,
        entityType: 'change_control',
        entityId: id,
        projectId: cc.projectId,
        currentStep: 0,
        status: 'active',
      },
    });

    await prisma.changeControl.update({
      where: { id },
      data: { workflowExecutionId: execution.id, status: 'approval' },
    });

    await logAudit({
      projectId: cc.projectId,
      userId: user.userId,
      action: 'change_control_approval_started',
      entityType: 'change_control',
      entityId: id,
      newValue: { workflowExecutionId: execution.id },
    });

    return c.json({ execution });
  } catch (error: any) {
    console.error('Start approval error:', error);
    return c.json({ message: 'Failed to start approval' }, 500);
  }
});

// PUT /:id/verify-effectiveness — mark effectiveness verified
changecontrol.put('/:id/verify-effectiveness', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const cc = await prisma.changeControl.findUnique({ where: { id } });
    if (!cc) return c.json({ message: 'Change control not found' }, 404);

    const updated = await prisma.changeControl.update({
      where: { id },
      data: { effectivenessVerified: true, effectivenessCheckDate: new Date() },
    });

    await logAudit({
      projectId: cc.projectId,
      userId: user.userId,
      action: 'change_control_effectiveness_verified',
      entityType: 'change_control',
      entityId: id,
      newValue: { effectivenessVerified: true },
    });

    return c.json({ changeControl: updated });
  } catch (error: any) {
    console.error('Verify effectiveness error:', error);
    return c.json({ message: 'Failed to verify effectiveness' }, 500);
  }
});

export default changecontrol;
