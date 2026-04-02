# Regulatory Traceability Matrix

**Document ID:** QA-VAL-TM-001
**System:** QAtrial v3.0.0
**Date:** _______________
**Prepared by:** _______________

---

## 1. Purpose

This traceability matrix maps QAtrial features to regulatory requirements, demonstrating how each applicable regulatory clause is addressed by the system and verified through qualification testing.

## 2. Traceability Matrix

### 2.1 FDA 21 CFR Part 11 -- Electronic Records and Electronic Signatures

| Regulatory Requirement | QAtrial Feature | Verification Method |
|----------------------|-----------------|---------------------|
| 21 CFR 11.10(a) -- System validation | IQ/OQ/PQ protocols; automated test suite (Vitest) | OQ test suite execution |
| 21 CFR 11.10(b) -- Legible, readily retrievable records | Export to CSV, HTML, and PDF; searchable data views | OQ-011: Audit trail export; OQ-012: HTML report export |
| 21 CFR 11.10(c) -- Record protection | PostgreSQL database with ACID transactions; backup support | IQ-003: Database connection; PQ-006: Backup and restore |
| 21 CFR 11.10(d) -- Limiting system access | RBAC with 5 roles (admin, qa_manager, qa_engineer, editor, auditor) | OQ-018: RBAC verification |
| 21 CFR 11.10(e) -- Audit trail | Append-only audit log with who/what/when/why and old/new values | OQ-004: Status lifecycle (audit trail); OQ-009: Approval audit trail |
| 21 CFR 11.10(f) -- Operational system checks | Input validation on all API endpoints; Prisma schema enforcement | OQ-002: Requirement creation; OQ-013: CSV import validation |
| 21 CFR 11.10(g) -- Authority checks | `requirePermission` middleware on all protected routes | OQ-018: RBAC verification |
| 21 CFR 11.10(h) -- Device checks | JWT with expiration; refresh token rotation; session management | IQ-006: User login |
| 21 CFR 11.10(i) -- Training determination | User Guide; role-based UI (features shown per role) | OQ-018: RBAC verification (role-appropriate UI) |
| 21 CFR 11.10(j) -- Written policies | Compliance Statement; SOP templates; validation protocols | This document; Compliance-Statement.md |
| 21 CFR 11.10(k) -- Controls for open systems | HTTPS support; JWT encryption; bcrypt password hashing; CORS | IQ-002: Health endpoint (HTTPS); IQ-006: Login (JWT) |
| 21 CFR 11.50 -- Signature manifestation | Signature modal: printed name, role, meaning, reason, timestamp | OQ-009: Approval with signature |
| 21 CFR 11.70 -- Signature/record linking | `signatureId` foreign key in Approval model; audit trail linkage | OQ-009: Approval with signature |
| 21 CFR 11.100 -- Unique identification | Unique email per user; UUID-based user IDs | IQ-005: User registration |
| 21 CFR 11.200 -- Signature components | Password re-verification at signing time; two-component auth | OQ-009: Approval with signature |

### 2.2 EU Annex 11 -- Computerised Systems

