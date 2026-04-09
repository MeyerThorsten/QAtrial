import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { findAccessibleProject, listAccessibleProjectIds } from '../lib/projectAccess.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const workflows = new Hono();

workflows.use('*', authMiddleware);

// ── Condition Evaluation Engine ────────────────────────────────────────────

function evaluateCondition(condition: any, entityData: any): boolean {
  if (!condition || !condition.field || !condition.operator) return false;

  const fieldValue = entityData?.[condition.field];
  const target = condition.value;

  switch (condition.operator) {
    case 'eq':
      return fieldValue === target;
    case 'neq':
      return fieldValue !== target;
    case 'gt':
      return typeof fieldValue === 'number' && typeof target === 'number' && fieldValue > target;
    case 'lt':
      return typeof fieldValue === 'number' && typeof target === 'number' && fieldValue < target;
    case 'gte':
      return typeof fieldValue === 'number' && typeof target === 'number' && fieldValue >= target;
    case 'lte':
      return typeof fieldValue === 'number' && typeof target === 'number' && fieldValue <= target;
    case 'contains':
      return typeof fieldValue === 'string' && typeof target === 'string' && fieldValue.toLowerCase().includes(target.toLowerCase());
    case 'in':
      return Array.isArray(target) && target.includes(fieldValue);
    default:
      return false;
  }
}

/**
 * Find the next active step index starting from `fromStep`, skipping steps whose
 * skipCondition evaluates to true against `entityData`.
 * Returns the next active step index, or steps.length if all remaining are skipped.
 */
function findNextActiveStep(steps: any[], fromStep: number, entityData: any): number {
  let step = fromStep;
  while (step < steps.length) {
    const stepDef = steps[step];
    if (stepDef.skipCondition && evaluateCondition(stepDef.skipCondition as any, entityData)) {
      step++;
      continue;
    }
    return step;
  }
  return step; // past end = completed
}

// ── Template CRUD (admin only for mutations) ────────────────────────────────

// GET /templates — list workflow templates by orgId
workflows.get('/templates', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId || '';
    const templates = await prisma.workflowTemplate.findMany({
      where: { orgId },
      include: { steps: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return c.json({ templates });
  } catch (error: any) {
    console.error('List workflow templates error:', error);
    return c.json({ message: 'Failed to list workflow templates' }, 500);
  }
});

// POST /templates — create template with steps (admin)
workflows.post('/templates', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { name, description, entityType, enabled, steps } = body;

    if (!name || !entityType) {
      return c.json({ message: 'name and entityType are required' }, 400);
    }

    const template = await prisma.workflowTemplate.create({
      data: {
        orgId: user.orgId || '',
        name,
        description: description || '',
        entityType,
        enabled: enabled !== false,
        steps: {
          create: (steps || []).map((s: any, i: number) => ({
            order: s.order ?? i,
            name: s.name || `Step ${i + 1}`,
            type: s.type || 'approval',
            assigneeRole: s.assigneeRole || 'qa_manager',
            requiredApprovers: s.requiredApprovers || 1,
            slaHours: s.slaHours ?? null,
            escalateTo: s.escalateTo ?? null,
            conditions: s.conditions ?? null,
            logic: s.logic || 'and',
            skipCondition: s.skipCondition ?? null,
            rejectAction: s.rejectAction || 'cancel',
            rejectTarget: s.rejectTarget ?? null,
          })),
        },
      },
      include: { steps: { orderBy: { order: 'asc' } } },
    });

    return c.json({ template }, 201);
  } catch (error: any) {
    console.error('Create workflow template error:', error);
    return c.json({ message: 'Failed to create workflow template' }, 500);
  }
});

// GET /templates/:id — get with steps
workflows.get('/templates/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const template = await prisma.workflowTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
      include: { steps: { orderBy: { order: 'asc' } } },
    });
    if (!template) return c.json({ message: 'Template not found' }, 404);
    return c.json({ template });
  } catch (error: any) {
    console.error('Get workflow template error:', error);
    return c.json({ message: 'Failed to get workflow template' }, 500);
  }
});

