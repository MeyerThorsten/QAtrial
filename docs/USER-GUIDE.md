# QAtrial User Guide

Complete end-user guide for QAtrial, the regulated quality workspace for GxP-compliant industries.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Authentication & User Management](#2-authentication--user-management)
3. [Project Setup Wizard (7 Steps)](#3-project-setup-wizard-7-steps)
4. [Requirements Management](#4-requirements-management)
5. [Test Management](#5-test-management)
6. [Excel/CSV Import and Export](#6-excelcsv-import-and-export)
7. [Dashboard and Analytics](#7-dashboard-and-analytics)
8. [AI Features](#8-ai-features)
9. [Reports](#9-reports)
10. [Evidence Management](#10-evidence-management)
11. [CAPA Workflow](#11-capa-workflow)
12. [Compliance Features](#12-compliance-features)
13. [Audit Mode (Read-Only Shareable Links)](#13-audit-mode-read-only-shareable-links)
14. [Settings](#14-settings)
15. [Connector Setup](#15-connector-setup)
16. [Data Management](#16-data-management)
17. [Docker Deployment (Admin)](#17-docker-deployment-admin)
18. [Demo Projects](#18-demo-projects)
19. [Medical Device Track](#19-medical-device-track)
20. [Pharma Track](#20-pharma-track)
21. [Software/GAMP Track](#21-softwaregamp-track)
22. [Cross-Vertical Features](#22-cross-vertical-features)

---

## 1. Getting Started

### System Requirements

| Component | Minimum |
|-----------|---------|
| Browser | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| Node.js | 18.0 or later (for local development) |
| npm | 9.0 or later (for local development) |
| Screen | 1280x720 minimum (1920x1080 recommended) |
| PostgreSQL | 14.0 or later (required for backend mode) |
| Docker | 20.10+ (optional, for Docker deployment) |

### Installation and Running (Frontend Only / Demo Mode)

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install
npm run dev
```

The development server starts on `http://localhost:5173` by default. In this mode, all data is stored in your browser's `localStorage`.

### Installation and Running (Full Stack with Backend)

For multi-user, team-based usage with persistent database storage:

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install

# 1. Install PostgreSQL (if not already installed)
#    macOS: brew install postgresql && brew services start postgresql
#    Linux: sudo apt install postgresql && sudo systemctl start postgresql

# 2. Create the database
createdb qatrial

# 3. Set environment variables (add to your .env or shell profile)
export DATABASE_URL="postgresql://localhost:5432/qatrial"
export JWT_SECRET="your-secret-key-change-in-production"

# 4. Generate Prisma client and push schema to database
npm run db:generate
npm run db:push

# 5. Start the backend server (in one terminal)
npm run server:dev

# 6. Start the frontend (in another terminal)
npm run dev
```

The backend API runs on `http://localhost:3001`. The frontend connects to it automatically when the `VITE_API_URL` environment variable is set (defaults to `http://localhost:3001/api`).

### Installation and Running (Docker)

For production or quick local deployment without installing PostgreSQL:

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial

# Copy and configure environment
cp .env.example .env
# Edit .env to set JWT_SECRET, AI keys, SSO config

# Start QAtrial + PostgreSQL
docker-compose up
```

QAtrial is accessible at `http://localhost:3001`. PostgreSQL is managed automatically.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://localhost:5432/qatrial` | PostgreSQL connection string |
| `JWT_SECRET` | `qatrial-dev-secret-change-in-production` | Secret key for signing JWT tokens. **Change this in production.** |
| `VITE_API_URL` | `http://localhost:3001/api` | API base URL used by the frontend to connect to the backend |
| `AI_PROVIDER_TYPE` | (none) | Server-side AI provider type: `anthropic` or `openai` |
| `AI_PROVIDER_URL` | (none) | Server-side AI provider base URL |
| `AI_PROVIDER_KEY` | (none) | Server-side AI provider API key (stays on server) |
| `AI_PROVIDER_MODEL` | (none) | Server-side AI provider model name |
| `SSO_ENABLED` | `false` | Enable OIDC SSO login |
| `SSO_ISSUER_URL` | (none) | OIDC issuer URL |
| `SSO_CLIENT_ID` | (none) | OIDC client ID |
| `SSO_CLIENT_SECRET` | (none) | OIDC client secret |
| `SSO_CALLBACK_URL` | `http://localhost:3001/api/auth/sso/callback` | OIDC callback URL |
| `SSO_DEFAULT_ROLE` | `qa_engineer` | Default role for auto-provisioned SSO users |

### First Launch Experience

When you open QAtrial for the first time, you are presented with a **login/registration screen**. After creating an account and logging in, the application detects that no project data exists and automatically presents the **Setup Wizard**.

The header bar shows:
- **QAtrial** branding with the project name (once created)
- Navigation tabs: Requirements, Tests, Evaluation (Dashboard), Reports
- Toolbar: Audit Trail button, Share Audit Link (admin), Settings (gear icon), Language Selector, Theme Toggle, New Project, Import/Export
- User menu: Displays current user name and role, with login/logout options

### Language Selection

QAtrial supports 12 fully translated languages:

| Language | Code |
|----------|------|
| English | en |
| German | de |
| French | fr |
| Spanish | es |
| Italian | it |
| Portuguese | pt |
| Dutch | nl |
| Japanese | ja |
| Chinese (Simplified) | zh |
| Korean | ko |
| Hindi | hi |
| Thai | th |

To switch languages, click the **Language Selector** dropdown in the header bar. The switch is instant and persists across sessions. All UI labels, navigation items, wizard steps, and button text update immediately.

---

## 2. Authentication & User Management

### Operating Modes

QAtrial supports two operating modes for authentication:

| Mode | When Active | How It Works |
|------|-------------|--------------|
| **localStorage Mode** (standalone/demo) | Backend server is not running | User accounts are stored in browser `localStorage` via `useAuthStore`. Data is local to the browser. |
| **API Mode** (production/team) | Backend server is running and `VITE_API_URL` is set | User accounts are stored in PostgreSQL. JWT tokens are used for authentication. Multi-user across devices. |

### Creating an Account (API Mode)

1. On the login screen, click **Register**
2. Fill in your details:
   - **Full Name** (required): Your display name for audit trails and signatures
   - **Email** (required): Used as your login identifier (must be unique)
   - **Password** (required): Minimum 8 characters. Hashed with bcrypt before storage.
3. Click **Register**
4. On first registration, an Organization and default Workspace are automatically created for you, and you are assigned the **Admin** role.

### Creating an Account (localStorage Mode)

1. On the login screen, click **Register**
2. Fill in your details:
   - **Full Name** (required): Your display name for audit trails and signatures
   - **Email** (required): Used as your login identifier
   - **Password** (required): Used for login and signature re-authentication
   - **Role**: Select your role (see below)
3. Click **Register**

### SSO Login (OIDC)

When SSO is configured (see Settings > SSO), a **"Sign in with SSO"** button appears on the login screen.

1. Click **Sign in with SSO**
2. You are redirected to your identity provider (Okta, Azure AD, Auth0, Keycloak, Google Workspace)
3. Authenticate with your corporate credentials
4. You are redirected back to QAtrial with an active session
5. On first SSO login, a QAtrial user account is auto-provisioned with the configured default role

SSO is configured by the system administrator via environment variables. See [Section 14: Settings](#14-settings) for details.

### User Roles

QAtrial uses a 5-role RBAC model with a permission matrix:

| Role | View | Edit | Approve | Admin |
|------|------|------|---------|-------|
| **admin** | Yes | Yes | Yes | Yes |
| **qa_manager** | Yes | Yes | Yes | No |
| **qa_engineer** | Yes | Yes | No | No |
| **auditor** | Yes | No | No | No |
| **reviewer** | Yes | No | Yes | No |

**Permission details:**
- **View (canView)**: Read all data, view dashboards, view audit trails
- **Edit (canEdit)**: Create, update, and delete requirements, tests, CAPA, risks
- **Approve (canApprove)**: Apply electronic signatures, approve records, advance CAPA lifecycle
- **Admin (canAdmin)**: Manage users, invite users, change roles, configure system settings, generate audit mode links, manage webhooks and integrations

### Logging In

**API Mode:**
1. Enter your **Email** and **Password**
2. Click **Login**
3. The server returns a JWT access token (valid 24 hours) and a refresh token (valid 7 days)
4. The access token is stored in `localStorage` under `qatrial:token` and sent with every API request
5. When the access token expires, it is automatically refreshed using the refresh token

**localStorage Mode:**
1. Enter your **Email** and **Password**
2. Click **Login**
3. Your session persists in `localStorage` under `qatrial:auth` until you log out

### Inviting Users (API Mode, Admin Only)

1. Navigate to **Settings** or the user management area
2. Click **Invite User**
3. Enter the new user's email and assign a role (admin, qa_manager, qa_engineer, auditor, or reviewer)
4. The invited user can then register with that email

### Changing User Roles (API Mode, Admin Only)

Admins can change any user's role via the `PUT /api/users/:id/role` endpoint or through the user management UI.

### Logging Out

Click the **user menu** in the header and select **Logout**. A logout event is recorded in the audit trail. In API mode, the stored token is removed from localStorage.

### Signature Re-Authentication

When applying an electronic signature, you must re-enter your password. After successful re-authentication, a **15-minute window** is granted during which additional signatures do not require re-authentication. This aligns with 21 CFR Part 11.200(a) re-authentication requirements.

---

## 3. Project Setup Wizard (7 Steps)

The Setup Wizard guides you through creating a new project with regulatory-aware templates. It appears automatically on first launch or when you click **New Project** (after confirming you want to discard existing data).

### Step 0: Compliance Starter Pack

The first step offers 4 pre-configured compliance starter packs for common regulatory frameworks:

| Pack | What It Auto-Fills |
|------|--------------------|
| **FDA Software Validation (GAMP 5)** | US, Software/IT vertical, Validation project type, 7 modules (Part 11, CSV, audit trail, e-signatures, data integrity, change control, access control, document control) |
| **EU MDR Medical Device QMS** | DE (EU), Medical Devices vertical, Quality System type, 9 modules (risk, CAPA, supplier, training, deviation, etc.) |
| **FDA GMP Pharmaceutical Quality** | US, Pharma vertical, Quality System type, 10 modules (cGMP, data integrity, change control, CAPA, etc.) |
| **ISO 27001 + GDPR Compliance** | DE (EU), Software/IT vertical, Compliance type, 7 modules (access control, risk, backup, data integrity, etc.) |

Select a pack to auto-fill the country, vertical, project type, and module selections. You can then review and modify any setting in subsequent steps.

Click **Start from Scratch** to skip this step and configure everything manually.

### Step 1: Country Selection

**What it determines:**
- Which regulatory authority templates are loaded (e.g., FDA requirements for US, PMDA for Japan)
- For EU countries, the EU base templates are loaded first, then country-specific overlays
- Which industry verticals are available in Step 2 (not all verticals are available in all countries)
- The regulatory references embedded in generated requirements

**How it works:**
- 37 countries are available, organized by region (Americas, Europe, Asia)
- Use the search box to quickly filter countries
- Click a country card to select it

**Demo Projects:**
- Countries with demo projects display a "Demo available" badge
- Click **Load Demo** to pre-fill the entire wizard with a realistic demo project
- Loading a demo sets the country, vertical, project metadata, project type, and modules, then advances to Step 2 so you can review and customize before creating

### Step 2: Industry Vertical

**What each vertical means:**

| Vertical | GxP Focus | Risk Taxonomy |
|----------|-----------|---------------|
| Pharmaceuticals | GMP, GCP, GLP, GDP, GVP, GDocP | ICH Q9 |
| Biotechnology | GMP (Biologics), GCP, GLP | ICH Q9 |
| Medical Devices | QMSR, ISO 13485, IEC 62304, ISO 14971 | ISO 14971 |
| Clinical Research (CRO) | GCP, GLP, GDocP | ICH Q9 |
| Clinical Laboratories | GLP, GDocP, ISO 15189 | FMEA |
| Logistics / GDP / GSP | GDP, GSP | FMEA |
| Software and IT (GAMP/CSV) | GAMP 5, CSV, Part 11 | GAMP 5 |
| Cosmetics / Chemical / Env. | GMP, GLP, REACH | Generic |
| Aerospace | AS9100D, DO-178C | FMEA |
| Chemical / Environmental | GLP, REACH, CLP | FMEA |

**Which standards apply:** The vertical selection determines which regulatory standards are referenced in the generated requirements and tests. For example, selecting "Medical Devices" loads ISO 13485, ISO 14971, IEC 62304, and EU MDR 2017/745 references.

**Optional skip:** You may click **Skip -- use generic templates** to proceed without a vertical selection. This uses only country-level templates without industry-specific requirements.

### Step 3: Project Metadata

| Field | Required | Description |
|-------|----------|-------------|
| Project Name | Yes | A descriptive name (e.g., "MedDevice Firmware v2") |
| Description | No | Brief project description for documentation context |
| Owner | No | Name of the person or team responsible |
| Version | No | Version identifier (defaults to "1.0") |

All fields except Project Name are optional. The owner and version are displayed in the header and included in reports.

### Step 4: Project Type

Select the type of project that best describes your work. The project type loads additional type-specific template content within the selected vertical.

| Project Type | When to Use |
|-------------|-------------|
| **Software / Web App** | Software development and validation projects (web apps, mobile, desktop) |
| **Embedded / IoT** | Hardware, firmware, IoT device projects requiring IEC 62304 or similar |
| **Quality System (QMS)** | Setting up or improving a Quality Management System, SOPs, process controls |
| **Validation** | IQ/OQ/PQ protocols, CSV (Computer System Validation), method validation |
| **Clinical** | Clinical studies, trials, and investigations (GCP-focused) |
| **Compliance / Audit** | Regulatory compliance assessment and audit preparation projects |
| **Supplier Quality** | Supplier qualification and ongoing oversight programs |
| **Empty** | No templates. Start with a completely blank project. Skips Step 5 (modules) entirely |

Selecting **Empty** skips the module selection step and goes directly to the preview with zero pre-generated requirements or tests.

### Step 5: Quality Modules

Quality modules add focused sets of requirements and tests to your project. Each module addresses a specific quality control domain. You can select any combination.

| Module | Description | Typical Req Count |
|--------|-------------|-------------------|
| Audit Trail | Event logging with timestamps and user identification | 5 |
| Electronic Signatures | 21 CFR Part 11 / EU Annex 11 compliant signatures | 5 |
| Data Integrity (ALCOA+) | Attributable, Legible, Contemporaneous, Original, Accurate | 5 |
| Change Control | Change requests, impact assessment, approval workflow | 5 |
| CAPA | Corrective and preventive actions with root cause analysis | 5 |
| Deviation Management | Deviation recording, classification, investigation | 5 |
| Training Management | Training plans, competency assessment, records | 5 |
| Supplier Qualification | Supplier assessment, audit, approval, review | 5 |
| Complaint Handling | Intake, investigation, trending, reporting | 5 |
| Risk Management | Hazard identification, risk estimation and control | 5 |
| Document Control | Version control, review/approval, distribution | 5 |
| Backup and Disaster Recovery | Backup schedule, restore testing, business continuity | 5 |
| Access Control / SoD | Role-based access, segregation of duties | 5 |
| Validation / CSV | URS, FS, DS, IQ/OQ/PQ protocols | 5 |
| Traceability Matrix | Full requirement to design to test traceability | 5 |

**"Select All" option:** Click **Select All** to add every module at once, or **Deselect All** to clear your selection. The header shows a count of how many modules you have selected.

**How modules compose with verticals:** Module requirements and tests are added *on top of* the country and vertical templates. If a module requirement duplicates one already provided by the country or vertical template (matched by title), the later entry wins during deduplication. This means you get a clean, non-redundant set of requirements.

### Step 6: Preview and Customize

Before creating the project, you see a preview of all generated requirements and tests.

- **Requirement list:** Shows all requirements that will be created, with category tags and titles
- **Test list:** Shows all tests that will be created, with category tags and titles
- **Checkboxes:** Each item has a checkbox. Deselect any items you do not want included
- **Counts:** The header shows "Requirements (selected/total)" and "Tests (selected/total)"
- **Select All / Deselect All:** Bulk toggle buttons for quick editing
- **Create Project button:** Shows the final count of items that will be created

Click **Create Project** to finalize. The wizard closes and you arrive at the Requirements tab with your newly generated project.

---

## 4. Requirements Management

### Creating Requirements

1. Navigate to the **Requirements** tab
2. Click the **Requirement** button (top right)
3. Fill in the modal form:
   - **Title** (required): A concise requirement statement
   - **Description** (required): Detailed specification of what must be fulfilled
   - **Status**: Draft (default), Active, or Closed
4. Click **Save**

The requirement is assigned an auto-generated ID (e.g., REQ-001, REQ-002). In API mode, IDs are generated per-project on the server.

### Editing and Deleting

- **Edit:** Click the pencil icon on any requirement row. The edit modal opens with all fields pre-filled. Modify and save.
- **Delete:** Click the trash icon. A confirmation dialog warns that all links to tests will also be removed. Confirm to delete.

When a requirement is deleted, the system automatically removes its ID from the `linkedRequirementIds` of all tests that reference it, maintaining referential integrity. In API mode, the backend handles this cleanup server-side.

### Status Workflow

Requirements follow a three-state lifecycle:

```
Draft  -->  Active  -->  Closed
```

| Status | Meaning |
|--------|---------|
| **Draft** | Initial state. Requirement is being written or reviewed. Not yet baselined. |
| **Active** | Requirement has been approved/baselined and is actively being tested against. |
| **Closed** | Requirement has been fully verified or is no longer applicable. |

Change the status via the edit modal's status dropdown.

### Searching and Sorting

- **Search:** Use the search box at the top of the requirements table to filter by title or description text
- **Sorting:** Click any column header to sort ascending/descending. The table supports sorting by ID, title, status, risk level, and regulatory reference.

### Understanding Enriched Metadata

Requirements generated from templates include additional metadata fields:

| Field | Description |
|-------|-------------|
| **Tags** | Categorical labels used for test linking (e.g., "audit-trail", "data-integrity") |
| **Risk Level** | Severity classification: low, medium, high, or critical |
| **Regulatory Ref** | Specific regulatory clause reference (e.g., "21 CFR 11.10(e)") |
| **Jurisdictions** | Country codes where this requirement applies |
| **Verticals** | Industry verticals where this requirement is relevant |
| **Evidence Hints** | Suggestions for what evidence is needed to demonstrate compliance |

### AI Features per Requirement

Each requirement row provides three AI action buttons:

1. **Generate Tests (AI):** Opens the Test Generation Panel to auto-generate test cases for this requirement. See [Section 8](#8-ai-features) for details.
2. **Classify Risk (AI):** Opens the Risk Classification Panel to get an AI-proposed severity and likelihood rating. See [Section 8](#8-ai-features) for details.
3. **Quality Check (AI):** Opens the Quality Check Panel to analyze the requirement for vagueness, untestability, ambiguity, incompleteness, duplicate risk, and missing acceptance criteria.

### Signing/Approving Requirements

Click the signature/shield icon on a requirement to open the Electronic Signature Modal. This records a formal signature with meaning (authored, reviewed, approved, verified, or rejected), reason, and authentication. See [Section 12](#12-compliance-features) for the full signature workflow.

---

## 5. Test Management

### Creating Tests

1. Navigate to the **Tests** tab
2. Click the **Test** button (top right)
3. Fill in the modal form:
   - **Title** (required): Descriptive test case title
   - **Description** (required): Test procedure, steps, and expected outcomes
   - **Status**: Not Run (default), Passed, or Failed
   - **Linked Requirements**: Multi-select checkboxes to link this test to one or more requirements
4. Click **Save**

Tests are assigned auto-generated IDs (e.g., TST-001, TST-002).

### Linking Tests to Requirements

The test creation and edit modals include a **Linked Requirements** section showing all available requirements as checkboxes. Select any number of requirements to create traceability links. The count of linked requirements is displayed in the section header.

When templates are composed during project setup, tests are automatically linked to requirements via **tag-based matching**. A test's `linkedReqTags` are compared against each requirement's `tags`, and matches are converted into direct ID links.

### Status Tracking

Tests follow a three-state lifecycle:

```
Not Run  -->  Passed
             \--> Failed
```

| Status | Meaning |
|--------|---------|
| **Not Run** | Test has not been executed yet |
| **Passed** | Test was executed and met all acceptance criteria |
| **Failed** | Test was executed and did not meet acceptance criteria |

### Viewing Linked Requirement Tags

Each test row shows its linked requirements in a compact format. Click on a linked requirement to navigate to it.

---

## 6. Excel/CSV Import and Export

### Importing Data (3-Step Wizard)

QAtrial supports importing requirements and tests from CSV, TSV, and XLSX-as-CSV files.

**Step 1: Upload**
1. Navigate to the header toolbar and click **Import**
2. The Import Wizard opens with a drag-and-drop file zone
3. Drop your CSV/TSV file or click to browse
4. The system auto-detects the delimiter (comma, semicolon, or tab)

**Step 2: Map Columns**
1. The wizard shows detected columns and sample rows
2. For each column, select the corresponding QAtrial field (title, description, status, tags, risk level, regulatory ref)
3. The system auto-suggests mappings based on header names (e.g., a column named "Title" maps to the title field)
4. A preview of the first 3 mapped rows is shown for verification

**Step 3: Review and Import**
1. Select the entity type: Requirements or Tests
2. Choose duplicate handling: Skip, Overwrite, or Create New
3. Review the import summary
4. Click **Import**
5. A progress indicator shows the import status
6. On completion, a result summary shows how many items were created, skipped, or overwritten
7. All imports are logged in the audit trail

The Import Wizard works in both standalone mode (writes directly to Zustand stores) and server mode (calls the API).

### Exporting Data (CSV)

1. Navigate to the header toolbar and click **Export**
2. The Export Panel opens
3. Select what to export:
   - **Requirements** -- All requirements as CSV
   - **Tests** -- All tests as CSV
   - **All** -- Requirements and tests combined
4. Click **Export**
5. A UTF-8 BOM CSV file downloads immediately

In server mode, the export is generated server-side via `GET /api/export/:projectId/csv?type=requirements|tests|all`.

---

## 7. Dashboard and Analytics

Navigate to the **Evaluation** tab to access the dashboard. It contains seven sub-tabs:

### Overview Tab

The Overview tab provides a snapshot of project quality metrics:

- **Coverage Card:** A prominent percentage showing how many requirements have at least one linked test. Displays "X / Y Requirements" covered.
- **Requirement Status Chart (Pie):** Visual breakdown of requirements by Draft / Active / Closed.
- **Test Status Chart (Bar):** Visual breakdown of tests by Not Run / Passed / Failed.
- **Traceability Matrix:** A grid showing which tests are linked to which requirements. Requirements are rows, tests are columns, and cells indicate links.
- **Orphaned Requirements:** Lists requirements that have no linked tests (coverage gaps).
- **Orphaned Tests:** Lists tests that are not linked to any requirements (potential waste).
- **Filter Bar:** Filter the view by requirement status and/or test status.

### Compliance Tab

The Compliance tab combines two views:

**Compliance Readiness Score**

A weighted composite score (0-100%) displayed as a circular gauge. Five metrics contribute:

| Metric | Weight | How Calculated |
|--------|--------|---------------|
| Requirement Coverage | 25% | Percentage of requirements in Active or Closed status |
| Test Coverage | 25% | Percentage of requirements with at least one linked test |
| Test Pass Rate | 20% | Percentage of tests with Passed status |
| Risk Assessed | 15% | Percentage of requirements with a risk level assigned |
| Signature Completeness | 15% | Percentage of requirements with approval signatures (placeholder) |

Each metric has its own progress bar with color coding:
- Green: 80% or above
- Yellow: 50-79%
- Red: Below 50%

**Penalty:** If any requirement has a "critical" risk level, the overall score is penalized by 10 points.

**Server-side dashboards:** In API mode, readiness scores and analytics are also available server-side via `GET /api/dashboard/:projectId/readiness`, with additional endpoints for missing evidence, approval status, CAPA aging, and risk summary.

**Gap Analysis**

- Click **Run Gap Analysis** to invoke the AI gap analysis engine
- The system sends your requirements and tests to the configured LLM provider
- Results show a per-standard breakdown: total clauses analyzed, covered, partial, and missing
- An overall readiness percentage is calculated (covered = 1.0, partial = 0.5, missing = 0.0)
- **Critical Gaps** section lists all partial and missing clauses with AI-generated suggestions
- Each gap has a **Generate Requirement** button to create a requirement addressing it

### Risk Tab

The Risk tab displays an interactive **5x5 severity-by-likelihood risk matrix**.

**How to read it:**
- X-axis: Severity (1=Negligible to 5=Critical)
- Y-axis: Likelihood (1=Rare to 5=Almost Certain)
- Cell colors indicate risk zones:
  - Green: Low risk (score 1-3)
  - Yellow: Medium risk (score 4-8)
  - Orange: High risk (score 9-15)
  - Red: Critical risk (score 16-25)
- Numbers in cells show how many requirements fall in that zone

**Clicking cells:** Click any cell to see the list of requirements in that risk zone.

**Bulk classification:** If unassessed requirements exist, a **Classify All Unassessed** button appears. This sends each unassessed requirement to the AI for risk classification in sequence. Results are saved directly to the requirements.

**Summary stats:** Shows counts of critical, high, medium, and low risk requirements plus unassessed count.

### Evidence Tab

The Evidence tab tracks per-requirement evidence completeness. A requirement has "complete evidence" when it has:
1. At least one linked test
2. A risk assessment (risk level assigned)
3. An approval signature

The **Evidence Score** is the percentage of requirements with all three elements complete. Each requirement is listed with checkmarks indicating which evidence components are present.

### CAPA Tab

The CAPA (Corrective and Preventive Action) tab focuses on failed tests:

- **Total Failed Tests:** Count of tests with Failed status
- **Failed Test List:** Each failed test is shown with its linked requirement
- **Suggest CAPA (AI):** Button on each failed test to generate an AI-powered CAPA suggestion containing:
  - Root Cause analysis
  - Containment action
  - Corrective Action
  - Preventive Action
  - Effectiveness Check criteria

### Trends Tab

The Trends tab shows current snapshot charts:

- **Requirements by Status:** Bar chart showing Draft / Active / Closed counts
- **Tests by Status:** Bar chart showing Not Run / Passed / Failed counts
- **Risk Distribution:** Chart showing distribution across risk levels
- **Coverage by Category:** Coverage percentage broken down by requirement category

### Portfolio Tab

The Portfolio tab provides a multi-project overview table showing:
- Project name, country, vertical
- Readiness percentage
- Health status (On Track / At Risk / Blocked)
- Requirement and test counts
- Last updated timestamp

Note: This is an **enterprise feature**. The current version displays a placeholder indicating that QAtrial Enterprise is required for multi-project management.

---

## 8. AI Features

### Configuring an LLM Provider

Before using any AI feature, you must configure at least one LLM provider. Navigate to **Settings** > **AI Providers** tab.

#### Anthropic (Claude)

1. Click **Add Provider**
2. Set **Name** to something descriptive (e.g., "Claude Sonnet")
3. Set **Type** to "Anthropic"
4. **Base URL** auto-fills to `https://api.anthropic.com`
5. Enter your **API Key** (starts with `sk-ant-`)
6. Enter the **Model** name (e.g., `claude-sonnet-4-20250514`)
7. Select **Purposes** (leave "All" checked to use for everything)
8. Adjust **Max Tokens** (default 2000) and **Temperature** (default 0.3)
9. Set **Priority** (1 = highest priority)
10. Ensure **Enabled** is checked
11. Click **Save**

#### OpenRouter

1. Click **Add Provider**
2. Set **Type** to "OpenAI-compatible"
3. Set **Base URL** to `https://openrouter.ai/api/v1`
4. Enter your OpenRouter API key
5. Enter the model identifier (e.g., `anthropic/claude-sonnet-4`)
6. Configure purposes, tokens, temperature as needed
7. Click **Save**

#### Ollama (Local)

1. Click **Add Provider**
2. Set **Type** to "OpenAI-compatible"
3. Set **Base URL** to `http://localhost:11434/v1`
4. Leave **API Key** empty (Ollama does not require one)
5. Enter the model name (e.g., `llama3.1`)
6. Click **Save**

#### Server-Side AI Proxy

For production deployments, configure the AI provider via server environment variables instead of client-side settings. This keeps API keys secure on the server:

1. Set `AI_PROVIDER_TYPE` to `anthropic` or `openai`
2. Set `AI_PROVIDER_URL` to the provider's base URL
3. Set `AI_PROVIDER_KEY` to your API key
4. Set `AI_PROVIDER_MODEL` to the model name

The server exposes `POST /api/ai/complete` which proxies LLM calls without exposing the API key to the browser.

After saving, click the **lightning bolt** icon to test the connection. A green checkmark indicates success with latency information.

### Purpose-Scoped Routing Explained

Each provider can be assigned to one or more purposes:

| Purpose | Used For |
|---------|----------|
| All | Fallback for any unmatched purpose |
| Test Generation | AI-generated test cases from requirements |
| Gap Analysis | Regulatory gap analysis against standards |
| Risk Classification | Severity/likelihood risk scoring |
| Report Narrative | AI-written report sections (VSR, Executive Brief) |
| Requirement Decomp | Breaking down requirements into sub-requirements |
| CAPA | Corrective and preventive action suggestions |
| Quality Check | Requirement quality analysis |

**Routing algorithm:**
1. For a given purpose, find all enabled providers whose purpose list includes that specific purpose
2. Sort by priority (lower number = higher priority)
3. Use the first match
4. If no specific match, fall back to providers with "All" purpose
5. If still no match, the AI feature shows an error

This allows you to route different AI tasks to different models (e.g., a powerful model for report generation, a faster model for risk classification).

The **Purpose Routing** table on the Settings page shows which provider currently handles each purpose.

### Using the Test Case Generator

1. Go to the **Requirements** tab
2. Click **Generate Tests (AI)** on any requirement row
3. The Test Generation Panel opens and automatically starts generating
4. The AI produces 4-6 test cases, each showing:
   - **Confidence score** (color-coded: green >=90%, yellow >=70%, red <70%)
   - Title and description
   - Numbered test steps
   - Expected result
   - Regulatory standard reference (when applicable)
5. For each test case, you can:
   - **Accept:** Creates the test and links it to the requirement
   - **Edit:** Opens inline editing (modify before accepting)
   - **Reject:** Removes the suggestion from the list
6. **Bulk actions:**
   - **Accept High Confidence:** Accepts only tests with >=90% confidence
   - **Accept All:** Accepts all remaining test cases

### Using Risk Classification

1. Go to the **Requirements** tab
2. Click **Classify Risk (AI)** on any requirement row
3. The Risk Classification Panel opens and automatically classifies
4. Results show:
   - Severity score (1-5)
   - Likelihood score (1-5)
   - Computed risk score (severity x likelihood, out of 25)
   - Risk level (Low / Medium / High / Critical)
   - Safety class (when applicable for the vertical)
   - AI reasoning explaining the classification
   - Confidence score
   - Model that generated the result
5. Click **Accept** to save the risk level to the requirement, or **Reject** to discard

### Using Quality Check

1. Go to the **Requirements** tab
2. Click the **sparkles icon** (Quality Check) on any requirement row
3. The Quality Check Panel opens and analyzes the requirement
4. Results show issue cards for detected problems:
   - **Vague**: Requirement uses imprecise language
   - **Untestable**: Requirement cannot be objectively tested
   - **Ambiguous**: Requirement has multiple interpretations
   - **Incomplete**: Requirement is missing information
   - **Duplicate risk**: Requirement overlaps with existing ones
   - **Missing criteria**: Requirement lacks acceptance criteria
5. Each issue shows severity (error, warning, info) and a suggestion
6. Click **Apply** on any suggestion to update the requirement text

### Running Gap Analysis

1. Go to the **Evaluation** tab, then the **Compliance** sub-tab
2. Click **Run Gap Analysis**
3. The system collects applicable standards from your requirements' regulatory references
4. If no standards are found, defaults are used (e.g., 21 CFR Part 11, EU Annex 11)
5. Results show:
   - Per-standard clause coverage (covered / partial / missing)
   - Overall readiness percentage
   - Critical gaps with AI suggestions for remediation

### Getting CAPA Suggestions

1. Go to the **Evaluation** tab, then the **CAPA** sub-tab
2. Find a failed test in the list
3. Click **Suggest CAPA (AI)**
4. The AI generates a structured CAPA with root cause, containment, corrective action, preventive action, and effectiveness check

### Understanding Confidence Scores

Every AI-generated result includes a confidence score (0-100%):

| Range | Color | Interpretation |
|-------|-------|---------------|
| 90-100% | Green | High confidence. The AI is very confident this is accurate. |
| 70-89% | Yellow | Medium confidence. Review carefully before accepting. |
| Below 70% | Red | Low confidence. The AI is uncertain. Manual review strongly recommended. |

---

## 9. Reports

### Available Report Types

| Report Type | Description | AI-Generated |
|------------|-------------|:---:|
| **Validation Summary Report (VSR)** | Complete 7-section audit-ready report with executive summary, scope, methodology, results, traceability, and conclusion | Yes |
| **Traceability Matrix Export** | Full requirement-to-test traceability table with coverage analysis | No |
| **Gap Analysis Report** | Summary of requirements without test coverage (gap identification) | No |
| **Risk Assessment Report** | Risk distribution summary with critical requirement details | No |
| **Executive Compliance Brief** | C-level one-page compliance status with key metrics and recommended actions | Yes |
| **Regulatory Submission Package** | Formatted for a specific regulatory authority (FDA, EMA, MHRA, PMDA, etc.) with cover sheet and full VSR sections | Yes |

### How to Generate a Report (Step-by-Step)

1. Navigate to the **Reports** tab
2. Click the card for your desired report type (it highlights when selected)
3. Configure options:
   - **Format:** HTML or PDF
   - **Include e-signatures:** Toggle to include signature blocks in the report
   - **Target Authority** (submission package only): Select from FDA, EMA, MHRA, PMDA, Health Canada, TGA, ANVISA, or NMPA
4. Click **Generate Report**
5. Wait for generation (AI-powered reports may take a few seconds)

### Reviewing AI-Generated Sections

For reports that include AI-generated content (VSR, Executive Brief, Submission Package):
- Each section is labeled as AI-generated or data-assembled
- Review each section for accuracy before distribution
- Use the **Approve Section** button to formally sign off on reviewed sections

### Downloading Reports

After generation, the report preview displays all sections in a formatted view. Use the **Download** button to save the report as an HTML file, or the **PDF** button to export as a PDF document. The filename includes the project name and date.

### PDF Export

The **PDF** button on the report preview generates a professional PDF document with:
- **Cover page** with project name, version, date, and company information
- **Table of contents** with page numbers
- **Signature blocks** for formal sign-off (when e-signatures are enabled)
- All report sections formatted for print

---

## 10. Evidence Management

### Overview

Evidence management tracks the completeness of supporting documentation for each requirement. The `useEvidenceStore` manages evidence attachments with completeness tracking.

### Adding Evidence

1. Navigate to the **Requirements** tab
2. Click the evidence/paperclip icon on a requirement row
3. Add evidence attachments:
   - **Type:** Document, screenshot, test result, approval record, or other
   - **Description:** What this evidence demonstrates
   - **Reference:** Link or file reference to the actual evidence

### Evidence Completeness

A requirement has "complete evidence" when it has:
1. At least one linked test
2. A risk assessment (risk level assigned)
3. An approval signature
4. At least one evidence attachment

The **Evidence Score** on the dashboard shows the percentage of requirements meeting all criteria. The `useEvidenceStore` provides per-requirement completeness tracking via the `EvidenceAttachment` type.

---

## 11. CAPA Workflow

### Overview

The CAPA (Corrective and Preventive Action) system has a full lifecycle managed by `useCAPAStore` on the client and the `/api/capa` routes on the server.

### CAPA Lifecycle

```
open --> investigation --> in_progress --> verification --> resolved --> closed
```

| Status | Description |
|--------|-------------|
| **open** | CAPA record created, awaiting investigation |
| **investigation** | Root cause analysis in progress |
| **in_progress** | Corrective and preventive actions being implemented |
| **verification** | Effectiveness of actions being verified |
| **resolved** | Actions verified as effective |
| **closed** | CAPA formally closed with documented evidence |

**Status transition enforcement:** In API mode, the backend enforces valid status transitions. You cannot skip stages (e.g., jump directly from "open" to "resolved"). Each transition is logged in the audit trail.

### Creating a CAPA Record

1. Go to the **Evaluation** tab, then the **CAPA** sub-tab
2. Find a failed test and click **Suggest CAPA (AI)** for an AI-generated starting point, or click **Create CAPA** to start manually
3. Fill in the CAPA details:
   - **Root Cause:** Analysis of the underlying problem
   - **Containment:** Immediate action to contain the issue
   - **Corrective Action:** Steps to fix the problem
   - **Preventive Action:** Steps to prevent recurrence
   - **Effectiveness Check:** Criteria for verifying the actions worked

### Managing CAPA Records

- Use the CAPA dashboard to view all records by status
- Advance records through the lifecycle stages
- Each status transition is logged in the audit trail
- CAPA records are stored via `useCAPAStore` (client) or in PostgreSQL (API mode)

---

## 12. Compliance Features

### Electronic Signatures

Electronic signatures in QAtrial follow the 21 CFR Part 11 and EU Annex 11 model. Signatures use the **real user identity** from `useAuthStore` (localStorage mode) or from the JWT token (API mode).

**When to use:** Apply a signature when formally authoring, reviewing, approving, verifying, or rejecting a requirement, test, or report section.

**The Signature Modal:**
1. A context banner shows what you are signing (entity type, ID, title)
2. Your **name and role** are pre-filled from the logged-in user profile
3. Select a **Meaning**:
   - **I authored this** -- You created or wrote this record
   - **I reviewed this** -- You reviewed the record for accuracy
   - **I approve this** -- You formally approve the record
   - **I verified this** -- You verified the record against source data
   - **I reject this** -- You formally reject the record with cause
4. Enter a **Reason for signing** (required): Explain why you are signing
5. Enter your **Password** (required): Re-authenticate to confirm identity
6. Click **Sign and Apply**

**Re-authentication window:** After entering your password, a **15-minute window** is granted. Additional signatures within this window do not require re-entering your password. The `verifyForSignature()` and `isSignatureValid()` functions in `useAuthStore` manage this window.

**Warning when not logged in:** If no user is logged in, the signature modal displays a warning that signatures require an authenticated user. You must log in before signing.

The signature is permanently recorded in the audit trail with the signer's name, role, timestamp, meaning, method, and reason.

**Disclaimer:** "By signing, you confirm this record is accurate and complete."

### Audit Trail

QAtrial maintains a comprehensive audit trail of all actions. In API mode, audit entries are stored in an **append-only PostgreSQL table** (`AuditLog`) that cannot be modified or deleted through the API. Access the audit trail via the **Audit Trail** button in the header.

**Viewing:**
- Entries are displayed in a timeline format, newest first
- Each entry shows: action badge (Created/Modified/Deleted/etc.), entity type and ID, timestamp, and user name
- Signed entries display a shield icon and signature details
- Entries with value changes show a **View Diff** expandable section showing previous and new values

**Filtering:**
- Use the date range picker (From/To) to narrow the time window
- Default view shows the last 30 days
- When viewing from a specific entity, only that entity's audit entries are shown
- In API mode, filter by project, entity type, action, or date range via query parameters

**Exporting:**
- **Export Trail (CSV):** Downloads all filtered entries as a CSV file with columns: Timestamp, Action, User, Entity Type, Entity ID, Previous Value, New Value, Reason, Signature Meaning, Signer
- **Export Trail (PDF):** Opens the browser print dialog for the current view
- In API mode, use `GET /api/audit/export?format=csv` for server-side CSV export

**Auto-logging:** All requirement, test, CAPA, risk, and project CRUD operations are automatically logged to the audit trail with the real user identity. In API mode, the backend's `logAudit()` service function records every change with previous and new values as JSON.

**Tracked actions:**

| Action | Description |
|--------|-------------|
| Created | A new entity was created |
| Modified | An existing entity was updated |
| Deleted | An entity was removed |
| Status changed | An entity's status was changed |
| Linked | A test was linked to a requirement |
| Unlinked | A link between test and requirement was removed |
| Approved | An entity was formally approved |
| Rejected | An entity was formally rejected |
| Signed | An electronic signature was applied |
| Exported | Data was exported |
| Report generated | A report was generated |
| AI Generate | An AI generation was triggered |
| AI Accept | An AI-generated result was accepted |
| AI Reject | An AI-generated result was rejected |
| Login | A user logged into the system |
| Logout | A user logged out of the system |
| Import | Data was imported into the system |

### Change Control

Change control governs how modifications to critical records are managed.

**How it works per vertical:**

For **strict verticals** (Pharmaceuticals, Medical Devices, Biotechnology), change control is automatically configured with:
- Approval required for: requirements, tests, reports, risk assessments, documents
- Minimum 2 approvers required
- Reason required for all changes
- Electronic signature required
- Auto-revert on change: When an approved record is modified, its approval status is automatically reverted, requiring re-approval

For all other verticals, change control starts with default (lenient) settings that can be manually configured.

**Approval workflows:** When change control is active for an entity type, modifications trigger an approval workflow. The entity enters a "Pending Approval" state until the required number of approvers sign off.

---

## 13. Audit Mode (Read-Only Shareable Links)

### Overview

Audit Mode allows administrators to generate time-limited, read-only links that auditors can use to review project data without logging in. This is designed for regulatory audits and external reviews.

### Generating an Audit Link (Admin Only)

1. Click the **Share Audit Link** button in the header bar (only visible to users with the admin role)
2. Select an expiry duration:
   - **24 hours** -- for day-of audit access
   - **72 hours** -- for multi-day reviews
   - **7 days** -- for extended audit periods
3. Click **Generate Link**
4. The system creates a time-limited JWT token and generates a URL
5. Click **Copy** to copy the URL to your clipboard
6. Share the URL with the auditor (via email, secure message, etc.)

### Auditor Access (No Login Required)

1. The auditor opens the shared URL (format: `/audit/{token}`)
2. No login is required -- the token IS the authentication
3. An amber **"Read-Only"** banner appears at the top with the expiry countdown
4. The auditor sees a 7-tab read-only view:

| Tab | Contents |
|-----|----------|
| **Overview** | Project summary, readiness score, key metrics |
| **Requirements** | Full requirements list with metadata |
| **Tests** | Full tests list with status and linked requirements |
| **Traceability** | Requirement-to-test traceability matrix |
| **Evidence** | Evidence completeness per requirement |
| **Audit Trail** | Complete audit history |
| **Signatures** | All electronic signatures with details |

5. **Print** and **Download Report** buttons are available for offline review
6. When the token expires, the page shows a graceful expiry message

### API Endpoints

- `POST /api/audit-mode/create` -- Admin generates a token (requires admin role)
- `GET /api/audit-mode/:token/project` -- Read project data (no auth required)
- `GET /api/audit-mode/:token/requirements` -- Read requirements (no auth required)
- `GET /api/audit-mode/:token/tests` -- Read tests (no auth required)
- Plus endpoints for traceability, evidence, audit trail, signatures, and report

---

## 14. Settings

The Settings page is accessed via the **gear icon** in the header. It is organized into tabs:

### AI Providers Tab

Configure LLM providers for AI features. See [Section 8: AI Features](#8-ai-features) for detailed instructions on adding Anthropic, OpenRouter, and Ollama providers.

- Add, edit, delete providers
- Test connection with lightning bolt icon
- Purpose routing table showing which provider handles each AI purpose
- Token usage statistics

### Webhooks Tab

Configure webhooks to receive notifications when events occur in QAtrial.

1. Click **Add Webhook**
2. Enter a **Name** and **URL** (the endpoint that will receive POST requests)
3. Optionally enter a **Secret** for HMAC-SHA256 payload signing
4. Select **Events** to subscribe to:
   - requirement.created, requirement.updated, requirement.deleted
   - test.created, test.updated, test.failed
   - capa.created, capa.status_changed
   - approval.requested, approval.approved, approval.rejected
   - signature.created
   - evidence.uploaded
5. Click **Save**
6. Use the **Test** button to send a test payload to your endpoint

Webhooks include an HMAC-SHA256 signature in the `X-QAtrial-Signature` header for payload verification.

### Integrations Tab

Configure connections to external systems.

**Jira Cloud:**
1. Click **Connect Jira**
2. Enter your Jira **Base URL** (e.g., `https://yourcompany.atlassian.net`)
3. Enter your Jira **Email** and **API Token**
4. Enter the **Project Key** to sync with
5. Click **Connect** -- the system validates the connection
6. Once connected, you can:
   - Sync requirements bidirectionally (QAtrial requirement to Jira issue)
   - Import Jira issues as requirements
   - View sync status

**GitHub:**
1. Click **Connect GitHub**
2. Enter the **Repository** (format: `owner/repo`)
3. Enter your **Personal Access Token**
4. Click **Connect** -- the system validates the connection
5. Once connected, you can:
   - Link pull requests to requirements
   - Import CI test results from GitHub Actions workflow runs
   - View connection status

### SSO Tab

View and manage SSO (OIDC) configuration. SSO is configured via environment variables:

| Variable | Description |
|----------|-------------|
| `SSO_ENABLED` | Set to `true` to enable SSO |
| `SSO_ISSUER_URL` | Your identity provider's issuer URL |
| `SSO_CLIENT_ID` | OIDC client ID |
| `SSO_CLIENT_SECRET` | OIDC client secret |
| `SSO_CALLBACK_URL` | Callback URL (default: `http://localhost:3001/api/auth/sso/callback`) |
| `SSO_DEFAULT_ROLE` | Default role for auto-provisioned users (default: `qa_engineer`) |

Compatible identity providers: Okta, Azure AD/Entra ID, Auth0, Keycloak, Google Workspace.

---

## 15. Connector Setup

### Overview

QAtrial provides a connector framework for integrating with external systems. In addition to the Jira and GitHub integrations (see [Settings](#14-settings)), the framework supports additional connectors.

### Configuring a Connector

1. Navigate to the **Settings** tab
2. Scroll to the **Connectors** section
3. Click **Add Connector**
4. Select a connector type:
   - **Jira** -- Import/export requirements and tests to/from Jira issues
   - **Azure DevOps** -- Sync with Azure DevOps work items
   - **CSV** -- Import from or export to CSV files
   - **Custom** -- Configure a custom REST API connector
5. Fill in the configuration:
   - **Name:** A descriptive name for this connection
   - **Base URL:** The API endpoint for the external system
   - **Credentials:** API key, token, or authentication details
   - **Field Mappings:** Map QAtrial fields to external system fields
6. Click **Test Connection** to verify connectivity
7. Click **Save**

### Syncing Data

After configuring a connector:
1. Select the connector from the list
2. Choose a sync direction: **Import**, **Export**, or **Bidirectional**
3. Click **Sync**
4. Review the sync results showing items synced and any errors

Sync records are stored in `useConnectorStore` and can be reviewed for troubleshooting.

---

## 16. Data Management

### Import/Export (JSON Format)

**Exporting:**
1. Click the **Export** button in the header toolbar
2. A JSON file downloads containing:
   - Project metadata
   - All requirements
   - All tests
   - Counter states (for ID generation continuity)
3. Filename format: `project-name-YYYY-MM-DD.json`

**Importing:**
1. Click the **Import** button in the header toolbar
2. Select a previously exported JSON file
3. The system validates:
   - Version compatibility (must be version 1)
   - Array structure for requirements and tests
   - Referential integrity (dangling test links to non-existent requirements are stripped)
4. On success, a message confirms "Imported X requirements and Y tests"

### Data Persistence

QAtrial supports two persistence modes:

**localStorage Mode (Standalone/Demo)**

All data is stored in the browser's `localStorage` under these keys:

| Key | Contents |
|-----|----------|
| `qatrial:project` | Project metadata |
| `qatrial:requirements` | Requirements array and counter |
| `qatrial:tests` | Tests array and counter |
| `qatrial:audit` | Audit trail entries |
| `qatrial:llm` | LLM provider configurations and usage stats |
| `qatrial:theme` | Light/dark theme preference |
| `qatrial:locale` | Selected language and country |
| `qatrial:change-control` | Change control configuration |
| `qatrial:auth` | User profile, session, and authentication state |
| `qatrial:risks` | Persisted risk assessments |
| `qatrial:capa` | CAPA records and lifecycle state |
| `qatrial:gaps` | Gap analysis runs and results |
| `qatrial:evidence` | Evidence attachments |
| `qatrial:ai-history` | AI artifact provenance and usage statistics |
| `qatrial:connectors` | Connector configurations and sync records |

Data persists across browser sessions. Clearing browser data or localStorage will erase all project data.

**PostgreSQL Mode (Production/Team)**

When the backend server is running, data is stored in PostgreSQL across 15 database models:

| Model | Contents |
|-------|----------|
| `User` | User accounts with email, password hash, name, role, organization |
| `Organization` | Company/team container for multi-tenant isolation |
| `Workspace` | Project grouping within an organization |
| `Project` | Project metadata including country, vertical, modules, type |
| `Requirement` | Requirements with seqId (REQ-NNN), linked to a project |
| `Test` | Tests with seqId (TST-NNN), linked requirement IDs, linked to a project |
| `Risk` | Risk assessments with severity, likelihood, detectability, auto-computed score |
| `CAPA` | CAPA records with full lifecycle state |
| `AuditLog` | Append-only audit log with timestamp, user, action, entity, previous/new values |
| `Evidence` | Evidence attachments linked to requirements |
| `Approval` | Approval workflow records |
| `Signature` | Electronic signature records |
| `Webhook` | Webhook configurations with events and HMAC secrets |
| `Integration` | External integration configurations (Jira, GitHub) |

In PostgreSQL mode, data persists across browser sessions and devices. Multiple users can work on the same project simultaneously. The JWT access token is stored in `localStorage` under `qatrial:token`.

### Theme Switching

Click the **sun/moon icon** in the header to toggle between light and dark modes. The preference is saved and persists across sessions. The theme system uses CSS custom properties for consistent styling.

### Language Switching

Use the **Language Selector** dropdown in the header to switch between 12 supported languages. The change takes effect immediately across all UI text.

---

## 17. Docker Deployment (Admin)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial

# Copy environment template
cp .env.example .env

# Edit .env with your configuration:
# - Set JWT_SECRET to a strong random string
# - Set AI_PROVIDER_KEY if using AI features
# - Set SSO_* variables if using SSO

# Start QAtrial + PostgreSQL
docker-compose up -d
```

QAtrial is accessible at `http://localhost:3001`.

### What Docker Compose Provides

| Service | Image | Purpose |
|---------|-------|---------|
| `app` | Built from `Dockerfile` | QAtrial application (frontend + backend) |
| `db` | `postgres:16-alpine` | PostgreSQL database |

**Volumes:**
- `pgdata` -- Persistent PostgreSQL data
- `uploads` -- Uploaded files (evidence, imports)

**Health checks:** The PostgreSQL container has health checks configured. The app container waits for the database to be healthy before starting.

### Production Configuration

For production deployments:

1. **Set a strong JWT_SECRET:** `JWT_SECRET=<random-64-char-string>`
2. **Configure AI provider** (optional): Set `AI_PROVIDER_TYPE`, `AI_PROVIDER_URL`, `AI_PROVIDER_KEY`, `AI_PROVIDER_MODEL`
3. **Configure SSO** (optional): Set `SSO_ENABLED=true` and the OIDC variables
4. **Use a reverse proxy** (nginx, Caddy, etc.) for TLS termination
5. **Back up the `pgdata` volume** regularly

### Multi-Stage Dockerfile

The Dockerfile uses a 3-stage build:
1. **Stage 1 (frontend):** Builds the React frontend with Vite
2. **Stage 2 (server):** Installs production dependencies and copies the server code + built frontend
3. **Stage 3 (runtime):** Slim Node.js 20 Alpine image that runs the server

In production mode, the server serves the built frontend as static files from the `dist/` directory.

---

## 18. Demo Projects

QAtrial includes 16 realistic demo projects spanning different countries, verticals, and project types. Loading a demo pre-fills the Setup Wizard with all fields.

### Available Demo Projects

| Country | Company | Vertical | Project Type |
|---------|---------|----------|-------------|
| US | Meridian Therapeutics | Pharmaceuticals | Software |
| CA | NorthStar BioSystems | Medical Devices | Quality System |
| MX | Laboratorios Azteca S.A. de C.V. | Pharmaceuticals | Compliance |
| DE | Rheinland MedTech GmbH | Medical Devices | Embedded |
| GB | Thames Pharma Solutions Ltd | Pharmaceuticals | Validation |
| FR | Laboratoires Pasteur-Curie S.A. | Biotechnology | Quality System |
| IT | Farmaceutica Adriatica S.r.l. | Pharmaceuticals | Compliance |
| ES | Laboratorios Ibericos S.L. | Clinical Research (CRO) | Clinical |
| NL | Van der Berg Diagnostics B.V. | Clinical Laboratories | Quality System |
| PT | Farmacia Atlantica Lda. | Logistics | Compliance |
| JP | Tokyo BioScience K.K. | Biotechnology | Validation |
| CN | Shanghai Precision Medical Technology Co., Ltd. | Medical Devices | Compliance |
| KR | Seoul Pharmaceutical Co., Ltd. | Pharmaceuticals | Validation |
| IN | Mumbai MedTech Pvt. Ltd. | Software and IT | Software |
| TH | Bangkok Pharma Co., Ltd. | Pharmaceuticals | Compliance |

### How to Load a Demo Project

1. Start a new project (click **New Project** or launch the app fresh)
2. In Step 0 (Compliance Starter Pack), click **Start from Scratch**
3. In Step 1 (Country Selection), find a country with the "Demo available" badge
4. Click **Load Demo** on that country's card
5. The wizard pre-fills all fields and advances to Step 2
6. Review and adjust any settings as desired
7. Continue through the remaining wizard steps
8. Click **Create Project** on the Preview step

Demo projects include realistic company names, descriptions in the local language (with English translations), and appropriate module selections for the project's vertical and type.

---

## 19. Medical Device Track

The Medical Device Track provides specialized modules for organizations working under ISO 13485, EU MDR, and 21 CFR 820 (QMSR). These features are available when the project vertical is set to **Medical Devices**.

### Complaint Management

Complaint Management handles the full lifecycle of product complaints from intake through resolution, with regulatory reporting support.

**Complaint Intake:**
1. Navigate to the **Complaints** section
2. Click **New Complaint**
3. Fill in the intake form:
   - **Title** (required): Brief description of the complaint
   - **Description** (required): Detailed account of the issue
   - **Severity**: Minor, Major, or Critical
   - **Product**: The device or product involved
   - **Regulatory Reportable**: Flag if this complaint triggers a regulatory report (MDR, MedWatch)
4. Click **Save** -- the complaint is created with status "received"

**Investigation Workflow:**

Complaints follow a four-stage lifecycle:

```
received --> investigating --> resolved --> closed
```

| Status | Description |
|--------|-------------|
| **received** | Complaint has been recorded and is awaiting investigation |
| **investigating** | Root cause investigation is in progress |
| **resolved** | Investigation complete, actions taken |
| **closed** | Complaint formally closed with documented rationale |

Advance the complaint through stages by clicking the **Advance Status** button on the complaint detail view. Each transition is logged in the audit trail.

**FSCA Tracking:**
If a complaint leads to a Field Safety Corrective Action, use the **FSCA Reference** field to link the corrective action. This supports EU MDR Articles 82-86 reporting requirements.

**CAPA Linkage:**
Link a complaint to a CAPA record using the **Link CAPA** button. This creates bidirectional traceability between the complaint investigation and corrective/preventive actions.

**Trending Dashboard:**
The complaint trending dashboard displays:
- Complaints by month (bar chart)
- Complaints by severity (pie chart)
- Complaints by product (grouped bar chart)
- Mean Time to Resolution (MTTR) trending (line chart)

Use these trending views for signal detection as required by 21 CFR 820.198(c) and EU MDR Article 88.

### Supplier Quality Scorecards

Supplier Quality Scorecards track supplier performance and automate qualification decisions.

**Creating a Supplier:**
1. Navigate to the **Suppliers** section
2. Click **New Supplier**
3. Enter supplier details: Name, performance metrics (defect rate, on-time delivery)
4. The system auto-calculates a risk-based score

**Performance Metrics:**
- **Defect Rate**: Percentage of defective deliveries (lower is better)
- **On-Time Delivery**: Percentage of deliveries arriving on schedule (higher is better)
- **Risk Score**: Composite score (0-100) calculated from all metrics

**Auto-Requalification:**
When a supplier's risk score drops below 50, their status is automatically set to **conditional**. This triggers a review workflow requiring re-evaluation before the supplier can be used for critical components.

**Audit Scheduling:**
Schedule and track supplier audits:
1. Click **Schedule Audit** on a supplier record
2. Set the audit date and scope
3. Record audit findings after completion
4. The next audit date is tracked with reminders for overdue audits

### Post-Market Surveillance (PMS)

PMS aggregates data from complaints, adverse events, and literature to support PSUR (Periodic Safety Update Report) generation.

**PMS Entries:**
1. Navigate to the **PMS** section
2. Add entries from various sources (complaints, clinical data, literature)
3. Mark entries for inclusion in the next PSUR

**PSUR Data Assembly:**
The PSUR assembly view collects all relevant PMS entries for a reporting period, allowing you to review and organize data before generating the report.

**Summary Dashboard:**
The PMS summary dashboard shows:
- Total PMS entries by source
- Trends over reporting periods
- Entries flagged for regulatory action

### UDI Management

UDI (Unique Device Identification) Management tracks device identifiers and supports regulatory database exports.

**Device Identifier Tracking:**
1. Navigate to the **UDI** section
2. Click **New UDI Entry**
3. Enter the Device Identifier (DI), Production Identifier (PI), and device name
4. Flag registration status for GUDID and EUDAMED

**GUDID/EUDAMED Export:**
Click **Export** and select the target format:
- **GUDID**: Export in FDA Global Unique Device Identification Database format
- **EUDAMED**: Export in EU Medical Device Database format

---

## 20. Pharma Track

The Pharma Track provides specialized modules for pharmaceutical manufacturing under FDA cGMP (21 CFR 210/211), ICH guidelines, and EU GMP. These features are available when the project vertical is set to **Pharmaceuticals**.

### Electronic Batch Records

Electronic Batch Records replace paper-based manufacturing records with template-driven, digitally controlled execution.

**Creating a Batch Record:**
1. Navigate to the **Batch Records** section
2. Click **New Batch Record**
3. Select a **Template** (master batch record template)
4. Enter the **Batch Number** and **Product**
5. Click **Create** -- the batch record is initialized with all template steps

**Step Execution:**
Each batch step must be individually executed:
1. Open the batch record
2. For each step, click **Execute**
3. Record the actual values, observations, and any deviations
4. If a deviation occurs, click **Record Deviation** to document it inline
5. Steps can be reviewed by exception -- only deviations and critical steps require reviewer attention

**E-Signature Release:**
After all steps are complete:
1. The batch record enters "pending_review" status
2. A reviewer checks the record (review-by-exception mode highlights deviations)
3. Click **Release Batch** to apply an electronic signature (21 CFR Part 11 compliant)
4. The batch status changes to "released"

**Yield Calculation:**
The system automatically calculates batch yield from input/output values recorded during step execution. Yield outside acceptable ranges is flagged.

### Stability Study Manager

The Stability Study Manager supports ICH Q1A-compliant stability testing programs.

**Creating a Study:**
1. Navigate to the **Stability** section
2. Click **New Study**
3. Configure the study design:
   - **Product**: Name and batch reference
   - **Storage Conditions**: Long-term (25C/60%RH), Intermediate (30C/65%RH), Accelerated (40C/75%RH) per ICH Q1A
   - **Pull Schedule**: Define time points for sample testing (e.g., 0, 3, 6, 9, 12, 18, 24, 36 months)

**Recording Results:**
1. Open a study and navigate to the pull schedule
2. At each time point, click **Add Reading** to enter test results
3. The system automatically checks for:
   - **OOS (Out of Specification)**: Results outside the specification limits
   - **OOT (Out of Trend)**: Results showing unexpected trending patterns

**Trending Charts:**
The stability trending view displays parameter values over time with:
- Specification limits shown as horizontal reference lines
- OOS/OOT flags highlighted in red/amber
- Regression lines for trend analysis

### Environmental Monitoring

Environmental Monitoring tracks cleanroom and facility conditions to ensure compliance with EU GMP Annex 1 and USP standards.

**Setting Up Monitoring Points:**
1. Navigate to the **Environmental Monitoring** section
2. Click **New Monitoring Point**
3. Configure:
   - **Location**: Room, zone, or equipment identifier
   - **Parameter**: Temperature, humidity, particulate count, viable count, etc.
   - **Alert Threshold**: Value that triggers a warning
   - **Action Threshold**: Value that triggers a formal excursion

**Recording Readings:**
1. Select a monitoring point
2. Click **Add Reading** and enter the measured value
3. The system automatically detects excursions:
   - Values exceeding the **alert threshold** generate a warning notification
   - Values exceeding the **action threshold** generate an excursion record requiring investigation

**Trending:**
The trending view shows readings over time with threshold lines, excursion markers, and moving averages for each monitoring point.

### Training Management (LMS-lite)

Training Management provides a lightweight Learning Management System for GMP training compliance.

**Setting Up Training Plans:**
1. Navigate to the **Training** section
2. Click **New Training Plan**
3. Define the plan: name, required courses, target roles/users, and due dates

**Managing Courses:**
1. Click **New Course** to define a training course
2. Enter course details: title, description, content, and qualification criteria
3. Assign courses to training plans

**Recording Completions:**
1. When a user completes training, click **Record Completion**
2. Enter the completion date and any assessment scores
3. The system tracks expiration dates for time-limited qualifications

**Training Matrix:**
The training matrix shows a grid of users vs. courses with completion status:
- Green: Completed and current
- Amber: Due soon or expiring
- Red: Overdue or expired

**Compliance Dashboard:**
The training compliance dashboard shows:
- Overall compliance percentage
- Users with overdue training
- Courses approaching recertification deadlines

**Auto-Retraining Triggers:**
When a document (SOP) is revised or a CAPA triggers a procedural change, the system automatically flags affected users for retraining based on their role assignments.

---

## 21. Software/GAMP Track

The Software/GAMP Track provides specialized modules for computerized system validation under GAMP 5, EU Annex 11, and 21 CFR Part 11. These features are available when the project vertical is set to **Software and IT (GAMP/CSV)**.

### Live Impact Analysis

Live Impact Analysis visualizes the dependency chain between requirements, tests, CAPAs, and documents to understand the ripple effect of changes.

**Viewing the Graph:**
1. Navigate to the **Impact Analysis** section
2. The system displays a graph showing requirement/test chains
3. Click any node to see its upstream and downstream dependencies

**What-If Analysis:**
1. Click **What-If Analysis**
2. Select a requirement and describe a proposed change
3. The system traces all downstream impacts:
   - Tests that would need re-execution
   - CAPAs that reference the requirement
   - Documents (SOPs) that would need revision
4. Review the impact report before proceeding with the change

### Computerized System Inventory

The Computerized System Inventory maintains a catalog of all computerized systems with their GAMP 5 classification, validation status, and periodic review schedule.

**Adding a System:**
1. Navigate to the **System Inventory** section
2. Click **New System**
3. Enter system details:
   - **Name**: System name and version
   - **GAMP 5 Category**: 1 (Infrastructure), 3 (Non-configured), 4 (Configured), or 5 (Custom)
   - **Validation Status**: Not Validated, In Progress, Validated, or Retired
   - **Risk Level**: Low, Medium, High, or Critical
   - **Next Review Date**: When the next periodic review is due

**Overdue Detection:**
The system automatically flags entries where the next review date has passed. Overdue systems appear with a red indicator in the inventory list and on the dashboard.

### Periodic Review Automation

Periodic Review Automation guides users through the EU Annex 11 Section 11 periodic evaluation process.

**Running a Periodic Review:**
1. Select a system from the inventory
2. Click **Start Periodic Review**
3. The 7-step wizard walks you through:
   - Step 1: System identification and scope
   - Step 2: Validation status review (auto-pulled from inventory)
   - Step 3: Change history review (auto-pulled from audit trail)
   - Step 4: Incident/deviation review
   - Step 5: Configuration and access review
   - Step 6: Risk assessment update
   - Step 7: Conclusion and next review scheduling
4. The system auto-pulls data where available, reducing manual effort
5. On completion, the next review date is automatically scheduled

---

## 22. Cross-Vertical Features

These features are available across all industry verticals and project types.

### Document Lifecycle Management

Document Lifecycle Management provides full SOP versioning with formal status workflow and distribution tracking.

**Creating a Document:**
1. Navigate to the **Documents** section
2. Click **New Document**
3. Enter the document details: title, type (SOP, work instruction, form, etc.), and content
4. The document is created in "draft" status

**SOP Versioning Workflow:**

Documents follow a six-stage lifecycle:

```
draft --> review --> approved --> effective --> superseded --> retired
```

| Status | Description |
|--------|-------------|
| **draft** | Document is being written or revised |
| **review** | Document is out for review and comment |
| **approved** | Document has been formally approved |
| **effective** | Document is the current active version |
| **superseded** | A newer version has replaced this document |
| **retired** | Document is no longer in use |

Advance the document through stages using the **Advance Status** button. Each transition requires appropriate permissions and is logged in the audit trail.

**Version History:**
Click **History** on any document to see its complete version history, including who made changes, when, and what was modified.

**Distribution Tracking:**
The **Distribution** view shows which users/roles have been assigned to read and acknowledge a document, along with their acknowledgment status and dates.

### Closed-Loop CAPA Enhancement

The enhanced CAPA system supports cascade triggers that automatically create follow-up actions when a CAPA is resolved.

**Cascade Triggers:**
When a CAPA resolution involves procedural changes, the system can automatically:
- **Create an SOP Update task**: If the CAPA identifies a document that needs revision, a document update request is generated in the Document Lifecycle Management module
- **Create Retraining tasks**: If the CAPA affects trained procedures, retraining assignments are generated in the Training Management module for all affected personnel

These cascade triggers ensure that CAPA actions are fully closed-loop, with no orphaned follow-up items.

### Audit Management

Audit Management provides scheduling, tracking, and follow-up for internal and external audits.

**Creating an Audit:**
1. Navigate to the **Audit Management** section
2. Click **New Audit**
3. Enter audit details:
   - **Title**: Descriptive name (e.g., "Annual ISO 13485 Internal Audit")
   - **Audit Type**: Internal, External, Supplier, or Regulatory
   - **Scheduled Date**: When the audit is planned
   - **Scope**: Areas and processes to be audited

**Recording Findings:**
During or after the audit:
1. Open the audit record
2. Click **Add Finding**
3. Enter the finding details:
   - **Description**: What was observed
   - **Classification**: Observation, Minor, Major, or Critical
4. Optionally link the finding to a CAPA for corrective action tracking

**Finding Classifications:**

| Classification | Definition | Required Action |
|---------------|------------|-----------------|
| **Observation** | Opportunity for improvement, not a non-conformity | No mandatory action, recommended improvement |
| **Minor** | Non-conformity that does not affect product quality or safety | CAPA recommended, corrective action within 30 days |
| **Major** | Non-conformity that could affect product quality or safety | CAPA required, corrective action within 15 days |
| **Critical** | Non-conformity that directly impacts product quality or patient safety | Immediate containment required, CAPA mandatory |

**CAPA Linkage:**
Link any finding to a CAPA record for formal corrective action tracking. The audit record shows the status of linked CAPAs, providing visibility into audit follow-up completion.
