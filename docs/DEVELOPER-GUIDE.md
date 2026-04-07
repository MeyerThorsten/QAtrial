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
15. [Adding a Webhook Event](#15-adding-a-webhook-event)
16. [Adding an Integration](#16-adding-an-integration)
17. [Docker Development](#17-docker-development)
18. [Code Conventions](#18-code-conventions)
19. [Test Infrastructure](#19-test-infrastructure)
20. [Testing Checklist](#20-testing-checklist)

---

## 1. Development Setup

### Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later
- **PostgreSQL** 14.0 or later (required for backend development)
- **Docker** 20.10 or later (optional, for containerized development)
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

### Docker Setup

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial

# Copy and edit environment file
cp .env.example .env

# Start with Docker Compose
docker-compose up

# Access at http://localhost:3001
```

For development with Docker, you can also run just PostgreSQL in Docker and the app locally:

```bash
# Start only PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_DB=qatrial -e POSTGRES_PASSWORD=qatrial -e POSTGRES_USER=qatrial postgres:16-alpine

# Set DATABASE_URL to Docker PostgreSQL
export DATABASE_URL="postgresql://qatrial:qatrial@localhost:5432/qatrial"

# Run app locally
npm run db:generate && npm run db:push
npm run server:dev  # terminal 1
npm run dev          # terminal 2
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://localhost:5432/qatrial` | PostgreSQL connection string |
| `JWT_SECRET` | `qatrial-dev-secret-change-in-production` | Secret for signing JWT tokens |
| `VITE_API_URL` | `http://localhost:3001/api` | API base URL for the frontend |
| `AI_PROVIDER_TYPE` | (none) | Server-side AI: `anthropic` or `openai` |
| `AI_PROVIDER_URL` | (none) | Server-side AI base URL |
| `AI_PROVIDER_KEY` | (none) | Server-side AI API key |
| `AI_PROVIDER_MODEL` | (none) | Server-side AI model name |
| `SSO_ENABLED` | `false` | Enable OIDC SSO |
| `SSO_ISSUER_URL` | (none) | OIDC issuer URL |
| `SSO_CLIENT_ID` | (none) | OIDC client ID |
| `SSO_CLIENT_SECRET` | (none) | OIDC client secret |
| `SSO_CALLBACK_URL` | `http://localhost:3001/api/auth/sso/callback` | OIDC callback URL |
| `SSO_DEFAULT_ROLE` | `qa_engineer` | Default role for SSO-provisioned users |

See `.env.example` for the full list.

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
- 28+ route groups mounted under `/api/`
- JWT authentication middleware
- RBAC permission guards (`requirePermission()`)
- Prisma ORM for database access (25+ models)
- Audit logging service
- Webhook dispatch service with HMAC signing
- SSO (OIDC) discovery and token exchange
- Static file serving in production mode
- Vertical-depth routes for complaints, suppliers, batches, training, documents, systems, impact, pms, udi, stability, envmon, and auditrecords

### Route Files (28+ files)

| File | Mount Point | Purpose |
|------|------------|---------|
| `auth.ts` | `/api/auth` | Register, login, refresh, me |
| `projects.ts` | `/api/projects` | Project CRUD |
| `requirements.ts` | `/api/requirements` | Requirement CRUD + auto seqId |
| `tests.ts` | `/api/tests` | Test CRUD + auto seqId |
| `capa.ts` | `/api/capa` | CAPA CRUD + lifecycle enforcement + cascade triggers |
| `risks.ts` | `/api/risks` | Risk CRUD + auto scoring |
| `audit.ts` | `/api/audit` | Read-only audit queries + CSV export |
| `users.ts` | `/api/users` | User management (admin) |
| `evidence.ts` | `/api/evidence` | Evidence attachment endpoints |
| `approvals.ts` | `/api/approvals` | Approval workflow endpoints |
| `signatures.ts` | `/api/signatures` | Electronic signature endpoints |
| `export.ts` | `/api/export` | CSV/JSON export |
| `import.ts` | `/api/import` | CSV import (preview, execute) |
| `ai.ts` | `/api/ai` | Server-side AI proxy |
| `sso.ts` | `/api/auth/sso` | OIDC SSO |
| `webhooks.ts` | `/api/webhooks` | Webhook CRUD + test |
| `auditmode.ts` | `/api/audit-mode` | Read-only audit mode links |
| `dashboard.ts` | `/api/dashboard` | Server-side dashboard analytics |
| `complaints.ts` | `/api/complaints` | Complaint management + investigation workflow + trending |
| `suppliers.ts` | `/api/suppliers` | Supplier quality scorecards + audit scheduling |
| `batches.ts` | `/api/batches` | Electronic batch records + step execution + e-signature release |
| `training.ts` | `/api/training` | Training management (plans, courses, records, matrix, compliance) |
| `documents.ts` | `/api/documents` | Document lifecycle management (SOP versioning) |
| `systems.ts` | `/api/systems` | Computerized system inventory + periodic review |
| `impact.ts` | `/api/impact` | Live impact analysis + what-if |
| `pms.ts` | `/api/pms` | Post-market surveillance + PSUR assembly |
| `udi.ts` | `/api/udi` | UDI management + GUDID/EUDAMED export |
| `stability.ts` | `/api/stability` | Stability study manager (ICH Q1A) |
| `envmon.ts` | `/api/envmon` | Environmental monitoring + excursion detection |
| `auditrecords.ts` | `/api/auditrecords` | Audit management + findings tracker |
| `integrations/jira.ts` | `/api/integrations/jira` | Jira Cloud sync |
| `integrations/github.ts` | `/api/integrations/github` | GitHub integration |

Plus `GET /api/health` and `GET /api/status` defined inline in `server/index.ts`.

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
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';

router.use('*', authMiddleware);  // All endpoints need auth

// For permission-restricted endpoints:
router.post('/admin-action', requirePermission('canAdmin'), async (c) => {
  const user = getUser(c);  // Get user from JWT
  // ...
});

// For edit-restricted endpoints:
router.post('/', requirePermission('canEdit'), async (c) => {
  // ...
});
```

**Getting the authenticated user:**
```typescript
const user = getUser(c);
// user.userId   -- UUID
// user.email    -- Email address
// user.role     -- "admin" | "qa_manager" | "qa_engineer" | "auditor" | "reviewer"
// user.orgId    -- Organization UUID
```

**Permission mapping:**

| Permission | Roles |
|------------|-------|
| `canView` | admin, qa_manager, qa_engineer, auditor, reviewer |
| `canEdit` | admin, qa_manager, qa_engineer |
| `canApprove` | admin, qa_manager, reviewer |
| `canAdmin` | admin |

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

The schema lives at `server/prisma/schema.prisma`. Currently has 25+ models. To add or modify a model:

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
- All org-scoped models (Webhook, Integration) have `orgId`
- Use `@default(now())` for `createdAt`
- Use `@updatedAt` for `updatedAt`
- Array fields use PostgreSQL arrays: `String[] @default([])`
- JSON fields use `Json?` type (for audit previousValue/newValue, integration config)

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

**Check server status (public, no auth):**

```bash
curl http://localhost:3001/api/status
# => {"status":"ok","version":"3.0.0","uptime":...,"database":"connected"}
```

**Check server health (public, no auth):**

```bash
curl http://localhost:3001/api/health
# => {"status":"ok","version":"3.0.0"}
```

**Export audit trail as CSV:**

```bash
curl "http://localhost:3001/api/audit/export?format=csv&projectId=<project-id>" \
  -H "Authorization: Bearer $TOKEN" \
  -o audit-trail.csv
```

**Import CSV preview:**

```bash
curl -X POST http://localhost:3001/api/import/preview \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@requirements.csv"
```

**Test a webhook:**

```bash
curl -X POST http://localhost:3001/api/webhooks/<webhook-id>/test \
  -H "Authorization: Bearer $TOKEN"
```

**Generate an audit mode link:**

```bash
curl -X POST http://localhost:3001/api/audit-mode/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"projectId":"<project-id>","expiresIn":"24h"}'
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

The English locale file contains approximately 440 keys organized into groups: `app.*`, `nav.*`, `wizard.*`, `common.*`, `requirements.*`, `tests.*`, `dashboard.*`, `risk.*`, `ai.*`, `reports.*`, `audit.*`, `signature.*`, `statuses.*`, `countries.*`, `verticals.*`, `modules.*`, `projectTypes.*`, `packs.*`, `settings.*`.

---

## 9. Adding a New AI Prompt

### Prompt Template Pattern

All prompts follow a consistent pattern in `src/ai/prompts/`. There are currently 9 prompt templates:

1. `generateTests.ts` -- Test case generation
2. `riskClassification.ts` -- Risk severity/likelihood
3. `gapAnalysis.ts` -- Regulatory gap analysis
4. `executiveBrief.ts` -- Executive compliance brief
5. `capaSuggestion.ts` -- CAPA suggestion
6. `vsrReport.ts` -- Validation Summary Report
7. `qmsrGap.ts` -- QMSR gap analysis
8. `reqExtraction.ts` -- Requirement extraction
9. `qualityCheck.ts` -- Requirement quality check

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

## 15. Adding a Webhook Event

### Step-by-Step

To add a new webhook event (e.g., `myEntity.created`):

#### 1. Define the event name

Add the event string to the webhook events list. Events follow the pattern `entity.action`:

```
myEntity.created
myEntity.updated
myEntity.deleted
```

#### 2. Dispatch the event in your route handler

After the mutation succeeds and audit is logged, dispatch the webhook:

```typescript
import { dispatchWebhook } from '../services/webhook.service.js';

// After successful create:
await dispatchWebhook(prisma, {
  orgId: user.orgId,
  event: 'myEntity.created',
  payload: {
    id: item.id,
    projectId: item.projectId,
    title: item.title,
    createdBy: user.email,
    timestamp: new Date().toISOString(),
  },
});
```

#### 3. Add the event to the UI

In `src/components/settings/WebhookSettings.tsx`, add the new event to the event selector list so users can subscribe to it.

#### 4. Document the event

Add the event to the webhook events table in the API Reference.

### Webhook Payload Format

All webhook payloads follow this structure:

```json
{
  "event": "myEntity.created",
  "timestamp": "2026-04-01T12:00:00.000Z",
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "title": "...",
    "createdBy": "user@example.com"
  }
}
```

The `X-QAtrial-Signature` header contains `sha256=<HMAC-SHA256 hex digest>` computed with the webhook's secret.

---

## 16. Adding an Integration

### Overview

QAtrial supports server-side integrations stored in the `Integration` database model. Currently Jira and GitHub are implemented.

### Step-by-Step

#### 1. Create the integration route file

```typescript
// server/routes/integrations/myTool.ts
import { Hono } from 'hono';
import { prisma } from '../../index.js';
import { authMiddleware, getUser, requirePermission } from '../../middleware/auth.js';

const myTool = new Hono();
myTool.use('*', authMiddleware);

// Connect: validate credentials and save config
myTool.post('/connect', requirePermission('canAdmin'), async (c) => {
  const user = getUser(c);
  const body = await c.req.json();

  // Validate credentials against the external API
  // ...

  // Save integration config
  const integration = await prisma.integration.upsert({
    where: { orgId_type: { orgId: user.orgId!, type: 'myTool' } },
    update: { config: body, enabled: true },
    create: { orgId: user.orgId!, type: 'myTool', config: body, enabled: true },
  });

  return c.json({ integration });
});

// Status: check if connected
myTool.get('/status', async (c) => {
  const user = getUser(c);
  const integration = await prisma.integration.findFirst({
    where: { orgId: user.orgId!, type: 'myTool', enabled: true },
  });
  return c.json({ connected: !!integration });
});

export default myTool;
```

#### 2. Mount the route

In `server/index.ts`:

```typescript
import myToolRoutes from './routes/integrations/myTool.js';
app.route('/api/integrations/my-tool', myToolRoutes);
```

#### 3. Add to the Settings UI

In `src/components/settings/IntegrationSettings.tsx`, add a configuration card for the new integration with connect/disconnect buttons and status display.

#### 4. Add the integration type

If using TypeScript validation, add `'myTool'` to the allowed integration types.

---

## 17. Docker Development

### Building the Docker Image

```bash
# Build the image
docker build -t qatrial .

# Run with a local PostgreSQL
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/qatrial \
  -e JWT_SECRET=your-secret \
  qatrial
```

### Docker Compose Development

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Rebuild after code changes
docker-compose build
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### Multi-Stage Dockerfile Explained

```
Stage 1 (frontend):   node:20-alpine -> npm ci -> npm run build -> dist/
Stage 2 (server):     node:20-alpine -> npm ci --omit=dev -> copy server/ + dist/
Stage 3 (runtime):    node:20-alpine -> copy from Stage 2 -> EXPOSE 3001 -> CMD tsx server/index.ts
```

The multi-stage build ensures:
- Dev dependencies are not included in the production image
- The frontend is built once and served as static files
- The final image is as small as possible (Alpine-based)

### Running Database Migrations in Docker

```bash
# Push schema to the Docker PostgreSQL
docker-compose exec app npx prisma db push --schema=server/prisma/schema.prisma

# Open Prisma Studio against the Docker database
docker-compose exec app npx prisma studio --schema=server/prisma/schema.prisma
```

---

## 18. Code Conventions

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
  - `*Settings` for settings tab components
  - `*Wizard` for multi-step wizard components
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

## 19. Test Infrastructure

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

## 20. Testing Checklist

### Manual Testing Workflow

### Authentication and RBAC

- [ ] **Registration (API mode):** Register a new user. Verify org + workspace created. Verify admin role.
- [ ] **Registration (localStorage mode):** Register with each role. Verify role is saved.
- [ ] **Login/Logout:** Log in and out. Verify audit trail entries for login/logout.
- [ ] **SSO Login:** (If SSO configured) Click "Sign in with SSO". Verify redirect to IdP. Verify auto-provisioning on first login.
- [ ] **JWT Tokens:** Verify access token is stored in localStorage. Verify token is sent in API requests.
- [ ] **Token Refresh:** Wait for token expiry (or shorten JWT_SECRET duration). Verify refresh works.
- [ ] **Permissions (5 roles):** Verify each role's canView/canEdit/canApprove/canAdmin permissions.
- [ ] **Signature Re-auth:** Apply a signature, verify password prompt. Apply another within 15 minutes, verify no prompt.

### Backend API

- [ ] **Health Check:** `curl http://localhost:3001/api/health` returns 200.
- [ ] **Status Check:** `curl http://localhost:3001/api/status` returns version, uptime, DB status.
- [ ] **CRUD Operations:** Create, read, update, delete requirements via API. Verify responses.
- [ ] **Auto SeqId:** Create multiple requirements. Verify sequential IDs (REQ-001, REQ-002).
- [ ] **Audit Logging:** After mutations, verify audit entries via `GET /api/audit`.
- [ ] **CSV Export:** Verify `GET /api/audit/export?format=csv` returns valid CSV.
- [ ] **CAPA Transitions:** Verify status transitions are enforced. Attempt invalid transition and verify 400 error.
- [ ] **Risk Auto-Scoring:** Create a risk. Verify riskScore and riskLevel are computed correctly.

### Import/Export

- [ ] **CSV Import:** Upload a CSV file. Verify auto-detect delimiter. Map columns. Import and verify data.
- [ ] **CSV Export:** Export requirements as CSV. Verify UTF-8 BOM. Open in Excel.
- [ ] **JSON Import/Export:** Export, then reimport. Verify data integrity.

### Compliance Starter Packs

- [ ] **Pack Selection:** Select each of the 4 packs. Verify wizard auto-fills correctly.
- [ ] **Start from Scratch:** Click "Start from Scratch". Verify wizard continues to Step 1.

### Audit Mode

- [ ] **Generate Link (Admin):** Generate a 24h audit mode link. Copy the URL.
- [ ] **Auditor Access:** Open the URL in an incognito window. Verify no login required. Verify 7 tabs.
- [ ] **Expiry:** Verify the link shows an expiry countdown. (Optionally test with a very short expiry.)

### Webhooks

- [ ] **Create Webhook:** Add a webhook with a URL and events. Save.
- [ ] **Test Webhook:** Click "Test". Verify the endpoint receives a payload.
- [ ] **HMAC Verification:** Verify the `X-QAtrial-Signature` header matches the computed HMAC.

### Integrations

- [ ] **Jira Connect:** Enter Jira credentials. Click Connect. Verify connection validation.
- [ ] **GitHub Connect:** Enter GitHub token. Click Connect. Verify connection validation.

### Docker

- [ ] **docker-compose up:** Start QAtrial + PostgreSQL. Verify `http://localhost:3001` loads.
- [ ] **Persistence:** Create data, restart containers, verify data persists.

### Core Functionality

- [ ] **New Project Wizard (7 steps):** Complete all 7 steps. Verify requirements and tests are created correctly.
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
- [ ] **Quality Check:** Run quality check on a requirement. Verify issue detection and apply suggestions.

### Compliance

- [ ] **Electronic Signature:** Sign a requirement. Verify all meanings work.
- [ ] **Audit Trail:** Open audit trail. Filter by date. Export as CSV.
- [ ] **Change Control:** Verify strict verticals get full change control config.

### Settings

- [ ] **AI Providers tab:** Add, edit, delete provider. Test connection.
- [ ] **Webhooks tab:** Add, edit, delete webhook. Test delivery.
- [ ] **Integrations tab:** Connect/disconnect Jira and GitHub.
- [ ] **SSO tab:** Verify SSO status display.

### Data Management

- [ ] **Theme:** Toggle between light and dark mode.
- [ ] **Language:** Switch to at least 2 non-English languages.

### Vertical-Depth Features (Sprints 1-4)

#### Medical Device Track

- [ ] **Complaint Management:** Create a complaint. Advance through received -> investigating -> resolved -> closed. Verify audit trail.
- [ ] **Complaint Trending:** View trending dashboard. Verify charts by month, severity, product, MTTR.
- [ ] **FSCA Tracking:** Create a complaint with FSCA reference. Verify field persistence.
- [ ] **Complaint-CAPA Linkage:** Link a complaint to a CAPA record. Verify bidirectional traceability.
- [ ] **Regulatory Reportable Flag:** Set regulatory reportable flag. Verify it persists on the complaint.
- [ ] **Supplier Scorecards:** Create a supplier with metrics. Verify risk score calculation.
- [ ] **Supplier Auto-Requalification:** Set supplier score below 50. Verify status changes to "conditional".
- [ ] **Supplier Audit Scheduling:** Schedule an audit for a supplier. Verify date tracking.
- [ ] **PMS Entries:** Create PMS entries. Mark for PSUR inclusion. Verify summary dashboard.
- [ ] **UDI Management:** Create UDI entries. Export in GUDID and EUDAMED format. Verify data integrity.

#### Pharma Track

- [ ] **Batch Record Creation:** Create a batch record from template. Verify all steps are populated.
- [ ] **Batch Step Execution:** Execute batch steps. Record deviations. Verify review-by-exception highlights deviations.
- [ ] **Batch E-Signature Release:** Complete all steps. Release batch with e-signature. Verify status change.
- [ ] **Batch Yield Calculation:** Record input/output values. Verify yield is computed correctly.
- [ ] **Stability Study:** Create a study with ICH Q1A conditions. Add readings. Verify OOS/OOT detection.
- [ ] **Stability Trending:** View trending charts. Verify specification lines and regression.
- [ ] **Environmental Monitoring:** Create monitoring points with thresholds. Add readings. Verify excursion detection.
- [ ] **EnvMon Trending:** View environmental trending data. Verify threshold lines are displayed.
- [ ] **Training Plans:** Create a plan with courses. Assign to users/roles. Verify matrix view.
- [ ] **Training Records:** Record completions. Verify expiration tracking.
- [ ] **Training Compliance Dashboard:** Verify compliance percentage and overdue detection.
- [ ] **Auto-Retraining Triggers:** Revise a document. Verify affected users are flagged for retraining.

#### Software/GAMP Track

- [ ] **Impact Analysis:** View requirement/test dependency graph. Verify chain visualization.
- [ ] **What-If Analysis:** Run what-if on a requirement. Verify downstream impacts listed.
- [ ] **System Inventory:** Create systems with GAMP 5 categories. Verify validation status tracking.
- [ ] **Overdue Detection:** Set a past review date. Verify overdue flag appears.
- [ ] **Periodic Review:** Start 7-step review wizard. Verify auto-pull of data. Complete and verify next review scheduled.

#### Cross-Vertical

- [ ] **Document Lifecycle:** Create a document. Advance through draft -> review -> approved -> effective -> superseded -> retired. Verify audit trail.
- [ ] **Document Version History:** View version history. Verify all transitions are recorded.
- [ ] **Document Distribution Tracking:** Assign document. Verify acknowledgment tracking.
- [ ] **CAPA Cascade Triggers:** Resolve a CAPA with SOP update trigger. Verify document update task created.
- [ ] **CAPA Retraining Trigger:** Resolve a CAPA with retraining trigger. Verify training assignments created.
- [ ] **Audit Management:** Create an audit. Add findings with classifications. Verify CAPA linkage.
- [ ] **Finding Classifications:** Test observation, minor, major, and critical classifications. Verify correct storage.

### Automated Tests

- [ ] **Run Tests:** `npm run test` passes with no failures.
- [ ] **New Store Tests:** Any new store has corresponding tests in `__tests__/`.
