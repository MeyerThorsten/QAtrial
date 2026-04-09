# QAtrial Implementation Status

## Implemented Across the Last Nine Passes

These implementation passes focused on the highest-value Phase 1 convergence work from the roadmap. The goal was to reduce the mismatch between frontend server mode, backend route contracts, and the Prisma-backed data model, then push that convergence into the main app shell and audit-facing workflows. The latest passes also made the backend importable in tests, added route-level contract coverage for the repaired server-backed flows, hardened the core permission model around approvals, signatures, and destructive actions, and tightened the export/report path so audit-facing outputs use the real server-backed project model.

### 1. Frontend/Backend Contract Convergence

Implemented response unwrapping for the main API hooks so they work with the backend's current JSON envelopes:

- `useApiRequirements()`
- `useApiTests()`
- `useApiProjects()`
- `useApiAudit()`
- `useApiCapa()`
- `useApiRisks()`

This removes a class of silent failures where hooks expected arrays directly while the server returned objects such as `{ requirements: [...] }`, `{ tests: [...] }`, or `{ projects: [...] }`.

### 2. API Base Handling in Server Mode

Updated the shared API client to respect the stored server URL from `qatrial:api-url` instead of relying only on `VITE_API_URL`.

This makes server mode more coherent with the app-mode configuration and fixes cases where login/API requests would still hit the default local API address.

### 3. Approval Flow Parity

Implemented a convergence layer for approvals:

- added compatibility endpoints under `/api/approvals/:entityType/:entityId/request`
- added compatibility endpoints for `/approve`, `/reject`, and `/revoke`
- kept the existing `/api/approvals/request` and `/:id/review` model
- made approval rejection require a reason, while approval can proceed with a default reason
- added revoke support for pending approvals

Updated the frontend approval panel to use `/approvals/...` paths instead of the non-existent `/approval/...` paths.

### 4. Team/Workspace UI Parity

Implemented `GET /api/users/team` for the workspace/team modal and made invites tolerate a missing display name by deriving one from the invitee email address.

Also aligned the workspace role selector more closely with the backend RBAC model:

- `admin`
- `qa_manager`
- `qa_engineer`
- `reviewer`
- `auditor`

### 5. Dashboard Route Repairs

Repaired server dashboard logic that drifted from the current Prisma schema:

- replaced direct `project.orgId` assumptions with `project.workspace.orgId`
- replaced `requirementTestLink` assumptions with links derived from `test.linkedRequirementIds`
- fixed CAPA access from `prisma.cAPA`
- changed risk summary to use persisted `Risk` entities rather than non-existent risk fields on requirements

### 6. Audit Mode Route Repairs

Repaired audit-mode server routes to match the actual schema:

- project access now resolves through workspace/org relations
- traceability links are derived from test link arrays
- removed non-existent `evidenceType` field selection
- switched audit trail reads from `auditEntry` to `auditLog`
- switched ordering from non-existent `createdAt` fields to the actual `timestamp` fields where required
- fixed signature rendering to use `userName`/`userId` and `timestamp`

### 7. Backend Typecheck Gate

Added a real backend typecheck step:

- `tsconfig.server.json`
- `npm run typecheck`
- `npm run typecheck:server`

This is the first pass at putting backend code into the same validation loop as the frontend. The Prisma config file is intentionally excluded for now because its current config typing does not match the installed Prisma config type surface.

### 8. Shared Server-Backed Active Project Flow

Implemented a real server-backed active project path in the main shell:

- added optional `project.id` support to frontend project metadata
- added a shared `getProjectId()` helper so server mode can use the persisted project UUID instead of the project name
- added a shared project-data context for the app shell, wizard, and core tables
- synchronized server-backed projects, requirements, tests, and audit data into the existing Zustand stores in server mode
- added an active project selector in the shell for multi-project server workspaces

This changes server mode from "authenticated shell around local stores" to "server-backed shell that keeps the existing client stores as UI/cache state."

