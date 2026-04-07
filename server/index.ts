import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
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
import evidenceRoutes from './routes/evidence.js';
import approvalRoutes from './routes/approvals.js';
import signatureRoutes from './routes/signatures.js';
import exportRoutes from './routes/export.js';
import importRoutes from './routes/import.js';
import aiRoutes from './routes/ai.js';
import auditModeRoutes from './routes/auditmode.js';
import dashboardRoutes from './routes/dashboard.js';
import statusRoutes from './routes/status.js';
import ssoRoutes from './routes/sso.js';
import webhookRoutes from './routes/webhooks.js';
import jiraRoutes from './routes/integrations/jira.js';
import githubRoutes from './routes/integrations/github.js';
import complaintRoutes from './routes/complaints.js';
import supplierRoutes from './routes/suppliers.js';
import batchRoutes from './routes/batches.js';
import trainingRoutes from './routes/training.js';
import documentRoutes from './routes/documents.js';
import systemRoutes from './routes/systems.js';
import impactRoutes from './routes/impact.js';
import pmsRoutes from './routes/pms.js';
import udiRoutes from './routes/udi.js';
import stabilityRoutes from './routes/stability.js';
import envmonRoutes from './routes/envmon.js';
import auditRecordRoutes from './routes/auditrecords.js';
import workflowRoutes from './routes/workflows.js';
import changeControlRoutes from './routes/changecontrol.js';
import deviationRoutes from './routes/deviations.js';
import notificationRoutes from './routes/notifications.js';
import commentRoutes from './routes/comments.js';
import taskRoutes from './routes/tasks.js';
import kpiRoutes from './routes/kpi.js';
import supplierPortalRoutes from './routes/supplierportal.js';
import analyticsRoutes from './routes/analytics.js';
import * as fs from 'fs';
import * as path from 'path';

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
app.route('/api/evidence', evidenceRoutes);
app.route('/api/approvals', approvalRoutes);
app.route('/api/signatures', signatureRoutes);
app.route('/api/export', exportRoutes);
app.route('/api/import', importRoutes);
app.route('/api/ai', aiRoutes);
app.route('/api/audit-mode', auditModeRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/status', statusRoutes);
app.route('/api/auth/sso', ssoRoutes);
app.route('/api/webhooks', webhookRoutes);
app.route('/api/integrations/jira', jiraRoutes);
app.route('/api/integrations/github', githubRoutes);
app.route('/api/complaints', complaintRoutes);
app.route('/api/suppliers', supplierRoutes);
app.route('/api/batches', batchRoutes);
app.route('/api/training', trainingRoutes);
app.route('/api/documents', documentRoutes);
app.route('/api/systems', systemRoutes);
app.route('/api/impact', impactRoutes);
app.route('/api/pms', pmsRoutes);
app.route('/api/udi', udiRoutes);
app.route('/api/stability', stabilityRoutes);
app.route('/api/envmon', envmonRoutes);
app.route('/api/audit-records', auditRecordRoutes);
app.route('/api/workflows', workflowRoutes);
app.route('/api/change-control', changeControlRoutes);
app.route('/api/deviations', deviationRoutes);
app.route('/api/notifications', notificationRoutes);
app.route('/api/comments', commentRoutes);
app.route('/api/tasks', taskRoutes);
app.route('/api/kpi', kpiRoutes);
app.route('/api/supplier-portal', supplierPortalRoutes);
app.route('/api/analytics', analyticsRoutes);

app.get('/api/health', (c) => c.json({ status: 'ok', version: '5.0.0' }));

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use('/*', serveStatic({ root: './dist' }));
    // SPA fallback: serve index.html for non-API routes
    app.get('*', (c) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf-8');
        return c.html(html);
      }
      return c.notFound();
    });
  }
}

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`QAtrial API running on http://localhost:${info.port}`);
});
