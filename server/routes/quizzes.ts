import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission, roleHasPermission } from '../middleware/auth.js';

const quizzes = new Hono();

quizzes.use('*', authMiddleware);

// List quizzes by courseId
quizzes.get('/', async (c) => {
  try {
    const user = getUser(c);
    const courseId = c.req.query('courseId');
    if (!courseId) {
      return c.json({ message: 'courseId query parameter is required' }, 400);
    }

    const items = await prisma.quiz.findMany({
      where: { courseId },
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { attempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Hide correct answers for non-admin
    const isAdmin = roleHasPermission(user.role, 'canApprove');
    const sanitized = items.map((quiz) => ({
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        correctAnswers: isAdmin ? q.correctAnswers : undefined,
        explanation: isAdmin ? q.explanation : undefined,
      })),
    }));

    return c.json({ quizzes: sanitized });
  } catch (error: any) {
    console.error('List quizzes error:', error);
    return c.json({ message: 'Failed to list quizzes' }, 500);
  }
});

// Create quiz with questions
quizzes.post('/', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    if (!body.courseId || !body.title) {
      return c.json({ message: 'courseId and title are required' }, 400);
    }

    const course = await prisma.course.findUnique({ where: { id: body.courseId } });
    if (!course) {
      return c.json({ message: 'Course not found' }, 404);
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId: body.courseId,
        title: body.title,
        passingScore: body.passingScore ?? 80,
        questions: {
          create: (body.questions ?? []).map((q: any, idx: number) => ({
            order: q.order ?? idx + 1,
            question: q.question,
            type: q.type ?? 'multiple_choice',
            options: q.options ?? [],
            correctAnswers: q.correctAnswers ?? [],
            explanation: q.explanation ?? null,
          })),
        },
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });

    return c.json({ quiz }, 201);
  } catch (error: any) {
    console.error('Create quiz error:', error);
    return c.json({ message: 'Failed to create quiz' }, 500);
  }
});

// Get single quiz
quizzes.get('/:id', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { attempts: true } },
      },
    });

    if (!quiz) return c.json({ message: 'Quiz not found' }, 404);

    const isAdmin = roleHasPermission(user.role, 'canApprove');
    const sanitized = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        correctAnswers: isAdmin ? q.correctAnswers : undefined,
        explanation: isAdmin ? q.explanation : undefined,
      })),
    };

    return c.json({ quiz: sanitized });
  } catch (error: any) {
    console.error('Get quiz error:', error);
    return c.json({ message: 'Failed to get quiz' }, 500);
  }
});

// Update quiz
quizzes.put('/:id', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Quiz not found' }, 404);

    // Update quiz fields
    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        passingScore: body.passingScore ?? existing.passingScore,
      },
    });

    // If questions are provided, replace all
    if (body.questions && Array.isArray(body.questions)) {
      await prisma.quizQuestion.deleteMany({ where: { quizId: id } });
      await prisma.quizQuestion.createMany({
        data: body.questions.map((q: any, idx: number) => ({
          quizId: id,
          order: q.order ?? idx + 1,
          question: q.question,
          type: q.type ?? 'multiple_choice',
          options: q.options ?? [],
          correctAnswers: q.correctAnswers ?? [],
          explanation: q.explanation ?? null,
        })),
      });
    }

    const updated = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    return c.json({ quiz: updated });
  } catch (error: any) {
    console.error('Update quiz error:', error);
    return c.json({ message: 'Failed to update quiz' }, 500);
  }
});

// Submit attempt — auto-score
quizzes.post('/:id/attempt', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const body = await c.req.json();

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    if (!quiz) return c.json({ message: 'Quiz not found' }, 404);

    if (!body.answers || typeof body.answers !== 'object') {
      return c.json({ message: 'answers object is required (questionId: selectedIndex[])' }, 400);
    }

    // Score the attempt
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const explanations: Record<string, string> = {};

    for (const question of quiz.questions) {
      const userAnswer = body.answers[question.id];
      const correctAnswers = question.correctAnswers as number[];

      if (Array.isArray(userAnswer) && Array.isArray(correctAnswers)) {
        const userSorted = [...userAnswer].sort();
        const correctSorted = [...correctAnswers].sort();
        const isCorrect =
          userSorted.length === correctSorted.length &&
          userSorted.every((v, i) => v === correctSorted[i]);

        if (isCorrect) {
          correctCount++;
        } else if (question.explanation) {
          explanations[question.id] = question.explanation;
        }
      } else if (question.explanation) {
        explanations[question.id] = question.explanation;
      }
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: id,
        userId: user.userId,
        answers: body.answers,
        score,
        passed,
      },
    });

    return c.json({
      attempt,
      correctCount,
      totalQuestions,
      explanations,
    }, 201);
  } catch (error: any) {
    console.error('Submit quiz attempt error:', error);
    return c.json({ message: 'Failed to submit quiz attempt' }, 500);
  }
});

// List attempts
quizzes.get('/:id/attempts', async (c) => {
  try {
    const user = getUser(c);
    const { id } = c.req.param();
    const isAdmin = roleHasPermission(user.role, 'canApprove');

    const where: any = { quizId: id };
    if (!isAdmin) {
      where.userId = user.userId;
    }

    const attempts = await prisma.quizAttempt.findMany({
      where,
      orderBy: { completedAt: 'desc' },
    });

    return c.json({ attempts });
  } catch (error: any) {
    console.error('List quiz attempts error:', error);
    return c.json({ message: 'Failed to list quiz attempts' }, 500);
  }
});

export default quizzes;
