# Sprint 10: Phase 2 — Evidence, Approvals, E-Signatures, Audit Export

## What was built

Phase 2 transforms QAtrial from a tracking tool into an audit-ready quality system with real evidence management, approval workflows, electronic signatures, and one-click audit export.

---

### Backend (4 new route groups, 3 new database models)

#### Evidence System (`/api/evidence`)
- `POST /upload` — multipart file upload, saves to `uploads/{projectId}/`, auto-versioning
- `GET /?projectId&entityId` — list evidence for any entity
- `GET /completeness?projectId` — per-requirement and per-test evidence coverage stats
- `GET /:id/download` — stream file download with proper Content-Disposition
- `DELETE /:id` — remove file from disk + DB (admin/editor only)

#### Approval Workflows (`/api/approvals`)
- `POST /request` — request approval, sets entity to "In Review", prevents duplicates
- `PUT /:id/review` — approve/reject with reason, prevents self-review, updates entity status
- `GET /?projectId&status` — list approvals (filterable)
- `GET /my-pending` — pending approvals for current user

#### Electronic Signatures (`/api/signatures`)
- `POST /` — create signature with password re-verification (bcrypt, 21 CFR Part 11)
- `GET /?entityId` — list signatures for entity
- `GET /:id` — single signature detail
- **Immutable** — no update or delete endpoints

#### Audit Export (`/api/export`)
- `GET /:projectId` — overview with URLs to data/report/evidence
- `GET /:projectId/report` — full HTML report (inline CSS, no dependencies): traceability matrix, requirements, tests, risks, CAPAs, approvals, signatures, audit trail
- `GET /:projectId/data` — complete JSON data dump
- `GET /:projectId/bundle` — combined JSON with embedded HTML

#### Database Models Added
- `Evidence` — fileName, fileSize, mimeType, storagePath, entityType/entityId, uploadedBy, version
- `Approval` — entityType/entityId, status (pending/approved/rejected), requestedBy, reviewedBy, signatureId
- `Signature` — userId, userName, userRole, meaning, reason, method, entityType/entityId (immutable)

---

### Frontend (5 new components)

#### Evidence Panel (`src/components/evidence/EvidencePanel.tsx`)
- Drag-and-drop file upload zone
- File list: name, size, uploader, date, download/delete buttons
- Evidence count badge on requirement/test table rows (Paperclip icon)
- Dual mode: server mode uploads via API, standalone shows "server required" message

#### Approval Panel (`src/components/approval/ApprovalPanel.tsx`)
- Status display: Draft → In Review → Approved → Rejected
- Action buttons based on status: Request Approval, Approve, Reject (with reason), Revoke
- Approval history list with timestamps
- Triggered from Clock icon on requirement rows

#### Enhanced Signature Modal (`src/components/audit/EnhancedSignatureModal.tsx`)
- Entity context display (what's being signed)
- Meaning selector (authored/reviewed/approved/verified/rejected)
- Required reason field
- Password re-authentication (server mode verifies via backend)
- Success confirmation with signature ID + timestamp

#### Audit Export Button (`src/components/audit/AuditExportButton.tsx`)
- One-click "Export Audit Package" button
- Server mode: downloads JSON data + HTML report from API
- Standalone mode: generates from localStorage
- Loading state + file size display

#### Table Integration
- RequirementsTable: Paperclip (evidence) + Clock (approval) buttons per row
- TestsTable: Paperclip (evidence) button per row
- Evidence count badges on rows with attachments

---

### Also completed (Phase 1 remaining items)

#### Login/Register Page (`src/components/auth/LoginPage.tsx`)
- Login + Register forms with toggle
- Email, password, name fields
- Error/loading states, dark mode support
- Gradient QAtrial branding

#### Auth Context (`src/hooks/useAuth.ts`)
- JWT token management (access + refresh)
- Auto-validate on mount, auto-refresh on expiry
- AuthProvider wrapper component

#### API Hooks (6 hooks)
- `useApiRequirements`, `useApiTests`, `useApiProjects`, `useApiCapa`, `useApiRisks`, `useApiAudit`
- Each: CRUD operations, auto-refetch, 401 handling, loading/error states

#### App Mode (`src/hooks/useAppMode.ts`)
- Standalone mode (localStorage, no backend — default)
- Server mode (API-backed, activated by `VITE_API_URL` env var)

#### Workspace Manager (`src/components/auth/WorkspaceManager.tsx`)
- Team member list with role badges
- Invite user form (admin only)
- Change role dropdown (admin only)

#### Data Migration (`src/components/auth/MigrateDataButton.tsx`)
- "Import Browser Data" button (server mode)
- Reads all localStorage stores, POSTs to backend
- Progress tracking + success/error summary

---

## i18n Keys Added
- `auth.*` — 19 keys (EN + DE): login, register, team, migrate, mode
- `evidence.*` — 12 keys (EN + DE): upload, download, drag-drop, completeness
- `approval.*` — 15 keys (EN + DE): request, approve, reject, history, status

## Build Status: Clean (0 TypeScript errors)
