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

**80+ endpoints across 28+ route files.**

### Health Check and Status

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Basic health check |
| `GET` | `/api/status` | No | Detailed status (version, uptime, DB, AI, memory) |

**GET /api/health Response (200):**
```json
{ "status": "ok", "version": "3.0.0" }
```

**GET /api/status Response (200):**
```json
{
  "status": "ok",
  "version": "3.0.0",
  "uptime": 12345,
  "database": "connected",
  "aiProvider": "configured",
  "storage": "ok",
  "freeMemory": "512MB"
}
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

### SSO Endpoints

#### GET /api/auth/sso/login

Redirects to the OIDC identity provider for authentication.

**Auth:** No

**Query Parameters:**
- None

**Response:** `302` redirect to IdP authorization endpoint.

---

#### GET /api/auth/sso/callback

Handles the OIDC callback after IdP authentication. Exchanges the authorization code for tokens, looks up or provisions the user, and redirects to the frontend with QAtrial JWT tokens.

**Auth:** No

**Query Parameters:**
- `code` -- Authorization code from IdP

**Response:** `302` redirect to frontend with tokens.

---

#### GET /api/auth/sso/status

Returns SSO configuration status.

**Auth:** No

**Response (200):**
```json
{
  "enabled": true,
  "type": "oidc",
  "issuerUrl": "https://your-idp.okta.com"
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

Get a single project by ID. **Auth:** Yes

---

#### PUT /api/projects/:id

Update a project. **Auth:** Yes. Partial project fields to update.

---

#### DELETE /api/projects/:id

Delete a project and all its child records (cascade). **Auth:** Yes

---

### Requirement Endpoints

#### GET /api/requirements?projectId=uuid

List all requirements for a project. **Auth:** Yes

**Query Parameters:** `projectId` (required)

---

#### POST /api/requirements

Create a new requirement. Auto-generates `seqId` (REQ-001, REQ-002, etc.). **Auth:** Yes

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

---

#### GET /api/requirements/:id

Get a single requirement. **Auth:** Yes

---

#### PUT /api/requirements/:id

Update a requirement. **Auth:** Yes

---

#### DELETE /api/requirements/:id

Delete a requirement. **Auth:** Yes

---

### Test Endpoints

#### GET /api/tests?projectId=uuid

List all tests for a project. **Auth:** Yes

---

#### POST /api/tests

Create a new test. Auto-generates `seqId` (TST-001, etc.). **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "Verify Data Integrity",
  "description": "Confirm ALCOA+ compliance...",
  "status": "Not Run",
  "linkedRequirementIds": ["uuid"]
}
```

---

#### GET /api/tests/:id | PUT /api/tests/:id | DELETE /api/tests/:id

Standard CRUD. **Auth:** Yes

---

### CAPA Endpoints

#### GET /api/capa?projectId=uuid

List all CAPA records. **Auth:** Yes

---

#### POST /api/capa

Create a new CAPA record (status defaults to "open"). **Auth:** Yes

---

#### PUT /api/capa/:id

Update a CAPA record. **Status transitions are enforced server-side:**

```
open -> investigation -> in_progress -> verification -> resolved -> closed
```

Attempting to skip a stage returns `400`. **Auth:** Yes

---

#### DELETE /api/capa/:id

Delete a CAPA record. **Auth:** Yes

---

### Risk Endpoints

#### GET /api/risks?projectId=uuid

List all risks. **Auth:** Yes

---

#### POST /api/risks

Create a new risk. `riskScore` (severity x likelihood) and `riskLevel` are auto-computed. **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "requirementId": "uuid",
  "severity": 4,
  "likelihood": 3,
  "detectability": 2,
  "mitigation": "..."
}
```

---

#### PUT /api/risks/:id | DELETE /api/risks/:id

Standard CRUD. **Auth:** Yes

---

### Audit Endpoints

#### GET /api/audit

List audit entries (read-only). **Auth:** Yes

**Query Parameters:**
- `projectId` -- Filter by project
- `entityType` -- Filter by entity type
- `action` -- Filter by action
- `from` / `to` -- Date range (ISO 8601)

---

#### GET /api/audit/export?format=csv

Export audit entries as CSV. **Auth:** Yes

Same query parameters as `GET /api/audit`.

