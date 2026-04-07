# QAtrial — Regulated Quality Workspace

A country-aware, GxP-aware, AI-assisted quality and validation platform for regulated industries. Inspired by IBM DOORS, extended with industry verticals, AI compliance co-pilot, compliance starter packs, audit mode, Docker deployment, SSO, webhooks, Jira/GitHub integrations, and audit-ready validation documentation.

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
- Excel/CSV import with 3-step wizard (upload, map columns, import)
- CSV export (requirements, tests, all) with UTF-8 BOM

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

### Vertical-Depth Feature Tracks

**Medical Device Track:**
- **Complaint Management**: Intake form, investigation workflow (received -> investigating -> resolved -> closed), trending dashboard (by month/severity/product/MTTR), FSCA tracking, CAPA linkage, regulatory reportable flag
- **Supplier Quality Scorecards**: Performance metrics (defect rate, on-time delivery), risk-based scoring, auto-requalification (score < 50 -> conditional), audit scheduling/tracking
- **Post-Market Surveillance (PMS)**: Aggregated entries, PSUR data assembly, summary dashboard
- **UDI Management**: Device identifier tracking, GUDID/EUDAMED export

**Pharma Track:**
- **Electronic Batch Records**: Template-driven, step execution with deviations, review-by-exception, e-signature release, yield calculation
- **Stability Study Manager**: ICH Q1A design, storage conditions, pull schedules, OOS/OOT auto-detection, trending charts
- **Environmental Monitoring**: Monitoring points with thresholds, readings with auto-excursion detection, trending
- **Training Management (LMS-lite)**: Plans, courses, records, matrix, compliance dashboard, auto-retraining triggers

**Software/GAMP Track:**
- **Live Impact Analysis**: Requirement/test graph chains, what-if analysis
- **Computerized System Inventory**: GAMP 5 categories, validation status, risk levels, overdue detection
- **Periodic Review Automation**: 7-step wizard, auto-pull data, schedule next review

**Cross-Vertical:**
- **Document Lifecycle Management**: SOP versioning (draft -> review -> approved -> effective -> superseded -> retired), version history, distribution tracking
- **Closed-Loop CAPA Enhancement**: Cascade triggers (SOP update, retraining)
- **Audit Management**: Schedule, findings tracker, CAPA linkage, classification (observation/minor/major/critical)

### 15 Composable Quality Modules
Audit Trail, Electronic Signatures, Data Integrity (ALCOA+), Change Control, CAPA, Deviation Management, Training, Supplier Qualification, Complaint Handling, Risk Management, Document Control, Backup/DR, Access Control, Validation/CSV, Traceability Matrix

### Country-Specific Templates (14 countries + EU-wide)
US, Germany, UK, France, Japan, South Korea, Canada, Mexico, China, India, Italy, Netherlands, Spain + EU-wide base. 37 countries supported in the setup wizard. Each with regulatory requirements and tests referencing local standards and authorities.

### Compliance Starter Packs (4 packs)

One-click setup for common regulatory frameworks via the wizard's Step 0:

| Pack | Country | Vertical | Modules |
|------|---------|----------|---------|
| FDA Software Validation (GAMP 5) | US | Software/IT | 7 modules (Part 11, CSV, audit trail, e-sig, etc.) |
| EU MDR Medical Device QMS | EU/DE | Medical Devices | 9 modules (risk, CAPA, supplier, training, etc.) |
| FDA GMP Pharmaceutical Quality | US | Pharma | 10 modules (cGMP, data integrity, change control, etc.) |
| ISO 27001 + GDPR Compliance | EU/DE | Software/IT | 7 modules (access control, risk, backup, etc.) |

