import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { dispatchWebhook } from '../services/webhook.service.js';

const training = new Hono();

training.use('*', authMiddleware);

async function findAccessibleCourse(id: string, orgId: string | null) {
  if (!orgId) {
    return null;
  }

  return prisma.course.findFirst({
    where: { id, orgId },
  });
}

// ── Training Plans ──────────────────────────────────────────────────────────

// List training plans by orgId
training.get('/plans', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) {
      return c.json({ message: 'orgId is required' }, 400);
    }

    const items = await prisma.trainingPlan.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ plans: items });
  } catch (error: any) {
    console.error('List training plans error:', error);
    return c.json({ message: 'Failed to list training plans' }, 500);
  }
});

// Create training plan
training.post('/plans', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const orgId = user.orgId;
    if (!orgId || !body.name || !body.role) {
      return c.json({ message: 'orgId, name, and role are required' }, 400);
    }

    const item = await prisma.trainingPlan.create({
      data: {
        orgId,
        name: body.name,
        role: body.role,
        description: body.description ?? '',
        courses: body.courses ?? [],
      },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'training.plan_created', { plan: item });
    }

    return c.json({ plan: item }, 201);
  } catch (error: any) {
    console.error('Create training plan error:', error);
    return c.json({ message: 'Failed to create training plan' }, 500);
  }
});

// ── Courses ──────────────────────────────────────────────────────────────────

// List courses by orgId
training.get('/courses', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) {
      return c.json({ message: 'orgId is required' }, 400);
    }

    const items = await prisma.course.findMany({
      where: { orgId },
      orderBy: { title: 'asc' },
    });

    return c.json({ courses: items });
  } catch (error: any) {
    console.error('List courses error:', error);
    return c.json({ message: 'Failed to list courses' }, 500);
  }
});

// Create course
training.post('/courses', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const orgId = user.orgId;
    if (!orgId || !body.title) {
      return c.json({ message: 'orgId and title are required' }, 400);
    }

    const item = await prisma.course.create({
      data: {
        orgId,
        title: body.title,
        description: body.description ?? '',
        linkedDocumentId: body.linkedDocumentId ?? null,
        version: body.version ?? '1.0',
        durationMinutes: body.durationMinutes ?? null,
      },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'training.course_created', { course: item });
    }

    return c.json({ course: item }, 201);
  } catch (error: any) {
    console.error('Create course error:', error);
    return c.json({ message: 'Failed to create course' }, 500);
  }
});

// ── Training Records ─────────────────────────────────────────────────────────

// List training records with filters
training.get('/records', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ records: [] });
    }

    const userId = c.req.query('userId');
    const courseId = c.req.query('courseId');
    const status = c.req.query('status');

    const where: any = {
      course: { orgId: user.orgId },
    };
    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;
    if (status) where.status = status;

    const items = await prisma.trainingRecord.findMany({
      where,
      include: { course: true },
      orderBy: { assignedAt: 'desc' },
    });

    return c.json({ records: items });
  } catch (error: any) {
    console.error('List training records error:', error);
    return c.json({ message: 'Failed to list training records' }, 500);
  }
});

// Assign training (create record)
training.post('/records', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.userId || !body.courseId) {
      return c.json({ message: 'userId and courseId are required' }, 400);
    }

    const course = await findAccessibleCourse(body.courseId, user.orgId);
    if (!course) {
      return c.json({ message: 'Course not found' }, 404);
    }

    const item = await prisma.trainingRecord.create({
      data: {
        userId: body.userId,
        courseId: body.courseId,
        status: 'assigned',
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
      },
    });

    if (user.orgId) {
      dispatchWebhook(user.orgId, 'training.assigned', { record: item });
    }

    return c.json({ record: item }, 201);
  } catch (error: any) {
    console.error('Assign training error:', error);
    return c.json({ message: 'Failed to assign training' }, 500);
  }
});

