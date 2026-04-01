# QAtrial Developer Guide

Guide for developers extending and customizing QAtrial.

---

## Table of Contents

1. [Development Setup](#1-development-setup)
2. [Adding a New Country](#2-adding-a-new-country)
3. [Adding a New Vertical](#3-adding-a-new-vertical)
4. [Adding a New Module](#4-adding-a-new-module)
5. [Adding a New Language](#5-adding-a-new-language)
6. [Adding a New AI Prompt](#6-adding-a-new-ai-prompt)
7. [Adding AI Validators](#7-adding-ai-validators)
8. [Writing Connectors](#8-writing-connectors)
9. [Creating New Stores](#9-creating-new-stores)
10. [Adding a New Dashboard View](#10-adding-a-new-dashboard-view)
11. [Adding a New Report Type](#11-adding-a-new-report-type)
12. [Code Conventions](#12-code-conventions)
13. [Test Infrastructure](#13-test-infrastructure)
14. [Testing Checklist](#14-testing-checklist)

---

## 1. Development Setup

### Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later
- A modern browser (Chrome, Firefox, Safari, or Edge)
- A code editor with TypeScript support (VS Code recommended)

### Clone, Install, Run

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement (HMR).

### Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on source files |
| `npm run type-check` | Run TypeScript compiler in check mode |
| `npm run test` | Run all tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

### Dev Server Configuration

Vite is configured in `vite.config.ts`. Key settings:
- **React plugin** for JSX transform and Fast Refresh
- **Path aliases** may be configured for cleaner imports
- **Public directory** serves `public/locales/` for i18n files

---

## 2. Adding a New Country

### Step-by-Step

#### 1. Create the country base template

Create `src/templates/regions/{cc}/base.ts` where `{cc}` is the lowercase ISO 3166-1 alpha-2 code.

```typescript
// src/templates/regions/br/base.ts

import type { CountryTemplateSet } from '../../types';

export const templateSet: CountryTemplateSet = {
  countryCode: 'BR',
  requirements: [
    {
      title: 'ANVISA RDC 658/2022 Compliance',
      description: 'The system shall comply with ANVISA RDC 658/2022 requirements for...',
      category: 'Regulatory',
      tags: ['anvisa', 'rdc-658', 'gmp'],
      riskLevel: 'high',
      regulatoryRef: 'ANVISA RDC 658/2022',
    },
    // ... more requirements
  ],
  tests: [
    {
      title: 'Verify ANVISA RDC 658 Data Integrity',
      description: 'Confirm data integrity controls meet ANVISA RDC 658/2022...',
      category: 'Regulatory',
      tags: ['anvisa', 'data-integrity'],
      linkedReqTags: ['anvisa', 'rdc-658'],
    },
    // ... more tests
  ],
};

export default templateSet;
```

#### 2. Add to COUNTRY_REGISTRY

In `src/templates/registry.ts`, add an entry to the `COUNTRY_REGISTRY` array:

```typescript
{
  code: 'BR',
  nameKey: 'countries.br',
  region: 'americas',
  defaultLanguage: 'pt-BR',
  flag: '\u{1F1E7}\u{1F1F7}',
  availableVerticals: ['pharma', 'biotech', 'medical_devices', 'software_it', 'logistics', 'cosmetics'],
},
```

#### 3. Add country-specific overlays (optional)

For vertical-specific regulatory requirements, create overlay files:

```
src/templates/regions/br/overlays/pharma.ts
src/templates/regions/br/overlays/medical_devices.ts
```

Each overlay follows the `VerticalTemplateSet` interface.

#### 4. Add EU region mapping (if applicable)

If the country is in the EU/EFTA, add its code to the `euCountries` array in `src/templates/composer.ts`:

```typescript
const euCountries = [
  'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'IE',
  'PL', 'PT', 'CZ', 'FI', 'NO', 'CH', 'BR',  // Add here if EU
];
```

#### 5. Add translation keys

In every locale file (`public/locales/{lang}/common.json`), add the country name:

```json
"countries": {
  "BR": "Brazil"
}
```

### File Naming Conventions

- Country codes are **uppercase** in the registry and types, **lowercase** for directory names
- Base templates: `src/templates/regions/{cc}/base.ts`
- Overlays: `src/templates/regions/{cc}/overlays/{vertical_id}.ts`

### Template Content Guidelines

- Each requirement should have a clear, specific `title` and detailed `description`
- **Include a `templateId`** (v2.0.0): A stable identifier for deduplication across locales (e.g., `"br-anvisa-rdc658-compliance"`). Falls back to title matching if omitted for backward compatibility.
- **Include a `source`** (v2.0.0): Origin of the template (e.g., `"br/base"`, `"br/overlays/pharma"`)
- Use `regulatoryRef` to cite the exact regulatory clause
- Assign `riskLevel` based on the criticality to the regulatory framework
- Use descriptive, lowercase, hyphenated `tags` for linking (e.g., `"data-integrity"`, `"anvisa-compliance"`)
- Tests should reference specific standards in their descriptions
- Use `linkedReqTags` to establish test-to-requirement relationships

---

## 3. Adding a New Vertical

### Step-by-Step

#### 1. Create vertical common templates

Create `src/templates/verticals/{vertical_id}/common.ts`:

```typescript
// src/templates/verticals/food_safety/common.ts

import type { VerticalTemplateSet } from '../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'food_safety',
  requirements: [
    {
      title: 'HACCP Plan Implementation',
      description: 'A documented HACCP plan shall be established...',
      category: 'Food Safety',
      tags: ['haccp', 'food-safety', 'hazard-analysis'],
      riskLevel: 'critical',
      regulatoryRef: 'Codex Alimentarius HACCP',
    },
    // ... more requirements
  ],
  tests: [
    {
      title: 'Verify HACCP Critical Control Points',
      description: 'Confirm all critical control points are identified and monitored...',
      category: 'Regulatory',
      tags: ['haccp', 'ccp'],
      linkedReqTags: ['haccp', 'hazard-analysis'],
    },
    // ... more tests
  ],
};

export default templateSet;
```

#### 2. Create project type packs (optional)

For project-type-specific templates within the vertical:

```
src/templates/verticals/food_safety/compliance.ts
src/templates/verticals/food_safety/software.ts
```

#### 3. Add to VERTICAL_DEFINITIONS

In `src/templates/registry.ts`:

```typescript
{
  id: 'food_safety',
  name: 'verticals.food_safety.name',
  focusKey: 'verticals.food_safety.focus',
  icon: 'UtensilsCrossed',  // Lucide icon name
  riskTaxonomy: 'fmea',
  primaryStandards: [
    'Codex Alimentarius HACCP',
    'ISO 22000 (FSMS)',
    'FSSC 22000',
    'EU Regulation 852/2004',
  ],
},
```

#### 4. Update the IndustryVertical type

In `src/types/index.ts`, add the new vertical to the union type:

```typescript
export type IndustryVertical =
  | 'pharma'
  | 'biotech'
  // ...
  | 'food_safety';  // Add new vertical
```

#### 5. Add to launch verticals arrays

In `src/templates/registry.ts`, add to `LAUNCH_VERTICALS` or `ALL_VERTICALS`:

```typescript
const LAUNCH_VERTICALS = [
  'pharma', 'biotech', /* ... */ 'food_safety',
];
```

#### 6. Add to country registry entries

Update the `availableVerticals` arrays in `COUNTRY_REGISTRY` for countries where this vertical applies.

#### 7. Add translation keys

```json
"verticals": {
  "food_safety": {
    "name": "Food Safety",
    "focus": "HACCP, ISO 22000, FSSC 22000"
  }
}
```

### Risk Taxonomy Selection

Choose the most appropriate risk taxonomy for the vertical:

| Taxonomy | Best For |
|----------|----------|
| `iso14971` | Medical/patient safety focus |
| `ichQ9` | Pharmaceutical quality focus |
| `fmea` | Process/manufacturing/engineering focus |
| `gamp5` | Computer system validation focus |
| `generic` | General quality management |

---

## 4. Adding a New Module

### Step-by-Step

#### 1. Add to MODULE_DEFINITIONS in registry.ts

In `src/templates/registry.ts`, add a new entry to the `MODULE_DEFINITIONS` array:

```typescript
{
  id: 'environmental_monitoring',
  nameKey: 'modules.environmental_monitoring.name',
  descKey: 'modules.environmental_monitoring.desc',
  icon: 'Thermometer',  // Lucide icon name
  requirements: [
    {
      title: 'Environmental Monitoring System',
      description: 'The facility shall have a validated environmental monitoring system...',
      category: 'Environmental',
      tags: ['env-monitoring', 'temperature', 'humidity'],
      riskLevel: 'high',
      regulatoryRef: 'EU GMP Annex 1',
    },
    // Add 4-5 requirements per module
  ],
  tests: [
    {
      title: 'Verify Environmental Monitoring Alerts',
      description: 'Confirm that out-of-range conditions trigger alerts...',
      category: 'Functional',
      tags: ['env-monitoring', 'alerts'],
      linkedReqTags: ['env-monitoring', 'temperature'],
    },
    // Add 2-3 tests per module
  ],
},
```

#### 2. Add translation keys

In `public/locales/en/common.json` and all other locale files:

```json
"modules": {
  "environmental_monitoring": {
    "name": "Environmental Monitoring",
    "desc": "Temperature, humidity, and particulate monitoring systems"
  }
}
```

### How to Structure Requirements and Tests

**Requirements:**
- 4-5 requirements per module is the standard
- Each requirement should be self-contained and testable
- Include a specific `regulatoryRef` where applicable
- Set `riskLevel` based on the requirement's criticality

**Tests:**
- 2-3 tests per module
- Each test should verify one or more requirements via `linkedReqTags`
- Include clear pass/fail criteria in the description
- Categorize as "Functional", "Security", "Performance", or "Regulatory"

### Tag Conventions for Linking

Tags follow these conventions:
- Lowercase with hyphens: `"env-monitoring"`, `"data-integrity"`
- Module-specific prefix: `"audit-trail-*"`, `"e-signature-*"`
- Share tags between requirements and tests for automatic linking
- A test's `linkedReqTags` should contain tags that appear in at least one requirement's `tags` array

---

## 5. Adding a New Language

### Create Locale JSON File

1. Copy `public/locales/en/common.json` to `public/locales/{code}/common.json`
2. Translate all values (keys remain in English)
3. The file will be automatically loaded by `i18next-http-backend`

Example for Swedish (`sv`):

```
public/locales/sv/common.json
```

### Add to LanguageSelector

Update the `LanguageSelector` component in `src/components/shared/LanguageSelector.tsx` to include the new language option.

### Translation Key Reference

The English locale file contains approximately 440 keys organized into these groups:

| Group | Key Count | Notes |
|-------|-----------|-------|
| `app.*` | 2 | Application name and labels |
| `nav.*` | 5 | Navigation tab labels |
| `wizard.*` | ~25 | Setup wizard text (all 6 steps) |
| `common.*` | ~20 | Shared buttons, labels, and actions |
| `requirements.*` | ~15 | Requirements view text |
| `tests.*` | ~15 | Tests view text |
| `dashboard.*` | ~50 | Dashboard labels, metrics, and descriptions |
| `risk.*` | ~10 | Risk level labels and field names |
| `ai.*` | ~20 | AI feature labels and messages |
| `reports.*` | ~10 | Report types and generation text |
| `audit.*` | ~15 | Audit trail actions and labels |
| `signature.*` | ~10 | Signature meanings and form labels |
| `statuses.*` | 6 | Status labels (Draft, Active, etc.) |
| `countries.*` | 37+ | Country names |
| `verticals.*` | 20 | Vertical names and focus descriptions |
| `modules.*` | 30+ | Module names and descriptions |
| `projectTypes.*` | 16 | Project type names and descriptions |

### Testing Translations

1. Start the dev server
2. Switch to the new language via the Language Selector
3. Navigate through all tabs and features to verify translations
4. Check the Setup Wizard (all 6 steps)
5. Check modals (create/edit requirements, create/edit tests, signature)
6. Check the dashboard (all 7 sub-tabs)
7. Verify no English fallback text appears unexpectedly

---

## 6. Adding a New AI Prompt

### Prompt Template Pattern

All prompts follow a consistent pattern in `src/ai/prompts/`:

```typescript
// 1. Import the AI client and relevant types
import { complete } from '../client';
import type { SomeType } from '../../types';

// 2. Define the context interface (inputs)
export interface MyPromptContext {
  requirement: { id: string; title: string; description: string };
  country: string;
  vertical?: string;
  // ... additional context fields
}

// 3. Build the prompt string
export function buildMyPrompt(ctx: MyPromptContext): string {
  return `You are a quality assurance expert specializing in ${ctx.vertical || 'general'} for the ${ctx.country} market.

## Context
${ctx.requirement.title}: ${ctx.requirement.description}

## Instructions
Analyze the above and provide...

Respond ONLY with a JSON object:
{
  "field1": "...",
  "field2": 0.0-1.0
}`;
}

// 4. Main function: call complete() and parse the response
export async function myPromptFunction(ctx: MyPromptContext): Promise<MyResultType> {
  const prompt = buildMyPrompt(ctx);
  const response = await complete({
    prompt,
    purpose: 'my_purpose',  // Must be a valid LLMPurpose
  });

  // Parse JSON response
  const parsed = JSON.parse(response.text);
  return {
    ...parsed,
    generatedBy: response.model,
    providerId: response.providerId,
  };
}
```

### How to Create a New Prompt

1. Create a new file in `src/ai/prompts/` (e.g., `myFeature.ts`)
2. Define the context interface with all inputs the prompt needs
3. Write the prompt builder function with clear sections:
   - Role definition (who the AI is)
   - Context (relevant data from the project)
   - Instructions (what to generate)
   - Output format specification (JSON schema or markdown)
4. Implement the main function that calls `complete()` with the appropriate `purpose`
5. Parse the response (JSON for structured data, text for narratives)

### How to Add a New LLMPurpose

1. In `src/types/index.ts`, add to the `LLMPurpose` union type:

```typescript
export type LLMPurpose =
  | 'all'
  | 'test_generation'
  | 'gap_analysis'
  | 'risk_classification'
  | 'report_narrative'
  | 'requirement_decomp'
  | 'capa'
  | 'my_new_purpose';  // Add here
```

2. In `src/components/ai/ProviderSettings.tsx`, add to `ALL_PURPOSES` and `PURPOSE_LABELS`:

```typescript
const ALL_PURPOSES: LLMPurpose[] = [
  'all', 'test_generation', /* ... */ 'my_new_purpose',
];

const PURPOSE_LABELS: Record<LLMPurpose, string> = {
  // ...
  my_new_purpose: 'My New Feature',
};
```

### Response Parsing Best Practices

- Always specify the expected output format in the prompt (e.g., "Respond ONLY with a JSON array")
- Handle markdown code fences in JSON responses: strip `` ```json `` and `` ``` `` wrappers before parsing
- Validate parsed data structure before using it
- Include `confidence` scores (0.0-1.0) in structured outputs for quality indication
- Attach `generatedBy` (model name) and `providerId` for traceability
- Wrap `JSON.parse()` in try/catch and surface errors to the UI

---

## 7. Adding AI Validators

### Overview

AI response validation (`src/ai/validation.ts`) ensures that LLM outputs conform to expected schemas before being used in the application.

### How to Add a Validator for a New Prompt

1. Define a JSON schema for the expected response:

```typescript
const myResponseSchema = {
  type: 'object',
  required: ['field1', 'field2', 'confidence'],
  properties: {
    field1: { type: 'string' },
    field2: { type: 'number', minimum: 0, maximum: 100 },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
  },
};
```

2. Use `safeParse()` in your prompt function:

```typescript
import { safeParse, ValidationError } from '../validation';

export async function myPromptFunction(ctx: MyContext): Promise<MyResult> {
  const prompt = buildMyPrompt(ctx);
  const response = await complete({ prompt, purpose: 'my_purpose' });

  const parsed = safeParse(response.text, myResponseSchema);
  return { ...parsed, generatedBy: response.model };
}
```

3. The `safeParse` function:
   - Strips markdown code fences (`` ```json `` / `` ``` ``)
   - Calls `JSON.parse()`
   - Validates against the schema
   - Throws `ValidationError` with detailed violations on failure

### Retry Logic

The validation layer supports automatic retry when validation fails. Configure retry behavior:

```typescript
import { completeWithValidation } from '../validation';

const result = await completeWithValidation({
  prompt,
  purpose: 'my_purpose',
  schema: myResponseSchema,
  maxRetries: 3,  // Default: 2
});
```

On validation failure, the system retries with an amended prompt that includes the validation errors, guiding the LLM toward a correct response.

---

## 8. Writing Connectors

### Overview

The connector framework (`src/connectors/types.ts`) allows integration with external systems. Each connector implements the `Connector` interface.

### Step-by-Step

#### 1. Create a connector implementation

```typescript
// src/connectors/jira.ts
import type { Connector, ConnectorConfig, SyncRecord } from './types';

export class JiraConnector implements Connector {
  id = 'jira-connector';
  type = 'jira' as const;
  name = 'Jira';

  private config: ConnectorConfig | null = null;

  async connect(config: ConnectorConfig): Promise<boolean> {
    this.config = config;
    // Validate credentials, establish connection
    return true;
  }

  async disconnect(): Promise<void> {
    this.config = null;
  }

  async sync(direction: SyncRecord['direction']): Promise<SyncRecord> {
    // Implement sync logic: fetch from Jira API, map fields, create/update records
    return { /* SyncRecord */ } as SyncRecord;
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    // Send a lightweight API call to verify connectivity
    return { ok: true, message: 'Connected to Jira' };
  }
}
```

#### 2. Register the connector

```typescript
import { connectorRegistry } from './types';
import { JiraConnector } from './jira';

connectorRegistry.registerConnector(new JiraConnector());
```

#### 3. Add field mappings

Field mappings define how QAtrial fields correspond to external system fields:

```typescript
const mappings: FieldMapping[] = [
  { sourceField: 'title', targetField: 'summary' },
  { sourceField: 'description', targetField: 'description' },
  { sourceField: 'status', targetField: 'status', transform: 'statusMap' },
  { sourceField: 'riskLevel', targetField: 'priority', transform: 'riskToPriority' },
];
```

#### 4. Add ConnectorType

If adding a new connector type, add it to the `ConnectorType` union in `src/connectors/types.ts`.

### Connector State

Connector configurations and sync records are managed by `useConnectorStore`. The store handles:
- Adding/updating/removing connector configurations
- Recording sync history
- Tracking sync status (pending, in_progress, completed, failed)

---

## 9. Creating New Stores

### Zustand Store Pattern

All QAtrial stores follow the same pattern with localStorage persistence:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  items: MyItem[];
  addItem: (item: Omit<MyItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, data: Partial<MyItem>) => void;
  deleteItem: (id: string) => void;
  getById: (id: string) => MyItem | undefined;
}

export const useMyStore = create<MyState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data) => set((state) => ({
        items: [...state.items, {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }],
      })),

      updateItem: (id, data) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
        ),
      })),

      deleteItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      getById: (id) => get().items.find((item) => item.id === id),
    }),
    { name: 'qatrial:my-store' }
  )
);
```

### Naming Conventions

- Store file: `src/store/useMyStore.ts`
- Export name: `useMyStore`
- Persistence key: `qatrial:my-store` (kebab-case)
- State interface: `MyState`

### Checklist for New Stores

1. Define the state interface with all fields and actions
2. Use `persist` middleware with a `qatrial:` prefixed key
3. Use `crypto.randomUUID()` for IDs or the `generateId()` utility for sequential IDs
4. Add ISO 8601 timestamps for `createdAt` and `updatedAt`
5. Implement audit trail logging for CRUD operations using `useAuditStore`
6. Add the store to the Architecture documentation (store table)
7. Add the localStorage key to the User Guide (data persistence table)
8. Write tests in `src/store/__tests__/useMyStore.test.ts`

---

## 10. Adding a New Dashboard View

### Component Pattern

Dashboard sub-tabs follow a consistent pattern:

```typescript
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';

export function MyDashboardView() {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  const metrics = useMemo(() => {
    // Compute metrics from requirements and tests
    return { /* ... */ };
  }, [requirements, tests]);

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary">
          {t('dashboard.myViewTitle')}
        </h3>
        {/* Content */}
      </div>
    </div>
  );
}
```

### How to Add a Tab in EvaluationDashboard

1. Create your component in `src/components/dashboard/`
2. Import it in `EvaluationDashboard.tsx`
3. Add to the `DashboardTab` type union:

```typescript
type DashboardTab = 'overview' | 'compliance' | 'risk' | 'evidence' | 'capa' | 'trends' | 'portfolio' | 'my_view';
```

4. Add to the `tabs` array:

```typescript
const tabs: { id: DashboardTab; labelKey: string }[] = [
  // ... existing tabs
  { id: 'my_view', labelKey: 'dashboard.tabMyView' },
];
```

5. Add the rendering condition:

```typescript
{activeTab === 'my_view' && <MyDashboardView />}
```

6. Add the translation key:

```json
"dashboard": {
  "tabMyView": "My View"
}
```

### Using Stores and Hooks

- Use `useRequirementsStore` and `useTestsStore` for raw data
- Use `useProjectStore` for project metadata (country, vertical, etc.)
- Use `useLLMStore` for AI availability checks (`hasAnyProvider()`)
- Wrap expensive computations in `useMemo` with appropriate dependencies
- Use the `useEvaluationData` hook for common metrics (coverage, status counts)

---

## 11. Adding a New Report Type

### Report Section Structure

Reports are composed of sections:

```typescript
interface ReportSection {
  title: string;         // Section heading
  content: string;       // Markdown or plain text content
  aiGenerated: boolean;  // Whether this section was AI-generated
  reviewedBy?: string;   // Who reviewed the section
  approvedBy?: string;   // Who approved the section
}
```

### Steps to Add a New Report Type

#### 1. Add to ReportType union

In `src/types/index.ts`:

```typescript
export type ReportType =
  | 'validation_summary'
  | 'traceability_matrix'
  | 'gap_analysis'
  | 'risk_assessment'
  | 'executive_brief'
  | 'submission_package'
  | 'my_new_report';  // Add here
```

#### 2. Add to ReportGenerator

In `src/components/reports/ReportGenerator.tsx`, add a card to `REPORT_TYPES`:

```typescript
{
  type: 'my_new_report',
  labelKey: 'reports.myNewReport',
  description: 'Description of what this report contains.',
  icon: <FileText className="w-6 h-6" />,
},
```

#### 3. Add the generation logic

In the `handleGenerate` switch statement:

```typescript
case 'my_new_report': {
  // Option A: Data-assembled (no AI)
  sections = [
    {
      title: 'My Report Section',
      content: buildReportContent(requirements, tests),
      aiGenerated: false,
    },
  ];
  break;
}
```

Or for AI-generated content:

```typescript
case 'my_new_report': {
  // Option B: AI-generated
  const narrative = await generateMyReport(project, requirements, tests);
  sections = [
    {
      title: 'AI Analysis',
      content: narrative,
      aiGenerated: true,
    },
  ];
  break;
}
```

#### 4. Add translation keys

```json
"reports": {
  "myNewReport": "My New Report"
}
```

### AI Narrative Generation

For AI-generated report sections, create a prompt in `src/ai/prompts/`:

```typescript
export async function generateMyReport(
  project: ProjectMeta,
  requirements: Requirement[],
  tests: Test[]
): Promise<string> {
  const prompt = `Generate a professional ${project.name} report...`;
  const response = await complete({ prompt, purpose: 'report_narrative' });
  return response.text;
}
```

### Data Assembly Patterns

For data-driven (non-AI) report sections, common patterns include:

```typescript
// Markdown table
const rows = requirements.map(r =>
  `| ${r.id} | ${r.title} | ${r.status} |`
);
const table = `| ID | Title | Status |\n|---|---|---|\n${rows.join('\n')}`;

// Summary statistics
const summary = `Total: ${requirements.length}\n` +
  `Active: ${requirements.filter(r => r.status === 'Active').length}\n`;
```

---

## 12. Code Conventions

### TypeScript Patterns

- **Strict mode:** TypeScript strict mode is enabled
- **Type imports:** Use `import type { ... }` for type-only imports
- **Union types for enums:** Prefer string union types over TypeScript enums (e.g., `type Status = 'Draft' | 'Active' | 'Closed'`)
- **Optional fields:** Use `?` for optional properties rather than `| undefined`
- **Zustand selectors:** Always use selector functions for store access: `useStore((s) => s.field)`
- **Explicit return types:** Functions with complex return types should have explicit annotations

### Component Naming

- **PascalCase** for component names: `RequirementsTable`, `GapAnalysisView`
- **Suffix patterns:**
  - `*Table` for TanStack Table components
  - `*Modal` for modal dialogs
  - `*Panel` for side panels or overlays
  - `*View` for dashboard views
  - `*Card` for card-style widgets
  - `*Chart` for chart components
  - `*Bar` for toolbar components
- One component per file, filename matches component name

### i18n Key Conventions

- **Dot notation:** `group.subgroup.key`
- **Lowercase keys:** `dashboard.tabOverview`, not `Dashboard.TabOverview`
- **Descriptive keys:** `requirements.addRequirement`, not `req.add`
- **Interpolation:** Use `{{variable}}` syntax: `"Step {{step}} of {{total}}"`
- **Pluralization:** Use `_one`/`_other` suffixes when needed

### CSS/Tailwind Patterns

- Use **semantic token classes** instead of color values: `bg-surface` not `bg-white`
- Common token classes:
  - Surfaces: `bg-surface`, `bg-surface-secondary`, `bg-surface-elevated`, `bg-surface-tertiary`
  - Text: `text-text-primary`, `text-text-secondary`, `text-text-tertiary`
  - Borders: `border-border`, `border-border-subtle`
  - Accent: `bg-accent`, `text-accent`, `bg-accent-subtle`
  - Feedback: `text-success`, `text-warning`, `text-danger`
- Use `transition-colors` for smooth theme transitions
- Use `rounded-xl` for cards, `rounded-lg` for buttons and inputs
- Use `shadow-sm` for elevated cards, `shadow-2xl` for modals

---

## 13. Test Infrastructure

### Framework

QAtrial v2.0.0 uses **Vitest** with **React Testing Library** and **jsdom** for automated testing.

### Configuration

Test configuration is in `vitest.config.ts` at the project root:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### Writing Tests

#### Store Tests

Test files go in `__tests__` directories next to the source:

```typescript
// src/store/__tests__/useAuthStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useAuthStore.setState({ user: null });
  });

  it('should register a new user', () => {
    const { register } = useAuthStore.getState();
    register('Test User', 'test@example.com', 'password', 'qa_engineer');
    const { user } = useAuthStore.getState();
    expect(user).not.toBeNull();
    expect(user?.name).toBe('Test User');
    expect(user?.role).toBe('qa_engineer');
  });
});
```

#### Component Tests

```typescript
// src/components/requirements/__tests__/RequirementsTable.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequirementsTable } from '../RequirementsTable';