---

### User Endpoints

#### GET /api/users

List all users in the organization. **Auth:** Yes

---

#### POST /api/users/invite

Invite a new user. **Auth:** Yes (admin only)

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "role": "qa_engineer"
}
```

---

#### PUT /api/users/:id/role

Change a user's role. **Auth:** Yes (admin only)

**Request Body:**
```json
{ "role": "qa_manager" }
```

---

### Import Endpoints

#### POST /api/import/preview

Upload a CSV file for preview. Auto-detects delimiter (comma, semicolon, tab) and suggests column mapping.

**Auth:** Yes

**Content-Type:** `multipart/form-data`

**Response (200):**
```json
{
  "columns": ["Title", "Description", "Status"],
  "sampleRows": [...],
  "suggestedMapping": {
    "Title": "title",
    "Description": "description",
    "Status": "status"
  },
  "delimiter": ","
}
```

---

#### POST /api/import/execute

Execute the import with mapped columns.

**Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "entityType": "requirement",
  "mapping": { "Title": "title", "Description": "description" },
  "data": [...],
  "duplicateHandling": "skip"
}
```

**Response (200):**
```json
{
  "created": 15,
  "skipped": 2,
  "overwritten": 0,
  "errors": []
}
```

---

### Export Endpoints

#### GET /api/export/:projectId/csv?type=requirements|tests|all

Export project data as CSV with UTF-8 BOM.

**Auth:** Yes

**Query Parameters:**
- `type` -- `requirements`, `tests`, or `all`

**Response:** CSV file download.

---

### AI Endpoints

#### POST /api/ai/complete

Server-side AI proxy. Sends prompts to the configured AI provider (API keys stay on server).

**Auth:** Yes

**Request Body:**
```json
{
  "prompt": "...",
  "purpose": "test_generation",
  "maxTokens": 2000,
  "temperature": 0.3
}
```

**Response (200):**
```json
{
  "text": "...",
  "model": "claude-sonnet-4-20250514",
  "tokensUsed": 1234
}
```

---

#### GET /api/ai/providers

List configured AI providers (API keys masked).

**Auth:** Yes

---

#### POST /api/ai/providers/:id/test

Test connection to an AI provider.

**Auth:** Yes

---

### Webhook Endpoints

#### GET /api/webhooks

List all webhooks for the organization (secrets masked).

**Auth:** Yes

---

#### POST /api/webhooks

Create a new webhook.

**Auth:** Yes (admin)

**Request Body:**
```json
{
  "name": "CI Pipeline",
  "url": "https://example.com/webhook",
  "secret": "optional-hmac-secret",
  "events": ["requirement.created", "test.failed"]
}
```

---

#### PUT /api/webhooks/:id

Update a webhook. **Auth:** Yes (admin)

---

#### DELETE /api/webhooks/:id

Delete a webhook. **Auth:** Yes (admin)

---

#### POST /api/webhooks/:id/test

Send a test payload to the webhook. **Auth:** Yes (admin)

---

### Jira Integration Endpoints

#### POST /api/integrations/jira/connect

Connect to Jira Cloud. Validates credentials and project key.

**Auth:** Yes (admin)

**Request Body:**
```json
{
  "baseUrl": "https://yourcompany.atlassian.net",
  "email": "user@example.com",
  "apiToken": "...",
  "projectKey": "PROJ"
}
```

---

#### GET /api/integrations/jira/status

Check Jira connection status. **Auth:** Yes

---

#### POST /api/integrations/jira/sync

Bidirectional sync between QAtrial and Jira. **Auth:** Yes

---

#### GET /api/integrations/jira/issues

List Jira issues from the connected project. **Auth:** Yes

---

#### POST /api/integrations/jira/import

Import a Jira issue as a QAtrial requirement. **Auth:** Yes

**Request Body:**
```json
{ "issueKey": "PROJ-123", "projectId": "uuid" }
```

---

### GitHub Integration Endpoints

#### POST /api/integrations/github/connect

Connect to a GitHub repository. Validates token and repo.

**Auth:** Yes (admin)

**Request Body:**
```json
{
  "owner": "MeyerThorsten",
  "repo": "QAtrial",
  "token": "ghp_..."
}
```

---

#### GET /api/integrations/github/status

