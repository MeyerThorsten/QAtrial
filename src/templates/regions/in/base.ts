/**
 * India — Country-Specific Base Regulatory Template
 *
 * India-specific requirements covering DPDP Act 2023, IT Act 2000,
 * BIS standards, CERT-In directives, RBI guidelines, and GIGW.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // DPDP Act 2023 — Digital Personal Data Protection Act
  // -----------------------------------------------------------------------
  {
    title: 'DPDP Act 2023 — Lawful Processing and Consent',
    description:
      'Processing of digital personal data shall comply with the Digital Personal Data Protection Act, 2023. Processing is lawful only with the consent of the Data Principal or for certain legitimate uses (State functions, legal obligations, medical emergencies, employment purposes). Consent must be free, specific, informed, unconditional, and unambiguous, given through a clear affirmative action. The Data Fiduciary shall provide a notice in clear, plain language (English or any of the 22 scheduled languages) before obtaining consent.',
    category: 'Privacy',
    tags: ['dpdp', 'consent', 'privacy', 'india'],
    riskLevel: 'critical',
    regulatoryRef: 'DPDP Act 2023, Sections 4-7',
  },
  {
    title: 'DPDP Act 2023 — Data Principal Rights',
    description:
      'Data Principals shall have the right to: obtain information about processing, seek correction and erasure of personal data, nominate another person to exercise rights in case of death or incapacity, and access a grievance redressal mechanism. The Data Fiduciary shall respond to requests within the period prescribed by the Data Protection Board. Systems shall implement self-service interfaces for exercising these rights where practicable.',
    category: 'Privacy',
    tags: ['dpdp', 'data-principal-rights', 'privacy', 'india'],
    riskLevel: 'high',
    regulatoryRef: 'DPDP Act 2023, Sections 11-14',
  },
  {
    title: 'DPDP Act 2023 — Significant Data Fiduciary Obligations',
    description:
      'Entities designated as Significant Data Fiduciaries (SDFs) by the Central Government shall: appoint a Data Protection Officer (DPO) based in India, appoint an independent data auditor to evaluate compliance, conduct periodic Data Protection Impact Assessments (DPIAs), and comply with additional obligations as notified. SDFs processing data of children shall not undertake tracking, behavioral monitoring, or targeted advertising.',
    category: 'Privacy',
    tags: ['dpdp', 'significant-data-fiduciary', 'dpo', 'dpia', 'india'],
    riskLevel: 'critical',
    regulatoryRef: 'DPDP Act 2023, Section 10',
  },
  // -----------------------------------------------------------------------
  // IT Act 2000 — Information Technology Act
  // -----------------------------------------------------------------------
  {
    title: 'IT Act 2000 — Reasonable Security Practices (SPDI Rules)',
    description:
      'Body corporates possessing, dealing, or handling Sensitive Personal Data or Information (SPDI) shall implement reasonable security practices and procedures per the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. Compliance with IS/ISO/IEC 27001 or industry-specific security codes approved by the Central Government shall be deemed compliance. A comprehensive documented information security programme shall be maintained and reviewed annually.',
    category: 'Information Security',
    tags: ['it-act', 'spdi', 'iso-27001', 'india'],
    riskLevel: 'high',
    regulatoryRef: 'IT Act 2000, Section 43A; SPDI Rules 2011, Rule 8',
  },
  // -----------------------------------------------------------------------
  // BIS — Bureau of Indian Standards
  // -----------------------------------------------------------------------
  {
    title: 'BIS Certification — Compulsory Registration Scheme',
    description:
      'Electronics and IT products covered under the Compulsory Registration Scheme (CRS) of the Bureau of Indian Standards (BIS) shall obtain registration before sale or import into India. The manufacturer or authorized representative shall apply to BIS with test reports from BIS-recognized laboratories. Products shall comply with relevant IS standards (e.g., IS 13252 for IT equipment safety, IS 16046 for audio/video equipment). Registration is valid for two years and requires renewal.',
    category: 'Product Certification',
    tags: ['bis', 'crs', 'product-certification', 'india'],
    riskLevel: 'medium',
    regulatoryRef: 'BIS (Conformity Assessment) Regulations 2018; CRS Schedule II',
  },
  // -----------------------------------------------------------------------
  // CERT-In — Indian Computer Emergency Response Team
  // -----------------------------------------------------------------------
  {
    title: 'CERT-In Directions — Cybersecurity Incident Reporting',
    description:
      'Cybersecurity incidents shall be reported to CERT-In within six hours of noticing or being brought to notice of the incident, as per CERT-In Directions dated April 28, 2022. Reportable incidents include: targeted scanning/probing, compromise of critical systems, unauthorized access, website defacement, malware attacks, identity theft/phishing, data breaches, and attacks on critical infrastructure. System logs shall be maintained within Indian jurisdiction and retained for 180 days. All service providers shall designate a Point of Contact (PoC) for CERT-In.',
    category: 'Incident Management',
    tags: ['cert-in', 'incident-reporting', 'cybersecurity', 'india'],
    riskLevel: 'critical',
    regulatoryRef: 'CERT-In Directions 2022 (Under IT Act Section 70B)',
  },
  {
    title: 'CERT-In — NTP Synchronization and Log Retention',
    description:
      'All ICT system clocks shall be synchronized with the Network Time Protocol (NTP) servers of the National Informatics Centre (NIC) or the National Physical Laboratory (NPL), or with NTP servers traceable to these sources. System logs of ICT infrastructure (firewalls, IDS/IPS, web servers, databases, mail servers, application servers) shall be maintained for a rolling period of 180 days within Indian jurisdiction and shall be provided to CERT-In upon request.',
    category: 'Cybersecurity',
    tags: ['cert-in', 'ntp', 'log-retention', 'india'],
    riskLevel: 'high',
    regulatoryRef: 'CERT-In Directions 2022, Paragraphs (iii) and (iv)',
  },
  // -----------------------------------------------------------------------
  // RBI — Reserve Bank of India
  // -----------------------------------------------------------------------
  {
    title: 'RBI — Data Localization for Payment Systems',
    description:
      'Payment system operators and their technology service providers shall store the entire data relating to payment systems operated by them in a system only in India (data localization). This includes full end-to-end transaction details, customer data, payment credentials, and transaction logs. Where data processing occurs outside India for cross-border transactions, the data shall be deleted from foreign systems and brought back to India within one business day (or the period permitted by the RBI).',
    category: 'Data Localization',
    tags: ['rbi', 'data-localization', 'payment-systems', 'india'],
    riskLevel: 'critical',
    regulatoryRef: 'RBI Circular on Storage of Payment System Data (2018); RBI Master Directions on Digital Payment Security Controls (2021)',
  },
  // -----------------------------------------------------------------------
  // GIGW — Guidelines for Indian Government Websites
  // -----------------------------------------------------------------------
  {
    title: 'GIGW — Accessibility and Usability Standards',
    description:
      'Web applications serving Indian government agencies or public sector undertakings shall comply with GIGW 3.0 (Guidelines for Indian Government Websites). Requirements include: WCAG 2.1 Level AA accessibility compliance, bilingual content (Hindi and English at minimum), mobile responsiveness, support for screen readers and assistive technologies, sitemap and search functionality, grievance redressal mechanism, and compliance with STQC (Standardisation Testing and Quality Certification) testing.',
    category: 'Accessibility',
    tags: ['gigw', 'accessibility', 'wcag', 'government', 'india'],
    riskLevel: 'medium',
    regulatoryRef: 'GIGW 3.0 (2023); Rights of Persons with Disabilities Act 2016, Section 42',
  },
  {
    title: 'Aadhaar Data Security — UIDAI Standards',
    description:
      'Systems processing Aadhaar numbers or biometric data shall comply with UIDAI (Unique Identification Authority of India) security standards. Aadhaar numbers shall be stored in encrypted form using AES-256 or higher. Aadhaar data shall not be shared with unauthorized entities. Authentication using Aadhaar shall be performed only through UIDAI-approved APIs. Virtual IDs shall be supported as an alternative to full Aadhaar numbers.',
    category: 'Identity Security',
    tags: ['aadhaar', 'uidai', 'identity', 'encryption', 'india'],
    riskLevel: 'critical',
    regulatoryRef: 'Aadhaar Act 2016, Sections 28-29; UIDAI Security Standards (2022)',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify DPDP Act Consent Management',
    description:
      'Test that consent collection meets DPDP Act requirements: notice is provided in clear language, consent is specific per purpose, withdrawal mechanism works, and children\'s data processing obtains verifiable parental consent. Verify consent records are maintained with full audit trail.',
    category: 'Privacy',
    tags: ['dpdp', 'consent', 'privacy-test'],
    linkedReqTags: ['dpdp', 'consent', 'privacy'],
  },
  {
    title: 'Verify Data Principal Rights Workflow',
    description:
      'Submit access, correction, erasure, and grievance requests as a Data Principal. Verify each request is acknowledged and processed within the prescribed period. Confirm that erasure results in verifiable data deletion and that nomination of another person for rights exercise is supported.',
    category: 'Privacy',
    tags: ['dpdp', 'data-principal-rights', 'rights-test'],
    linkedReqTags: ['dpdp', 'data-principal-rights', 'privacy'],
  },
  {
    title: 'Verify CERT-In Incident Reporting Compliance',
    description:
      'Simulate a cybersecurity incident and verify that the reporting workflow triggers within the six-hour CERT-In deadline. Confirm that the report includes all mandatory details (incident type, systems affected, impact, remediation). Verify that the designated Point of Contact is notified and that the report is formatted per CERT-In requirements.',
    category: 'Incident Management',
    tags: ['cert-in', 'incident', 'reporting-test'],
    linkedReqTags: ['cert-in', 'incident-reporting', 'cybersecurity'],
  },
  {
    title: 'Verify NTP Synchronization and 180-Day Log Retention',
    description:
      'Confirm system clocks are synchronized with NIC/NPL NTP servers or traceable sources with variance under one second. Verify that ICT infrastructure logs (firewall, IDS, web server, database) are retained for at least 180 days within Indian jurisdiction. Attempt to delete logs before the retention period and confirm prevention.',
    category: 'Cybersecurity',
    tags: ['cert-in', 'ntp', 'log-retention-test'],
    linkedReqTags: ['cert-in', 'ntp', 'log-retention'],
  },
  {
    title: 'Verify RBI Payment Data Localization',
    description:
      'For payment system data, verify that all transaction data, customer data, and payment credentials are stored exclusively within India. Simulate a cross-border transaction and confirm that foreign copies are deleted within the prescribed timeframe. Audit storage configurations to confirm no data resides outside Indian jurisdiction.',
    category: 'Data Localization',
    tags: ['rbi', 'data-localization', 'payment-test'],
    linkedReqTags: ['rbi', 'data-localization', 'payment-systems'],
  },
  {
    title: 'Verify GIGW Accessibility Compliance',
    description:
      'Run automated WCAG 2.1 Level AA accessibility testing using axe-core or equivalent. Verify bilingual support (Hindi and English). Test with screen readers (NVDA, JAWS). Confirm mobile responsiveness across devices. Validate sitemap, search functionality, and grievance redressal mechanism are present and operational.',
    category: 'Accessibility',
    tags: ['gigw', 'accessibility', 'wcag-test'],
    linkedReqTags: ['gigw', 'accessibility', 'wcag'],
  },
  {
    title: 'Verify IT Act SPDI Reasonable Security Practices',
    description:
      'Audit the information security programme for compliance with SPDI Rules 2011. Verify ISO 27001 alignment or approved industry code implementation. Confirm the security programme is documented, covers all SPDI categories, and has been reviewed within the past 12 months. Test technical controls including encryption, access control, and monitoring.',
    category: 'Information Security',
    tags: ['it-act', 'spdi', 'security-test'],
    linkedReqTags: ['it-act', 'spdi', 'iso-27001'],
  },
];
