# Sprint 8: v3.0 Features — Completed

## Release Summary

This release adds Design Control, ISO 13485 Gap Assessment, Workflow Engine, Notifications, Custom Fields, AI Requirements Extraction, QMSR Gap Assessment, and improved LLM Provider Settings.

---

## 1. Design Control (DHF/DMR/DHR)

**New tab: "Design Control"** in main navigation.

### Design Control Kanban Board
- 7-phase workflow: User Needs → Design Input → Design Output → Verification → Validation → Transfer → Released
- Cards per phase showing: title, status badge (draft/in_review/approved/rejected), linked requirement count, linked test count
- Inline creation form per column
- Detail panel on click with status controls
- "Advance to Next Phase" button — only available when current phase status is "approved"
- Phase advancement is gated: approved items move forward, unapproved items stay

### Document Records (DHF/DMR/DHR)
- Design History File, Device Master Record, Device History Record containers
- Version control, section management
- Linked to design items and requirements
- Status lifecycle: draft → active → superseded → obsolete

### Regulatory Alignment
- FDA QMSR (effective Feb 2, 2026) — incorporates ISO 13485:2016 by reference
- ISO 13485 §7.3 Design and Development controls
- Full audit trail on all design control operations

**Files:** `src/store/useDesignControlStore.ts`, `src/components/design/DesignControlView.tsx`

---

## 2. ISO 13485:2016 Gap Assessment

**New dashboard tab: "ISO 13485"** in Evaluation dashboard.

### Two Assessment Modes

#### Keyword Match (No AI Required)
- Always available, works without any LLM provider configured
- Matches project requirements against all 27 ISO 13485:2016 clauses (§4.1 through §8.5)
- Each clause has curated keywords for automatic matching
- Requirements matched by title + description text against clause keywords
- Scoring: 2+ matched reqs = "covered", 1 = "partial", 0 = "gap"

