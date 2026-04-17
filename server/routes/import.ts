import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { logAudit } from '../services/audit.service.js';

const importRoutes = new Hono();

importRoutes.use('*', authMiddleware);

// ── CSV Parsing Utilities ──────────────────────────────────────────────────

/**
 * Detect delimiter from the first line of a CSV file.
 * Checks comma, semicolon, and tab — picks whichever appears most.
 */
function detectDelimiter(firstLine: string): string {
  const candidates = [',', ';', '\t'];
  let best = ',';
  let bestCount = 0;

  for (const delim of candidates) {
    const count = firstLine.split(delim).length - 1;
    if (count > bestCount) {
      bestCount = count;
      best = delim;
    }
  }

  return best;
}

/**
 * Parse full CSV text into rows of string arrays.
 *
 * RFC 4180-compliant: quoted fields may contain newlines and embedded quotes
 * (escaped as ""). Quote state is tracked across the whole document, so
 * multi-line quoted cells are preserved instead of being split into rows.
 */
function parseCsv(text: string): { headers: string[]; rows: string[][]; delimiter: string } {
  // Normalize line endings & strip BOM
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const clean = normalized.startsWith('\ufeff') ? normalized.slice(1) : normalized;

  if (clean.length === 0) {
    return { headers: [], rows: [], delimiter: ',' };
  }

  // Delimiter detection from the first unquoted line
  const firstLineEnd = (() => {
    let inQuotes = false;
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (ch === '"') {
        if (inQuotes && clean[i + 1] === '"') {
          i++;
          continue;
        }
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === '\n' && !inQuotes) return i;
    }
    return clean.length;
  })();
  const delimiter = detectDelimiter(clean.slice(0, firstLineEnd));

  const allRows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];

    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          current += '"';
          i++;
          continue;
        }
        inQuotes = false;
        continue;
      }
      current += ch;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === delimiter) {
      row.push(current.trim());
      current = '';
      continue;
    }

    if (ch === '\n') {
      row.push(current.trim());
      // Skip empty rows (all blanks)
      if (row.some((f) => f.length > 0)) {
        allRows.push(row);
      }
      row = [];
      current = '';
      continue;
    }

    current += ch;
  }

  // Flush trailing field/row (file without trailing newline)
  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some((f) => f.length > 0)) {
      allRows.push(row);
    }
  }

  if (allRows.length === 0) {
    return { headers: [], rows: [], delimiter };
  }

  const headers = allRows[0];
  const rows = allRows.slice(1);
  return { headers, rows, delimiter };
}

// ── Auto-mapping heuristics ────────────────────────────────────────────────

const FIELD_PATTERNS: Record<string, RegExp[]> = {
  title: [/^title$/i, /^name$/i, /^summary$/i, /^requirement$/i, /^test.?name$/i],
  description: [/^desc/i, /^description$/i, /^detail/i, /^body$/i, /^content$/i],
  status: [/^status$/i, /^state$/i],
  tags: [/^tags?$/i, /^labels?$/i, /^categories?$/i, /^category$/i],
  riskLevel: [/^risk/i, /^risk.?level$/i, /^severity$/i, /^priority$/i],
  regulatoryRef: [/^reg/i, /^regulatory/i, /^standard$/i, /^clause$/i, /^reference$/i],
  linkedRequirements: [/^linked/i, /^req/i, /^requirement/i, /^trace/i],
};

function suggestMapping(headers: string[]): Record<string, number | null> {
  const mapping: Record<string, number | null> = {
    title: null,
    description: null,
    status: null,
    tags: null,
    riskLevel: null,
    regulatoryRef: null,
  };

  for (const [field, patterns] of Object.entries(FIELD_PATTERNS)) {
    if (!(field in mapping)) continue;
    for (let i = 0; i < headers.length; i++) {
      if (patterns.some((p) => p.test(headers[i]))) {
        mapping[field] = i;
        break;
      }
    }
  }

  return mapping;
}

// ── POST /preview ──────────────────────────────────────────────────────────

importRoutes.post('/preview', async (c) => {
  try {
    const contentType = c.req.header('content-type') ?? '';
    let csvText = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.formData();
      const file = formData.get('file');
      if (!file || typeof file === 'string') {
        return c.json({ message: 'No file uploaded' }, 400);
      }
      csvText = await (file as File).text();
    } else {
      // Accept raw JSON body with csvText field
      const body = await c.req.json();
      csvText = body.csvText ?? '';
    }

    if (!csvText.trim()) {
      return c.json({ message: 'Empty file' }, 400);
    }

    const { headers, rows, delimiter } = parseCsv(csvText);

    const sampleRows = rows.slice(0, 5);
    const suggestedMapping = suggestMapping(headers);

    return c.json({
      columns: headers,
      sampleRows,
      suggestedMapping,
      totalRows: rows.length,
      delimiter,
    });
  } catch (error: any) {
    console.error('Import preview error:', error);
    return c.json({ message: 'Failed to parse file' }, 500);
  }
});

