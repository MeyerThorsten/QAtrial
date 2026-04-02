import { Hono } from 'hono';
import { prisma } from '../../index.js';
import { authMiddleware, getUser, requirePermission } from '../../middleware/auth.js';

const github = new Hono();

github.use('*', authMiddleware);

// ── Helpers ────────────────────────────────────────────────────────────────

function githubHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function getGithubConfig(orgId: string) {
  const integration = await prisma.integration.findFirst({
    where: { orgId, type: 'github', enabled: true },
  });
  if (!integration) return null;
  return {
    id: integration.id,
    config: integration.config as {
      token: string;
      owner: string;
      repo: string;
    },
    lastSyncAt: integration.lastSyncAt,
  };
}

// ── POST /connect — validate and store GitHub configuration ────────────────

github.post('/connect', requirePermission('canAdmin'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const { token, owner, repo } = body;
    if (!token || !owner || !repo) {
      return c.json({ message: 'token, owner, and repo are required' }, 400);
    }

    if (!user.orgId) {
      return c.json({ message: 'User must belong to an organization' }, 400);
    }

    // Validate by fetching the repo
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: githubHeaders(token),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return c.json({
        message: `Failed to connect to GitHub: ${res.status} - ${errText}`,
      }, 400);
    }

    const repoData = await res.json() as { full_name: string; private: boolean };

    // Upsert integration
    const existing = await prisma.integration.findFirst({
      where: { orgId: user.orgId, type: 'github' },
    });

    const configData = { token, owner, repo };

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
          type: 'github',
          config: configData,
          enabled: true,
        },
      });
    }

    return c.json({
      connected: true,
      repoFullName: repoData.full_name,
      isPrivate: repoData.private,
      integrationId: integration.id,
    });
  } catch (error: any) {
    console.error('GitHub connect error:', error);
    return c.json({ message: 'Failed to connect to GitHub' }, 500);
  }
});

// ── GET /status — connection status ────────────────────────────────────────

github.get('/status', async (c) => {
  try {
    const user = getUser(c);
    if (!user.orgId) {
      return c.json({ connected: false });
    }

    const config = await getGithubConfig(user.orgId);
    if (!config) {
      return c.json({ connected: false });
    }

    return c.json({
      connected: true,
      owner: config.config.owner,
      repo: config.config.repo,
      lastSyncAt: config.lastSyncAt,
    });
  } catch (error: any) {
    console.error('GitHub status error:', error);
    return c.json({ message: 'Failed to get GitHub status' }, 500);
  }
});

// ── POST /link-pr — link a requirement to a GitHub PR ──────────────────────

github.post('/link-pr', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const { requirementId, prNumber } = body;
    if (!requirementId || !prNumber) {
      return c.json({ message: 'requirementId and prNumber are required' }, 400);
    }

    if (!user.orgId) {
      return c.json({ message: 'User must belong to an organization' }, 400);
    }

    const config = await getGithubConfig(user.orgId);
    if (!config) {
      return c.json({ message: 'GitHub not connected' }, 400);
    }

    const { token, owner, repo } = config.config;

    // Verify PR exists
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: githubHeaders(token),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!res.ok) {
      return c.json({ message: `PR #${prNumber} not found` }, 404);
    }

    const prData = await res.json() as {
      number: number;
      title: string;
      html_url: string;
      state: string;
    };

    // Add PR link as tag on requirement
    const requirement = await prisma.requirement.findUnique({
      where: { id: requirementId },
    });

    if (!requirement) {
      return c.json({ message: 'Requirement not found' }, 404);
    }

    const prTag = `github:pr:${prNumber}`;
    if (!requirement.tags.includes(prTag)) {
      await prisma.requirement.update({
        where: { id: requirementId },
        data: {
          tags: [...requirement.tags, prTag],
        },
      });
    }

    return c.json({
      linked: true,
      pr: {
        number: prData.number,
        title: prData.title,
        url: prData.html_url,
        state: prData.state,
      },
    });
  } catch (error: any) {
    console.error('GitHub link-pr error:', error);
    return c.json({ message: 'Failed to link PR' }, 500);
  }
});

// ── POST /import-results — import test results from GitHub Actions ─────────

github.post('/import-results', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();

    const { projectId, runId } = body;
    if (!projectId) {
      return c.json({ message: 'projectId is required' }, 400);
    }

    if (!user.orgId) {
      return c.json({ message: 'User must belong to an organization' }, 400);
    }

    const config = await getGithubConfig(user.orgId);
    if (!config) {
      return c.json({ message: 'GitHub not connected' }, 400);
    }

    const { token, owner, repo } = config.config;

    // If runId provided, get that specific run. Otherwise get the latest.
    let runsUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs`;
    if (runId) {
      runsUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}`;
    } else {
      runsUrl += '?per_page=1&status=completed';
    }

    const runsRes = await fetch(runsUrl, {
      headers: githubHeaders(token),
      signal: AbortSignal.timeout(10_000),
    });

    if (!runsRes.ok) {
      return c.json({ message: 'Failed to fetch GitHub Actions runs' }, 500);
    }

    const runsData = await runsRes.json() as any;
    const run = runId ? runsData : runsData.workflow_runs?.[0];

    if (!run) {
      return c.json({ message: 'No workflow runs found' }, 404);
    }

    // Get jobs for this run
    const jobsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${run.id}/jobs`,
      {
        headers: githubHeaders(token),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!jobsRes.ok) {
      return c.json({ message: 'Failed to fetch workflow jobs' }, 500);
    }

    const jobsData = await jobsRes.json() as {
      jobs: Array<{
        name: string;
        conclusion: string;
        steps: Array<{
          name: string;
          conclusion: string;
        }>;
      }>;
    };

    // Map job results to test status updates
    let updated = 0;
    for (const job of jobsData.jobs) {
      // Try to match job name to test title
      const tests = await prisma.test.findMany({
        where: {
          projectId,
          title: { contains: job.name },
        },
      });

      for (const test of tests) {
        const newStatus = job.conclusion === 'success' ? 'Passed' : 'Failed';
        await prisma.test.update({
          where: { id: test.id },
          data: { status: newStatus },
        });
        updated++;
      }
    }

    // Update last sync time
    await prisma.integration.update({
      where: { id: config.id },
      data: { lastSyncAt: new Date() },
    });

    return c.json({
      runId: run.id,
      runName: run.name,
      conclusion: run.conclusion,
      jobsCount: jobsData.jobs.length,
      testsUpdated: updated,
    });
  } catch (error: any) {
    console.error('GitHub import-results error:', error);
    return c.json({ message: 'Failed to import test results' }, 500);
  }
});

export default github;
