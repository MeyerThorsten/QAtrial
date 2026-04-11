import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser } from '../middleware/auth.js';

const forms = new Hono();
forms.use('*', authMiddleware);

// ── Templates ───────────────────────────────────────────────────────────────

// GET /templates — list templates by orgId
forms.get('/templates', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) return c.json({ templates: [] });

    const templates = await prisma.formTemplate.findMany({
      where: { orgId: user.orgId },
      include: { fields: { orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    return c.json({ templates });
  } catch (error: any) {
    console.error('List form templates error:', error);
    return c.json({ message: 'Failed to list templates' }, 500);
  }
});

// POST /templates — create template with fields
forms.post('/templates', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) return c.json({ message: 'Organization required' }, 400);

    const body = await c.req.json();
    const { name, description, entityType, fields } = body;

    if (!name) return c.json({ message: 'Name is required' }, 400);

    const template = await prisma.formTemplate.create({
      data: {
        orgId: user.orgId,
        name,
        description: description || '',
        entityType: entityType || 'custom',
        fields: fields?.length
          ? {
              create: fields.map((f: any, idx: number) => ({
                order: f.order ?? idx,
                label: f.label,
                type: f.type,
                required: f.required ?? false,
                options: f.options ?? null,
                placeholder: f.placeholder ?? null,
                helpText: f.helpText ?? null,
                validation: f.validation ?? null,
                conditional: f.conditional ?? null,
              })),
            }
          : undefined,
      },
      include: { fields: { orderBy: { order: 'asc' } } },
    });

    return c.json({ template }, 201);
  } catch (error: any) {
    console.error('Create form template error:', error);
    return c.json({ message: 'Failed to create template' }, 500);
  }
});

// GET /templates/:id — get with fields
forms.get('/templates/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const template = await prisma.formTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
      include: { fields: { orderBy: { order: 'asc' } } },
    });

    if (!template) return c.json({ message: 'Template not found' }, 404);
    return c.json({ template });
  } catch (error: any) {
    console.error('Get form template error:', error);
    return c.json({ message: 'Failed to get template' }, 500);
  }
});

// PUT /templates/:id — update template
forms.put('/templates/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.formTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);

    const template = await prisma.formTemplate.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        entityType: body.entityType ?? existing.entityType,
      },
      include: { fields: { orderBy: { order: 'asc' } } },
    });

    return c.json({ template });
  } catch (error: any) {
    console.error('Update form template error:', error);
    return c.json({ message: 'Failed to update template' }, 500);
  }
});

// DELETE /templates/:id
forms.delete('/templates/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.formTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);

    await prisma.formTemplate.delete({ where: { id } });
    return c.json({ message: 'Template deleted' });
  } catch (error: any) {
    console.error('Delete form template error:', error);
    return c.json({ message: 'Failed to delete template' }, 500);
  }
});

// ── Fields ──────────────────────────────────────────────────────────────────

// POST /templates/:id/fields — add field
forms.post('/templates/:id/fields', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.formTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
      include: { fields: true },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);

    const body = await c.req.json();
    const maxOrder = existing.fields.reduce((max, f) => Math.max(max, f.order), -1);

    const field = await prisma.formField.create({
      data: {
        templateId: id,
        order: body.order ?? maxOrder + 1,
        label: body.label || 'New Field',
        type: body.type || 'text',
        required: body.required ?? false,
        options: body.options ?? null,
        placeholder: body.placeholder ?? null,
        helpText: body.helpText ?? null,
        validation: body.validation ?? null,
        conditional: body.conditional ?? null,
      },
    });

    return c.json({ field }, 201);
  } catch (error: any) {
    console.error('Add form field error:', error);
    return c.json({ message: 'Failed to add field' }, 500);
  }
});

