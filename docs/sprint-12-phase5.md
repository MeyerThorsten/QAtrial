# Sprint 12: Phase 5 — Enterprise Layer

## What was built

Phase 5 adds everything needed for enterprise deployment: Docker packaging, SSO, validation documentation, webhooks, Jira/GitHub integrations, and a tabbed settings page.

---

### Docker Deployment
- **Dockerfile** — multi-stage build (frontend → server → slim runtime), serves static files in production
- **docker-compose.yml** — `app` + `db` (PostgreSQL 16) services, health checks, named volumes for data + uploads
- **.dockerignore** — excludes dev artifacts
- **.env.example** — template for all configuration variables
- Server updated to serve `dist/` as static files when `NODE_ENV=production`

```bash
docker-compose up    # starts QAtrial + PostgreSQL, accessible at http://localhost:3001
```

### SSO (OIDC)
- **Backend** (`server/routes/sso.ts`): OIDC discovery (`.well-known/openid-configuration`), authorization redirect, callback token exchange, auto-provisioning (first login creates user with configurable default role)
- **Frontend**: "Sign in with SSO" button on LoginPage (only shown when SSO configured), callback token exchange
- Env vars: `SSO_ENABLED`, `SSO_ISSUER_URL`, `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET`, `SSO_CALLBACK_URL`, `SSO_DEFAULT_ROLE`
- Works with: Okta, Azure AD/Entra ID, Auth0, Keycloak, Google Workspace

### Validation Package (IQ/OQ/PQ)
5 documents in `docs/validation/`:

| Document | Purpose | Content |
|----------|---------|---------|
| **IQ** (Installation Qualification) | Verify correct installation | 9 test steps: server, DB, frontend, registration, login, file storage, theme, language |
| **OQ** (Operational Qualification) | Verify correct operation | 18 test steps: wizard, CRUD, traceability, AI, approvals, evidence, export, import, design control, ISO 13485, CAPA, audit mode, RBAC |
| **PQ** (Performance Qualification) | Customer-specific validation | Template with blanks: environment, customer tests, performance criteria |
| **Compliance Statement** | Regulatory alignment | 21 CFR Part 11 (15 sections), EU Annex 11 (17 sections), GAMP 5 Cat 4 |
| **Traceability Matrix** | Feature → regulation mapping | 75 requirements across 6 standards mapped to QAtrial features + IQ/OQ/PQ test IDs |

### Webhooks
- **Backend** (`server/routes/webhooks.ts`): CRUD for webhook configuration + test endpoint
- **Service** (`server/services/webhook.service.ts`): fire-and-forget dispatch with HMAC-SHA256 signing, retry tracking
- **Events dispatched**: requirement.created/updated/deleted, test.created/updated/failed, capa.created/status_changed, approval.requested/approved/rejected, signature.created, evidence.uploaded
- **UI** (`src/components/settings/WebhookSettings.tsx`): webhook list, add/edit modal, event selector, test button

### Jira Integration
- **Backend** (`server/routes/integrations/jira.ts`): connect (validates project), status check, bidirectional sync (requirement ↔ issue), list issues, import issue as requirement
- Uses Jira Cloud REST API v3 with Basic auth (email:apiToken)

### GitHub Integration
- **Backend** (`server/routes/integrations/github.ts`): connect (validates repo), status check, link PR to requirement, import test results from GitHub Actions workflow runs
- Uses GitHub REST API v3 with Personal Access Token

### Settings Page
- **Tabbed settings** (`src/components/settings/SettingsPage.tsx`): AI Providers, Webhooks, Integrations, SSO
- Replaces the direct ProviderSettings rendering in AppShell

### Status Endpoint
- `GET /api/status` — public health check: version, uptime, database connectivity, AI provider status, storage health, free memory

---

## Database Models Added
- `Webhook` — orgId, name, url, secret, events[], enabled, lastTriggered, lastStatus
- `Integration` — orgId, type (jira/github), config (JSON), enabled, lastSyncAt

## Files Created: 17
## Files Modified: 14
## Build Status: Clean
