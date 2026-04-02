# QAtrial — 12-18 Month Roadmap: Prototype → Product → Revenue

## Context

QAtrial v3.0 has extensive frontend features (AI co-pilot, ISO 13485, design control, 20 stores, 42 components, 8 verticals, 14 countries, 12 languages). But it runs entirely on **localStorage** — no backend, no database, no multi-user, no shared workspaces. This blocks ALL serious usage.

**Guiding rule: Build depth (compliance + workflows), not breadth (more features).**

**Position: "The system that makes audits pass — without Excel chaos."** Not competing with Jira or TestRail.

---

## What Already Exists (can be reused/migrated)

| Layer | Status | Can Reuse |
|-------|--------|-----------|
| TypeScript types (50+) | ✅ Complete | Yes — same types become backend entities |
| Zustand stores (20) | ✅ Client-only | Migrate to API calls — store logic becomes server services |
| React components (42) | ✅ Complete | Yes — swap store hooks for API hooks |
| AI prompts (8) | ✅ Complete | Yes — move API key handling to server |
| Templates (8 verticals, 14 countries) | ✅ Complete | Yes — serve from backend |
| i18n (12 languages, 425+ keys) | ✅ Complete | Yes — stays client-side |
| Theme system | ✅ Complete | Yes — stays client-side |

---

## Phase 1 — From Prototype → Real System (Months 0–3)

**Goal**: Turn QAtrial from a local demo into a real multi-user system.

### 1.1 Backend (simple but solid)

**Stack**: Node.js + Express/Hono + PostgreSQL + Prisma ORM

**Database schema** (core tables only — no overengineering):

```
users (id, email, password_hash, name, role, org_id, created_at)
organizations (id, name, created_at)
workspaces (id, name, org_id, created_at)
projects (id, workspace_id, name, description, owner, version, country, vertical, modules[], type, created_at)
requirements (id, project_id, title, description, status, tags[], risk_level, regulatory_ref, evidence_hints[], created_by, created_at, updated_at)
tests (id, project_id, title, description, status, linked_requirement_ids[], created_by, created_at, updated_at)
risks (id, project_id, requirement_id, severity, likelihood, detectability, risk_score, risk_level, mitigation, classified_by, created_at)
capa (id, project_id, title, status, root_cause, containment, corrective_action, preventive_action, effectiveness_check, linked_test_id, created_by, created_at, updated_at)
audit_log (id, project_id, timestamp, user_id, action, entity_type, entity_id, previous_value, new_value, reason)
```

**NOT building**: microservices, GraphQL, event sourcing, CQRS.

### 1.2 Authentication

- Email + password registration/login
- JWT sessions (access token + refresh token)
- Basic RBAC: **Admin**, **Editor**, **Viewer**
- Password hashing with bcrypt/argon2

### 1.3 Replace localStorage

- Create REST API endpoints for all CRUD operations
- New React hooks: `useApiRequirements()`, `useApiTests()`, etc. that call API instead of Zustand+localStorage
- **Migration path**: "Import from browser data" button that reads existing localStorage and POSTs to backend
- Zustand stores become thin API wrappers (cache + optimistic updates)

### 1.4 Multi-user workspaces

- Create organization → invite users by email
- Assign roles per workspace (Admin/Editor/Viewer)
- Shared projects visible to all workspace members
- Project-level permissions (who can edit vs view)

### 1.5 Server-side audit log

- **Append-only** PostgreSQL table (no UPDATE, no DELETE)
- Every API mutation creates an audit_log entry
- Fields: timestamp, user_id, action, entity_type, entity_id, previous_value (JSONB), new_value (JSONB), reason
- API endpoint: `GET /api/audit?project_id=X&entity_id=Y&from=&to=`

### Phase 1 Output

A real product. Usable by teams. Not just a demo.

**Key files to create**:
```
server/
  index.ts                    # Express/Hono entry point
  prisma/schema.prisma        # Database schema
  routes/
    auth.ts                   # Register, login, refresh
    requirements.ts           # CRUD
    tests.ts                  # CRUD  
    capa.ts                   # CRUD + lifecycle
    risks.ts                  # CRUD
    projects.ts               # CRUD + workspace membership
    audit.ts                  # Read-only, append-only
    users.ts                  # Invite, role management
  middleware/
    auth.ts                   # JWT verification
    rbac.ts                   # Role-based access
  services/
    audit.service.ts          # Append-only logging
src/
  hooks/
    useApi.ts                 # Generic API hook (fetch wrapper)
    useApiRequirements.ts     # Replaces useRequirementsStore for API mode
    useApiTests.ts            # Replaces useTestsStore for API mode
  lib/
    apiClient.ts              # Authenticated fetch wrapper
```

