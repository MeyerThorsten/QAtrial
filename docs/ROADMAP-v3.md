# QAtrial v3.0 — Strategic Feature Roadmap

## Context

QAtrial v2.0 ships with 14 stores, 10 verticals, 37 countries, 15 modules, 6 AI prompts, 7 dashboards, RBAC, audit trail, e-signatures, connectors, and CAPA. The $12.5B QMS market (growing to $31.5B by 2034) is being reshaped by three forces:

1. **FDA QMSR** (effective Feb 2, 2026) — replaces 21 CFR 820 QSR with ISO 13485 incorporation
2. **EU AI Act** (high-risk devices deadline Aug 2, 2027) — requires AI transparency, data governance, bias documentation
3. **ICH E6(R3)** (adopted 2025) — enables decentralized trials, risk-based quality management

QAtrial's competitive advantage is: open-source transparency (auditors inspect source), AI co-pilot, self-hosted data sovereignty, and composable Country × Vertical × Module architecture. The gap vs. commercial tools (Veeva, MasterControl, Greenlight Guru) is primarily in **vertical-specific workflows**, **multi-site collaboration**, and **enterprise operational features**.

---

## Feature Recommendations by Target Audience

### A. Features for Medical Device Companies (Highest Commercial Value)

**Why:** FDA QMSR transition (Feb 2026) creates massive demand. 115% increase in device recalls since 2018 ($5B+/year cost). Companies need QMSR-ready QMS urgently.

| # | Feature | Description | Regulatory Driver |
|---|---------|-------------|-------------------|
| A1 | **DHF/DMR/DHR Management** | Design History File, Device Master Record, Device History Record — structured document containers with version control, traceability to design inputs/outputs, and acceptance criteria | FDA QMSR, ISO 13485 §7.3 |
| A2 | **Design Control Workflow** | Formal workflow: User Needs → Design Input → Design Output → Verification → Validation → Transfer. Gates with approval requirements. | ISO 13485 §7.3, FDA QMSR |
| A3 | **QMSR Gap Assessment Tool** | AI-powered gap analysis specifically mapping existing QMS against new QMSR requirements (ISO 13485 incorporation). Transition checklist with evidence tracking. | FDA QMSR (effective Feb 2026) |
| A4 | **Post-Market Surveillance Dashboard** | Complaint trending, vigilance reporting (MDR Article 87), periodic safety update reports (PSUR), field safety corrective actions (FSCA). | EU MDR 2017/745, FDA 21 CFR 803 |
| A5 | **UDI Management** | Unique Device Identification tracking, GUDID submission preparation, label content management. | FDA 21 CFR 830, EU MDR Article 27 |
| A6 | **Biocompatibility Assessment Module** | ISO 10993 biological evaluation planning, test selection matrix, toxicological risk assessment workflow. | ISO 10993, EU MDR Annex I §10.4 |

**Market sizing:** ~6,500 FDA-registered device companies + ~30,000 EU MDR-affected manufacturers.

---

### B. Features for Pharmaceutical & Biotech Companies

**Why:** cGMP compliance, process validation, and data integrity are perpetual pain points. AI Act impacts AI-enabled drug development.

| # | Feature | Description | Regulatory Driver |
|---|---------|-------------|-------------------|
| B1 | **Electronic Batch Record (eBR)** | Template-driven batch production records with real-time data capture, deviation flagging, in-process controls, and batch release workflow. | 21 CFR 211.188, EU GMP Annex 11 |
| B2 | **Stability Study Manager** | ICH Q1A(R2) study design, storage condition tracking, pull schedules, OOS/OOT investigation triggers, shelf-life prediction. | ICH Q1A(R2), 21 CFR 211.166 |
| B3 | **Process Validation Lifecycle** | Stage 1 (Process Design) → Stage 2 (Process Qualification: IQ/OQ/PQ) → Stage 3 (Continued Process Verification). Automated trending. | FDA Process Validation Guidance, EU GMP Annex 15 |
| B4 | **eCTD Submission Builder** | Generate Module 3 (Quality) sections of electronic Common Technical Document from project data. Map requirements to CTD sections. | ICH M4Q, FDA eCTD guidance |
| B5 | **Pharmacovigilance Signal Detection** | AI-powered adverse event signal detection from complaint data. Disproportionality analysis (PRR, ROR). PSUR generation support. | EU GVP Module IX, 21 CFR 314.80 |
| B6 | **Cleaning Validation Manager** | Residue limit calculations (MACO, PDE-based), swab/rinse sampling plans, campaign grouping, carry-over analysis. | FDA Cleaning Validation Guidance, EU GMP Annex 15 |

