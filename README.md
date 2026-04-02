# QAtrial — Regulated Quality Workspace

A country-aware, GxP-aware, AI-assisted quality and validation platform for regulated industries. Inspired by IBM DOORS, extended with industry verticals, AI compliance co-pilot, and audit-ready reporting.

## Core Model

```
Country (jurisdiction) x Vertical (domain) x Project Type (execution) x Modules (quality controls)
```

## Features

### Requirements & Test Management
- CRUD for requirements and tests with auto-generated IDs (REQ-001, TST-001)
- Multi-select linking between tests and requirements
- Status tracking (Draft/Active/Closed for reqs, Not Run/Passed/Failed for tests)
- Enriched metadata: tags, regulatory references, risk level, evidence hints
- Sortable, searchable tables with TanStack Table

### Industry Verticals (10 GxP domains)
| Vertical | Standards |
|----------|----------|
| Pharmaceuticals | FDA 21 CFR 210/211, ICH Q7/Q10, EU GMP Annex 11 |
| Biotechnology | 21 CFR Part 600, ICH Q5A-E |
| Medical Devices | QMSR/21 CFR 820, ISO 13485, IEC 62304, ISO 14971 |
| CRO / Clinical Research | ICH E6(R3), 21 CFR Part 58 |
| Clinical Laboratories | CLIA, CAP, ISO 15189 |
| Logistics / GDP | WHO GDP, EU GDP, FDA DSCSA |
| Software & IT (GAMP/CSV) | 21 CFR Part 11, EU Annex 11, GAMP 5 2nd Ed |
| Cosmetics / Chemical | ISO 22716, OECD GLP, REACH |
| Aerospace | AS9100D, DO-178C, DO-254, EASA Part 21 |
| Chemical / Environmental | REACH, CLP, TSCA, ISO 14001, ISO 45001 |

### 15 Composable Quality Modules
Audit Trail, Electronic Signatures, Data Integrity (ALCOA+), Change Control, CAPA, Deviation Management, Training, Supplier Qualification, Complaint Handling, Risk Management, Document Control, Backup/DR, Access Control, Validation/CSV, Traceability Matrix

### Country-Specific Templates (14 countries + EU-wide)
US, Germany, UK, France, Japan, South Korea, Canada, Mexico, China, India, Italy, Netherlands, Spain + EU-wide base. 37 countries supported in the setup wizard. Each with regulatory requirements and tests referencing local standards and authorities.

### AI Compliance Co-Pilot
- **Test Case Generator**: Auto-generate 4-6 test cases from a requirement, context-aware (country, vertical, standards, risk level)
- **Risk Classification**: AI proposes severity/likelihood using vertical-specific taxonomies (ISO 14971, ICH Q9, GAMP 5)
- **Gap Analysis**: Compare project against regulatory standards, identify covered/partial/missing clauses
- **CAPA Suggestions**: AI-powered root cause analysis and corrective action proposals for failed tests
- **Executive Brief**: One-click C-level compliance summary
- **Validation Summary Report (VSR)**: AI-generated 7-section audit-ready report with PDF export
- Multi-provider support: Anthropic, OpenAI-compatible (OpenRouter, Ollama, etc.)
- Server-side proxy mode for production deployments (keeps API keys secure)

### 7 Dashboard Views
1. **Overview**: Coverage metrics, status charts, traceability matrix, orphaned items
2. **Compliance**: Weighted readiness score + gap analysis heatmap
3. **Risk**: Interactive 5x5 severity x likelihood matrix
4. **Evidence**: Per-requirement evidence completeness tracking
5. **CAPA**: Failed test funnel with AI corrective action suggestions
6. **Trends**: Status distributions, risk distribution, coverage by category
7. **Portfolio**: Multi-project overview with readiness scores

### Report Generation
- Validation Summary Report (VSR) -- 7-section audit-ready report
- Executive Compliance Brief -- AI-generated one-pager
- Regulatory Submission Package -- formatted per authority (FDA 510(k), EU MDR, PMDA STED)
- Traceability Matrix, Gap Analysis, Risk Assessment exports

### Compliance Features
- **Electronic Signatures**: 21 CFR Part 11 / EU Annex 11 compliant with real identity verification, re-authentication for signatures, and 15-minute verification window
- **Audit Trail**: Automatic event logging on all CRUD operations, full timeline with diffs, signatures, CSV/PDF export. Server-backed append-only audit log in PostgreSQL.
- **Change Control**: Configurable per vertical (auto-revert on change, approval workflows)
- **Evidence Management**: Attach evidence files to requirements, tests, and CAPA records with completeness tracking
- **Risk Assessments**: Persisted risk assessment entities with full lifecycle and audit trail
- **CAPA Records**: Durable CAPA records with lifecycle states (open -> investigation -> in_progress -> verification -> resolved -> closed)

