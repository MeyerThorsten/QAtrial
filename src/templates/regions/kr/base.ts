/**
 * South Korea — Country-Specific Base Regulatory Template
 *
 * South Korea-specific requirements covering PIPA, ISMS-P certification,
 * KCC telecommunications regulations, FSC/FSS financial oversight, and K-IFRS.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // PIPA — Personal Information Protection Act
  // -----------------------------------------------------------------------
  {
    title: 'PIPA Compliance — Personal Information Processing Principles',
    description:
      'Personal information processing shall comply with the Personal Information Protection Act (PIPA, Act No. 16930 as amended 2023). Processors shall: specify and disclose the purpose of processing, collect the minimum personal information necessary, process lawfully and fairly, ensure accuracy and completeness, implement technical/managerial/physical safeguards, maintain a privacy policy, and respect data subjects\' rights including access, correction, deletion, and suspension of processing.',
    category: 'Privacy',
    tags: ['pipa', 'privacy', 'personal-information', 'korea'],
    riskLevel: 'critical',
    regulatoryRef: 'PIPA Articles 3, 15-22 (as amended 2023)',
  },
  {
    title: 'PIPA — Consent and Data Subject Rights',
    description:
      'Prior to collecting personal information, the data subject shall be informed of: the purpose of collection, items to be collected, retention period, and the right to refuse. Consent shall be obtained separately for sensitive information (ideology, beliefs, health, genetics, criminal history, biometrics) and for processing by third parties. Data subjects have the right to access, correct, delete, and suspend processing of their personal information within 10 days of request.',
    category: 'Privacy',
    tags: ['pipa', 'consent', 'data-subject-rights', 'korea'],
    riskLevel: 'critical',
    regulatoryRef: 'PIPA Articles 15-18, 35-38',
  },
  {
    title: 'PIPA — Data Breach Notification',
    description:
      'In the event of a personal information breach, the personal information processor shall notify affected data subjects without delay, including: types of information leaked, timing and circumstances, potential harm, countermeasures taken, and contact information for the processor\'s response department. Breaches affecting 1,000 or more data subjects shall be reported to the Personal Information Protection Commission (PIPC) and the Korea Internet & Security Agency (KISA) within 72 hours.',
    category: 'Incident Management',
    tags: ['pipa', 'breach-notification', 'pipc', 'kisa', 'korea'],
    riskLevel: 'high',
    regulatoryRef: 'PIPA Articles 34, 34-2; PIPA Enforcement Decree Article 39-4',
  },
  // -----------------------------------------------------------------------
  // ISMS-P — Information Security Management System Certification
  // -----------------------------------------------------------------------
  {
    title: 'ISMS-P Certification Compliance',
    description:
      'Information and communication service providers meeting prescribed thresholds (annual revenue exceeding KRW 150 billion, or serving more than 1 million daily average users, or designated as CIIO by MSIT) shall obtain and maintain ISMS-P (Information Security Management System - Privacy) certification issued by KISA. The ISMS-P framework covers 80 controls across management system establishment (16), protection measures implementation (64), and personal information processing stages. Recertification is required every three years with annual surveillance audits.',
    category: 'Information Security',
    tags: ['isms-p', 'kisa', 'certification', 'korea'],
    riskLevel: 'high',
    regulatoryRef: 'Act on Promotion of Information and Communications Network Utilization and Information Protection Article 47; ISMS-P Certification Standards (KISA)',
  },
  // -----------------------------------------------------------------------
  // KCC — Korea Communications Commission
  // -----------------------------------------------------------------------
  {
    title: 'KCC Telecommunications Equipment Type Approval',
    description:
      'Telecommunications equipment and devices connected to public networks shall obtain type approval or conformity assessment from the National Radio Research Agency (RRA) under the Korea Communications Commission (KCC). Requirements include electromagnetic compatibility (EMC) testing per KN standards, safety testing, and SAR testing for radio-frequency devices. Equipment shall bear the KC mark upon approval.',
    category: 'Product Certification',
    tags: ['kcc', 'rra', 'type-approval', 'kc-mark', 'korea'],
    riskLevel: 'medium',
    regulatoryRef: 'Radio Waves Act Articles 58-2; Telecommunications Business Act',
  },
  // -----------------------------------------------------------------------
  // FSC/FSS — Financial Supervisory Regulations
  // -----------------------------------------------------------------------
  {
    title: 'FSC/FSS — Electronic Financial Transaction Security',
    description:
      'Electronic financial transaction systems shall comply with the Electronic Financial Transactions Act and FSS IT security guidelines. Requirements include: multi-factor authentication for financial transactions, end-to-end encryption for data in transit, real-time fraud detection systems, segregation of customer data environments, vulnerability assessments at least annually, and incident reporting to the Financial Supervisory Service (FSS) within 24 hours of detection.',
    category: 'Financial Security',
    tags: ['fsc', 'fss', 'electronic-finance', 'korea'],
    riskLevel: 'critical',
    regulatoryRef: 'Electronic Financial Transactions Act; FSS IT Security Guidelines (2023)',
  },
  // -----------------------------------------------------------------------
  // K-IFRS — Korean International Financial Reporting Standards
  // -----------------------------------------------------------------------
  {
    title: 'K-IFRS Compliance for IT System Financial Reporting',
    description:
      'Systems generating or processing financial data used for external reporting shall support K-IFRS (Korean adoption of IFRS) requirements. This includes: maintaining complete and accurate transaction trails for audit, supporting multi-currency and fair value calculations, implementing internal controls over financial reporting (ICFR) per the Act on External Audit of Stock Companies, and ensuring data integrity controls that satisfy external auditor requirements.',
    category: 'Financial Compliance',
    tags: ['k-ifrs', 'financial-reporting', 'icfr', 'korea'],
    riskLevel: 'high',
    regulatoryRef: 'K-IFRS; Act on External Audit of Stock Companies Article 8',
  },
  {
    title: 'Network Act — Location Information Protection',
    description:
      'Systems processing location information shall comply with the Act on the Protection, Use, etc. of Location Information. Collection and use of personal location information requires prior consent specifying the purpose, scope, and retention period. Location information business operators shall register with the KCC and implement technical measures including access control, encryption, and logging of location data queries.',
    category: 'Privacy',
    tags: ['location-information', 'kcc', 'privacy', 'korea'],
    riskLevel: 'medium',
    regulatoryRef: 'Act on the Protection, Use, etc. of Location Information Articles 15-19',
  },
  {
    title: 'Cloud Security Assurance Program (CSAP)',
    description:
      'Cloud service providers serving public sector clients or handling regulated data shall obtain CSAP certification administered by KISA. CSAP evaluation covers 14 control areas including information security policy, human resource security, asset management, access control, encryption, physical security, operations security, network security, virtualization security, incident management, disaster recovery, compliance, and service level management.',
    category: 'Cloud Security',
    tags: ['csap', 'cloud', 'kisa', 'korea'],
    riskLevel: 'high',
    regulatoryRef: 'Cloud Computing Act; KISA CSAP Standards (2023)',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify PIPA Consent Collection and Management',
    description:
      'Test that the system collects informed consent before processing personal information with all required disclosure elements (purpose, items, retention period, right to refuse). Verify that sensitive information requires separate consent. Confirm consent withdrawal is supported and effective within the system.',
    category: 'Privacy',
    tags: ['pipa', 'consent', 'privacy-test'],
    linkedReqTags: ['pipa', 'consent', 'data-subject-rights'],
  },
  {
    title: 'Verify PIPA Breach Notification Workflow',
    description:
      'Simulate a personal information breach affecting over 1,000 data subjects. Verify that the notification workflow triggers within 72 hours, that notification content includes all mandatory fields (information types, timing, countermeasures, contact), and that reports are routed to both PIPC and KISA.',
    category: 'Incident Management',
    tags: ['pipa', 'breach', 'notification-test'],
    linkedReqTags: ['pipa', 'breach-notification', 'pipc', 'kisa'],
  },
  {
    title: 'Verify ISMS-P Control Implementation',
    description:
      'Audit the system against the 80 ISMS-P certification controls. Verify that management system controls (policy, organization, risk management) are documented, that protection measures (access control, encryption, monitoring) are implemented, and that personal information lifecycle controls (collection through destruction) are operational.',
    category: 'Security',
    tags: ['isms-p', 'certification', 'audit-test'],
    linkedReqTags: ['isms-p', 'kisa', 'certification'],
  },
  {
    title: 'Verify FSC/FSS Financial Transaction Security',
    description:
      'Test that electronic financial transactions require multi-factor authentication. Verify end-to-end encryption for all financial data in transit. Confirm that fraud detection alerts are triggered for anomalous transaction patterns. Test incident reporting capability to FSS within 24-hour SLA.',
    category: 'Financial Security',
    tags: ['fsc', 'fss', 'financial-security-test'],
    linkedReqTags: ['fsc', 'fss', 'electronic-finance'],
  },
  {
    title: 'Verify K-IFRS Financial Data Integrity Controls',
    description:
      'Validate that financial transaction data maintains complete audit trails as required by K-IFRS and ICFR. Test multi-currency calculations for accuracy. Verify that internal controls prevent unauthorized modification of financial records and that reconciliation reports are generated correctly.',
    category: 'Financial Compliance',
    tags: ['k-ifrs', 'financial', 'integrity-test'],
    linkedReqTags: ['k-ifrs', 'financial-reporting', 'icfr'],
  },
  {
    title: 'Verify Data Subject Rights Implementation',
    description:
      'Submit access, correction, deletion, and suspension requests as a data subject. Verify that each request is processed within the 10-day PIPA deadline. Confirm that deletion requests result in verifiable data removal and that suspension requests halt applicable processing activities.',
    category: 'Privacy',
    tags: ['pipa', 'data-subject-rights', 'rights-test'],
    linkedReqTags: ['pipa', 'data-subject-rights', 'personal-information'],
  },
  {
    title: 'Verify CSAP Cloud Security Controls',
    description:
      'Assess cloud service security controls against the 14 CSAP control areas. Verify encryption of data at rest and in transit, access control mechanisms, virtualization isolation, incident response procedures, and disaster recovery capabilities. Confirm compliance documentation is maintained for KISA review.',
    category: 'Cloud Security',
    tags: ['csap', 'cloud', 'security-test'],
    linkedReqTags: ['csap', 'cloud', 'kisa'],
  },
];