---

## Phase 2 — Make It Valuable (Months 3–6)

**Goal**: Turn QAtrial into something teams actually depend on.

### 2.1 Traceability (core differentiator)

- Link chain: **Requirement → Test → Result → Evidence → Risk**
- UI: table view + simple graph view showing link chains
- **"Missing links" detection**: requirements without tests, tests without evidence, risks without mitigation
- This is what QAtrial already shows in the traceability matrix — now backed by real database with multi-user visibility

### 2.2 Evidence system (critical for audits)

- File uploads (PDF, DOCX, images, screenshots)
- Link evidence to: tests, requirements, CAPA records
- Metadata per file: uploader, timestamp, version, description
- Storage: S3-compatible (MinIO for self-hosted, AWS S3 for cloud)
- Evidence completeness dashboard (already exists in frontend — now backed by real data)

### 2.3 Approval workflows (real, not simulated)

- Status chain: **Draft → In Review → Approved**
- Role-based approvals: only Editors/Admins can approve
- Mandatory approval gates for: requirements, tests, CAPA records
- Approval creates audit log entry + optional e-signature
- Blocked actions: can't link unapproved requirement to a test

### 2.4 Electronic signatures (basic version)

- Password re-confirmation at time of signing
- Captures: user identity, timestamp, meaning (authored/reviewed/approved), reason
- Immutable record in audit log
- NOT biometric or certificate-based yet — that's Phase 5

### 2.5 Audit export (huge win for early adoption)

- One-click export of entire project:
  - Requirements + linked tests + traceability matrix
  - Evidence files (zipped)
  - Audit trail (CSV + PDF)
  - Risk assessments
  - CAPA records
- Format: **PDF report + ZIP bundle**
- This is the feature that makes QA managers say "I need this"

### Phase 2 Output

Audit-ready workflows. Something auditors and QA managers understand. Strong differentiation vs Jira/TestRail.

---

## Phase 3 — First SaaS Version (Months 6–9)

**Goal**: Start generating revenue.

### 3.1 Hosted version (QAtrial Cloud)

- Deploy on AWS/Vercel/Railway
- Multi-tenant architecture (org isolation via workspace_id)
- Managed PostgreSQL (Neon/Supabase/RDS)
- S3 for evidence files
- Custom domain support for enterprise

### 3.2 Billing (Stripe)

| Plan | Price | Limits |
|------|-------|--------|
| Free | $0 | 1 project, 3 users, 50 requirements |
| Team | $49/month | 5 projects, 10 users, unlimited requirements |
| Pro | $149/month | Unlimited projects, 25 users, AI features, priority support |

### 3.3 AI (focused, not flashy)

Only keep high-value AI that's already built:
- **Gap analysis**: "What's missing for audit readiness?" ✅ (already built)
- **Test suggestions**: auto-generate from requirements ✅ (already built)
- **Requirement quality check**: flag vague/untestable requirements (new, small)

**NOT building**: chat, generic generation, AI agents. These don't drive revenue.

Move AI API calls to server-side (API keys in server env, not client localStorage).

### 3.4 Excel importer (massive adoption unlock)

- Upload Excel/CSV
- Column mapping UI: "Which column is the requirement title?"
- Preview before import
- Auto-structure into requirements/tests
- Handle duplicates (skip/overwrite/create new)

### Phase 3 Output

Paying customers. Real usage. Feedback loop.

---

## Phase 4 — Product-Market Fit (Months 9–12)

**Goal**: Become essential for ONE specific niche.

### Pick ONE vertical first

**Best options**: Regulated Software (GAMP/CSV) or MedTech.

**Do NOT do everything.** Deep in one vertical beats shallow in ten.

### 4.1 Compliance packs

Example packs:
- "FDA Software Validation Starter Pack" (GAMP 5, Part 11, CSV)
- "EU MDR Medical Device Pack" (ISO 13485, ISO 14971, IEC 62304)
- "GDPR + Quality Assurance Pack"

Each includes: templates, workflows, checklists, report templates, pre-configured approval chains.

### 4.2 Audit Mode UI

Dedicated read-only mode for auditors:
- Timeline view of all activity
- Evidence browser with search
- Traceability view (requirement → test → evidence chain)
- Cannot modify anything — pure inspection view
- Shareable link with time-limited access