---

### C. Features for CROs & Clinical Research

**Why:** ICH E6(R3) adoption creates demand for decentralized trial support. eTMF is a $2B+ market segment.

| # | Feature | Description | Regulatory Driver |
|---|---------|-------------|-------------------|
| C1 | **eTMF (Electronic Trial Master File)** | TMF Reference Model-based document management with 25-year retention, zone/section/artifact hierarchy, completeness scoring, inspection readiness. | ICH E6(R3), TMF Reference Model v3.3 |
| C2 | **eConsent Workflow** | Electronic informed consent capture with version tracking, comprehension assessments, re-consent triggers, remote consent support for decentralized trials. | ICH E6(R3), 21 CFR 50 |
| C3 | **Protocol Deviation Tracker** | Categorization (major/minor/critical), root cause analysis, trend analysis, aggregate reporting for safety review boards. | ICH E6(R3) §4.5, 21 CFR 312.66 |
| C4 | **Site Management & Monitoring** | Investigator site qualification checklists, risk-based monitoring plans, monitoring visit reports, source data verification (SDV) tracking. | ICH E6(R3), FDA Guidance on RBM |
| C5 | **Decentralized Trial Support** | Templates and workflows for hybrid/decentralized trials: remote assessments, ePRO integration points, telemedicine visit documentation. | ICH E6(R3) Annex 2 (expected 2026) |

---

### D. Features for Multi-Site Enterprise Operations

**Why:** #1 pain point for enterprise QMS users is cross-functional collaboration across sites. This is where Veeva and MasterControl dominate.

| # | Feature | Description | Value |
|---|---------|-------------|-------|
| D1 | **Real-Time Collaboration** | WebSocket-based live editing, presence indicators, conflict resolution for concurrent edits. Comment threads on requirements/tests. | Eliminates email-based quality review bottlenecks |
| D2 | **Workflow Engine** | Configurable approval workflows with parallel/sequential routing, escalation rules, SLA timers, delegation, and out-of-office handling. | Replaces ad-hoc approval processes |
| D3 | **Notification Center** | In-app + email notifications for approvals needed, overdue tasks, CAPA deadlines, audit reminders. Configurable per user/role. | Reduces missed deadlines and audit findings |
| D4 | **Multi-Site Dashboard** | Centralized quality overview across sites with drill-down. Site-specific KPIs, cross-site deviation comparison, harmonized metrics. | Global quality oversight |
| D5 | **Supplier Quality Portal** | External supplier-facing portal for document submission, audit response, corrective action tracking. Supplier scorecards with auto-requalification triggers. | Replaces email-based supplier communication |
| D6 | **Data Residency & Multi-Region** | Deploy data per region (EU, US, China, Japan) to comply with GDPR, PIPL, APPI data localization requirements. | Required for regulated multi-nationals |

---

### E. AI-Powered Features (Differentiators)

**Why:** Enterprise customers are asking for AI beyond basic generation. The competitive moat for QAtrial is AI-native quality management.