// PUT /templates/:id/fields/:fieldId — update field
forms.put('/templates/:id/fields/:fieldId', async (c) => {
  try {
    const user = getUser(c);
    const { id, fieldId } = c.req.param();

    const existing = await prisma.formTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);

    const body = await c.req.json();
    const field = await prisma.formField.update({
      where: { id: fieldId },
      data: {
        label: body.label,
        type: body.type,
        required: body.required,
        options: body.options,
        placeholder: body.placeholder,
        helpText: body.helpText,
        validation: body.validation,
        conditional: body.conditional,
        order: body.order,
      },
    });

    return c.json({ field });
  } catch (error: any) {
    console.error('Update form field error:', error);
    return c.json({ message: 'Failed to update field' }, 500);
  }
});

// DELETE /templates/:id/fields/:fieldId — delete field
forms.delete('/templates/:id/fields/:fieldId', async (c) => {
  try {
    const user = getUser(c);
    const { id, fieldId } = c.req.param();

    const existing = await prisma.formTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);

    await prisma.formField.delete({ where: { id: fieldId } });
    return c.json({ message: 'Field deleted' });
  } catch (error: any) {
    console.error('Delete form field error:', error);
    return c.json({ message: 'Failed to delete field' }, 500);
  }
});

// PUT /templates/:id/reorder — reorder fields
forms.put('/templates/:id/reorder', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const existing = await prisma.formTemplate.findFirst({
      where: { id, orgId: user.orgId || '' },
    });
    if (!existing) return c.json({ message: 'Template not found' }, 404);

    const { fieldIds } = await c.req.json();
    if (!Array.isArray(fieldIds)) return c.json({ message: 'fieldIds must be an array' }, 400);

    await Promise.all(
      fieldIds.map((fid: string, idx: number) =>
        prisma.formField.update({ where: { id: fid }, data: { order: idx } })
      )
    );

    const template = await prisma.formTemplate.findUnique({
      where: { id },
      include: { fields: { orderBy: { order: 'asc' } } },
    });

    return c.json({ template });
  } catch (error: any) {
    console.error('Reorder form fields error:', error);
    return c.json({ message: 'Failed to reorder fields' }, 500);
  }
});

// ── Submissions ─────────────────────────────────────────────────────────────

// GET /submissions — list submissions
forms.get('/submissions', async (c) => {
  try {
    const templateId = c.req.query('templateId');
    const projectId = c.req.query('projectId');

    const where: any = {};
    if (templateId) where.templateId = templateId;
    if (projectId) where.projectId = projectId;

    const submissions = await prisma.formSubmission.findMany({
      where,
      include: { template: { select: { name: true, entityType: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ submissions });
  } catch (error: any) {
    console.error('List form submissions error:', error);
    return c.json({ message: 'Failed to list submissions' }, 500);
  }
});

// POST /submissions — submit form
forms.post('/submissions', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    const { templateId, projectId, data, entityType, entityId } = body;

    if (!templateId || !projectId || !data) {
      return c.json({ message: 'templateId, projectId, and data are required' }, 400);
    }

    const submission = await prisma.formSubmission.create({
      data: {
        templateId,
        projectId,
        data,
        entityType: entityType ?? null,
        entityId: entityId ?? null,
        submittedBy: user.userId,
        status: 'submitted',
      },
    });

    return c.json({ submission }, 201);
  } catch (error: any) {
    console.error('Submit form error:', error);
    return c.json({ message: 'Failed to submit form' }, 500);
  }
});

// GET /submissions/:id — get submission
forms.get('/submissions/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: {
        template: { include: { fields: { orderBy: { order: 'asc' } } } },
      },
    });

    if (!submission) return c.json({ message: 'Submission not found' }, 404);
    return c.json({ submission });
  } catch (error: any) {
    console.error('Get form submission error:', error);
    return c.json({ message: 'Failed to get submission' }, 500);
  }
});

// PUT /submissions/:id/review — review/approve submission
forms.put('/submissions/:id/review', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { status } = body;

    if (!['reviewed', 'approved'].includes(status)) {
      return c.json({ message: 'Status must be reviewed or approved' }, 400);
    }

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: { status },
    });

    return c.json({ submission });
  } catch (error: any) {
    console.error('Review form submission error:', error);
    return c.json({ message: 'Failed to review submission' }, 500);
  }
});

export default forms;
