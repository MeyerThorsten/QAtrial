import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { signAccessToken, signRefreshToken, type JwtPayload } from '../middleware/auth.js';
import * as crypto from 'crypto';

const sso = new Hono();

// ── SSO Configuration from environment ─────────────────────────────────────

function getSsoConfig() {
  return {
    enabled: process.env.SSO_ENABLED === 'true',
    type: process.env.SSO_TYPE || 'oidc',
    issuerUrl: process.env.SSO_ISSUER_URL || '',
    clientId: process.env.SSO_CLIENT_ID || '',
    clientSecret: process.env.SSO_CLIENT_SECRET || '',
    callbackUrl: process.env.SSO_CALLBACK_URL || 'http://localhost:3001/api/auth/sso/callback',
    defaultRole: process.env.SSO_DEFAULT_ROLE || 'qa_engineer',
    autoProvision: process.env.SSO_AUTO_PROVISION !== 'false',
  };
}

// ── OIDC Discovery cache ───────────────────────────────────────────────────

let discoveryCache: {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  issuer: string;
} | null = null;
let discoveryCacheTime = 0;
const DISCOVERY_TTL = 3600_000; // 1 hour

async function getOidcDiscovery(issuerUrl: string) {
  if (discoveryCache && Date.now() - discoveryCacheTime < DISCOVERY_TTL) {
    return discoveryCache;
  }

  const url = `${issuerUrl.replace(/\/$/, '')}/.well-known/openid-configuration`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`OIDC discovery failed: ${res.status} ${res.statusText}`);
  }

  discoveryCache = await res.json() as typeof discoveryCache;
  discoveryCacheTime = Date.now();
  return discoveryCache!;
}

// In-memory state store for CSRF (in production, use Redis or DB)
const stateStore = new Map<string, { nonce: string; createdAt: number }>();

// Clean expired states (older than 10 minutes)
function cleanStates() {
  const now = Date.now();
  for (const [key, val] of stateStore.entries()) {
    if (now - val.createdAt > 600_000) {
      stateStore.delete(key);
    }
  }
}

// ── GET /config — public SSO configuration status ──────────────────────────

sso.get('/config', (c) => {
  const config = getSsoConfig();
  return c.json({
    enabled: config.enabled,
    type: config.type,
    providerName: config.issuerUrl
      ? new URL(config.issuerUrl).hostname.replace(/\.\w+$/, '')
      : null,
  });
});

// ── GET /login — initiate SSO flow ─────────────────────────────────────────

sso.get('/login', async (c) => {
  const config = getSsoConfig();

  if (!config.enabled) {
    return c.json({ message: 'SSO is not enabled' }, 400);
  }

  try {
    const discovery = await getOidcDiscovery(config.issuerUrl);

    const state = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(32).toString('hex');

    cleanStates();
    stateStore.set(state, { nonce, createdAt: Date.now() });

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      scope: 'openid profile email',
      state,
      nonce,
    });

    const authUrl = `${discovery.authorization_endpoint}?${params.toString()}`;
    return c.redirect(authUrl);
  } catch (error: any) {
    console.error('SSO login initiation error:', error);
    return c.json({ message: 'Failed to initiate SSO login' }, 500);
  }
});

// ── GET /callback — IdP redirects back here ────────────────────────────────

sso.get('/callback', async (c) => {
  const config = getSsoConfig();

  if (!config.enabled) {
    return c.json({ message: 'SSO is not enabled' }, 400);
  }

  const code = c.req.query('code');
  const state = c.req.query('state');
  const errorParam = c.req.query('error');

  if (errorParam) {
    const errorDesc = c.req.query('error_description') || errorParam;
    return c.redirect(`/?sso_error=${encodeURIComponent(errorDesc)}`);
  }

  if (!code || !state) {
    return c.redirect('/?sso_error=Missing+code+or+state');
  }

  // Validate state (CSRF protection)
  const storedState = stateStore.get(state);
  if (!storedState) {
    return c.redirect('/?sso_error=Invalid+or+expired+state');
  }
  stateStore.delete(state);

  try {
    const discovery = await getOidcDiscovery(config.issuerUrl);

    // Exchange code for tokens
    const tokenRes = await fetch(discovery.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.callbackUrl,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('Token exchange failed:', errBody);
      return c.redirect('/?sso_error=Token+exchange+failed');
    }

    const tokenData = await tokenRes.json() as {
      access_token: string;
      id_token?: string;
      token_type: string;
    };

    // Decode ID token to get user info (JWT payload is base64url-encoded)
    let email = '';
    let name = '';

    if (tokenData.id_token) {
      const parts = tokenData.id_token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(
          Buffer.from(parts[1], 'base64url').toString('utf-8'),
        );
        email = payload.email || '';
        name = payload.name || payload.preferred_username || '';
      }
    }

    // If no email from ID token, try userinfo endpoint
    if (!email && discovery.userinfo_endpoint) {
      const userinfoRes = await fetch(discovery.userinfo_endpoint, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (userinfoRes.ok) {
        const userinfo = await userinfoRes.json() as { email?: string; name?: string; preferred_username?: string };
        email = userinfo.email || '';
        name = name || userinfo.name || userinfo.preferred_username || '';
      }
    }

    if (!email) {
      return c.redirect('/?sso_error=No+email+in+SSO+response');
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user && config.autoProvision) {
      // Auto-provision: create org + workspace + user
      const org = await prisma.organization.create({
        data: { name: `${name || email}'s Organization` },
      });

      await prisma.workspace.create({
        data: { name: 'Default Workspace', orgId: org.id },
      });

      // SSO users get a random password hash (they authenticate via SSO, not password)
      const randomHash = crypto.randomBytes(64).toString('hex');

      user = await prisma.user.create({
        data: {
          email,
          passwordHash: randomHash,
          name: name || email.split('@')[0],
          role: config.defaultRole,
          orgId: org.id,
        },
      });
    }

    if (!user) {
      return c.redirect('/?sso_error=User+not+found+and+auto-provision+disabled');
    }

    // Generate a short-lived SSO exchange token
    const ssoToken = crypto.randomBytes(48).toString('hex');
    // Store mapping: ssoToken -> userId (expires in 60 seconds)
    ssoTokenStore.set(ssoToken, { userId: user.id, createdAt: Date.now() });

    // Redirect to frontend with token in URL fragment
    return c.redirect(`/#sso_token=${ssoToken}`);
  } catch (error: any) {
    console.error('SSO callback error:', error);
    return c.redirect('/?sso_error=SSO+authentication+failed');
  }
});

// In-memory SSO token exchange store
const ssoTokenStore = new Map<string, { userId: string; createdAt: number }>();

// ── POST /token — exchange SSO token for JWT pair ──────────────────────────

sso.post('/token', async (c) => {
  try {
    const { token } = await c.req.json();

    if (!token) {
      return c.json({ message: 'token is required' }, 400);
    }

    const stored = ssoTokenStore.get(token);
    if (!stored) {
      return c.json({ message: 'Invalid or expired SSO token' }, 401);
    }

    // Token is single-use
    ssoTokenStore.delete(token);

    // Check expiry (60 seconds)
    if (Date.now() - stored.createdAt > 60_000) {
      return c.json({ message: 'SSO token expired' }, 401);
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.orgId,
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error('SSO token exchange error:', error);
    return c.json({ message: 'SSO token exchange failed' }, 500);
  }
});

export default sso;
