/**
 * Saudi Arabia — Country-Specific Base Regulatory Template
 *
 * Saudi Arabia-specific requirements covering SFDA (Saudi Food and Drug
 * Authority) medical device and pharmaceutical regulations, PDPL (Personal
 * Data Protection Law), and NCA (National Cybersecurity Authority) cybersecurity
 * requirements.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // SFDA — Saudi Food and Drug Authority
  // -----------------------------------------------------------------------
  {
    title: 'SFDA — Medical Device Registration (MDMA)',
    description:
      'Medical devices marketed in Saudi Arabia shall be registered with SFDA through the Medical Devices and Materials Administration (MDMA). Registration requires: device classification per SFDA guidance (Class I-IV aligned with GHTF), conformity assessment through SFDA-recognized conformity assessment bodies, technical documentation including clinical evaluation, Arabic and English labeling, and authorized representative in KSA for foreign manufacturers.',
    category: 'Medical Device Registration',
    tags: ['sfda', 'mdma', 'device-registration', 'saudi-arabia'],
    riskLevel: 'critical',
    regulatoryRef: 'SFDA Medical Devices Interim Regulations; SFDA Guidance MDS-G5',
  },
  {
    title: 'SFDA — Pharmaceutical GMP (SFDA GMP Guidelines)',
    description:
      'Pharmaceutical manufacturers shall comply with SFDA GMP requirements, which are harmonized with WHO GMP and PIC/S standards. Requirements include: quality management system, production controls, quality control laboratory, qualification/validation, self-inspections, documentation and records, complaints and recalls. Foreign manufacturing sites must hold valid GMP certificates from PIC/S member authorities or undergo SFDA inspection.',
    category: 'Manufacturing',
    tags: ['sfda', 'gmp', 'pharmaceutical', 'saudi-arabia'],
    riskLevel: 'critical',
    regulatoryRef: 'SFDA GMP Guidelines; Saudi Drug Law (Royal Decree M/31)',
  },
  {
    title: 'SFDA — Pharmacovigilance and Post-Market Surveillance',
    description:
      'Marketing authorization holders shall maintain pharmacovigilance systems per SFDA requirements. Adverse drug reactions shall be reported through the Saudi Vigilance system. Serious unexpected ADRs shall be reported within 15 calendar days; fatal/life-threatening within 7 days with follow-up at 15 days. Medical device vigilance reports shall be submitted per SFDA timelines. Periodic Safety Update Reports (PSURs) shall be submitted as required.',
    category: 'Post-Market',
    tags: ['sfda', 'pharmacovigilance', 'post-market', 'saudi-vigilance', 'saudi-arabia'],
    riskLevel: 'high',
    regulatoryRef: 'SFDA Pharmacovigilance Guidelines; SFDA Medical Device Vigilance Guidance',
  },
  // -----------------------------------------------------------------------
  // PDPL — Personal Data Protection Law
  // -----------------------------------------------------------------------
  {
    title: 'PDPL — Legal Basis and Consent for Data Processing',
    description:
      'Personal data processing shall comply with the Saudi PDPL (Royal Decree M/19 of 2021). Processing requires a valid legal basis: consent of the data subject, necessity for contract performance, legal obligation, vital interest, public interest, or legitimate interest. Consent must be specific, informed, and freely given. Sensitive data (health, genetic, biometric, credit) requires explicit consent. Cross-border data transfers require SDAIA (Saudi Data and Artificial Intelligence Authority) approval.',
    category: 'Privacy',
    tags: ['pdpl', 'consent', 'data-protection', 'saudi-arabia'],
    riskLevel: 'critical',
    regulatoryRef: 'PDPL Articles 5-6, 11 (Royal Decree M/19)',
  },
  {
    title: 'PDPL — Data Subject Rights',
    description:
      'Data subjects shall be able to exercise rights under PDPL: right to be informed about data collection, right of access, right to correction, right to destruction of data no longer necessary, right to request data in readable format. Controllers shall respond within 30 days. A Data Protection Officer shall be appointed when required by SDAIA regulations.',
    category: 'Privacy',
    tags: ['pdpl', 'data-subject-rights', 'dpo', 'saudi-arabia'],
    riskLevel: 'high',
    regulatoryRef: 'PDPL Articles 3-4 (Royal Decree M/19)',
  },
  {
    title: 'PDPL — Cross-Border Data Transfer',
    description:
      'Transfer of personal data outside the Kingdom of Saudi Arabia shall comply with PDPL Article 29. Transfers require: adequate level of protection in the receiving country as determined by SDAIA, or appropriate safeguards (contractual clauses, binding corporate rules). Health data transfers require additional authorization. Data localization requirements may apply for specific sectors.',
    category: 'Privacy',
    tags: ['pdpl', 'cross-border', 'data-transfer', 'sdaia', 'saudi-arabia'],
    riskLevel: 'high',
    regulatoryRef: 'PDPL Article 29; SDAIA Guidelines on Cross-Border Transfer',
  },
  // -----------------------------------------------------------------------
  // NCA — National Cybersecurity Authority
  // -----------------------------------------------------------------------
  {
    title: 'NCA — Essential Cybersecurity Controls (ECC)',
    description:
      'Organizations operating in Saudi Arabia shall comply with NCA Essential Cybersecurity Controls (ECC-1:2018). The 114 controls span 5 domains: cybersecurity governance, cybersecurity defense, cybersecurity resilience, third-party cybersecurity, and industrial control system cybersecurity. Health sector organizations must additionally comply with NCA Health Sector Cybersecurity Framework (HCF).',
    category: 'Cybersecurity',
    tags: ['nca', 'ecc', 'cybersecurity', 'hcf', 'saudi-arabia'],
    riskLevel: 'high',
    regulatoryRef: 'NCA ECC-1:2018; NCA HCF',
  },
  {
    title: 'NCA — Incident Reporting and Cyber Resilience',
    description:
      'Cybersecurity incidents shall be reported to NCA (CERT-SA) per the national incident reporting framework. Critical infrastructure incidents require immediate notification. Organizations shall maintain business continuity and disaster recovery plans. Periodic cybersecurity assessments and penetration testing shall be conducted. Incident response plans shall be tested annually.',
    category: 'Cybersecurity',
    tags: ['nca', 'incident-reporting', 'cert-sa', 'resilience', 'saudi-arabia'],
    riskLevel: 'high',
    regulatoryRef: 'NCA ECC-1:2018 Domain 3; NCA Incident Reporting Guidelines',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify SFDA Device Registration Package',
    description:
      'Review the SFDA registration package for completeness. Verify device classification per SFDA/GHTF guidance, conformity assessment certificate from recognized body, clinical evaluation report, Arabic/English labeling, and authorized representative documentation. Confirm registration status in SFDA e-services portal.',
    category: 'Regulatory',
    tags: ['sfda', 'registration', 'device-test'],
    linkedReqTags: ['sfda', 'mdma', 'device-registration'],
  },
  {
    title: 'Verify PDPL Consent and Processing Compliance',
    description:
      'Audit data processing activities against PDPL legal bases. Verify consent mechanisms: specificity, informed nature, free choice, and withdrawal option. Test sensitive data handling: confirm explicit consent for health/genetic/biometric data. Verify privacy notice includes all PDPL-required information.',
    category: 'Privacy',
    tags: ['pdpl', 'consent', 'compliance-test'],
    linkedReqTags: ['pdpl', 'consent', 'data-protection'],
  },
  {
    title: 'Verify PDPL Data Subject Rights Implementation',
    description:
      'Submit data subject requests for: access, correction, destruction, and data portability. Verify responses within 30-day timeframe. Confirm DPO appointment and contact information availability. Test cross-border transfer controls against PDPL Article 29 requirements.',
    category: 'Privacy',
    tags: ['pdpl', 'rights', 'subject-test'],
    linkedReqTags: ['pdpl', 'data-subject-rights', 'dpo'],
  },
  {
    title: 'Verify NCA Essential Cybersecurity Controls',
    description:
      'Conduct assessment against NCA ECC-1:2018 control domains. Verify cybersecurity governance policies, identity and access management, data protection controls, network security, vulnerability management, and security monitoring. For health sector, additionally verify HCF compliance.',
    category: 'Cybersecurity',
    tags: ['nca', 'ecc', 'cybersecurity-test'],
    linkedReqTags: ['nca', 'ecc', 'cybersecurity', 'hcf'],
  },
  {
    title: 'Verify SFDA Pharmacovigilance Reporting',
    description:
      'Test adverse event reporting workflows through Saudi Vigilance system. Verify fatal/life-threatening ADR reporting within 7 days, serious ADR within 15 days. Confirm PSUR generation schedule. Test medical device vigilance reporting procedures.',
    category: 'Post-Market',
    tags: ['sfda', 'pharmacovigilance', 'reporting-test'],
    linkedReqTags: ['sfda', 'pharmacovigilance', 'post-market', 'saudi-vigilance'],
  },
];
