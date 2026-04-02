# Operational Qualification (OQ) Protocol

**Document ID:** QA-VAL-OQ-001
**System:** QAtrial v3.0.0
**Date:** _______________
**Prepared by:** _______________

---

## 1. Purpose

The purpose of this Operational Qualification (OQ) protocol is to verify that QAtrial functions as specified across all core workflows, meeting its design requirements under normal operating conditions.

## 2. Scope

This protocol covers the functional verification of all core QAtrial workflows:

- Project creation and configuration
- Requirements management with traceability
- Test management and execution
- Status lifecycle transitions
- AI-assisted test generation and risk classification
- Approval workflows with electronic signatures
- Evidence management
- Export/import capabilities
- Design control (ISO 13485)
- CAPA management
- Audit mode
- Role-based access control (RBAC)

## 3. Test Steps

### OQ-001: Project Creation via Wizard

| Field | Value |
|-------|-------|
| **Test ID** | OQ-001 |
| **Description** | Create a project using the 7-step project wizard |
| **Procedure** | Navigate to New Project, complete all 7 wizard steps (name, description, country, vertical, modules, type, confirmation) |
| **Expected Result** | Project is created with all specified attributes; user is redirected to the project dashboard |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-002: Requirement Creation with ID Assignment

| Field | Value |
|-------|-------|
| **Test ID** | OQ-002 |
| **Description** | Create a requirement and verify sequential ID assignment |
| **Procedure** | In a project, create a new requirement with title and description |
| **Expected Result** | Requirement is created with auto-assigned ID REQ-001; subsequent requirements receive REQ-002, REQ-003, etc. |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-003: Test Creation and Traceability

| Field | Value |
|-------|-------|
| **Test ID** | OQ-003 |
| **Description** | Create a test, link it to a requirement, and verify the traceability matrix |
| **Procedure** | Create a test case, link it to REQ-001, then view the traceability matrix |
| **Expected Result** | Test is created with auto-assigned ID (TC-001); traceability matrix shows the link between REQ-001 and TC-001 |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-004: Requirement Status Lifecycle

| Field | Value |
|-------|-------|
| **Test ID** | OQ-004 |
| **Description** | Transition a requirement through its status lifecycle |
| **Procedure** | Change requirement status: Draft -> Active -> Closed |
| **Expected Result** | Each status transition is accepted; audit log records each change with timestamp and user |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-005: Test Status Lifecycle

| Field | Value |
|-------|-------|
| **Test ID** | OQ-005 |
| **Description** | Transition a test through its status lifecycle |
| **Procedure** | Change test status: Not Run -> Passed; create another test and change status: Not Run -> Failed |
| **Expected Result** | Each status transition is accepted; audit log records each change |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-006: Requirement Deletion Cascade

| Field | Value |
|-------|-------|
| **Test ID** | OQ-006 |
| **Description** | Delete a requirement and verify cascade cleanup of test links |
| **Procedure** | Delete a requirement that has linked tests; verify the test's linked requirement references are updated |
| **Expected Result** | Requirement is deleted; linked test references are cleaned up; audit log records the deletion |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-007: AI Test Generation

| Field | Value |
|-------|-------|
| **Test ID** | OQ-007 |
| **Description** | Generate tests using AI from a requirement (requires AI provider configured) |
| **Procedure** | Select a requirement, click "Generate Tests with AI", review generated tests, accept one or more |
| **Expected Result** | AI generates relevant test cases; accepted tests are created in the project with proper IDs and links |
| **Precondition** | AI provider must be configured (`AI_PROVIDER_TYPE`, `AI_PROVIDER_KEY` set) |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail / - [ ] N/A (no AI provider) |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-008: AI Risk Classification

| Field | Value |
|-------|-------|
| **Test ID** | OQ-008 |
| **Description** | Classify risk using AI assistance |
| **Procedure** | Select a requirement, use AI risk classification feature |
| **Expected Result** | AI assigns a risk level (Low/Medium/High/Critical) with justification |
| **Precondition** | AI provider must be configured |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail / - [ ] N/A (no AI provider) |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-009: Approval Workflow with Signature

| Field | Value |
|-------|-------|
| **Test ID** | OQ-009 |
| **Description** | Request approval, approve with electronic signature, and verify audit trail |
| **Procedure** | Request approval for a requirement; log in as approver; approve with signature (enter password, meaning, reason); verify audit trail entry |
| **Expected Result** | Approval is recorded; signature is captured with identity, meaning, reason, and timestamp; audit trail reflects the approval |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-010: Evidence Upload and Download

