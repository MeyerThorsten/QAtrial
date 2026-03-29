# From Pharma to Medical Devices: How QAtrial Adapts to Your Regulatory Reality

*One platform, four dimensions, infinite combinations -- a deep dive into QAtrial's template composition system and what it means for regulatory affairs professionals.*

---

Here is a truth that every regulatory affairs professional knows but that generic quality tools stubbornly ignore: a quality management system for a US pharmaceutical company and a quality management system for a German medical device startup are fundamentally different things. They share high-level principles -- document what you do, do what you document, prove it with evidence -- but the specific requirements, the applicable standards, the regulatory authority expectations, and the risk management approaches diverge dramatically at the operational level.

The FDA expects compliance with 21 CFR Part 11 for electronic records. The PMDA has its own ER/ES guidance. The EU requires conformity with Annex 11. The NMPA has Chinese national equivalents of ISO standards that are not identical to their international counterparts. A medical device company needs ISO 14971 risk management. A pharmaceutical company needs ICH Q9. A clinical laboratory needs CLIA compliance. An aerospace supplier needs AS9100D.

Generic quality tools handle this by offering blank templates and expecting you to fill in the regulatory context yourself. QAtrial takes the opposite approach: it builds the regulatory context in from the start, through a four-dimensional template composition engine.

## The Four-Dimensional Template Model

Every QAtrial project is defined by four independent dimensions:

```
Country (jurisdiction) x Vertical (domain) x Project Type (execution) x Modules (quality controls)
```

These dimensions compose -- they layer on top of each other to produce a project-specific set of requirements and test cases that reflect the actual regulatory environment the project operates in.

### Dimension 1: Country (37 Jurisdictions)

The country determines which regulatory authority's expectations apply. QAtrial ships with base templates for 14 countries (US, EU, DE, GB, FR, JP, CN, KR, IN, CA, MX, IT, ES, NL) and supports 37 total jurisdictions through a combination of direct templates and regional base templates.

For EU member states, the system loads the EU base template first (covering EU GMP, MDR 2017/745, IVDR, Annex 11, and REACH), then applies country-specific overlays. Germany gets BfArM-specific CSV expectations and AMWHV requirements. France gets ANSM guidelines and CNIL data protection requirements. Italy gets AIFA enforcement specifics.

### Dimension 2: Vertical (10 Industry Domains)

The vertical determines the GxP domain and risk taxonomy:

| Vertical | Risk Taxonomy | Key Standards |
|----------|--------------|---------------|
| Pharmaceuticals | ICH Q9 | 21 CFR 210/211, ICH Q7/Q10, EU GMP |
| Biotechnology | ICH Q9 | ICH Q5A-E, 21 CFR 600-680 |
| Medical Devices | ISO 14971 | ISO 13485, IEC 62304, EU MDR 2017/745 |
| Clinical Research (CRO) | ICH Q9 | ICH E6(R3), 21 CFR Part 58 |
| Clinical Laboratories | FMEA | CLIA, CAP, ISO 15189 |
| Logistics / GDP | FMEA | WHO GDP, EU GDP, FDA DSCSA |
| Software and IT (GAMP/CSV) | GAMP 5 | 21 CFR Part 11, EU Annex 11, GAMP 5 2nd Ed |
| Cosmetics / Chemical | Generic | ISO 22716, REACH, EU 1223/2009 |
| Aerospace | FMEA | AS9100D, DO-178C, DO-254 |
| Chemical / Environmental | FMEA | REACH, CLP, TSCA, ISO 14001 |

The vertical is optional. Skipping it uses only country-level templates without industry-specific requirements.

### Dimension 3: Project Type (8 Execution Modes)

The project type determines what kind of work is being done within the vertical:

- **Software / Web App**: Software development and validation projects
- **Embedded / IoT**: Hardware, firmware, IoT device projects requiring IEC 62304 or similar
- **Quality System (QMS)**: Setting up or improving a Quality Management System
- **Validation**: IQ/OQ/PQ protocols, Computer System Validation, method validation
- **Clinical**: Clinical studies, trials, and investigations
- **Compliance / Audit**: Regulatory compliance assessment and audit preparation
- **Supplier Quality**: Supplier qualification and ongoing oversight
- **Empty**: Blank project with no templates

### Dimension 4: Quality Modules (15 Composable Controls)

Modules add focused requirements and test cases for specific quality control domains. Each module contributes approximately 5 requirements and 3 tests. They compose on top of the country and vertical templates, with deduplication by title ensuring no redundancy.