Check GitHub connection status. **Auth:** Yes

---

#### POST /api/integrations/github/link-pr

Link a GitHub PR to a QAtrial requirement. **Auth:** Yes

**Request Body:**
```json
{ "prNumber": 42, "requirementId": "uuid" }
```

---

#### POST /api/integrations/github/import-tests

Import test results from a GitHub Actions workflow run. **Auth:** Yes

**Request Body:**
```json
{ "runId": 12345, "projectId": "uuid" }
```

---

### Audit Mode Endpoints

#### POST /api/audit-mode/create

Generate a time-limited read-only audit link.

**Auth:** Yes (admin only)

**Request Body:**
```json
{ "projectId": "uuid", "expiresIn": "24h" }
```

**Response (200):**
```json
{
  "token": "eyJhbGci...",
  "url": "/audit/eyJhbGci...",
  "expiresAt": "2026-04-02T12:00:00.000Z"
}
```

---

#### GET /api/audit-mode/:token/project

Read project data via audit mode token (no auth required).

---

#### GET /api/audit-mode/:token/requirements

Read requirements via audit mode token (no auth required).

---

#### GET /api/audit-mode/:token/tests

Read tests via audit mode token (no auth required).

---

#### GET /api/audit-mode/:token/traceability

Read traceability matrix via audit mode token (no auth required).

---

#### GET /api/audit-mode/:token/evidence

Read evidence data via audit mode token (no auth required).

---

#### GET /api/audit-mode/:token/audit-trail

Read audit trail via audit mode token (no auth required).

---

#### GET /api/audit-mode/:token/signatures

Read electronic signatures via audit mode token (no auth required).

---

### Dashboard Endpoints

#### GET /api/dashboard/:projectId/readiness

Weighted compliance readiness score.

**Auth:** Yes

**Response (200):**
```json
{
  "score": 78.5,
  "metrics": {
    "requirementCoverage": 0.85,
    "testCoverage": 0.72,
    "testPassRate": 0.90,
    "riskAssessed": 0.65,
    "signatureCompleteness": 0.50
  }
}
```

---

#### GET /api/dashboard/:projectId/missing-evidence

Requirements and tests without evidence.

**Auth:** Yes

---

#### GET /api/dashboard/:projectId/approval-status

Counts by entity type and approval status.

**Auth:** Yes

---

#### GET /api/dashboard/:projectId/capa-aging

Open CAPAs with aging buckets (0-7d, 7-30d, 30-90d, 90d+).

**Auth:** Yes

---

#### GET /api/dashboard/:projectId/risk-summary

Risk level counts and matrix data.

**Auth:** Yes

---

### Complaint Management Endpoints (Medical Device Track)

#### GET /api/complaints?projectId=uuid

List all complaints for a project. **Auth:** Yes

---

#### POST /api/complaints

Create a new complaint with intake form data. Defaults to status "received". **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "Device malfunction report",
  "description": "Patient reported intermittent shutdown...",
  "severity": "major",
  "product": "CardioMonitor X100",
  "regulatoryReportable": true
}
```

---

#### PUT /api/complaints/:id

Update a complaint. **Status transitions are enforced server-side:**

```
received -> investigating -> resolved -> closed
```

Supports FSCA tracking and CAPA linkage fields. **Auth:** Yes

---

#### GET /api/complaints/trending?projectId=uuid

Complaint trending dashboard data: by month, severity, product, and MTTR (mean time to resolution). **Auth:** Yes

---

#### DELETE /api/complaints/:id

Delete a complaint. **Auth:** Yes

---

### Supplier Quality Endpoints (Medical Device Track)

#### GET /api/suppliers?projectId=uuid

List all suppliers with quality scorecards. **Auth:** Yes

---

#### POST /api/suppliers

Create a new supplier with performance metrics. **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "name": "Precision Components Ltd.",
  "defectRate": 0.02,
  "onTimeDelivery": 0.95,
  "riskScore": 72
}
```

---

#### PUT /api/suppliers/:id

Update supplier metrics. Auto-requalification triggers when score < 50 (status set to "conditional"). **Auth:** Yes

---

#### POST /api/suppliers/:id/audit

Schedule or record an audit for a supplier. **Auth:** Yes

---

#### DELETE /api/suppliers/:id

