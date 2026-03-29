/**
 * Clinical Research Organization (CRO) Vertical — Common Templates
 *
 * Comprehensive GCP/GLP requirements and tests applicable to clinical
 * research organizations, covering ICH E6(R3), protocol management,
 * informed consent, SAE reporting, data management, TMF, and monitoring.
 */

import type { VerticalTemplateSet } from '../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'cro',
  requirements: [
    // -----------------------------------------------------------------------
    // GCP Fundamentals
    // -----------------------------------------------------------------------
    {
      title: 'ICH E6(R3) Good Clinical Practice Compliance',
      description:
        'All clinical trials shall be designed, conducted, recorded, and reported in compliance with ICH E6(R3) GCP guidelines. A quality management system proportionate to risk shall be established covering: critical-to-quality factors, risk identification, evaluation, control, communication, review, and reporting. GCP training shall be documented for all trial personnel.',
      category: 'GCP',
      tags: ['gcp', 'ich-e6', 'quality-management', 'training'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH E6(R3); 21 CFR Part 312; EU CTR 536/2014',
    },
    {
      title: 'Clinical Trial Protocol Development and Amendments',
      description:
        'Clinical trial protocols shall be developed per ICH E6(R3) Section 6, including: study objectives, design, methodology, statistical considerations, organization, ethical considerations, and data handling. Protocol amendments shall be documented, justified, submitted to ethics committees and regulatory authorities, and approved before implementation (except for urgent safety measures).',
      category: 'Protocol Management',
      tags: ['protocol', 'amendment', 'study-design', 'methodology'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH E6(R3) Section 6; 21 CFR 312.30',
    },
    {
      title: 'Informed Consent Process and Documentation',
      description:
        'Informed consent shall be obtained from each trial subject (or legally authorized representative) before any trial-related procedures per ICH E6(R3) Section 4.8. The informed consent form (ICF) shall include: purpose, procedures, risks, benefits, alternatives, confidentiality measures, compensation, and contact information. The process shall be documented in source records and allow adequate time for decision-making.',
      category: 'Ethics',
      tags: ['informed-consent', 'icf', 'ethics', 'subject-rights'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH E6(R3) Section 4.8; 21 CFR 50; EU CTR Article 29',
    },
    {
      title: 'Institutional Review Board / Ethics Committee Oversight',
      description:
        'All clinical trials shall be reviewed and approved by an appropriately constituted IRB/IEC before initiation. Ongoing oversight shall include: initial approval, continuing review at least annually, amendment review, deviation and SAE review, and final study reports. IRB/IEC composition, procedures, and records shall comply with applicable regulations.',
      category: 'Ethics',
      tags: ['irb', 'ethics-committee', 'oversight', 'approval'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH E6(R3) Section 3; 21 CFR Part 56; EU CTR Article 4',
    },
    {
      title: 'Serious Adverse Event (SAE) Reporting and Safety Management',
      description:
        'A safety management plan shall define SAE reporting procedures. Investigators shall report SAEs to the sponsor within 24 hours. The sponsor shall report SUSARs (Suspected Unexpected Serious Adverse Reactions) to regulatory authorities within 7 days (fatal/life-threatening) or 15 days (all others). Safety databases shall support MedDRA coding, causality assessment, and CIOMS form generation.',
      category: 'Safety',
      tags: ['sae', 'susar', 'safety-reporting', 'pharmacovigilance'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH E6(R3) Section 4.11; ICH E2A; 21 CFR 312.32',
    },
    {
      title: 'Clinical Data Management System (CDMS)',
      description:
        'Electronic data capture (EDC) systems shall be validated per GAMP 5 / 21 CFR Part 11. Data management procedures shall cover: database design per protocol, edit check programming and validation, data entry and query management, medical coding (MedDRA for AEs, WHO Drug Dictionary for medications), SAE reconciliation, and database lock procedures.',
      category: 'Data Management',
      tags: ['cdms', 'edc', 'data-management', 'database-lock'],
      riskLevel: 'high',
      regulatoryRef: 'ICH E6(R3) Section 5.5; 21 CFR Part 11',
    },
    {
      title: 'Trial Master File (TMF) Management',
      description:
        'A Trial Master File shall be established and maintained per ICH E6(R3) Section 8 and the TMF Reference Model. The TMF shall contain essential documents demonstrating: conduct quality, GCP compliance, and data integrity. Documents shall be filed in a timely manner, be inspection-ready at all times, and support both paper and electronic formats (eTMF). Access controls and audit trails shall be maintained.',
      category: 'Document Management',
      tags: ['tmf', 'etmf', 'essential-documents', 'inspection-ready'],
      riskLevel: 'high',
      regulatoryRef: 'ICH E6(R3) Section 8; DIA TMF Reference Model',
    },
    {
      title: 'Clinical Monitoring Plan and Site Oversight',
      description:
        'A risk-based monitoring plan shall be developed per ICH E6(R3) Section 5.18. Monitoring activities shall include: on-site visits, centralized monitoring (statistical and analytical), and remote monitoring. Source data verification (SDV) extent shall be proportionate to risk. Monitoring reports shall document: date, site personnel contacted, documents reviewed, findings, and actions taken.',
      category: 'Monitoring',
      tags: ['monitoring', 'rbm', 'sdv', 'site-oversight'],
      riskLevel: 'high',
      regulatoryRef: 'ICH E6(R3) Section 5.18; FDA Guidance on Risk-Based Monitoring',
    },
    {
      title: 'Investigational Medicinal Product (IMP) Accountability',
      description:
        'IMP accountability procedures shall track: receipt, storage, dispensing, administration, return, and destruction at each investigational site. Temperature-controlled storage shall be monitored and documented. Drug accountability logs shall reconcile all IMP units. Blinding and unblinding procedures shall be documented for randomized trials.',
      category: 'IMP Management',
      tags: ['imp', 'drug-accountability', 'storage', 'blinding'],
      riskLevel: 'high',
      regulatoryRef: 'ICH E6(R3) Section 5.14; 21 CFR 312.62',
    },
    {
      title: 'Source Data and Source Document Verification',
      description:
        'Source data shall be attributable, legible, contemporaneous, original, accurate, and complete (ALCOA+). Source documents shall include: original medical records, laboratory reports, pharmacy records, subject diaries, imaging data, and electronic health records. Certified copies shall be verifiable against originals. Source data agreements shall define which documents constitute source.',
      category: 'Data Integrity',
      tags: ['source-data', 'source-documents', 'alcoa', 'sdv'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH E6(R3) Section 4.9; FDA Guidance on Electronic Source Data',
    },
    {
      title: 'Medical Coding Standards (MedDRA / WHO Drug)',
      description:
        'Adverse events and medical history shall be coded using the Medical Dictionary for Regulatory Activities (MedDRA) at the Preferred Term (PT) and Lowest Level Term (LLT) levels. Concomitant medications shall be coded using the WHO Drug Dictionary Enhanced. Coding conventions, auto-encoding rules, and manual coding review procedures shall be documented in the data management plan.',
      category: 'Data Management',
      tags: ['medical-coding', 'meddra', 'who-drug', 'coding-conventions'],
      riskLevel: 'medium',
      regulatoryRef: 'ICH E2B(R3); MedDRA MSSO Guidelines',
    },
    {
      title: 'Biostatistics and Statistical Analysis Plan',
      description:
        'A Statistical Analysis Plan (SAP) shall be finalized before database lock. The SAP shall define: analysis populations, primary and secondary endpoints, statistical methods, handling of missing data, multiplicity adjustments, interim analyses, and sensitivity analyses. Biostatistical programming shall use validated software with documented quality control (double programming or independent review).',
      category: 'Biostatistics',
      tags: ['biostatistics', 'sap', 'analysis', 'endpoints'],
      riskLevel: 'high',
      regulatoryRef: 'ICH E9(R1); ICH E6(R3) Section 9',
    },
    {
      title: 'Regulatory Submissions and Clinical Trial Applications',
      description:
        'Clinical trial applications (CTA/IND) shall be prepared and submitted to regulatory authorities before trial initiation. Submissions shall include: protocol, Investigator Brochure, IMP documentation, informed consent forms, and ethics committee opinions. Annual reports, safety updates, amendments, and end-of-trial notifications shall be submitted per applicable timelines.',
      category: 'Regulatory',
      tags: ['cta', 'ind', 'regulatory-submission', 'annual-report'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 312 Subpart B; EU CTR Articles 5-14',
    },
    {
      title: 'Clinical Study Report (CSR) and Disclosure',
      description:
        'Clinical study reports shall be prepared per ICH E3 structure including: synopsis, introduction, study objectives, investigational plan, study patients, efficacy evaluation, safety evaluation, discussion, and conclusions. CSRs shall be completed within regulatory timelines. Trial results shall be posted on public registries (ClinicalTrials.gov, EudraCT) per applicable disclosure requirements.',
      category: 'Reporting',
      tags: ['csr', 'ich-e3', 'disclosure', 'registry'],
      riskLevel: 'high',
      regulatoryRef: 'ICH E3; FDAAA 801; EU CTR Article 37',
    },
    {
      title: 'Laboratory Sample Management and Central Lab Oversight',
      description:
        'Laboratory procedures shall ensure: proper sample collection, processing, labeling, storage, and shipment per protocol specifications. Central laboratory certifications (CAP, CLIA) shall be verified and maintained. Normal ranges shall be established per laboratory. Sample tracking systems shall provide chain of custody from collection through analysis and archival.',
      category: 'Laboratory',
      tags: ['laboratory', 'central-lab', 'sample-management', 'chain-of-custody'],
      riskLevel: 'high',
      regulatoryRef: 'ICH E6(R3) Section 4.9.4; 42 CFR 493 (CLIA)',
    },
  ],

  tests: [
    // -----------------------------------------------------------------------
    // Test Cases
    // -----------------------------------------------------------------------
    {
      title: 'GCP Training Compliance Verification',
      description:
        'Verify GCP training records for all trial personnel. Confirm: initial GCP training is completed before study activities, refresher training is current (within 2-3 years), training records include date, topic, and trainer/provider, and training is commensurate with role responsibilities. Review a sample of CVs and training logs for five team members.',
      category: 'GCP',
      tags: ['gcp', 'training', 'compliance-test'],
      linkedReqTags: ['gcp', 'ich-e6', 'training'],
    },
    {
      title: 'Informed Consent Process Audit',
      description:
        'Audit the informed consent process for a representative study. Review 10 subject ICFs: verify correct version was used, all pages are initialed, signature dates precede first study procedure, legally authorized representative documentation exists where applicable, and re-consent was obtained after relevant amendments. Verify the process is documented in source records.',
      category: 'Ethics',
      tags: ['informed-consent', 'audit', 'verification-test'],
      linkedReqTags: ['informed-consent', 'icf', 'ethics'],
    },
    {
      title: 'SAE Reporting Timeline Compliance',
      description:
        'Review 10 SAE cases from the safety database. For each, verify: investigator notification to sponsor was within 24 hours, SUSAR reporting to authorities was within 7 days (fatal/life-threatening) or 15 days, MedDRA coding is accurate, causality assessment is documented, and CIOMS forms are complete. Verify SAE reconciliation between clinical database and safety database.',
      category: 'Safety',
      tags: ['sae', 'reporting', 'timeline-test'],
      linkedReqTags: ['sae', 'susar', 'safety-reporting'],
    },
    {
      title: 'EDC System Validation and Part 11 Compliance',
      description:
        'Review EDC system validation documentation. Verify: validation plan exists, IQ/OQ/PQ were executed, audit trail captures all changes with date/time/user/reason, electronic signatures meet Part 11 requirements, edit checks function correctly per the data validation plan, and the system is on the validated systems inventory.',
      category: 'Data Management',
      tags: ['edc', 'validation', 'part-11-test'],
      linkedReqTags: ['cdms', 'edc', 'data-management'],
    },
    {
      title: 'TMF Completeness and Inspection Readiness',
      description:
        'Perform a TMF completeness check against the DIA TMF Reference Model. Verify: all applicable essential documents are filed, documents are filed in a timely manner, filing is consistent with the TMF plan, access controls are appropriate, audit trail is maintained for eTMF, and the TMF would pass a mock regulatory inspection.',
      category: 'Document Management',
      tags: ['tmf', 'completeness', 'inspection-readiness-test'],
      linkedReqTags: ['tmf', 'etmf', 'essential-documents'],
    },
    {
      title: 'Risk-Based Monitoring Effectiveness',
      description:
        'Review the risk-based monitoring plan and execution for a representative study. Verify: risk indicators are defined and tracked, centralized monitoring signals are investigated, on-site visit frequency is risk-proportionate, monitoring reports document findings and follow-up, critical data and processes have adequate oversight, and source data verification scope is justified.',
      category: 'Monitoring',
      tags: ['monitoring', 'rbm', 'effectiveness-test'],
      linkedReqTags: ['monitoring', 'rbm', 'sdv'],
    },
    {
      title: 'IMP Accountability and Chain of Custody',
      description:
        'Audit IMP accountability at three investigational sites. Verify: receipt records match shipment documentation, storage temperature logs are continuous and within range, dispensing records match subject visit records, returns are documented and reconciled, and final drug accountability demonstrates full reconciliation of all IMP units.',
      category: 'IMP Management',
      tags: ['imp', 'accountability', 'chain-of-custody-test'],
      linkedReqTags: ['imp', 'drug-accountability', 'storage'],
    },
    {
      title: 'Source Data Verification Sample Check',
      description:
        'Perform source data verification for a sample of subjects across three sites. Compare CRF/EDC data against source documents for: demographics, eligibility criteria, primary endpoint data, AE reporting dates and descriptions, and concomitant medications. Quantify discrepancy rate and classify by severity (critical, major, minor).',
      category: 'Data Integrity',
      tags: ['source-data', 'verification', 'sdv-test'],
      linkedReqTags: ['source-data', 'source-documents', 'alcoa'],
    },
    {
      title: 'Statistical Analysis Plan Review and QC',
      description:
        'Review the SAP for protocol alignment. Verify: analysis populations are clearly defined, primary endpoint analysis matches protocol, multiplicity adjustments are appropriate, missing data handling is prespecified, and sensitivity analyses are planned. Verify biostatistical programs are double-programmed or independently reviewed and results match.',
      category: 'Biostatistics',
      tags: ['sap', 'biostatistics', 'qc-test'],
      linkedReqTags: ['biostatistics', 'sap', 'analysis'],
    },
    {
      title: 'Clinical Study Report Quality Review',
      description:
        'Review a CSR for ICH E3 completeness. Verify: all required sections are present, data tables are consistent with the statistical output, safety narratives are complete for reportable events, the discussion accurately reflects results, and the report has undergone medical and statistical QC review. Verify trial results are posted on public registries per disclosure requirements.',
      category: 'Reporting',
      tags: ['csr', 'quality-review', 'disclosure-test'],
      linkedReqTags: ['csr', 'ich-e3', 'disclosure'],
    },
  ],
};

export default templateSet;