| Regulatory Requirement | QAtrial Feature | Verification Method |
|----------------------|-----------------|---------------------|
| Annex 11 §1 -- Risk management | Risk module: severity, likelihood, detectability scoring; AI classification | OQ-008: AI risk classification |
| Annex 11 §2 -- Personnel | RBAC with 5 defined roles; permission-based access | OQ-018: RBAC verification |
| Annex 11 §3 -- Suppliers and service providers | Open-source (AGPL-3.0); full source code available for audit | Source code repository |
| Annex 11 §4 -- Validation | IQ/OQ/PQ protocols; traceability matrix; automated tests | This document; all IQ/OQ/PQ protocols |
| Annex 11 §5 -- Data integrity | PostgreSQL ACID; Prisma referential integrity; append-only audit | OQ-004: Status lifecycle; OQ-011: Audit export |
| Annex 11 §6 -- Accuracy checks | Input validation; type-safe API schemas; column mapping on import | OQ-013: CSV import |
| Annex 11 §7 -- Data storage | PostgreSQL with configurable backup; evidence file storage | IQ-003: Database; IQ-007: File storage; PQ-006: Backup |
| Annex 11 §8 -- Printouts | Export to CSV, HTML, PDF; browser print support | OQ-011: CSV export; OQ-012: HTML export |
| Annex 11 §9 -- Audit trail | Append-only log: identity, action, timestamp, old/new values, reason | OQ-004: Status lifecycle; OQ-009: Approval; OQ-011: Export |
| Annex 11 §10 -- Change and configuration management | Git version control; Prisma migrations; Docker reproducibility | IQ-001: Server startup (version check) |
| Annex 11 §11 -- Periodic evaluation | `/api/status` health endpoint; export capabilities for review | IQ-002: Health endpoint |
| Annex 11 §12 -- Security | JWT + bcrypt + RBAC + CORS + HTTPS | IQ-005: Registration; IQ-006: Login; OQ-018: RBAC |
| Annex 11 §13 -- Incident management | CAPA module: create, investigate, resolve, close | OQ-016: CAPA lifecycle |
| Annex 11 §14 -- Electronic signatures | Signature modal with identity, meaning, reason, timestamp | OQ-009: Approval with signature |
| Annex 11 §15 -- Batch release | Approval workflows with review and signature | OQ-009: Approval workflow |
| Annex 11 §16 -- Business continuity | Docker deployment; database backup/restore; PQ backup test | PQ-006: Backup and restore |
| Annex 11 §17 -- Archiving | PostgreSQL storage; CSV/HTML/PDF export for long-term archival | OQ-011: CSV export; OQ-012: HTML export |

### 2.3 ISO 13485 -- Medical Devices Quality Management Systems

| Regulatory Requirement | QAtrial Feature | Verification Method |
|----------------------|-----------------|---------------------|
| ISO 13485 §4.1 -- QMS general requirements | Configurable quality workspace (country, vertical, modules) | OQ-001: Project creation wizard |
| ISO 13485 §4.2.4 -- Document control | Version tracking; approval workflows; status lifecycle | OQ-004: Requirement status lifecycle; OQ-009: Approval |
| ISO 13485 §4.2.5 -- Record control | Audit trail; evidence storage; export capabilities | OQ-010: Evidence upload; OQ-011: Audit export |
| ISO 13485 §5.6 -- Management review | Dashboard with metrics; export reports for review | OQ-012: HTML report export |
| ISO 13485 §7.1 -- Planning of product realization | Project wizard with vertical-specific module selection | OQ-001: Project creation wizard |
| ISO 13485 §7.3 -- Design and development | 7-phase design control Kanban; DHF/DMR/DHR support; gate reviews | OQ-014: Design control |
| ISO 13485 §7.3.2 -- Design inputs | Requirements management with traceability | OQ-002: Requirement creation; OQ-003: Traceability |
| ISO 13485 §7.3.3 -- Design outputs | Test cases linked to requirements; evidence attachments | OQ-003: Test-requirement linking |
| ISO 13485 §7.3.4 -- Design review | Approval workflows with electronic signatures | OQ-009: Approval with signature |
| ISO 13485 §7.3.5 -- Design verification | Test execution and status tracking | OQ-005: Test status lifecycle |
| ISO 13485 §7.3.6 -- Design validation | PQ protocol for customer environment validation | PQ-001 through PQ-006 |
| ISO 13485 §7.3.7 -- Design transfer | Design control phase progression with gate checks | OQ-014: Design control |
| ISO 13485 §7.5.1 -- Production control | Traceability matrix; process documentation | OQ-003: Traceability matrix |
| ISO 13485 §8.2.4 -- Monitoring and measurement | Test execution tracking; compliance assessments | OQ-005: Test status; OQ-015: ISO 13485 assessment |
| ISO 13485 §8.3 -- Nonconforming product | CAPA module for tracking and resolving nonconformances | OQ-016: CAPA lifecycle |
| ISO 13485 §8.5 -- Improvement (CAPA) | CAPA lifecycle: open, investigate, contain, correct, prevent, close | OQ-016: CAPA lifecycle |
| ISO 13485 §8.5.2 -- Corrective action | Corrective action field in CAPA; root cause analysis | OQ-016: CAPA lifecycle |
| ISO 13485 §8.5.3 -- Preventive action | Preventive action field in CAPA; effectiveness verification | OQ-016: CAPA lifecycle |

### 2.4 ISO 14971 -- Risk Management for Medical Devices

