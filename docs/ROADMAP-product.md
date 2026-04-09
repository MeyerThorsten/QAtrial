# QAtrial — Concrete 3-Phase Roadmap: Converge -> Audit-Ready -> Expand

## Executive Summary

QAtrial already has broad product surface area: a strong React frontend, many domain modules, templates, AI prompt flows, and a Hono/Prisma backend foundation. The main delivery risk is no longer "missing ideas". It is platform convergence.

Today the codebase still operates as two partially overlapping systems:

- a mature client-side app centered on persisted Zustand stores
- a newer server-backed path with partial parity gaps between schema, routes, and frontend contracts

This roadmap turns the current direction into a concrete 3-phase execution plan:

1. **Phase 1 — Platform Convergence**: repair contracts, finish server-backed core flows, and put the backend inside the quality gate
2. **Phase 2 — Audit-Ready Product Core**: make approvals, evidence, audit trail, exports, dashboards, and workflow-heavy modules dependable enough for real teams
3. **Phase 3 — Vertical, Enterprise, and AI Expansion**: develop the full planned feature set in a controlled order after the platform is trustworthy

The rule for the next releases is simple:

**Do not add new major feature families until the existing platform contracts are aligned.**

---

## Planning Principles

- **One source of truth**: in multi-user mode the server is authoritative. Client stores become cache/UI state, not the system of record.
- **Depth before breadth**: audit-ready workflows matter more than adding another country, connector, or AI feature.
- **Commercial wedge before full expansion**: build one vertical deeply first, then sequence the rest.
- **Quality gates must cover the backend**: frontend-only build/test success is not sufficient.
- **Develop all major planned themes, but in order**: no feature family is dropped, but not all should start at once.

---

## Current Delivery Risks

These are the issues Phase 1 must explicitly address:

- Frontend server mode still depends heavily on local Zustand state for core entities.
- API hooks and route payloads are not fully aligned.
- Some backend routes no longer match the Prisma schema or naming conventions.
- Team/workspace, approval, and audit-mode flows are not fully end-to-end consistent.
- Current typecheck and test coverage focus mainly on `src/` and do not validate the backend surface in the same way.
- Documentation and feature breadth are ahead of the currently validated execution path.

---

## Current Execution Position

Based on the implemented work in [IMPLEMENTATION-STATUS.md](/Users/thorstenmeyer/Dev/QAtrial/docs/IMPLEMENTATION-STATUS.md), the roadmap should now be read from the current codebase position, not from zero.

- **Phase 1** is substantially complete.
  Core contract convergence, server-backed project/requirements/tests flows, backend typecheck, app bootstrap, team/workspace parity, and the main schema/route repairs are already in place.
- **Phase 2** is partially complete.
  Approvals/signatures, export/report hardening, workflow RBAC, audit-facing server parity, and several secondary operational modules have already been pushed onto the shared server-backed path.
- **Phase 2** still has meaningful unfinished work.
  The largest remaining gaps are the last non-core module convergence cluster, deeper evidence/export bundle hardening, hosted-ready operational baseline work, and notification/reporting maturity.
- **Phase 3** should be treated as largely unstarted as a coordinated delivery program.
  Some enabling work exists in the codebase, but the medical device, enterprise, pharma, AI, clinical, and geography waves have not yet been delivered as complete product programs.

---

## Remaining Development Phases and Sprint Plan

The remaining plan assumes **2-week sprints**. The goal is to turn the unfinished roadmap into an executable sequence from the current state of the codebase.

### Remaining Phase A — Finish Phase 2 Audit-Ready Core (Sprints 1-4)

**Goal**
- close the last server-convergence gaps
- complete the audit/export lifecycle
- make the product reliable enough for repeatable pilot use

#### Sprint 1 — Supplier and Training Convergence

**Primary epics**
- Epic 8 remainder

**Scope**
- move supplier scorecard, supplier portal admin flows, share-link flows, and supplier CRUD callers to the shared API client
- enforce org-scoped access and permission checks on supplier, supplier-portal, and training routes
- converge training plans, courses, records, compliance, and matrix screens on server-backed flows
- add backend contract tests for supplier/training visibility and mutation boundaries

