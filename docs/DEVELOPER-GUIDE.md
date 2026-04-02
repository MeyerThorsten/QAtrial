# QAtrial Developer Guide

Guide for developers extending and customizing QAtrial.

---

## Table of Contents

1. [Development Setup](#1-development-setup)
2. [Backend Development](#2-backend-development)
3. [Database Changes](#3-database-changes)
4. [API Testing](#4-api-testing)
5. [Adding a New Country](#5-adding-a-new-country)
6. [Adding a New Vertical](#6-adding-a-new-vertical)
7. [Adding a New Module](#7-adding-a-new-module)
8. [Adding a New Language](#8-adding-a-new-language)
9. [Adding a New AI Prompt](#9-adding-a-new-ai-prompt)
10. [Adding AI Validators](#10-adding-ai-validators)
11. [Writing Connectors](#11-writing-connectors)
12. [Creating New Stores](#12-creating-new-stores)
13. [Adding a New Dashboard View](#13-adding-a-new-dashboard-view)
14. [Adding a New Report Type](#14-adding-a-new-report-type)
15. [Code Conventions](#15-code-conventions)
16. [Test Infrastructure](#16-test-infrastructure)
17. [Testing Checklist](#17-testing-checklist)

---

## 1. Development Setup

### Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later
- **PostgreSQL** 14.0 or later (required for backend development)
- A modern browser (Chrome, Firefox, Safari, or Edge)
- A code editor with TypeScript support (VS Code recommended)

### Clone, Install, Run (Frontend Only)

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement (HMR). In this mode, all data is stored in `localStorage`.

### Full Stack Setup (Frontend + Backend)

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install

# 1. Install and start PostgreSQL
#    macOS: brew install postgresql && brew services start postgresql
#    Linux: sudo apt install postgresql && sudo systemctl start postgresql
#    Docker: docker run -p 5432:5432 -e POSTGRES_DB=qatrial -e POSTGRES_PASSWORD=postgres postgres:16

# 2. Create the database (skip if using Docker with POSTGRES_DB)
createdb qatrial

# 3. Set environment variables
export DATABASE_URL="postgresql://localhost:5432/qatrial"
export JWT_SECRET="dev-secret-change-in-production"

# 4. Generate the Prisma client
npm run db:generate

# 5. Push the schema to the database
npm run db:push

# 6. Start the backend server (terminal 1)
npm run server:dev

# 7. Start the frontend dev server (terminal 2)
npm run dev
```

The backend runs at `http://localhost:3001` with auto-reload on file changes. The frontend connects to it via the `VITE_API_URL` environment variable (defaults to `http://localhost:3001/api`).

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://localhost:5432/qatrial` | PostgreSQL connection string |
| `JWT_SECRET` | `qatrial-dev-secret-change-in-production` | Secret for signing JWT tokens |
| `VITE_API_URL` | `http://localhost:3001/api` | API base URL for the frontend |
| `VITE_AI_PROXY_URL` | (none) | Optional AI proxy endpoint |

### Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on source files |
| `npm run test` | Run all tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run server` | Start backend server (tsx server/index.ts) |
| `npm run server:dev` | Start backend with file watching (tsx watch server/index.ts) |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Run Prisma database migrations |
| `npm run db:push` | Push schema directly to database (no migration files) |
| `npm run db:studio` | Open Prisma Studio GUI for database browsing |

### Dev Server Configuration

Vite is configured in `vite.config.ts`. Key settings:
- **React plugin** for JSX transform and Fast Refresh
- **Path aliases** may be configured for cleaner imports
- **Public directory** serves `public/locales/` for i18n files

---

## 2. Backend Development

### Architecture Overview

The backend is a Hono server in `server/index.ts` with:
- 8 route groups mounted under `/api/`
- JWT authentication middleware
- RBAC role guards
- Prisma ORM for database access
- Audit logging service

### How to Add a New API Route

1. Create a new route file in `server/routes/`:

```typescript
// server/routes/myEntity.ts
import { Hono } from 'hono';
import { prisma } from '../index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const myEntity = new Hono();

// Apply auth middleware to all endpoints
myEntity.use('*', authMiddleware);

// List
myEntity.get('/', async (c) => {
  try {
    const projectId = c.req.query('projectId');
    if (!projectId) {
      return c.json({ message: 'projectId query parameter is required' }, 400);
    }
    const items = await prisma.myModel.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
    return c.json({ items });
  } catch (error: any) {
    console.error('List myEntity error:', error);
    return c.json({ message: 'Failed to list items' }, 500);
  }
});

// Create
myEntity.post('/', async (c) => {
  try {
    const user = getUser(c);
    const body = await c.req.json();
    if (!body.projectId || !body.title) {
      return c.json({ message: 'projectId and title are required' }, 400);
    }
    const item = await prisma.myModel.create({ data: { ... } });
    await logAudit(prisma, {
      projectId: body.projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'myEntity',
      entityId: item.id,
      newValue: item,
    });
    return c.json({ item }, 201);
  } catch (error: any) {
    console.error('Create myEntity error:', error);
    return c.json({ message: 'Failed to create item' }, 500);
  }
});

export default myEntity;
```

2. Mount the route in `server/index.ts`:

```typescript
import myEntityRoutes from './routes/myEntity.js';
app.route('/api/my-entity', myEntityRoutes);
```

### Middleware Pattern

**Authentication (required for most routes):**
```typescript
import { authMiddleware, getUser, requireRole } from '../middleware/auth.js';

router.use('*', authMiddleware);  // All endpoints need auth

// For admin-only endpoints:
router.post('/admin-action', requireRole('admin'), async (c) => {
  const user = getUser(c);  // Get user from JWT
  // ...
});
```

**Getting the authenticated user:**
```typescript
const user = getUser(c);
// user.userId   -- UUID
// user.email    -- Email address
// user.role     -- "admin" | "editor" | "viewer"
// user.orgId    -- Organization UUID
```

### Audit Logging Pattern

Every mutation (create, update, delete) should log an audit entry:

```typescript
import { logAudit } from '../services/audit.service.js';

// After a successful create:
await logAudit(prisma, {
  projectId: item.projectId,
  userId: user.userId,
  action: 'create',
  entityType: 'requirement',
  entityId: item.id,
  newValue: item,
});

// After a successful update:
await logAudit(prisma, {
  projectId: item.projectId,
  userId: user.userId,
  action: 'update',
  entityType: 'requirement',
  entityId: item.id,
  previousValue: previousItem,
  newValue: updatedItem,
});

// After a successful delete:
await logAudit(prisma, {
  projectId: item.projectId,
  userId: user.userId,
  action: 'delete',
  entityType: 'requirement',
  entityId: item.id,
  previousValue: deletedItem,
});
```

---

## 3. Database Changes

### Modifying the Prisma Schema

The schema lives at `server/prisma/schema.prisma`. To add or modify a model:

1. Edit `server/prisma/schema.prisma`:

```prisma
model MyNewModel {
  id        String   @id @default(uuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  title     String
  status    String   @default("draft")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. If adding a relation to Project, also add the back-reference in the Project model:

```prisma
model Project {
  // ... existing fields ...
  myNewModels MyNewModel[]
}
```

3. Regenerate the Prisma client:

```bash
npm run db:generate
```

4. Push the schema to the database (development):

```bash
npm run db:push
```

5. For production migrations (creates migration files):

```bash
npm run db:migrate
```

### Key Schema Conventions

- All IDs are UUIDs: `@id @default(uuid())`
- All project-scoped models have `projectId` with `onDelete: Cascade`
- Use `@default(now())` for `createdAt`
- Use `@updatedAt` for `updatedAt`
- Array fields use PostgreSQL arrays: `String[] @default([])`
- JSON fields use `Json?` type (for audit previousValue/newValue)

### Using Prisma Studio

```bash
npm run db:studio
```

This opens a web UI at `http://localhost:5555` where you can browse and edit database records directly. Useful for debugging and data inspection during development.

---

## 4. API Testing

### Testing with curl

**Register a new user:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"password123","name":"Dev User"}'
```

Response:
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": { "id": "...", "email": "dev@example.com", "name": "Dev User", "role": "admin" }
}
```

**Login:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"password123"}'
```

**Save the access token:**

```bash
export TOKEN="eyJhbGci..."
```

**Create a project:**

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Project","description":"A test project","country":"US","vertical":"pharma","type":"software"}'
```

**Create a requirement:**

```bash
curl -X POST http://localhost:3001/api/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"projectId":"<project-id>","title":"Data Integrity","description":"System shall ensure ALCOA+ data integrity"}'
```

**List requirements for a project:**

```bash
curl http://localhost:3001/api/requirements?projectId=<project-id> \
  -H "Authorization: Bearer $TOKEN"
```

**Check server health:**

```bash
curl http://localhost:3001/api/health
# => {"status":"ok","version":"3.0.0"}
```

**Get current user:**

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Refresh an expired token:**

```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGci..."}'
```

**Export audit trail as CSV:**

```bash
curl "http://localhost:3001/api/audit/export?format=csv&projectId=<project-id>" \
  -H "Authorization: Bearer $TOKEN" \
  -o audit-trail.csv
```

---

## 5. Adding a New Country

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

If the country is in the EU/EFTA, add its code to the `euCountries` array in `src/templates/composer.ts`.

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
- **Include a `templateId`**: A stable identifier for deduplication across locales (e.g., `"br-anvisa-rdc658-compliance"`)
- **Include a `source`**: Origin of the template (e.g., `"br/base"`, `"br/overlays/pharma"`)
- Use `regulatoryRef` to cite the exact regulatory clause
- Assign `riskLevel` based on the criticality to the regulatory framework
- Use descriptive, lowercase, hyphenated `tags` for linking (e.g., `"data-integrity"`, `"anvisa-compliance"`)
- Tests should reference specific standards in their descriptions
- Use `linkedReqTags` to establish test-to-requirement relationships

---

## 6. Adding a New Vertical

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
  ],
  tests: [
    {
      title: 'Verify HACCP Critical Control Points',
      description: 'Confirm all critical control points are identified and monitored...',
      category: 'Regulatory',
      tags: ['haccp', 'ccp'],
      linkedReqTags: ['haccp', 'hazard-analysis'],
    },
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
  icon: 'UtensilsCrossed',
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

In `src/types/index.ts`, add the new vertical to the union type.

#### 5. Add to country registry entries

Update the `availableVerticals` arrays in `COUNTRY_REGISTRY` for countries where this vertical applies.

#### 6. Add translation keys

```json
"verticals": {
  "food_safety": {
    "name": "Food Safety",
    "focus": "HACCP, ISO 22000, FSSC 22000"
  }
}
```

---

## 7. Adding a New Module

### Step-by-Step

#### 1. Add to MODULE_DEFINITIONS in registry.ts

In `src/templates/registry.ts`, add a new entry to the `MODULE_DEFINITIONS` array:

```typescript
{
  id: 'environmental_monitoring',
  nameKey: 'modules.environmental_monitoring.name',
  descKey: 'modules.environmental_monitoring.desc',
  icon: 'Thermometer',
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

### Tag Conventions for Linking

Tags follow these conventions:
- Lowercase with hyphens: `"env-monitoring"`, `"data-integrity"`
- Module-specific prefix: `"audit-trail-*"`, `"e-signature-*"`
- Share tags between requirements and tests for automatic linking

---

## 8. Adding a New Language

### Create Locale JSON File

1. Copy `public/locales/en/common.json` to `public/locales/{code}/common.json`
2. Translate all values (keys remain in English)
3. The file will be automatically loaded by `i18next-http-backend`

### Add to LanguageSelector

Update the `LanguageSelector` component in `src/components/shared/LanguageSelector.tsx` to include the new language option.

### Translation Key Reference

The English locale file contains approximately 440 keys organized into groups: `app.*`, `nav.*`, `wizard.*`, `common.*`, `requirements.*`, `tests.*`, `dashboard.*`, `risk.*`, `ai.*`, `reports.*`, `audit.*`, `signature.*`, `statuses.*`, `countries.*`, `verticals.*`, `modules.*`, `projectTypes.*`.

---

## 9. Adding a New AI Prompt

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
    purpose: 'my_purpose',
  });
  const parsed = JSON.parse(response.text);
  return {
    ...parsed,
    generatedBy: response.model,
    providerId: response.providerId,
  };
}
```

### How to Add a New LLMPurpose

1. In `src/types/index.ts`, add to the `LLMPurpose` union type
2. In `src/components/ai/ProviderSettings.tsx`, add to `ALL_PURPOSES` and `PURPOSE_LABELS`

---

## 10. Adding AI Validators

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

### Retry Logic

The validation layer supports automatic retry when validation fails:

```typescript
import { completeWithValidation } from '../validation';

const result = await completeWithValidation({
  prompt,
  purpose: 'my_purpose',
  schema: myResponseSchema,
  maxRetries: 3,
});
```

---

## 11. Writing Connectors

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
    return true;
  }

  async disconnect(): Promise<void> {
    this.config = null;
  }

  async sync(direction: SyncRecord['direction']): Promise<SyncRecord> {
    return { /* SyncRecord */ } as SyncRecord;
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
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

---

## 12. Creating New Stores

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

### Checklist for New Stores

1. Define the state interface with all fields and actions
2. Use `persist` middleware with a `qatrial:` prefixed key
3. Use `crypto.randomUUID()` for IDs or the `generateId()` utility for sequential IDs
4. Add ISO 8601 timestamps for `createdAt` and `updatedAt`
5. Implement audit trail logging for CRUD operations using `useAuditStore`
6. Add the store to the Architecture documentation (store table)
7. Add the localStorage key to the User Guide (data persistence table)
8. Write tests in `src/store/__tests__/useMyStore.test.ts`
9. Consider whether this store's data should also have a backend API route

---

## 13. Adding a New Dashboard View

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
    return { /* computed metrics */ };
  }, [requirements, tests]);

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary">
          {t('dashboard.myViewTitle')}
        </h3>
      </div>
    </div>
  );
}
```

### How to Add a Tab in EvaluationDashboard

1. Create your component in `src/components/dashboard/`
2. Import it in `EvaluationDashboard.tsx`
3. Add to the `DashboardTab` type union
4. Add to the `tabs` array
5. Add the rendering condition
6. Add the translation key

---

## 14. Adding a New Report Type

### Steps to Add a New Report Type

1. Add to `ReportType` union in `src/types/index.ts`
2. Add a card to `REPORT_TYPES` in `ReportGenerator.tsx`
3. Add the generation logic in the `handleGenerate` switch statement
4. Add translation keys

---

## 15. Code Conventions

### TypeScript Patterns

- **Strict mode:** TypeScript strict mode is enabled
- **Type imports:** Use `import type { ... }` for type-only imports
- **Union types for enums:** Prefer string union types over TypeScript enums
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
- **Interpolation:** Use `{{variable}}` syntax
- **Pluralization:** Use `_one`/`_other` suffixes when needed

### CSS/Tailwind Patterns

- Use **semantic token classes** instead of color values: `bg-surface` not `bg-white`
- Common token classes:
  - Surfaces: `bg-surface`, `bg-surface-secondary`, `bg-surface-elevated`, `bg-surface-tertiary`
  - Text: `text-text-primary`, `text-text-secondary`, `text-text-tertiary`
  - Borders: `border-border`, `border-border-subtle`
  - Accent: `bg-accent`, `text-accent`, `bg-accent-subtle`
  - Feedback: `text-success`, `text-warning`, `text-danger`

---

## 16. Test Infrastructure

### Framework

QAtrial uses **Vitest** with **React Testing Library** and **jsdom** for automated testing.

### Writing Tests

#### Store Tests

```typescript
// src/store/__tests__/useAuthStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('should register a new user', () => {
    const { register } = useAuthStore.getState();
    register('Test User', 'test@example.com', 'password', 'qa_engineer');
    const { user } = useAuthStore.getState();
    expect(user).not.toBeNull();
    expect(user?.name).toBe('Test User');
  });
});
```

### Running Tests

```bash
npm run test              # Run all tests once
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
```

### Test File Naming

- Store tests: `src/store/__tests__/useMyStore.test.ts`
- Component tests: `src/components/feature/__tests__/MyComponent.test.tsx`
- Utility tests: `src/lib/__tests__/myUtil.test.ts`
- AI tests: `src/ai/__tests__/validation.test.ts`

---

## 17. Testing Checklist

### Manual Testing Workflow

### Authentication and RBAC

- [ ] **Registration (API mode):** Register a new user. Verify org + workspace created. Verify admin role.
- [ ] **Registration (localStorage mode):** Register with each role. Verify role is saved.
- [ ] **Login/Logout:** Log in and out. Verify audit trail entries for login/logout.
- [ ] **JWT Tokens:** Verify access token is stored in localStorage. Verify token is sent in API requests.
- [ ] **Token Refresh:** Wait for token expiry (or shorten JWT_SECRET duration). Verify refresh works.
- [ ] **Permissions (API mode):** Verify viewer cannot create records. Verify editor cannot manage users.
- [ ] **Permissions (localStorage mode):** Verify each role's permissions (e.g., auditor cannot edit requirements).
- [ ] **Signature Re-auth:** Apply a signature, verify password prompt. Apply another within 15 minutes, verify no prompt.

### Backend API

- [ ] **Health Check:** `curl http://localhost:3001/api/health` returns 200.
- [ ] **CRUD Operations:** Create, read, update, delete requirements via API. Verify responses.
- [ ] **Auto SeqId:** Create multiple requirements. Verify sequential IDs (REQ-001, REQ-002).
- [ ] **Audit Logging:** After mutations, verify audit entries via `GET /api/audit`.
- [ ] **CSV Export:** Verify `GET /api/audit/export?format=csv` returns valid CSV.
- [ ] **CAPA Transitions:** Verify status transitions are enforced. Attempt invalid transition and verify 400 error.
- [ ] **Risk Auto-Scoring:** Create a risk. Verify riskScore and riskLevel are computed correctly.

### Core Functionality

- [ ] **New Project Wizard:** Complete all 6 steps. Verify requirements and tests are created correctly.
- [ ] **Load Demo:** Load at least 2 different country demos. Verify all fields are populated.
- [ ] **Requirements CRUD:** Create, edit, delete a requirement. Verify audit trail entries with real user identity.
- [ ] **Tests CRUD:** Create, edit, delete a test. Verify linked requirements are preserved.
- [ ] **Referential Integrity:** Delete a requirement linked to a test. Verify the link is removed from the test.

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
- [ ] **Change Control:** Verify strict verticals get full change control config.

### Data Management

- [ ] **Export:** Export project data. Verify JSON structure.
- [ ] **Import:** Import a previously exported file. Verify all data loads correctly.
- [ ] **Theme:** Toggle between light and dark mode.
- [ ] **Language:** Switch to at least 2 non-English languages.

### Automated Tests

- [ ] **Run Tests:** `npm run test` passes with no failures.
- [ ] **New Store Tests:** Any new store has corresponding tests in `__tests__/`.