| # | Feature | Description | Differentiation |
|---|---------|-------------|----------------|
| E1 | **AI Audit Preparation Assistant** | Given an upcoming audit (FDA, EMA, PMDA, Notified Body), AI generates: likely auditor questions, evidence checklist, gap summary, recommended focus areas based on vertical and recent quality events. | No competitor offers this |
| E2 | **Predictive Quality Analytics** | ML-based prediction of: which requirements are likely to fail testing (based on complexity + historical data), which suppliers are at risk, which processes have emerging quality trends. | Beyond reactive QMS |
| E3 | **AI Requirements Extraction** | Paste a regulation section (e.g., QMSR paragraph, MDR Annex I clause) → AI extracts atomic, testable requirements with regulatory references. Bulk import from PDF regulations. | Eliminates manual req decomposition |
| E4 | **Smart Duplicate & Conflict Detection** | AI detects overlapping requirements, conflicting test expectations, redundant CAPA actions across projects. Suggests consolidation. | Reduces QMS bloat |
| E5 | **Change Impact Predictor** | When a requirement changes, AI predicts cascading impact: affected tests, documents, training records, supplier agreements, validation artifacts. Generates impact assessment report. | Prevents change-induced escapes |
| E6 | **Regulatory Change Monitor** | Track regulatory updates (FDA guidances, ICH updates, EU delegated acts). When a standard changes, AI flags affected projects and requirements. Generates change impact assessment. | Proactive compliance |
| E7 | **AI Training Content Generator** | From SOPs and quality procedures, auto-generate training materials, comprehension quizzes, and competency assessments. Vertical-specific (GMP training differs from GCP training). | Reduces training admin burden |

---

### F. Country/Region-Specific Features for Market Expansion

| # | Country/Region | Feature | Opportunity |
|---|----------------|---------|-------------|
| F1 | **Brazil** | ANVISA BGMP templates, MDSAP audit support, RDC 665/2022 compliance mapping | 7th largest pharma market |
| F2 | **Australia/NZ** | TGA Essential Principles mapping, MDSAP integration, Medsafe (NZ) alignment | Mature market, MDSAP recognition |
| F3 | **Saudi Arabia** | SFDA medical device registration templates, Halal compliance for cosmetics/food verticals | Rapidly growing healthcare investment |
| F4 | **Switzerland** | Swissmedic templates, MRA with EU, Swiss Medtech industry (Medtech hub) | High-value market, many HQs |
| F5 | **Singapore** | HSA medical device registration, PDPA privacy compliance | ASEAN regulatory hub |
| F6 | **Israel** | AMAR (Israel MOH) device registration, cybersecurity requirements | Strong medtech ecosystem |
| F7 | **India** | CDSCO medical device rules 2024, DPDP Act implementation, Make in India incentives | Fastest growing device market |
| F8 | **UAE/GCC** | Emirates Authority for Standardization (ESMA), GCC mutual recognition | Gulf health investment boom |

---

### G. Vertical-Specific Extensions

| # | Vertical | Feature | Why |
|---|----------|---------|-----|
| G1 | **IVD (In Vitro Diagnostics)** | IVDR 2017/746 templates, performance evaluation plans, analytical validation workflows | Separate from MDR, own regulatory path |
| G2 | **Combination Products** | Dual-pathway QMS (drug+device or biologic+device), FDA OCP pathway determination support | Growing market segment |
| G3 | **ATMP (Advanced Therapy)** | Cell & gene therapy QMS, EMA ATMP guidelines (effective July 2025), manufacturing comparability | Emerging high-value vertical |
| G4 | **Digital Health / SaMD** | Software as Medical Device classification, IEC 62304 lifecycle, FDA Digital Health framework, De Novo pathway support | Fastest-growing device category |
| G5 | **Automotive Safety** | ISO 26262 ASIL classification integrated into risk module, UN R155/R156 cybersecurity, ASPICE process model | Growing demand post-UNECE regulations |
| G6 | **Food Safety** | FSMA PCQI templates, HACCP plan builder, allergen control programs, FSSC 22000 gap analysis | Adjacent regulated vertical |

---