**Exit criteria**
- supplier and training screens no longer rely on direct env-based `fetch()` paths
- org isolation is enforced consistently on supplier and training routes
- supplier/training contract coverage exists in the backend suite

#### Sprint 2 — Pharma and Environmental Module Convergence

**Primary epics**
- Epic 8 remainder

**Scope**
- converge batch records, stability studies, environmental monitoring, periodic review helpers, and remaining pharma dashboards onto the shared API client
- enforce project/org scoping and edit/delete rules across batch, stability, and envmon routes
- align analytics/reporting consumers with the server-backed project ID model end to end
- add contract tests for batch/stability/envmon access and mutation paths

**Exit criteria**
- pharma/environmental modules use server-backed project IDs consistently
- project access is enforced on all related backend routes
- remaining direct module-local server-mode fetch paths are materially reduced

#### Sprint 3 — Evidence, Export Bundle, and Multipart Hardening

**Primary epics**
- Epic 7 remainder

**Scope**
- complete multipart upload coverage for evidence and supplier uploads
- implement full ZIP-style audit export bundles with linked evidence metadata
- harden evidence completeness/reporting logic for missing files, orphaned records, and broken links
- add server tests for upload, download, export-bundle, and failure cases

**Exit criteria**
- evidence upload/download/export paths are fully contract-tested
- audit bundles include linked evidence and coherent metadata
- evidence completeness reporting is backed by validated server behavior

#### Sprint 4 — Notifications, Reporting, and Pilot Readiness

**Primary epics**
- Epic 8 remainder
- Epic 10 remainder

**Scope**
- finish notification center convergence and server-backed inbox behavior
- harden report generation, cross-module summaries, and dashboard visibility for pilot users
- close remaining high-value workflow/reporting gaps surfaced by internal QA
- run a pilot readiness checklist across auth, approvals, evidence, exports, notifications, dashboards, and onboarding

**Exit criteria**
- the product supports a single-team pilot without major local-only fallback behavior
- reporting and notification paths are server-backed and permission-aware
- a written pilot checklist exists with pass/fail status

### Remaining Phase B — Hosted-Ready Baseline and Medical Device Wedge (Sprints 5-8)

**Goal**
- turn the audit-ready core into a deployable product baseline
- deliver the first commercially deep medical-device workflow wave

#### Sprint 5 — Hosted-Ready Platform Baseline

**Primary epics**
- Epic 9

**Scope**
- add environment validation, startup readiness checks, storage configuration validation, and operational config docs
- formalize local vs S3-compatible upload storage behavior
- publish API documentation for the supported server surface
- add deployment bootstrap scripts or docs for customer-hosted pilots

**Exit criteria**
- deployment prerequisites are explicit and validated at startup
- API surface is documented enough for pilot integrations
- upload storage behavior is predictable across local and hosted setups

#### Sprint 6 — Self-Host and Customer Pilot Hardening

**Primary epics**
- Epic 9
- Epic 10 remainder

**Scope**
- package Docker/self-host deployment paths
- document backup, restore, migration, and seed/bootstrap flows
- add operational health/readiness endpoints and failure diagnostics
- run a customer-pilot dry run from clean environment to usable workspace

**Exit criteria**
- a customer can stand up a pilot environment with documented steps
- readiness/health paths cover database, storage, and critical services
- backup/restore and migration behavior is documented and tested to a reasonable level

#### Sprint 7 — Medical Device Depth I

**Primary epics**
- Epic 11

**Scope**
- implement DHF/DMR/DHR structure on top of the converged project/document/evidence model
- gate design-control progression with real approval/workflow transitions
- connect requirements, tests, risks, approvals, and evidence into the design-control path

**Exit criteria**
- medical-device projects can move through a gated design-control workflow
- DHF/DMR/DHR artifacts are represented as durable server-backed records
- audit/export views reflect the medical-device control structure

#### Sprint 8 — Medical Device Depth II and QMSR Readiness

**Primary epics**
- Epic 11

