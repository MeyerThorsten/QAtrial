/**
 * China — Country-Specific Base Regulatory Template
 *
 * China-specific requirements covering PIPL, CSL, DSL, GB standards,
 * CCC certification, MLPS 2.0, and CNCERT reporting obligations.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // PIPL — Personal Information Protection Law
  // -----------------------------------------------------------------------
  {
    title: 'PIPL Compliance — Lawful Basis for Processing',
    description:
      'Personal information processing shall have a lawful basis as defined by Articles 13-14 of the Personal Information Protection Law (PIPL). Valid bases include: individual consent, necessity for contract performance, statutory duties, public health emergencies, news reporting in the public interest, and other circumstances prescribed by law. Consent must be informed, voluntary, and explicit for sensitive personal information.',
    category: 'Privacy',
    tags: ['pipl', 'privacy', 'consent', 'china', 'personal-information'],
    riskLevel: 'critical',
    regulatoryRef: 'PIPL Articles 13-14 (2021)',
  },
  {
    title: 'PIPL — Cross-Border Data Transfer Restrictions',
    description:
      'Transfer of personal information outside the territory of the People\'s Republic of China shall comply with PIPL Article 38-43. Requirements include: passing a security assessment organized by the Cyberspace Administration of China (CAC) for critical information infrastructure operators (CIIOs) or processors handling data above prescribed thresholds; obtaining personal information protection certification from a recognized institution; or entering into a standard contract formulated by the CAC with the overseas recipient.',
    category: 'Privacy',
    tags: ['pipl', 'cross-border', 'data-transfer', 'cac', 'china'],
    riskLevel: 'critical',
    regulatoryRef: 'PIPL Articles 38-43; CAC Standard Contract Measures (2023)',
  },
  // -----------------------------------------------------------------------
  // CSL — Cybersecurity Law
  // -----------------------------------------------------------------------
  {
    title: 'Cybersecurity Law (CSL) — Network Security Protection',
    description:
      'Network operators shall comply with the Cybersecurity Law of the People\'s Republic of China by implementing a cybersecurity multi-level protection scheme, formulating internal security management systems, appointing dedicated cybersecurity personnel, taking technical measures to prevent computer viruses, network attacks, and network intrusions, monitoring and recording network operation status and cybersecurity events with logs retained for at least six months, and implementing data classification and backup measures.',
    category: 'Cybersecurity',
    tags: ['csl', 'cybersecurity', 'network-security', 'china'],
    riskLevel: 'critical',
    regulatoryRef: 'CSL Articles 21-25 (2017)',
  },
  // -----------------------------------------------------------------------
  // DSL — Data Security Law
  // -----------------------------------------------------------------------
  {
    title: 'Data Security Law (DSL) — Data Classification and Protection',
    description:
      'Data shall be classified according to the Data Security Law (DSL) hierarchical classification system: general data, important data, and core data. A data classification catalog shall be established. Important data processors shall appoint a data security officer, establish a data security management body, conduct regular risk assessments, and submit assessment reports to the competent authority. Core data processing shall be subject to stricter management per State Council regulations.',
    category: 'Data Security',
    tags: ['dsl', 'data-classification', 'data-security', 'china'],
    riskLevel: 'high',
    regulatoryRef: 'DSL Articles 21-27 (2021)',
  },
  // -----------------------------------------------------------------------
  // GB Standards
  // -----------------------------------------------------------------------
  {
    title: 'GB/T 22080 — Information Security Management System',
    description:
      'The information security management system shall comply with GB/T 22080 (identical adoption of ISO/IEC 27001). Requirements include: establishing the ISMS scope, conducting information security risk assessment per GB/T 22080 Clause 6, implementing Annex A controls, conducting internal audits, and maintaining documented information as specified. For regulated industries, certification by a CNCA-accredited certification body may be required.',
    category: 'Information Security',
    tags: ['gb-22080', 'iso-27001', 'isms', 'china'],
    riskLevel: 'high',
    regulatoryRef: 'GB/T 22080-2016 (ISO/IEC 27001:2013 IDT)',
  },
  // -----------------------------------------------------------------------
  // CCC Certification
  // -----------------------------------------------------------------------
  {
    title: 'CCC Certification — China Compulsory Certification',
    description:
      'Products listed in the CCC catalog (including IT equipment, electrical apparatus, and certain medical devices) shall obtain China Compulsory Certification (CCC) before import, sale, or use within China. Certification involves type testing at CNCA-designated laboratories, factory audit by a designated certification body, and ongoing surveillance. Products shall bear the CCC mark as prescribed by CNCA Implementation Rules.',
    category: 'Product Certification',
    tags: ['ccc', 'certification', 'cnca', 'product-safety', 'china'],
    riskLevel: 'high',
    regulatoryRef: 'CNCA CCC Implementation Rules; Regulations for Compulsory Product Certification (State Council Order No. 645)',
  },
  // -----------------------------------------------------------------------
  // MLPS 2.0 — Multi-Level Protection Scheme
  // -----------------------------------------------------------------------
  {
    title: 'MLPS 2.0 — Multi-Level Protection Scheme Compliance',
    description:
      'Information systems shall be graded and protected under the Multi-Level Protection Scheme (MLPS 2.0) as required by GB/T 22239-2019. Systems shall be classified into five protection levels based on potential harm. For Level 2 and above: system grading shall be filed with the local public security bureau, security construction and rectification shall be performed per the grading requirements, and a grading assessment by a qualified testing institution shall be completed. Level 3 and above systems require annual assessment.',
    category: 'Cybersecurity',
    tags: ['mlps', 'graded-protection', 'gb-22239', 'china'],
    riskLevel: 'critical',
    regulatoryRef: 'GB/T 22239-2019 (MLPS 2.0); CSL Article 21',
  },
  // -----------------------------------------------------------------------
  // CNCERT Incident Reporting
  // -----------------------------------------------------------------------
  {
    title: 'CNCERT/CC — Cybersecurity Incident Reporting',
    description:
      'Cybersecurity incidents involving network intrusions, data breaches, or system compromises shall be reported to CNCERT/CC (National Computer Network Emergency Response Technical Team / Coordination Center) and the relevant sector authority in accordance with the National Cybersecurity Incident Emergency Plan. Significant incidents shall be reported within one hour of discovery. Reports shall include incident scope, affected data types, preliminary impact assessment, and remedial measures taken.',
    category: 'Incident Management',
    tags: ['cncert', 'incident-reporting', 'cybersecurity', 'china'],
    riskLevel: 'high',
    regulatoryRef: 'National Cybersecurity Incident Emergency Plan (2017); CSL Article 25',
  },
  {
    title: 'Algorithm Registration and Assessment',
    description:
      'Systems employing recommendation algorithms, deep synthesis, or generative AI shall comply with CAC algorithm governance regulations. Requirements include: filing algorithm details with the CAC Internet Information Service Algorithm Filing System, conducting algorithm security self-assessments, providing algorithm transparency and explainability to users, and implementing mechanisms for users to opt out of algorithmic recommendations.',
    category: 'AI Governance',
    tags: ['algorithm', 'ai-governance', 'cac', 'china'],
    riskLevel: 'medium',
    regulatoryRef: 'Provisions on the Management of Algorithmic Recommendations (2022); Interim Measures for the Management of Generative AI Services (2023)',
  },
  {
    title: 'Data Localization for Critical Information Infrastructure',
    description:
      'Critical information infrastructure operators (CIIOs) shall store personal information and important data collected and generated during operations within the territory of China. Where it is genuinely necessary to provide such data overseas for business purposes, a security assessment organized by the CAC shall be passed. The security assessment evaluates legality, necessity, risks to national security and public interest, data security protection capabilities of the overseas recipient, and contractual obligations.',
    category: 'Data Sovereignty',
    tags: ['data-localization', 'ciio', 'cac', 'china'],
    riskLevel: 'critical',
    regulatoryRef: 'CSL Article 37; PIPL Article 40; Measures for Security Assessment of Outbound Data Transfers (2022)',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify PIPL Consent Management Implementation',
    description:
      'Test that the system collects explicit consent before processing personal information. Verify consent is granular (per purpose), can be withdrawn, and that sensitive PI processing requires separate explicit consent. Confirm consent records are stored immutably with timestamps.',
    category: 'Privacy',
    tags: ['pipl', 'consent', 'privacy-test'],
    linkedReqTags: ['pipl', 'consent', 'personal-information'],
  },
  {
    title: 'Verify Cross-Border Data Transfer Controls',
    description:
      'Attempt to export personal information to an overseas destination. Verify that the system enforces transfer restrictions, checks for valid transfer mechanisms (CAC security assessment, certification, or standard contract), and blocks unauthorized transfers. Confirm that data transfer impact assessments are documented.',
    category: 'Privacy',
    tags: ['pipl', 'cross-border', 'transfer-test'],
    linkedReqTags: ['pipl', 'cross-border', 'data-transfer'],
  },
  {
    title: 'Verify MLPS 2.0 Security Controls',
    description:
      'Validate that system security controls align with the applicable MLPS 2.0 protection level requirements from GB/T 22239-2019. Verify physical security, network security, host security, application security, data security, and security management center controls. Confirm grading documentation is complete and filed.',
    category: 'Security',
    tags: ['mlps', 'graded-protection', 'security-test'],
    linkedReqTags: ['mlps', 'graded-protection', 'gb-22239'],
  },
  {
    title: 'Verify CSL Network Security Log Retention',
    description:
      'Confirm that network operation logs and cybersecurity event logs are retained for a minimum of six months as required by CSL Article 21. Verify logs capture source IP, timestamps, user actions, and security events. Test that logs cannot be tampered with or deleted before the retention period expires.',
    category: 'Security',
    tags: ['csl', 'logging', 'retention-test'],
    linkedReqTags: ['csl', 'cybersecurity', 'network-security'],
  },
  {
    title: 'Verify DSL Data Classification Implementation',
    description:
      'Test that data assets are classified into the DSL hierarchical categories (general, important, core). Verify that access controls and protection measures are applied according to classification level. Confirm that important data risk assessment reports are generated and available for regulatory submission.',
    category: 'Data Security',
    tags: ['dsl', 'classification', 'data-security-test'],
    linkedReqTags: ['dsl', 'data-classification', 'data-security'],
  },
  {
    title: 'Verify CNCERT Incident Reporting Workflow',
    description:
      'Simulate a cybersecurity incident and verify that the incident reporting workflow triggers within the required timeframe. Confirm that the report template includes all mandatory fields (scope, affected data types, impact assessment, remedial measures). Verify escalation to CNCERT/CC within one hour for significant incidents.',
    category: 'Incident Management',
    tags: ['cncert', 'incident', 'reporting-test'],
    linkedReqTags: ['cncert', 'incident-reporting', 'cybersecurity'],
  },
  {
    title: 'Verify Data Localization Enforcement',
    description:
      'For systems operated by CIIOs, verify that personal information and important data storage is confined to servers located within China. Attempt to configure overseas storage and confirm the system prevents or flags such configuration. Validate that any approved cross-border transfer has completed the CAC security assessment process.',
    category: 'Data Sovereignty',
    tags: ['data-localization', 'ciio', 'sovereignty-test'],
    linkedReqTags: ['data-localization', 'ciio', 'cac'],
  },
];