Delete a supplier record. **Auth:** Yes

---

### Post-Market Surveillance Endpoints (Medical Device Track)

#### GET /api/pms?projectId=uuid

List all PMS entries for a project. **Auth:** Yes

---

#### POST /api/pms

Create a new PMS entry. Supports PSUR data assembly. **Auth:** Yes

---

#### GET /api/pms/summary?projectId=uuid

PMS summary dashboard with aggregated entries. **Auth:** Yes

---

#### PUT /api/pms/:id | DELETE /api/pms/:id

Standard CRUD. **Auth:** Yes

---

### UDI Management Endpoints (Medical Device Track)

#### GET /api/udi?projectId=uuid

List all UDI device identifiers. **Auth:** Yes

---

#### POST /api/udi

Create a new UDI entry with device identifier tracking. **Auth:** Yes

---

#### GET /api/udi/export?format=gudid|eudamed&projectId=uuid

Export UDI data in GUDID or EUDAMED format. **Auth:** Yes

---

#### PUT /api/udi/:id | DELETE /api/udi/:id

Standard CRUD. **Auth:** Yes

---

### Electronic Batch Record Endpoints (Pharma Track)

#### GET /api/batches?projectId=uuid

List all batch records for a project. **Auth:** Yes

---

#### POST /api/batches

Create a new batch record from a template. **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "templateId": "uuid",
  "batchNumber": "BATCH-2026-0042",
  "product": "Aspirin 500mg"
}
```

---

#### PUT /api/batches/:id/steps/:stepId

Execute a batch step. Supports deviations, review-by-exception, and yield calculation. **Auth:** Yes

---

#### POST /api/batches/:id/release

E-signature release for a completed batch record. **Auth:** Yes (canApprove)

---

#### DELETE /api/batches/:id

Delete a batch record. **Auth:** Yes

---

### Stability Study Endpoints (Pharma Track)

#### GET /api/stability?projectId=uuid

List all stability studies. **Auth:** Yes

---

#### POST /api/stability

Create a stability study with ICH Q1A design, storage conditions, and pull schedules. **Auth:** Yes

---

#### POST /api/stability/:id/readings

Add stability reading data. OOS/OOT auto-detection is applied. **Auth:** Yes

---

#### GET /api/stability/:id/trending

Trending charts data for a stability study. **Auth:** Yes

---

#### PUT /api/stability/:id | DELETE /api/stability/:id

Standard CRUD. **Auth:** Yes

---

### Environmental Monitoring Endpoints (Pharma Track)

#### GET /api/envmon?projectId=uuid

List all environmental monitoring points. **Auth:** Yes

---

#### POST /api/envmon

Create a monitoring point with thresholds. **Auth:** Yes

---

#### POST /api/envmon/:id/readings

Add a reading. Auto-excursion detection triggers when thresholds are breached. **Auth:** Yes

---

#### GET /api/envmon/trending?projectId=uuid

Environmental monitoring trending data. **Auth:** Yes

---

#### PUT /api/envmon/:id | DELETE /api/envmon/:id

Standard CRUD. **Auth:** Yes

---

### Training Management Endpoints (Pharma Track)

#### GET /api/training?projectId=uuid

List training plans, courses, and records. **Auth:** Yes

---

#### POST /api/training/plans

Create a training plan. **Auth:** Yes

---

#### POST /api/training/courses

Create a training course. **Auth:** Yes

---

#### POST /api/training/records

Record training completion for a user. **Auth:** Yes

---

#### GET /api/training/matrix?projectId=uuid

Training matrix showing user/course completion status. **Auth:** Yes

---

#### GET /api/training/compliance?projectId=uuid

Training compliance dashboard with auto-retraining trigger detection. **Auth:** Yes

---

### Document Lifecycle Endpoints (Cross-Vertical)

#### GET /api/documents?projectId=uuid

List all documents with version history. **Auth:** Yes

---

#### POST /api/documents

Create a new document (SOP, work instruction, etc.). Starts in "draft" status. **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "SOP-001: Equipment Calibration",
  "type": "sop",
  "content": "..."
}
```

---

#### PUT /api/documents/:id

Update a document. **Status transitions (SOP versioning):**

```
draft -> review -> approved -> effective -> superseded -> retired
```

