# QAtrial API Reference

Reference documentation for all stores, hooks, utilities, and types.

---

## Table of Contents

1. [Stores](#1-stores)
2. [AI Client](#2-ai-client)
3. [Template System](#3-template-system)
4. [Utilities](#4-utilities)
5. [Type Reference](#5-type-reference)

---

## 1. Stores

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

#### Usage

```typescript
const project = useProjectStore((s) => s.project);
const setProject = useProjectStore((s) => s.setProject);
```

---

### useRequirementsStore

**File:** `src/store/useRequirementsStore.ts`
**Persistence Key:** `qatrial:requirements`

#### State Shape

```typescript
interface RequirementsState {
  requirements: Requirement[];
  reqCounter: number;  // Next ID number for auto-generation
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `addRequirement` | `(data: { title: string; description: string; status: RequirementStatus }) => void` | Creates a new requirement with auto-generated ID (REQ-{counter}). Increments counter. |
| `updateRequirement` | `(id: string, data: Partial<Omit<Requirement, 'id' \| 'createdAt'>>) => void` | Updates fields on an existing requirement. Automatically sets `updatedAt`. |
| `deleteRequirement` | `(id: string) => void` | Deletes a requirement and removes its ID from all test links (cross-store cleanup). |
| `setRequirements` | `(reqs: Requirement[], counter: number) => void` | Bulk-replaces all requirements and resets the counter. Used by wizard and import. |

#### Cross-Store Side Effects

`deleteRequirement` calls `useTestsStore.getState().removeRequirementLink(id)` to maintain referential integrity.

---

### useTestsStore

**File:** `src/store/useTestsStore.ts`
**Persistence Key:** `qatrial:tests`

#### State Shape

```typescript
interface TestsState {
  tests: Test[];
  testCounter: number;  // Next ID number for auto-generation
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `addTest` | `(data: { title: string; description: string; status: TestStatus; linkedRequirementIds: string[] }) => void` | Creates a new test with auto-generated ID (TST-{counter}). |
| `updateTest` | `(id: string, data: Partial<Omit<Test, 'id' \| 'createdAt'>>) => void` | Updates fields on an existing test. |
| `deleteTest` | `(id: string) => void` | Deletes a test. |
| `removeRequirementLink` | `(reqId: string) => void` | Removes a requirement ID from all tests' `linkedRequirementIds`. Called by requirements store on delete. |
| `setTests` | `(tests: Test[], counter: number) => void` | Bulk-replaces all tests and resets the counter. |

---

### useAuditStore

**File:** `src/store/useAuditStore.ts`
**Persistence Key:** `qatrial:audit`

#### State Shape

```typescript
interface AuditState {
  entries: AuditEntry[];
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `log` | `(action: AuditAction, entityType: string, entityId: string, previousValue?: string, newValue?: string, reason?: string) => void` | Appends a new audit entry with auto-generated ID and ISO 8601 timestamp. |
| `getEntriesForEntity` | `(entityId: string) => AuditEntry[]` | Returns all audit entries for a specific entity. |
| `getEntriesByDateRange` | `(from: Date, to: Date) => AuditEntry[]` | Returns entries within the given date range. |
| `clearEntries` | `() => void` | Removes all audit entries. |

#### Audit Entry ID Format

```
audit-{timestamp}-{counter}
```

Where `timestamp` is `Date.now()` and `counter` is an incrementing integer.

---

### useLLMStore

**File:** `src/store/useLLMStore.ts`
**Persistence Key:** `qatrial:llm`

#### State Shape

```typescript
interface LLMState {
  providers: LLMProvider[];
  usage: Record<string, UsageRecord>;
}

interface UsageRecord {
  inputTokens: number;
  outputTokens: number;
  calls: number;
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `addProvider` | `(provider: LLMProvider) => void` | Adds a new LLM provider configuration. |
| `updateProvider` | `(id: string, data: Partial<Omit<LLMProvider, 'id'>>) => void` | Updates an existing provider's configuration. |
| `removeProvider` | `(id: string) => void` | Removes a provider by ID. |
| `trackUsage` | `(providerId: string, input: number, output: number) => void` | Increments token usage counters for a provider. Called by the AI client after each completion. |
| `getProviderForPurpose` | `(purpose: LLMPurpose) => LLMProvider \| null` | Resolves the best provider for a purpose using the routing algorithm. |
| `hasAnyProvider` | `() => boolean` | Returns `true` if at least one enabled provider exists. |
| `testConnection` | `(id: string) => Promise<{ ok: boolean; latencyMs: number; error?: string }>` | Sends a minimal test prompt to verify the provider is reachable. Returns latency and success/error status. |

---

### useThemeStore

**File:** `src/store/useThemeStore.ts`
**Persistence Key:** `qatrial:theme`

#### State Shape

```typescript
interface ThemeState {
  theme: 'light' | 'dark';
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `setTheme` | `(theme: Theme) => void` | Sets theme and toggles the `dark` CSS class on `<html>`. |
| `toggleTheme` | `() => void` | Flips between light and dark. |

#### Rehydration Behavior

On page load, if the stored theme is `dark`, the `dark` class is applied to `document.documentElement` in the `onRehydrateStorage` callback.

---

### useLocaleStore

**File:** `src/store/useLocaleStore.ts`
**Persistence Key:** `qatrial:locale`

#### State Shape

```typescript
interface LocaleState {
  language: string;      // e.g., "en", "de", "ja"
  country: string | null; // ISO 3166-1 alpha-2
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `setLanguage` | `(lang: string) => void` | Changes the i18next language and persists the selection. |
| `setCountry` | `(country: string \| null) => void` | Stores the selected country code. |

---

### useChangeControlStore

**File:** `src/store/useChangeControlStore.ts`
**Persistence Key:** `qatrial:change-control`

#### State Shape

```typescript
interface ChangeControlState {
  config: ChangeControlConfig;
}

interface ChangeControlConfig {
  requireApprovalFor: string[];    // Entity types requiring approval
  minimumApprovers: number;        // Minimum required approvers
  requireReason: boolean;          // Whether a reason is mandatory
  requireSignature: boolean;       // Whether e-signature is required
  autoRevertOnChange: boolean;     // Whether changes revert approval status
}
```

#### Actions

| Action | Signature | Description |
|--------|-----------|-------------|
| `setConfig` | `(config: Partial<ChangeControlConfig>) => void` | Partially updates the change control configuration. |
| `isApprovalRequired` | `(entityType: string) => boolean` | Checks if the given entity type requires approval per the current config. |

#### Helper Function

```typescript
function getConfigForVertical(vertical?: IndustryVertical): ChangeControlConfig
```

Returns a strict config for pharma, medical_devices, and biotech verticals (2 approvers, signature required, auto-revert). Returns default (lenient) config for all others.

---

### useImportExport

**File:** `src/store/useImportExport.ts`
**Persistence Key:** None (hook, not persisted)

This is a custom hook, not a Zustand store.

#### Returned Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `exportData` | `() => void` | Assembles project data into a `ProjectData` object and triggers a JSON file download. |
| `importData` | `(file: File) => Promise<{ success: boolean; message: string }>` | Reads a JSON file, validates it, strips dangling links, and loads data into all stores. |

#### Import Validation

1. Checks `version === 1`
2. Validates `requirements` and `tests` are arrays
3. Strips `linkedRequirementIds` entries that reference non-existent requirement IDs
4. Loads data into project, requirements, and tests stores

---

## 2. AI Client

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
4. Branches based on `provider.type`:
   - **anthropic:** POST to `{baseUrl}/v1/messages` with Anthropic headers
   - **openai-compatible:** POST to `{baseUrl}/chat/completions` with Bearer auth
5. Parses the response and extracts text + token counts
6. Calls `trackUsage()` to record consumption
7. Returns `CompletionResponse`

#### Error Handling

- HTTP errors throw: `"Anthropic API error {status}: {body}"` or `"OpenAI-compatible API error {status}: {body}"`
- Missing provider throws: `"No AI provider configured for purpose: {purpose}"`

---

### resolveProvider()

**File:** `src/ai/provider.ts`

```typescript
function resolveProvider(purpose: LLMPurpose, providers: LLMProvider[]): LLMProvider | null
```

#### Algorithm

1. Filter to enabled providers only
2. Find providers whose `purpose` array includes the specific requested purpose
3. Sort by `priority` (ascending -- lower number = higher priority)
4. Return the first match
5. If no direct match, find providers with `purpose` including `'all'`
6. Sort by priority, return first
7. If still no match, return `null`

---

## 3. Template System

### composeTemplate()

**File:** `src/templates/composer.ts`

```typescript
async function composeTemplate(config: ComposeConfig): Promise<ComposeResult>
```

#### Parameters (ComposeConfig)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `country` | `string` | Yes | ISO 3166-1 alpha-2 country code |
| `vertical` | `string` | No | Vertical ID (e.g., "pharma") |
| `projectType` | `string` | No | Project type within the vertical |
| `modules` | `string[]` | Yes | Array of module IDs to include |

#### Returns (ComposeResult)

| Field | Type | Description |
|-------|------|-------------|
| `requirements` | `TemplateRequirement[]` | Deduplicated requirements from all sources |
| `tests` | `TemplateTest[]` | Deduplicated tests from all sources |

#### Loading Order

1. Regional base (EU for European countries)
2. Country-specific base
3. Vertical common templates
4. Vertical project-type templates
5. Country + vertical overlay
6. Selected modules

All sources are loaded via `safeImport()` which returns `null` for missing modules (graceful degradation). After loading, requirements and tests are deduplicated by title (last entry wins).

---

### Registry Lookup Functions

#### VERTICAL_DEFINITIONS

```typescript
const VERTICAL_DEFINITIONS: VerticalDefinition[]
```

Array of 10 vertical definitions. Each contains:
- `id`: Unique string identifier
- `name`: i18n key for display name
- `riskTaxonomy`: `'iso14971' | 'ichQ9' | 'fmea' | 'gamp5' | 'generic'`
- `primaryStandards`: Array of standard references

#### COUNTRY_REGISTRY

```typescript
const COUNTRY_REGISTRY: CountryRegistryEntry[]
```

Array of 37+ country entries. Each contains:
- `code`: ISO 3166-1 alpha-2
- `nameKey`: i18n key
- `region`: `'americas' | 'europe' | 'asia'`
- `flag`: Emoji flag
- `availableVerticals`: Array of vertical IDs available for this country

#### MODULE_DEFINITIONS

```typescript
const MODULE_DEFINITIONS: ModuleDefinition[]
```

Array of 15+ module definitions. Each contains:
- `id`: Unique string identifier
- `nameKey`, `descKey`: i18n keys
- `requirements`: Array of `TemplateRequirement` objects
- `tests`: Array of `TemplateTest` objects

---

### TemplateRequirement Schema

```typescript
interface TemplateRequirement {
  title: string;          // Deduplication key
  description: string;    // Full requirement text
  category: string;       // Grouping (e.g., "Data Integrity")
  tags: string[];         // For filtering and test linking
  riskLevel: RiskLevel;   // "critical" | "high" | "medium" | "low"
  regulatoryRef?: string; // e.g., "21 CFR 11.10(e)"
}
```

### TemplateTest Schema

```typescript
interface TemplateTest {
  title: string;            // Deduplication key
  description: string;      // Test procedure
  category: string;         // Grouping (e.g., "Functional")
  tags: string[];           // For filtering
  linkedReqTags: string[];  // Tags matching requirement.tags for linking
}
```

---

## 4. Utilities

### generateId()

**File:** `src/lib/idGenerator.ts`

```typescript
function generateId(prefix: string, counter: number): string
```

Generates padded IDs:
- `generateId('REQ', 1)` returns `"REQ-001"`
- `generateId('TST', 42)` returns `"TST-042"`
- `generateId('REQ', 1000)` returns `"REQ-1000"`

The counter is zero-padded to at least 3 digits.

---

### Demo Project Helpers

**File:** `src/lib/demoProjects.ts`

#### getDemoProject()

```typescript
function getDemoProject(countryCode: string): DemoProject | undefined
```

Returns the demo project for a given country code, or `undefined` if none exists.

#### DEMO_COUNTRY_CODES

```typescript
const DEMO_COUNTRY_CODES: Set<string>
```

A `Set` of country codes that have demo projects. Used for quick membership checks in the UI (e.g., showing "Demo available" badges).

#### DemoProject Interface

```typescript
interface DemoProject {
  countryCode: string;
  companyName: string;
  companyNameEn: string;
  projectName: string;
  projectNameEn: string;
  description: string;
  descriptionEn: string;
  vertical: string;
  projectType: string;
  modules: string[];
  owner: string;
  version: string;
}
```

---

### useEvaluationData Hook

**File:** `src/hooks/useEvaluationData.ts`

```typescript
function useEvaluationData(filters: DashboardFilters): EvaluationMetrics
```

Computes dashboard metrics based on current requirements and tests, with optional filters applied.

#### Returns (EvaluationMetrics)

| Field | Type | Description |
|-------|------|-------------|
| `totalRequirements` | `number` | Total requirement count |
| `totalTests` | `number` | Total test count |
| `coveragePercent` | `number` | Percentage of requirements with at least one linked test |
| `coveredRequirements` | `Requirement[]` | Requirements that have linked tests |
| `orphanedRequirements` | `Requirement[]` | Requirements without any linked tests |
| `orphanedTests` | `Test[]` | Tests not linked to any requirement |
| `requirementStatusCounts` | `Record<RequirementStatus, number>` | Count per status |
| `testStatusCounts` | `Record<TestStatus, number>` | Count per status |

---

## 5. Type Reference

All types are defined in `src/types/index.ts`.

### Status Types

| Type | Values |
|------|--------|
| `RequirementStatus` | `'Draft' \| 'Active' \| 'Closed'` |
| `TestStatus` | `'Not Run' \| 'Passed' \| 'Failed'` |
| `RiskLevel` | `'low' \| 'medium' \| 'high' \| 'critical'` |
| `GapStatus` | `'covered' \| 'partial' \| 'missing'` |
| `SignatureMeaning` | `'authored' \| 'reviewed' \| 'approved' \| 'verified' \| 'rejected'` |

### Configuration Types

| Type | Values |
|------|--------|
| `IndustryVertical` | `'pharma' \| 'biotech' \| 'medical_devices' \| 'cro' \| 'clinical_lab' \| 'logistics' \| 'cosmetics' \| 'aerospace' \| 'chemical_env' \| 'software_it'` |
| `ProjectType` | `'software' \| 'embedded' \| 'compliance' \| 'empty'` |
| `LLMProviderType` | `'openai-compatible' \| 'anthropic'` |
| `LLMPurpose` | `'all' \| 'test_generation' \| 'gap_analysis' \| 'risk_classification' \| 'report_narrative' \| 'requirement_decomp' \| 'capa'` |
| `RiskTaxonomyType` | `'iso14971' \| 'ichQ9' \| 'fmea' \| 'gamp5' \| 'generic'` |
| `SafetyClassType` | `'iec62304' \| 'gamp5cat' \| 'sil' \| 'none'` |
| `AuditAction` | `'create' \| 'update' \| 'delete' \| 'status_change' \| 'link' \| 'unlink' \| 'approve' \| 'reject' \| 'sign' \| 'export' \| 'generate_report'` |
| `ReportType` | `'validation_summary' \| 'traceability_matrix' \| 'gap_analysis' \| 'risk_assessment' \| 'executive_brief' \| 'submission_package'` |
| `ViewTab` | `'requirements' \| 'tests' \| 'dashboard' \| 'reports' \| 'settings'` |

### Risk Assessment Types

| Type | Values | Description |
|------|--------|-------------|
| `Severity` | `1 \| 2 \| 3 \| 4 \| 5` | 1=Negligible, 5=Critical |
| `Likelihood` | `1 \| 2 \| 3 \| 4 \| 5` | 1=Rare, 5=Almost Certain |
| `Detectability` | `1 \| 2 \| 3 \| 4 \| 5` | 1=High detectability, 5=Undetectable |

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

#### ProjectData (Import/Export Format)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | `1` | Yes | Format version (always 1) |
| `exportedAt` | `string` | Yes | ISO 8601 export timestamp |
| `project` | `ProjectMeta` | No | Project metadata |
| `requirements` | `Requirement[]` | Yes | All requirements |
| `tests` | `Test[]` | Yes | All tests |
| `counters` | `{ reqCounter: number; testCounter: number }` | Yes | ID counters |

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
| `residualRisk` | `number` | No | Post-mitigation score |
| `classifiedBy` | `'manual' \| 'ai'` | Yes | Who classified |
| `classifiedAt` | `string` | Yes | ISO 8601 timestamp |

#### AuditEntry

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

#### ElectronicSignature

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `signerId` | `string` | Yes | Unique signer identifier |
| `signerName` | `string` | Yes | Display name |
| `signerRole` | `string` | Yes | Role (e.g., "Quality Manager") |
| `timestamp` | `string` | Yes | ISO 8601 |
| `meaning` | `SignatureMeaning` | Yes | authored / reviewed / approved / verified / rejected |
| `method` | `string` | Yes | Authentication method (e.g., "password") |

#### LLMProvider

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique provider ID |
| `name` | `string` | Yes | Display name |
| `type` | `LLMProviderType` | Yes | anthropic / openai-compatible |
| `baseUrl` | `string` | Yes | API base URL |
| `apiKey` | `string` | Yes | API key (may be empty for local) |
| `model` | `string` | Yes | Model identifier |
| `purpose` | `LLMPurpose[]` | Yes | Which AI purposes this handles |
| `maxTokens` | `number` | Yes | Default max token limit |
| `temperature` | `number` | Yes | Default temperature |
| `enabled` | `boolean` | Yes | Whether active |
| `priority` | `number` | Yes | Lower = higher priority |

#### AIGeneratedTestCase

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Test case title |
| `description` | `string` | Yes | What this test verifies |
| `steps` | `string[]` | Yes | Numbered test steps |
| `expectedResult` | `string` | Yes | Pass/fail criteria |
| `requirementId` | `string` | Yes | Source requirement ID |
| `standard` | `string` | No | Regulatory reference |
| `confidence` | `number` | Yes | 0.0-1.0 confidence score |
| `accepted` | `boolean` | Yes | Whether user accepted |
| `generatedBy` | `string` | Yes | Model name |
| `providerId` | `string` | Yes | Provider identifier |

#### AIGapAnalysis

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `standard` | `string` | Yes | Standard name |
| `clause` | `string` | Yes | Specific clause reference |
| `status` | `GapStatus` | Yes | covered / partial / missing |
| `linkedRequirementIds` | `string[]` | Yes | Matching requirements |
| `linkedTestIds` | `string[]` | Yes | Matching tests |
| `suggestion` | `string` | No | Remediation suggestion |
| `generatedBy` | `string` | Yes | Model name |
| `providerId` | `string` | Yes | Provider identifier |

#### AIRiskClassification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requirementId` | `string` | Yes | Source requirement |
| `proposedSeverity` | `Severity` | Yes | 1-5 |
| `proposedLikelihood` | `Likelihood` | Yes | 1-5 |
| `reasoning` | `string` | Yes | Explanation |
| `safetyClass` | `string` | No | Safety classification |
| `confidence` | `number` | Yes | 0.0-1.0 |
| `generatedBy` | `string` | Yes | Model name |
| `providerId` | `string` | Yes | Provider identifier |

#### ReportConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `ReportType` | Yes | Report type |
| `projectId` | `string` | Yes | Project identifier |
| `format` | `string` | Yes | Output format (html/pdf) |
| `includeSignatures` | `boolean` | Yes | Include signature blocks |
| `targetAuthority` | `string` | No | Regulatory authority |
| `generatedAt` | `string` | Yes | ISO 8601 |
| `generatedBy` | `string` | Yes | Generator name |
| `sections` | `ReportSection[]` | Yes | Report content sections |

#### ChangeControlConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requireApprovalFor` | `string[]` | Yes | Entity types needing approval |
| `minimumApprovers` | `number` | Yes | Required approver count |
| `requireReason` | `boolean` | Yes | Mandate reason for changes |
| `requireSignature` | `boolean` | Yes | Mandate e-signature |
| `autoRevertOnChange` | `boolean` | Yes | Revert approval on modification |

#### VerticalConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `IndustryVertical` | Yes | Vertical identifier |
| `name` | `string` | Yes | Display name |
| `gxpFocus` | `string[]` | Yes | GxP areas of focus |
| `primaryStandards` | `string[]` | Yes | Key regulatory standards |
| `riskTaxonomy` | `RiskTaxonomyType` | Yes | Risk framework |
| `safetyClassification` | `SafetyClassType` | No | Safety class scheme |

#### EvaluationMetrics

| Field | Type | Description |
|-------|------|-------------|
| `totalRequirements` | `number` | Total count |
| `totalTests` | `number` | Total count |
| `coveragePercent` | `number` | 0-100 |
| `coveredRequirements` | `Requirement[]` | With linked tests |
| `orphanedRequirements` | `Requirement[]` | Without linked tests |
| `orphanedTests` | `Test[]` | Without linked requirements |
| `requirementStatusCounts` | `Record<RequirementStatus, number>` | Per-status counts |
| `testStatusCounts` | `Record<TestStatus, number>` | Per-status counts |

#### DashboardFilters

| Field | Type | Description |
|-------|------|-------------|
| `requirementStatus` | `RequirementStatus \| 'All'` | Filter requirements |
| `testStatus` | `TestStatus \| 'All'` | Filter tests |