### 9. Setup Wizard Creates Real Server Projects

Implemented server-backed setup wizard creation:

- the wizard now creates a real backend project in server mode
- selected template requirements are created through `/api/requirements`
- selected template tests are created through `/api/tests`
- requirement-to-test links are rebuilt using the real server-generated requirement IDs
- the new project becomes the active shell project after creation

This closes one of the most important Phase 1 gaps: in server mode, new project setup is no longer a local-only illusion.

### 10. Server-Backed Requirements and Tests in the Main UI

The primary tables now use the shared server CRUD path in server mode while preserving standalone behavior:

- requirements create/update/delete now call the backend in server mode
- tests create/update/delete now call the backend in server mode
- the main shell keeps local table state synchronized from the shared server data flow

This means the main shell is no longer just reading server data; it can now round-trip the core entities through the backend.

### 11. Approval and Signature Lifecycle Hardening

Reworked approvals and signatures to behave like a server-backed workflow instead of a local audit inference:

- `EnhancedSignatureModal` now sends the correct server payload, including `projectId` and `password`
- server signature creation now logs entity-centric audit events (`sign`, `approve`, `reject`) instead of only logging a detached signature record
- approval review endpoints now accept and validate `signatureId`
- approvals no longer overwrite requirement/test statuses with invalid values such as `In Review` or `Approved`
- approvals can be queried by `projectId`, `entityType`, and `entityId`
- the approval panel now loads approval state and signature history from the backend in server mode
- approve/reject actions in server mode now go through the signature modal and then complete the approval review against the backend

This closes the earlier gap where server-mode approvals were mostly a local-state simulation.

### 12. Evidence and Audit Viewer Server Parity

Implemented a stronger server-backed audit/evidence path:

- `EvidencePanel` now loads entity evidence from the backend in server mode
- evidence upload updates the server-backed list immediately
- evidence delete now calls the backend in server mode
- server downloads now stream with authorization headers instead of trying to open a protected URL without auth
- `AuditTrailViewer` now uses backend audit data in server mode and keeps local export behavior for standalone mode
- backend audit actions that do not exist in the original client-only translation map are now humanized instead of rendering raw i18n keys

### 13. Project ID Cleanup Across Secondary Modules

Updated a large set of workflow-heavy screens to stop using `project.name` as the backend identifier in server mode and use the real project ID path instead. This includes:

- complaints
- documents
- stability studies
- design control
- batch records
- environmental monitoring
- audit schedule
- deviations
- UDI
- change control
- PMS

This removes a broad class of server-mode breakage where secondary modules would silently work only for local/demo data.

### 14. Backend App Bootstrap and Contract Tests

Refactored backend startup so the app can be imported without booting the server:

- moved route assembly into `server/app.ts`
- moved Prisma singleton creation into `server/lib/prisma.ts`
- reduced `server/index.ts` to a thin runtime bootstrap
- rewired routes/services away from importing Prisma through `server/index.ts`

Added backend contract coverage against the real Hono app in `server/app.contract.test.ts`.

The new suite validates:

- API health
- projects
- requirements
- tests
- approvals
- signatures
- evidence list/completeness/download/delete flows
- audit list/export
- team view and admin invite behavior

Vitest is now configured to run backend tests under the Node environment, and `npm test` includes the backend contract suite.

### 15. Core RBAC Hardening for Server-Backed Flows

Expanded the server permission model so it can distinguish between edit, delete, sign, and approve actions instead of treating all authenticated editors the same.

The backend now enforces these permission boundaries on the core routes:

- projects create/update require edit permission; delete requires delete permission
- requirements create/update require edit permission; delete requires delete permission
- tests create/update require edit permission; delete requires delete permission
- evidence upload requires edit permission; delete requires delete permission
- approval request/revoke requires edit permission
- approval review/approve/reject and reviewer inbox access require approve permission
- signature creation requires sign permission, and approval-style signatures require approve permission