### H. Operational & Platform Features

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| H1 | **REST/GraphQL API** | Headless API for all QMS operations. Enable third-party integrations, custom dashboards, mobile apps. | High — unlocks ecosystem |
| H2 | **Webhook & Event Streaming** | Publish events (CAPA opened, test failed, approval needed) to external systems. Slack/Teams integration. | High — enterprise integration |
| H3 | **Custom Fields & Forms** | User-defined metadata fields on requirements, tests, CAPA. Form builder for quality event intake. | High — every enterprise asks for this |
| H4 | **Bulk Operations** | Import CSV/Excel of requirements, bulk status updates, mass linking, batch test execution recording. | Medium — operational efficiency |
| H5 | **Scheduled Reports** | Cron-based report generation and email distribution. Management review report packs. | Medium — reduces manual reporting |
| H6 | **Offline / PWA Mode** | Progressive Web App for field use (audits, manufacturing floor, clinical sites). Sync when reconnected. | Medium — field operations |
| H7 | **Advanced Search** | Full-text search across all entities with filters, saved searches, search-based dashboards. | Medium — usability |
| H8 | **Document Generation Engine** | Generate DOCX/PDF from templates with dynamic data insertion. Protocol templates, SOPs, validation reports. | Medium — audit documentation |

---

## Recommended Implementation Sequence

### Release 3.0 — "QMSR & Device Ready" (Highest Commercial Impact)
Focus: Medical device companies preparing for FDA QMSR (Feb 2026)
1. **A1** DHF/DMR/DHR Management
2. **A2** Design Control Workflow
3. **A3** QMSR Gap Assessment (AI-powered)
4. **E3** AI Requirements Extraction (paste regulation → atomic reqs)
5. **H3** Custom Fields & Forms
6. **D2** Workflow Engine (approval routing)
7. **D3** Notification Center

### Release 3.1 — "Enterprise Collaboration"
Focus: Multi-site pharma/biotech operations
1. **D1** Real-Time Collaboration
2. **D4** Multi-Site Dashboard
3. **D5** Supplier Quality Portal
4. **B1** Electronic Batch Records
5. **H1** REST/GraphQL API
6. **H2** Webhook & Event Streaming

### Release 3.2 — "Clinical & AI Intelligence"
Focus: CROs and AI-native features
1. **C1** eTMF Module
2. **C2** eConsent Workflow
3. **E1** AI Audit Preparation Assistant
4. **E2** Predictive Quality Analytics
5. **E5** Change Impact Predictor
6. **E6** Regulatory Change Monitor

### Release 3.3 — "Global Expansion"
Focus: New markets and verticals
1. **F1-F8** Country-specific features (Brazil, Australia, Saudi, etc.)
2. **G1-G6** New verticals (IVD, SaMD, ATMP, Automotive Safety, Food)
3. **B4** eCTD Submission Builder
4. **D6** Data Residency & Multi-Region
5. **H6** Offline / PWA Mode

---

## Revenue Impact Estimate

| Release | Target Customers | Est. Market |
|---------|-----------------|-------------|
| v3.0 QMSR/Device | ~6,500 FDA device companies + 30,000 EU MDR | QMSR transition creates $500M+ tooling demand |
| v3.1 Enterprise | Multi-site pharma/biotech (top 200 + CMOs) | Enterprise QMS market: $4B segment |
| v3.2 Clinical/AI | ~1,100 CROs globally + pharma sponsors | eTMF market alone: $2B+ |
| v3.3 Global | Emerging market manufacturers | Brazil, India, Saudi, UAE: $1.5B+ QMS spend |

---

## Verification

For each release:
1. `npm run build` — clean
2. `npm run test` — all suites pass
3. Feature-specific: QMSR gap tool correctly identifies gaps against ISO 13485 clauses
4. Workflow engine: multi-step approval completes with audit trail
5. DHF/DMR/DHR: design control gates enforce approval before progression
6. API: OpenAPI spec validates, Swagger UI accessible
7. Collaboration: two browser tabs show real-time updates
8. Country features: new templates load correctly for new countries
