import { serve } from '@hono/node-server';
import { app } from './app.js';

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`QAtrial API running on http://localhost:${info.port}`);
});
