# QAtrial Architecture Documentation

Technical architecture documentation for QAtrial, the regulated quality workspace.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Data Model](#2-data-model)
3. [State Management](#3-state-management)
4. [Authentication and RBAC](#4-authentication-and-rbac)
5. [Template Composition Engine](#5-template-composition-engine)
6. [AI System](#6-ai-system)
7. [Connector Framework](#7-connector-framework)
8. [Code Splitting](#8-code-splitting)
9. [i18n Architecture](#9-i18n-architecture)
10. [Theming](#10-theming)
11. [Component Architecture](#11-component-architecture)
12. [Test Infrastructure](#12-test-infrastructure)
13. [File Structure](#13-file-structure)

---

## 1. System Overview

### Architecture Diagram

```
+-----------------------------------------------------------------------+
|                           Browser (SPA)                                |
|                                                                        |
|  +------------------+   +------------------+   +--------------------+  |
|  |   React 19 UI    |   |  Zustand Stores  |   |  Template Engine   |  |
|  |  (Components)    |<->|  (14 stores)     |   |  (Composer)        |  |
|  +------------------+   +------------------+   +--------------------+  |
|         |                       |                       |              |
|         v                       v                       v              |
|  +------------------+   +------------------+   +--------------------+  |
|  | react-i18next    |   | localStorage     |   | Dynamic Imports    |  |
|  | (12 languages)   |   | (persistence)    |   | (lazy templates)   |  |
|  +------------------+   +------------------+   +--------------------+  |
|         |                                                              |
|         v                                                              |
|  +------------------+   +------------------+                           |
|  | AI Client        |-->| AI Proxy (opt.)  |-------> External LLM APIs |
|  | (provider router) |   | (server-side)    |       (Anthropic/OpenAI)  |
|  +------------------+   +------------------+                           |
|         |                                                              |
|         v                                                              |
|  +------------------+   +------------------+                           |
|  | Auth Store       |   | Connector Fwk    |-------> External Systems  |
|  | (RBAC, sessions) |   | (sync adapters)  |       (Jira, ALM, etc.)   |
|  +------------------+   +------------------+                           |
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

### Design Principles

1. **Client-Side Only:** No backend server. All data lives in `localStorage`. AI calls go directly from the browser to LLM APIs (or through an optional server-side proxy via `VITE_AI_PROXY_URL`).
2. **Composition Over Inheritance:** Templates are composed from independent dimensions (country, vertical, project type, modules) rather than inherited from base classes.
3. **Deduplication by Template ID:** When templates overlap, deduplication uses `templateId` (falls back to title for backward compatibility). Later sources override earlier ones.
4. **Lazy Loading and Code Splitting:** Template files, translation files, and tab components are loaded via dynamic imports (`React.lazy` + `Suspense`). Vite manual chunks split vendor code into `vendor-react`, `vendor-charts`, `vendor-table`, `vendor-i18n`, `vendor-state`, `templates`, and `ai` bundles.
5. **Purpose-Scoped AI:** Different AI tasks can be routed to different LLM providers based on purpose configuration. AI responses are validated with JSON schema validation and retry logic.
6. **GxP Awareness:** Every feature considers regulatory compliance (audit trails, electronic signatures, change control, CAPA lifecycle).
7. **Role-Based Access Control:** Five user roles (admin, qa_manager, qa_engineer, auditor, reviewer) govern permissions across the application via a ROLE_PERMISSIONS matrix.
8. **Connector Extensibility:** A pluggable connector framework allows integration with external systems (Jira, ALM tools, etc.) via a typed registry.

---

## 2. Data Model

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

### Entity Relationship Diagram

```
+-------------------+        +-------------------+
|   ProjectMeta     |        |    AuditEntry     |
|-------------------|        |-------------------|
| name              |        | id                |
| description       |        | timestamp         |
| owner             |        | userId            |
| version           |        | userName          |
| type              |        | action            |
| country           |        | entityType        |
| vertical          |        | entityId     -----+---> Requirement.id
| modules[]         |        | previousValue     |     or Test.id
+-------------------+        | newValue          |
                             | reason            |
+-------------------+        | signature? -------+---> ElectronicSignature
|   Requirement     |        +-------------------+
|-------------------|
| id           <----+---+    +-------------------+
| title             |   |    | RiskAssessment    |
| description       |   |    |-------------------|
| status            |   +----+ requirementId     |
| riskLevel?        |        | severity (1-5)    |
| regulatoryRef?    |        | likelihood (1-5)  |
| tags[]            |        | detectability?    |
+-------------------+        | riskScore         |
       ^                     | riskLevel         |
       | linkedRequirementIds| classifiedBy      |
       |                     +-------------------+
+-------------------+
|      Test         |        +-------------------+
|-------------------|        | ElectronicSignature|
| id                |        |-------------------|
| title             |        | signerId          |
| description       |        | signerName        |
| status            |        | signerRole        |
| linkedReqIds[] ---+        | timestamp         |
+-------------------+        | meaning           |
                             | method            |
                             +-------------------+
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

## 3. State Management

QAtrial uses 14 Zustand stores (plus 1 hook) with localStorage persistence.

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
When `useRequirementsStore.deleteRequirement(id)` is called, it invokes `useTestsStore.getState().removeRequirementLink(id)` to strip the deleted requirement's ID from all tests' `linkedRequirementIds` arrays. This maintains referential integrity.

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

## 4. Authentication and RBAC

### Overview

QAtrial v2.0.0 introduces a client-side authentication and role-based access control (RBAC) system via `useAuthStore` (`src/store/useAuthStore.ts`), persisted in `localStorage` under `qatrial:auth`.

### User Roles

| Role | Description |
|------|-------------|
| `admin` | Full system access, user management, configuration |
| `qa_manager` | Manage requirements, tests, reports, approve changes |
| `qa_engineer` | Create and edit requirements and tests, run AI features |
| `auditor` | Read-only access with audit trail and report generation |
| `reviewer` | Review and approve/reject records, apply signatures |

### ROLE_PERMISSIONS Matrix

Permissions are defined in a static `ROLE_PERMISSIONS` matrix mapping each `UserRole` to an array of allowed actions. The `hasPermission(action)` method checks the current user's role against this matrix.

### Key Types

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

type UserRole = 'admin' | 'qa_manager' | 'qa_engineer' | 'auditor' | 'reviewer';
```

### Authentication Flow

1. **Registration:** `register(name, email, password, role)` creates a new user profile and logs them in.
2. **Login:** `login(email, password)` authenticates and sets the current user.
3. **Logout:** `logout()` clears the session and logs an audit event.
4. **Signature Verification:** `verifyForSignature(password)` re-authenticates the user with a 15-minute validity window. `isSignatureValid()` checks whether the window is still active.

### Integration with Other Systems

- **Audit Trail:** All audit entries now use the real user identity from `useAuthStore` instead of placeholder values.
- **Electronic Signatures:** Signatures pull the authenticated user's name, role, and ID. A warning is displayed when no user is logged in.
- **Auto-Logging:** All requirement and test CRUD operations automatically log audit entries with the current user identity.

---

## 5. Template Composition Engine

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

Deduplication uses the `templateId` field when present, falling back to **exact title match** for backward compatibility. The `templateId` field provides a stable identifier that survives title translations and edits. When a German overlay needs to replace an EU base requirement, it uses the same `templateId` with updated content. The overlay's version wins because it is loaded after the base.

### Template ID System (v2.0.0)

`TemplateRequirement` and `TemplateTest` now include two additional fields:

| Field | Type | Description |
|-------|------|-------------|
| `templateId` | `string` (optional) | Stable identifier for deduplication across locales and overlays |
| `source` | `string` (optional) | Origin of the template (e.g., `"eu/base"`, `"de/overlays/pharma"`, `"module/audit_trail"`) |

Templates authored before v2.0.0 that lack `templateId` continue to deduplicate by title.

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

During project creation in the wizard, the system matches each test's `linkedReqTags` against each requirement's `tags`. If any tag matches, the test gets linked to that requirement by ID. This produces many-to-many relationships without requiring index-based coupling.

### Available Template Sources

**14 Country Base Templates:**
US, EU, DE, GB, FR, JP, CN, KR, IN, CA, MX, IT, ES, NL

**EU Countries Receiving EU Base + Country Overlay:**
DE, FR, IT, ES, NL, BE, AT, SE, DK, IE, PL, PT, CZ, FI, NO, CH

**15 Module Definitions:**
Each with 5 requirements and 3 tests (approximately), defined directly in `registry.ts`.

---

## 6. AI System

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

  // 1. Direct match: providers whose purpose array includes the specific purpose
  const directMatch = enabled
    .filter(p => p.purpose.includes(purpose))
    .sort((a, b) => a.priority - b.priority);
  if (directMatch.length > 0) return directMatch[0];

  // 2. Fallback: providers with purpose "all"
  const fallback = enabled
    .filter(p => p.purpose.includes("all"))
    .sort((a, b) => a.priority - b.priority);
  if (fallback.length > 0) return fallback[0];

  // 3. No match
  return null;
}
```

Priority is a numeric value where **lower = higher priority**. This allows users to configure multiple providers and control which one handles each AI task.

### Prompt Architecture (6 Prompt Templates)

| Prompt | File | Purpose | Output Format |
|--------|------|---------|--------------|
| Test Generation | `generateTests.ts` | Generate 4-6 test cases from a requirement | JSON array of test objects |
| Risk Classification | `riskClassification.ts` | Propose severity/likelihood for a requirement | JSON object with scores and reasoning |
| Gap Analysis | `gapAnalysis.ts` | Compare requirements against regulatory standards | JSON array of gap objects |
| Executive Brief | `executiveBrief.ts` | Generate C-level compliance summary | Markdown text |
| CAPA Suggestion | `capaSuggestion.ts` | Root cause analysis and corrective actions for failed tests | JSON object with CAPA structure |
| VSR Report | `vsrReport.ts` | Generate Validation Summary Report sections | Array of report sections |

Each prompt template follows a common pattern:

```typescript
// 1. Context interface defining required inputs
export interface SomeContext { ... }

// 2. Prompt builder function that constructs the full prompt string
export function buildSomePrompt(ctx: SomeContext): string { ... }

// 3. Main function that calls complete() and parses the response
export async function doSomething(ctx: SomeContext): Promise<Result> {
  const prompt = buildSomePrompt(ctx);
  const response = await complete({ prompt, purpose: 'specific_purpose' });
  return parseResponse(response.text);
}
```

### AI Validation Layer (v2.0.0)

**File:** `src/ai/validation.ts`

AI responses are now validated through a structured validation layer:

1. **JSON Schema Validation:** Each prompt type defines an expected JSON schema. Responses are validated against it before being accepted.
2. **Safe Parsing:** `safeParse(text, schema)` strips markdown code fences, attempts `JSON.parse()`, then validates the parsed object against the schema.
3. **Retry Logic:** If validation fails, the system automatically retries the AI call (up to a configurable number of attempts) with an amended prompt that includes the validation error.
4. **ValidationError:** A custom error class that carries the schema violations for debugging and UI display.

### AI Proxy Mode (v2.0.0)

**File:** `src/ai/proxy.ts`

For deployments where browser-to-LLM direct calls are not desired (e.g., to protect API keys), QAtrial supports a server-side proxy:

- Set the `VITE_AI_PROXY_URL` environment variable to the proxy endpoint
- The `complete()` function in `client.ts` checks for the proxy URL before making direct calls
- When set, all AI requests are routed through the proxy, which forwards them to the configured LLM provider
- The proxy receives the same `CompletionRequest` payload and returns a `CompletionResponse`

### Response Parsing Strategy

AI responses are expected as JSON (for structured outputs) or markdown (for narrative outputs). The parsing approach:

1. For JSON responses: Validated via `safeParse()` with schema checking, retry on failure
2. For narrative responses: Used directly as text content
3. Confidence scores are included in structured responses as a 0.0-1.0 float
4. Provider ID and model name are attached to results for traceability

### Error Handling

- **No provider found:** Throws `Error("No AI provider configured for purpose: ...")`
- **HTTP errors:** Throws with status code and response body text
- **Validation errors:** Throws `ValidationError` with schema violations; triggers automatic retry
- **Parse errors:** Caught and surfaced to the UI as error messages with retry option
- **Token tracking:** Always called after successful responses via `trackUsage()`

---

## 7. Connector Framework

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

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string;
}

interface SyncRecord {
  id: string;
  connectorId: string;
  direction: 'import' | 'export' | 'bidirectional';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  itemsSynced: number;
  errors: string[];
  startedAt: string;
  completedAt?: string;
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

The `connectorRegistry` in `src/connectors/types.ts` provides:
- `registerConnector(connector: Connector)` -- Registers a new connector implementation
- `getConnector(type: ConnectorType)` -- Retrieves a registered connector by type

Connector state (configurations and sync records) is managed by `useConnectorStore`.

---

## 8. Code Splitting

### Lazy-Loaded Tab Components

`AppShell` lazy-loads all tab components using `React.lazy` wrapped in `Suspense`:

```typescript
const RequirementsTable = React.lazy(() => import('./requirements/RequirementsTable'));
const TestsTable = React.lazy(() => import('./tests/TestsTable'));
const EvaluationDashboard = React.lazy(() => import('./dashboard/EvaluationDashboard'));
const ReportGenerator = React.lazy(() => import('./reports/ReportGenerator'));
const ProviderSettings = React.lazy(() => import('./ai/ProviderSettings'));
```

Each tab is rendered inside a `<Suspense fallback={<LoadingSpinner />}>` boundary so the user sees a loading indicator while the chunk downloads.

### Vite Manual Chunks

The Vite build configuration in `vite.config.ts` defines manual chunks to optimize caching and load performance:

| Chunk Name | Contents |
|-----------|----------|
| `vendor-react` | `react`, `react-dom`, `react/jsx-runtime` |
| `vendor-charts` | `recharts` and dependencies |
| `vendor-table` | `@tanstack/react-table` |
| `vendor-i18n` | `react-i18next`, `i18next`, `i18next-http-backend` |
| `vendor-state` | `zustand` |
| `templates` | `src/templates/**` |
| `ai` | `src/ai/**` |

This ensures that vendor libraries are cached separately from application code, reducing re-download on deployments.

---

## 9. i18n Architecture

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

Translation files are served from `public/locales/{lng}/common.json`. When a language is selected, `i18next-http-backend` fetches the corresponding JSON file via HTTP. This keeps the main bundle small since only the active language is loaded.

### Fallback Chain

```
User's Selected Language -> English (en)
```

If a translation key is missing in the selected language, the English fallback is used. This ensures the UI always displays meaningful text.

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

### How to Add a New Language

1. Create `public/locales/{code}/common.json` (copy from `en/common.json`)
2. Translate all ~440 keys
3. Add the language option to the `LanguageSelector` component
4. The language will be available immediately via the HTTP backend

---

## 10. Theming

### CSS Custom Properties System

QAtrial uses CSS custom properties (CSS variables) defined at the `:root` level for all colors, with dark mode overrides under `.dark`:

```css
:root {
  --color-surface: #ffffff;
  --color-text-primary: #111827;
  --color-accent: #6366f1;
  /* ... 50+ color tokens */
}

.dark {
  --color-surface: #1f2937;
  --color-text-primary: #f9fafb;
  --color-accent: #818cf8;
  /* ... overrides for dark mode */
}
```

### Light/Dark Mode Implementation

The `useThemeStore` manages theme state:

1. State holds `theme: 'light' | 'dark'`
2. `toggleTheme()` flips the value and toggles the `dark` class on `document.documentElement`
3. On rehydration (page load), if the stored theme is `dark`, the `dark` class is applied immediately
4. All CSS tokens automatically update via the `.dark` selector

### Tailwind @theme Integration

Tailwind CSS 4 uses `@theme` to register CSS custom properties as Tailwind tokens:

```css
@theme {
  --color-surface: var(--color-surface);
  --color-text-primary: var(--color-text-primary);
  /* maps CSS vars to Tailwind utility classes */
}
```

This allows using tokens in Tailwind classes: `bg-surface`, `text-text-primary`, `border-border`, etc.

---

## 11. Component Architecture

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

### Key Patterns

**useTranslation Hook:**
Every component uses `const { t } = useTranslation()` for all user-facing text. No hardcoded strings in the UI.

**Theme Tokens:**
All colors use Tailwind utility classes mapped to CSS custom properties: `bg-surface`, `text-text-primary`, `border-border`, `bg-accent`, etc. No direct color values in components.

**Modal Pattern:**
Modals use a consistent pattern: fixed overlay with centered dialog, click-outside-to-close, header with title and X button, scrollable body, footer with action buttons.

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
  <div className="bg-surface-elevated rounded-xl shadow-2xl ..." onClick={e => e.stopPropagation()}>
    {/* Header */}
    {/* Body */}
    {/* Footer */}
  </div>
</div>
```

---

## 12. Test Infrastructure

### Framework

QAtrial v2.0.0 introduces automated testing using:

| Tool | Purpose |
|------|---------|
| **Vitest** | Test runner and assertion library (configured in `vitest.config.ts`) |
| **React Testing Library** | Component rendering and interaction testing |
| **jsdom** | Browser environment simulation for tests |

### Configuration

The test configuration lives in `vitest.config.ts` at the project root. It sets the environment to `jsdom` and configures path aliases to match the Vite config.

### Test File Location

Test files are co-located with source code in `__tests__` directories:

```
src/
  store/
    __tests__/
      useAuthStore.test.ts
      useRiskStore.test.ts
      ...
  ai/
    __tests__/
      validation.test.ts
      ...
  components/
    requirements/
      __tests__/
        RequirementsTable.test.tsx
        ...
```

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Run with coverage report
```

---

## 13. File Structure

```
QAtrial/
|-- public/
|   |-- locales/
|       |-- en/common.json          # English translations (440+ keys)
|       |-- de/common.json          # German
|       |-- fr/common.json          # French
|       |-- es/common.json          # Spanish
|       |-- it/common.json          # Italian
|       |-- pt/common.json          # Portuguese
|       |-- nl/common.json          # Dutch
|       |-- ja/common.json          # Japanese
|       |-- zh/common.json          # Chinese (Simplified)
|       |-- ko/common.json          # Korean
|       |-- hi/common.json          # Hindi
|       |-- th/common.json          # Thai
|
|-- src/
|   |-- ai/                         # AI system
|   |   |-- types.ts                # CompletionRequest, CompletionResponse
|   |   |-- client.ts               # Unified completion client (checks proxy, then direct)
|   |   |-- provider.ts             # Purpose-scoped provider resolver
|   |   |-- validation.ts           # JSON schema validation, safe parsing, retry logic
|   |   |-- proxy.ts                # Server-side proxy mode (VITE_AI_PROXY_URL)
|   |   |-- prompts/
|   |       |-- generateTests.ts    # Test case generation prompt
|   |       |-- riskClassification.ts # Risk severity/likelihood prompt
|   |       |-- gapAnalysis.ts      # Regulatory gap analysis prompt
|   |       |-- executiveBrief.ts   # Executive compliance brief prompt
|   |       |-- capaSuggestion.ts   # CAPA suggestion prompt
|   |       |-- vsrReport.ts        # Validation Summary Report prompt
|   |
|   |-- templates/                  # Template composition system
|   |   |-- types.ts                # TemplateRequirement, TemplateTest, etc.
|   |   |-- registry.ts            # VERTICAL_DEFINITIONS, COUNTRY_REGISTRY, MODULE_DEFINITIONS
|   |   |-- composer.ts            # composeTemplate() engine
|   |   |-- verticals/             # Industry vertical templates
|   |   |   |-- pharma/common.ts
|   |   |   |-- medical_devices/common.ts
|   |   |   |-- biotech/common.ts
|   |   |   |-- cro/common.ts
|   |   |   |-- clinical_lab/common.ts
|   |   |-- regions/               # Country regulatory templates
|   |   |   |-- eu/base.ts         # EU-wide base
|   |   |   |-- us/base.ts         # US-specific (FDA)
|   |   |   |-- de/base.ts         # Germany-specific
|   |   |   |-- gb/base.ts         # UK-specific (MHRA)
|   |   |   |-- fr/base.ts         # France-specific (ANSM)
|   |   |   |-- jp/base.ts         # Japan-specific (PMDA)
|   |   |   |-- cn/base.ts         # China-specific (NMPA)
|   |   |   |-- kr/base.ts         # South Korea-specific (MFDS)
|   |   |   |-- in/base.ts         # India-specific (CDSCO)
|   |   |   |-- ca/base.ts         # Canada-specific (Health Canada)
|   |   |   |-- mx/base.ts         # Mexico-specific (COFEPRIS)
|   |   |   |-- it/base.ts         # Italy-specific (AIFA)
|   |   |   |-- es/base.ts         # Spain-specific (AEMPS)
|   |   |   |-- nl/base.ts         # Netherlands-specific (IGJ)
|   |   |   |-- de/overlays/       # Country+Vertical overlays
|   |   |       |-- pharma.ts
|   |   |       |-- medical_devices.ts
|   |
|   |-- connectors/                # Connector framework
|   |   |-- types.ts               # ConnectorConfig, Connector interface, registry
|   |
|   |-- store/                     # Zustand state management
|   |   |-- useProjectStore.ts     # Project metadata
|   |   |-- useRequirementsStore.ts # Requirements CRUD
|   |   |-- useTestsStore.ts       # Tests CRUD
|   |   |-- useAuditStore.ts       # Audit trail
|   |   |-- useLLMStore.ts         # LLM provider config + usage
|   |   |-- useThemeStore.ts       # Theme preference
|   |   |-- useLocaleStore.ts      # Language preference
|   |   |-- useChangeControlStore.ts # Change control config
|   |   |-- useAuthStore.ts        # Authentication, RBAC, session mgmt
|   |   |-- useRiskStore.ts        # Persisted risk assessments
|   |   |-- useCAPAStore.ts        # CAPA records with lifecycle
|   |   |-- useGapStore.ts         # Gap analysis runs
|   |   |-- useEvidenceStore.ts    # Evidence attachments
|   |   |-- useAIHistoryStore.ts   # AI artifact provenance
|   |   |-- useConnectorStore.ts   # Connector configs and sync records
|   |   |-- useImportExport.ts     # Import/export hook
|   |
|   |-- hooks/                     # Custom React hooks
|   |   |-- useEvaluationData.ts   # Computes dashboard metrics
|   |
|   |-- lib/                       # Utility functions
|   |   |-- constants.ts           # Chart colors, UI constants
|   |   |-- idGenerator.ts         # generateId("REQ", counter) -> "REQ-001"
|   |   |-- demoProjects.ts        # 16 demo project configurations
|   |   |-- pdfExport.ts           # PDF export with cover page, TOC, signatures
|   |
|   |-- types/
|   |   |-- index.ts               # All TypeScript type definitions (60+ types)
|   |
|   |-- i18n/
|   |   |-- index.ts               # i18next configuration
|   |
|   |-- components/
|   |   |-- layout/
|   |   |   |-- AppShell.tsx        # Main layout with header, nav, tab routing
|   |   |
|   |   |-- wizard/
|   |   |   |-- SetupWizard.tsx     # 6-step wizard orchestrator
|   |   |   |-- StepCountry.tsx     # Country selection with search
|   |   |   |-- StepVertical.tsx    # Vertical selection
|   |   |   |-- StepMetadata.tsx    # Project name, description, owner, version
|   |   |   |-- StepProjectType.tsx # Project type selection
|   |   |   |-- StepModules.tsx     # Module multi-select
|   |   |   |-- StepPreview.tsx     # Preview and customize
|   |   |
|   |   |-- requirements/
|   |   |   |-- RequirementsTable.tsx # TanStack Table with sorting, search
|   |   |   |-- RequirementModal.tsx  # Create/edit modal
|   |   |
|   |   |-- tests/
|   |   |   |-- TestsTable.tsx       # TanStack Table
|   |   |   |-- TestModal.tsx        # Create/edit modal with req linking
|   |   |
|   |   |-- dashboard/
|   |   |   |-- EvaluationDashboard.tsx # Tab container (7 tabs)
|   |   |   |-- FilterBar.tsx          # Status filters
|   |   |   |-- CoverageCard.tsx       # Coverage percentage display
|   |   |   |-- StatusChart.tsx        # Pie/bar chart component
|   |   |   |-- TraceabilityMatrix.tsx # Req-to-test matrix grid
|   |   |   |-- OrphanedRequirements.tsx
|   |   |   |-- OrphanedTests.tsx
|   |   |   |-- ComplianceReadiness.tsx # Weighted readiness gauge
|   |   |   |-- GapAnalysisView.tsx    # AI gap analysis
|   |   |   |-- RiskMatrixView.tsx     # 5x5 interactive risk matrix
|   |   |   |-- EvidenceCompleteness.tsx
|   |   |   |-- CAPAFunnel.tsx         # Failed test CAPA analysis
|   |   |   |-- TrendCharts.tsx        # Metric distribution charts
|   |   |   |-- PortfolioDashboard.tsx # Multi-project overview
|   |   |
|   |   |-- ai/
|   |   |   |-- TestGenerationPanel.tsx  # AI test case generation modal
|   |   |   |-- RiskClassificationPanel.tsx # AI risk classification modal
|   |   |   |-- ProviderSettings.tsx     # LLM provider management page
|   |   |
|   |   |-- reports/
|   |   |   |-- ReportGenerator.tsx    # Report type selection + config
|   |   |   |-- ReportPreview.tsx      # Generated report viewer
|   |   |
|   |   |-- audit/
|   |   |   |-- AuditTrailViewer.tsx   # Timeline view with filters, export
|   |   |   |-- SignatureModal.tsx     # Electronic signature dialog
|   |   |
|   |   |-- shared/
|   |       |-- ImportExportBar.tsx    # Import/export buttons
|   |       |-- ThemeToggle.tsx        # Light/dark toggle
|   |       |-- LanguageSelector.tsx   # Language dropdown
|   |       |-- ConfirmDialog.tsx      # Generic confirmation dialog
|   |
|   |-- App.tsx                    # Root component
|   |-- main.tsx                   # Entry point
|   |-- index.css                  # Global styles + CSS custom properties
|
|-- docs/                          # Documentation
|-- package.json
|-- tsconfig.json
|-- vite.config.ts                 # Build config with manual chunks
|-- vitest.config.ts               # Test runner configuration
|-- tailwind.config.ts
```