**Scope**
- deepen UDI, PMS, complaints, supplier, and post-market links into the medical-device workflow
- implement QMSR gap-assessment and transition reporting based on real records
- ship a coherent medical-device starter pack and demo/pilot flow

**Exit criteria**
- QAtrial has a credible first commercial wedge for medical-device teams
- QMSR reporting is tied to real evidence and workflow state
- the starter pack creates a usable medical-device project path

### Remaining Phase C — Enterprise, Pharma, AI, Clinical, and Expansion Waves (Sprints 9-16)

**Goal**
- expand breadth only after the product is stable, deployable, and commercially focused

#### Sprint 9 — Enterprise Operations I

**Primary epics**
- Epic 12

**Scope**
- harden workflow SLAs, escalations, and routing behavior
- mature the notification center around overdue work, approvals, comments, and exceptions
- improve supplier portal workflow depth and operational visibility

**Exit criteria**
- workflow timing/escalation behavior is usable in multi-user environments
- operational notifications are dependable and actionable

#### Sprint 10 — Enterprise Operations II

**Primary epics**
- Epic 12

**Scope**
- complete SSO hardening
- package self-hosted and air-gapped deployment options further
- close enterprise access-control, tenancy, and operational visibility gaps

**Exit criteria**
- enterprise buyers can evaluate SSO and hosted/self-host deployment credibly
- multi-user operational behavior is stable under enterprise access patterns

#### Sprint 11 — Pharma and Biotech I

**Primary epics**
- Epic 13

**Scope**
- harden electronic batch records and stability workflows
- tie batch/stability modules into evidence, approvals, exports, and audit views
- improve training/document-control links for GMP-style operation

**Exit criteria**
- pharma modules are not standalone islands; they participate in the audited workflow model
- batch and stability flows are pilot-capable

#### Sprint 12 — Pharma and Biotech II

**Primary epics**
- Epic 13

**Scope**
- add process validation lifecycle depth
- add cleaning validation and related supporting workflows
- expand training/document-control depth for pharma operations

**Exit criteria**
- pharma starter pack reaches a coherent second vertical baseline

#### Sprint 13 — AI Differentiation I

**Primary epics**
- Epic 14

**Scope**
- implement AI audit preparation assistant
- implement AI requirements extraction against the server-backed data model
- add logging, attribution, and review trails for AI-generated outputs

**Exit criteria**
- AI outputs are reviewable, attributable, and visible inside audited workflows
- AI features are not bypassing the core permission/audit model

#### Sprint 14 — AI Differentiation II

**Primary epics**
- Epic 14

**Scope**
- implement change impact predictor
- implement duplicate/conflict detection
- implement regulatory change monitoring foundations

**Exit criteria**
- AI features support real quality workflows instead of remaining standalone demos

#### Sprint 15 — CRO and Clinical Wave

**Primary epics**
- Epic 15

**Scope**
- implement eTMF, eConsent, protocol deviation tracking, and site management foundations
- align clinical workflows with audit, evidence, export, and approval layers

**Exit criteria**
- clinical capabilities are delivered as a separate coherent wave, not mixed into core stabilization work

#### Sprint 16 — Geography and Additional Vertical Expansion

**Primary epics**
- Epic 16

**Scope**
- add country packs and regulated vertical expansions in demand-driven order
- add multi-region, offline/PWA, scheduled reports, advanced search, and document generation where justified

**Exit criteria**
- expansion is sequenced by support capacity and commercial demand, not by backlog accumulation

### Remaining Sprint Dependencies

- Do not start **Sprint 5** before Sprints 1-4 have closed the audit-ready core gaps.
- Do not start **Sprint 7** before the hosted-ready baseline from Sprints 5-6 is credible enough for pilots.
- Do not start **Sprint 13** before the audit/evidence/export model is stable enough to contain AI outputs safely.
- Clinical and geography waves should not begin until the medical-device and enterprise waves have named ownership and support capacity.

---

## Phase 1 — Platform Convergence (Weeks 0-8)

**Goal**: make QAtrial operate as one coherent product rather than a client-first app with a partial server overlay.

