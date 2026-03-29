# QAtrial Regulatory Reference

Reference guide for the regulatory standards and frameworks used in QAtrial's templates.

---

## Table of Contents

1. [By Country](#1-by-country)
2. [By Vertical](#2-by-vertical)
3. [Module Standards](#3-module-standards)

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

**Key GxP Standards:**
- GCP (Good Clinical Practice)
- GLP (Good Laboratory Practice)
- GDocP (Good Documentation Practice)

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

**Key GxP Standards:**
- GLP (Good Laboratory Practice)
- GDocP (Good Documentation Practice)
- ISO 15189 (Medical Laboratories)

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

**Key GxP Standards:**
- GDP (Good Distribution Practice)
- GSP (Good Storage Practice)

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

**Key GxP Standards:**
- GAMP 5 (2nd Edition)
- CSV (Computer System Validation)
- 21 CFR Part 11

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

**Key GxP Standards:**
- GMP for Cosmetics
- GLP
- REACH

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

**Key GxP Standards:**
- AS9100D
- DO-178C (Software)
- DO-254 (Hardware)

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

**Key GxP Standards:**
- GLP
- REACH
- CLP

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
