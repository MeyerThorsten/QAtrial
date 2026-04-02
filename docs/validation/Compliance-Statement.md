# Statement of Compliance

**Document ID:** QA-VAL-CS-001
**System:** QAtrial v3.0.0
**Date:** _______________
**Prepared by:** _______________

---

## 1. System Description

**QAtrial** is an open-source, AI-powered quality management platform designed for regulated industries. It provides a comprehensive workspace for managing requirements, tests, risks, CAPAs, and compliance documentation with full audit trail and electronic signature capabilities.

| Attribute | Value |
|-----------|-------|
| **Product Name** | QAtrial |
| **Version** | 3.0.0 |
| **License** | AGPL-3.0-only |
| **Architecture** | Web application (React frontend, Hono/Node.js backend, PostgreSQL database) |
| **Deployment Options** | Standalone, Docker, Kubernetes |
| **Source Code** | https://github.com/MeyerThorsten/QAtrial |

## 2. Regulatory Alignment

### 2.1 21 CFR Part 11 -- Electronic Records and Electronic Signatures

| Requirement | Section | QAtrial Implementation | Status |
|-------------|---------|----------------------|--------|
| System validation | 11.10(a) | IQ/OQ/PQ protocols provided; automated test suite | ✅ Supported |
| Legible, readily retrievable records | 11.10(b) | Export to CSV, HTML, and PDF formats | ✅ Supported |
| Record protection | 11.10(c) | PostgreSQL database with backup capabilities; role-based access | ✅ Supported |
| Limiting system access | 11.10(d) | RBAC with 5 roles (admin, qa_manager, qa_engineer, editor, auditor); JWT authentication | ✅ Supported |
| Audit trail | 11.10(e) | Append-only audit log capturing who, what, when, why for every change; previous and new values recorded | ✅ Supported |
| Operational system checks | 11.10(f) | Input validation; referential integrity via Prisma ORM | ✅ Supported |
| Authority checks | 11.10(g) | `requirePermission` middleware enforces role-based access on every API endpoint | ✅ Supported |
| Device checks | 11.10(h) | Session management via JWT with expiration; refresh token rotation | ✅ Supported |
| Personnel training | 11.10(i) | User Guide and training documentation provided | ✅ Supported |
| Written policies | 11.10(j) | Compliance statement and SOPs provided as templates | ✅ Supported |
| Controls for open systems | 11.10(k) | HTTPS support; JWT encryption; bcrypt password hashing | ✅ Supported |
| Signature manifestation | 11.50 | Signature modal captures: printed name, role/title, meaning of signature, reason, and timestamp | ✅ Supported |
| Signature/record linking | 11.70 | Signatures are linked to specific records via `signatureId` in the approval record and audit trail | ✅ Supported |
| General requirements for e-signatures | 11.100 | Each user has a unique email identifier; password required for each signature | ✅ Supported |
| Signature components | 11.200 | Password re-verification at time of signing; identity confirmed via JWT + password | ✅ Supported |

### 2.2 EU Annex 11 -- Computerised Systems

| Requirement | Section | QAtrial Implementation | Status |
|-------------|---------|----------------------|--------|
| Risk management | §1 | Risk assessment module with severity, likelihood, detectability; AI-assisted classification | ✅ Supported |
| Personnel | §2 | RBAC with defined roles and permissions; training documentation | ✅ Supported |
| Suppliers and service providers | §3 | Open-source with full source code transparency; customer controls deployment | ✅ Supported |
| Validation | §4 | IQ/OQ/PQ protocols; automated tests; traceability matrix | ✅ Supported |
| Data integrity | §5 | PostgreSQL ACID transactions; Prisma ORM with referential integrity | ✅ Supported |
| Accuracy checks | §6 | Input validation on all API endpoints; type-safe schema definitions | ✅ Supported |
| Data storage | §7 | PostgreSQL with configurable backup; evidence stored in managed file system | ✅ Supported |
| Printouts | §8 | Export to CSV, HTML, PDF; all data exportable for printing | ✅ Supported |
| Audit trail | §9 | Append-only chronological log; captures identity, action, timestamp, old/new values, reason | ✅ Supported |
| Change and configuration management | §10 | Version-controlled source code; database migrations via Prisma | ✅ Supported |
| Periodic evaluation | §11 | Status endpoint for health monitoring; export capabilities for review | ✅ Supported |
| Security | §12 | JWT authentication; bcrypt password hashing; RBAC; CORS; HTTPS support | ✅ Supported |
| Incident management | §13 | CAPA module for tracking and resolving incidents | ✅ Supported |
| Electronic signatures | §14 | Signature modal with identity verification, meaning, reason, and timestamp | ✅ Supported |
| Batch release | §15 | Approval workflows with configurable review chains | ✅ Supported |
| Business continuity | §16 | Database backup/restore; Docker deployment for reproducibility | ✅ Supported |
| Archiving | §17 | All records stored in PostgreSQL; export for long-term archival | ✅ Supported |

### 2.3 GAMP 5 Second Edition Classification

| Attribute | Value |
|-----------|-------|
| **GAMP Category** | Category 4 -- Configured Product |
| **Rationale** | QAtrial is a configurable software product. Customers configure it for their specific country, vertical, and module needs without modifying source code. |
| **Validation Approach** | Risk-based validation per GAMP 5 guidelines |
| **Validation Documents** | IQ, OQ, PQ protocols provided |
| **Supplier Assessment** | Open-source; full source code available for audit |
| **Configuration Management** | Git-based version control; Prisma database migrations |
| **Testing Strategy** | Automated unit tests (Vitest); manual IQ/OQ/PQ execution |

## 3. Limitations and Customer Responsibilities

### 3.1 Limitations

- QAtrial is a **tool** that supports compliance; it does not guarantee compliance by itself
- Compliance depends on proper deployment, configuration, and usage by the customer
- Electronic signatures in QAtrial use password re-verification; biometric signatures are not supported
- The AI co-pilot provides suggestions only; all AI outputs must be reviewed and approved by qualified personnel
- PDF export requires a third-party rendering tool or browser print functionality

### 3.2 Customer Responsibilities

The customer is responsible for:

1. **Infrastructure Security** -- Securing the server, network, and database infrastructure
2. **Backup and Disaster Recovery** -- Implementing and testing backup procedures
3. **User Training** -- Ensuring all users are trained on QAtrial and relevant SOPs
4. **SOPs and Policies** -- Creating organization-specific standard operating procedures
5. **Periodic Review** -- Conducting periodic system reviews as required by their QMS
6. **Change Control** -- Managing updates and configuration changes through a formal change control process
7. **Access Management** -- Provisioning and de-provisioning user accounts per their HR processes
8. **Validation Execution** -- Executing IQ/OQ/PQ protocols in their specific environment
9. **AI Output Review** -- Reviewing and approving all AI-generated content before use in regulated processes
10. **Regulatory Compliance** -- Ensuring overall process compliance with applicable regulations

## 4. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | _______________ | _______________ | Initial release for QAtrial v3.0.0 |
| | | | |
| | | | |

## 5. Signature Block

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
