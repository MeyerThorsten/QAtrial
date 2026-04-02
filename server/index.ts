import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from './generated/prisma/index.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import requirementRoutes from './routes/requirements.js';
import testRoutes from './routes/tests.js';
import capaRoutes from './routes/capa.js';
import riskRoutes from './routes/risks.js';
import auditRoutes from './routes/audit.js';
import userRoutes from './routes/users.js';

const app = new Hono();
const prisma = new PrismaClient();

export { prisma };

app.use('*', cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true,
}));

app.route('/api/auth', authRoutes);
app.route('/api/projects', projectRoutes);
app.route('/api/requirements', requirementRoutes);
app.route('/api/tests', testRoutes);
app.route('/api/capa', capaRoutes);
app.route('/api/risks', riskRoutes);
app.route('/api/audit', auditRoutes);
app.route('/api/users', userRoutes);

app.get('/api/health', (c) => c.json({ status: 'ok', version: '3.0.0' }));

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`QAtrial API running on http://localhost:${info.port}`);
});