### Epic 1 — Core Contract Convergence
**Order:** 1  
**Estimate:** 1-2 weeks

**Scope**
- Define canonical DTOs and response shapes for projects, requirements, tests, risks, CAPA, audit, evidence, approvals, signatures, notifications, and dashboards.
- Standardize status enums and lifecycle names across frontend, backend, and database.
- Decide where normalized relations are required versus array-based fields are acceptable.

**Milestones**
- Response contract documented for every core endpoint.
- Shared naming and status map agreed for requirement, test, approval, signature, and change-control flows.
- Route naming inconsistencies removed or explicitly shimmed for backward compatibility.

### Epic 2 — Server-Backed Core CRUD
**Order:** 2  
**Estimate:** 2-3 weeks

**Scope**
- Make projects, requirements, tests, risks, CAPA, audit, approvals, evidence, and signatures load/save through the backend in server mode.
- Move setup wizard, import/export, and active project selection onto server-backed entities.
- Reclassify standalone mode as demo/import/offline seed mode instead of the primary product path.

**Milestones**
- Setup wizard creates a real server project and lands the user in that project.
- Requirements/tests CRUD round-trip through the API in server mode.
- Local import into server projects works repeatedly without duplication or silent corruption.

### Epic 3 — Auth, Workspace, and Team Parity
**Order:** 3  
**Estimate:** 1 week

**Scope**
- Complete organization/workspace/team endpoints required by the UI.
- Align invite flows, role changes, and current-user workspace access.
- Make RBAC behavior consistent across frontend affordances and backend enforcement.

**Milestones**
- Team view loads real members, org name, and role data.
- Invite flow creates usable accounts or invitations.
- Role changes and workspace visibility behave consistently.

### Epic 4 — Schema/Route Drift Repair
**Order:** 4  
**Estimate:** 1-2 weeks

**Scope**
- Remove drift between Prisma schema and server routes.
- Fix dashboard, audit-mode, traceability, approvals, evidence, and export assumptions.
- Choose and implement the traceability model explicitly:
  either normalized `Requirement <-> Test` join records, or a supported array-based approach with all downstream routes updated.

**Milestones**
- Dashboard routes compile against the actual schema and return valid data.
- Audit-mode works from real evidence, audit log, signature, and traceability data.
- Approval and signature routes align with mounted server paths and database models.

### Epic 5 — Backend Quality Gate and DevEx
**Order:** 5  
**Estimate:** 1 week

**Scope**
- Add a real TypeScript config for `server/`.
- Add backend tests for auth, projects, requirements, tests, approvals, evidence, audit, and dashboard contracts.
- Add Prisma migration validation, seed/bootstrap flow, and local dev instructions.

**Milestones**
- CI/typecheck covers frontend and backend.
- Route tests exist for all core entities.
- Local developer bootstrap can stand up the stack reliably.

### Phase 1 Exit Criteria

- Server mode is the default supported product mode for team use.
- Core CRUD flows do not fall back to local-only behavior.
- Backend typecheck and tests run in CI.
- Team/workspace, approvals, evidence, audit-mode, and dashboards are contract-consistent.
- Local browser data can be migrated into a real project with a clear result report.

### Phase 1 Major Milestones

- **M1** Contract freeze for core entities
- **M2** Server-backed beta for core CRUD
- **M3** Backend included in the quality gate

---

## Phase 2 — Audit-Ready Product Core (Weeks 8-18)

**Goal**: turn QAtrial from a converged platform into a dependable, audit-facing product for real teams.

### Epic 6 — Approval Workflows and Electronic Signatures
**Order:** 6  
**Estimate:** 1-2 weeks

**Scope**
- Formalize Draft -> In Review -> Approved -> Rejected lifecycle behavior.
- Enforce reviewer/requester separation, approval permissions, and signature capture.
- Make e-signature records immutable and server-authoritative.

**Milestones**
- Request, approve, reject, revoke flows work end-to-end.
- Approval state is reflected in entities, audit trail, and dashboards.
- Signature meaning, user, role, timestamp, and reason are stored consistently.

