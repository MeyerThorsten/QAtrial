# Sprint 13: Enterprise Deal-Closers — Workflows, Change Control, Collaboration, PWA

## What was built

Four features that block enterprise deals — now implemented.

---

### 1. Multi-Level Approval Workflows

**Backend** (`server/routes/workflows.ts`):
- Workflow template CRUD (admin only): define multi-step sequences
- Each step: type (approval/review/sign/notify), assignee role, required approver count, SLA hours, escalation target, conditional routing
- Execution engine: start workflow on any entity, multi-approver logic (count approvals per step), auto-advance, completion detection
- Delegation: approver can delegate to another user
- Hold/resume states
- SLA overdue detection
- My pending approvals (by role)
- Full audit trail + webhook dispatch

**Frontend**:
- `WorkflowBuilder.tsx` — visual step editor (add/remove/reorder steps, configure per step)
- `WorkflowInbox.tsx` — "My Approvals" inbox with approve/reject/delegate, SLA countdown
- `WorkflowStatus.tsx` — reusable horizontal step progress indicator on any entity

**Database**: WorkflowTemplate, WorkflowStep, WorkflowExecution, WorkflowAction (4 models)

---

### 2. Change Control & Deviation Management

**Change Control** (`server/routes/changecontrol.ts`):
- Lifecycle: Initiation → Assessment → Approval → Implementation → Verification → Closure
- Auto-generated CC-NNN numbers
- Impact assessment (affected documents, training, validation)
- Implementation task tracking (assignee, due date, status)
- Workflow integration (start approval workflow)
- Effectiveness verification at 30/60/90 days
- Trending endpoint (by type/month/status)

**Deviation Management** (`server/routes/deviations.ts`):
- Lifecycle: Detected → Investigating → Root Cause Identified → CAPA Created → Closed
- Auto-generated DEV-NNN numbers
- Classification: minor, major, critical
- Investigation methods: fishbone, 5-why, Ishikawa
- Auto-create CAPA linked to deviation
- Trending: by classification/area/month, root cause categories

**Frontend**:
- `ChangeControlForm.tsx` — create/edit with type, risk, impact assessment
- `ChangeControlTracker.tsx` — list + detail with status timeline, tasks, workflow status
- `DeviationForm.tsx` — create/edit with classification
- `DeviationInvestigation.tsx` — investigation panel with method selection, root cause, auto-CAPA
- `DeviationTrending.tsx` — Recharts dashboard (4 charts)

**Database**: ChangeControl, ChangeTask, Deviation (3 models)

---

### 3. Notifications, Comments & Task Assignment

**Notifications** (`server/routes/notifications.ts`):
- Backend: paginated list, unread count, mark read/all, delete
- `createNotification()` exported helper for use by other routes
- 11 notification types: approval_needed, task_overdue, capa_deadline, deviation_opened, workflow_escalation, comment_mention, document_review, training_due, task_assigned, task_reassigned, task_completed

**Comments** (`server/routes/comments.ts`):
- Threaded comments on any entity (requirement, test, CAPA, complaint, deviation, change control, document)
- @mention detection → creates notification for mentioned user
- Edit/delete (author only, admin can delete any)

**Tasks** (`server/routes/tasks.ts`):
- Create tasks linked to any entity
- Assign to user, due date, priority (low/medium/high/critical)
- "My Tasks" filtered view, overdue detection
- Auto-notification on assign/reassign

**Frontend**:
- `NotificationInbox.tsx` — full dropdown inbox replacing old NotificationBell, server polling (30s), type-specific icons
- `CommentThread.tsx` — reusable threaded comments with @mention autocomplete
- `TaskPanel.tsx` — reusable entity-scoped task list
- `TaskDashboard.tsx` — "My Tasks" page with filter tabs + summary cards

**Database**: Notification, Comment, QTask (3 models)

---

### 4. PWA / Mobile Access

- `manifest.json` — standalone PWA manifest with QAtrial branding
- `sw.js` — service worker: cache-first for static assets, network-first for API, offline mutation queue via IndexedDB
- `useOfflineQueue.ts` — React hook for offline mutation queuing with auto-sync on reconnect
- `index.html` — manifest link, theme-color, apple-mobile-web-app meta tags
- Service worker registration in `main.tsx`

**Mobile-optimized views**:
- `MobileBatchEntry.tsx` — step-by-step batch recording with large touch targets
- `MobileReadingEntry.tsx` — quick environmental monitoring entry
- `MobileComplaintForm.tsx` — simplified complaint intake

---

## Updated Stats
- **35+ database models** (up from 28)
- **90+ API endpoints** across 34+ route files
- **70+ frontend components**
- **Build: Clean**