// PUT /templates/:id — update (admin)
workflows.put('/templates/:id', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { name, description, entityType, enabled, steps } = body;

    const existing = await prisma.workflowTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);

    // Delete old steps and recreate
    await prisma.workflowStep.deleteMany({ where: { templateId: id } });

    const template = await prisma.workflowTemplate.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        entityType: entityType ?? existing.entityType,
        enabled: enabled ?? existing.enabled,
        steps: {
          create: (steps || []).map((s: any, i: number) => ({
            order: s.order ?? i,
            name: s.name || `Step ${i + 1}`,
            type: s.type || 'approval',
            assigneeRole: s.assigneeRole || 'qa_manager',
            requiredApprovers: s.requiredApprovers || 1,
            slaHours: s.slaHours ?? null,
            escalateTo: s.escalateTo ?? null,
            conditions: s.conditions ?? null,
            logic: s.logic || 'and',
            skipCondition: s.skipCondition ?? null,
            rejectAction: s.rejectAction || 'cancel',
            rejectTarget: s.rejectTarget ?? null,
          })),
        },
      },
      include: { steps: { orderBy: { order: 'asc' } } },
    });

    return c.json({ template });
  } catch (error: any) {
    console.error('Update workflow template error:', error);
    return c.json({ message: 'Failed to update workflow template' }, 500);
  }
});

// DELETE /templates/:id — delete (admin)
workflows.delete('/templates/:id', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const existing = await prisma.workflowTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);
    await prisma.workflowTemplate.delete({ where: { id } });
    return c.json({ message: 'Template deleted' });
  } catch (error: any) {
    console.error('Delete workflow template error:', error);
    return c.json({ message: 'Failed to delete workflow template' }, 500);
  }
});

// POST /templates/:id/simulate — simulate workflow path for entity data
workflows.post('/templates/:id/simulate', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { entityData } = body;

    const template = await prisma.workflowTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
      include: { steps: { orderBy: { order: 'asc' } } },
    });
    if (!template) return c.json({ message: 'Template not found' }, 404);

    const steps = template.steps;
    const simulatedPath: { stepOrder: number; name: string; status: 'active' | 'skipped' }[] = [];

    let currentStep = 0;
    while (currentStep < steps.length) {
      const stepDef = steps[currentStep];
      if (stepDef.skipCondition && evaluateCondition(stepDef.skipCondition as any, entityData || {})) {
        simulatedPath.push({ stepOrder: currentStep, name: stepDef.name, status: 'skipped' });
      } else {
        simulatedPath.push({ stepOrder: currentStep, name: stepDef.name, status: 'active' });
      }
      currentStep++;
    }

    return c.json({
      templateId: id,
      templateName: template.name,
      steps: simulatedPath,
      activeStepCount: simulatedPath.filter((s) => s.status === 'active').length,
      skippedStepCount: simulatedPath.filter((s) => s.status === 'skipped').length,
    });
  } catch (error: any) {
    console.error('Simulate workflow error:', error);
    return c.json({ message: 'Failed to simulate workflow' }, 500);
  }
});

// ── Execution ───────────────────────────────────────────────────────────────

// POST /execute — start workflow execution on entity
workflows.post('/execute', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { templateId, entityType, entityId, projectId } = body;

    if (!templateId || !entityType || !entityId || !projectId) {
      return c.json({ message: 'templateId, entityType, entityId, and projectId are required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const template = await prisma.workflowTemplate.findFirst({
      where: { id: templateId, orgId: user.orgId || '' },
      include: { steps: { orderBy: { order: 'asc' } } },
    });
    if (!template) return c.json({ message: 'Template not found' }, 404);
    if (!template.enabled) return c.json({ message: 'Template is disabled' }, 400);
    if (template.steps.length === 0) return c.json({ message: 'Template has no steps' }, 400);
    if (template.entityType !== entityType) {
      return c.json({ message: 'Template entity type does not match execution entity type' }, 400);
    }

    const execution = await prisma.workflowExecution.create({
      data: {
        templateId,
        entityType,
        entityId,
        projectId,
        currentStep: 0,
        status: 'active',
        restartCount: 0,
      },
      include: { template: { include: { steps: { orderBy: { order: 'asc' } } } }, actions: true },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'workflow_started',
      entityType: 'workflow_execution',
      entityId: execution.id,
      newValue: { templateId, entityType, entityId },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'workflow.started', { execution });
    }

    return c.json({ execution }, 201);
  } catch (error: any) {
    console.error('Execute workflow error:', error);
    return c.json({ message: 'Failed to start workflow execution' }, 500);
  }
});