### AI Compliance Co-Pilot
- **Test Case Generator**: Auto-generate 4-6 test cases from a requirement, context-aware (country, vertical, standards, risk level)
- **Risk Classification**: AI proposes severity/likelihood using vertical-specific taxonomies (ISO 14971, ICH Q9, GAMP 5)
- **Gap Analysis**: Compare project against regulatory standards, identify covered/partial/missing clauses
- **CAPA Suggestions**: AI-powered root cause analysis and corrective action proposals for failed tests
- **Executive Brief**: One-click C-level compliance summary
- **Validation Summary Report (VSR)**: AI-generated 7-section audit-ready report with PDF export
- **QMSR Gap Analysis**: Medical device quality system regulation gap analysis
- **Requirement Extraction**: AI-assisted extraction of requirements from source documents
- **Quality Check**: Requirement quality analysis detecting vagueness, untestability, ambiguity, incompleteness, duplicate risk, and missing acceptance criteria
- Multi-provider support: Anthropic, OpenAI-compatible (OpenRouter, Ollama, etc.)
- Server-side proxy mode (`/api/ai/complete`) for production deployments (keeps API keys secure)

### Audit Mode (Read-Only Shareable Links)
- Admin generates time-limited shareable links (24h / 72h / 7d expiry)
- Auditors access `/audit/{token}` -- no login required
- 7-tab read-only view: Overview, Requirements, Tests, Traceability, Evidence, Audit Trail, Signatures
- Print and Download Report buttons
- Amber "Read-Only" banner with expiry countdown

### 7 Dashboard Views
1. **Overview**: Coverage metrics, status charts, traceability matrix, orphaned items
2. **Compliance**: Weighted readiness score + gap analysis heatmap
3. **Risk**: Interactive 5x5 severity x likelihood matrix
4. **Evidence**: Per-requirement evidence completeness tracking
5. **CAPA**: Failed test funnel with AI corrective action suggestions
6. **Trends**: Status distributions, risk distribution, coverage by category
7. **Portfolio**: Multi-project overview with readiness scores

### Server-Side Dashboards
- `GET /api/dashboard/:projectId/readiness` -- weighted compliance score
- `GET /api/dashboard/:projectId/missing-evidence` -- requirements/tests without evidence
- `GET /api/dashboard/:projectId/approval-status` -- counts by entity type and status
- `GET /api/dashboard/:projectId/capa-aging` -- open CAPAs with aging buckets (0-7d, 7-30d, 30-90d, 90d+)
- `GET /api/dashboard/:projectId/risk-summary` -- risk level counts + matrix data

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

### Authentication, RBAC & SSO
- User registration and login with JWT-based authentication (24h access tokens + 7d refresh tokens)
- Server-side password hashing with bcrypt (12 rounds)
- **5 RBAC roles** with permission matrix:

| Role | View | Edit | Approve | Admin |
|------|------|------|---------|-------|
| admin | Yes | Yes | Yes | Yes |
| qa_manager | Yes | Yes | Yes | No |
| qa_engineer | Yes | Yes | No | No |
| auditor | Yes | No | No | No |
| reviewer | Yes | No | Yes | No |

- `requirePermission()` middleware for granular access control
- Signature verification with password re-authentication
- Session management with configurable timeouts
- Organization and workspace scoping for multi-tenant isolation
- **SSO (OIDC)**: Sign in with Okta, Azure AD/Entra ID, Auth0, Keycloak, or Google Workspace. Auto-provisioning on first login.

### Webhooks
- 14 events dispatched: requirement.created/updated/deleted, test.created/updated/failed, capa.created/status_changed, approval.requested/approved/rejected, signature.created, evidence.uploaded
- HMAC-SHA256 signing for payload verification
- CRUD + test endpoint for webhook management
- Settings UI with event selector and test button

### Integrations
- **Jira**: Connect to Jira Cloud, bidirectional sync (requirement to issue), import issues as requirements
- **GitHub**: Connect to repository, link PRs to requirements, import CI test results from GitHub Actions
- Tabbed Settings page: AI Providers, Webhooks, Integrations, SSO

### Docker Deployment
- Multi-stage `Dockerfile` (frontend build, server build, slim runtime)
- `docker-compose.yml` with app + PostgreSQL 16 services
- Health checks and named volumes for data persistence
- Static file serving in production mode

