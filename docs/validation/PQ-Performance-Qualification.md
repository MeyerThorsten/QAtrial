# Performance Qualification (PQ) Protocol

**Document ID:** QA-VAL-PQ-001
**System:** QAtrial v3.0.0
**Date:** _______________
**Prepared by:** _______________
**Customer/Organization:** _______________

---

## 1. Purpose

The purpose of this Performance Qualification (PQ) protocol is to verify that QAtrial performs reliably and consistently in the customer's specific production environment, with their actual data, users, and configuration.

This document is a template. The customer should complete all blank fields to reflect their specific deployment.

## 2. Scope

This protocol covers the customer-specific validation of QAtrial in its production environment, including:

- Customer-specific configuration (country, vertical, modules)
- Real-world data import and usage patterns
- Integration with customer infrastructure
- Performance under expected load conditions

## 3. Environment Description

Complete the following to document the production environment:

| Parameter | Value |
|-----------|-------|
| **Deployment Type** | ☐ Standalone (bare metal/VM) ☐ Docker ☐ Kubernetes |
| **Server OS** | _______________ |
| **Node.js Version** | _______________ |
| **Database** | PostgreSQL _______________ (version) |
| **Database Host** | _______________ |
| **Application URL** | _______________ |
| **Total Users** | _______________ |
| **Concurrent Users (expected)** | _______________ |
| **AI Provider** | ☐ Anthropic ☐ OpenAI ☐ Ollama (local) ☐ None |
| **AI Model** | _______________ |
| **SSL/TLS** | ☐ Yes ☐ No |
| **Reverse Proxy** | ☐ Nginx ☐ Caddy ☐ Traefik ☐ Other: _______________ ☐ None |
| **Backup Schedule** | _______________ |
| **Network Configuration** | ☐ Internet-facing ☐ Intranet only ☐ Air-gapped |

## 4. Customer-Specific Test Steps

### PQ-001: Project with Customer Configuration

| Field | Value |
|-------|-------|
| **Test ID** | PQ-001 |
| **Description** | Create a project using the customer's country, vertical, and module configuration |
| **Country** | _______________ |
| **Vertical** | _______________ |
| **Modules Selected** | _______________ |
| **Procedure** | Create a new project with the above parameters using the project wizard |
| **Expected Result** | Project is created with correct regulatory framework and module configuration for the specified country/vertical |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### PQ-002: Customer Data Import

| Field | Value |
|-------|-------|
| **Test ID** | PQ-002 |
| **Description** | Import the customer's existing requirements from CSV |
| **Source File** | _______________ |
| **Number of Records** | _______________ |
| **Procedure** | Import the customer's CSV file; map columns to QAtrial fields; verify all records are imported correctly |
| **Expected Result** | All records imported with correct field mapping; no data loss or corruption; sequential IDs assigned |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### PQ-003: Traceability with Customer Data

| Field | Value |
|-------|-------|
| **Test ID** | PQ-003 |
| **Description** | Verify traceability matrix with customer's test cases |
| **Procedure** | Link imported test cases to requirements; generate traceability matrix; verify completeness |
| **Expected Result** | Traceability matrix accurately reflects all links; coverage percentage is calculated correctly |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### PQ-004: Compliance Report Generation

| Field | Value |
|-------|-------|
| **Test ID** | PQ-004 |
| **Description** | Generate a compliance report and review with QA manager |
| **Procedure** | Generate a full project report (HTML or PDF export); review with QA manager for completeness and accuracy |
| **Expected Result** | Report contains all requirements, tests, traceability, risks, and audit trail; reviewed and accepted by QA manager |
| **QA Manager Name** | _______________ |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### PQ-005: Audit Mode Verification

| Field | Value |
|-------|-------|
| **Test ID** | PQ-005 |
| **Description** | Share audit mode link with auditor and confirm read-only access |
| **Procedure** | Generate audit mode link; share with designated auditor; auditor confirms they can view all data but cannot modify anything |
| **Auditor Name** | _______________ |
| **Expected Result** | Auditor can access and review all project data; no edit capability is available |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### PQ-006: Backup and Restore

| Field | Value |
|-------|-------|
| **Test ID** | PQ-006 |
| **Description** | Verify database backup and restore procedure |
| **Procedure** | (1) Create a known data state (record a requirement count); (2) Perform a database backup using `pg_dump`; (3) Add new data; (4) Restore from backup; (5) Verify data matches the original state |
| **Backup Method** | _______________ |
| **Expected Result** | Data is fully restored to the backup point; no data corruption; application functions correctly after restore |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

## 5. Performance Criteria

Complete the following performance targets and measure against them:

| Metric | Target | Measured | Status |
|--------|--------|----------|--------|
| Login page load time | < ___ seconds | ___ seconds | - [ ] Pass / - [ ] Fail |
| Dashboard load time | < ___ seconds | ___ seconds | - [ ] Pass / - [ ] Fail |
| API response time (95th percentile) | < ___ ms | ___ ms | - [ ] Pass / - [ ] Fail |
| CSV import (1000 records) | < ___ seconds | ___ seconds | - [ ] Pass / - [ ] Fail |
| HTML report generation | < ___ seconds | ___ seconds | - [ ] Pass / - [ ] Fail |
| Concurrent users supported | ___ users | ___ users | - [ ] Pass / - [ ] Fail |
| Database query time (complex) | < ___ ms | ___ ms | - [ ] Pass / - [ ] Fail |
| File upload (10 MB) | < ___ seconds | ___ seconds | - [ ] Pass / - [ ] Fail |

## 6. Acceptance Criteria

The Performance Qualification is considered **PASSED** when:

- All customer-specific test steps (PQ-001 through PQ-006) have a status of **Pass**
- All performance criteria meet the defined targets
- The system operates reliably with the customer's actual data and user load
- No critical or high-severity deviations remain unresolved
- The customer's QA manager has reviewed and accepted the results

## 7. Deviations

| Deviation # | Test ID | Description | Impact Assessment | Resolution |
|------------|---------|-------------|-------------------|------------|
| | | | | |
| | | | | |

## 8. Signature Block

### Executed by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Organization** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |

### Reviewed by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Organization** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |

### Approved by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Organization** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |
