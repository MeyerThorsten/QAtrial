import { Hono } from 'hono';
import { prisma } from '../index.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const status = new Hono();

const startTime = Date.now();

status.get('/', async (c) => {
  // Check database connectivity
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  // Check AI provider configuration
  const aiProvider = (process.env.AI_PROVIDER_TYPE && process.env.AI_PROVIDER_KEY)
    ? 'configured'
    : 'not configured';

  // Check uploads directory
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  let uploadsExists = false;
  let freeSpaceMb = 0;

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    // Test writability
    const testFile = path.join(uploadsDir, '.health-check');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    uploadsExists = true;
  } catch {
    uploadsExists = false;
  }

  try {
    const free = os.freemem();
    freeSpaceMb = Math.round(free / (1024 * 1024));
  } catch {
    freeSpaceMb = 0;
  }

  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return c.json({
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    version: '3.0.0',
    uptime: uptimeSeconds,
    database: dbStatus,
    aiProvider,
    storage: {
      uploadsDir: uploadsExists,
      freeSpaceMb,
    },
    timestamp: new Date().toISOString(),
  });
});

export default status;