### Authentication & RBAC
- User registration and login with JWT-based authentication (24h access tokens + 7d refresh tokens)
- Server-side password hashing with bcrypt (12 rounds)
- 3 backend roles: Admin, Editor, Viewer (server-enforced via middleware)
- 5 client-side roles: Admin, QA Manager, QA Engineer, Auditor (read-only), Reviewer
- Role-based permission matrix for all operations
- Signature verification with password re-authentication
- Session management with configurable timeouts
- Organization and workspace scoping for multi-tenant isolation

### Backend Server (v3.0.0)
- **Hono** TypeScript-first HTTP framework on Node.js
- **PostgreSQL** database via **Prisma ORM v7** (10 models)
- **JWT authentication** with access/refresh token pair
- **REST API** with 30+ endpoints across 8 route groups
- **Append-only audit log** in PostgreSQL with CSV export
- **CAPA lifecycle enforcement** with valid status transition checks
- **Auto-generated sequential IDs** (REQ-NNN, TST-NNN) per project
- **Multi-user, multi-organization** support with workspace scoping

### AI System Enhancements
- **JSON Schema Validation**: All AI responses validated against expected schemas with automatic retry/repair
- **Provenance Tracking**: Full audit trail of AI generations (model, parameters, tokens, timestamp, reviewer)
- **Re-run History**: Complete history of all AI-generated artifacts with comparison capability
- **Server Proxy Mode**: Optional server-side AI proxy (set `VITE_AI_PROXY_URL`) to keep API keys off the client

### External Connectors
- Connector interface for JIRA, Azure DevOps, GitHub, GitLab, Veeva Vault, MasterControl, TrackWise, SharePoint, Confluence
- Field mapping configuration for bidirectional sync
- Sync status tracking and conflict resolution

### Internationalization (12 languages)
English, German, French, Spanish, Italian, Portuguese, Dutch, Japanese, Chinese (Simplified), Korean, Hindi, Thai

35+ locale directories prepared. Language selector in header with instant switching.

### Theming
Light and dark mode with full design system (CSS custom properties, Tailwind tokens).

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| Vitest | Test Framework |
| Zustand | State Management (20 stores on client) |
| TanStack Table v8 | Tables |
| Recharts | Charts |
| react-i18next | Internationalization |
| Lucide React | Icons |
| **Hono** | **Backend HTTP Framework** |
| **Prisma v7** | **ORM / Database Client** |
| **PostgreSQL** | **Relational Database** |
| **JSON Web Tokens** | **Authentication (access + refresh tokens)** |
| **bcryptjs** | **Password Hashing** |

## Project Structure

```
QAtrial/
├── server/                          # Backend server
│   ├── index.ts                     # Hono server entry point (port 3001)
│   ├── prisma/
│   │   ├── schema.prisma            # PostgreSQL schema (10 models)
│   │   └── prisma.config.ts         # Prisma 7 migration config
│   ├── generated/prisma/            # Generated Prisma client
│   ├── middleware/
│   │   └── auth.ts                  # JWT auth + RBAC middleware
│   ├── services/
│   │   └── audit.service.ts         # Append-only audit logging
│   └── routes/
│       ├── auth.ts                  # Register, login, refresh, me
│       ├── projects.ts              # Project CRUD
│       ├── requirements.ts          # Requirement CRUD + auto seqId
│       ├── tests.ts                 # Test CRUD + auto seqId
│       ├── capa.ts                  # CAPA CRUD + lifecycle enforcement
│       ├── risks.ts                 # Risk CRUD + auto scoring
│       ├── audit.ts                 # Read-only audit queries + CSV export
│       └── users.ts                 # User management (admin)
├── src/
│   ├── ai/                          # AI system
│   │   ├── types.ts, provider.ts, client.ts
│   │   └── prompts/                 # 6 AI prompt templates
│   ├── templates/                   # Template composition
│   │   ├── types.ts, registry.ts, composer.ts
│   │   ├── verticals/               # 5 industry vertical templates
│   │   ├── modules/                 # 15 quality module definitions
│   │   └── regions/                 # 6 country + EU base + overlays
│   ├── connectors/                  # External QMS/ALM connector interfaces
│   ├── store/                       # 20 Zustand stores (client-side state)
│   ├── i18n/                        # i18next configuration
│   ├── hooks/                       # Custom hooks
│   ├── lib/                         # Constants, ID generator, approval helpers, apiClient
│   │   └── apiClient.ts             # Authenticated API fetch wrapper (Bearer token injection)
│   ├── types/                       # All TypeScript types (50+ types)
│   ├── components/
│   │   ├── layout/                  # AppShell
│   │   ├── wizard/                  # 6-step setup wizard
│   │   ├── requirements/            # Requirements table + modal
│   │   ├── tests/                   # Tests table + modal
│   │   ├── dashboard/               # 14 dashboard components
│   │   ├── ai/                      # AI panels (test gen, risk, settings)
│   │   ├── reports/                 # Report generator + preview
│   │   ├── audit/                   # Audit trail + signature modal
│   │   └── shared/                  # Shared components
│   └── public/locales/              # 12 complete translation files
├── docs/                            # Documentation
├── package.json
├── tsconfig.json
├── vite.config.ts                   # Build config with manual chunks
└── vitest.config.ts                 # Test runner configuration
```