The 15 modules are: Audit Trail, Electronic Signatures, Data Integrity (ALCOA+), Change Control, CAPA, Deviation Management, Training Management, Supplier Qualification, Complaint Handling, Risk Management, Document Control, Backup and Disaster Recovery, Access Control / Segregation of Duties, Validation / CSV, and Traceability Matrix.

## Three Real-World Scenarios

### Scenario 1: US Pharmaceutical Company -- Computer System Validation

**Configuration**: USA + Pharmaceuticals + Validation + [Audit Trail, Electronic Signatures, Data Integrity, CAPA, Validation/CSV]

**What the template engine produces:**

Step 1: Load US base template. This brings in FDA-specific requirements referencing 21 CFR Part 11 for electronic records, 21 CFR 211 for cGMP, and ALCOA+ data integrity principles per FDA guidance. Requirements include electronic record retention, audit trail for all GxP-critical data, and system access controls per 11.10(d).

Step 2: Load Pharmaceuticals common template. This adds ICH Q10 pharmaceutical quality system requirements, ICH Q9 quality risk management, GMP documentation practices (GDocP), and pharmacovigilance (GVP) requirements. The risk taxonomy is set to ICH Q9.

Step 3: Load Pharmaceuticals + Validation project type template. This adds specific IQ/OQ/PQ protocol requirements, User Requirements Specification (URS) documentation, traceability matrix requirements per GAMP 5, and validation summary report expectations.

Step 4: Apply deduplication. If both the US base and the Pharmaceuticals template include a requirement titled "Audit Trail Event Logging," the later (more specific) version wins.

Step 5: Load selected modules. Audit Trail adds requirements for tamper-resistant logging per 21 CFR 11.10(e). Electronic Signatures adds re-authentication requirements per 11.200(a). Data Integrity adds the full ALCOA+ framework. CAPA adds root cause analysis methodology per 21 CFR 820.90. Validation/CSV adds URS, FS, DS, IQ/OQ/PQ protocol requirements per GAMP 5.

Step 6: Final deduplication across all sources.

**The result**: A project with 30-40 requirements and 20-30 test cases, all referencing FDA and ICH standards, with ICH Q9 risk taxonomy, ready for the validation specialist to review and customize in the preview step before project creation.

**Change control behavior**: Because Pharmaceuticals is a "strict" vertical, the system automatically configures change control to require 2 approvers, mandatory reasons for all changes, electronic signatures, and automatic approval reversion when approved records are modified.

### Scenario 2: German Medical Device Startup -- EU MDR Preparation

**Configuration**: Germany + Medical Devices + QMS + [Risk Management, Supplier Qualification, Document Control, Complaint Handling, Training]

**What the template engine produces:**

Step 1: Load EU base template. This brings in EU GMP (EudraLex Volume 4), EU MDR 2017/745, EU Annex 11, and REACH requirements. Requirements cover CE marking obligations, post-market surveillance per MDR Article 83-86, clinical evaluation per MDR Annex XIV, and EU-wide data protection under GDPR.

Step 2: Load Germany overlay on EU base. This adds BfArM-specific requirements, German GMP (AMWHV) provisions, MPG/MDR implementation specifics, and emphasis on qualification documentation (DQ/IQ/OQ/PQ). Any EU base requirements that the German overlay needs to refine are replaced via title-based deduplication.

Step 3: Load Medical Devices common template. This adds ISO 13485 QMS requirements (design controls, purchasing controls, production controls), ISO 14971 risk management process requirements, IEC 62304 software lifecycle requirements, and IEC 62366 usability engineering requirements. The risk taxonomy is set to ISO 14971.

Step 4: Load Medical Devices + QMS project type template. This adds quality manual requirements, management review procedures, internal audit processes, and quality policy documentation requirements specific to establishing a QMS rather than validating a specific product.

Step 5: Load Germany + Medical Devices overlay. This provides the most specific regulatory customization -- BfArM inspection focus areas for medical device QMS, German-language documentation requirements for domestic regulatory submissions, and German implementation specifics for EU MDR.

Step 6: Load selected modules. Risk Management adds hazard identification, risk estimation, and residual risk assessment requirements per ISO 14971. Supplier Qualification adds approved supplier list management and quality agreement requirements per ISO 13485 Section 7.4. Document Control adds version control and controlled distribution requirements per ISO 13485 Section 4.2. Complaint Handling adds vigilance reporting requirements per EU MDR Article 87-92. Training adds competency assessment requirements per ISO 13485 Section 6.2.

Step 7: Final deduplication.

**The result**: A comprehensive QMS foundation with 40-50 requirements covering EU MDR, ISO 13485, ISO 14971, and BfArM-specific expectations. Test cases reference the specific ISO clauses they verify. Risk assessments use the ISO 14971 severity/probability framework.