### 4.3 Advanced roles & permissions

- QA Manager (full edit + approve)
- QA Engineer (edit, cannot approve)
- Auditor (read-only audit mode)
- Approver (can only review + approve, not edit)
- Custom role builder

### 4.4 Reporting dashboards

- Audit readiness score (already exists in frontend — now with real data)
- Missing evidence report
- Approval status overview (pending/approved/rejected by entity)
- Risk overview (matrix + trends)
- CAPA aging report (open CAPAs by age)

### Phase 4 Output

Clear niche. Strong positioning. Higher willingness to pay.

---

## Phase 5 — Enterprise Layer (Months 12–18)

**Goal**: Unlock high-ticket customers ($5K-50K/year contracts).

### 5.1 SSO (SAML/OIDC)

- Enterprise requirement — no SSO = no enterprise deal
- SAML 2.0 for legacy enterprise (Okta, Azure AD, OneLogin)
- OIDC for modern stack (Auth0, Keycloak)

### 5.2 Private deployments

- Docker Compose for self-hosted (PostgreSQL + Node + MinIO)
- Helm chart for Kubernetes
- Optional on-prem with air-gapped support (critical for pharma/defense)
- Configuration: environment variables, no cloud dependencies

### 5.3 Validation package

- System validation documentation (IQ/OQ/PQ for QAtrial itself)
- Exportable validation reports
- Statement of compliance (Part 11, Annex 11)
- This is what regulated companies need before they can USE the tool in production

### 5.4 API + integrations (targeted, not broad)

Only build integrations customers ask for:
- Jira (bidirectional sync for requirement ↔ issue)
- GitHub (test results from CI/CD)
- Webhooks (generic event notification)

**NOT building**: marketplace, plugin system, dozens of connectors.

### 5.5 SLA + support

- Response time commitments
- Onboarding support (setup, import, configuration)
- Dedicated Slack channel for Pro/Enterprise

### Phase 5 Output

Enterprise readiness. High-value deals.

---

## What NOT to Build (Yet)

| Don't Build | Why |
|-------------|-----|
| Too many integrations early | Doesn't drive revenue, high maintenance |
| Complex plugin systems | Over-engineering for current stage |
| Marketplace | No ecosystem to support it yet |
| Advanced AI agents | Flashy but doesn't solve the core problem |
| Mobile apps | Desktop/browser is fine for QA work |
| Perfect UI polish | Good enough is fine until PMF |
| More verticals before PMF | Deep in one beats shallow in ten |
| eCTD submission builder | Too niche for early revenue |
| eTMF/eConsent | Clinical trial features are Phase 5+ |
| Data residency | Only needed for enterprise contracts |

---

## Revenue Timeline (Realistic)

| Period | Revenue | Focus |
|--------|---------|-------|
| Months 0–6 | $0–$1K/month | Building the product |
| Months 6–9 | $1K–$5K/month | Early SaaS + services |
| Months 9–12 | $5K–$20K/month | Niche adoption |
| Months 12–18 | $20K–$100K+/month | Enterprise + compliance packs |

---

## Verification

### Phase 1
- `npm run build` — frontend clean
- `npm run server` — backend starts, connects to PostgreSQL
- Register user → login → create workspace → invite teammate → both see shared project
- Create requirement via API (`curl POST /api/requirements`) → appears in frontend
- All mutations logged in audit_log table (verify with `SELECT * FROM audit_log`)
- Import localStorage data → all existing data migrated to database

### Phase 2
- Upload evidence file → linked to test → appears in evidence dashboard
- Approve requirement → status changes → audit log entry created → e-signature recorded
- Export project → PDF report + ZIP with evidence files + audit trail CSV
- Traceability view shows: requirement → test → result → evidence chain

### Phase 3
- Deploy to cloud → accessible via URL
- Register → select Free plan → create project → hit limit → upgrade prompt
- Stripe checkout → payment → plan upgraded → limits raised
- Excel import: upload file → map columns → preview → import → requirements created

### Phase 4
- Select "FDA CSV Starter Pack" → pre-configured project with requirements, tests, workflows
- Share audit link → auditor sees read-only view with traceability + evidence
- CAPA aging report shows open CAPAs older than 30 days

### Phase 5
- SSO login via Okta/Azure AD → user lands in workspace
- Docker Compose: `docker-compose up` → full stack running locally
- Validation package: download IQ/OQ/PQ docs for QAtrial itself