// ── POST /execute ──────────────────────────────────────────────────────────

interface ImportMapping {
  title?: number | null;
  description?: number | null;
  status?: number | null;
  tags?: number | null;
  riskLevel?: number | null;
  regulatoryRef?: number | null;
  linkedRequirements?: number | null;
}

importRoutes.post('/execute', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const {
      projectId,
      entityType,
      mapping,
      data,
      duplicateHandling = 'create',
    }: {
      projectId: string;
      entityType: 'requirement' | 'test';
      mapping: ImportMapping;
      data: string[][];
      duplicateHandling: 'skip' | 'overwrite' | 'create';
    } = body;

    if (!projectId || !entityType || !mapping || !data) {
      return c.json({ message: 'Missing required fields: projectId, entityType, mapping, data' }, 400);
    }

    // Verify project belongs to caller's organization
    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) {
      return c.json({ message: 'Project not found' }, 404);
    }

    const getField = (row: string[], fieldIndex: number | null | undefined): string => {
      if (fieldIndex === null || fieldIndex === undefined || fieldIndex < 0 || fieldIndex >= row.length) {
        return '';
      }
      return row[fieldIndex].trim();
    };

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    if (entityType === 'requirement') {
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const title = getField(row, mapping.title);
          if (!title) {
            errors.push(`Row ${i + 1}: Missing title`);
            continue;
          }

          // Check for duplicates
          if (duplicateHandling !== 'create') {
            const existing = await prisma.requirement.findFirst({
              where: { projectId, title },
            });

            if (existing) {
              if (duplicateHandling === 'skip') {
                skipped++;
                continue;
              }
              // overwrite
              await prisma.requirement.update({
                where: { id: existing.id },
                data: {
                  description: getField(row, mapping.description) || existing.description,
                  status: getField(row, mapping.status) || existing.status,
                  tags: getField(row, mapping.tags) ? getField(row, mapping.tags).split(',').map((t) => t.trim()) : existing.tags,
                  riskLevel: getField(row, mapping.riskLevel) || existing.riskLevel,
                  regulatoryRef: getField(row, mapping.regulatoryRef) || existing.regulatoryRef,
                },
              });
              created++;
              continue;
            }
          }

          // Create new
          const count = await prisma.requirement.count({ where: { projectId } });
          const seqId = `REQ-${String(count + 1).padStart(3, '0')}`;

          const tagsField = getField(row, mapping.tags);
          const tags = tagsField ? tagsField.split(',').map((t) => t.trim()) : [];

          await prisma.requirement.create({
            data: {
              projectId,
              seqId,
              title,
              description: getField(row, mapping.description),
              status: getField(row, mapping.status) || 'Draft',
              tags,
              riskLevel: getField(row, mapping.riskLevel) || null,
              regulatoryRef: getField(row, mapping.regulatoryRef) || null,
              evidenceHints: [],
              createdBy: user.userId,
            },
          });
          created++;
        } catch (err: any) {
          errors.push(`Row ${i + 1}: ${err.message}`);
        }
      }
    } else if (entityType === 'test') {
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const title = getField(row, mapping.title);
          if (!title) {
            errors.push(`Row ${i + 1}: Missing title`);
            continue;
          }

          // Check for duplicates
          if (duplicateHandling !== 'create') {
            const existing = await prisma.test.findFirst({
              where: { projectId, title },
            });

            if (existing) {
              if (duplicateHandling === 'skip') {
                skipped++;
                continue;
              }
              // overwrite
              await prisma.test.update({
                where: { id: existing.id },
                data: {
                  description: getField(row, mapping.description) || existing.description,
                  status: getField(row, mapping.status) || existing.status,
                },
              });
              created++;
              continue;
            }
          }

          // Create new
          const count = await prisma.test.count({ where: { projectId } });
          const seqId = `TST-${String(count + 1).padStart(3, '0')}`;

          const linkedReqs = getField(row, mapping.linkedRequirements);
          const linkedRequirementIds = linkedReqs
            ? linkedReqs.split(',').map((r) => r.trim()).filter(Boolean)
            : [];

          await prisma.test.create({
            data: {
              projectId,
              seqId,
              title,
              description: getField(row, mapping.description),
              status: getField(row, mapping.status) || 'Not Run',
              linkedRequirementIds,
              createdBy: user.userId,
            },
          });
          created++;
        } catch (err: any) {
          errors.push(`Row ${i + 1}: ${err.message}`);
        }
      }
    }

    // Audit log
    await logAudit({
      projectId,
      userId: user.userId,
      action: 'import',
      entityType,
      entityId: projectId,
      newValue: { created, skipped, errors: errors.length, duplicateHandling },
    });

    return c.json({ created, skipped, errors });
  } catch (error: any) {
    console.error('Import execute error:', error);
    return c.json({ message: 'Failed to execute import' }, 500);
  }
});

export default importRoutes;
