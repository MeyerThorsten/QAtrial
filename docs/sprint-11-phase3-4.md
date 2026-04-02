# Sprint 11: Phase 3 (Excel + Server AI) & Phase 4 (Compliance Packs + Audit Mode)

---

## Phase 3: Excel Import/Export + Server-Side AI

### Excel/CSV Import
**Backend** (`server/routes/import.ts`):
- `POST /api/import/preview` — upload CSV, auto-detect delimiter (comma/semicolon/tab), return columns + sample rows + suggested mapping
- `POST /api/import/execute` — create requirements or tests from mapped data, duplicate handling (skip/overwrite/create), audit logged

**Frontend** (`src/components/import/ImportWizard.tsx`):
- 3-step wizard: Upload → Map Columns → Review & Import
- Drag-and-drop file zone (CSV, TSV, XLSX-as-CSV)
- Auto-suggest column mapping from header names
- Preview of first 3 mapped rows
- Duplicate handling selector
- Progress + result summary
- Works in both standalone (direct Zustand write) and server mode (API)

### Excel/CSV Export
**Backend**: `GET /api/export/:projectId/csv?type=requirements|tests|all` — UTF-8 BOM CSV

**Frontend** (`src/components/import/ExportPanel.tsx`):
- Entity type selector + "Export" button
- Server mode: downloads from API
- Standalone mode: generates from Zustand stores

### Server-Side AI Proxy
**Backend** (`server/routes/ai.ts`):
- `POST /api/ai/complete` — proxies LLM calls (API keys stay server-side)
- `GET /api/ai/providers` — list providers (keys hidden)
- `POST /api/ai/providers/:id/test` — test connection
- Reads from env vars: `AI_PROVIDER_TYPE`, `AI_PROVIDER_URL`, `AI_PROVIDER_KEY`, `AI_PROVIDER_MODEL`
- Supports Anthropic + OpenAI-compatible APIs

### AI Requirement Quality Check
**Prompt** (`src/ai/prompts/qualityCheck.ts`):
- Checks for: vagueness, untestability, ambiguity, incompleteness, duplicate risk, missing criteria
- Returns `QualityIssue[]` with severity + suggestions

**UI** (`src/components/ai/QualityCheckPanel.tsx`):
- Sparkles icon button on each requirement row
- Shows issue cards with "Apply" button to fix requirement

---

## Phase 4: Compliance Packs + Audit Mode + Advanced RBAC

### Compliance Starter Packs
**4 pre-configured packs** (`src/templates/packs/index.ts`):

| Pack | Country | Vertical | Modules |
|------|---------|----------|---------|
| FDA Software Validation (GAMP 5) | US | software_it | 7 modules (Part 11, CSV, audit trail, e-sig...) |
| EU MDR Medical Device QMS | EU/DE | medical_devices | 9 modules (risk, CAPA, supplier, training...) |
| FDA GMP Pharmaceutical Quality | US | pharma | 10 modules (cGMP, data integrity, change control...) |
| ISO 27001 + GDPR Compliance | EU/DE | software_it | 7 modules (access control, risk, backup...) |

**Wizard integration** (`StepCompliancePack.tsx`): New Step 0 — select a pack to auto-fill everything, or "start from scratch". Wizard is now 7 steps (0-indexed).

### Audit Mode — Read-Only Shareable Links
**Backend** (`server/routes/auditmode.ts`):
- `POST /api/audit-mode/create` — admin generates time-limited JWT token (24h/72h/7d)
- 7 read-only `GET /:token/*` endpoints: project, requirements, tests, traceability, evidence, audit-trail, signatures, report
- No login required — token IS the auth

**Frontend** (`src/components/audit/AuditModeView.tsx`):
- Dedicated read-only view at `/audit/{token}`
- Amber "Read-Only" banner with expiry countdown
- 7 tabs: Overview, Requirements, Tests, Traceability, Evidence, Audit Trail, Signatures
- Print + Download Report buttons
- Handles expired links gracefully

**Share UI** (`src/components/audit/ShareAuditLink.tsx`):
- Admin-only button in header
- Expiry selection (24h/72h/7d) → generate → copy link

### Advanced RBAC (5 Roles)

| Role | View | Edit | Approve | Admin |
|------|------|------|---------|-------|
| admin | ✅ | ✅ | ✅ | ✅ |
| qa_manager | ✅ | ✅ | ✅ | ❌ |
| qa_engineer | ✅ | ✅ | ❌ | ❌ |
| auditor | ✅ | ❌ | ❌ | ❌ |
| reviewer | ✅ | ❌ | ✅ | ❌ |

New `requirePermission(permission)` middleware. Backward-compatible with legacy editor/viewer roles.

### Reporting Dashboards (Server-Side)
**Backend** (`server/routes/dashboard.ts`):
- `GET /api/dashboard/:projectId/readiness` — weighted compliance score
- `GET /api/dashboard/:projectId/missing-evidence` — requirements/tests without evidence
- `GET /api/dashboard/:projectId/approval-status` — counts by entity type × status
- `GET /api/dashboard/:projectId/capa-aging` — open CAPAs with aging buckets (0-7d, 7-30d, 30-90d, 90d+)
- `GET /api/dashboard/:projectId/risk-summary` — risk level counts + matrix data

---

## Files Summary

### Phase 3 — Created: 6, Modified: 6
New: import.ts (server), ai.ts (server), ImportWizard.tsx, ExportPanel.tsx, QualityCheckPanel.tsx, qualityCheck.ts
Modified: export.ts (server), index.ts (server), RequirementsTable.tsx, AppShell.tsx, en/common.json, de/common.json

### Phase 4 — Created: 7, Modified: 6
New: packs/index.ts, StepCompliancePack.tsx, auditmode.ts, AuditModeView.tsx, ShareAuditLink.tsx, dashboard.ts (server)
Modified: SetupWizard.tsx, auth.ts (middleware), users.ts, index.ts (server), App.tsx, en/common.json, de/common.json

## Build Status: Clean
