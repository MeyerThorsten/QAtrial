import { Hono } from 'hono';
import { prisma } from '../../index.js';
import { authMiddleware, getUser, requirePermission } from '../../middleware/auth.js';

const jira = new Hono();

jira.use('*', authMiddleware);

// ── Helpers ────────────────────────────────────────────────────────────────

function jiraHeaders(email: string, apiToken: string): Record<string, string> {
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
  return {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function getJiraConfig(orgId: string) {
  const integration = await prisma.integration.findFirst({
    where: { orgId, type: 'jira', enabled: true },
  });
  if (!integration) return null;
  return {
    id: integration.id,
    config: integration.config as {
      baseUrl: string;
      email: string;
      apiToken: string;
      projectKey: string;
    },
    lastSyncAt: integration.lastSyncAt,
  };
}

// ── POST /connect — validate and store Jira configuration ──────────────────

jira.post('/connect', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const { baseUrl, email, apiToken, projectKey } = body;
    if (!baseUrl || !email || !apiToken || !projectKey) {
      return c.json({ message: 'baseUrl, email, apiToken, and projectKey are required' }, 400);
    }

    if (!user.orgId) {
      return c.json({ message: 'User must belong to an organization' }, 400);
    }

    // Validate by fetching the project from Jira
    const cleanBase = baseUrl.replace(/\/$/, '');
    const res = await fetch(`${cleanBase}/rest/api/3/project/${projectKey}`, {
      headers: jiraHeaders(email, apiToken),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return c.json({
        message: `Failed to connect to Jira: ${res.status} - ${errText}`,
      }, 400);
    }

    const projectData = await res.json() as { key: string; name: string };

    // Upsert integration
    const existing = await prisma.integration.findFirst({
      where: { orgId: user.orgId, type: 'jira' },
    });

    const configData = { baseUrl: cleanBase, email, apiToken, projectKey };

    let integration;
    if (existing) {
      integration = await prisma.integration.update({
        where: { id: existing.id },
        data: { config: configData, enabled: true },
      });
    } else {
      integration = await prisma.integration.create({
        data: {
          orgId: user.orgId,
          type: 'jira',
          config: configData,
          enabled: true,
        },
      });
    }

    return c.json({
      connected: true,
      projectName: projectData.name,
      projectKey: projectData.key,
      integrationId: integration.id,
    });
  } catch (error: any) {
    console.error('Jira connect error:', error);
    return c.json({ message: 'Failed to connect to Jira' }, 500);
  }
});

// ── GET /status — connection status ────────────────────────────────────────

jira.get('/status', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ connected: false });
    }

    const config = await getJiraConfig(user.orgId);
    if (!config) {
      return c.json({ connected: false });
    }

    return c.json({
      connected: true,
      projectKey: config.config.projectKey,
      baseUrl: config.config.baseUrl,
      lastSyncAt: config.lastSyncAt,
    });
  } catch (error: any) {
    console.error('Jira status error:', error);
    return c.json({ message: 'Failed to get Jira status' }, 500);
  }
});

// ── POST /sync — sync requirements to/from Jira ───────────────────────────

jira.post('/sync', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ message: 'User must belong to an organization' }, 400);
    }

    const config = await getJiraConfig(user.orgId);
    if (!config) {
      return c.json({ message: 'Jira not connected' }, 400);
    }

    const { baseUrl, email, apiToken, projectKey } = config.config;
    const headers = jiraHeaders(email, apiToken);

    // Get all requirements for the org's projects
    const projects = await prisma.project.findMany({
      where: {
        workspace: { orgId: user.orgId },
      },
      select: { id: true },
    });

    const projectIds = projects.map((p) => p.id);
    const requirements = await prisma.requirement.findMany({
      where: { projectId: { in: projectIds } },
    });

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const req of requirements) {
      try {
        // Check if there's already a linked Jira issue (stored in tags as jira:ISSUE-KEY)
        const jiraTag = req.tags.find((t) => t.startsWith('jira:'));

        if (jiraTag) {
          // Update existing issue
          const issueKey = jiraTag.replace('jira:', '');
          const updateRes = await fetch(
            `${baseUrl}/rest/api/3/issue/${issueKey}`,
            {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                fields: {
                  summary: req.title,
                  description: {
                    type: 'doc',
                    version: 1,
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: req.description || 'No description' }],
                      },
                    ],
                  },
                },
              }),
              signal: AbortSignal.timeout(10_000),
            },
          );
          if (updateRes.ok) updated++;
          else errors++;
        } else {
          // Create new issue
          const createRes = await fetch(`${baseUrl}/rest/api/3/issue`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              fields: {
                project: { key: projectKey },
                summary: `[${req.seqId}] ${req.title}`,
                description: {
                  type: 'doc',
                  version: 1,
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: req.description || 'No description' }],
                    },
                  ],
                },
                issuetype: { name: 'Task' },
              },
            }),
            signal: AbortSignal.timeout(10_000),
          });

          if (createRes.ok) {
            const issueData = await createRes.json() as { key: string };
            // Tag the requirement with the Jira issue key
            await prisma.requirement.update({
              where: { id: req.id },
              data: { tags: [...req.tags, `jira:${issueData.key}`] },
            });
            created++;
          } else {
            errors++;
          }
        }
      } catch {
        errors++;
      }
    }

    // Update last sync time
    await prisma.integration.update({
      where: { id: config.id },
      data: { lastSyncAt: new Date() },
    });

    return c.json({ created, updated, errors, total: requirements.length });
  } catch (error: any) {
    console.error('Jira sync error:', error);
    return c.json({ message: 'Failed to sync with Jira' }, 500);
  }
});