**Auth:** Yes

---

#### GET /api/documents/:id/history

Version history for a document. **Auth:** Yes

---

#### GET /api/documents/:id/distribution

Distribution tracking for a document. **Auth:** Yes

---

#### DELETE /api/documents/:id

Delete a document. **Auth:** Yes

---

### Impact Analysis Endpoints (Software/GAMP Track)

#### GET /api/impact?projectId=uuid

Get requirement/test graph chains for a project. **Auth:** Yes

---

#### POST /api/impact/what-if

Run a what-if analysis: given a proposed change to a requirement, return all downstream affected tests, CAPAs, and documents. **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "requirementId": "uuid",
  "changeDescription": "Modify validation threshold from 95% to 99%"
}
```

---

### Computerized System Inventory Endpoints (Software/GAMP Track)

#### GET /api/systems?projectId=uuid

List all computerized systems in the inventory. **Auth:** Yes

---

#### POST /api/systems

Create a system entry with GAMP 5 category, validation status, and risk level. **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "name": "LIMS v4.2",
  "gampCategory": 4,
  "validationStatus": "validated",
  "riskLevel": "medium",
  "nextReviewDate": "2027-01-15"
}
```

---

#### GET /api/systems/overdue?projectId=uuid

Detect systems with overdue periodic reviews. **Auth:** Yes

---

#### PUT /api/systems/:id | DELETE /api/systems/:id

Standard CRUD. **Auth:** Yes

---

### Periodic Review Endpoints (Software/GAMP Track)

#### POST /api/systems/:id/periodic-review

Start a 7-step periodic review wizard for a system. Auto-pulls data from related records. **Auth:** Yes

---

#### PUT /api/systems/:id/periodic-review

Update periodic review progress (step completion). Schedules next review on completion. **Auth:** Yes

---

### Audit Management Endpoints (Cross-Vertical)

#### GET /api/auditrecords?projectId=uuid

List all audit records (schedule, findings, actions). **Auth:** Yes

---

#### POST /api/auditrecords

Create an audit record with schedule and classification. **Auth:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "Annual ISO 13485 Internal Audit",
  "auditType": "internal",
  "scheduledDate": "2026-06-15",
  "scope": "Design Controls, CAPA, Document Control"
}
```

---

#### POST /api/auditrecords/:id/findings

Add a finding to an audit. Classification: observation, minor, major, or critical. CAPA linkage supported. **Auth:** Yes

**Request Body:**
```json
{
  "description": "Training records not updated after SOP revision",
  "classification": "minor",
  "capaId": "uuid"
}
```

---

#### PUT /api/auditrecords/:id | DELETE /api/auditrecords/:id

Standard CRUD. **Auth:** Yes

---

## 2. Authentication

### Token-Based Authentication

QAtrial uses JWT-based authentication. After login, include the access token in every API request:

```
Authorization: Bearer <accessToken>
```

Access tokens expire after **24 hours**. Use the refresh token to get a new pair:

```bash
curl -X POST /api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGci..."}'
```

### SSO Authentication

When SSO is enabled, users authenticate via OIDC redirect flow. The callback endpoint exchanges the IdP code for QAtrial JWT tokens.

---

## 3. Error Handling

All endpoints return JSON error responses:

```json
{ "message": "Human-readable error description" }
```

| Status Code | Meaning |
|-------------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error |
| `401` | Authentication error |
| `403` | Authorization error (insufficient permission) |
| `404` | Not found |
| `409` | Conflict |
| `500` | Internal server error |

---

## 4. Stores

QAtrial uses 20 Zustand stores with localStorage persistence. See [Architecture > State Management](ARCHITECTURE.md#11-state-management) for the full store reference table.

---

## 5. AI Client

### complete(request)

**File:** `src/ai/client.ts`

Sends a prompt to the resolved AI provider.

```typescript
interface CompletionRequest {
  prompt: string;
  purpose: LLMPurpose;
  maxTokens?: number;
  temperature?: number;
}

interface CompletionResponse {
  text: string;
  model: string;
  providerId: string;
  tokensUsed: number;
}

