import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { authMiddleware, getUser } from '../middleware/auth.js';

const search = new Hono();

search.use('*', authMiddleware);

interface SearchResult {
  type: string;
  id: string;
  title: string;
  snippet: string;
  score: number;
}

function makeSnippet(text: string, query: string, maxLength = 200): string {
  if (!text) return '';
  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();
  const idx = lower.indexOf(qLower);

  let start = 0;
  if (idx > 40) {
    start = idx - 40;
  }

  let snippet = text.substring(start, start + maxLength);
  if (start > 0) snippet = '...' + snippet;
  if (start + maxLength < text.length) snippet = snippet + '...';

  return snippet;
}

function matchScore(text: string, query: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();
  if (lower === qLower) return 100;
  if (lower.startsWith(qLower)) return 80;
  if (lower.includes(qLower)) return 60;
  return 0;
}

search.get('/', async (c) => {
  try {
    const user = getUser(c);
    const q = c.req.query('q');
    const projectId = c.req.query('projectId');
    const typesParam = c.req.query('types');

    if (!q || q.trim().length === 0) {
      return c.json({ results: [], total: 0 });
    }

    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const enabledTypes = typesParam
      ? typesParam.split(',').map((t) => t.trim())
      : ['requirements', 'tests', 'capa', 'complaints', 'deviations', 'documents'];

    const query = q.trim();
    const likePattern = `%${query}%`;
    const results: SearchResult[] = [];

    // Search requirements
    if (enabledTypes.includes('requirements')) {
      const reqs = await prisma.requirement.findMany({
        where: {
          projectId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      });

      for (const r of reqs) {
        const titleScore = matchScore(r.title, query);
        const descScore = matchScore(r.description, query);
        const score = Math.max(titleScore, descScore);
        const matchedText = titleScore >= descScore ? r.title : r.description;
        results.push({
          type: 'requirement',
          id: r.id,
          title: r.title,
          snippet: makeSnippet(matchedText, query),
          score,
        });
      }
    }

    // Search tests
    if (enabledTypes.includes('tests')) {
      const tests = await prisma.test.findMany({
        where: {
          projectId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      });

      for (const t of tests) {
        const titleScore = matchScore(t.title, query);
        const descScore = matchScore(t.description, query);
        const score = Math.max(titleScore, descScore);
        const matchedText = titleScore >= descScore ? t.title : t.description;
        results.push({
          type: 'test',
          id: t.id,
          title: t.title,
          snippet: makeSnippet(matchedText, query),
          score,
        });
      }
    }

    // Search CAPAs
    if (enabledTypes.includes('capa')) {
      const capas = await prisma.cAPA.findMany({
        where: {
          projectId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { rootCause: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      });

      for (const ca of capas) {
        const titleScore = matchScore(ca.title, query);
        const rcScore = matchScore(ca.rootCause ?? '', query);
        const score = Math.max(titleScore, rcScore);
        const matchedText = titleScore >= rcScore ? ca.title : (ca.rootCause ?? '');
        results.push({
          type: 'capa',
          id: ca.id,
          title: ca.title,
          snippet: makeSnippet(matchedText, query),
          score,
        });
      }
    }

    // Search complaints
    if (enabledTypes.includes('complaints')) {
      const complaints = await prisma.complaint.findMany({
        where: {
          projectId,
          OR: [
            { description: { contains: query, mode: 'insensitive' } },
            { productName: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      });

      for (const comp of complaints) {
        const descScore = matchScore(comp.description, query);
        const prodScore = matchScore(comp.productName, query);
        const score = Math.max(descScore, prodScore);
        const matchedText = descScore >= prodScore ? comp.description : comp.productName;
        results.push({
          type: 'complaint',
          id: comp.id,
          title: `Complaint: ${comp.productName}`,
          snippet: makeSnippet(matchedText, query),
          score,
        });
      }
    }

    // Search deviations
    if (enabledTypes.includes('deviations')) {
      const deviations = await prisma.deviation.findMany({
        where: {
          projectId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { rootCause: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      });

      for (const d of deviations) {
        const titleScore = matchScore(d.title, query);
        const descScore = matchScore(d.description, query);
        const rcScore = matchScore(d.rootCause ?? '', query);
        const score = Math.max(titleScore, descScore, rcScore);
        const best = titleScore >= descScore && titleScore >= rcScore
          ? d.title
          : descScore >= rcScore
            ? d.description
            : (d.rootCause ?? '');
        results.push({
          type: 'deviation',
          id: d.id,
          title: d.title,
          snippet: makeSnippet(best, query),
          score,
        });
      }
    }

    // Search documents
    if (enabledTypes.includes('documents')) {
      const docs = await prisma.document.findMany({
        where: {
          projectId,
          title: { contains: query, mode: 'insensitive' },
        },
        take: 20,
      });

      for (const doc of docs) {
        results.push({
          type: 'document',
          id: doc.id,
          title: doc.title,
          snippet: makeSnippet(doc.title, query),
          score: matchScore(doc.title, query),
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return c.json({ results: results.slice(0, 50), total: results.length });
  } catch (error: any) {
    console.error('Search error:', error);
    return c.json({ message: 'Search failed' }, 500);
  }
});

export default search;