### Scenario 3: Japanese CRO -- Clinical Trial Management

**Configuration**: Japan + Clinical Research (CRO) + Clinical + [Training, Deviation Management, Change Control, Audit Trail, Data Integrity]

**What the template engine produces:**

Step 1: Load Japan base template. This brings in PMDA ER/ES guidance (Japan's equivalent of 21 CFR Part 11), PIC/S GMP guidelines (Japan is a PIC/S member), PMDA CSV guidelines, and J-GCP (Japanese Good Clinical Practice) requirements. Requirements reference STED format for documentation and emphasize data reliability and traceability as PMDA inspection focus areas.

Step 2: No regional base needed (Japan is not an EU member state, so no EU base layer).

Step 3: Load CRO common template. This adds ICH E6(R2) GCP requirements, 21 CFR Part 58 GLP requirements, informed consent documentation requirements per 21 CFR Parts 50/56, and clinical data management standards. The risk taxonomy is set to ICH Q9.

Step 4: Load CRO + Clinical project type template. This adds clinical trial protocol requirements, investigator qualification documentation, adverse event reporting procedures, and clinical study report requirements.

Step 5: Load selected modules. Training adds J-GCP-specific training requirements for clinical research staff. Deviation Management adds protocol deviation classification and reporting requirements. Change Control adds protocol amendment procedures with investigator notification. Audit Trail adds clinical data audit trail requirements per PMDA ER/ES guidance. Data Integrity adds ALCOA+ requirements specific to clinical data.

Step 6: Final deduplication.

**The result**: A clinical trial quality framework grounded in both Japanese and international (ICH) standards, with PMDA-specific documentation expectations baked in from the start.

## How Template Composition Works Under the Hood

The composition algorithm in `composeTemplate()` follows a strict loading order:

1. Regional base (EU for European countries)
2. Country-specific base
3. Vertical common templates
4. Vertical + project type templates
5. Country + vertical overlays
6. Selected module templates
7. Deduplication by title (last entry wins)

Templates are TypeScript files loaded via dynamic `import()`. This keeps the initial bundle small -- only the templates needed for the selected configuration are loaded. A project using Japan + CRO never loads the EU base or the Medical Devices vertical.

Deduplication uses exact title matching. When a German overlay needs to replace an EU base requirement about data protection, it uses the same title with updated content. Because the overlay loads after the base, its version survives deduplication. This is a deliberate design choice: it allows specific templates to refine generic ones without requiring an inheritance hierarchy.

Test-to-requirement linking uses tags, not indices. Each template test has a `linkedReqTags` array (for example, `["audit-trail", "event-logging"]`), and each template requirement has a `tags` array (for example, `["audit-trail", "event-logging", "data-integrity"]`). During project creation, the system matches tags and converts them to direct ID links. This produces many-to-many relationships that survive template recomposition -- if a module adds a new requirement with existing tags, tests from other sources automatically link to it.

## Current Regulatory References

QAtrial's templates reference current regulatory standards, including recent updates:

- **QMSR**: The FDA's Quality Management System Regulation, which is replacing the older 21 CFR 820 QSR for medical devices, aligning US requirements more closely with ISO 13485
- **ICH E6(R3)**: The upcoming revision to Good Clinical Practice, which modernizes GCP for decentralized and technology-enabled clinical trials
- **GAMP 5 Second Edition**: The updated ISPE guidance on computerized system validation, which introduces a more risk-based approach and acknowledges modern software development practices including agile and DevOps
- **EU MDR 2017/745**: The European Medical Device Regulation that replaced the MDD, with significantly expanded requirements for clinical evaluation, post-market surveillance, and technical documentation

## Contributing Country and Vertical Templates

The template system is designed for community contribution. Adding a new country requires:

1. Creating a base template file at `src/templates/regions/{code}/base.ts`
2. Defining jurisdiction-specific requirements and tests with regulatory references
3. Optionally creating vertical overlay files at `src/templates/regions/{code}/overlays/{vertical}.ts`

Adding a new vertical follows a similar pattern under `src/templates/verticals/`. Each template is a standalone TypeScript file exporting requirements and tests in a standard format.

For regulatory affairs consultants who specialize in specific jurisdictions or industries, contributing templates is a way to codify their expertise in a form that benefits the entire community. The AGPL-3.0 license ensures that improvements flow back to the project.

The template composition engine is the core of QAtrial's value proposition. Generic quality tools ask you to build your regulatory framework from scratch. QAtrial asks you to select your reality and gives you a head start.

QAtrial is available at [github.com/MeyerThorsten/QAtrial](https://github.com/MeyerThorsten/QAtrial).
