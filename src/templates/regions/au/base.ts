/**
 * Australia — Country-Specific Base Regulatory Template
 *
 * Australia-specific requirements covering TGA (Therapeutic Goods Administration)
 * medical device and pharmaceutical regulations, Privacy Act 1988
 * (including Australian Privacy Principles), and ACSC (Australian Cyber
 * Security Centre) Essential Eight cybersecurity mitigation strategies.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // TGA — Therapeutic Goods Administration
  // -----------------------------------------------------------------------
  {
    title: 'TGA — Medical Device Inclusion in ARTG',
    description:
      'Medical devices supplied in Australia shall be included in the Australian Register of Therapeutic Goods (ARTG) per the Therapeutic Goods Act 1989. Manufacturers shall demonstrate conformity with applicable Essential Principles (Therapeutic Goods (Medical Devices) Regulations 2002, Schedule 1). Class I devices require notification; Class IIa/IIb/III/AIMD require conformity assessment by a TGA-recognized EU Notified Body or TGA direct assessment. Software as Medical Device (SaMD) follows TGA SaMD guidance.',
    category: 'Medical Device Registration',
    tags: ['tga', 'artg', 'device-registration', 'essential-principles', 'australia'],
    riskLevel: 'critical',
    regulatoryRef: 'Therapeutic Goods Act 1989; TG(MD) Regulations 2002; TGA Essential Principles',
  },
  {
    title: 'TGA — Pharmaceutical GMP (PIC/S Compliance)',
    description:
      'Pharmaceutical manufacturing for the Australian market shall comply with TGA GMP requirements, which are harmonized with PIC/S standards. Manufacturing sites shall hold a valid TGA GMP license or clearance. Foreign manufacturers must hold a PIC/S-member GMP certificate or undergo TGA inspection. Requirements cover quality system, premises, equipment, documentation, production, quality control, outsourced activities, complaints, recalls, and self-inspection.',
    category: 'Manufacturing',
    tags: ['tga', 'gmp', 'pics', 'pharmaceutical', 'australia'],
    riskLevel: 'critical',
    regulatoryRef: 'Therapeutic Goods Act 1989 Part 3-3; PIC/S PE 009; TGA Manufacturing Principles',
  },
  {
    title: 'TGA — Post-Market Monitoring and Adverse Event Reporting',
    description:
      'Sponsors of therapeutic goods shall report adverse events to TGA. For medical devices: mandatory reporting of incidents that led to or could lead to death/serious injury within timeframes based on severity (2 days for emerging threats, 10 days for death/serious deterioration, 30 days for others). For medicines: serious/unexpected ADRs within 15 calendar days. Annual reporting of all adverse events.',
    category: 'Post-Market',
    tags: ['tga', 'adverse-events', 'post-market', 'mandatory-reporting', 'australia'],
    riskLevel: 'high',
    regulatoryRef: 'TGA Mandatory Reporting Requirements; Therapeutic Goods Regulations 1990',
  },
  // -----------------------------------------------------------------------
  // Privacy Act 1988 — Australian Privacy Principles (APPs)
  // -----------------------------------------------------------------------
  {
    title: 'APPs — Collection and Use of Personal Information',
    description:
      'Collection, use, and disclosure of personal information shall comply with the 13 Australian Privacy Principles (APPs) under the Privacy Act 1988. APP 3 requires that collection is reasonably necessary and by lawful/fair means. APP 6 limits use/disclosure to the primary purpose or a directly related secondary purpose the individual would reasonably expect. Sensitive information (health, genetic, biometric) requires consent for collection (APP 3.3) unless exceptions apply.',
    category: 'Privacy',
    tags: ['privacy-act', 'apps', 'collection', 'sensitive-info', 'australia'],
    riskLevel: 'critical',
    regulatoryRef: 'Privacy Act 1988 Schedule 1 (APPs 1-13)',
  },
  {
    title: 'APPs — Notifiable Data Breaches (NDB) Scheme',
    description:
      'Organizations shall comply with the Notifiable Data Breaches scheme (Part IIIC of the Privacy Act). If an eligible data breach is likely to result in serious harm to individuals, the OAIC (Office of the Australian Information Commissioner) and affected individuals must be notified as soon as practicable. An assessment must be completed within 30 days of becoming aware of a suspected breach.',
    category: 'Privacy',
    tags: ['privacy-act', 'ndb', 'data-breach', 'oaic', 'australia'],
    riskLevel: 'high',
    regulatoryRef: 'Privacy Act 1988 Part IIIC; Privacy Amendment (Notifiable Data Breaches) Act 2017',
  },
  {
    title: 'APPs — Cross-Border Disclosure of Personal Information',
    description:
      'Before disclosing personal information to an overseas recipient (APP 8), the entity must take reasonable steps to ensure the recipient complies with APPs, or obtain individual consent after informing them that APP 8.1 will not apply. The disclosing entity remains accountable for overseas recipients\' handling of the information unless an exception applies.',
    category: 'Privacy',
    tags: ['privacy-act', 'app-8', 'cross-border', 'overseas-disclosure', 'australia'],
    riskLevel: 'medium',
    regulatoryRef: 'Privacy Act 1988 APP 8',
  },
  // -----------------------------------------------------------------------
  // ACSC — Australian Cyber Security Centre Essential Eight
  // -----------------------------------------------------------------------
  {
    title: 'ACSC Essential Eight — Application Control and Patching',
    description:
      'Systems shall implement the ACSC Essential Eight mitigation strategies: (1) Application control — only approved/trusted programs execute; (2) Patch applications — security patches for internet-facing applications within 48 hours of release, other critical patches within two weeks; (3) Configure Microsoft Office macro settings — block macros from the internet, only allow vetted macros; (4) User application hardening — block Flash, ads, Java in browsers.',
    category: 'Cybersecurity',
    tags: ['acsc', 'essential-eight', 'application-control', 'patching', 'australia'],
    riskLevel: 'high',
    regulatoryRef: 'ACSC Essential Eight Maturity Model',
  },
  {
    title: 'ACSC Essential Eight — Access Control and Backups',
    description:
      'Systems shall implement: (5) Restrict administrative privileges — validated annually, no privileged browsing/email; (6) Patch operating systems — security patches within 48 hours for internet-facing, two weeks for others; (7) Multi-factor authentication — for all users accessing important data/internet-facing services, including VPN; (8) Regular backups — performed daily, tested quarterly, retained for three months, stored offline.',
    category: 'Cybersecurity',
    tags: ['acsc', 'essential-eight', 'access-control', 'mfa', 'backups', 'australia'],
    riskLevel: 'high',
    regulatoryRef: 'ACSC Essential Eight Maturity Model',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify TGA ARTG Inclusion and Essential Principles',
    description:
      'Confirm the medical device is included in ARTG with correct classification. Review conformity assessment evidence against applicable Essential Principles. Verify labeling meets TGA requirements. For SaMD, confirm classification per TGA SaMD guidance.',
    category: 'Regulatory',
    tags: ['tga', 'artg', 'essential-principles-test'],
    linkedReqTags: ['tga', 'artg', 'device-registration', 'essential-principles'],
  },
  {
    title: 'Verify Australian Privacy Principles Compliance',
    description:
      'Audit data handling practices against all 13 APPs. Verify APP 1 (privacy policy), APP 3 (collection practices), APP 5 (notification), APP 6 (use/disclosure limitations), APP 11 (security). Test sensitive information consent mechanisms for health/genetic data. Verify privacy policy is current and accessible.',
    category: 'Privacy',
    tags: ['privacy-act', 'apps', 'compliance-test'],
    linkedReqTags: ['privacy-act', 'apps', 'collection', 'sensitive-info'],
  },
  {
    title: 'Verify Notifiable Data Breach Procedures',
    description:
      'Test NDB response procedures: simulate a suspected breach, verify assessment is initiated promptly, confirm OAIC notification template is prepared, verify individual notification mechanisms. Test that assessment can be completed within 30 days. Verify breach register is maintained.',
    category: 'Privacy',
    tags: ['ndb', 'breach', 'response-test'],
    linkedReqTags: ['privacy-act', 'ndb', 'data-breach', 'oaic'],
  },
  {
    title: 'Verify ACSC Essential Eight Implementation',
    description:
      'Assess maturity against all 8 strategies: test application whitelisting effectiveness, verify patch currency for applications and OS (within 48 hours for critical), confirm macro restrictions, test MFA enforcement on all privileged and remote access, verify backup integrity and restoration capability (quarterly test).',
    category: 'Cybersecurity',
    tags: ['acsc', 'essential-eight', 'maturity-test'],
    linkedReqTags: ['acsc', 'essential-eight', 'application-control', 'patching', 'access-control', 'mfa', 'backups'],
  },
  {
    title: 'Verify TGA Adverse Event Reporting Compliance',
    description:
      'Test adverse event reporting workflows. Verify medical device incident reports meet TGA mandatory reporting timeframes (2/10/30 days by severity). For medicines, verify serious ADR reporting within 15 days. Confirm annual adverse event summary report generation.',
    category: 'Post-Market',
    tags: ['tga', 'adverse-event', 'reporting-test'],
    linkedReqTags: ['tga', 'adverse-events', 'post-market', 'mandatory-reporting'],
  },
];