This closes an important audit-readiness gap where a `qa_engineer` could previously delete or approve server-backed records through the API despite the frontend role model saying otherwise.

### 16. Signature Authentication and Approval UI Parity

Implemented the missing server-side password verification endpoint used by the server-mode signature modal:

- `POST /api/auth/verify-password`

This fixes the earlier frontend/backend mismatch where the signature modal tried to call a route that did not exist.

Also tightened the approval/signature UI behavior:

- approval actions are now gated by the same role model used for the server-backed path
- the approval panel no longer offers revoke after an approval has already been completed
- pending approvals now distinguish more clearly between reviewer actions and requester/admin revoke behavior
- the enhanced signature modal only offers signature meanings the current role is allowed to apply

### 17. Export and Report Path Hardening

Tightened the backend export surface so it is no longer just "authenticated means allowed":

- added export permission to the backend role model
- export endpoints now require export permission
- export and audit-export routes now verify that the requested project belongs to the authenticated user's organization before returning data

This closes a real server-side gap where a user with a valid token could request export data for an arbitrary project ID outside their organization.

Also cleaned up the frontend export/report callers:

- export panel now uses the shared API base helper instead of bypassing the stored server URL
- export/audit-share/report paths now use the real project ID helper instead of ad hoc `project.name` fallbacks
- audit export UI now reflects export permission availability
- report generation now stores both the real project ID and the human-facing project name so previews and PDF output stay readable without losing the canonical identifier

The backend contract suite now also covers:

- export overview and CSV success paths
- reviewer export denial
- audit export access checks under the stricter permission model

### 18. Workflow Module RBAC and Project-Scoped Access Hardening

Extended the same server-side access model into the remaining workflow-heavy modules that were still trusting raw IDs or only checking for authentication:

- tasks now scope list, my-tasks, and overdue queries to projects in the caller's organization
- task create/delete now require explicit edit/delete permission
- task completion now allows the assignee to complete their own task without opening broader edit rights
- comment thread reads now require `projectId` and validate org-scoped project access before loading a thread
- comment updates/deletes now validate project access before applying author/delete checks
- document list/detail/create/update/delete/version/review/retire/supersede flows now validate project access server-side
- document approval-stage transitions now require approval permission instead of piggybacking on generic edit permission
- audit-record schedule/list/detail/update/delete/finding routes now validate project access and enforce edit/delete permissions
- workflow template reads/updates/deletes/simulations are now scoped to the caller's organization
- workflow execution start/detail/action routes now validate both project access and template ownership
- workflow step actions now enforce the current step role, while delegated users can see and act on delegated inbox items

This closes a meaningful Phase 2 gap: workflow-heavy modules no longer assume the frontend will pass only safe IDs or keep users inside their own org/project boundaries.

The backend contract suite now additionally covers:

- document review permission enforcement
- task self-complete vs broader edit restrictions
- comment thread access scoping by project
- workflow step role enforcement
- delegated workflow inbox visibility
- audit schedule denial for inaccessible projects

### 19. Secondary Module Client Convergence and Broader Roadmap Start

Started the next broader-roadmap slice by moving a set of operational secondary modules onto the same shared client/access model that the core server-backed flows now use:

- documents, workflow templates/inbox, audit schedule, change control, and deviations now use the shared API client instead of module-local `fetch()` calls tied directly to `VITE_API_URL`
- these screens now respect the stored server URL in server mode instead of bypassing app-mode configuration
- action affordances in those screens now align more closely with the server permission model:
  - document create/version/review-submit use edit permission
  - document approve/effective/retire use approve permission
  - workflow template create/edit/delete use admin permission
  - audit schedule mutation actions use edit permission
  - change-control and deviation mutation controls now reflect edit/delete permissions