async function complete(request: CompletionRequest): Promise<CompletionResponse>
```

**Purpose routing:** The function checks for a server-side proxy URL first, then resolves the provider from `useLLMStore` based on the purpose. If `VITE_AI_PROXY_URL` is set or the server's `/api/ai/complete` endpoint is configured, it proxies through the server.

---

## 6. AI Validation

### safeParse(text, schema)

**File:** `src/ai/validation.ts`

Parses AI response text and validates against a JSON schema:

```typescript
function safeParse<T>(text: string, schema: JsonSchema): T
```

Strips markdown code fences, parses JSON, validates against schema. Throws `ValidationError` on failure.

### completeWithValidation(options)

Combines `complete()` with schema validation and automatic retry:

```typescript
async function completeWithValidation<T>(options: {
  prompt: string;
  purpose: LLMPurpose;
  schema: JsonSchema;
  maxRetries?: number;
}): Promise<T>
```

---

## 7. Template System

### composeTemplate(config)

**File:** `src/templates/composer.ts`

Composes templates from country, vertical, project type, and modules:

```typescript
function composeTemplate(config: {
  country: string;
  vertical?: IndustryVertical;
  projectType?: ProjectType;
  modules?: string[];
}): { requirements: TemplateRequirement[]; tests: TemplateTest[] }
```

### Compliance Packs

**File:** `src/templates/packs/index.ts`

```typescript
interface CompliancePack {
  id: string;
  name: string;
  description: string;
  icon: string;
  country: string;
  vertical: string;
  projectType: string;
  modules: string[];
  tags: string[];
}

const COMPLIANCE_PACKS: CompliancePack[]  // 4 packs
```

---

## 8. Connector Types

**File:** `src/connectors/types.ts`

```typescript
type ConnectorType = 'jira' | 'azure_devops' | 'csv' | 'custom';

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

---

## 9. PDF Export

**File:** `src/lib/pdfExport.ts`

```typescript
function exportReportAsPDF(options: {
  projectName: string;
  version: string;
  sections: ReportSection[];
  includeSignatures: boolean;
}): void
```

Generates a professional PDF with cover page, table of contents, report sections, and optional signature blocks.

---

## 10. Utilities

### apiClient.ts

```typescript
function apiFetch<T>(path: string, options?: RequestInit): Promise<T>
```

Authenticated fetch wrapper. Injects Bearer token from localStorage, handles error responses.

### idGenerator.ts

```typescript
function generateId(prefix: string, counter: number): string
// generateId("REQ", 1) => "REQ-001"
// generateId("TST", 42) => "TST-042"
```

---

## 11. Type Reference

### Core Types

```typescript
type RequirementStatus = 'Draft' | 'Active' | 'Closed';
type TestStatus = 'Not Run' | 'Passed' | 'Failed';
type CAPAStatus = 'open' | 'investigation' | 'in_progress' | 'verification' | 'resolved' | 'closed';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
type SignatureMeaning = 'authored' | 'reviewed' | 'approved' | 'verified' | 'rejected';
type GapStatus = 'covered' | 'partial' | 'missing';

type UserRole = 'admin' | 'qa_manager' | 'qa_engineer' | 'auditor' | 'reviewer';

type LLMPurpose =
  | 'all'
  | 'test_generation'
  | 'gap_analysis'
  | 'risk_classification'
  | 'report_narrative'
  | 'requirement_decomp'
  | 'capa'
  | 'quality_check';

type ProjectType =
  | 'software'
  | 'embedded'
  | 'quality_system'
  | 'validation'
  | 'clinical'
  | 'compliance'
  | 'supplier_quality'
  | 'empty';

type IndustryVertical =
  | 'pharma'
  | 'biotech'
  | 'medical_devices'
  | 'cro'
  | 'clinical_lab'
  | 'logistics'
  | 'software_it'
  | 'cosmetics'
  | 'aerospace'
  | 'chemical_env';

type AuditAction =
  | 'create' | 'update' | 'delete' | 'status_change'
  | 'link' | 'unlink' | 'approve' | 'reject' | 'sign'
  | 'export' | 'generate_report'
  | 'ai_generate' | 'ai_accept' | 'ai_reject'
  | 'login' | 'logout' | 'import';

type WebhookEvent =
  | 'requirement.created' | 'requirement.updated' | 'requirement.deleted'
  | 'test.created' | 'test.updated' | 'test.failed'
  | 'capa.created' | 'capa.status_changed'
  | 'approval.requested' | 'approval.approved' | 'approval.rejected'
  | 'signature.created'
  | 'evidence.uploaded';
```

