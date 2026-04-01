# Changelog

All notable changes to QAtrial are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-01

### Major: Foundation Hardening & Compliance Correctness

This release addresses critical gaps between compliance claims and actual system behavior,
operationalizes the AI system, and adds the engineering infrastructure needed for a
regulated-quality product.

### Added

#### Engineering Infrastructure
- **Vitest test framework** with React Testing Library, jsdom environment, and initial test suite
  - Unit tests for all Zustand stores (requirements, tests, audit)
  - Template composition tests (dedup by stable ID)
  - AI provider resolution tests
  - ID generator tests
- **ESLint config hardening**: ignore `.claude/worktrees`, fix unused variable warnings
- **Code splitting**: Lazy-loaded tab components via `React.lazy()` + `Suspense`, Vite manual chunks for vendor libs (react, recharts, tanstack-table, i18n, zustand), templates, and AI modules

#### Authentication & RBAC (`useAuthStore`)
- User registration and login with role-based access control
- 5 roles: `admin`, `qa_manager`, `qa_engineer`, `auditor`, `reviewer`
- Full permission matrix (create/edit/delete requirements, tests; approve; sign; generate reports; configure AI; manage users; view audit trail; export data)
- Signature verification with password re-authentication and 15-minute verification window
- Session management with configurable timeouts

#### Audit Trail Completeness
- **Auto-audit on all CRUD operations**: Requirements store and Tests store now automatically log create, update, delete, status_change, link, and unlink events to the audit trail
- Audit entries now use real user identity from the auth store instead of placeholder `'current-user'`
- New audit actions: `ai_generate`, `ai_accept`, `ai_reject`, `login`, `logout`, `import`

#### Electronic Signature Improvements
- Real identity verification: signatures now use authenticated user's name, role, department, and ID
- Password re-authentication required for each signature (with 15-minute cache window)
- Clear warning when no user is logged in (signatures marked as `password-unverified`)
- Auth failure error display in signature modal

#### Persisted Domain Entities (previously transient component state)
- **Risk assessments** (`useRiskStore`): Durable risk assessment records with severity, likelihood, detectability, mitigation strategy, residual risk, and full audit trail
- **CAPA records** (`useCAPAStore`): Full lifecycle states (open → investigation → in_progress → verification → resolved → closed), AI suggestion storage, owner assignment, due dates, priority levels
- **Gap analysis runs** (`useGapStore`): Persisted gap analysis results with readiness scores, review status, and run history
- **Evidence attachments** (`useEvidenceStore`): File attachments linked to requirements, tests, CAPA records, and risk assessments, with evidence type classification, completeness tracking, and review workflow

#### AI System Operationalization
- **JSON schema validation** (`ai/validation.ts`): Structured validators for test generation, risk classification, gap analysis, and CAPA suggestion responses
- **Safe JSON parsing**: Handles markdown code fences, trailing commas, unquoted keys
- **Retry/repair logic**: Configurable max retries with validation between attempts
- **AI provenance & history** (`useAIHistoryStore`): Full audit trail of every AI generation — model, temperature, tokens used, input context, raw response, parsed output, validation status, retry count, review status, acceptance status
- **Re-run history**: Query all previous AI generations for any entity, compare across runs
- **Usage statistics**: Total generations, token usage, acceptance rate, average retries, breakdown by artifact type
- **Server-side proxy** (`ai/proxy.ts`): Optional backend proxy (set `VITE_AI_PROXY_URL`) routes AI calls through a server — keeps API keys off the client, enables server-side audit logging, rate limiting, and caching

#### Gap Analysis → Requirement Generation
- "Generate Requirement" buttons in the gap analysis view now **actually create requirements** in the requirements store
- "Generate All Requirements" creates requirements for all critical (missing/partial) gaps at once
- Created requirements are tagged with `auto-generated`, `gap-analysis`, and the standard reference
- Visual feedback shows which gaps have already had requirements generated

#### PDF Export
- Print-optimized HTML-to-PDF export via browser print dialog
- Professional cover page with document classification, table of contents, and page numbers
- Section numbering with AI-generated badge indicators
- Signature block for Author, Reviewer, QA, and Approver

#### External Connector Framework
- Connector interface definitions for JIRA, Azure DevOps, GitHub, GitLab, Veeva Vault, MasterControl, TrackWise, SharePoint, Confluence, and custom systems
- `ConnectorConfig` with auth types (API key, OAuth2, basic, token), sync direction (push/pull/bidirectional), and field mapping rules
- Connector registry for plugin-style registration
- `useConnectorStore` for managing connector configurations and sync records

#### Template System
- **Stable template IDs**: Templates now use `templateId` field (format: `{source}:{category-slug}:{short-id}`) for deduplication instead of fragile title-based matching
- Backward-compatible: templates without `templateId` fall back to title-based dedup with `__title:` prefix
- Template provenance: optional `source` field tracks which template file contributed each requirement/test

### Changed
- `useRequirementsStore.addRequirement` now accepts optional `tags`, `riskLevel`, `regulatoryRef`, `evidenceHints` parameters
- `useTestsStore` link/unlink operations now automatically create audit trail entries
- `useAuditStore.log` uses real user identity from `useAuthStore` (falls back to `'system'`)
- `SignatureModal` integrates with `useAuthStore` for real identity verification
- `GapAnalysisView` persists results to `useGapStore` on each run
- `ReportPreview` adds PDF export button alongside HTML download and print
- `AppShell` uses `React.lazy()` for all tab components (RequirementsTable, TestsTable, EvaluationDashboard, ReportGenerator, ProviderSettings, AuditTrailViewer, SetupWizard)
- `TemplateRequirement` and `TemplateTest` interfaces now include `templateId` and `source` fields
- Vite config adds manual chunk splitting for vendor libraries and app feature areas
- AI client (`ai/client.ts`) checks for proxy mode before making direct API calls

### Fixed
- README documentation drift: verticals count corrected from 8 to 10 (added Aerospace, Chemical/Environmental)
- README country count corrected from "6 countries + EU" to "14 countries + EU-wide, 37 in wizard"
- ESLint now ignores `.claude/worktrees` directory (was scanning nested worktrees)
- Template deduplication no longer relies on titles (which could collide across sources)

## [1.0.0] - 2026-03-27

### Initial Release
- Requirements & test management with auto-generated IDs
- 6-step setup wizard (Country × Vertical × Project Type × Modules)
- 8 industry verticals with GxP-specific templates
- 15 composable quality modules
- 6 AI prompt engines (test gen, risk classification, gap analysis, CAPA, executive brief, VSR)
- 7 dashboard views (overview, compliance, risk, evidence, CAPA, trends, portfolio)
- 6 report types including regulatory submission packages
- Audit trail with electronic signatures
- Change control configurable per vertical
- 12-language i18n system
- Light/dark theming
- JSON import/export