### Epic 7 — Evidence System, Traceability, and Audit Exports
**Order:** 7  
**Estimate:** 2-3 weeks

**Scope**
- Harden file upload/download/versioning and evidence metadata.
- Build dependable requirement -> test -> result -> evidence -> risk traceability.
- Ship full audit export bundles: CSV, PDF, ZIP, and audit-mode parity.

**Milestones**
- Evidence completeness and missing-link dashboards run off real database state.
- Audit export packages include linked records and files.
- Audit-mode is usable for external auditors with stable read-only behavior.

### Epic 8 — Operational Workflow Modules on Real Data
**Order:** 8  
**Estimate:** 2-3 weeks

**Scope**
- Move change control, deviations, tasks, notifications, dashboards, and comments onto dependable backend flows.
- Ensure workflow-heavy modules do not bypass audit logging or approval state.
- Make report generation use the server-backed data model.

**Milestones**
- Change control and deviation flows create durable records and audit entries.
- Notification inbox uses server events instead of client-only assumptions.
- Cross-module links are visible in dashboards and exports.

### Epic 9 — Hosted-Ready Platform Baseline
**Order:** 9  
**Estimate:** 1-2 weeks

**Scope**
- Production configuration, secrets handling, upload storage abstraction, backups, and environment validation.
- OpenAPI or equivalent API documentation.
- Monitoring, health checks, and failure visibility for AI, uploads, and database access.

**Milestones**
- Cloud deployment baseline exists and is documented.
- Upload storage can run locally and on S3-compatible backends.
- API surface is documented enough for external integration.

### Epic 10 — Onboarding, Starter Packs, and Migration UX
**Order:** 10  
**Estimate:** 1 week

**Scope**
- Improve setup wizard, starter packs, demo projects, and migration tooling.
- Make first-run project creation, import, and initial dashboard experience coherent.
- Keep standalone mode useful as a trial/demo path without fragmenting the product model.

**Milestones**
- New user can reach a working project with starter data quickly.
- Existing standalone data can be imported into a live team project.
- Starter packs generate real server-backed records.

### Phase 2 Exit Criteria

- QAtrial can support a single-site team using the product end-to-end.
- Approval, signature, evidence, traceability, audit export, and audit-mode flows are trustworthy.
- Dashboard metrics are sourced from stable backend relations.
- Cloud/self-host setup is documented well enough for customer pilots.

### Phase 2 Major Milestones

- **M4** Audit-ready core release
- **M5** Hosted/customer pilot release

---

## Phase 3 — Vertical, Enterprise, and AI Expansion (Weeks 18-36+)

**Goal**: develop the full planned expansion backlog in a staged order after the product core is stable.

This phase deliberately contains multiple waves. The order matters.

### Epic 11 — Medical Device Wave
**Order:** 11  
**Estimate:** 2-4 weeks

**Scope**
- DHF/DMR/DHR management
- Design control workflow with approval gates
- QMSR-focused gap assessment and transition packs
- PMS, complaint, supplier, and UDI hardening

**Milestones**
- Medical device starter pack becomes the first commercial wedge.
- Design-control gates enforce real workflow transitions.
- QMSR readiness reporting uses actual evidence and workflow state.

### Epic 12 — Enterprise Operations Wave
**Order:** 12  
**Estimate:** 2-4 weeks

**Scope**
- Configurable workflow engine hardening
- Notification center maturity
- Supplier portal completion
- SSO hardening
- Self-hosted and air-gapped deployment packaging

**Milestones**
- Enterprise customers can use SSO, supplier workflows, and configurable approval routing.
- Workflow SLAs, escalation hooks, and operational visibility are available.

### Epic 13 — Pharmaceutical and Biotech Wave
**Order:** 13  
**Estimate:** 2-4 weeks

**Scope**
- Electronic batch records
- Stability studies
- Process validation lifecycle
- Training and document-control depth
- Cleaning validation and related pharma workflows

**Milestones**
- Pharma starter pack reaches pilot quality.
- Batch, stability, and training modules are tied into audit/evidence/export flows.