- delegated workflow inbox items continue to show actionable controls, matching the backend's delegated-step behavior instead of being over-restricted by a generic role check
- deviation trending now uses the shared server client path as well

This is the first concrete start on the broader roadmap beyond core convergence and hardening: operational workflow modules are now being pulled onto the same server-authoritative, shared-client foundation instead of staying as isolated legacy fetch islands.

The backend contract suite now also covers:

- change-control mutation denial for non-edit roles
- inaccessible change-control list access
- deviation root-cause denial for non-edit roles
- workflow template detail scoping by organization

### 20. Operational Dashboard and Quality-Event Hardening

Extended the broader-roadmap work into the next cluster of operational modules so they now follow the same server-authoritative patterns as the already-converged core:

- complaints now validate project access server-side for list, trending, detail, create, update, and delete, and they enforce edit/delete permissions for mutations
- PMS summary, entry, and PSUR routes now validate org-scoped project access, and PMS entry creation now requires edit permission
- UDI list/detail/export/create/update/delete now validate project access and enforce edit/delete permissions for mutations
- analytics anomaly routes now require the requested project to belong to the caller's organization before running cross-module anomaly queries
- supplier anomaly analytics are now limited to suppliers in the caller's organization instead of reading across all suppliers globally
- computerized system detail/update/delete/review/retire flows are now scoped to the caller's organization and require explicit edit/delete permissions where appropriate
- KPI dashboards are now org-scoped for list/detail/data access, private dashboards are no longer directly readable outside the creator/admin path, and dashboard/widget mutations now require edit permission plus creator/admin ownership
- KPI widget execution now scopes project-backed metrics to accessible project IDs and org-backed metrics to the caller's organization instead of querying global data by default

Also converged the matching frontend surfaces:

- complaint trending, PMS, UDI, analytics, system inventory, periodic review, and KPI screens now use the shared API client instead of module-local raw `fetch()` calls
- these modules now respect the stored server URL in server mode rather than bypassing it through ad hoc env-based API construction
- creation, edit, export, and workflow actions in those screens now reflect the same role model already used across the hardened core modules
- KPI dashboard ownership/edit affordances now line up more closely with the backend creator/admin rules

This is the first broader-roadmap slice that materially improves operational multi-user behavior, not just core CRUD parity: dashboards and quality-event modules now behave more like real org-scoped product surfaces instead of isolated demo-era screens.

The backend contract suite now also covers:

- complaint list denial for inaccessible projects
- complaint delete denial for non-delete roles
- PMS summary denial for inaccessible projects
- UDI export denial for inaccessible projects
- analytics denial for inaccessible projects
- computerized system detail scoping by organization
- KPI dashboard detail scoping by organization

### 21. Supplier and Training Convergence

Continued the remaining Phase 2 convergence work by hardening supplier and training modules around the same server-authoritative access model used by the core product:

- supplier list/detail/scorecard routes are now scoped to the caller's organization instead of trusting arbitrary supplier IDs
- supplier create/update/audit creation now require edit permission, and supplier delete now requires delete permission
- supplier portal admin endpoints now enforce permission checks and org-scoped supplier/link ownership before creating, listing, or revoking links
- training plans and courses are now created only within the caller's organization and require edit permission
- training record list, matrix, and compliance queries are now scoped through `course.orgId` instead of reading all training records globally
- training assignment requires edit permission and verifies that the assigned course belongs to the caller's organization
- training record updates now validate that the underlying course belongs to the caller's organization

Also converged the matching frontend surfaces:

- supplier scorecard and share-link flows now use the shared API client instead of direct env-based `fetch()` calls
- training dashboard now uses the shared API client, loads real org users for assignment, and gates assignment actions by permission
- supplier portal public pages now use the shared server base resolution instead of hardcoding `VITE_API_URL`, so portal access follows the same configured server endpoint as the rest of server mode
- supplier and training screens now surface permission and request errors more clearly instead of failing silently