### Validation Package (IQ/OQ/PQ)
5 validation documents in `docs/validation/`:

| Document | Purpose |
|----------|---------|
| IQ (Installation Qualification) | 9 test steps verifying correct installation |
| OQ (Operational Qualification) | 18 test steps verifying correct operation |
| PQ (Performance Qualification) | Template for customer-specific validation |
| Compliance Statement | 21 CFR Part 11 (15 sections) + EU Annex 11 (17 sections) + GAMP 5 Cat 4 alignment |
| Traceability Matrix | 75 regulatory requirements mapped to QAtrial features + IQ/OQ/PQ test IDs |

### Backend Server (v4.0.0)
- **Hono** TypeScript-first HTTP framework on Node.js
- **PostgreSQL** database via **Prisma ORM v7** (25+ models)
- **JWT authentication** with access/refresh token pair
- **REST API** with 80+ endpoints across 28+ route files
- **Append-only audit log** in PostgreSQL with CSV export
- **CAPA lifecycle enforcement** with valid status transition checks and cascade triggers
- **Auto-generated sequential IDs** (REQ-NNN, TST-NNN) per project
- **Multi-user, multi-organization** support with workspace scoping
- **Webhook dispatch** with HMAC signing and retry tracking
- **SSO (OIDC)** with auto-provisioning
- **Docker** production deployment with static file serving
- **Vertical-depth routes**: complaints, suppliers, batches, training, documents, systems, impact, pms, udi, stability, envmon, auditrecords

### AI System Enhancements
- **JSON Schema Validation**: All AI responses validated against expected schemas with automatic retry/repair
- **Provenance Tracking**: Full audit trail of AI generations (model, parameters, tokens, timestamp, reviewer)
- **Re-run History**: Complete history of all AI-generated artifacts with comparison capability
- **Server Proxy Mode**: Server-side AI proxy (`POST /api/ai/complete`) keeps API keys off the client
- **9 AI prompt templates**: Test gen, risk classification, gap analysis, CAPA suggestion, executive brief, VSR, QMSR gap, requirement extraction, quality check

### External Connectors
- **Jira Cloud**: Bidirectional sync with REST API v3
- **GitHub**: PR linking and CI test result import via REST API v3
- Connector interface for Azure DevOps, GitLab, Veeva Vault, MasterControl, TrackWise, SharePoint, Confluence
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
| Zustand | State Management (20+ stores on client) |
| TanStack Table v8 | Tables |
| Recharts | Charts |
| react-i18next | Internationalization |
| Lucide React | Icons |
| **Hono** | **Backend HTTP Framework** |
| **Prisma v7** | **ORM / Database Client** |
| **PostgreSQL** | **Relational Database** |
| **JSON Web Tokens** | **Authentication (access + refresh tokens)** |
| **bcryptjs** | **Password Hashing** |
| **Docker** | **Container Deployment** |
| **OIDC** | **SSO Authentication** |

## Project Structure