### Epic 14 — AI Differentiation Wave
**Order:** 14  
**Estimate:** 2-4 weeks

**Scope**
- AI audit preparation assistant
- AI requirements extraction
- Change impact predictor
- Regulatory change monitor
- Duplicate/conflict detection

**Milestones**
- AI features are server-backed, observable, and auditable.
- AI outputs become useful inside real audit and change-control workflows.

### Epic 15 — CRO and Clinical Wave
**Order:** 15  
**Estimate:** 2-4 weeks

**Scope**
- eTMF
- eConsent
- Protocol deviation tracker
- Site management and monitoring
- Decentralized trial support

**Milestones**
- Clinical workflows become a separate expansion wave instead of mixing with core platform delivery.

### Epic 16 — Geography and Additional Vertical Expansion Wave
**Order:** 16  
**Estimate:** ongoing after previous waves

**Scope**
- Country packs for Brazil, Australia/NZ, Saudi Arabia, Switzerland, Singapore, Israel, India, UAE/GCC
- Additional verticals such as IVD, combination products, ATMP, SaMD, automotive safety, food safety
- Data residency, multi-region, offline/PWA, scheduled reports, advanced search, document generation

**Milestones**
- Expansion is driven by paying demand and validated operating capacity.
- No geography or vertical wave begins before the prior wave has product ownership and support capacity.

### Phase 3 Exit Criteria

- One vertical is commercially deep and repeatable.
- Enterprise buyers can deploy, authenticate, audit, and integrate with confidence.
- The broader strategic backlog is being developed in planned waves rather than as opportunistic feature accumulation.

### Phase 3 Major Milestones

- **M6** Medical device GA / first repeatable wedge
- **M7** Enterprise release
- **M8** Expansion wave program established

---

## Full Implementation Order

1. Core contract convergence
2. Server-backed core CRUD
3. Auth, workspace, and team parity
4. Schema/route drift repair
5. Backend quality gate and developer bootstrap
6. Approval workflows and electronic signatures
7. Evidence system, traceability, and audit exports
8. Operational workflow modules on real data
9. Hosted-ready platform baseline
10. Onboarding, starter packs, and migration UX
11. Medical device wave
12. Enterprise operations wave
13. Pharmaceutical and biotech wave
14. AI differentiation wave
15. CRO and clinical wave
16. Geography and additional vertical expansion wave

---

## What Not To Start Before Phase 2 Exit

- Real-time collaboration and live-presence editing
- Predictive ML analytics
- Large country-pack expansion
- New vertical families beyond the first wedge
- Advanced AI assistants that are not embedded in audited workflows
- Marketplace/plugin-style extensibility
- Broad connector sprawl beyond Jira, GitHub, and webhooks

These are not rejected. They are intentionally sequenced behind the platform and audit core.

---

## Verification Plan

### Phase 1

- Frontend typecheck/build passes.
- Backend typecheck passes.
- Core route tests pass for auth, projects, requirements, tests, approvals, evidence, audit, and dashboard contracts.
- User can register, log in, create/select a project, invite a teammate, and both users see the same project state.
- Core CRUD does not require local-only fallback in server mode.

### Phase 2

- Requirement/test approval request and review flows complete end-to-end.
- Signature records are immutable and visible in audit outputs.
- Evidence files upload, download, version, and export correctly.
- Audit-mode exposes coherent project, traceability, evidence, audit trail, and signatures views.
- Export bundles are usable by QA managers and auditors.

### Phase 3

- Medical device workflows enforce gated design-control progression.
- Enterprise deployment supports SSO and customer-hosted operation.
- Vertical modules integrate with audit, evidence, export, and approval layers.
- AI outputs are logged, attributable, and reviewable.

---

## Recommended Commercial Positioning During Delivery

- **Phase 1 message**: "QAtrial is becoming the server-backed quality workspace, not just a local demo."
- **Phase 2 message**: "QAtrial helps teams pass audits without spreadsheet sprawl."
- **Phase 3 message**: "QAtrial adds deep regulated workflows starting with medical device, then enterprise operations, then broader vertical expansion."
