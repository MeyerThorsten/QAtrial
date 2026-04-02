# QAtrial API Reference

Reference documentation for the REST API, stores, hooks, utilities, and types.

---

## Table of Contents

1. [REST API](#1-rest-api)
2. [Authentication](#2-authentication)
3. [Error Handling](#3-error-handling)
4. [Stores](#4-stores)
5. [AI Client](#5-ai-client)
6. [AI Validation](#6-ai-validation)
7. [Template System](#7-template-system)
8. [Connector Types](#8-connector-types)
9. [PDF Export](#9-pdf-export)
10. [Utilities](#10-utilities)
11. [Type Reference](#11-type-reference)

---

## 1. REST API

The QAtrial backend exposes a REST API at `http://localhost:3001/api`. All endpoints return JSON. Endpoints marked with "Auth: Yes" require a valid JWT access token in the `Authorization: Bearer <token>` header.

### Health Check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Server health check |

**Response (200):**
```json
{ "status": "ok", "version": "3.0.0" }
```

---

### Auth Endpoints

#### POST /api/auth/register

Creates a new user account along with an organization and default workspace.

**Auth:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "minimum8chars",
  "name": "Full Name"
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Full Name",
    "role": "admin",
    "orgId": "uuid"
  }
}
```

**Error Responses:**
- `400` -- Missing required fields or password shorter than 8 characters
- `409` -- Email already registered

---

#### POST /api/auth/login

Authenticates an existing user.

**Auth:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Full Name",
    "role": "admin",
    "orgId": "uuid"
  }
}
```

**Error Responses:**
- `400` -- Missing email or password
- `401` -- Invalid email or password

---

#### POST /api/auth/refresh

Exchanges a valid refresh token for a new access/refresh token pair.

**Auth:** No

**Request Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

**Error Responses:**
- `400` -- Missing refresh token
- `401` -- Invalid or expired refresh token

---

#### GET /api/auth/me

Returns the current authenticated user's profile.

**Auth:** Yes

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Full Name",
    "role": "admin",
    "orgId": "uuid",
    "createdAt": "2026-04-01T12:00:00.000Z"
  }
}
```

---

### Project Endpoints

All project endpoints require authentication.

#### GET /api/projects

List all projects in the user's workspace.

**Auth:** Yes

**Response (200):**
```json
{
  "projects": [
    {
      "id": "uuid",
      "workspaceId": "uuid",
      "name": "Project Name",
      "description": "...",
      "owner": "Owner Name",
      "version": "1.0",
      "country": "US",
      "vertical": "pharma",
      "modules": ["audit_trail", "e_signatures"],
      "type": "software",
      "createdAt": "2026-04-01T12:00:00.000Z",
      "updatedAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/projects

Create a new project.

**Auth:** Yes

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Optional description",
  "owner": "Owner Name",
  "version": "1.0",
  "country": "US",
  "vertical": "pharma",
  "modules": ["audit_trail", "e_signatures"],
  "type": "software"
}
```

**Response (201):**
```json
{ "project": { "id": "uuid", "name": "Project Name", ... } }
```

**Error Responses:**
- `400` -- Missing required field `name`

---

#### GET /api/projects/:id

Get a single project by ID.

**Auth:** Yes

**Response (200):**
```json
{ "project": { "id": "uuid", "name": "Project Name", ... } }
```

**Error Responses:**
- `404` -- Project not found

---

#### PUT /api/projects/:id

Update a project.

**Auth:** Yes

**Request Body:** Partial project fields to update.

**Response (200):**
```json
{ "project": { "id": "uuid", "name": "Updated Name", ... } }
```

---

#### DELETE /api/projects/:id

Delete a project and all its child records (requirements, tests, risks, CAPA, audit logs) via cascade delete.

**Auth:** Yes

**Response (200):**
```json
{ "message": "Project deleted" }
```

---

### Requirement Endpoints

All requirement endpoints require authentication.

#### GET /api/requirements?projectId=uuid

List all requirements for a project.

**Auth:** Yes

**Query Parameters:**
- `projectId` (required) -- Project UUID

**Response (200):**
```json
{
  "requirements": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "seqId": "REQ-001",
      "title": "Data Integrity",
      "description": "...",
      "status": "Draft",
      "tags": ["data-integrity", "alcoa"],
      "riskLevel": "high",
      "regulatoryRef": "21 CFR 11.10(e)",
      "evidenceHints": [],
      "createdBy": "uuid",
      "createdAt": "2026-04-01T12:00:00.000Z",
      "updatedAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/requirements

Create a new requirement. The server auto-generates the `seqId` (REQ-001, REQ-002, etc.) based on the count of existing requirements in the project.

**Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "Data Integrity",
  "description": "System shall ensure ALCOA+ data integrity",
  "status": "Draft",
  "tags": ["data-integrity"],
  "riskLevel": "high",
  "regulatoryRef": "21 CFR 11.10(e)"
}
```

**Response (201):**
```json
{ "requirement": { "id": "uuid", "seqId": "REQ-001", ... } }
```

**Error Responses:**
- `400` -- Missing `projectId` or `title`

---

#### GET /api/requirements/:id

Get a single requirement by ID.

**Auth:** Yes

**Response (200):**
```json
{ "requirement": { "id": "uuid", "seqId": "REQ-001", ... } }
```

---

#### PUT /api/requirements/:id

Update a requirement. Logs an audit entry with previous and new values.

**Auth:** Yes

**Request Body:** Partial requirement fields to update.

**Response (200):**
```json
{ "requirement": { "id": "uuid", "seqId": "REQ-001", ... } }
```

---

#### DELETE /api/requirements/:id

Delete a requirement. Also cleans up references in linked tests' `linkedRequirementIds`.

**Auth:** Yes

**Response (200):**
```json
{ "message": "Requirement deleted" }
```

---

### Test Endpoints

All test endpoints require authentication.

#### GET /api/tests?projectId=uuid

List all tests for a project.

**Auth:** Yes

**Query Parameters:**
- `projectId` (required) -- Project UUID

**Response (200):**
```json
{
  "tests": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "seqId": "TST-001",
      "title": "Verify Data Integrity Controls",
      "description": "...",
      "status": "Not Run",
      "linkedRequirementIds": ["uuid-of-req"],
      "createdBy": "uuid",
      "createdAt": "2026-04-01T12:00:00.000Z",
      "updatedAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/tests

Create a new test with auto-generated `seqId`.

**Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "Verify Data Integrity Controls",
  "description": "Test procedure...",
  "status": "Not Run",
  "linkedRequirementIds": ["uuid-of-req"]
}
```

**Response (201):**
```json
{ "test": { "id": "uuid", "seqId": "TST-001", ... } }
```

---

#### GET /api/tests/:id

Get a single test by ID.

**Auth:** Yes

---

#### PUT /api/tests/:id

Update a test.

**Auth:** Yes

---

#### DELETE /api/tests/:id

Delete a test.

**Auth:** Yes

---

### CAPA Endpoints

All CAPA endpoints require authentication. The backend enforces valid status transitions.

**Valid status transitions:**
```
open -> investigation -> in_progress -> verification -> resolved -> closed
```

#### GET /api/capa?projectId=uuid

List all CAPA records for a project.

**Auth:** Yes

**Response (200):**
```json
{
  "capas": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "title": "Failed Test TST-003 Investigation",
      "status": "open",
      "rootCause": null,
      "containment": null,
      "correctiveAction": null,
      "preventiveAction": null,
      "effectivenessCheck": null,
      "linkedTestId": "uuid",
      "createdBy": "uuid",
      "createdAt": "2026-04-01T12:00:00.000Z",
      "updatedAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/capa

Create a new CAPA record (starts in "open" status).

**Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "Investigation for TST-003",
  "rootCause": "Root cause analysis...",
  "containment": "Immediate containment action...",
  "correctiveAction": "Corrective steps...",
  "preventiveAction": "Preventive measures...",
  "effectivenessCheck": "How to verify...",
  "linkedTestId": "uuid"
}
```

**Response (201):**
```json
{ "capa": { "id": "uuid", "status": "open", ... } }
```

---

#### PUT /api/capa/:id

Update a CAPA record. If `status` is included, the server validates that the transition is valid.

**Auth:** Yes

**Request Body:**
```json
{
  "status": "investigation",
  "rootCause": "Updated root cause analysis"
}
```

**Error Responses:**
- `400` -- Invalid status transition (e.g., attempting `open -> resolved`)

---

#### DELETE /api/capa/:id

Delete a CAPA record.

**Auth:** Yes

---

### Risk Endpoints

All risk endpoints require authentication. The backend auto-computes `riskScore` (severity x likelihood) and `riskLevel`.

#### GET /api/risks?projectId=uuid

List all risk assessments for a project.

**Auth:** Yes

**Response (200):**
```json
{
  "risks": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "requirementId": "uuid",
      "severity": 4,
      "likelihood": 3,
      "detectability": null,
      "riskScore": 12,
      "riskLevel": "high",
      "mitigation": null,
      "residualRisk": null,
      "classifiedBy": "manual",
      "createdAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/risks

Create a risk assessment. `riskScore` and `riskLevel` are computed server-side.

**Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "requirementId": "uuid",
  "severity": 4,
  "likelihood": 3,
  "detectability": 2,
  "mitigation": "Mitigation strategy...",
  "classifiedBy": "ai"
}
```

**Response (201):**
```json
{ "risk": { "id": "uuid", "riskScore": 12, "riskLevel": "high", ... } }
```

---

#### PUT /api/risks/:id

Update a risk assessment. Score and level are recomputed if severity or likelihood change.

**Auth:** Yes

---

#### DELETE /api/risks/:id

Delete a risk assessment.

**Auth:** Yes

---

### Audit Endpoints

Audit endpoints are read-only. No audit records can be created, updated, or deleted through the API (they are created automatically by other endpoints).

#### GET /api/audit

List audit log entries with optional filters.

**Auth:** Yes

**Query Parameters:**
- `projectId` -- Filter by project UUID
- `entityType` -- Filter by entity type (e.g., "requirement", "test", "capa")
- `action` -- Filter by action (e.g., "create", "update", "delete")
- `from` -- Start date (ISO 8601)
- `to` -- End date (ISO 8601)

**Response (200):**
```json
{
  "entries": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "timestamp": "2026-04-01T12:00:00.000Z",
      "userId": "uuid",
      "action": "create",
      "entityType": "requirement",
      "entityId": "uuid",
      "previousValue": null,
      "newValue": { "title": "Data Integrity", "status": "Draft", ... },
      "reason": null
    }
  ]
}
```

---

#### GET /api/audit/export?format=csv

Export audit log entries as CSV.

**Auth:** Yes

**Query Parameters:** Same filters as `GET /api/audit`, plus:
- `format` -- Currently only `csv` is supported

**Response (200):** CSV file download with headers: Timestamp, Action, UserId, EntityType, EntityId, PreviousValue, NewValue, Reason

---

### User Endpoints

#### GET /api/users

List all users in the authenticated user's organization.

**Auth:** Yes

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Full Name",
      "role": "admin",
      "createdAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/users/invite

Invite a new user to the organization. Creates a user record with a temporary password.

**Auth:** Yes (Admin only)

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "role": "editor"
}
```

**Response (201):**
```json
{ "user": { "id": "uuid", "email": "newuser@example.com", "role": "editor" } }
```

**Error Responses:**
- `403` -- Not an admin
- `409` -- Email already exists

---

#### PUT /api/users/:id/role

Change a user's role.

**Auth:** Yes (Admin only)

**Request Body:**
```json
{
  "role": "viewer"
}
```

**Response (200):**
```json
{ "user": { "id": "uuid", "role": "viewer" } }
```

**Error Responses:**
- `403` -- Not an admin
- `404` -- User not found

---

## 2. Authentication

### Token Format

QAtrial uses JSON Web Tokens (JWT) for authentication.

**Access Token:**
- Expires: 24 hours
- Payload: `{ userId, email, role, orgId }`
- Used in: `Authorization: Bearer <accessToken>` header

**Refresh Token:**
- Expires: 7 days
- Payload: `{ userId, email, role, orgId, type: "refresh" }`
- Used in: `POST /api/auth/refresh` body

### How to Get a Token

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User"}'

# Or login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Both return `{ accessToken, refreshToken, user }`.

### How to Use Bearer Auth

Include the access token in every authenticated request:

```bash
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer eyJhbGci..."
```

### Frontend API Client

The `src/lib/apiClient.ts` module automatically injects the Bearer token:

```typescript
import { apiFetch } from './lib/apiClient';

// The token is read from localStorage('qatrial:token') automatically
const { projects } = await apiFetch<{ projects: Project[] }>('/projects');
```

---

## 3. Error Handling

### Standard Error Response

All API errors return a JSON object with a `message` field:

```json
{ "message": "Human-readable error description" }
```

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| `200` | Success | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Missing required fields, invalid status transition |
| `401` | Unauthorized | Missing, invalid, or expired JWT token |
| `403` | Forbidden | Insufficient role (e.g., viewer trying to create) |
| `404` | Not Found | Entity with given ID does not exist |
| `409` | Conflict | Duplicate email on registration |
| `500` | Internal Server Error | Unexpected server failure |

### Frontend Error Handling

The `apiFetch()` function in `src/lib/apiClient.ts` throws an `Error` with the server's message for any non-2xx response:

```typescript
if (!res.ok) {
  const error = await res.json().catch(() => ({ message: res.statusText }));
  throw new Error(error.message || res.statusText);
}
```

---

## 4. Stores

### useProjectStore

**File:** `src/store/useProjectStore.ts`
**Persistence Key:** `qatrial:project`

#### State Shape

```typescript
interface ProjectState {
  project: ProjectMeta | null;
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `setProject` | `(meta: ProjectMeta) => void` | Sets the project metadata. Overwrites any existing project. |
| `clearProject` | `() => void` | Sets project to `null`. |

---

### useRequirementsStore

**File:** `src/store/useRequirementsStore.ts`
**Persistence Key:** `qatrial:requirements`

#### State Shape

```typescript
interface RequirementsState {
  requirements: Requirement[];
  reqCounter: number;
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `addRequirement` | `(data: { title: string; description: string; status: RequirementStatus }) => void` | Creates a new requirement with auto-generated ID (REQ-{counter}). |
| `updateRequirement` | `(id: string, data: Partial<Omit<Requirement, 'id' \| 'createdAt'>>) => void` | Updates fields on an existing requirement. |
| `deleteRequirement` | `(id: string) => void` | Deletes a requirement and removes its ID from all test links. |
| `setRequirements` | `(reqs: Requirement[], counter: number) => void` | Bulk-replaces all requirements and resets the counter. |

#### Cross-Store Side Effects

`deleteRequirement` calls `useTestsStore.getState().removeRequirementLink(id)` to maintain referential integrity.

---

### useTestsStore

**File:** `src/store/useTestsStore.ts`
**Persistence Key:** `qatrial:tests`

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `addTest` | `(data: { title: string; description: string; status: TestStatus; linkedRequirementIds: string[] }) => void` | Creates a new test with auto-generated ID. |
| `updateTest` | `(id: string, data: Partial<Omit<Test, 'id' \| 'createdAt'>>) => void` | Updates fields on an existing test. |
| `deleteTest` | `(id: string) => void` | Deletes a test. |
| `removeRequirementLink` | `(reqId: string) => void` | Removes a requirement ID from all tests' `linkedRequirementIds`. |
| `setTests` | `(tests: Test[], counter: number) => void` | Bulk-replaces all tests and resets the counter. |

---

### useAuditStore

**File:** `src/store/useAuditStore.ts`
**Persistence Key:** `qatrial:audit`

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `log` | `(action: AuditAction, entityType: string, entityId: string, previousValue?: string, newValue?: string, reason?: string) => void` | Appends a new audit entry. |
| `getEntriesForEntity` | `(entityId: string) => AuditEntry[]` | Returns all audit entries for a specific entity. |
| `getEntriesByDateRange` | `(from: Date, to: Date) => AuditEntry[]` | Returns entries within the given date range. |
| `clearEntries` | `() => void` | Removes all audit entries. |

---

### useLLMStore

**File:** `src/store/useLLMStore.ts`
**Persistence Key:** `qatrial:llm`

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `addProvider` | `(provider: LLMProvider) => void` | Adds a new LLM provider configuration. |
| `updateProvider` | `(id: string, data: Partial<Omit<LLMProvider, 'id'>>) => void` | Updates an existing provider's configuration. |
| `removeProvider` | `(id: string) => void` | Removes a provider by ID. |
| `trackUsage` | `(providerId: string, input: number, output: number) => void` | Increments token usage counters. |
| `getProviderForPurpose` | `(purpose: LLMPurpose) => LLMProvider \| null` | Resolves the best provider for a purpose. |
| `hasAnyProvider` | `() => boolean` | Returns `true` if at least one enabled provider exists. |
| `testConnection` | `(id: string) => Promise<{ ok: boolean; latencyMs: number; error?: string }>` | Sends a test prompt to verify the provider is reachable. |

---

### useThemeStore

**File:** `src/store/useThemeStore.ts`
**Persistence Key:** `qatrial:theme`

| Action | Signature | Description |
|--------|-----------|-------------|
| `setTheme` | `(theme: Theme) => void` | Sets theme and toggles the `dark` CSS class. |
| `toggleTheme` | `() => void` | Flips between light and dark. |

---

### useLocaleStore

**File:** `src/store/useLocaleStore.ts`
**Persistence Key:** `qatrial:locale`

| Action | Signature | Description |
|--------|-----------|-------------|
| `setLanguage` | `(lang: string) => void` | Changes the i18next language. |
| `setCountry` | `(country: string \| null) => void` | Stores the selected country code. |

---

### useChangeControlStore

**File:** `src/store/useChangeControlStore.ts`
**Persistence Key:** `qatrial:change-control`

| Action | Signature | Description |
|--------|-----------|-------------|
| `setConfig` | `(config: Partial<ChangeControlConfig>) => void` | Updates the change control configuration. |
| `isApprovalRequired` | `(entityType: string) => boolean` | Checks if the given entity type requires approval. |

---

### useImportExport

**File:** `src/store/useImportExport.ts`
**Persistence Key:** None (hook, not persisted)

| Function | Signature | Description |
|----------|-----------|-------------|
| `exportData` | `() => void` | Triggers a JSON file download of project data. |
| `importData` | `(file: File) => Promise<{ success: boolean; message: string }>` | Reads, validates, and loads a JSON file. |

---

### useAuthStore

**File:** `src/store/useAuthStore.ts`
**Persistence Key:** `qatrial:auth`

#### State Shape

```typescript
interface AuthState {
  user: UserProfile | null;
  signatureVerifiedAt: number | null;
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `login` | `(email: string, password: string) => boolean` | Authenticates a user (localStorage mode). |
| `logout` | `() => void` | Clears the current user session. |
| `register` | `(name: string, email: string, password: string, role: UserRole) => void` | Creates a new user profile (localStorage mode). |
| `verifyForSignature` | `(password: string) => boolean` | Re-authenticates for signing (15-minute window). |
| `isSignatureValid` | `() => boolean` | Returns `true` if the signature window is still active. |
| `hasPermission` | `(action: string) => boolean` | Checks role permissions via `ROLE_PERMISSIONS`. |

---

### useRiskStore

**File:** `src/store/useRiskStore.ts`
**Persistence Key:** `qatrial:risks`

| Action | Signature | Description |
|--------|-----------|-------------|
| `addAssessment` | `(assessment: Omit<RiskAssessment, 'id'>) => void` | Creates a new risk assessment. |
| `updateAssessment` | `(id: string, data: Partial<RiskAssessment>) => void` | Updates an assessment. |
| `deleteAssessment` | `(id: string) => void` | Removes an assessment. |
| `getForRequirement` | `(requirementId: string) => RiskAssessment \| undefined` | Returns the latest assessment for a requirement. |
| `getAllForRequirement` | `(requirementId: string) => RiskAssessment[]` | Returns all assessments for a requirement. |

---

### useCAPAStore

**File:** `src/store/useCAPAStore.ts`
**Persistence Key:** `qatrial:capa`

| Action | Signature | Description |
|--------|-----------|-------------|
| `addRecord` | `(record: Omit<CAPARecord, 'id' \| 'createdAt' \| 'updatedAt'>) => void` | Creates a new CAPA record. |
| `updateRecord` | `(id: string, data: Partial<CAPARecord>) => void` | Updates an existing record. |
| `deleteRecord` | `(id: string) => void` | Removes a record. |
| `advanceStatus` | `(id: string) => void` | Moves to the next lifecycle stage. |
| `getByStatus` | `(status: CAPAStatus) => CAPARecord[]` | Returns records by status. |

---

### useGapStore

**File:** `src/store/useGapStore.ts`
**Persistence Key:** `qatrial:gaps`

| Action | Signature | Description |
|--------|-----------|-------------|
| `addRun` | `(run: Omit<GapAnalysisRun, 'id'>) => void` | Stores a new gap analysis run. |
| `updateReviewStatus` | `(id: string, status: string, reviewedBy?: string) => void` | Updates review status. |
| `getLatestRun` | `() => GapAnalysisRun \| undefined` | Returns the most recent run. |
| `deleteRun` | `(id: string) => void` | Removes a run. |

---

### useEvidenceStore

**File:** `src/store/useEvidenceStore.ts`
**Persistence Key:** `qatrial:evidence`

| Action | Signature | Description |
|--------|-----------|-------------|
| `addAttachment` | `(attachment: Omit<EvidenceAttachment, 'id' \| 'createdAt'>) => void` | Adds evidence. |
| `deleteAttachment` | `(id: string) => void` | Removes evidence. |
| `getForRequirement` | `(requirementId: string) => EvidenceAttachment[]` | Returns evidence for a requirement. |
| `getCompletenessScore` | `() => number` | Returns percentage with complete evidence. |

---

### useAIHistoryStore

**File:** `src/store/useAIHistoryStore.ts`
**Persistence Key:** `qatrial:ai-history`

| Action | Signature | Description |
|--------|-----------|-------------|
| `addArtifact` | `(artifact: Omit<AIArtifact, 'id'>) => void` | Records an AI artifact. |
| `markAccepted` | `(id: string, accepted: boolean) => void` | Updates accepted status. |
| `getForEntity` | `(entityId: string) => AIArtifact[]` | Returns artifacts for an entity. |
| `getReRunHistory` | `(type: string, entityId: string) => AIArtifact[]` | Returns re-run history. |
| `getUsageStats` | `() => AIUsageStats` | Returns usage statistics. |

---

### useConnectorStore

**File:** `src/store/useConnectorStore.ts`
**Persistence Key:** `qatrial:connectors`

| Action | Signature | Description |
|--------|-----------|-------------|
| `addConfig` | `(config: Omit<ConnectorConfig, 'id'>) => void` | Adds a connector config. |
| `updateConfig` | `(id: string, data: Partial<ConnectorConfig>) => void` | Updates a config. |
| `removeConfig` | `(id: string) => void` | Removes a config. |
| `addSyncRecord` | `(record: Omit<SyncRecord, 'id'>) => void` | Records a sync operation. |
| `getConfigById` | `(id: string) => ConnectorConfig \| undefined` | Returns a config by ID. |
| `getSyncHistory` | `(connectorId: string) => SyncRecord[]` | Returns sync history. |

---

## 5. AI Client

### complete()

**File:** `src/ai/client.ts`

```typescript
async function complete(req: CompletionRequest): Promise<CompletionResponse>
```

#### Parameters (CompletionRequest)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | `string` | Yes | The full prompt text to send |
| `purpose` | `LLMPurpose` | Yes | The AI purpose for provider routing |
| `maxTokens` | `number` | No | Override provider's default max tokens |
| `temperature` | `number` | No | Override provider's default temperature |

#### Returns (CompletionResponse)

| Field | Type | Description |
|-------|------|-------------|
| `text` | `string` | The generated text response |
| `model` | `string` | The model that generated the response |
| `providerId` | `string` | The provider that was used |
| `tokensUsed` | `{ input: number; output: number }` | Token counts |

#### Behavior

1. Reads providers from `useLLMStore`
2. Calls `resolveProvider(purpose, providers)` to find the best provider
3. Throws `Error("No AI provider configured for purpose: ...")` if no match
4. Branches based on `provider.type` (anthropic vs openai-compatible)
5. Parses the response and extracts text + token counts
6. Calls `trackUsage()` to record consumption
7. Returns `CompletionResponse`

---

### resolveProvider()

**File:** `src/ai/provider.ts`

```typescript
function resolveProvider(purpose: LLMPurpose, providers: LLMProvider[]): LLMProvider | null
```

Algorithm: Filter enabled -> match specific purpose -> sort by priority -> fallback to "all" purpose -> return null.

---

## 6. AI Validation

### safeParse()

**File:** `src/ai/validation.ts`

```typescript
function safeParse<T>(text: string, schema: JSONSchema): T
```

Strips markdown code fences, parses JSON, validates against schema, throws `ValidationError` on failure.

### completeWithValidation()

```typescript
async function completeWithValidation<T>(options: {
  prompt: string;
  purpose: LLMPurpose;
  schema: JSONSchema;
  maxRetries?: number;
}): Promise<T>
```

Combines `complete()` with `safeParse()` and automatic retry logic.

### ValidationError

```typescript
class ValidationError extends Error {
  violations: string[];
  rawText: string;
}
```

---

## 7. Template System

### composeTemplate()

**File:** `src/templates/composer.ts`

```typescript
async function composeTemplate(config: ComposeConfig): Promise<ComposeResult>
```

Loading order: Regional base -> Country base -> Vertical common -> Vertical project type -> Country+Vertical overlay -> Modules -> Deduplicate.

### Registry Lookup

- `VERTICAL_DEFINITIONS` -- 10 vertical definitions
- `COUNTRY_REGISTRY` -- 37+ country entries
- `MODULE_DEFINITIONS` -- 15+ module definitions with requirements and tests

---

## 8. Connector Types

**File:** `src/connectors/types.ts`

```typescript
type ConnectorType = 'jira' | 'azure_devops' | 'csv' | 'custom';

interface Connector {
  connect(config: ConnectorConfig): Promise<boolean>;
  disconnect(): Promise<void>;
  sync(direction: SyncRecord['direction']): Promise<SyncRecord>;
  testConnection(): Promise<{ ok: boolean; message: string }>;
}
```

---

## 9. PDF Export

### exportReportAsPDF()

**File:** `src/lib/pdfExport.ts`

```typescript
async function exportReportAsPDF(options: {
  project: ProjectMeta;
  sections: ReportSection[];
  signatures?: ElectronicSignature[];
  filename?: string;
}): Promise<void>
```

Generates a PDF with cover page, table of contents, report sections, and signature blocks.

---

## 10. Utilities

### generateId()

**File:** `src/lib/idGenerator.ts`

```typescript
function generateId(prefix: string, counter: number): string
// generateId('REQ', 1) -> "REQ-001"
// generateId('TST', 42) -> "TST-042"
```

### apiFetch()

**File:** `src/lib/apiClient.ts`

```typescript
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T>
```

Authenticated fetch wrapper that automatically injects the Bearer token from `localStorage('qatrial:token')` and throws on non-2xx responses. Uses `VITE_API_URL` (defaults to `http://localhost:3001/api`) as the base URL.

### Demo Project Helpers

**File:** `src/lib/demoProjects.ts`

- `getDemoProject(countryCode: string)` -- Returns demo project for a country
- `DEMO_COUNTRY_CODES` -- Set of country codes with demo projects

### useEvaluationData Hook

**File:** `src/hooks/useEvaluationData.ts`

```typescript
function useEvaluationData(filters: DashboardFilters): EvaluationMetrics
```

Computes dashboard metrics (coverage, status counts, orphaned items) from requirements and tests.

---

## 11. Type Reference

All types are defined in `src/types/index.ts`.

### Status Types

| Type | Values |
|------|--------|
| `RequirementStatus` | `'Draft' \| 'Active' \| 'Closed'` |
| `TestStatus` | `'Not Run' \| 'Passed' \| 'Failed'` |
| `RiskLevel` | `'low' \| 'medium' \| 'high' \| 'critical'` |
| `GapStatus` | `'covered' \| 'partial' \| 'missing'` |
| `SignatureMeaning` | `'authored' \| 'reviewed' \| 'approved' \| 'verified' \| 'rejected'` |
| `CAPAStatus` | `'open' \| 'investigation' \| 'in_progress' \| 'verification' \| 'resolved' \| 'closed'` |

### Configuration Types

| Type | Values |
|------|--------|
| `IndustryVertical` | `'pharma' \| 'biotech' \| 'medical_devices' \| 'cro' \| 'clinical_lab' \| 'logistics' \| 'cosmetics' \| 'aerospace' \| 'chemical_env' \| 'software_it'` |
| `ProjectType` | `'software' \| 'embedded' \| 'compliance' \| 'empty'` |
| `LLMProviderType` | `'openai-compatible' \| 'anthropic'` |
| `LLMPurpose` | `'all' \| 'test_generation' \| 'gap_analysis' \| 'risk_classification' \| 'report_narrative' \| 'requirement_decomp' \| 'capa'` |
| `RiskTaxonomyType` | `'iso14971' \| 'ichQ9' \| 'fmea' \| 'gamp5' \| 'generic'` |
| `AuditAction` | `'create' \| 'update' \| 'delete' \| 'status_change' \| 'link' \| 'unlink' \| 'approve' \| 'reject' \| 'sign' \| 'export' \| 'generate_report' \| 'ai_generate' \| 'ai_accept' \| 'ai_reject' \| 'login' \| 'logout' \| 'import'` |
| `ReportType` | `'validation_summary' \| 'traceability_matrix' \| 'gap_analysis' \| 'risk_assessment' \| 'executive_brief' \| 'submission_package'` |
| `UserRole` | `'admin' \| 'qa_manager' \| 'qa_engineer' \| 'auditor' \| 'reviewer'` |
| `ConnectorType` | `'jira' \| 'azure_devops' \| 'csv' \| 'custom'` |

### Core Domain Interfaces

#### Requirement

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Auto-generated: "REQ-001" |
| `title` | `string` | Yes | Requirement statement |
| `description` | `string` | Yes | Detailed specification |
| `status` | `RequirementStatus` | Yes | Draft / Active / Closed |
| `createdAt` | `string` | Yes | ISO 8601 timestamp |
| `updatedAt` | `string` | Yes | ISO 8601 timestamp |
| `tags` | `string[]` | No | Categorical labels |
| `jurisdictions` | `string[]` | No | Country codes |
| `verticals` | `string[]` | No | Applicable verticals |
| `riskLevel` | `RiskLevel` | No | low / medium / high / critical |
| `regulatoryRef` | `string` | No | Regulatory clause ref |
| `evidenceHints` | `string[]` | No | Standards needing evidence |

#### Test

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Auto-generated: "TST-001" |
| `title` | `string` | Yes | Test case title |
| `description` | `string` | Yes | Procedure and expected outcomes |
| `status` | `TestStatus` | Yes | Not Run / Passed / Failed |
| `linkedRequirementIds` | `string[]` | Yes | Referenced requirement IDs |
| `createdAt` | `string` | Yes | ISO 8601 timestamp |
| `updatedAt` | `string` | Yes | ISO 8601 timestamp |

#### ProjectMeta

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Project name |
| `description` | `string` | Yes | Description |
| `owner` | `string` | Yes | Owner name |
| `version` | `string` | Yes | Version string |
| `type` | `ProjectType` | Yes | software / embedded / compliance / empty |
| `createdAt` | `string` | Yes | ISO 8601 timestamp |
| `country` | `string` | No | ISO 3166-1 alpha-2 |
| `vertical` | `IndustryVertical` | No | Industry vertical |
| `modules` | `string[]` | No | Selected module IDs |

#### RiskAssessment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique ID |
| `requirementId` | `string` | Yes | Linked requirement |
| `severity` | `Severity` | Yes | 1-5 |
| `likelihood` | `Likelihood` | Yes | 1-5 |
| `detectability` | `Detectability` | No | 1-5 (for FMEA) |
| `riskScore` | `number` | Yes | Computed score |
| `riskLevel` | `RiskLevel` | Yes | Derived level |
| `mitigationStrategy` | `string` | No | Mitigation description |
| `classifiedBy` | `'manual' \| 'ai'` | Yes | Who classified |
| `classifiedAt` | `string` | Yes | ISO 8601 timestamp |

#### AuditEntry (Client)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Auto-generated audit ID |
| `timestamp` | `string` | Yes | ISO 8601 |
| `userId` | `string` | Yes | User identifier |
| `userName` | `string` | Yes | Display name |
| `action` | `AuditAction` | Yes | What happened |
| `entityType` | `string` | Yes | e.g., "requirement", "test" |
| `entityId` | `string` | Yes | Entity identifier |
| `previousValue` | `string` | No | Before value (for diffs) |
| `newValue` | `string` | No | After value (for diffs) |
| `reason` | `string` | No | Why the action was taken |
| `signature` | `ElectronicSignature` | No | Attached signature |

#### AuditLog (Server/PostgreSQL)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | UUID |
| `projectId` | `string` | Yes | Project UUID |
| `timestamp` | `DateTime` | Yes | Server-generated timestamp |
| `userId` | `string` | Yes | User UUID from JWT |
| `action` | `string` | Yes | Action type |
| `entityType` | `string` | Yes | Entity type |
| `entityId` | `string` | Yes | Entity UUID |
| `previousValue` | `Json?` | No | Previous state as JSON |
| `newValue` | `Json?` | No | New state as JSON |
| `reason` | `string?` | No | Reason for action |

#### ElectronicSignature

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `signerId` | `string` | Yes | Unique signer identifier |
| `signerName` | `string` | Yes | Display name |
| `signerRole` | `string` | Yes | Role |
| `timestamp` | `string` | Yes | ISO 8601 |
| `meaning` | `SignatureMeaning` | Yes | authored / reviewed / approved / verified / rejected |
| `method` | `string` | Yes | Authentication method |

#### LLMProvider

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique provider ID |
| `name` | `string` | Yes | Display name |
| `type` | `LLMProviderType` | Yes | anthropic / openai-compatible |
| `baseUrl` | `string` | Yes | API base URL |
| `apiKey` | `string` | Yes | API key |
| `model` | `string` | Yes | Model identifier |
| `purpose` | `LLMPurpose[]` | Yes | Which AI purposes this handles |
| `maxTokens` | `number` | Yes | Default max token limit |
| `temperature` | `number` | Yes | Default temperature |
| `enabled` | `boolean` | Yes | Whether active |
| `priority` | `number` | Yes | Lower = higher priority |

#### CAPARecord

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique ID |
| `title` | `string` | Yes | CAPA title |
| `description` | `string` | Yes | Description |
| `status` | `CAPAStatus` | Yes | Lifecycle state |
| `linkedTestId` | `string` | No | Related failed test |
| `linkedRequirementId` | `string` | No | Related requirement |
| `rootCause` | `string` | No | Root cause analysis |
| `containment` | `string` | No | Containment action |
| `correctiveAction` | `string` | No | Corrective steps |
| `preventiveAction` | `string` | No | Preventive measures |
| `effectivenessCheck` | `string` | No | Verification criteria |
| `createdAt` | `string` | Yes | ISO 8601 |
| `updatedAt` | `string` | Yes | ISO 8601 |
| `closedAt` | `string` | No | ISO 8601 (when closed) |