// PUT /executions/:id/act — perform action on current step
workflows.put('/executions/:id/act', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();
    const { action, reason, delegatedTo, entityData } = body;

    if (!action || !['approved', 'rejected', 'delegated', 'held', 'escalated'].includes(action)) {
      return c.json({ message: 'action must be approved, rejected, delegated, held, or escalated' }, 400);
    }

    const execution = await prisma.workflowExecution.findUnique({
      where: { id },
      include: {
        template: { include: { steps: { orderBy: { order: 'asc' } } } },
        actions: true,
      },
    });

    if (!execution) return c.json({ message: 'Execution not found' }, 404);
    const project = await findAccessibleProject(execution.projectId, user.orgId);
    if (!project) return c.json({ message: 'Execution not found' }, 404);
    if (execution.status !== 'active') {
      return c.json({ message: `Execution is ${execution.status}, not active` }, 400);
    }

    const steps = execution.template.steps;
    const currentStepDef = steps[execution.currentStep];
    if (!currentStepDef) {
      return c.json({ message: 'Current step not found in template' }, 400);
    }

    const latestDelegations = execution.actions
      .filter((entry) => entry.stepOrder === execution.currentStep && entry.action === 'delegated' && entry.delegatedTo)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const latestDelegation = latestDelegations[latestDelegations.length - 1];
    const isDelegatedActor = latestDelegation
      ? [user.userId, user.email].includes(latestDelegation.delegatedTo || '')
      : false;
    const canActOnCurrentStep = user.role === 'admin' || currentStepDef.assigneeRole === user.role || isDelegatedActor;

    if (!canActOnCurrentStep) {
      return c.json({ message: `Current step requires role ${currentStepDef.assigneeRole}` }, 403);
    }
    if (action === 'delegated' && !delegatedTo) {
      return c.json({ message: 'delegatedTo is required when delegating a workflow step' }, 400);
    }

    // Record the action
    const workflowAction = await prisma.workflowAction.create({
      data: {
        executionId: id,
        stepOrder: execution.currentStep,
        userId: user.userId,
        userName: user.email,
        action,
        reason: reason || null,
        delegatedTo: delegatedTo || null,
      },
    });

    // Handle delegation
    if (action === 'delegated') {
      await logAudit({
        projectId: execution.projectId,
        userId: user.userId,
        action: 'workflow_delegated',
        entityType: 'workflow_execution',
        entityId: id,
        newValue: { stepOrder: execution.currentStep, delegatedTo },
      });
      return c.json({ execution, workflowAction, message: 'Delegated' });
    }

    // Handle hold
    if (action === 'held') {
      await prisma.workflowExecution.update({
        where: { id },
        data: { status: 'on_hold' },
      });
      return c.json({ execution: { ...execution, status: 'on_hold' }, workflowAction, message: 'On hold' });
    }

    // Handle escalation
    if (action === 'escalated') {
      await prisma.workflowExecution.update({
        where: { id },
        data: { status: 'escalated' },
      });
      return c.json({ execution: { ...execution, status: 'escalated' }, workflowAction, message: 'Escalated' });
    }

    // Handle rejection with configurable reject action
    if (action === 'rejected') {
      const rejectAction = currentStepDef.rejectAction || 'cancel';

      if (rejectAction === 'restart') {
        // Reset to step 0 and increment restart count
        await prisma.workflowExecution.update({
          where: { id },
          data: {
            currentStep: 0,
            restartCount: { increment: 1 },
          },
        });

        await logAudit({
          projectId: execution.projectId,
          userId: user.userId,
          action: 'workflow_rejected',
          entityType: 'workflow_execution',
          entityId: id,
          newValue: { stepOrder: execution.currentStep, reason, rejectAction: 'restart' },
        });

        if (user.orgId) {
          dispatchWebhook(user.orgId, 'workflow.restarted', { executionId: id });
        }
      } else if (rejectAction === 'goto_step' && currentStepDef.rejectTarget != null) {
        // Go to specific step
        const targetStep = Math.max(0, Math.min(currentStepDef.rejectTarget, steps.length - 1));
        await prisma.workflowExecution.update({
          where: { id },
          data: { currentStep: targetStep },
        });

        await logAudit({
          projectId: execution.projectId,
          userId: user.userId,
          action: 'workflow_rejected',
          entityType: 'workflow_execution',
          entityId: id,
          newValue: { stepOrder: execution.currentStep, reason, rejectAction: 'goto_step', targetStep },
        });
      } else {
        // Default: cancel
        await prisma.workflowExecution.update({
          where: { id },
          data: { status: 'cancelled', completedAt: new Date() },
        });

        await logAudit({
          projectId: execution.projectId,
          userId: user.userId,
          action: 'workflow_rejected',
          entityType: 'workflow_execution',
          entityId: id,
          newValue: { stepOrder: execution.currentStep, reason },
        });

        if (user.orgId) {
          dispatchWebhook(user.orgId, 'workflow.rejected', { executionId: id });
        }
      }

      const updatedExecution = await prisma.workflowExecution.findUnique({
        where: { id },
        include: { template: { include: { steps: { orderBy: { order: 'asc' } } } }, actions: true },
      });
      return c.json({ execution: updatedExecution, workflowAction, message: 'Rejected' });
    }

    // Handle approval: check logic mode (AND vs OR)
    const stepLogic = currentStepDef.logic || 'and';

    const allActionsForStep = await prisma.workflowAction.findMany({
      where: { executionId: id, stepOrder: execution.currentStep, action: 'approved' },
    });
    const approvalCount = allActionsForStep.length;

    // OR logic: advance if ANY approver approves (1 is enough)
    // AND logic: advance when ALL required approvers approve
    const shouldAdvance = stepLogic === 'or'
      ? approvalCount >= 1
      : approvalCount >= currentStepDef.requiredApprovers;

    if (shouldAdvance) {
      // Calculate next step, skipping steps with met skip conditions
      let nextStep = execution.currentStep + 1;

      // Check for skip conditions on subsequent steps
      if (entityData) {
        nextStep = findNextActiveStep(steps, nextStep, entityData);
      } else {
        // Without entity data, just advance linearly but still check skipConditions with empty data
        nextStep = findNextActiveStep(steps, nextStep, {});
      }

      if (nextStep >= steps.length) {
        // Workflow complete
        await prisma.workflowExecution.update({
          where: { id },
          data: { status: 'completed', completedAt: new Date(), currentStep: nextStep },
        });

        await logAudit({
          projectId: execution.projectId,
          userId: user.userId,
          action: 'workflow_completed',
          entityType: 'workflow_execution',
          entityId: id,
          newValue: { totalSteps: steps.length },
        });

        if (user.orgId) {
          dispatchWebhook(user.orgId, 'workflow.completed', { executionId: id });
        }
      } else {
        // Move to next (non-skipped) step
        await prisma.workflowExecution.update({
          where: { id },
          data: { currentStep: nextStep },
        });

        await logAudit({
          projectId: execution.projectId,
          userId: user.userId,
          action: 'workflow_step_advanced',
          entityType: 'workflow_execution',
          entityId: id,
          newValue: { fromStep: execution.currentStep, toStep: nextStep },
        });
      }
    }

    const updatedExecution = await prisma.workflowExecution.findUnique({
      where: { id },
      include: { template: { include: { steps: { orderBy: { order: 'asc' } } } }, actions: true },
    });

    return c.json({ execution: updatedExecution, workflowAction });
  } catch (error: any) {
    console.error('Workflow action error:', error);
    return c.json({ message: 'Failed to perform workflow action' }, 500);
  }
});