### Quality Check Types

```typescript
interface QualityIssue {
  type: 'vague' | 'untestable' | 'ambiguous' | 'incomplete' | 'duplicate_risk' | 'missing_criteria';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
}
```

### Vertical-Depth Types (Sprints 1-4)

```typescript
// Complaint Management (Medical Device)
type ComplaintStatus = 'received' | 'investigating' | 'resolved' | 'closed';
type ComplaintSeverity = 'minor' | 'major' | 'critical';

interface Complaint {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  severity: ComplaintSeverity;
  product: string;
  regulatoryReportable: boolean;
  fscaReference?: string;
  capaId?: string;
  createdAt: string;
  resolvedAt?: string;
}

// Supplier Quality Scorecards (Medical Device)
type SupplierStatus = 'approved' | 'conditional' | 'disqualified' | 'pending';

interface Supplier {
  id: string;
  projectId: string;
  name: string;
  defectRate: number;
  onTimeDelivery: number;
  riskScore: number;
  status: SupplierStatus;
  nextAuditDate?: string;
}

// Electronic Batch Records (Pharma)
type BatchStatus = 'in_progress' | 'pending_review' | 'released' | 'rejected';

interface BatchRecord {
  id: string;
  projectId: string;
  batchNumber: string;
  product: string;
  status: BatchStatus;
  templateId: string;
  steps: BatchStep[];
  yield?: number;
  releasedBy?: string;
  releasedAt?: string;
}

// Stability Study (Pharma)
type StabilityCondition = 'long_term' | 'intermediate' | 'accelerated';

interface StabilityStudy {
  id: string;
  projectId: string;
  product: string;
  condition: StabilityCondition;
  pullSchedule: string[];
  readings: StabilityReading[];
  oosDetected: boolean;
  ootDetected: boolean;
}

// Environmental Monitoring (Pharma)
interface MonitoringPoint {
  id: string;
  projectId: string;
  location: string;
  parameter: string;
  thresholdMin?: number;
  thresholdMax?: number;
  alertThreshold?: number;
  actionThreshold?: number;
}

// Training Management (Pharma)
type TrainingStatus = 'planned' | 'in_progress' | 'completed' | 'expired';

interface TrainingRecord {
  id: string;
  userId: string;
  courseId: string;
  planId: string;
  status: TrainingStatus;
  completedAt?: string;
  expiresAt?: string;
}

// Document Lifecycle (Cross-Vertical)
type DocumentStatus = 'draft' | 'review' | 'approved' | 'effective' | 'superseded' | 'retired';

interface Document {
  id: string;
  projectId: string;
  title: string;
  type: string;
  status: DocumentStatus;
  version: number;
  content: string;
  history: DocumentVersion[];
}

// Computerized System Inventory (Software/GAMP)
type GAMPCategory = 1 | 3 | 4 | 5;
type ValidationStatus = 'not_validated' | 'in_progress' | 'validated' | 'retired';

interface ComputerizedSystem {
  id: string;
  projectId: string;
  name: string;
  gampCategory: GAMPCategory;
  validationStatus: ValidationStatus;
  riskLevel: RiskLevel;
  nextReviewDate?: string;
}

// PMS (Medical Device)
interface PMSEntry {
  id: string;
  projectId: string;
  source: string;
  description: string;
  reportPeriod: string;
  psurIncluded: boolean;
}

// UDI Management (Medical Device)
interface UDIEntry {
  id: string;
  projectId: string;
  deviceIdentifier: string;
  productionIdentifier?: string;
  deviceName: string;
  gudidRegistered: boolean;
  eudamedRegistered: boolean;
}

// Audit Management (Cross-Vertical)
type FindingClassification = 'observation' | 'minor' | 'major' | 'critical';

interface AuditRecord {
  id: string;
  projectId: string;
  title: string;
  auditType: string;
  scheduledDate: string;
  findings: AuditFinding[];
}

interface AuditFinding {
  id: string;
  description: string;
  classification: FindingClassification;
  capaId?: string;
}
```

See `src/types/index.ts` for the full set of 80+ type definitions.