#### AI Analysis (Requires LLM Provider)
- Deep analysis by AI comparing requirements against clause intent
- Returns evidence (which reqs cover the clause) and recommendations (what's missing)
- Uses the QMSR gap assessment prompt with full ISO 13485 clause descriptions
- Toggle between modes with buttons in the header

### Assessment View
- **Readiness score** (0-100%) with stacked progress bar (green/yellow/red)
- **Summary stats**: X covered, X partial, X gaps
- **Accordion by section**: Quality Management System, Management Responsibility, Resource Management, Product Realization, Measurement & Improvement
- **Per clause detail**:
  - Status icon (✓ covered / ⚠ partial / ✗ gap)
  - Clause number + title + description
  - Criticality badge (critical/high/medium/low)
  - Matched requirement IDs as clickable tags
  - AI evidence and recommendation (in AI mode)
- **"+ Req" button** per gap/partial clause → auto-generates a requirement with ISO 13485 regulatory reference, appropriate risk level, and tags

### Clause Registry
- 27 clauses with: clause number, title, section grouping, description, keywords, criticality level
- Shared between static and AI assessment modes
- Exported for reuse: `src/lib/iso13485Clauses.ts`

**Files:** `src/lib/iso13485Clauses.ts`, `src/components/dashboard/ISO13485Assessment.tsx`

---

## 3. Workflow Engine

### Configurable Multi-Step Approval Workflows
- Workflow definitions with: name, trigger (on_status_change/on_create/on_edit/manual), entity type, steps
- Each step: type (approval/review/sign/notify/auto_check), assignee role, required approvers, SLA hours, escalation
- Workflow instances track: current step, approvals received, status (active/completed/cancelled/escalated)

### Default Workflows
1. **Requirement Approval**: Review → Approve → Sign (1 approver each)
2. **Design Gate Review**: Review → 2 Approvals → Sign

### Multi-Approver Logic
- Steps can require multiple approvers (e.g., 2 for pharma design gates)
- Auto-advances to next step when required approvals reached
- Cancels workflow on rejection

**File:** `src/store/useWorkflowStore.ts`

---

## 4. Notification Center

### Bell Icon in Header
- Unread count badge (red dot with number)
- Click opens dropdown with recent notifications (up to 20)
- Each notification: type-specific icon, title, message, time ago, read/unread indicator
- "Mark all read" button

### Notification Types
- approval_needed, task_overdue, capa_deadline, workflow_escalation, audit_reminder, status_change, mention

**Files:** `src/store/useNotificationStore.ts`, `src/components/shared/NotificationBell.tsx`

---

## 5. Custom Fields

### User-Defined Metadata
- Define custom fields that apply to: requirements, tests, CAPA records, design items
- Field types: text, number, date, select, multi_select, boolean, url
- Optional/required flag, default values, select options
- Values stored per entity ID

**File:** `src/store/useCustomFieldsStore.ts`

---

## 6. AI Requirements Extraction

### Paste Regulation → Get Requirements
- New AI prompt: paste a regulation section (e.g., QMSR paragraph, MDR Annex I clause)
- AI extracts atomic, testable requirements with:
  - Title, description, regulatory reference, risk level
- Designed for bulk import of regulatory text into project requirements

**File:** `src/ai/prompts/requirementExtraction.ts`

---

## 7. QMSR Gap Assessment (AI)

### FDA QMSR Transition Tool
- AI-powered mapping of project requirements against all ISO 13485:2016 clauses (§4.1–§8.5)
- Specifically designed for the QMSR transition (21 CFR 820 → ISO 13485 incorporation)
- Returns: compliant/partial/gap status per clause, evidence, recommendations
- Used by both the Gap Analysis dashboard and the ISO 13485 Assessment tab

**File:** `src/ai/prompts/qmsrGap.ts`

---

## 8. LLM Provider Settings Improvements

### Quick Setup Presets
5 one-click presets that auto-fill all provider fields:

| Preset | Type | Base URL | Default Model | Temperature | API Key Required |
|--------|------|----------|---------------|-------------|-----------------|
| **Anthropic** | anthropic | `https://api.anthropic.com` | claude-sonnet-4-20250514 | 0.2 | Yes |
| **OpenAI** | openai-compatible | `https://api.openai.com/v1` | gpt-4.1 | 0.2 | Yes |
| **OpenRouter** | openai-compatible | `https://openrouter.ai/api/v1` | anthropic/claude-sonnet-4 | 0.2 | Yes |
| **Ollama (Local)** | openai-compatible | `http://localhost:11434/v1` | llama3.1:8b | 0.3 | No |
| **LM Studio (Local)** | openai-compatible | `http://localhost:1234/v1` | local-model | 0.3 | No |

### Model Dropdown
When a preset is selected, the Model field becomes a dropdown with all available models for that provider:
- **Anthropic**: claude-sonnet-4-20250514, claude-opus-4-20250514, claude-haiku-4-20250506
- **OpenAI**: gpt-4.1, gpt-4.1-mini, gpt-4.1-nano, gpt-4o, gpt-4o-mini, o3-mini
- **OpenRouter**: anthropic/claude-sonnet-4, openai/gpt-4.1, google/gemini-2.5-pro, meta-llama/llama-4-maverick, deepseek/deepseek-r1, qwen/qwen3-235b-a22b, + more
- **Ollama**: llama3.1:8b, llama3.1:70b, qwen2.5:14b, mistral:7b, gemma2:9b, deepseek-r1:14b
- **LM Studio**: local-model (text input since model depends on what's loaded)

### Smart Defaults
- Temperature 0.2 for cloud providers (precision for regulatory content)
- Temperature 0.3 for local providers (slightly higher for smaller models)
- Max Tokens 4096 for cloud, 2048 for local
- "Not required" hint on API Key field for Ollama/LM Studio
- Preset description shown below buttons (e.g., "Run models locally — no API key needed")
- OpenAI base URL correctly set to `https://api.openai.com/v1`

### Editing Existing Providers
- When editing, auto-detects matching preset from base URL for model dropdown
- Falls back to text input if no preset matches

---

## New Stores Added (4)
| Store | Persistence Key | Purpose |
|-------|----------------|---------|
| `useDesignControlStore` | `qatrial:design-control` | Design items + document records |
| `useCustomFieldsStore` | `qatrial:custom-fields` | Field definitions + values |
| `useWorkflowStore` | `qatrial:workflow` | Workflow definitions + instances |
| `useNotificationStore` | `qatrial:notifications` | Notification management |

## New Components (3)
- `src/components/design/DesignControlView.tsx` — Kanban board
- `src/components/dashboard/ISO13485Assessment.tsx` — Gap assessment view
- `src/components/shared/NotificationBell.tsx` — Header notification bell

## New AI Prompts (2)
- `src/ai/prompts/requirementExtraction.ts` — Regulation → Requirements
- `src/ai/prompts/qmsrGap.ts` — QMSR/ISO 13485 gap assessment

## New Shared Library (1)
- `src/lib/iso13485Clauses.ts` — 27 ISO 13485:2016 clauses with keywords, descriptions, criticality

## Build Status: Clean
