# QAtrial Regulatory Reference

Reference guide for the regulatory standards and frameworks used in QAtrial's templates.

---

## Table of Contents

1. [By Country](#1-by-country)
2. [By Vertical](#2-by-vertical)
3. [Module Standards](#3-module-standards)
4. [Compliance Starter Packs](#4-compliance-starter-packs)
5. [Validation Package](#5-validation-package)
6. [Compliance Improvements](#6-compliance-improvements)

---

## 1. By Country

### United States (US)

**Regulatory Authority:** FDA (Food and Drug Administration)

**Primary Standards Referenced in Templates:**
- 21 CFR Part 11 -- Electronic Records; Electronic Signatures
- 21 CFR Parts 210/211 -- Current Good Manufacturing Practice (cGMP) for drugs
- 21 CFR Part 820 -- Quality System Regulation (QSR) / QMSR for medical devices
- 21 CFR Parts 600-680 -- Biologics regulations
- 21 CFR Part 58 -- Good Laboratory Practice (GLP)
- 21 CFR Parts 50/56 -- IRB and Informed Consent

**Notable Requirements:**
- Electronic records must have audit trails per 11.10(e)
- Electronic signatures require re-authentication per 11.200(a)
- Computer system validation following GAMP 5 framework
- Data integrity per ALCOA+ principles (FDA guidance)
- 510(k) and PMA submission pathways for medical devices

---

### European Union (EU) -- Base Templates

**Regulatory Framework:** EU-wide GMP, MDR, IVDR

**Primary Standards Referenced in Templates:**
- EU Annex 11 -- Computerised Systems
- EU GMP (EudraLex Volume 4) -- Good Manufacturing Practice
- EU MDR 2017/745 -- Medical Device Regulation
- EU IVDR 2017/746 -- In Vitro Diagnostic Regulation
- EU CTR 536/2014 -- Clinical Trials Regulation
- EU Cosmetics Regulation 1223/2009
- REACH (EC 1907/2006) -- Chemical safety
- CLP Regulation (EC 1272/2008) -- Classification and labelling

**Notable Requirements:**
- Annex 11 Section 9: Audit trail requirement for GMP-critical data
- Data integrity per EMA guidance on computerised systems
- EU MDR requires clinical evaluation and post-market surveillance
- EU base templates are loaded first for all EU/EFTA country projects

---

### Germany (DE)

**Regulatory Authority:** BfArM (Federal Institute for Drugs and Medical Devices), PEI (Paul Ehrlich Institute for biologics)

**Primary Standards Referenced in Templates:**
- AMWHV (Arzneimittel- und Wirkstoffherstellungsverordnung) -- German GMP
- MPG/MDR implementation -- Medical device regulations
- EU Annex 11 (applied through German implementation)
- GAMP 5 (widely adopted in German pharma industry)
- ISO 13485 -- QMS for medical devices

**Notable Requirements:**
- German GMP requirements are layered on top of EU GMP base
- BfArM-specific CSV expectations for pharmaceutical systems
- Strong emphasis on qualification and validation documentation (DQ/IQ/OQ/PQ)
- German language documentation may be required for domestic regulatory submissions

---

### United Kingdom (GB)

**Regulatory Authority:** MHRA (Medicines and Healthcare products Regulatory Agency)

**Primary Standards Referenced in Templates:**
- MHRA Data Integrity Guidance (March 2018)
- UK GMP (derived from EU GMP, post-Brexit adaptations)
- MHRA GxP Data Integrity Definitions and Guidance
- GAMP 5 (2nd Edition)
- EU Annex 11 (adopted into UK law)

**Notable Requirements:**
- MHRA places strong emphasis on data integrity and ALCOA+ principles
- Post-Brexit, UK has its own device regulation (UKCA marking)
- CSV expectations align with GAMP 5 risk-based approach
- MHRA guidance on cloud and SaaS system validation

---

### France (FR)

**Regulatory Authority:** ANSM (Agence nationale de securite du medicament et des produits de sante)

**Primary Standards Referenced in Templates:**
- Bonnes Pratiques de Fabrication (BPF) -- French GMP
- ANSM guidelines on computerised systems
- EU Annex 11 (French implementation)
- ISO 13485 for medical devices
- French Bioethics Law requirements for clinical research

**Notable Requirements:**
- French GMP (BPF) aligns with EU GMP with ANSM-specific interpretations
- CNIL (data protection authority) requirements for patient data
- French-language documentation requirements for domestic submissions
- ANSM inspection focus areas for computerised systems

---

### Japan (JP)

**Regulatory Authority:** PMDA (Pharmaceuticals and Medical Devices Agency), MHLW (Ministry of Health, Labour and Welfare)

**Primary Standards Referenced in Templates:**
- GMP Ministerial Ordinance (Japan GMP)
- PMDA ER/ES Guidance -- Electronic Records and Electronic Signatures
- PIC/S GMP Guidelines (Japan is a PIC/S member)
- PMDA CSV Guidelines
- J-GCP (Japanese Good Clinical Practice)

**Notable Requirements:**
- PMDA ER/ES guidance is the Japanese equivalent of 21 CFR Part 11
- STED (Summary Technical Documentation) format for medical device submissions
- Japanese-language documentation requirements
- Emphasis on data reliability and traceability in PMDA inspections
- PIC/S alignment for pharmaceutical manufacturing

---

### China (CN)

**Regulatory Authority:** NMPA (National Medical Products Administration, formerly CFDA)

**Primary Standards Referenced in Templates:**
- NMPA Medical Device Registration Regulations
- Chinese GMP (2010 Revision)
- GB/T 42061-2022 (equivalent to ISO 13485)
- NMPA Data Integrity Requirements
- Chinese Pharmacopoeia requirements

**Notable Requirements:**
- NMPA registration process for medical devices (Class I/II/III)
- Chinese GMP has unique requirements beyond EU/US GMP
- GB/T standards are Chinese national equivalents of ISO standards
- Data localization requirements for clinical trial data
- Chinese-language documentation mandatory for domestic registration

---

### South Korea (KR)

**Regulatory Authority:** MFDS (Ministry of Food and Drug Safety)

**Primary Standards Referenced in Templates:**
- KGMP (Korean Good Manufacturing Practice)
- MFDS Medical Device Regulations
- PIC/S GMP Guidelines (Korea is a PIC/S member)
- ICH Q7 requirements (adopted by MFDS)
- Korean Pharmaceutical Affairs Act

**Notable Requirements:**
- KGMP closely follows PIC/S guidelines with Korean-specific additions
- MFDS has its own device classification system
- Korean-language documentation requirements
- Emphasis on process validation and cleaning validation
- KGMP inspection focus on computerised system controls

---

### India (IN)

**Regulatory Authority:** CDSCO (Central Drugs Standard Control Organisation)

**Primary Standards Referenced in Templates:**
- Schedule M (Indian GMP)
- CDSCO Guidelines on Computerised Systems
- WHO TRS Guidelines (India follows WHO guidance extensively)
- Indian Pharmacopoeia requirements
- Medical Device Rules 2017

**Notable Requirements:**
- Schedule M defines Indian GMP requirements (revised 2018)
- WHO guidance is heavily referenced for pharmaceutical manufacturing
- CDSCO inspection procedures for computerised systems
- Data integrity requirements aligned with WHO and PIC/S guidance
- Growing emphasis on CSV and electronic records

---

### Canada (CA)

**Regulatory Authority:** Health Canada

**Primary Standards Referenced in Templates:**
- CMDR (Canadian Medical Devices Regulations)
- Health Canada GMP Guidelines (GUI-0001)
- ISO 13485:2016 (mandatory for medical device QMS)
- ISO 14971 (risk management for medical devices)
- Health Canada CSV Guidance

**Notable Requirements:**
- Health Canada aligns closely with FDA and EU approaches
- CMDR requires ISO 13485 compliance for medical devices
- Risk-based approach to CSV following GAMP 5
- Bilingual (English/French) documentation may be required
- MDEL (Medical Device Establishment Licence) requirements

---

### Mexico (MX)

**Regulatory Authority:** COFEPRIS (Comision Federal para la Proteccion contra Riesgos Sanitarios)

**Primary Standards Referenced in Templates:**
- NOM-059-SSA1-2015 -- Good Manufacturing Practices
- NOM-241-SSA1-2012 -- GMP for Medical Devices
- COFEPRIS guidelines on pharmaceutical manufacturing
- PIC/S GMP alignment (Mexico is working toward PIC/S membership)

**Notable Requirements:**
- NOM-059 is the primary Mexican GMP standard
- COFEPRIS inspection procedures for manufacturing sites
- Clean room qualification per NOM-059 requirements
- Spanish-language documentation mandatory
- Growing alignment with international GMP standards

---

### Italy (IT)

**Regulatory Authority:** AIFA (Agenzia Italiana del Farmaco)

**Primary Standards Referenced in Templates:**
- Italian implementation of EU GMP (Norme di Buona Fabbricazione)
- AIFA guidelines on pharmaceutical manufacturing
- EU Annex 11 (Italian implementation)
- EU MDR 2017/745 (Italian implementation)
- EMA guidelines

**Notable Requirements:**
- AIFA enforces EU GMP through Italian national legislation
- Strong pharmaceutical manufacturing sector with AIFA inspection focus
- Italian-language documentation for domestic submissions
- EU GMP Annex 1 compliance for sterile manufacturing
- Integration with European Medicines Regulatory Network

---

### Spain (ES)

**Regulatory Authority:** AEMPS (Agencia Espanola de Medicamentos y Productos Sanitarios)

**Primary Standards Referenced in Templates:**
- Spanish implementation of EU GMP (Buenas Practicas de Fabricacion)
- AEMPS Good Clinical Practice guidelines
- EU CTR 536/2014 (Spanish implementation via CTIS)
- EU MDR 2017/745 (Spanish implementation)

**Notable Requirements:**
- AEMPS oversight of clinical trials per EU Clinical Trials Regulation
- Spanish implementation of CTIS (Clinical Trials Information System)
- Spanish-language documentation requirements
- Strong CRO sector requiring GCP compliance
- Integration with European clinical trial network

---

### Netherlands (NL)

**Regulatory Authority:** IGJ (Inspectie Gezondheidszorg en Jeugd), CCMO (Central Committee on Research Involving Human Subjects)

**Primary Standards Referenced in Templates:**
- Dutch implementation of EU GMP
- RvA (Raad voor Accreditatie) requirements for clinical laboratories
- ISO 15189:2022 for medical laboratories
- EU MDR 2017/745 (Dutch implementation)
- ISO 17025 for testing and calibration laboratories

**Notable Requirements:**
- Strong clinical laboratory sector with RvA accreditation
- ISO 15189 is the primary standard for diagnostic laboratories
- Measurement uncertainty analysis requirements
- Dutch-language documentation for laboratory accreditation
- Integration with European Medicines Agency (EMA headquarters in Amsterdam)

---

## 2. By Vertical

### Pharmaceuticals (pharma)

**Risk Taxonomy:** ICH Q9 (Quality Risk Management)

**Key GxP Standards:**
- GMP (Good Manufacturing Practice)
- GCP (Good Clinical Practice)
- GLP (Good Laboratory Practice)
- GDP (Good Distribution Practice)
- GVP (Good Pharmacovigilance Practice)
- GDocP (Good Documentation Practice)

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| ICH Q7 | GMP for Active Pharmaceutical Ingredients |
| ICH Q10 | Pharmaceutical Quality System |
| 21 CFR Parts 210/211 | US cGMP for finished pharmaceuticals |
| 21 CFR Part 11 | Electronic records and signatures |
| EU Annex 11 | Computerised systems |
| GAMP 5 (2nd Edition) | CSV framework |

---

### Biotechnology (biotech)

**Risk Taxonomy:** ICH Q9

**Key GxP Standards:**
- GMP (Biologics-specific)
- GCP
- GLP

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| ICH Q5A-Q5E | Quality of biotechnological products |
| ICH Q8 | Pharmaceutical development |
| ICH Q11 | Development and manufacture of drug substances |
| 21 CFR Parts 600-680 | US biologics regulations |
| EU Annex 11 | Computerised systems |
| GAMP 5 | CSV framework |

---

### Medical Devices (medical_devices)

**Risk Taxonomy:** ISO 14971 (Risk Management for Medical Devices)

**Safety Classification:** FDA Class I / II / III

**Key GxP Standards:**
- QMSR / QSR
- ISO 13485 (QMS)
- IEC 62304 (Software Lifecycle)
- ISO 14971 (Risk Management)

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| ISO 13485 | Quality Management Systems for Medical Devices |
| ISO 14971 | Application of Risk Management to Medical Devices |
| 21 CFR 820 | Quality System Regulation (transitioning to QMSR) |
| EU MDR 2017/745 | European Medical Device Regulation |
| IEC 62304 | Medical Device Software Lifecycle Processes |
| IEC 62366 | Usability Engineering for Medical Devices |

---

### Clinical Research / CRO (cro)

**Risk Taxonomy:** ICH Q9

**Safety Classification:** GCP Critical / Non-Critical

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| ICH E6(R2) | Good Clinical Practice |
| 21 CFR Part 11 | Electronic records and signatures |
| 21 CFR Parts 50/56 | IRB and informed consent |
| EU CTR 536/2014 | European Clinical Trials Regulation |
| GAMP 5 | CSV framework |
| ALCOA+ | Data integrity principles |

---

### Clinical Laboratories (clinical_lab)

**Risk Taxonomy:** FMEA (Failure Mode and Effects Analysis)

**Safety Classification:** High Complexity / Moderate / Waived

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| CLIA 88 (42 CFR 493) | Clinical Laboratory Improvement Amendments |
| CAP Accreditation Checklist | College of American Pathologists |
| ISO 15189 | Medical Laboratories -- Requirements for Quality and Competence |
| ISO 17025 | Testing and Calibration Laboratories |
| 21 CFR Part 11 | Electronic records |
| GLP (21 CFR Part 58) | Good Laboratory Practice |

---

### Logistics / GDP / GSP (logistics)

**Risk Taxonomy:** FMEA

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| EU GDP Guidelines (2013/C 343/01) | European Good Distribution Practice |
| WHO TRS 957 Annex 5 | WHO GDP guidance |
| 21 CFR Part 211.150 | US distribution requirements |
| USP <1079> | Good Storage Practice |
| DSCSA | Drug Supply Chain Security Act |
| ISO 9001 | Quality Management Systems |

---

### Software and IT / GAMP/CSV (software_it)

**Risk Taxonomy:** GAMP 5

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| GAMP 5 (2nd Edition) | Good Automated Manufacturing Practice |
| ISO 27001 | Information Security Management System |
| SOC 2 Type II | Service Organization Controls |
| OWASP Top 10 | Web application security |
| NIST CSF | Cybersecurity Framework |
| IEC 62304 | Medical device software (where applicable) |

---

### Cosmetics / Chemical / Environmental (cosmetics)

**Risk Taxonomy:** Generic

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| EU Cosmetics Regulation 1223/2009 | EU cosmetics safety |
| FDA FD&C Act | US cosmetics regulation |
| ISO 22716 | GMP for Cosmetics |
| REACH (EC 1907/2006) | Chemical safety registration |
| MoCRA | Modernization of Cosmetics Regulation Act (US) |
| ISO 9001 | Quality Management Systems |

---

### Aerospace (aerospace)

**Risk Taxonomy:** FMEA

**Safety Classification:** DAL A-E (DO-178C)

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| AS9100D | QMS for Aviation, Space, and Defense |
| DO-178C | Software Considerations in Airborne Systems |
| DO-254 | Design Assurance for Airborne Electronic Hardware |
| EASA Part 21 | European Aviation Safety Agency certification |
| FAR Part 21 | FAA type and production certification |
| NADCAP | National Aerospace and Defense Contractors Accreditation |

---

### Chemical / Environmental (chemical_env)

**Risk Taxonomy:** FMEA

**Primary Regulatory References in Templates:**

| Standard | Description |
|----------|-------------|
| REACH (EC 1907/2006) | Registration, Evaluation, Authorisation of Chemicals |
| CLP Regulation (EC 1272/2008) | Classification, Labelling, Packaging |
| TSCA | US Toxic Substances Control Act |
| ISO 14001 | Environmental Management Systems |
| ISO 45001 | Occupational Health and Safety |
| GHS | Globally Harmonized System of Classification |

---

## 3. Module Standards

### Audit Trail

**Regulations That Require It:**
- 21 CFR Part 11.10(e) -- Electronic records must maintain audit trails
- EU Annex 11 Section 9 -- Audit trail for GMP-critical data changes
- FDA Data Integrity Guidance
- MHRA Data Integrity Guidance
- PIC/S PI 011 (GMP Computerised Systems)

**Key Compliance Points:**
- Every CRUD operation on GxP records must be logged
- Before/after values must be captured for modifications
- Timestamps must be from a trusted, NTP-synchronized source
- Audit trail must be tamper-resistant (append-only, hash chaining)
- User identity must be captured for every entry
- Audit trail must be readily available for review (no "hiding" behind queries)

---

### Electronic Signatures

**Regulations That Require It:**
- 21 CFR Part 11 Subparts B and C
- EU Annex 11 Section 14
- PMDA ER/ES Guidance (Japan)
- Health Canada Part 11 equivalent guidance

**Key Compliance Points:**
- Each signature must be linked to a unique individual (11.100)
- Signature manifestation: name, date/time, meaning (11.50)
- Re-authentication required at point of signing (11.200)
- Non-repudiation: signer cannot deny having signed (11.70)
- Signature/record binding must survive export and archival

---

### Data Integrity (ALCOA+)

**Regulations That Require It:**
- FDA Data Integrity and Compliance With Drug CGMP (2018)
- MHRA GxP Data Integrity Guidance (2018)
- WHO Technical Report Series No. 996 Annex 5
- PIC/S PI 041 (Good Practices for Data Management)

**Key Compliance Points:**
- **A**ttributable: Who performed the action and when
- **L**egible: Data is readable and permanent
- **C**ontemporaneous: Recorded at the time of activity
- **O**riginal: First recording of the data (or certified copy)
- **A**ccurate: No errors or editing without documentation
- **+Complete, Consistent, Enduring, Available**

---

### Change Control

**Regulations That Require It:**
- 21 CFR 211.100 (Written procedures for production and process control)
- EU GMP Chapter 1 (Pharmaceutical Quality System)
- ISO 13485 Section 7.3.9 (Design and development changes)
- ICH Q10 (Pharmaceutical Quality System)

**Key Compliance Points:**
- Formal change request documentation
- Impact assessment before implementation
- Approval workflow with defined authority levels
- Change classification (major/minor)
- Effectiveness verification post-implementation
- Strict verticals (pharma, medical devices, biotech) require 2+ approvers

---

### CAPA (Corrective and Preventive Actions)

**Regulations That Require It:**
- 21 CFR 820.90 (Medical device CAPA)
- EU GMP Chapter 1.4 (Quality risk management)
- ISO 13485 Section 8.5.2/8.5.3
- ICH Q10 Section 3.2

**Key Compliance Points:**
- Root cause analysis methodology
- Corrective action to address the immediate problem
- Preventive action to prevent recurrence
- Effectiveness verification with defined criteria
- Trending and escalation for systemic issues
- CAPA closure requires documented evidence of effectiveness

---

### Deviation Management

**Regulations That Require It:**
- 21 CFR 211.192 (Production record review -- investigation of discrepancies)
- EU GMP Chapter 1.4 (Deviation handling)
- ISO 13485 Section 8.3 (Control of nonconforming product)

**Key Compliance Points:**
- Deviation recording with classification (critical/major/minor)
- Investigation with root cause determination
- Impact assessment on product quality and patient safety
- Extension to CAPA when systemic issues identified
- Trending of deviations for quality improvement

---

### Training Management

**Regulations That Require It:**
- 21 CFR 211.25 (Personnel qualifications)
- EU GMP Chapter 2 (Personnel)
- ISO 13485 Section 6.2 (Human resources)
- 21 CFR 820.25 (Medical device personnel)

**Key Compliance Points:**
- Training plans aligned to job functions
- Competency assessment and documentation
- Training effectiveness verification
- Retraining requirements for changes
- Training records accessible for inspection

---

### Supplier Qualification

**Regulations That Require It:**
- 21 CFR 211.84 (Testing and approval of components)
- EU GMP Chapter 5 (Production -- starting materials)
- ISO 13485 Section 7.4 (Purchasing)
- ICH Q7 Section 7 (Contract manufacturing)

**Key Compliance Points:**
- Supplier assessment and qualification criteria
- Supplier auditing program
- Approved supplier list management
- Quality agreements
- Ongoing performance monitoring and review

---

### Complaint Handling

**Regulations That Require It:**
- 21 CFR 820.198 (Medical device complaint handling)
- 21 CFR 211.198 (Drug product complaint files)
- EU MDR Article 87-92 (Vigilance)
- ISO 13485 Section 8.2.2 (Complaint handling)

**Key Compliance Points:**
- Complaint intake and classification
- Investigation procedures
- Trending and signal detection
- Regulatory reporting (MDR, MedWatch, MAUDE)
- Closure with documented rationale

---

### Risk Management

**Regulations That Require It:**
- ISO 14971 (Medical devices)
- ICH Q9 (Pharmaceutical quality risk management)
- EU MDR 2017/745 Annex I (General safety and performance requirements)
- 21 CFR 820.30(g) (Design validation including risk analysis)

**Key Compliance Points:**
- Hazard identification
- Risk estimation (severity, probability, detectability)
- Risk evaluation against acceptability criteria
- Risk control measures
- Residual risk assessment
- Risk management report

---

### Document Control

**Regulations That Require It:**
- 21 CFR 820.40 (Document controls)
- EU GMP Chapter 4 (Documentation)
- ISO 13485 Section 4.2.4/4.2.5
- 21 CFR 211.186-188 (Master and batch production records)

**Key Compliance Points:**
- Version control with revision history
- Review and approval before issuance
- Controlled distribution (ensure only current versions in use)
- Obsolete document management
- Document change control integration

---

### Backup and Disaster Recovery

**Regulations That Require It:**
- 21 CFR Part 11.10(c) (Protection of records)
- EU Annex 11 Section 7.1 (Data storage and backup)
- ISO 27001 Annex A.12.3 (Backup)

**Key Compliance Points:**
- Defined backup schedule and retention policy
- Regular restore testing with documented results
- Business continuity plan for system failure
- Off-site or cloud backup for disaster scenarios
- Recovery Time Objective (RTO) and Recovery Point Objective (RPO) defined

---

### Access Control / Segregation of Duties

**Regulations That Require It:**
- 21 CFR 11.10(d) (Limiting system access)
- EU Annex 11 Section 12 (Security)
- ISO 27001 Annex A.9 (Access control)
- 21 CFR 211.68 (Automatic data processing systems)

**Key Compliance Points:**
- Role-based access control (RBAC)
- Unique user credentials (no shared accounts)
- Segregation of duties (author vs. approver)
- Periodic access reviews
- Account lifecycle management (onboarding, offboarding)

---

### Validation / CSV

**Regulations That Require It:**
- 21 CFR Part 11 (Electronic records systems)
- EU Annex 11 (Computerised systems)
- GAMP 5 (2nd Edition)
- PIC/S PI 011

**Key Compliance Points:**
- User Requirements Specification (URS)
- Functional Specification (FS)
- Design Specification (DS)
- Installation Qualification (IQ)
- Operational Qualification (OQ)
- Performance Qualification (PQ)
- Validation Summary Report (VSR)
- Traceability Matrix (URS to test evidence)

---

### Traceability Matrix

**Regulations That Require It:**
- IEC 62304 Section 5.7 (Software verification -- traceability)
- ISO 13485 Section 7.3.8 (Design transfer)
- GAMP 5 (requirement traceability)
- 21 CFR 820.30 (Design controls -- design verification)

**Key Compliance Points:**
- Full bidirectional traceability (requirement to test, test to requirement)
- Coverage analysis (no orphaned requirements)
- Gap identification (requirements without tests)
- Design input to design output mapping
- Verification and validation evidence linking

---

## 4. Compliance Starter Packs

QAtrial provides 4 pre-configured compliance starter packs that bundle a regulatory framework into a one-click wizard setup:

### FDA Software Validation (GAMP 5)

| Attribute | Value |
|-----------|-------|
| **Target Audience** | Software/IT teams validating systems under FDA oversight |
| **Country** | US |
| **Vertical** | Software and IT (GAMP/CSV) |
| **Project Type** | Validation |
| **Modules** | Audit Trail, Electronic Signatures, Data Integrity, Change Control, Validation/CSV, Access Control, Document Control |
| **Key Standards** | 21 CFR Part 11, EU Annex 11, GAMP 5 2nd Edition |

**Use case:** Validating a computerised system (LIMS, ERP, MES, QMS) per FDA expectations. Generates requirements covering Part 11 electronic records, GAMP 5 Category 4/5 validation, audit trail, and access control.

---

### EU MDR Medical Device QMS

| Attribute | Value |
|-----------|-------|
| **Target Audience** | Medical device manufacturers establishing or maintaining QMS |
| **Country** | DE (EU base templates also loaded) |
| **Vertical** | Medical Devices |
| **Project Type** | Quality System |
| **Modules** | Audit Trail, Electronic Signatures, Risk Management, CAPA, Deviation Management, Supplier Qualification, Complaint Handling, Document Control, Training |
| **Key Standards** | ISO 13485, ISO 14971, EU MDR 2017/745, IEC 62304, IEC 62366 |

**Use case:** Setting up a quality management system for CE-marked medical devices. Generates requirements for design controls, risk management (ISO 14971), post-market surveillance, and full QMS lifecycle.

---

### FDA GMP Pharmaceutical Quality

| Attribute | Value |
|-----------|-------|
| **Target Audience** | Pharmaceutical manufacturers establishing cGMP compliance |
| **Country** | US |
| **Vertical** | Pharmaceuticals |
| **Project Type** | Quality System |
| **Modules** | Audit Trail, Electronic Signatures, Data Integrity, Change Control, CAPA, Deviation Management, Training, Supplier Qualification, Document Control, Validation/CSV |
| **Key Standards** | 21 CFR 210/211, ICH Q7, ICH Q10, 21 CFR Part 11, GAMP 5 |

**Use case:** Establishing a pharmaceutical quality system meeting FDA cGMP expectations. Covers production controls, laboratory controls, packaging and labeling, CAPA, and supplier qualification.

---

### ISO 27001 + GDPR Compliance

| Attribute | Value |
|-----------|-------|
| **Target Audience** | IT/software teams establishing information security and privacy compliance |
| **Country** | DE (EU base templates also loaded) |
| **Vertical** | Software and IT (GAMP/CSV) |
| **Project Type** | Compliance |
| **Modules** | Audit Trail, Access Control, Data Integrity, Change Control, Risk Management, Document Control, Backup and Disaster Recovery |
| **Key Standards** | ISO 27001, GDPR (EU 2016/679), SOC 2, NIST CSF |

**Use case:** Achieving ISO 27001 certification and GDPR compliance. Generates requirements for information security controls, privacy impact assessments, data processing records, incident response, and business continuity.

---

## 5. Validation Package

QAtrial includes a complete validation documentation package in `docs/validation/` suitable for regulatory inspection and audit purposes. These documents support IQ/OQ/PQ qualification of QAtrial as a GxP computerised system.

### Document Overview

| Document | File | Purpose |
|----------|------|---------|
| **Installation Qualification (IQ)** | `docs/validation/IQ.md` | Verifies that QAtrial is correctly installed and configured |
| **Operational Qualification (OQ)** | `docs/validation/OQ.md` | Verifies that QAtrial functions correctly per its specifications |
| **Performance Qualification (PQ)** | `docs/validation/PQ.md` | Template for customer-specific validation in the production environment |
| **Compliance Statement** | `docs/validation/Compliance-Statement.md` | Maps QAtrial features to regulatory requirements |
| **Traceability Matrix** | `docs/validation/Traceability-Matrix.md` | Maps regulatory requirements to QAtrial features and test IDs |

### Installation Qualification (IQ) -- 9 Test Steps

The IQ protocol verifies:
1. Server starts successfully on the configured port
2. PostgreSQL database is accessible and schema is applied
3. Frontend application loads in a browser
4. User registration creates an account, organization, and workspace
5. User login returns valid JWT tokens
6. File storage directory is writable
7. Theme toggle works (light/dark)
8. Language switching works
9. Static assets are served correctly in production mode

### Operational Qualification (OQ) -- 18 Test Steps

The OQ protocol verifies:
1. Project setup wizard completes all 7 steps
2. Requirement CRUD (create, read, update, delete) with auto seqId
3. Test CRUD with requirement linking
4. Traceability matrix shows correct links
5. AI test generation produces valid results
6. Electronic signature with re-authentication
7. Evidence attachment and completeness tracking
8. CSV export produces valid files
9. CSV import with column mapping
10. Design control (change control for strict verticals)
11. ISO 13485 template loading
12. CAPA lifecycle enforcement
13. Audit mode (read-only link generation and access)
14. RBAC (permission enforcement across 5 roles)
15. Audit trail completeness and export
16. Dashboard readiness score calculation
17. Risk matrix display and classification
18. Gap analysis execution

### Performance Qualification (PQ) -- Template

The PQ document is a template with blanks for:
- Customer environment details
- Customer-specific test scenarios
- Performance criteria (response times, concurrent users)
- Data migration validation
- Integration verification (Jira, GitHub, SSO)

### Compliance Statement

The Compliance Statement maps QAtrial features to three regulatory frameworks:

**21 CFR Part 11 -- Electronic Records and Electronic Signatures (15 sections):**
- 11.10(a) through 11.10(k) -- System validation, record protection, audit trail, access control, etc.
- 11.50 -- Signature manifestations
- 11.70 -- Signature/record linking
- 11.100 -- General requirements for electronic signatures
- 11.200 -- Electronic signature components and controls

**EU Annex 11 -- Computerised Systems (17 sections):**
- Sections 1-17 covering risk management, personnel, suppliers, data, accuracy checks, storage, printouts, audit trails, change management, incident management, electronic signatures, batch release, archiving, and business continuity

**GAMP 5 -- Category 4 (Configured Products):**
- Covers the risk-based approach, specification, configuration management, testing, and release

### Traceability Matrix

The Traceability Matrix maps **75 regulatory requirements** across 6 standards to:
- QAtrial features that implement or support each requirement
- IQ/OQ/PQ test step IDs that verify compliance
- Implementation status (Supported / Partial / Customer Responsibility)

Standards covered:
1. 21 CFR Part 11
2. EU Annex 11
3. GAMP 5
4. ISO 13485
5. ISO 14971
6. ICH Q10

---

## 6. Compliance Improvements

### Real Signature Verification

QAtrial implements proper identity-based electronic signatures:

- **Real user identity:** Signatures pull the authenticated user's name, role, and ID from `useAuthStore`, replacing placeholder values
- **Password re-authentication:** Users must re-enter their password at the point of signing, with a 15-minute validity window per 21 CFR Part 11.200(a)
- **Non-repudiation:** Each signature is bound to a verified user identity, supporting 21 CFR Part 11.70 non-repudiation requirements
- **Warning on unauthenticated signing:** The system warns when no user is logged in, preventing anonymous signatures

These improvements strengthen compliance with:
- 21 CFR Part 11 Subparts B and C (electronic signatures)
- EU Annex 11 Section 14 (electronic signatures)
- PMDA ER/ES Guidance (Japan)

### Audit Auto-Logging

All requirement and test CRUD operations automatically generate audit trail entries with the real user identity:

- **No manual logging required:** Create, update, delete, status change, link, and unlink operations are automatically captured
- **Real user attribution:** Every audit entry includes the authenticated user's name, role, and ID
- **New audit actions:** `ai_generate`, `ai_accept`, `ai_reject`, `login`, `logout`, and `import` are now tracked
- **AI provenance:** AI-generated artifacts are logged with the model, provider, and acceptance/rejection status

This addresses:
- 21 CFR Part 11.10(e) -- Audit trail requirement for electronic records
- EU Annex 11 Section 9 -- Audit trail for GMP-critical data changes
- FDA Data Integrity Guidance -- Attributable (who) requirement
- MHRA Data Integrity Guidance -- Data lifecycle management

### CAPA Lifecycle

The CAPA system implements a full lifecycle with formal status tracking:

```
open --> investigation --> in_progress --> verification --> resolved --> closed
```

Each status transition is logged in the audit trail. This structured lifecycle supports:
- 21 CFR 820.90 -- Medical device CAPA requirements (formal investigation and effectiveness verification)
- ISO 13485 Section 8.5.2/8.5.3 -- Corrective and preventive action with documented effectiveness
- ICH Q10 Section 3.2 -- CAPA as part of the pharmaceutical quality system
- EU GMP Chapter 1.4 -- Quality risk management and CAPA

### Advanced RBAC (5 Roles)

The 5-role RBAC model with granular permissions supports:

| Permission | Regulatory Basis |
|------------|-----------------|
| Segregation of duties (author vs. approver) | 21 CFR 11.10(d), EU Annex 11 Section 12 |
| Read-only auditor access | Audit and inspection access requirements |
| Reviewer role (approve without edit) | Approval workflow requirements per GxP |
| Admin-only configuration | System administration controls per 21 CFR 11.10(d) |

### Audit Mode (Read-Only Links)

The audit mode feature supports regulatory inspections by providing:
- Time-limited access (24h/72h/7d) aligned with typical audit durations
- No login required, reducing barriers for external auditors
- Complete read-only view of all compliance-relevant data
- Non-modifiable access that maintains data integrity during review

### Webhook Notifications

Webhook event dispatch supports quality system integration by:
- Providing real-time notifications of quality events (test failures, CAPA status changes, approvals)
- Supporting integration with external quality management systems
- HMAC signing ensures payload integrity and authenticity

### Aerospace Vertical References

The Aerospace vertical (`aerospace`) includes templates aligned with:
- **AS9100D** -- QMS requirements for aviation, space, and defense organizations
- **DO-178C** -- Software considerations in airborne systems and equipment certification
- **DO-254** -- Design assurance for airborne electronic hardware
- **EASA Part 21** -- European Aviation Safety Agency certification
- **FAR Part 21** -- FAA type and production certification
- **NADCAP** -- National Aerospace and Defense Contractors Accreditation

Risk taxonomy: FMEA with Design Assurance Level (DAL A-E) safety classification per DO-178C.

### Chemical / Environmental Vertical References

The Chemical / Environmental vertical (`chemical_env`) includes templates aligned with:
- **REACH (EC 1907/2006)** -- Registration, Evaluation, Authorisation and Restriction of Chemicals
- **CLP Regulation (EC 1272/2008)** -- Classification, Labelling and Packaging of substances and mixtures
- **TSCA** -- US Toxic Substances Control Act
- **ISO 14001** -- Environmental Management Systems
- **ISO 45001** -- Occupational Health and Safety Management Systems
- **GHS** -- Globally Harmonized System of Classification and Labelling of Chemicals

Risk taxonomy: FMEA for process and environmental risk assessment.