// ── GET /issues — list Jira issues ─────────────────────────────────────────

jira.get('/issues', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ issues: [] });
    }

    const config = await getJiraConfig(user.orgId);
    if (!config) {
      return c.json({ message: 'Jira not connected' }, 400);
    }

    const { baseUrl, email, apiToken, projectKey } = config.config;
    const jql = encodeURIComponent(`project=${projectKey} ORDER BY created DESC`);

    const res = await fetch(
      `${baseUrl}/rest/api/3/search?jql=${jql}&maxResults=50&fields=summary,status,issuetype,created`,
      {
        headers: jiraHeaders(email, apiToken),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!res.ok) {
      return c.json({ message: 'Failed to fetch Jira issues' }, 500);
    }

    const data = await res.json() as {
      issues: Array<{
        key: string;
        fields: {
          summary: string;
          status: { name: string };
          issuetype: { name: string };
          created: string;
        };
      }>;
    };

    const issues = data.issues.map((i) => ({
      key: i.key,
      summary: i.fields.summary,
      status: i.fields.status.name,
      type: i.fields.issuetype.name,
      created: i.fields.created,
    }));

    return c.json({ issues });
  } catch (error: any) {
    console.error('Jira issues error:', error);
    return c.json({ message: 'Failed to fetch Jira issues' }, 500);
  }
});

// ── POST /import/:issueKey — import a Jira issue as a requirement ──────────

jira.post('/import/:issueKey', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { issueKey } = c.req.param();
    const body = await c.req.json();
    const { projectId } = body;

    if (!projectId) {
      return c.json({ message: 'projectId is required' }, 400);
    }

    if (!user.orgId) {
      return c.json({ message: 'User must belong to an organization' }, 400);
    }

    const config = await getJiraConfig(user.orgId);
    if (!config) {
      return c.json({ message: 'Jira not connected' }, 400);
    }

    const { baseUrl, email, apiToken } = config.config;

    const res = await fetch(
      `${baseUrl}/rest/api/3/issue/${issueKey}?fields=summary,description`,
      {
        headers: jiraHeaders(email, apiToken),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!res.ok) {
      return c.json({ message: `Failed to fetch Jira issue ${issueKey}` }, 400);
    }

    const issue = await res.json() as {
      key: string;
      fields: {
        summary: string;
        description?: { content?: Array<{ content?: Array<{ text?: string }> }> };
      };
    };

    // Extract plain text from ADF description
    let description = '';
    if (issue.fields.description?.content) {
      description = issue.fields.description.content
        .flatMap((block) => block.content?.map((c) => c.text) || [])
        .filter(Boolean)
        .join('\n');
    }

    // Generate sequential ID
    const count = await prisma.requirement.count({ where: { projectId } });
    const seqId = `REQ-${String(count + 1).padStart(3, '0')}`;

    const requirement = await prisma.requirement.create({
      data: {
        projectId,
        seqId,
        title: issue.fields.summary,
        description,
        status: 'Draft',
        tags: [`jira:${issue.key}`],
        createdBy: user.userId,
      },
    });

    return c.json({ requirement }, 201);
  } catch (error: any) {
    console.error('Jira import error:', error);
    return c.json({ message: 'Failed to import Jira issue' }, 500);
  }
});

export default jira;