| Field | Value |
|-------|-------|
| **Test ID** | OQ-010 |
| **Description** | Upload evidence to an entity and download it |
| **Procedure** | Upload a file as evidence to a requirement; verify it appears in the evidence list; download the file |
| **Expected Result** | File is stored successfully; appears in evidence list with correct metadata; downloaded file matches the original |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-011: Audit Trail Export

| Field | Value |
|-------|-------|
| **Test ID** | OQ-011 |
| **Description** | Export audit trail as CSV |
| **Procedure** | Navigate to audit trail; export as CSV; open the file |
| **Expected Result** | CSV file is generated with columns: timestamp, user, action, entity type, entity ID, details; all recorded actions are present |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-012: Project Export as HTML Report

| Field | Value |
|-------|-------|
| **Test ID** | OQ-012 |
| **Description** | Export project as HTML report |
| **Procedure** | Navigate to export; select HTML report; download and open |
| **Expected Result** | HTML report contains all project sections: requirements, tests, traceability, risks, audit trail |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-013: CSV Import

| Field | Value |
|-------|-------|
| **Test ID** | OQ-013 |
| **Description** | Import requirements from CSV file |
| **Procedure** | Prepare a CSV file with requirement columns; use import feature; map columns; confirm import |
| **Expected Result** | Requirements are created from CSV data with correct field mapping and sequential IDs |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-014: Design Control

| Field | Value |
|-------|-------|
| **Test ID** | OQ-014 |
| **Description** | Create a design control item and advance through phases |
| **Procedure** | Create a design control item; advance through the 7 design phases; verify gate reviews at each transition |
| **Expected Result** | Item progresses through all phases; gate checks enforce prerequisites; DHF/DMR/DHR sections are populated |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-015: ISO 13485 Assessment

| Field | Value |
|-------|-------|
| **Test ID** | OQ-015 |
| **Description** | Run ISO 13485 keyword-based assessment |
| **Procedure** | Run ISO 13485 assessment on a project with requirements containing relevant keywords |
| **Expected Result** | Assessment identifies matched clauses; generates coverage report showing which clauses are addressed |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-016: CAPA Lifecycle

| Field | Value |
|-------|-------|
| **Test ID** | OQ-016 |
| **Description** | Create and manage a CAPA through its full lifecycle |
| **Procedure** | Create CAPA -> Investigate (add root cause) -> Implement containment -> Implement corrective action -> Implement preventive action -> Verify effectiveness -> Close |
| **Expected Result** | CAPA transitions through all 6 states; each transition is recorded in audit trail; all fields are preserved |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-017: Audit Mode (Read-Only)

| Field | Value |
|-------|-------|
| **Test ID** | OQ-017 |
| **Description** | Generate an audit mode link and verify read-only access |
| **Procedure** | Generate an audit mode link for a project; open the link in a new browser/incognito window; attempt to edit data |
| **Expected Result** | Audit mode link provides access to all project data in read-only format; no edit, delete, or create operations are available |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### OQ-018: RBAC Verification

| Field | Value |
|-------|-------|
| **Test ID** | OQ-018 |
| **Description** | Verify role-based access control for all 5 roles |
| **Procedure** | Test the following as each role: (a) admin: can invite users and manage organization; (b) qa_manager: can approve and manage all entities; (c) qa_engineer: can create/edit but cannot approve; (d) editor: can create/edit assigned entities; (e) auditor: read-only access, cannot edit |
| **Expected Result** | Each role has exactly the permissions defined; unauthorized actions return HTTP 403; UI hides unavailable actions |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

## 4. Acceptance Criteria

The Operational Qualification is considered **PASSED** when:

- All test steps (OQ-001 through OQ-018) have a status of **Pass** (or **N/A** with documented justification)
- No critical or high-severity deviations remain unresolved
- All core workflows operate as specified
- Audit trail correctly records all tested operations

## 5. Deviations

| Deviation # | Test ID | Description | Impact Assessment | Resolution |
|------------|---------|-------------|-------------------|------------|
| | | | | |
| | | | | |

## 6. Signature Block

### Executed by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |

### Reviewed by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |

### Approved by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |
