/**
 * Switzerland — Country-Specific Base Regulatory Template
 *
 * Switzerland-specific requirements covering Swissmedic (Swiss Agency for
 * Therapeutic Products) medical device and pharmaceutical regulations,
 * nDSG/FADP (new Federal Act on Data Protection), and NCSC (National Cyber
 * Security Centre) guidance.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // Swissmedic — Swiss Agency for Therapeutic Products
  // -----------------------------------------------------------------------
  {
    title: 'Swissmedic — Medical Device Market Authorization (MedDO)',
    description:
      'Medical devices placed on the Swiss market shall comply with the Medical Devices Ordinance (MedDO, SR 812.213), which is aligned with the EU MDR 2017/745 through the Mutual Recognition Agreement (MRA). Devices require conformity assessment by a Swissmedic-designated conformity assessment body. Since 2021 MRA updates, EU CE marking alone may not suffice; a Swiss Authorized Representative (CH-REP) is required for foreign manufacturers. Class I devices require self-declaration; higher classes need Notified Body involvement.',
    category: 'Medical Device Registration',
    tags: ['swissmedic', 'meddo', 'device-registration', 'ch-rep', 'switzerland'],
    riskLevel: 'critical',
    regulatoryRef: 'MedDO (SR 812.213); Swiss Federal Act on Medicinal Products and Medical Devices (TPA, SR 812.21)',
  },
  {
    title: 'Swissmedic — Pharmaceutical GMP and Market Authorization',
    description:
      'Pharmaceutical products marketed in Switzerland shall hold a Swissmedic marketing authorization per the Therapeutic Products Act (TPA). Manufacturing facilities shall comply with GMP requirements (PIC/S-harmonized). Swissmedic is a PIC/S member and conducts regular GMP inspections. Requirements cover quality system, documentation, production, quality control, outsourced activities, self-inspection, complaints, and recalls. Active substance manufacturers must also hold GMP certificates.',
    category: 'Manufacturing',
    tags: ['swissmedic', 'gmp', 'tpa', 'pharmaceutical', 'switzerland'],
    riskLevel: 'critical',
    regulatoryRef: 'TPA (SR 812.21); Medicinal Products Licensing Ordinance (MPLO, SR 812.212.1)',
  },
  {
    title: 'Swissmedic — Vigilance and Post-Market Surveillance',
    description:
      'Marketing authorization holders and manufacturers shall report adverse events to Swissmedic. For medical devices: serious incidents shall be reported within 2-15 days depending on severity per MedDO Article 66. For medicinal products: serious ADRs within 15 calendar days, with 7-day expedited reporting for fatal/life-threatening events. Periodic safety update reports (PSURs) and field safety corrective actions (FSCA) shall be managed per Swissmedic requirements.',
    category: 'Post-Market',
    tags: ['swissmedic', 'vigilance', 'post-market', 'fsca', 'switzerland'],
    riskLevel: 'high',
    regulatoryRef: 'MedDO Article 66; TPA Articles 59-59d; Swissmedic Vigilance Guidelines',
  },
  // -----------------------------------------------------------------------
  // nDSG/FADP — Federal Act on Data Protection (revDSG)
  // -----------------------------------------------------------------------
  {
    title: 'nDSG — Data Processing Principles and Legal Basis',
    description:
      'Personal data processing shall comply with the revised Federal Act on Data Protection (nDSG/revDSG, effective September 1, 2023). Unlike GDPR, Swiss law permits processing based on good faith principles without requiring an explicit legal basis, unless involving sensitive data (health, genetic, biometric, racial/ethnic, political, religious, social assistance, criminal data), profiling with high risk, or data processing by federal bodies. Processing must be proportionate, purpose-limited, and transparent.',
    category: 'Privacy',
    tags: ['ndsg', 'fadp', 'data-protection', 'principles', 'switzerland'],
    riskLevel: 'critical',
    regulatoryRef: 'nDSG Articles 6, 30-31 (SR 235.1)',
  },
  {
    title: 'nDSG — Information Duty and Data Subject Rights',
    description:
      'Data controllers shall proactively inform data subjects when collecting personal data (nDSG Article 19). Required information includes: controller identity, processing purpose, recipients/categories of recipients, and if data is transferred abroad. Data subjects have the right to access (Article 25), request correction, object to processing, and request data portability. Controllers shall respond within 30 days.',
    category: 'Privacy',
    tags: ['ndsg', 'fadp', 'data-subject-rights', 'information-duty', 'switzerland'],
    riskLevel: 'high',
    regulatoryRef: 'nDSG Articles 19-29 (SR 235.1)',
  },
  {
    title: 'nDSG — Data Protection Impact Assessment (DSFA)',
    description:
      'A Data Protection Impact Assessment (Datenschutz-Folgenabschatzung, DSFA) shall be conducted when processing is likely to result in a high risk to the personality or fundamental rights of data subjects (nDSG Article 22). High-risk scenarios include: large-scale processing of sensitive data, systematic monitoring of public areas, and profiling with high risk. The DSFA shall describe the planned processing, risk assessment, and measures to mitigate identified risks.',
    category: 'Privacy',
    tags: ['ndsg', 'fadp', 'dsfa', 'impact-assessment', 'switzerland'],
    riskLevel: 'medium',
    regulatoryRef: 'nDSG Article 22 (SR 235.1)',
  },
  // -----------------------------------------------------------------------
  // NCSC — National Cyber Security Centre
  // -----------------------------------------------------------------------
  {
    title: 'NCSC — ICT Security Standards and Incident Reporting',
    description:
      'Organizations shall follow NCSC Switzerland (formerly MELANI) cybersecurity guidance. Critical infrastructure operators are subject to mandatory cyber incident reporting per the Information Security Act (ISG). Organizations should implement: security baseline controls, vulnerability management, incident response procedures, supply chain security assessment, and security awareness training. The NCSC provides sector-specific guidance for healthcare and life sciences.',
    category: 'Cybersecurity',
    tags: ['ncsc', 'cybersecurity', 'incident-reporting', 'isg', 'switzerland'],
    riskLevel: 'high',
    regulatoryRef: 'Information Security Act (ISG, SR 128.1); NCSC Guidelines',
  },
  {
    title: 'nDSG — Cross-Border Data Transfers',
    description:
      'Personal data transfers abroad are permitted when the Federal Council has determined the receiving country provides adequate protection (nDSG Article 16). Where adequacy is not established, transfers require: standard contractual clauses, binding corporate rules, specific consent of the data subject, or other safeguards per nDSG Article 17. The FDPIC (Federal Data Protection and Information Commissioner) maintains the list of adequate countries.',
    category: 'Privacy',
    tags: ['ndsg', 'fadp', 'cross-border', 'data-transfer', 'fdpic', 'switzerland'],
    riskLevel: 'high',
    regulatoryRef: 'nDSG Articles 16-17 (SR 235.1); DSV Article 8-13',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify Swissmedic Device Registration and CH-REP',
    description:
      'Confirm device registration under MedDO with appropriate classification. Verify conformity assessment from Swissmedic-designated body. For foreign manufacturers, confirm Swiss Authorized Representative (CH-REP) is designated and registered. Verify labeling compliance with Swiss requirements.',
    category: 'Regulatory',
    tags: ['swissmedic', 'registration', 'ch-rep-test'],
    linkedReqTags: ['swissmedic', 'meddo', 'device-registration', 'ch-rep'],
  },
  {
    title: 'Verify nDSG Data Protection Compliance',
    description:
      'Audit data processing activities against nDSG principles. Verify information duty implementation (Article 19): privacy notices include all required elements. Test data subject rights: access (30-day response), correction, portability. Verify sensitive data processing has appropriate safeguards. Confirm data processing register is maintained.',
    category: 'Privacy',
    tags: ['ndsg', 'fadp', 'compliance-test'],
    linkedReqTags: ['ndsg', 'fadp', 'data-protection', 'data-subject-rights'],
  },
  {
    title: 'Verify nDSG Cross-Border Transfer Controls',
    description:
      'Review all cross-border data transfers. Verify receiving countries are on FDPIC adequacy list. For non-adequate countries, confirm standard contractual clauses or other safeguards are in place per nDSG Article 17. Test transfer impact assessments for sensitive data flows.',
    category: 'Privacy',
    tags: ['ndsg', 'cross-border', 'transfer-test'],
    linkedReqTags: ['ndsg', 'fadp', 'cross-border', 'data-transfer', 'fdpic'],
  },
  {
    title: 'Verify NCSC Cybersecurity Controls',
    description:
      'Assess cybersecurity posture against NCSC guidelines. Verify incident response procedures including mandatory reporting for critical infrastructure operators. Test vulnerability management processes, patch cadence, and security monitoring capabilities. Confirm supply chain security assessments are conducted.',
    category: 'Cybersecurity',
    tags: ['ncsc', 'cybersecurity', 'controls-test'],
    linkedReqTags: ['ncsc', 'cybersecurity', 'incident-reporting', 'isg'],
  },
  {
    title: 'Verify Swissmedic Vigilance Reporting',
    description:
      'Test adverse event reporting workflows. Verify medical device serious incident reporting within 2-15 day timeframes per MedDO Article 66. For medicinal products, verify 7/15-day ADR reporting to Swissmedic. Confirm FSCA procedures and PSUR generation capability.',
    category: 'Post-Market',
    tags: ['swissmedic', 'vigilance', 'reporting-test'],
    linkedReqTags: ['swissmedic', 'vigilance', 'post-market', 'fsca'],
  },
];