**100+ TypeScript source files, 20,000+ lines of code, 12 translation files (425+ keys each), 10 database models, 30+ API endpoints**

## Installation

### Frontend Only (Demo/Standalone Mode)

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install
npm run dev
```

The frontend dev server starts on `http://localhost:5173`. In this mode all data is stored in `localStorage`.

### Full Stack (Frontend + Backend)

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install

# 1. Install and start PostgreSQL (if not already running)
#    macOS: brew install postgresql && brew services start postgresql
#    Linux: sudo apt install postgresql && sudo systemctl start postgresql

# 2. Create the database
createdb qatrial

# 3. Set environment variables
export DATABASE_URL="postgresql://localhost:5432/qatrial"
export JWT_SECRET="your-secret-key-change-in-production"

# 4. Generate Prisma client and push schema
npm run db:generate
npm run db:push

# 5. Start the backend server (port 3001)
npm run server:dev

# 6. In another terminal, start the frontend (port 5173)
npm run dev
```

### Running the Backend

The backend runs on `http://localhost:3001` and exposes a REST API under `/api/`.

```bash
# Start backend with auto-reload on file changes
npm run server:dev

# Or start without watch mode
npm run server

# Verify the server is running
curl http://localhost:3001/api/health
# => {"status":"ok","version":"3.0.0"}
```

**Available backend scripts:**

| Script | Description |
|--------|-------------|
| `npm run server` | Start the backend server |
| `npm run server:dev` | Start with file watching (auto-reload) |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema directly to database |
| `npm run db:studio` | Open Prisma Studio GUI for database browsing |

**Environment variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://localhost:5432/qatrial` | PostgreSQL connection string |
| `JWT_SECRET` | `qatrial-dev-secret-change-in-production` | Secret for signing JWT tokens |
| `VITE_API_URL` | `http://localhost:3001/api` | API base URL for the frontend |
| `VITE_AI_PROXY_URL` | (none) | Optional AI proxy endpoint |

## Setup Wizard (6 steps)

1. **Country** -- Select jurisdiction (37 countries)
2. **Industry Vertical** -- Select GxP domain (optional)
3. **Metadata** -- Project name, description, owner, version
4. **Project Type** -- Software, Embedded, QMS, Validation, Clinical, Compliance, Supplier Quality
5. **Quality Modules** -- Select composable quality controls
6. **Preview** -- Review and customize generated requirements + tests

## AI Provider Configuration

Go to Settings (gear icon) to configure LLM providers:
- Anthropic (Claude)
- OpenAI-compatible (GPT-4o, OpenRouter, Ollama, etc.)
- Multiple providers with purpose-scoped routing
- Token usage tracking

## Documentation

- [User Guide](docs/USER-GUIDE.md) -- Complete end-user documentation
- [Architecture](docs/ARCHITECTURE.md) -- Technical architecture overview
- [Developer Guide](docs/DEVELOPER-GUIDE.md) -- How to extend QAtrial (add countries, verticals, languages)
- [API Reference](docs/API-REFERENCE.md) -- REST API, stores, hooks, utilities, type definitions
- [Regulatory Reference](docs/REGULATORY-REFERENCE.md) -- Standards and frameworks by country and vertical

## Contributing

QAtrial is open source and welcomes contributions. See the [Developer Guide](docs/DEVELOPER-GUIDE.md) for how to add countries, verticals, modules, languages, and AI prompts.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0).

You are free to use, modify, and distribute this software. If you modify QAtrial and provide it as a service over a network, you must make your modified source code available under the same license.
