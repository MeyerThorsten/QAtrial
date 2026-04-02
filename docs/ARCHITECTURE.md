# QAtrial Architecture Documentation

Technical architecture documentation for QAtrial, the regulated quality workspace.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Backend Architecture](#2-backend-architecture)
3. [Database Schema](#3-database-schema)
4. [Authentication and Authorization](#4-authentication-and-authorization)
5. [API Architecture](#5-api-architecture)
6. [Data Model (Client)](#6-data-model-client)
7. [State Management](#7-state-management)
8. [Audit Trail](#8-audit-trail)
9. [Template Composition Engine](#9-template-composition-engine)
10. [AI System](#10-ai-system)
11. [Connector Framework](#11-connector-framework)
12. [Code Splitting](#12-code-splitting)
13. [i18n Architecture](#13-i18n-architecture)
14. [Theming](#14-theming)
15. [Component Architecture](#15-component-architecture)
16. [Test Infrastructure](#16-test-infrastructure)
17. [File Structure](#17-file-structure)

---

## 1. System Overview

### Architecture Diagram

```
+-----------------------------------------------------------------------+
|                           Browser (SPA)                                |
|                                                                        |
|  +------------------+   +------------------+   +--------------------+  |
|  |   React 19 UI    |   |  Zustand Stores  |   |  Template Engine   |  |
|  |  (Components)    |<->|  (20 stores)     |   |  (Composer)        |  |
|  +------------------+   +------------------+   +--------------------+  |
|         |                       |                       |              |
|         v                       v                       v              |
|  +------------------+   +------------------+   +--------------------+  |
|  | react-i18next    |   | apiClient.ts     |   | Dynamic Imports    |  |
|  | (12 languages)   |   | (Bearer tokens)  |   | (lazy templates)   |  |
|  +------------------+   +------------------+   +--------------------+  |
|         |                       |                                      |
|         v                       v                                      |
|  +------------------+   +--------------------------------------------+|
|  | AI Client        |   |           Hono REST API (:3001)            ||
|  | (provider router) |   |                                            ||
|  +------------------+   |  +----------+  +----------+  +-----------+ ||
|         |               |  | JWT Auth |  | Routes   |  | Audit Svc | ||
|         v               |  | Middleware|  | (8 grps) |  | (append)  | ||
|  +------------------+   |  +----------+  +----------+  +-----------+ ||
|  | AI Proxy (opt.)  |   |         |                         |        ||
|  | (server-side)    |   |         v                         v        ||
|  +------------------+   |  +--------------------------------------------+
|         |               |  |       PostgreSQL (Prisma ORM v7)          |
|         v               |  |  User, Org, Workspace, Project, Req,     |
|  External LLM APIs      |  |  Test, Risk, CAPA, AuditLog              |
|  (Anthropic/OpenAI)     |  +--------------------------------------------+
|                         +--------------------------------------------+|
|  +------------------+   +------------------+                          |
|  | Auth Store       |   | Connector Fwk    |-------> External Systems |
|  | (RBAC, sessions) |   | (sync adapters)  |       (Jira, ALM, etc.) |
|  +------------------+   +------------------+                          |
+-----------------------------------------------------------------------+
```

### Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool and dev server |
| Tailwind CSS | 4.x | Utility-first styling with CSS custom properties |
| Zustand | 5.x | Lightweight state management with persistence |
| TanStack Table | v8 | Headless table with sorting, filtering, pagination |
| Recharts | 2.x | Declarative charting (pie, bar, line) |
| react-i18next | 15.x | Internationalization framework |
| i18next-http-backend | 2.x | Lazy-load translation files via HTTP |
| Lucide React | Latest | Icon library |
| **Hono** | **4.x** | **TypeScript-first HTTP framework (backend)** |
| **Prisma** | **7.x** | **ORM and database client** |
| **PostgreSQL** | **14+** | **Relational database** |
| **jsonwebtoken** | **9.x** | **JWT access/refresh token signing and verification** |
| **bcryptjs** | **3.x** | **Password hashing (12 rounds)** |

### Design Principles

1. **Dual-Mode Architecture:** QAtrial operates in two modes: (a) client-only with localStorage for demos and standalone use, and (b) full-stack with a Hono backend server and PostgreSQL for team/production use. The `apiClient.ts` fetch wrapper connects the frontend to the backend via Bearer token authentication.
2. **Composition Over Inheritance:** Templates are composed from independent dimensions (country, vertical, project type, modules) rather than inherited from base classes.
3. **Deduplication by Template ID:** When templates overlap, deduplication uses `templateId` (falls back to title for backward compatibility). Later sources override earlier ones.
4. **Lazy Loading and Code Splitting:** Template files, translation files, and tab components are loaded via dynamic imports (`React.lazy` + `Suspense`). Vite manual chunks split vendor code into `vendor-react`, `vendor-charts`, `vendor-table`, `vendor-i18n`, `vendor-state`, `templates`, and `ai` bundles.
5. **Purpose-Scoped AI:** Different AI tasks can be routed to different LLM providers based on purpose configuration. AI responses are validated with JSON schema validation and retry logic.
6. **GxP Awareness:** Every feature considers regulatory compliance (audit trails, electronic signatures, change control, CAPA lifecycle).
7. **Role-Based Access Control:** Server-enforced RBAC with three roles (Admin, Editor, Viewer) via JWT middleware, plus client-side five-role RBAC for UI-level permission checks.
8. **Append-Only Audit:** The server-side audit log in PostgreSQL is append-only. Audit records cannot be modified or deleted through the API, ensuring regulatory integrity.
9. **Connector Extensibility:** A pluggable connector framework allows integration with external systems (Jira, ALM tools, etc.) via a typed registry.

---

## 2. Backend Architecture

### Overview

The backend is a Hono HTTP server running on Node.js via `tsx` (TypeScript execution). It serves a REST API on port 3001.

### Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js + tsx | TypeScript execution without compilation step |
| Framework | Hono | Lightweight, TypeScript-first HTTP framework |
| Database | PostgreSQL | Relational data storage |
| ORM | Prisma v7 | Type-safe database client and schema management |
| Auth | JWT (jsonwebtoken) | Stateless authentication with access/refresh tokens |
| Passwords | bcryptjs | Password hashing with 12 salt rounds |

### Server Entry Point

`server/index.ts` creates a Hono app, registers CORS middleware (allowing localhost:5173 and localhost:5174), mounts 8 route groups under `/api/`, and starts listening on port 3001.

```typescript
const app = new Hono();
app.use('*', cors({ origin: ['http://localhost:5174', 'http://localhost:5173'], credentials: true }));
app.route('/api/auth', authRoutes);
app.route('/api/projects', projectRoutes);
app.route('/api/requirements', requirementRoutes);
app.route('/api/tests', testRoutes);
app.route('/api/capa', capaRoutes);
app.route('/api/risks', riskRoutes);
app.route('/api/audit', auditRoutes);
app.route('/api/users', userRoutes);
app.get('/api/health', (c) => c.json({ status: 'ok', version: '3.0.0' }));
```

### Middleware Chain

All routes except `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, and `/api/health` require authentication. The middleware chain is:

1. **CORS** -- Applied globally via `app.use('*', cors(...))`
2. **authMiddleware** -- Applied per route group via `routes.use('*', authMiddleware)`. Extracts the Bearer token from the `Authorization` header, verifies it with `jwt.verify()`, rejects refresh tokens, and attaches the decoded `JwtPayload` to the request context.
3. **requireRole(...roles)** -- Optional middleware guard applied to specific endpoints (e.g., admin-only routes). Checks that the authenticated user's role is in the allowed list.

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
- `403` -- Authorization error (insufficient role)
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
| id (PK, uuid)    |                          +---------------+---------------+
| email (unique)    |                          |               |               |
| passwordHash      |                     1:N  v          1:N  v          1:N  v
| name              |               +------------+   +------------+   +---------+
| role              |               | Requirement|   |    Test    |   |  Risk   |
| orgId (FK)        |               |------------|   |------------|   |---------|
| createdAt         |               | id (PK)    |   | id (PK)    |   | id (PK) |
+-------------------+               | projectId  |   | projectId  |   | projectId
                                    | seqId      |   | seqId      |   | reqId   |
                                    | title      |   | title      |   | severity|
                                    | description|   | description|   | likelih.|
                                    | status     |   | status     |   | riskScor|
                                    | tags[]     |   | linkedReqId|   | riskLvl |
                                    | riskLevel  |   | createdBy  |   +---------+
                                    | regulRef   |   +------------+
                                    | evidHints[]|        |
                                    | createdBy  |   1:N  v
                                    +------------+   +-----------+
                                         |           |   CAPA    |
                                    1:N  v           |-----------|
                                   +-----------+     | id (PK)   |
                                   | AuditLog  |     | projectId |
                                   |-----------|     | title     |
                                   | id (PK)   |     | status    |
                                   | projectId |     | rootCause |
                                   | timestamp |     | containmt |
                                   | userId    |     | corrective|
                                   | action    |     | preventive|
                                   | entityType|     | effective.|
                                   | entityId  |     | linkedTest|
                                   | prevValue |     | createdBy |
                                   | newValue  |     +-----------+
                                   | reason    |
                                   +-----------+
```

### Models (10)

| Model | Records | Key Fields |
|-------|---------|-----------|
| `User` | User accounts | email (unique), passwordHash, name, role, orgId |
| `Organization` | Multi-tenant container | name |
| `Workspace` | Project grouping within org | name, orgId |
| `Project` | Project metadata | name, description, owner, version, country, vertical, modules[], type |
| `Requirement` | Requirements with auto seqId | projectId, seqId (REQ-NNN), title, description, status, tags[], riskLevel, regulatoryRef, evidenceHints[] |
| `Test` | Tests with auto seqId | projectId, seqId (TST-NNN), title, description, status, linkedRequirementIds[] |
| `Risk` | Risk assessments | projectId, requirementId, severity, likelihood, detectability, riskScore, riskLevel, mitigation |
| `CAPA` | CAPA records with lifecycle | projectId, title, status, rootCause, containment, correctiveAction, preventiveAction, effectivenessCheck, linkedTestId |
| `AuditLog` | Append-only audit trail | projectId, timestamp, userId, action, entityType, entityId, previousValue (JSON), newValue (JSON), reason |

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
  role: string;        // "admin" | "editor" | "viewer"
  orgId: string | null;
}
```

Access tokens expire after 24 hours. Refresh tokens expire after 7 days and include a `type: 'refresh'` field to prevent use as access tokens.

### RBAC (Server-Side)

Three roles enforced by the `requireRole()` middleware:

| Role | Capabilities |
|------|-------------|
| `admin` | Full access. Can manage users, invite new users, change roles. |
| `editor` | Can create, read, update, delete project data (requirements, tests, CAPA, risks). Cannot manage users. |
| `viewer` | Read-only access to all data. Cannot create or modify records. |

Example usage in routes:

```typescript
// Admin-only endpoint
router.post('/invite', requireRole('admin'), async (c) => { ... });

// Editor or Admin can create
router.post('/', async (c) => { ... }); // authMiddleware already applied
```

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

### Route Groups

| Route Group | Mount Point | Auth Required | Endpoints |
|------------|------------|---------------|-----------|
| Auth | `/api/auth` | Partial (register/login/refresh: no) | register, login, refresh, me |
| Projects | `/api/projects` | Yes | CRUD (list, create, get, update, delete) |
| Requirements | `/api/requirements` | Yes | CRUD + auto seqId, projectId filter |
| Tests | `/api/tests` | Yes | CRUD + auto seqId, projectId filter |
| CAPA | `/api/capa` | Yes | CRUD + status transition enforcement |
| Risks | `/api/risks` | Yes | CRUD + auto risk score/level calculation |
| Audit | `/api/audit` | Yes | GET (filtered list), GET /export (CSV) |
| Users | `/api/users` | Yes (admin for invite/role) | list, invite, change role |

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

## 6. Data Model (Client)

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

## 7. State Management

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

## 8. Audit Trail

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
- **CAPA:** create, update (including status transitions), delete
- **Risks:** create, update, delete
- **Projects:** create, update, delete
- **Users:** registration, role changes

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

## 9. Template Composition Engine

### 4-Dimensional Model

Templates are composed from four independent dimensions:

```
Final Template = Country(jurisdiction) + Vertical(domain) + ProjectType(execution) + Modules(quality)
```

1. **Country:** Jurisdiction-specific regulatory requirements (e.g., FDA 21 CFR Part 11 for US, EU Annex 11 for EU)
2. **Vertical:** Industry-specific GxP requirements (e.g., ISO 14971 for medical devices)
3. **Project Type:** Execution-mode-specific requirements (e.g., IEC 62304 for embedded software)
4. **Modules:** Cross-cutting quality control requirements (e.g., audit trail, e-signatures)

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

Deduplication uses the `templateId` field when present, falling back to **exact title match** for backward compatibility.

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

## 10. AI System

### Provider Abstraction

The AI system supports two provider types:

| Type | API Format | Auth Header | Endpoint |
|------|-----------|-------------|----------|
| `anthropic` | Anthropic Messages API | `x-api-key` + `anthropic-version` | `{baseUrl}/v1/messages` |
| `openai-compatible` | OpenAI Chat Completions | `Authorization: Bearer {key}` | `{baseUrl}/chat/completions` |

Both types are handled by a single `complete()` function that branches on `provider.type`.

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

### Prompt Architecture (6 Prompt Templates)

| Prompt | File | Purpose | Output Format |
|--------|------|---------|--------------|
| Test Generation | `generateTests.ts` | Generate 4-6 test cases from a requirement | JSON array of test objects |
| Risk Classification | `riskClassification.ts` | Propose severity/likelihood for a requirement | JSON object with scores and reasoning |
| Gap Analysis | `gapAnalysis.ts` | Compare requirements against regulatory standards | JSON array of gap objects |
| Executive Brief | `executiveBrief.ts` | Generate C-level compliance summary | Markdown text |
| CAPA Suggestion | `capaSuggestion.ts` | Root cause analysis and corrective actions for failed tests | JSON object with CAPA structure |
| VSR Report | `vsrReport.ts` | Generate Validation Summary Report sections | Array of report sections |

### AI Validation Layer

**File:** `src/ai/validation.ts`

AI responses are validated through a structured validation layer:

1. **JSON Schema Validation:** Each prompt type defines an expected JSON schema. Responses are validated against it before being accepted.
2. **Safe Parsing:** `safeParse(text, schema)` strips markdown code fences, attempts `JSON.parse()`, then validates the parsed object against the schema.
3. **Retry Logic:** If validation fails, the system automatically retries the AI call (up to a configurable number of attempts) with an amended prompt that includes the validation error.
4. **ValidationError:** A custom error class that carries the schema violations for debugging and UI display.

### AI Proxy Mode

**File:** `src/ai/proxy.ts`

For deployments where browser-to-LLM direct calls are not desired (e.g., to protect API keys), QAtrial supports a server-side proxy:

- Set the `VITE_AI_PROXY_URL` environment variable to the proxy endpoint
- The `complete()` function in `client.ts` checks for the proxy URL before making direct calls
- When set, all AI requests are routed through the proxy

---

## 11. Connector Framework

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

## 12. Code Splitting

### Lazy-Loaded Tab Components

`AppShell` lazy-loads all tab components using `React.lazy` wrapped in `Suspense`:

```typescript
const RequirementsTable = React.lazy(() => import('./requirements/RequirementsTable'));
const TestsTable = React.lazy(() => import('./tests/TestsTable'));
const EvaluationDashboard = React.lazy(() => import('./dashboard/EvaluationDashboard'));
const ReportGenerator = React.lazy(() => import('./reports/ReportGenerator'));
const ProviderSettings = React.lazy(() => import('./ai/ProviderSettings'));
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

## 13. i18n Architecture

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

---

## 14. Theming

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

## 15. Component Architecture

### Component Tree Overview

```
App
 |-- AppShell
      |-- Header
      |    |-- LanguageSelector
      |    |-- ThemeToggle
      |    |-- ImportExportBar
      |    |-- Navigation Tabs
      |    |-- UserMenu (login/logout, role display)
      |
      |-- SetupWizard (shown when no project data)
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
      |-- ProviderSettings (tab: settings) [lazy]
      |
      |-- AuditTrailViewer (modal)
      |-- ConfirmDialog (modal)
      |-- LoginModal (modal)
      |-- RegisterModal (modal)
```

### Component Categories

| Category | Directory | Components |
|----------|-----------|------------|
| Layout | `components/layout/` | `AppShell` (main layout, navigation, tab routing) |
| Wizard | `components/wizard/` | `SetupWizard`, `StepCountry`, `StepVertical`, `StepMetadata`, `StepProjectType`, `StepModules`, `StepPreview` |
| Data Tables | `components/requirements/`, `components/tests/` | `RequirementsTable`, `RequirementModal`, `TestsTable`, `TestModal` |
| Dashboard | `components/dashboard/` | 14 components covering all 7 dashboard tabs |
| AI | `components/ai/` | `TestGenerationPanel`, `RiskClassificationPanel`, `ProviderSettings` |
| Reports | `components/reports/` | `ReportGenerator`, `ReportPreview` |
| Audit | `components/audit/` | `AuditTrailViewer`, `SignatureModal` |
| Shared | `components/shared/` | `ImportExportBar`, `ThemeToggle`, `LanguageSelector`, `ConfirmDialog` |

---

## 16. Test Infrastructure

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

## 17. File Structure

```
QAtrial/
|-- server/                            # Backend server
|   |-- index.ts                       # Hono server entry (port 3001, CORS, route mounting)
|   |-- generated/prisma/             # Generated Prisma client
|   |-- prisma/
|   |   |-- schema.prisma             # PostgreSQL schema (10 models)
|   |   |-- prisma.config.ts          # Prisma 7 migration config
|   |-- middleware/
|   |   |-- auth.ts                   # JWT auth + RBAC middleware
|   |-- services/
|   |   |-- audit.service.ts          # Append-only audit logging service
|   |-- routes/
|       |-- auth.ts                   # Register, login, refresh, me
|       |-- projects.ts               # Project CRUD
|       |-- requirements.ts           # Requirement CRUD + auto seqId
|       |-- tests.ts                  # Test CRUD + auto seqId
|       |-- capa.ts                   # CAPA CRUD + lifecycle enforcement
|       |-- risks.ts                  # Risk CRUD + auto scoring
|       |-- audit.ts                  # Read-only audit queries + CSV export
|       |-- users.ts                  # User management (admin)
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
|   |
|   |-- templates/                    # Template composition system
|   |   |-- types.ts, registry.ts, composer.ts
|   |   |-- verticals/               # Industry vertical templates
|   |   |-- regions/                  # Country regulatory templates
|   |
|   |-- connectors/                   # Connector framework
|   |   |-- types.ts
|   |
|   |-- store/                        # Zustand state management (20 stores)
|   |   |-- useProjectStore.ts
|   |   |-- useRequirementsStore.ts
|   |   |-- useTestsStore.ts
|   |   |-- useAuditStore.ts
|   |   |-- useLLMStore.ts
|   |   |-- useThemeStore.ts
|   |   |-- useLocaleStore.ts
|   |   |-- useChangeControlStore.ts
|   |   |-- useAuthStore.ts
|   |   |-- useRiskStore.ts
|   |   |-- useCAPAStore.ts
|   |   |-- useGapStore.ts
|   |   |-- useEvidenceStore.ts
|   |   |-- useAIHistoryStore.ts
|   |   |-- useConnectorStore.ts
|   |   |-- useImportExport.ts
|   |
|   |-- hooks/                        # Custom React hooks
|   |   |-- useEvaluationData.ts
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
|   |   |-- wizard/ (6 step components)
|   |   |-- requirements/ (table + modal)
|   |   |-- tests/ (table + modal)
|   |   |-- dashboard/ (14 components)
|   |   |-- ai/ (3 components)
|   |   |-- reports/ (2 components)
|   |   |-- audit/ (2 components)
|   |   |-- shared/ (4 components)
|   |
|   |-- App.tsx
|   |-- main.tsx
|   |-- index.css
|
|-- docs/                             # Documentation
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
|-- vitest.config.ts
```