| Regulatory Requirement | QAtrial Feature | Verification Method |
|----------------------|-----------------|---------------------|
| ISO 14971 §4 -- Risk analysis | Risk module: severity, likelihood, detectability scoring | OQ-008: AI risk classification |
| ISO 14971 §5 -- Risk evaluation | Risk level calculation (Low/Medium/High/Critical) | OQ-008: AI risk classification |
| ISO 14971 §6 -- Risk control | Mitigation field; residual risk tracking | OQ-008: Risk module usage |
| ISO 14971 §7 -- Overall residual risk | Aggregated risk view per project | OQ-008: Risk module dashboard |
| ISO 14971 §8 -- Production and post-production | CAPA for post-market issues; audit trail for tracking | OQ-016: CAPA lifecycle |
| ISO 14971 §9 -- Risk management review | Risk reports; export for management review | OQ-012: HTML export with risk section |

### 2.5 IEC 62304 -- Medical Device Software Lifecycle

| Regulatory Requirement | QAtrial Feature | Verification Method |
|----------------------|-----------------|---------------------|
| IEC 62304 §5.1 -- Software development planning | Project wizard with module and vertical selection | OQ-001: Project creation |
| IEC 62304 §5.2 -- Software requirements analysis | Requirements module with traceability | OQ-002: Requirement creation |
| IEC 62304 §5.3 -- Software architectural design | Design control module with phase tracking | OQ-014: Design control |
| IEC 62304 §5.5 -- Software integration and testing | Test module linked to requirements; traceability matrix | OQ-003: Test-requirement linking; OQ-005: Test execution |
| IEC 62304 §5.7 -- Software release | Approval workflows; export for release documentation | OQ-009: Approval; OQ-012: Export |
| IEC 62304 §6 -- Software maintenance | CAPA module; change tracking via audit trail | OQ-016: CAPA; OQ-011: Audit trail |
| IEC 62304 §7 -- Software risk management | Risk module integrated with requirements | OQ-008: Risk classification |
| IEC 62304 §8 -- Software configuration management | Git version control; Prisma migrations; Docker | IQ-001: Server startup |
| IEC 62304 §9 -- Software problem resolution | CAPA lifecycle; audit trail for issue tracking | OQ-016: CAPA lifecycle |

### 2.6 GAMP 5 -- Computer System Validation

| Regulatory Requirement | QAtrial Feature | Verification Method |
|----------------------|-----------------|---------------------|
| GAMP 5 -- Risk-based approach | Configurable modules per vertical; risk assessment module | OQ-001: Project creation; OQ-008: Risk classification |
| GAMP 5 -- Supplier assessment | Open-source; full source code audit capability | Source code repository; this document |
| GAMP 5 -- Specification | Requirements module; design control with DHF/DMR/DHR | OQ-002: Requirements; OQ-014: Design control |
| GAMP 5 -- Verification | Test module with traceability; automated test suite | OQ-003: Traceability; OQ-005: Test execution |
| GAMP 5 -- IQ/OQ/PQ | Qualification protocols provided | IQ, OQ, PQ protocol documents |
| GAMP 5 -- Change management | Audit trail; version control; approval workflows | OQ-004: Status lifecycle; OQ-009: Approval |
| GAMP 5 -- Data integrity | PostgreSQL ACID; append-only audit; referential integrity | IQ-003: Database; OQ-011: Audit export |
| GAMP 5 -- Electronic records | Full audit trail; export capabilities; record protection | OQ-011: Audit export; OQ-012: HTML export |
| GAMP 5 -- Electronic signatures | Signature modal meeting 21 CFR Part 11 requirements | OQ-009: Approval with signature |
| GAMP 5 -- Periodic review | Status endpoint; health monitoring; export for review | IQ-002: Health endpoint; OQ-012: Export |

## 3. Coverage Summary

| Standard | Total Requirements Mapped | Verified by IQ | Verified by OQ | Verified by PQ |
|----------|--------------------------|----------------|----------------|----------------|
| 21 CFR Part 11 | 15 | 4 | 11 | 1 |
| EU Annex 11 | 17 | 5 | 11 | 1 |
| ISO 13485 | 18 | 0 | 16 | 6 |
| ISO 14971 | 6 | 0 | 6 | 0 |
| IEC 62304 | 9 | 1 | 8 | 0 |
| GAMP 5 | 10 | 2 | 8 | 0 |
| **Total** | **75** | **12** | **60** | **8** |

## 4. Signature Block

### Prepared by

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