```
QAtrial/
├── server/                          # Backend server
│   ├── index.ts                     # Hono server entry point (port 3001)
│   ├── prisma/
│   │   ├── schema.prisma            # PostgreSQL schema (25+ models)
│   │   └── prisma.config.ts         # Prisma 7 migration config
│   ├── generated/prisma/            # Generated Prisma client
│   ├── middleware/
│   │   └── auth.ts                  # JWT auth + RBAC + permission middleware
│   ├── services/
│   │   ├── audit.service.ts         # Append-only audit logging
│   │   └── webhook.service.ts       # Webhook dispatch with HMAC signing
│   └── routes/
│       ├── auth.ts                  # Register, login, refresh, me
│       ├── projects.ts              # Project CRUD
│       ├── requirements.ts          # Requirement CRUD + auto seqId
│       ├── tests.ts                 # Test CRUD + auto seqId
│       ├── capa.ts                  # CAPA CRUD + lifecycle enforcement + cascade triggers
│       ├── risks.ts                 # Risk CRUD + auto scoring
│       ├── audit.ts                 # Read-only audit queries + CSV export
│       ├── users.ts                 # User management (admin)
│       ├── evidence.ts              # Evidence attachment endpoints
│       ├── approvals.ts             # Approval workflow endpoints
│       ├── signatures.ts            # Electronic signature endpoints
│       ├── export.ts                # CSV/JSON export
│       ├── import.ts                # CSV import with auto-detect + mapping
│       ├── ai.ts                    # Server-side AI proxy
│       ├── sso.ts                   # OIDC SSO (discovery, redirect, callback)
│       ├── webhooks.ts              # Webhook CRUD + test endpoint
│       ├── auditmode.ts             # Read-only audit mode link generation
│       ├── dashboard.ts             # Server-side dashboard analytics
│       ├── complaints.ts            # Complaint management + investigation workflow
│       ├── suppliers.ts             # Supplier quality scorecards + audit scheduling
│       ├── batches.ts               # Electronic batch records + e-signature release
│       ├── training.ts              # Training management (LMS-lite)
│       ├── documents.ts             # Document lifecycle management (SOP versioning)
│       ├── systems.ts               # Computerized system inventory (GAMP 5)
│       ├── impact.ts                # Live impact analysis (req/test graph chains)
│       ├── pms.ts                   # Post-market surveillance + PSUR assembly
│       ├── udi.ts                   # UDI management + GUDID/EUDAMED export
│       ├── stability.ts             # Stability study manager (ICH Q1A)
│       ├── envmon.ts                # Environmental monitoring + excursion detection
│       ├── auditrecords.ts          # Audit management + findings tracker
│       └── integrations/
│           ├── jira.ts              # Jira Cloud bidirectional sync
│           └── github.ts            # GitHub PR linking + CI import
├── src/
│   ├── ai/                          # AI system
│   │   ├── types.ts, provider.ts, client.ts, validation.ts, proxy.ts
│   │   └── prompts/                 # 9 AI prompt templates
│   │       ├── generateTests.ts     # Test case generation
│   │       ├── riskClassification.ts # Risk severity/likelihood
│   │       ├── gapAnalysis.ts       # Regulatory gap analysis
│   │       ├── executiveBrief.ts    # Executive compliance brief
│   │       ├── capaSuggestion.ts    # CAPA suggestion
│   │       ├── vsrReport.ts         # Validation Summary Report
│   │       ├── qmsrGap.ts           # QMSR gap analysis
│   │       ├── reqExtraction.ts     # Requirement extraction
│   │       └── qualityCheck.ts      # Requirement quality check
│   ├── templates/                   # Template composition
│   │   ├── types.ts, registry.ts, composer.ts
│   │   ├── packs/                   # 4 Compliance Starter Packs
│   │   │   └── index.ts
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
│   │   ├── wizard/                  # 7-step setup wizard (Step 0: compliance pack)
│   │   ├── requirements/            # Requirements table + modal
│   │   ├── tests/                   # Tests table + modal
│   │   ├── dashboard/               # 14+ dashboard components
│   │   ├── ai/                      # AI panels (test gen, risk, settings, quality check)
│   │   ├── reports/                 # Report generator + preview
│   │   ├── audit/                   # Audit trail, signature modal, audit mode, share link
│   │   ├── import/                  # Import wizard + export panel
│   │   ├── settings/                # Tabbed settings (AI, webhooks, integrations, SSO)
│   │   ├── complaints/              # Complaint intake, investigation, trending dashboard
│   │   ├── suppliers/               # Supplier scorecards, audit scheduling
│   │   ├── batches/                 # Electronic batch records, step execution
│   │   ├── training/                # Training plans, courses, compliance dashboard
│   │   ├── documents/               # Document lifecycle, SOP versioning
│   │   ├── systems/                 # Computerized system inventory
│   │   ├── impact/                  # Live impact analysis, what-if
│   │   ├── pms/                     # Post-market surveillance
│   │   ├── udi/                     # UDI management
│   │   ├── stability/               # Stability study manager
│   │   ├── envmon/                  # Environmental monitoring
│   │   ├── auditrecords/            # Audit management, findings tracker
│   │   └── shared/                  # Shared components
│   └── public/locales/              # 12 complete translation files
├── docs/                            # Documentation
│   └── validation/                  # IQ, OQ, PQ, Compliance Statement, Traceability Matrix
├── Dockerfile                       # Multi-stage production build
├── docker-compose.yml               # App + PostgreSQL deployment
├── .env.example                     # All configuration variables
├── package.json
├── tsconfig.json
├── vite.config.ts                   # Build config with manual chunks
└── vitest.config.ts                 # Test runner configuration
```