describe('RequirementsTable', () => {
  it('should render the requirements table', () => {
    render(<RequirementsTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
npm run test              # Run all tests once
npm run test:watch        # Watch mode (re-run on file changes)
npm run test:coverage     # Generate coverage report
```

### Test File Naming

- Store tests: `src/store/__tests__/useMyStore.test.ts`
- Component tests: `src/components/feature/__tests__/MyComponent.test.tsx`
- Utility tests: `src/lib/__tests__/myUtil.test.ts`
- AI tests: `src/ai/__tests__/validation.test.ts`

---

## 14. Testing Checklist

### Manual Testing Workflow

In addition to automated tests, use this manual checklist when making changes:

### Authentication and RBAC

- [ ] **Registration:** Register a new user with each role. Verify role is saved.
- [ ] **Login/Logout:** Log in and out. Verify audit trail entries for login/logout.
- [ ] **Permissions:** Verify each role's permissions (e.g., auditor cannot edit requirements).
- [ ] **Signature Re-auth:** Apply a signature, verify password prompt. Apply another within 15 minutes, verify no prompt.

### Core Functionality

- [ ] **New Project Wizard:** Complete all 6 steps. Verify requirements and tests are created correctly.
- [ ] **Load Demo:** Load at least 2 different country demos. Verify all fields are populated.
- [ ] **Requirements CRUD:** Create, edit, delete a requirement. Verify audit trail entries with real user identity.
- [ ] **Tests CRUD:** Create, edit, delete a test. Verify linked requirements are preserved.
- [ ] **Linking:** Link and unlink tests to requirements. Verify the traceability matrix updates.
- [ ] **Referential Integrity:** Delete a requirement linked to a test. Verify the link is removed from the test.
- [ ] **Auto-logging:** Verify all CRUD operations produce audit entries automatically.

### Dashboard

- [ ] **Overview tab:** Verify coverage metric, status charts, traceability matrix, orphaned items.
- [ ] **Compliance tab:** Verify readiness score calculation. Run gap analysis (requires LLM provider).
- [ ] **Risk tab:** Verify risk matrix displays correctly. Click cells to view requirements.
- [ ] **Evidence tab:** Verify evidence completeness tracking.
- [ ] **CAPA tab:** Verify failed tests appear. Run CAPA suggestion (requires LLM provider).
- [ ] **Trends tab:** Verify charts render with current data.

### AI Features

- [ ] **Provider Config:** Add a provider, test connection, verify purpose routing table.
- [ ] **Test Generation:** Generate tests for a requirement. Accept/reject individual tests.
- [ ] **Risk Classification:** Classify a requirement. Accept the result and verify it saves.
- [ ] **Gap Analysis:** Run gap analysis. Verify results table and critical gaps.

### Compliance

- [ ] **Electronic Signature:** Sign a requirement. Verify all meanings work.
- [ ] **Audit Trail:** Open audit trail. Filter by date. Export as CSV.
- [ ] **Change Control:** Verify strict verticals (pharma, medical_devices, biotech) get full change control config.

### Evidence and CAPA

- [ ] **Evidence Attachments:** Add evidence to a requirement. Verify completeness tracking updates.
- [ ] **CAPA Lifecycle:** Create a CAPA record and advance through all lifecycle stages.
- [ ] **PDF Export:** Generate a report and export as PDF. Verify cover page, TOC, and signatures.

### Connectors

- [ ] **Add Connector:** Configure a connector. Test connection. Verify configuration is saved.
- [ ] **Sync:** Run a sync operation. Verify sync records are created.

### Data Management

- [ ] **Export:** Export project data. Verify JSON structure.
- [ ] **Import:** Import a previously exported file. Verify all data loads correctly.
- [ ] **Theme:** Toggle between light and dark mode. Verify all components render correctly.
- [ ] **Language:** Switch to at least 2 non-English languages. Verify no missing translations in core views.

### Automated Tests

- [ ] **Run Tests:** `npm run test` passes with no failures.
- [ ] **New Store Tests:** Any new store has corresponding tests in `__tests__/`.
- [ ] **AI Validation Tests:** Validation schemas are tested for edge cases.

### Key Verification Points

1. **ID Generation:** IDs should be sequential (REQ-001, REQ-002, ...). After import, the counter should continue from the highest ID.
2. **localStorage Persistence:** Refresh the page after creating data. All state should survive.
3. **Cross-Store Consistency:** After deleting a requirement, verify no test still references it.
4. **Template Deduplication:** When loading a project with overlapping templates, verify no duplicate requirements appear.
5. **Readiness Score Math:** Manually verify the weighted calculation: `(reqCoverage * 0.25) + (testCoverage * 0.25) + (passRate * 0.20) + (riskAssessed * 0.15) + (signatures * 0.15) - criticalPenalty`.
