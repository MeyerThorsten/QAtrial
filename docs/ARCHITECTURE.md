# QAtrial Architecture Documentation

Technical architecture documentation for QAtrial, the regulated quality workspace.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Backend Architecture](#2-backend-architecture)
3. [Database Schema](#3-database-schema)
4. [Authentication and Authorization](#4-authentication-and-authorization)
5. [API Architecture](#5-api-architecture)
6. [Docker Architecture](#6-docker-architecture)
7. [SSO / OIDC Architecture](#7-sso--oidc-architecture)
8. [Webhook Event System](#8-webhook-event-system)
9. [Integration Architecture (Jira / GitHub)](#9-integration-architecture-jira--github)
10. [Data Model (Client)](#10-data-model-client)
11. [State Management](#11-state-management)
12. [Audit Trail](#12-audit-trail)
13. [Template Composition Engine](#13-template-composition-engine)
14. [AI System](#14-ai-system)
15. [Connector Framework](#15-connector-framework)
16. [Code Splitting](#16-code-splitting)
17. [i18n Architecture](#17-i18n-architecture)
18. [Theming](#18-theming)
19. [Component Architecture](#19-component-architecture)
20. [Test Infrastructure](#20-test-infrastructure)
21. [File Structure](#21-file-structure)

---

## 1. System Overview

### Architecture Diagram

```
+-------------------------------------------------------------------------+
|                           Browser (SPA)                                  |
|                                                                          |
|  +------------------+   +------------------+   +--------------------+    |
|  |   React 19 UI    |   |  Zustand Stores  |   |  Template Engine   |    |
|  |  (55+ components)|<->|  (20 stores)     |   |  (Composer + Packs)|    |
|  +------------------+   +------------------+   +--------------------+    |
|         |                       |                       |                |
|         v                       v                       v                |
|  +------------------+   +------------------+   +--------------------+    |
|  | react-i18next    |   | apiClient.ts     |   | Dynamic Imports    |    |
|  | (12 languages)   |   | (Bearer tokens)  |   | (lazy templates)   |    |
|  +------------------+   +------------------+   +--------------------+    |
|         |                       |                                        |
|         v                       v                                        |
|  +------------------+   +----------------------------------------------+|
|  | AI Client        |   |           Hono REST API (:3001)              ||
|  | (provider router) |   |                                              ||
|  +------------------+   |  +----------+  +----------+  +------------+  ||
|         |               |  | JWT Auth |  | Routes   |  | Audit Svc  |  ||
|         v               |  | + RBAC   |  | (21 grps)|  | (append)   |  ||
|  +------------------+   |  +----------+  +----------+  +------------+  ||
|  | AI Proxy (opt.)  |   |  +----------+  +----------+  +------------+  ||
|  | POST /api/ai/*   |   |  | SSO/OIDC |  | Webhooks |  | Dashboard  |  ||
|  +------------------+   |  | (IdP)    |  | (HMAC)   |  | Analytics  |  ||
|         |               |  +----------+  +----------+  +------------+  ||
|         v               |         |                         |          ||
|  External LLM APIs      |         v                         v          ||
|  (Anthropic/OpenAI)     |  +----------------------------------------------+
|                         |  |       PostgreSQL (Prisma ORM v7)            |
|                         |  |  25+ models: User, Org, Workspace, Project,  |
|                         |  |  Req, Test, Risk, CAPA, AuditLog, Evidence, |
|                         |  |  Approval, Signature, Webhook, Integration, |
|                         |  |  Complaint, Supplier, BatchRecord, Training, |
|                         |  |  Document, System, PMSEntry, UDIEntry,       |
|                         |  |  StabilityStudy, MonitoringPoint, AuditRec   |
|                         |  +----------------------------------------------+
|                         +----------------------------------------------+|
|  +------------------+   +------------------+                            |
|  | Auth Store       |   | Integrations     |-------> Jira Cloud         |
|  | (RBAC, sessions) |   | (Jira, GitHub)   |-------> GitHub API         |
|  +------------------+   +------------------+                            |
+-------------------------------------------------------------------------+
                |                                |
                v                                v
     +-------------------+            +-------------------+
     | Docker Compose    |            | Identity Provider  |
     | app + PostgreSQL  |            | (Okta/Azure AD/    |
     +-------------------+            |  Auth0/Keycloak)   |
                                      +-------------------+
```

### Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 8.x | Build tool and dev server |
| Tailwind CSS | 4.x | Utility-first styling with CSS custom properties |
| Zustand | 5.x | Lightweight state management with persistence |
| TanStack Table | v8 | Headless table with sorting, filtering, pagination |
| Recharts | 3.x | Declarative charting (pie, bar, line) |
| react-i18next | 16.x | Internationalization framework |
| i18next-http-backend | 3.x | Lazy-load translation files via HTTP |
| Lucide React | Latest | Icon library |
| **Hono** | **4.x** | **TypeScript-first HTTP framework (backend)** |
| **Prisma** | **7.x** | **ORM and database client (15 models)** |
| **PostgreSQL** | **16+** | **Relational database** |
| **jsonwebtoken** | **9.x** | **JWT access/refresh token signing and verification** |
| **bcryptjs** | **3.x** | **Password hashing (12 rounds)** |
| **Docker** | **20.10+** | **Container deployment (multi-stage build)** |

### Design Principles

1. **Dual-Mode Architecture:** QAtrial operates in two modes: (a) client-only with localStorage for demos and standalone use, and (b) full-stack with a Hono backend server and PostgreSQL for team/production use. The `apiClient.ts` fetch wrapper connects the frontend to the backend via Bearer token authentication.
2. **Composition Over Inheritance:** Templates are composed from independent dimensions (country, vertical, project type, modules) rather than inherited from base classes.
3. **Deduplication by Template ID:** When templates overlap, deduplication uses `templateId` (falls back to title for backward compatibility). Later sources override earlier ones.
4. **Lazy Loading and Code Splitting:** Template files, translation files, and tab components are loaded via dynamic imports (`React.lazy` + `Suspense`). Vite manual chunks split vendor code into `vendor-react`, `vendor-charts`, `vendor-table`, `vendor-i18n`, `vendor-state`, `templates`, and `ai` bundles.
5. **Purpose-Scoped AI:** Different AI tasks can be routed to different LLM providers based on purpose configuration. AI responses are validated with JSON schema validation and retry logic.
6. **GxP Awareness:** Every feature considers regulatory compliance (audit trails, electronic signatures, change control, CAPA lifecycle).
7. **Role-Based Access Control:** Server-enforced RBAC with five roles (admin, qa_manager, qa_engineer, auditor, reviewer) via JWT middleware with `requirePermission()` guards, plus client-side permission checks.
8. **Append-Only Audit:** The server-side audit log in PostgreSQL is append-only. Audit records cannot be modified or deleted through the API, ensuring regulatory integrity.
9. **Connector Extensibility:** A pluggable connector framework allows integration with external systems (Jira, GitHub, ALM tools, etc.) via a typed registry.
10. **Docker-First Deployment:** Multi-stage Dockerfile and docker-compose.yml provide production-ready containerized deployment with health checks and persistent volumes.

---

## 2. Backend Architecture

### Overview

The backend is a Hono HTTP server running on Node.js via `tsx` (TypeScript execution). It serves a REST API on port 3001. In production (Docker), it also serves the built frontend as static files.

### Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js 20 + tsx | TypeScript execution without compilation step |
| Framework | Hono | Lightweight, TypeScript-first HTTP framework |
| Database | PostgreSQL 16 | Relational data storage |
| ORM | Prisma v7 | Type-safe database client and schema management (25+ models) |
| Auth | JWT (jsonwebtoken) | Stateless authentication with access/refresh tokens |
| Passwords | bcryptjs | Password hashing with 12 salt rounds |
| Webhooks | Custom service | Fire-and-forget dispatch with HMAC-SHA256 signing |
| SSO | OIDC | OpenID Connect discovery, authorization, token exchange |

### Server Entry Point

`server/index.ts` creates a Hono app, registers CORS middleware, mounts 28+ route groups under `/api/`, serves static files in production, and starts listening on port 3001.

```typescript
const app = new Hono();
app.use('*', cors({ origin: [...], credentials: true }));

// Core routes
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
app.route('/api/auth/sso', ssoRoutes);
app.route('/api/webhooks', webhookRoutes);
app.route('/api/integrations/jira', jiraRoutes);
app.route('/api/integrations/github', githubRoutes);
app.route('/api/audit-mode', auditmodeRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.get('/api/status', (c) => c.json({ status: 'ok', version: '3.0.0', ... }));
app.get('/api/health', (c) => c.json({ status: 'ok', version: '3.0.0' }));

// Vertical-depth routes (Sprints 1-4)
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
app.route('/api/auditrecords', auditRecordRoutes);

// Production: serve static files from dist/
if (process.env.NODE_ENV === 'production') {
  app.get('*', serveStatic({ root: './dist' }));
}
```

### Middleware Chain

All routes except public endpoints require authentication. The middleware chain is:

1. **CORS** -- Applied globally via `app.use('*', cors(...))`
2. **authMiddleware** -- Applied per route group via `routes.use('*', authMiddleware)`. Extracts the Bearer token from the `Authorization` header, verifies it with `jwt.verify()`, rejects refresh tokens, and attaches the decoded `JwtPayload` to the request context.
3. **requireRole(...roles)** -- Optional middleware guard for role-restricted endpoints (e.g., admin-only routes).
4. **requirePermission(permission)** -- Granular permission check middleware (canView, canEdit, canApprove, canAdmin) that maps roles to permissions.

### Public Endpoints (No Auth Required)

- `GET /api/health` -- Basic health check
- `GET /api/status` -- Detailed status (version, uptime, DB connectivity, AI status, memory)
- `POST /api/auth/register` -- User registration
- `POST /api/auth/login` -- User login
- `POST /api/auth/refresh` -- Token refresh
- `GET /api/auth/sso/login` -- SSO redirect
- `GET /api/auth/sso/callback` -- SSO callback
- `GET /api/audit-mode/:token/*` -- Audit mode read-only endpoints

### Request/Response Pattern

All routes follow a consistent pattern:

```typescript
router.post('/', async (c) => {
  try {
    const user = getUser(c);           // Get authenticated user from JWT
    const body = await c.req.json();   // Parse request body
    // Validate input
    // Perform database operation via Prisma
    // Log audit entry via logAudit()
    // Dispatch webhook events
    return c.json({ data }, 201);      // Return success response
  } catch (error) {
    console.error('...:', error);
    return c.json({ message: '...' }, 500);
  }
});
```

### Error Handling

All endpoints return JSON error responses in a consistent format:

```json
{ "message": "Human-readable error description" }
```

Standard HTTP status codes:
- `200` -- Success
- `201` -- Created
- `400` -- Validation error (missing fields, invalid input)
- `401` -- Authentication error (missing/invalid/expired token)
- `403` -- Authorization error (insufficient role/permission)
- `404` -- Not found
- `409` -- Conflict (e.g., duplicate email on registration)
- `500` -- Internal server error

---

## 3. Database Schema

### Entity-Relationship Diagram (PostgreSQL)

```
+-------------------+       +-------------------+       +-------------------+
|   Organization    |       |     Workspace     |       |     Project       |
|-------------------|       |-------------------|       |-------------------|
| id (PK, uuid)    |<------| orgId (FK)        |<------| workspaceId (FK)  |
| name              |  1:N  | name              |  1:N  | name              |
| createdAt         |       | createdAt         |       | description       |
+-------------------+       +-------------------+       | owner, version    |
       |                                                | country, vertical |
       | 1:N                                            | modules[], type   |
       v                                                | createdAt         |
+-------------------+                                   | updatedAt         |
|      User         |                                   +-------------------+
|-------------------|                                          |
| id (PK, uuid)    |                          +------+--------+--------+------+
| email (unique)    |                          |      |        |        |      |
| passwordHash      |                     1:N  v   1:N v    1:N v   1:N v  1:N v
| name              |               +----------+ +------+ +-----+ +------+ +--------+
| role              |               |Requirement| | Test | | Risk| | CAPA | |AuditLog|
| orgId (FK)        |               |----------| |------| |-----| |------| |--------|
| createdAt         |               | id (PK)  | |id(PK)| |id   | |id    | |id      |
+-------------------+               | projectId| |projId| |projId |projId| |projId  |
       |                            | seqId    | |seqId | |reqId | |title | |userId  |
       |                            | title    | |title | |sever.| |status| |action  |
       | 1:N                        | status   | |status| |likel.| |root  | |entity  |
       v                            | tags[]   | |linkId| |score | |cause | |prev/new|
+-------------------+               +----------+ +------+ +-----+ +------+ +--------+
|    Webhook        |
|-------------------|
| id (PK, uuid)    |
| orgId (FK)       |               +-------------------+   +-------------------+
| name              |               |    Evidence       |   |    Approval       |
| url               |               |-------------------|   |-------------------|
| secret            |               | id (PK)           |   | id (PK)           |
| events[]          |               | requirementId     |   | entityType        |
| enabled           |               | type               |   | entityId          |
| lastTriggered     |               | description        |   | status            |
+-------------------+               +-------------------+   +-------------------+

+-------------------+               +-------------------+
|   Integration     |               |    Signature      |
|-------------------|               |-------------------|
| id (PK, uuid)    |               | id (PK)           |
| orgId (FK)       |               | entityType        |
| type (jira/github)|               | entityId          |
| config (JSON)     |               | userId            |
| enabled           |               | meaning           |
| lastSyncAt        |               | timestamp         |
+-------------------+               +-------------------+
```

### Models (25+)

#### Core Models (14)

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `User` | email (unique), passwordHash, name, role, orgId | User accounts |
| `Organization` | name | Multi-tenant container |
| `Workspace` | name, orgId | Project grouping within org |
| `Project` | name, description, owner, version, country, vertical, modules[], type | Project metadata |
| `Requirement` | projectId, seqId (REQ-NNN), title, description, status, tags[], riskLevel, regulatoryRef, evidenceHints[] | Requirements with auto seqId |
| `Test` | projectId, seqId (TST-NNN), title, description, status, linkedRequirementIds[] | Tests with auto seqId |
| `Risk` | projectId, requirementId, severity, likelihood, detectability, riskScore, riskLevel, mitigation | Risk assessments |
| `CAPA` | projectId, title, status, rootCause, containment, correctiveAction, preventiveAction, effectivenessCheck, linkedTestId, cascadeTriggers (JSON) | CAPA records with lifecycle and cascade triggers |
| `AuditLog` | projectId, timestamp, userId, action, entityType, entityId, previousValue (JSON), newValue (JSON), reason | Append-only audit trail |
| `Evidence` | requirementId, type, description, reference | Evidence attachments |
| `Approval` | entityType, entityId, status, requestedBy, approvedBy | Approval workflow records |
| `Signature` | entityType, entityId, userId, meaning, reason, timestamp | Electronic signature records |
| `Webhook` | orgId, name, url, secret, events[], enabled, lastTriggered, lastStatus | Webhook configurations |
| `Integration` | orgId, type (jira/github), config (JSON), enabled, lastSyncAt | External integration configs |

#### Medical Device Track Models

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `Complaint` | projectId, title, description, status (received/investigating/resolved/closed), severity, product, regulatoryReportable, fscaReference, capaId | Complaint management with investigation workflow |
| `Supplier` | projectId, name, defectRate, onTimeDelivery, riskScore, status (approved/conditional/disqualified), nextAuditDate | Supplier quality scorecards with auto-requalification |
| `PMSEntry` | projectId, source, description, reportPeriod, psurIncluded | Post-market surveillance entries |
| `UDIEntry` | projectId, deviceIdentifier, productionIdentifier, deviceName, gudidRegistered, eudamedRegistered | UDI device identifier tracking |

#### Pharma Track Models

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `BatchRecord` | projectId, batchNumber, product, status (in_progress/pending_review/released/rejected), templateId, steps (JSON), yield, releasedBy | Electronic batch records with e-signature release |
| `StabilityStudy` | projectId, product, condition, pullSchedule[], readings (JSON), oosDetected, ootDetected | Stability studies per ICH Q1A |
| `MonitoringPoint` | projectId, location, parameter, thresholdMin, thresholdMax, alertThreshold, actionThreshold | Environmental monitoring points |
| `TrainingPlan` | projectId, name, courses[], targetRoles[] | Training plans |
| `TrainingCourse` | projectId, title, description, qualificationCriteria | Training courses |
| `TrainingRecord` | userId, courseId, planId, status (planned/in_progress/completed/expired), completedAt, expiresAt | Training completion records |

#### Software/GAMP Track Models

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `ComputerizedSystem` | projectId, name, gampCategory (1/3/4/5), validationStatus, riskLevel, nextReviewDate | Computerized system inventory (GAMP 5) |

#### Cross-Vertical Models

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `Document` | projectId, title, type, status (draft/review/approved/effective/superseded/retired), version, content, history (JSON) | Document lifecycle management (SOP versioning) |
| `AuditRecord` | projectId, title, auditType, scheduledDate, scope, findings (JSON) | Audit management with findings tracker |

### Cascade Deletes

All project-scoped models (Requirement, Test, Risk, CAPA, AuditLog) have `onDelete: Cascade` on the `projectId` relation. Deleting a project removes all its child records.

### Sequential ID Generation

Requirements and tests use auto-generated sequential IDs per project:

```typescript
async function nextSeqId(projectId: string): Promise<string> {
  const count = await prisma.requirement.count({ where: { projectId } });
  return `REQ-${String(count + 1).padStart(3, '0')}`;
}
```

This produces: REQ-001, REQ-002, ... TST-001, TST-002, etc.

---

## 4. Authentication and Authorization

### JWT Authentication Flow

```
1. POST /api/auth/register
   -> Creates User + Organization + Workspace
   -> Returns { accessToken (24h), refreshToken (7d), user }

2. POST /api/auth/login
   -> Verifies email + bcrypt password
   -> Returns { accessToken (24h), refreshToken (7d), user }

3. All subsequent API requests
   -> Header: Authorization: Bearer <accessToken>
   -> authMiddleware verifies token, attaches user to context

4. POST /api/auth/refresh
   -> Body: { refreshToken }
   -> Returns new { accessToken, refreshToken }

5. GET /api/auth/me
   -> Returns current user profile from token
```

### Token Structure (JwtPayload)

```typescript
interface JwtPayload {
  userId: string;
  email: string;
  role: string;        // "admin" | "qa_manager" | "qa_engineer" | "auditor" | "reviewer"
  orgId: string | null;
}
```

Access tokens expire after 24 hours. Refresh tokens expire after 7 days and include a `type: 'refresh'` field to prevent use as access tokens.

### RBAC (Server-Side, 5 Roles)

Five roles enforced by the `requirePermission()` middleware:

| Role | canView | canEdit | canApprove | canAdmin |
|------|---------|---------|------------|----------|
| `admin` | Yes | Yes | Yes | Yes |
| `qa_manager` | Yes | Yes | Yes | No |
| `qa_engineer` | Yes | Yes | No | No |
| `auditor` | Yes | No | No | No |
| `reviewer` | Yes | No | Yes | No |

Example usage in routes:

```typescript
// Admin-only endpoint
router.post('/invite', requirePermission('canAdmin'), async (c) => { ... });

// Edit permission required
router.post('/', requirePermission('canEdit'), async (c) => { ... });

// Approve permission required
router.post('/:id/approve', requirePermission('canApprove'), async (c) => { ... });
```

The legacy `requireRole()` middleware remains for backward compatibility.

### Frontend API Client

`src/lib/apiClient.ts` provides an authenticated fetch wrapper:

```typescript
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('qatrial:token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}
```

The `VITE_API_URL` environment variable controls the API base URL (defaults to `http://localhost:3001/api`).

---

## 5. API Architecture

### Route Groups (28+ route files)

| Route Group | Mount Point | Auth Required | Endpoints |
|------------|------------|---------------|-----------|
| Auth | `/api/auth` | Partial (register/login/refresh: no) | register, login, refresh, me |
| Projects | `/api/projects` | Yes | CRUD (list, create, get, update, delete) |
| Requirements | `/api/requirements` | Yes | CRUD + auto seqId, projectId filter |
| Tests | `/api/tests` | Yes | CRUD + auto seqId, projectId filter |
| CAPA | `/api/capa` | Yes | CRUD + status transition enforcement + cascade triggers |
| Risks | `/api/risks` | Yes | CRUD + auto risk score/level calculation |
| Audit | `/api/audit` | Yes | GET (filtered list), GET /export (CSV) |
| Users | `/api/users` | Yes (admin for invite/role) | list, invite, change role |
| Evidence | `/api/evidence` | Yes | CRUD for evidence attachments |
| Approvals | `/api/approvals` | Yes | Request, approve, reject workflows |
| Signatures | `/api/signatures` | Yes | Create, list signatures |
| Export | `/api/export` | Yes | CSV export (requirements, tests, all) |
| Import | `/api/import` | Yes | preview (auto-detect, suggest mapping), execute |
| AI | `/api/ai` | Yes | complete (proxy), providers list, provider test |
| SSO | `/api/auth/sso` | No | login redirect, callback, status |
| Webhooks | `/api/webhooks` | Yes (admin) | CRUD + test endpoint |
| Jira | `/api/integrations/jira` | Yes | connect, status, sync, list issues, import |
| GitHub | `/api/integrations/github` | Yes | connect, status, link PR, import test results |
| Audit Mode | `/api/audit-mode` | Partial (create: admin; read: token) | create link, 7 read-only endpoints |
| Dashboard | `/api/dashboard` | Yes | readiness, missing-evidence, approval-status, capa-aging, risk-summary |
| Complaints | `/api/complaints` | Yes | CRUD + investigation workflow + trending |
| Suppliers | `/api/suppliers` | Yes | CRUD + scorecards + audit scheduling |
| Batches | `/api/batches` | Yes | CRUD + step execution + e-signature release |
| Training | `/api/training` | Yes | plans, courses, records, matrix, compliance |
| Documents | `/api/documents` | Yes | CRUD + versioning workflow + distribution tracking |
| Systems | `/api/systems` | Yes | CRUD + overdue detection + periodic review |
| Impact | `/api/impact` | Yes | graph chains + what-if analysis |
| PMS | `/api/pms` | Yes | CRUD + summary + PSUR assembly |
| UDI | `/api/udi` | Yes | CRUD + GUDID/EUDAMED export |
| Stability | `/api/stability` | Yes | CRUD + readings + OOS/OOT detection + trending |
| EnvMon | `/api/envmon` | Yes | CRUD + readings + excursion detection + trending |
| Audit Records | `/api/auditrecords` | Yes | CRUD + findings + CAPA linkage |
| Health/Status | `/api/health`, `/api/status` | No | health check, detailed status |

### Route Pattern

Each route file exports a Hono router:

```typescript
const router = new Hono();
router.use('*', authMiddleware);  // Apply auth to all endpoints in group

router.get('/', async (c) => { ... });        // List (with query filters)
router.post('/', async (c) => { ... });       // Create
router.get('/:id', async (c) => { ... });     // Get by ID
router.put('/:id', async (c) => { ... });     // Update
router.delete('/:id', async (c) => { ... });  // Delete

export default router;
```

### Audit Logging Pattern

All mutation endpoints call `logAudit()` after successful operations:

```typescript
import { logAudit } from '../services/audit.service.js';

// After creating a requirement:
await logAudit(prisma, {
  projectId: body.projectId,
  userId: user.userId,
  action: 'create',
  entityType: 'requirement',
  entityId: requirement.id,
  newValue: requirement,
});
```

### CAPA Status Transition Enforcement

The CAPA route validates status transitions server-side. The valid transition order is:

```
open -> investigation -> in_progress -> verification -> resolved -> closed
```

Attempting to skip a stage (e.g., open -> resolved) returns a 400 error.

---

## 6. Docker Architecture

### Multi-Stage Build

The `Dockerfile` uses a 3-stage build process:

```
Stage 1: frontend (node:20-alpine)
  - npm ci
  - npm run build (Vite build -> dist/)

Stage 2: server (node:20-alpine)
  - npm ci --omit=dev
  - Copy server/ code
  - Copy dist/ from Stage 1

Stage 3: runtime (node:20-alpine)
  - Copy everything from Stage 2
  - EXPOSE 3001
  - CMD: npx tsx server/index.ts
```

### Docker Compose Architecture

```
+------------------+         +------------------+
|   app (:3001)    |-------->|  db (:5432)      |
|                  |         |                  |
|  Node.js 20     |         |  PostgreSQL 16   |
|  Hono server    |         |  Alpine          |
|  + static files |         |                  |
+------------------+         +------------------+
    |         |                      |
    v         v                      v
 [uploads]  [env vars]           [pgdata]
  (volume)   JWT_SECRET           (volume)
             AI_PROVIDER_*
             SSO_*
```

**Health checks:** The PostgreSQL container has a health check (`pg_isready`). The app container depends on `db` with `condition: service_healthy`, ensuring the database is ready before the app starts.

**Volumes:**
- `pgdata` -- Persistent PostgreSQL data directory
- `uploads` -- Persistent file uploads (evidence, imports)

### Production Static Serving

When `NODE_ENV=production`, the Hono server serves the built frontend from `dist/`:
- API routes are handled normally under `/api/*`
- All other routes serve the SPA's `index.html` (client-side routing)
- Static assets (JS, CSS, images) are served directly

---

## 7. SSO / OIDC Architecture

### Authentication Flow

```
1. User clicks "Sign in with SSO" on the login page
2. Frontend redirects to: GET /api/auth/sso/login
3. Server performs OIDC discovery: GET {SSO_ISSUER_URL}/.well-known/openid-configuration
4. Server redirects to IdP authorization endpoint with:
   - client_id, redirect_uri, response_type=code, scope=openid email profile
5. User authenticates at the IdP (Okta, Azure AD, Auth0, Keycloak)
6. IdP redirects back to: GET /api/auth/sso/callback?code=...
7. Server exchanges code for tokens at the IdP token endpoint
8. Server fetches user info from the IdP userinfo endpoint
9. Server looks up or auto-provisions the QAtrial user:
   - If user exists (by email): update name if needed
   - If user does not exist and SSO_AUTO_PROVISION=true: create user with SSO_DEFAULT_ROLE
10. Server signs QAtrial JWT tokens (access + refresh)
11. Server redirects to frontend with tokens
12. Frontend stores tokens and completes login
```

### Configuration

SSO is configured entirely via environment variables:

| Variable | Description |
|----------|-------------|
| `SSO_ENABLED` | `true` to enable SSO |
| `SSO_TYPE` | Protocol type (default: `oidc`) |
| `SSO_ISSUER_URL` | IdP issuer URL |
| `SSO_CLIENT_ID` | OIDC client ID |
| `SSO_CLIENT_SECRET` | OIDC client secret |
| `SSO_CALLBACK_URL` | Callback URL |
| `SSO_DEFAULT_ROLE` | Default role for new SSO users (default: `qa_engineer`) |
| `SSO_AUTO_PROVISION` | Auto-create users on first SSO login (default: `true`) |

### OIDC Discovery Caching

The server caches the OIDC discovery document after the first fetch. This avoids repeated network calls to the IdP for every login attempt.

---

## 8. Webhook Event System

### Architecture

```
Mutation Endpoint (e.g., requirement.create)
       |
       v
  logAudit() -----> AuditLog table
       |
       v
  dispatchWebhook(event, payload)
       |
       v
  WebhookService.dispatch()
       |
       +---> Find all enabled webhooks subscribing to this event
       |
       +---> For each webhook:
              1. Build payload JSON
              2. Compute HMAC-SHA256 signature
              3. POST to webhook URL (fire-and-forget)
              4. Update lastTriggered + lastStatus
```

### Events

14 webhook events are dispatched:

| Event | Trigger |
|-------|---------|
| `requirement.created` | New requirement created |
| `requirement.updated` | Requirement modified |
| `requirement.deleted` | Requirement deleted |
| `test.created` | New test created |
| `test.updated` | Test modified |
| `test.failed` | Test status changed to Failed |
| `capa.created` | New CAPA record created |
| `capa.status_changed` | CAPA lifecycle transition |
| `approval.requested` | Approval requested |
| `approval.approved` | Record approved |
| `approval.rejected` | Record rejected |
| `signature.created` | Electronic signature applied |
| `evidence.uploaded` | Evidence attachment added |

### HMAC Signing

Each webhook delivery includes an `X-QAtrial-Signature` header:

```
X-QAtrial-Signature: sha256=<hex-encoded HMAC-SHA256 of payload body>
```

The HMAC is computed using the webhook's configured secret. Consumers verify the signature to ensure the payload is authentic and has not been tampered with.

### Retry Behavior

Webhook dispatch is fire-and-forget. The `lastStatus` field on the webhook record tracks the most recent delivery status code. Failed deliveries are logged but not automatically retried.

---

## 9. Integration Architecture (Jira / GitHub)

### Jira Integration

```
QAtrial <-------> Jira Cloud REST API v3
                  (Basic auth: email:apiToken)

Endpoints:
  POST /api/integrations/jira/connect     -- Validate credentials + project
  GET  /api/integrations/jira/status      -- Check connection status
  POST /api/integrations/jira/sync        -- Bidirectional sync
  GET  /api/integrations/jira/issues      -- List Jira issues
  POST /api/integrations/jira/import      -- Import Jira issue as requirement
```

**Data flow (sync):**
- QAtrial requirement -> Jira issue (creates or updates)
- Jira issue -> QAtrial requirement (imports or updates)

**Configuration stored in:** `Integration` model with `type: 'jira'`, `config: { baseUrl, email, apiToken, projectKey }`

### GitHub Integration

```
QAtrial <-------> GitHub REST API v3
                  (Personal Access Token)

Endpoints:
  POST /api/integrations/github/connect       -- Validate credentials + repo
  GET  /api/integrations/github/status        -- Check connection status
  POST /api/integrations/github/link-pr       -- Link PR to requirement
  POST /api/integrations/github/import-tests  -- Import CI test results
```

**Data flow:**
- GitHub PR -> linked to QAtrial requirement (traceability)
- GitHub Actions workflow run -> imported as test results

**Configuration stored in:** `Integration` model with `type: 'github'`, `config: { owner, repo, token }`

---

## 10. Data Model (Client)

### Core Entities

#### Requirement

```typescript
interface Requirement {
  id: string;              // Auto-generated: "REQ-001", "REQ-002", etc.
  title: string;           // Concise requirement statement
  description: string;     // Detailed specification
  status: RequirementStatus; // "Draft" | "Active" | "Closed"
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  tags?: string[];         // Categorical labels for filtering and test linking
  jurisdictions?: string[]; // Country codes where applicable
  verticals?: string[];    // Industry verticals where relevant
  riskLevel?: RiskLevel;   // "low" | "medium" | "high" | "critical"
  regulatoryRef?: string;  // Regulatory clause reference
  evidenceHints?: string[]; // Standards requiring evidence
}
```

#### Test

```typescript
interface Test {
  id: string;                    // Auto-generated: "TST-001", "TST-002", etc.
  title: string;                 // Test case title
  description: string;           // Procedure, steps, expected outcomes
  status: TestStatus;            // "Not Run" | "Passed" | "Failed"
  linkedRequirementIds: string[]; // References to Requirement.id
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

#### ProjectMeta

```typescript
interface ProjectMeta {
  name: string;
  description: string;
  owner: string;
  version: string;
  type: ProjectType;             // "software" | "embedded" | "compliance" | "empty"
  createdAt: string;
  country?: string;              // ISO 3166-1 alpha-2
  vertical?: IndustryVertical;   // One of 10 verticals
  modules?: string[];            // Selected module IDs
}
```

### Status Enums and Transitions

**RequirementStatus:**
```
"Draft" --> "Active" --> "Closed"
```

**TestStatus:**
```
"Not Run" --> "Passed"
          \-> "Failed"
```

**CAPAStatus (server-enforced):**
```
"open" --> "investigation" --> "in_progress" --> "verification" --> "resolved" --> "closed"
```

**AuditAction:**
```
"create" | "update" | "delete" | "status_change" | "link" | "unlink" |
"approve" | "reject" | "sign" | "export" | "generate_report" |
"ai_generate" | "ai_accept" | "ai_reject" | "login" | "logout" | "import"
```

**SignatureMeaning:**
```
"authored" | "reviewed" | "approved" | "verified" | "rejected"
```

**GapStatus:**
```
"covered" | "partial" | "missing"
```

**RiskLevel:**
```
"low" | "medium" | "high" | "critical"
```

Risk level is computed from severity and likelihood:

| Score (S x L) | Level |
|---------------|-------|
| 1-3 | low |
| 4-8 | medium |
| 9-15 | high |
| 16-25 | critical |

### Risk Taxonomy Types

| Taxonomy | Used By | Description |
|----------|---------|-------------|
| `iso14971` | Medical Devices | ISO 14971 risk management for medical devices |
| `ichQ9` | Pharma, Biotech, CRO | ICH Q9 quality risk management |
| `fmea` | Clinical Lab, Logistics, Aerospace, Chemical/Env | Failure Mode and Effects Analysis |
| `gamp5` | Software/IT | GAMP 5 risk-based approach to CSV |
| `generic` | Cosmetics | Generic risk framework |

---

## 11. State Management

QAtrial uses 20 Zustand stores (plus hooks) with localStorage persistence on the client. When the backend is available, the `apiClient.ts` fetch wrapper connects to the REST API for persistent server-backed storage.

### Dual-Mode Operation

| Mode | Storage | How Data Flows |
|------|---------|---------------|
| **Client-only (localStorage)** | Zustand stores with `persist` middleware | Component -> Store -> localStorage |
| **Server-backed (PostgreSQL)** | API calls via `apiFetch()` | Component -> apiFetch() -> Hono API -> Prisma -> PostgreSQL |

In server-backed mode, the Zustand stores can still be used for client-side caching and UI state (theme, locale, AI provider config), while the canonical data (requirements, tests, projects, CAPA, risks, audit) lives in PostgreSQL.

### Store Summary

| Store | File | Persistence Key | Responsibility |
|-------|------|----------------|----------------|
| `useProjectStore` | `useProjectStore.ts` | `qatrial:project` | Project metadata (name, owner, country, vertical, modules) |
| `useRequirementsStore` | `useRequirementsStore.ts` | `qatrial:requirements` | Requirements CRUD, counter for ID generation |
| `useTestsStore` | `useTestsStore.ts` | `qatrial:tests` | Tests CRUD, requirement link management, counter |
| `useAuditStore` | `useAuditStore.ts` | `qatrial:audit` | Audit trail entries, logging, filtering by entity/date |
| `useLLMStore` | `useLLMStore.ts` | `qatrial:llm` | LLM provider configs, token usage tracking, connection testing |
| `useThemeStore` | `useThemeStore.ts` | `qatrial:theme` | Light/dark theme preference with DOM class management |
| `useLocaleStore` | `useLocaleStore.ts` | `qatrial:locale` | Language preference and country setting |
| `useChangeControlStore` | `useChangeControlStore.ts` | `qatrial:change-control` | Change control configuration per vertical |
| `useAuthStore` | `useAuthStore.ts` | `qatrial:auth` | User authentication, RBAC, session management, signature verification |
| `useRiskStore` | `useRiskStore.ts` | `qatrial:risks` | Persisted risk assessments with CRUD and per-requirement queries |
| `useCAPAStore` | `useCAPAStore.ts` | `qatrial:capa` | CAPA records with full lifecycle (open through closed) |
| `useGapStore` | `useGapStore.ts` | `qatrial:gaps` | Gap analysis runs with readiness scores and review status |
| `useEvidenceStore` | `useEvidenceStore.ts` | `qatrial:evidence` | Evidence attachments with completeness tracking |
| `useAIHistoryStore` | `useAIHistoryStore.ts` | `qatrial:ai-history` | AI artifact provenance, re-run history, usage statistics |
| `useConnectorStore` | `useConnectorStore.ts` | `qatrial:connectors` | External connector configurations and sync records |
| `useImportExport` | `useImportExport.ts` | N/A (hook, not persisted) | JSON export/import with referential integrity validation |

### Persistence Strategy

All stores (except `useImportExport`) use Zustand's `persist` middleware with `localStorage`:

```typescript
export const useExampleStore = create<ExampleState>()(
  persist(
    (set, get) => ({ /* state and actions */ }),
    { name: 'qatrial:example' }
  )
);
```

On page load, Zustand automatically rehydrates state from localStorage. Some stores use `onRehydrateStorage` callbacks for side effects (e.g., `useThemeStore` applies the `dark` class to `<html>`, `useLocaleStore` calls `i18next.changeLanguage`).

### Cross-Store Interactions

**Requirement Deletion -> Test Link Cleanup:**
When `useRequirementsStore.deleteRequirement(id)` is called, it invokes `useTestsStore.getState().removeRequirementLink(id)` to strip the deleted requirement's ID from all tests' `linkedRequirementIds` arrays. This maintains referential integrity. On the backend, the same cleanup is handled server-side.

**Wizard -> Multiple Stores:**
The `SetupWizard` component's `handleCreate` function writes to three stores simultaneously:
1. `useProjectStore.setProject()` -- saves project metadata
2. `useRequirementsStore.setRequirements()` -- bulk-sets composed requirements
3. `useTestsStore.setTests()` -- bulk-sets composed tests
4. `useAuditStore.log()` -- records the project creation

**AI Client -> LLM Store:**
The `complete()` function in `src/ai/client.ts` reads providers from `useLLMStore` to resolve the appropriate provider, then calls `trackUsage()` to record token consumption.

**Import -> Referential Integrity:**
The `importData` function strips dangling requirement links from tests before loading, ensuring no test references a non-existent requirement.

---

## 12. Audit Trail

### Dual Implementation

QAtrial maintains audit trails in two ways:

| Location | Storage | Characteristics |
|----------|---------|----------------|
| Client (`useAuditStore`) | localStorage | Volatile, per-browser, immediate |
| Server (`AuditLog` model) | PostgreSQL | Persistent, append-only, tamper-resistant |

### Server-Side Audit (PostgreSQL)

The `logAudit()` function in `server/services/audit.service.ts` creates append-only records in the `AuditLog` table:

```typescript
await prisma.auditLog.create({
  data: {
    projectId,
    userId,
    action,        // "create" | "update" | "delete" | "status_change" | ...
    entityType,    // "requirement" | "test" | "capa" | "risk" | "project"
    entityId,
    previousValue, // JSON of previous state (for updates/deletes)
    newValue,      // JSON of new state (for creates/updates)
    reason,        // Optional reason string
  },
});
```

### What Gets Logged

Every mutation endpoint logs an audit entry:
- **Requirements:** create, update, delete
- **Tests:** create, update, delete
- **CAPA:** create, update (including status transitions, cascade triggers), delete
- **Risks:** create, update, delete
- **Projects:** create, update, delete
- **Users:** registration, role changes
- **Imports:** CSV import operations
- **Approvals:** request, approve, reject
- **Signatures:** creation
- **Complaints:** create, update (status transitions), delete
- **Suppliers:** create, update (including auto-requalification), delete, audit scheduling
- **Batch Records:** create, step execution, deviation recording, e-signature release, delete
- **Training:** plan creation, course assignment, completion recording, retraining triggers
- **Documents:** create, update (status transitions through versioning workflow), delete
- **Systems:** create, update, periodic review start/completion, delete
- **PMS Entries:** create, update, PSUR inclusion, delete
- **UDI Entries:** create, update, export events, delete
- **Stability Studies:** create, reading submission, OOS/OOT detection events, delete
- **Environmental Monitoring:** create, reading submission, excursion detection events, delete
- **Audit Records:** create, finding addition, CAPA linkage, delete

### Audit Query and Export

The `GET /api/audit` endpoint supports query parameters:
- `projectId` -- Filter by project
- `entityType` -- Filter by entity type
- `action` -- Filter by action
- `from` / `to` -- Date range filter

The `GET /api/audit/export?format=csv` endpoint returns a CSV file with all matching audit records.

### Regulatory Compliance

The append-only design ensures:
- No audit records can be modified after creation (no PUT/PATCH on audit)
- No audit records can be deleted through the API (no DELETE on audit)
- Each record includes userId from the JWT token, providing non-repudiable attribution
- Timestamps are server-generated (`@default(now())`), preventing client-side manipulation

---

## 13. Template Composition Engine

### 4-Dimensional Model

Templates are composed from four independent dimensions:

```
Final Template = Country(jurisdiction) + Vertical(domain) + ProjectType(execution) + Modules(quality)
```

1. **Country:** Jurisdiction-specific regulatory requirements (e.g., FDA 21 CFR Part 11 for US, EU Annex 11 for EU)
2. **Vertical:** Industry-specific GxP requirements (e.g., ISO 14971 for medical devices)
3. **Project Type:** Execution-mode-specific requirements (e.g., IEC 62304 for embedded software)
4. **Modules:** Cross-cutting quality control requirements (e.g., audit trail, e-signatures)

### Compliance Starter Packs

A fifth dimension, **Compliance Starter Packs** (`src/templates/packs/index.ts`), provides pre-configured bundles that auto-fill the first four dimensions:

| Pack ID | Country | Vertical | Project Type | Modules |
|---------|---------|----------|-------------|---------|
| `fda_csv` | US | software_it | validation | 7 modules |
| `eu_mdr` | DE | medical_devices | quality_system | 9 modules |
| `fda_gmp` | US | pharma | quality_system | 10 modules |
| `iso_gdpr` | DE | software_it | compliance | 7 modules |

### Composition Algorithm (Step by Step)

The `composeTemplate(config)` function in `src/templates/composer.ts` follows this loading order:

```
Step 1: Load Regional Base (if applicable)
        EU countries -> load src/templates/regions/eu/base.ts

Step 2: Load Country-Specific Base
        e.g., src/templates/regions/de/base.ts

Step 3: Load Vertical Common Templates
        e.g., src/templates/verticals/medical_devices/common.ts

Step 4: Load Vertical + Project Type Templates
        e.g., src/templates/verticals/medical_devices/embedded.ts

Step 5: Load Country + Vertical Overlay
        e.g., src/templates/regions/de/overlays/medical_devices.ts

Step 6: Load Selected Module Templates
        e.g., MODULE_DEFINITIONS for "audit_trail", "e_signatures", etc.

Step 7: Deduplicate by Title (last entry wins)

Return: { requirements: [...], tests: [...] }
```

### How Sources Merge

Each step appends requirements and tests to accumulating arrays. Later entries override earlier ones during deduplication (by title match). This means:

- Country overlays can refine or replace EU base requirements
- Vertical project-type templates can override vertical common templates
- Country + Vertical overlays provide the most specific regulatory customization
- Modules add their requirements on top, overriding any same-titled items

### Deduplication Strategy

```typescript
function deduplicateRequirements(reqs: TemplateRequirement[]): TemplateRequirement[] {
  const map = new Map<string, TemplateRequirement>();
  for (const req of reqs) {
    const key = req.templateId || req.title;  // Prefer templateId, fall back to title
    map.set(key, req);  // Later entry overwrites earlier
  }
  return Array.from(map.values());
}
```

### Tag-Based Test Linking

Tests are linked to requirements via tags, not direct indices:

```typescript
interface TemplateTest {
  linkedReqTags: string[];  // e.g., ["audit-trail", "event-logging"]
}

interface TemplateRequirement {
  tags: string[];  // e.g., ["audit-trail", "event-logging", "data-integrity"]
}
```

During project creation in the wizard, the system matches each test's `linkedReqTags` against each requirement's `tags`. If any tag matches, the test gets linked to that requirement by ID.

---

## 14. AI System

### Provider Abstraction

The AI system supports two provider types:

| Type | API Format | Auth Header | Endpoint |
|------|-----------|-------------|----------|
| `anthropic` | Anthropic Messages API | `x-api-key` + `anthropic-version` | `{baseUrl}/v1/messages` |
| `openai-compatible` | OpenAI Chat Completions | `Authorization: Bearer {key}` | `{baseUrl}/chat/completions` |

Both types are handled by a single `complete()` function that branches on `provider.type`.

### Server-Side AI Proxy

For production deployments, the server provides an AI proxy at `POST /api/ai/complete`:

- Reads provider configuration from environment variables (`AI_PROVIDER_TYPE`, `AI_PROVIDER_URL`, `AI_PROVIDER_KEY`, `AI_PROVIDER_MODEL`)
- API keys stay on the server, never exposed to the browser
- Supports both Anthropic and OpenAI-compatible APIs
- Additional endpoints: `GET /api/ai/providers` (list, keys masked), `POST /api/ai/providers/:id/test`

### Purpose-Scoped Routing Algorithm

```typescript
function resolveProvider(purpose: LLMPurpose, providers: LLMProvider[]): LLMProvider | null {
  const enabled = providers.filter(p => p.enabled);
  const directMatch = enabled
    .filter(p => p.purpose.includes(purpose))
    .sort((a, b) => a.priority - b.priority);
  if (directMatch.length > 0) return directMatch[0];
  const fallback = enabled
    .filter(p => p.purpose.includes("all"))
    .sort((a, b) => a.priority - b.priority);
  if (fallback.length > 0) return fallback[0];
  return null;
}
```

### Prompt Architecture (9 Prompt Templates)

| Prompt | File | Purpose | Output Format |
|--------|------|---------|--------------|
| Test Generation | `generateTests.ts` | Generate 4-6 test cases from a requirement | JSON array of test objects |
| Risk Classification | `riskClassification.ts` | Propose severity/likelihood for a requirement | JSON object with scores and reasoning |
| Gap Analysis | `gapAnalysis.ts` | Compare requirements against regulatory standards | JSON array of gap objects |
| Executive Brief | `executiveBrief.ts` | Generate C-level compliance summary | Markdown text |
| CAPA Suggestion | `capaSuggestion.ts` | Root cause analysis and corrective actions for failed tests | JSON object with CAPA structure |
| VSR Report | `vsrReport.ts` | Generate Validation Summary Report sections | Array of report sections |
| QMSR Gap Analysis | `qmsrGap.ts` | Medical device QMSR gap analysis | JSON gap analysis |
| Requirement Extraction | `reqExtraction.ts` | Extract requirements from source documents | JSON array of requirements |
| Quality Check | `qualityCheck.ts` | Analyze requirement quality (vagueness, testability, etc.) | JSON array of QualityIssue objects |

### AI Validation Layer

**File:** `src/ai/validation.ts`

AI responses are validated through a structured validation layer:

1. **JSON Schema Validation:** Each prompt type defines an expected JSON schema. Responses are validated against it before being accepted.
2. **Safe Parsing:** `safeParse(text, schema)` strips markdown code fences, attempts `JSON.parse()`, then validates the parsed object against the schema.
3. **Retry Logic:** If validation fails, the system automatically retries the AI call (up to a configurable number of attempts) with an amended prompt that includes the validation error.
4. **ValidationError:** A custom error class that carries the schema violations for debugging and UI display.

### AI Proxy Mode

For deployments where browser-to-LLM direct calls are not desired, QAtrial supports two proxy approaches:

1. **Client-side proxy setting:** Set the `VITE_AI_PROXY_URL` environment variable. The `complete()` function routes through this URL.
2. **Server-side proxy (recommended):** The `POST /api/ai/complete` endpoint proxies LLM calls with server-side API keys configured via environment variables.

---

## 15. Connector Framework

### Overview

**File:** `src/connectors/types.ts`

The connector framework provides a pluggable architecture for integrating QAtrial with external systems (e.g., Jira, Azure DevOps, ALM tools).

### Core Types

```typescript
type ConnectorType = 'jira' | 'azure_devops' | 'csv' | 'custom';

interface ConnectorConfig {
  id: string;
  name: string;
  type: ConnectorType;
  baseUrl: string;
  credentials: Record<string, string>;
  fieldMappings: FieldMapping[];
  enabled: boolean;
}
```

### Connector Interface

```typescript
interface Connector {
  id: string;
  type: ConnectorType;
  name: string;
  connect(config: ConnectorConfig): Promise<boolean>;
  disconnect(): Promise<void>;
  sync(direction: SyncRecord['direction']): Promise<SyncRecord>;
  testConnection(): Promise<{ ok: boolean; message: string }>;
}
```

### Registry

The `connectorRegistry` provides:
- `registerConnector(connector: Connector)` -- Registers a new connector implementation
- `getConnector(type: ConnectorType)` -- Retrieves a registered connector by type

Connector state (configurations and sync records) is managed by `useConnectorStore`.

---

## 16. Code Splitting

### Lazy-Loaded Tab Components

`AppShell` lazy-loads all tab components using `React.lazy` wrapped in `Suspense`:

```typescript
const RequirementsTable = React.lazy(() => import('./requirements/RequirementsTable'));
const TestsTable = React.lazy(() => import('./tests/TestsTable'));
const EvaluationDashboard = React.lazy(() => import('./dashboard/EvaluationDashboard'));
const ReportGenerator = React.lazy(() => import('./reports/ReportGenerator'));
const SettingsPage = React.lazy(() => import('./settings/SettingsPage'));
```

### Vite Manual Chunks

| Chunk Name | Contents |
|-----------|----------|
| `vendor-react` | `react`, `react-dom`, `react/jsx-runtime` |
| `vendor-charts` | `recharts` and dependencies |
| `vendor-table` | `@tanstack/react-table` |
| `vendor-i18n` | `react-i18next`, `i18next`, `i18next-http-backend` |
| `vendor-state` | `zustand` |
| `templates` | `src/templates/**` |
| `ai` | `src/ai/**` |

---

## 17. i18n Architecture

### react-i18next Configuration

QAtrial uses `react-i18next` with an HTTP backend for lazy-loading translation files.

```
i18next
  .use(HttpBackend)       // Load translations via fetch
  .use(LanguageDetector)  // Detect browser language
  .use(initReactI18next)  // React bindings
  .init({
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
```

### Lazy Loading via HTTP Backend

Translation files are served from `public/locales/{lng}/common.json`. When a language is selected, `i18next-http-backend` fetches the corresponding JSON file via HTTP.

### Fallback Chain

```
User's Selected Language -> English (en)
```

### Translation Key Namespace Structure

All translations use a single `common` namespace with top-level groupings:

| Group | Example Keys | Description |
|-------|-------------|-------------|
| `app.*` | `app.name`, `app.newProject` | Application-level text |
| `nav.*` | `nav.requirements`, `nav.tests` | Navigation labels |
| `wizard.*` | `wizard.title`, `wizard.selectCountry` | Setup wizard text |
| `common.*` | `common.save`, `common.cancel` | Shared button/label text |
| `requirements.*` | `requirements.addRequirement` | Requirements view text |
| `tests.*` | `tests.addTest`, `tests.linkedRequirements` | Tests view text |
| `dashboard.*` | `dashboard.coverage`, `dashboard.riskMatrix` | Dashboard text |
| `risk.*` | `risk.severity`, `risk.critical` | Risk-related labels |
| `ai.*` | `ai.generateTests`, `ai.confidence` | AI feature text |
| `reports.*` | `reports.generate`, `reports.validationSummary` | Report text |
| `audit.*` | `audit.title`, `audit.actions.*` | Audit trail text |
| `signature.*` | `signature.title`, `signature.approved` | E-signature text |
| `changeControl.*` | `changeControl.approvalRequired` | Change control text |
| `importExport.*` | `importExport.import`, `importExport.export` | Import/export text |
| `statuses.*` | `statuses.Draft`, `statuses.Passed` | Status labels |
| `countries.*` | `countries.US`, `countries.DE` | Country names |
| `verticals.*` | `verticals.pharma.name` | Vertical names and focus |
| `modules.*` | `modules.audit_trail.name` | Module names and descriptions |
| `projectTypes.*` | `projectTypes.software.name` | Project type names |
| `packs.*` | `packs.fdaCsv`, `packs.euMdr` | Compliance pack names |
| `settings.*` | `settings.webhooks`, `settings.integrations` | Settings page text |

---

## 18. Theming

### CSS Custom Properties System

QAtrial uses CSS custom properties (CSS variables) defined at the `:root` level for all colors, with dark mode overrides under `.dark`:

```css
:root {
  --color-surface: #ffffff;
  --color-text-primary: #111827;
  --color-accent: #6366f1;
}

.dark {
  --color-surface: #1f2937;
  --color-text-primary: #f9fafb;
  --color-accent: #818cf8;
}
```

### Light/Dark Mode Implementation

The `useThemeStore` manages theme state:

1. State holds `theme: 'light' | 'dark'`
2. `toggleTheme()` flips the value and toggles the `dark` class on `document.documentElement`
3. On rehydration (page load), if the stored theme is `dark`, the `dark` class is applied immediately

### Tailwind @theme Integration

Tailwind CSS 4 uses `@theme` to register CSS custom properties as Tailwind tokens, allowing usage like: `bg-surface`, `text-text-primary`, `border-border`, etc.

---

## 19. Component Architecture

### Component Tree Overview

```
App
 |-- AppShell
      |-- Header
      |    |-- LanguageSelector
      |    |-- ThemeToggle
      |    |-- ImportExportBar
      |    |-- ShareAuditLink (admin only)
      |    |-- Navigation Tabs
      |    |-- UserMenu (login/logout, SSO, role display)
      |
      |-- SetupWizard (shown when no project data)
      |    |-- StepCompliancePack (Step 0)
      |    |-- StepCountry
      |    |-- StepVertical
      |    |-- StepMetadata
      |    |-- StepProjectType
      |    |-- StepModules
      |    |-- StepPreview
      |
      |-- <Suspense> (lazy-loaded tab components)
      |
      |-- RequirementsTable (tab: requirements) [lazy]
      |    |-- RequirementModal (create/edit)
      |    |-- TestGenerationPanel (AI)
      |    |-- RiskClassificationPanel (AI)
      |    |-- QualityCheckPanel (AI)
      |    |-- SignatureModal
      |
      |-- TestsTable (tab: tests) [lazy]
      |    |-- TestModal (create/edit)
      |
      |-- EvaluationDashboard (tab: dashboard) [lazy]
      |    |-- FilterBar
      |    |-- CoverageCard
      |    |-- StatusChart (pie, bar)
      |    |-- TraceabilityMatrix
      |    |-- OrphanedRequirements
      |    |-- OrphanedTests
      |    |-- ComplianceReadiness
      |    |-- GapAnalysisView
      |    |-- RiskMatrixView
      |    |-- EvidenceCompleteness
      |    |-- CAPAFunnel
      |    |-- TrendCharts
      |    |-- PortfolioDashboard
      |
      |-- ReportGenerator (tab: reports) [lazy]
      |    |-- ReportPreview
      |    |    |-- PDF Export Button
      |
      |-- SettingsPage (tab: settings) [lazy]
      |    |-- ProviderSettings (AI Providers tab)
      |    |-- WebhookSettings (Webhooks tab)
      |    |-- IntegrationSettings (Integrations tab)
      |    |-- SSOSettings (SSO tab)
      |
      |-- ComplaintManagement [lazy] (Medical Device Track)
      |    |-- ComplaintIntakeForm
      |    |-- ComplaintInvestigation
      |    |-- ComplaintTrendingDashboard
      |
      |-- SupplierScorecard [lazy] (Medical Device Track)
      |    |-- SupplierForm
      |    |-- SupplierAuditScheduler
      |
      |-- PMSDashboard [lazy] (Medical Device Track)
      |-- UDIManager [lazy] (Medical Device Track)
      |
      |-- BatchRecordManager [lazy] (Pharma Track)
      |    |-- BatchStepExecution
      |    |-- BatchRelease
      |
      |-- StabilityStudyManager [lazy] (Pharma Track)
      |    |-- StabilityReadings
      |    |-- StabilityTrending
      |
      |-- EnvironmentalMonitoring [lazy] (Pharma Track)
      |    |-- MonitoringPointForm
      |    |-- ExcursionDetection
      |
      |-- TrainingManager [lazy] (Pharma Track)
      |    |-- TrainingMatrix
      |    |-- ComplianceDashboard
      |
      |-- ImpactAnalysis [lazy] (Software/GAMP Track)
      |    |-- DependencyGraph
      |    |-- WhatIfAnalysis
      |
      |-- SystemInventory [lazy] (Software/GAMP Track)
      |    |-- PeriodicReviewWizard
      |
      |-- DocumentLifecycle [lazy] (Cross-Vertical)
      |    |-- DocumentVersionHistory
      |    |-- DistributionTracking
      |
      |-- AuditManagement [lazy] (Cross-Vertical)
      |    |-- FindingsTracker
      |
      |-- ImportWizard (modal, 3 steps)
      |-- ExportPanel (modal)
      |-- AuditTrailViewer (modal)
      |-- AuditModeView (/audit/{token} route)
      |-- ConfirmDialog (modal)
      |-- LoginModal (modal)
      |-- RegisterModal (modal)
```

### Component Categories

| Category | Directory | Components |
|----------|-----------|------------|
| Layout | `components/layout/` | `AppShell` (main layout, navigation, tab routing) |
| Wizard | `components/wizard/` | `SetupWizard`, `StepCompliancePack`, `StepCountry`, `StepVertical`, `StepMetadata`, `StepProjectType`, `StepModules`, `StepPreview` |
| Data Tables | `components/requirements/`, `components/tests/` | `RequirementsTable`, `RequirementModal`, `TestsTable`, `TestModal` |
| Dashboard | `components/dashboard/` | 14+ components covering all dashboard tabs |
| AI | `components/ai/` | `TestGenerationPanel`, `RiskClassificationPanel`, `QualityCheckPanel`, `ProviderSettings` |
| Reports | `components/reports/` | `ReportGenerator`, `ReportPreview` |
| Audit | `components/audit/` | `AuditTrailViewer`, `SignatureModal`, `AuditModeView`, `ShareAuditLink` |
| Import/Export | `components/import/` | `ImportWizard`, `ExportPanel` |
| Settings | `components/settings/` | `SettingsPage`, `WebhookSettings`, `IntegrationSettings`, `SSOSettings` |
| Complaints | `components/complaints/` | `ComplaintManagement`, `ComplaintIntakeForm`, `ComplaintInvestigation`, `ComplaintTrendingDashboard` |
| Suppliers | `components/suppliers/` | `SupplierScorecard`, `SupplierForm`, `SupplierAuditScheduler` |
| Batch Records | `components/batches/` | `BatchRecordManager`, `BatchStepExecution`, `BatchRelease` |
| Training | `components/training/` | `TrainingManager`, `TrainingMatrix`, `ComplianceDashboard` |
| Documents | `components/documents/` | `DocumentLifecycle`, `DocumentVersionHistory`, `DistributionTracking` |
| Systems | `components/systems/` | `SystemInventory`, `PeriodicReviewWizard` |
| Impact | `components/impact/` | `ImpactAnalysis`, `DependencyGraph`, `WhatIfAnalysis` |
| PMS | `components/pms/` | `PMSDashboard` |
| UDI | `components/udi/` | `UDIManager` |
| Stability | `components/stability/` | `StabilityStudyManager`, `StabilityReadings`, `StabilityTrending` |
| Env Monitoring | `components/envmon/` | `EnvironmentalMonitoring`, `MonitoringPointForm`, `ExcursionDetection` |
| Audit Records | `components/auditrecords/` | `AuditManagement`, `FindingsTracker` |
| Shared | `components/shared/` | `ImportExportBar`, `ThemeToggle`, `LanguageSelector`, `ConfirmDialog` |

---

## 20. Test Infrastructure

### Framework

| Tool | Purpose |
|------|---------|
| **Vitest** | Test runner and assertion library (configured in `vitest.config.ts`) |
| **React Testing Library** | Component rendering and interaction testing |
| **jsdom** | Browser environment simulation for tests |

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Run with coverage report
```

---

## 21. File Structure

```
QAtrial/
|-- server/                            # Backend server
|   |-- index.ts                       # Hono server entry (port 3001, CORS, route mounting, static serving)
|   |-- generated/prisma/             # Generated Prisma client
|   |-- prisma/
|   |   |-- schema.prisma             # PostgreSQL schema (25+ models)
|   |   |-- prisma.config.ts          # Prisma 7 migration config
|   |-- middleware/
|   |   |-- auth.ts                   # JWT auth + RBAC + requirePermission middleware
|   |-- services/
|   |   |-- audit.service.ts          # Append-only audit logging service
|   |   |-- webhook.service.ts        # Webhook dispatch with HMAC-SHA256 signing
|   |-- routes/
|       |-- auth.ts                   # Register, login, refresh, me
|       |-- projects.ts               # Project CRUD
|       |-- requirements.ts           # Requirement CRUD + auto seqId
|       |-- tests.ts                  # Test CRUD + auto seqId
|       |-- capa.ts                   # CAPA CRUD + lifecycle enforcement
|       |-- risks.ts                  # Risk CRUD + auto scoring
|       |-- audit.ts                  # Read-only audit queries + CSV export
|       |-- users.ts                  # User management (admin)
|       |-- evidence.ts              # Evidence attachment endpoints
|       |-- approvals.ts             # Approval workflow endpoints
|       |-- signatures.ts            # Electronic signature endpoints
|       |-- export.ts                # CSV/JSON export
|       |-- import.ts                # CSV import (preview, execute)
|       |-- ai.ts                    # Server-side AI proxy
|       |-- sso.ts                   # OIDC SSO (discovery, redirect, callback)
|       |-- webhooks.ts              # Webhook CRUD + test endpoint
|       |-- auditmode.ts             # Read-only audit mode link generation
|       |-- dashboard.ts             # Server-side dashboard analytics
|       |-- complaints.ts            # Complaint management + investigation workflow
|       |-- suppliers.ts             # Supplier quality scorecards + audit scheduling
|       |-- batches.ts               # Electronic batch records + e-signature release
|       |-- training.ts              # Training management (LMS-lite)
|       |-- documents.ts             # Document lifecycle management (SOP versioning)
|       |-- systems.ts               # Computerized system inventory (GAMP 5)
|       |-- impact.ts                # Live impact analysis (req/test graph chains)
|       |-- pms.ts                   # Post-market surveillance + PSUR assembly
|       |-- udi.ts                   # UDI management + GUDID/EUDAMED export
|       |-- stability.ts             # Stability study manager (ICH Q1A)
|       |-- envmon.ts                # Environmental monitoring + excursion detection
|       |-- auditrecords.ts          # Audit management + findings tracker
|       |-- integrations/
|           |-- jira.ts              # Jira Cloud bidirectional sync
|           |-- github.ts            # GitHub PR linking + CI import
|
|-- public/
|   |-- locales/
|       |-- en/common.json            # English translations (440+ keys)
|       |-- de/common.json            # German
|       |-- fr/common.json            # French
|       |-- es/common.json            # Spanish
|       |-- it/common.json            # Italian
|       |-- pt/common.json            # Portuguese
|       |-- nl/common.json            # Dutch
|       |-- ja/common.json            # Japanese
|       |-- zh/common.json            # Chinese (Simplified)
|       |-- ko/common.json            # Korean
|       |-- hi/common.json            # Hindi
|       |-- th/common.json            # Thai
|
|-- src/
|   |-- ai/                           # AI system
|   |   |-- types.ts                  # CompletionRequest, CompletionResponse
|   |   |-- client.ts                 # Unified completion client
|   |   |-- provider.ts               # Purpose-scoped provider resolver
|   |   |-- validation.ts             # JSON schema validation, safe parsing, retry
|   |   |-- proxy.ts                  # Server-side proxy mode
|   |   |-- prompts/
|   |       |-- generateTests.ts      # Test case generation
|   |       |-- riskClassification.ts # Risk severity/likelihood
|   |       |-- gapAnalysis.ts        # Regulatory gap analysis
|   |       |-- executiveBrief.ts     # Executive compliance brief
|   |       |-- capaSuggestion.ts     # CAPA suggestion
|   |       |-- vsrReport.ts          # Validation Summary Report
|   |       |-- qmsrGap.ts            # QMSR gap analysis
|   |       |-- reqExtraction.ts      # Requirement extraction
|   |       |-- qualityCheck.ts       # Requirement quality check
|   |
|   |-- templates/                    # Template composition system
|   |   |-- types.ts, registry.ts, composer.ts
|   |   |-- packs/                    # 4 Compliance Starter Packs
|   |   |   |-- index.ts
|   |   |-- verticals/               # Industry vertical templates
|   |   |-- regions/                  # Country regulatory templates
|   |   |-- modules/                  # 15 quality module definitions
|   |
|   |-- connectors/                   # Connector framework
|   |   |-- types.ts
|   |
|   |-- store/                        # Zustand state management (20 stores)
|   |
|   |-- hooks/                        # Custom React hooks
|   |
|   |-- lib/                          # Utility functions
|   |   |-- constants.ts
|   |   |-- idGenerator.ts
|   |   |-- demoProjects.ts
|   |   |-- pdfExport.ts
|   |   |-- apiClient.ts             # Authenticated API fetch wrapper
|   |
|   |-- types/
|   |   |-- index.ts                  # All TypeScript type definitions (60+ types)
|   |
|   |-- i18n/
|   |   |-- index.ts
|   |
|   |-- components/
|   |   |-- layout/AppShell.tsx
|   |   |-- wizard/ (7 step components + StepCompliancePack)
|   |   |-- requirements/ (table + modal)
|   |   |-- tests/ (table + modal)
|   |   |-- dashboard/ (14 components)
|   |   |-- ai/ (4 components incl. QualityCheckPanel)
|   |   |-- reports/ (2 components)
|   |   |-- audit/ (4 components incl. AuditModeView, ShareAuditLink)
|   |   |-- import/ (ImportWizard, ExportPanel)
|   |   |-- settings/ (SettingsPage, WebhookSettings, IntegrationSettings, SSOSettings)
|   |   |-- complaints/ (ComplaintManagement, IntakeForm, Investigation, Trending)
|   |   |-- suppliers/ (SupplierScorecard, Form, AuditScheduler)
|   |   |-- batches/ (BatchRecordManager, StepExecution, Release)
|   |   |-- training/ (TrainingManager, Matrix, ComplianceDashboard)
|   |   |-- documents/ (DocumentLifecycle, VersionHistory, DistributionTracking)
|   |   |-- systems/ (SystemInventory, PeriodicReviewWizard)
|   |   |-- impact/ (ImpactAnalysis, DependencyGraph, WhatIfAnalysis)
|   |   |-- pms/ (PMSDashboard)
|   |   |-- udi/ (UDIManager)
|   |   |-- stability/ (StabilityStudyManager, Readings, Trending)
|   |   |-- envmon/ (EnvironmentalMonitoring, MonitoringPointForm, ExcursionDetection)
|   |   |-- auditrecords/ (AuditManagement, FindingsTracker)
|   |   |-- shared/ (4 components)
|   |
|   |-- App.tsx
|   |-- main.tsx
|   |-- index.css
|
|-- docs/                             # Documentation
|   |-- validation/                   # IQ, OQ, PQ, Compliance Statement, Traceability Matrix
|
|-- Dockerfile                        # Multi-stage production build
|-- docker-compose.yml                # App + PostgreSQL deployment
|-- .env.example                      # All configuration variables
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
|-- vitest.config.ts
```