This closes the next planned Sprint 1 slice from the remaining roadmap: supplier and training are no longer a separate trust model sitting beside the hardened core.

The backend contract suite now also covers:

- supplier detail scoping by organization
- supplier portal link creation denial for out-of-org suppliers
- training assignment denial for non-edit roles
- training record list scoping by organization
- training record update denial outside the caller organization

### 22. Pharma and Environmental Module Convergence

Completed the next planned secondary-module convergence slice by bringing the regulated pharma and environmental modules onto the same org-scoped, permission-enforced model used by the hardened core:

- batch record list, detail, create, update, delete, step-add, step-update, and release flows now validate project access through the caller's organization instead of trusting raw project or batch IDs
- batch create, update, and step mutations now require edit permission, and batch release now requires approve permission instead of allowing any authenticated user to attempt release
- batch step create and update now emit audit log entries so manufacturing execution changes are no longer a quiet mutation path outside the server audit trail
- stability study list, detail, create, update, delete, sample-add, trending, and OOS/OOT endpoints now validate project ownership through the caller's organization before returning or mutating study data
- stability study create/update/sample creation now require edit permission, delete now requires delete permission, and study updates now emit audit entries instead of mutating silently
- environmental monitoring point list, point creation, reading creation, readings lookup, excursions, and trending routes now validate project access through the caller's organization
- environmental monitoring point creation and reading creation now require edit permission, and reading creation now emits audit entries so excursion-relevant readings are captured in the audit trail

Also converged the matching frontend surfaces:

- batch record, stability study, and environmental monitoring screens now use the shared API client instead of direct env-based `fetch()` calls
- these screens now respect the configured server URL in server mode rather than bypassing it with module-local API base logic
- create, status-change, release, sample-add, point-create, and reading-add controls now follow the same frontend role gating already used across the other converged modules
- these screens now surface request and permission failures through inline error banners instead of mostly failing silently
- stability sample refresh and environmental reading refresh now reload the expanded detail view directly instead of accidentally collapsing the panel after a successful mutation

The backend contract suite now also covers:

- batch list denial for inaccessible projects
- batch release denial for non-approver roles
- stability study detail scoping by accessible project
- stability sample creation denial for non-edit roles
- environmental monitoring reading lookup denial outside the caller organization
- environmental monitoring reading creation denial for non-edit roles

## Validation Run

The following commands were run successfully after the implementation changes:

- `npm run test:server`
- `npm test`
- `npm run build`
- `npm run typecheck`

`npm test` now covers both the frontend tests and the new backend contract suite.

## Not Implemented Yet

These passes do **not** complete the full roadmap. The largest remaining Phase 1 and Phase 2 items are still open:

- fuller server-backed convergence for the remaining non-core modules that still manage their own fetch/mutation logic without shared hooks, especially the remaining reporting, notification, and tertiary supplier-adjacent surfaces
- broader RBAC and access review across tertiary routes that were not included in this hardening slice
- broader evidence completeness, export-bundle, multipart upload, and workflow convergence beyond the repaired hotspots
- hosted-ready operational baseline work such as stronger readiness/env validation, storage abstraction, and deployment-hardening still remains ahead
- deeper notification, reporting, and enterprise operational hardening from later roadmap phases
- broader backend contract coverage for secondary routes beyond the current workflow/document/audit/change/deviation/dashboard-quality-event/supplier-training additions

## Recommended Next Slice

The next implementation slice should focus on one of these two tracks:

1. **Remaining secondary module convergence**
   Apply the same shared-client, org-scoped access, and permission model to the remaining reporting, notification, tertiary supplier-adjacent, and other still-isolated secondary surfaces that sit outside the hardened path.

2. **Hosted-ready and audit-ready operational hardening**
   Complete export bundles, multipart upload coverage, readiness/env/storage hardening, stricter RBAC enforcement, and the remaining reporting/notification paths that still sit outside the hardened audit lifecycle.