// Update training record (complete with score, expire)
training.put('/records/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.trainingRecord.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!existing) {
      return c.json({ message: 'Training record not found' }, 404);
    }
    if (existing.course.orgId !== user.orgId) {
      return c.json({ message: 'Training record not found' }, 404);
    }

    const data: any = {};

    if (body.status) data.status = body.status;
    if (body.score !== undefined) data.score = body.score;
    if (body.validUntil !== undefined) data.validUntil = body.validUntil ? new Date(body.validUntil) : null;

    // Auto-set completedAt when completing
    if (body.status === 'completed' && !existing.completedAt) {
      data.completedAt = new Date();
    }

    const item = await prisma.trainingRecord.update({
      where: { id },
      data,
    });

    if (user.orgId && body.status === 'completed') {
      dispatchWebhook(user.orgId, 'training.completed', { record: item });
    }

    return c.json({ record: item });
  } catch (error: any) {
    console.error('Update training record error:', error);
    return c.json({ message: 'Failed to update training record' }, 500);
  }
});

// ── Training Matrix ──────────────────────────────────────────────────────────

// Training matrix: roles x courses x completion status
training.get('/matrix', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) {
      return c.json({ message: 'orgId is required' }, 400);
    }

    const plans = await prisma.trainingPlan.findMany({ where: { orgId } });
    const courses = await prisma.course.findMany({ where: { orgId } });
    const records = await prisma.trainingRecord.findMany({
      where: { course: { orgId } },
      include: { course: true },
    });

    // Build matrix: for each plan (role), check each course completion
    const matrix = plans.map((plan) => {
      const courseStatuses = courses.map((course) => {
        const relevantRecords = records.filter((r) => r.courseId === course.id);
        const completedCount = relevantRecords.filter((r) => r.status === 'completed').length;
        const assignedCount = relevantRecords.filter((r) => r.status === 'assigned').length;
        const expiredCount = relevantRecords.filter((r) => r.status === 'expired').length;
        const isRequired = plan.courses.includes(course.id);

        return {
          courseId: course.id,
          courseTitle: course.title,
          isRequired,
          completedCount,
          assignedCount,
          expiredCount,
          totalRecords: relevantRecords.length,
        };
      });

      return {
        planId: plan.id,
        role: plan.role,
        planName: plan.name,
        courses: courseStatuses,
      };
    });

    return c.json({ matrix });
  } catch (error: any) {
    console.error('Training matrix error:', error);
    return c.json({ message: 'Failed to get training matrix' }, 500);
  }
});

// Training compliance: % completed per role/department
training.get('/compliance', async (c) => {
  try {
    const user = getUser(c);
    const orgId = user.orgId;
    if (!orgId) {
      return c.json({ message: 'orgId is required' }, 400);
    }

    const plans = await prisma.trainingPlan.findMany({ where: { orgId } });
    const records = await prisma.trainingRecord.findMany({
      where: { course: { orgId } },
      include: { course: true },
    });

    const compliance = plans.map((plan) => {
      const requiredCourseIds = plan.courses;
      const relevantRecords = records.filter((r) => requiredCourseIds.includes(r.courseId));
      const completedRecords = relevantRecords.filter((r) => r.status === 'completed');
      const overdueRecords = relevantRecords.filter(
        (r) => r.status === 'assigned' && r.validUntil && new Date(r.validUntil) < new Date()
      );

      const compliancePercent = relevantRecords.length > 0
        ? Math.round((completedRecords.length / relevantRecords.length) * 100)
        : 0;

      return {
        planId: plan.id,
        role: plan.role,
        planName: plan.name,
        totalRequired: relevantRecords.length,
        completed: completedRecords.length,
        overdue: overdueRecords.length,
        compliancePercent,
      };
    });

    const overallCompliance = compliance.length > 0
      ? Math.round(compliance.reduce((sum, c) => sum + c.compliancePercent, 0) / compliance.length)
      : 0;

    return c.json({
      compliance,
      overallCompliance,
      totalOverdue: compliance.reduce((sum, c) => sum + c.overdue, 0),
    });
  } catch (error: any) {
    console.error('Training compliance error:', error);
    return c.json({ message: 'Failed to get training compliance' }, 500);
  }
});

export default training;