// GET /executions/my-pending — pending actions for current user by role match
workflows.get('/executions/my-pending', async (c) => {
  try {
    const user = getUser(c);
    const accessibleProjectIds = await listAccessibleProjectIds(user.orgId);
    if (accessibleProjectIds.length === 0) {
      return c.json({ executions: [] });
    }

    const executions = await prisma.workflowExecution.findMany({
      where: { status: 'active', projectId: { in: accessibleProjectIds } },
      include: {
        template: { include: { steps: { orderBy: { order: 'asc' } } } },
        actions: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    // Filter to executions where the current step's assigneeRole matches the user's role
    const pending = executions.filter((exec) => {
      const currentStepDef = exec.template.steps[exec.currentStep];
      if (!currentStepDef) return false;
      const latestDelegations = exec.actions
        .filter((action) => action.stepOrder === exec.currentStep && action.action === 'delegated' && action.delegatedTo)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      const latestDelegation = latestDelegations[latestDelegations.length - 1];
      const isDelegatedActor = latestDelegation
        ? [user.userId, user.email].includes(latestDelegation.delegatedTo || '')
        : false;
      return currentStepDef.assigneeRole === user.role || user.role === 'admin' || isDelegatedActor;
    });

    return c.json({ executions: pending });
  } catch (error: any) {
    console.error('My pending executions error:', error);
    return c.json({ message: 'Failed to list pending executions' }, 500);
  }
});

// GET /executions/overdue — executions where current step SLA exceeded
workflows.get('/executions/overdue', async (c) => {
  try {
    const user = getUser(c);
    const accessibleProjectIds = await listAccessibleProjectIds(user.orgId);
    if (accessibleProjectIds.length === 0) {
      return c.json({ executions: [] });
    }

    const executions = await prisma.workflowExecution.findMany({
      where: { status: 'active', projectId: { in: accessibleProjectIds } },
      include: {
        template: { include: { steps: { orderBy: { order: 'asc' } } } },
        actions: true,
      },
    });

    const now = new Date();
    const overdue = executions.filter((exec) => {
      const currentStepDef = exec.template.steps[exec.currentStep];
      if (!currentStepDef || !currentStepDef.slaHours) return false;

      // Find the latest action for the current step, or use startedAt
      const actionsForStep = exec.actions.filter((a) => a.stepOrder === exec.currentStep);
      const stepStartTime = actionsForStep.length > 0
        ? new Date(Math.max(...actionsForStep.map((a) => a.timestamp.getTime())))
        : exec.startedAt;

      const slaDeadline = new Date(stepStartTime.getTime() + currentStepDef.slaHours * 60 * 60 * 1000);
      return now > slaDeadline;
    });

    return c.json({ executions: overdue });
  } catch (error: any) {
    console.error('Overdue executions error:', error);
    return c.json({ message: 'Failed to list overdue executions' }, 500);
  }
});

// GET /executions/:id — execution with all actions
workflows.get('/executions/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const execution = await prisma.workflowExecution.findUnique({
      where: { id },
      include: {
        template: { include: { steps: { orderBy: { order: 'asc' } } } },
        actions: { orderBy: { timestamp: 'asc' } },
      },
    });
    if (!execution) return c.json({ message: 'Execution not found' }, 404);
    const project = await findAccessibleProject(execution.projectId, user.orgId);
    if (!project) return c.json({ message: 'Execution not found' }, 404);
    return c.json({ execution });
  } catch (error: any) {
    console.error('Get execution error:', error);
    return c.json({ message: 'Failed to get execution' }, 500);
  }
});

export default workflows;