**160+ TypeScript source files, 35,000+ lines of code, 12 translation files (425+ keys each), 25+ database models, 80+ API endpoints, 28+ route files, 60+ frontend components, 9 AI prompt templates, 5 validation documents**

## Installation

### Option 1: Docker (Recommended for Production)

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial

# Copy environment template and configure
cp .env.example .env
# Edit .env to set JWT_SECRET, AI provider keys, SSO config, etc.

# Start QAtrial + PostgreSQL
docker-compose up

# Access at http://localhost:3001
```

Docker Compose starts the app and a PostgreSQL 16 database with health checks, named volumes for persistent data and uploads.

### Option 2: Frontend Only (Demo/Standalone Mode)

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install
npm run dev
```

The frontend dev server starts on `http://localhost:5173`. In this mode all data is stored in `localStorage`.

### Option 3: Full Stack (Frontend + Backend, Local Development)

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
curl http://localhost:3001/api/status
# => {"status":"ok","version":"3.0.0","uptime":...,"database":"connected"}
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

**Environment variables (see `.env.example` for full list):**

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://localhost:5432/qatrial` | PostgreSQL connection string |
| `JWT_SECRET` | `qatrial-dev-secret-change-in-production` | Secret for signing JWT tokens |
| `VITE_API_URL` | `http://localhost:3001/api` | API base URL for the frontend |
| `AI_PROVIDER_TYPE` | (none) | Server-side AI provider: `anthropic` or `openai` |
| `AI_PROVIDER_URL` | (none) | Server-side AI provider base URL |
| `AI_PROVIDER_KEY` | (none) | Server-side AI provider API key |
| `AI_PROVIDER_MODEL` | (none) | Server-side AI provider model name |
| `SSO_ENABLED` | `false` | Enable OIDC SSO |
| `SSO_ISSUER_URL` | (none) | OIDC issuer URL (e.g., Okta, Azure AD) |
| `SSO_CLIENT_ID` | (none) | OIDC client ID |
| `SSO_CLIENT_SECRET` | (none) | OIDC client secret |
| `SSO_CALLBACK_URL` | `http://localhost:3001/api/auth/sso/callback` | OIDC callback URL |
| `SSO_DEFAULT_ROLE` | `qa_engineer` | Default role for SSO-provisioned users |

## Setup Wizard (7 steps)

0. **Compliance Pack** -- Select a pre-configured compliance starter pack (FDA CSV, EU MDR, FDA GMP, ISO 27001+GDPR) or "Start from Scratch"
1. **Country** -- Select jurisdiction (37 countries)
2. **Industry Vertical** -- Select GxP domain (optional)
3. **Metadata** -- Project name, description, owner, version
4. **Project Type** -- Software, Embedded, QMS, Validation, Clinical, Compliance, Supplier Quality
5. **Quality Modules** -- Select composable quality controls
6. **Preview** -- Review and customize generated requirements + tests

## AI Provider Configuration

Go to Settings > AI Providers tab to configure LLM providers:
- Anthropic (Claude)
- OpenAI-compatible (GPT-4o, OpenRouter, Ollama, etc.)
- Multiple providers with purpose-scoped routing
- Token usage tracking
- Server-side proxy mode for secure API key management

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
