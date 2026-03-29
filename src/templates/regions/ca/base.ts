/**
 * Canada — Country-Specific Base Regulatory Template
 *
 * Canada-specific requirements covering PIPEDA, PHIPA,
 * CSA standards, AODA accessibility, and CASL anti-spam legislation.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // PIPEDA — Personal Information Protection and Electronic Documents Act
  // -----------------------------------------------------------------------
  {
    title: 'PIPEDA — Fair Information Principles Compliance',
    description:
      'Personal information handling shall comply with PIPEDA\'s 10 fair information principles outlined in Schedule 1: accountability, identifying purposes, consent, limiting collection, limiting use/disclosure/retention, accuracy, safeguards, openness, individual access, and challenging compliance. Organizations shall designate a Privacy Officer accountable for compliance and implement policies to give effect to each principle.',
    category: 'Privacy',
    tags: ['pipeda', 'privacy', 'fair-information-principles', 'canada'],
    riskLevel: 'critical',
    regulatoryRef: 'PIPEDA Schedule 1 (10 Principles); S.C. 2000, c. 5',
  },
  {
    title: 'PIPEDA — Meaningful Consent',
    description:
      'Consent for collection, use, or disclosure of personal information shall be meaningful. Per OPC guidance, organizations shall: explain in plain language what information is being collected and why, identify specific consequences of collection/use/disclosure, provide opt-out for non-essential processing, and allow withdrawal of consent subject to legal constraints. Express consent is required for sensitive information (health, financial, children\'s data).',
    category: 'Privacy',
    tags: ['pipeda', 'consent', 'opc', 'canada'],
    riskLevel: 'high',
    regulatoryRef: 'PIPEDA Principle 3 (Consent); OPC Guidelines for Obtaining Meaningful Consent (2018)',
  },
  {
    title: 'PIPEDA — Mandatory Breach Notification',
    description:
      'Data breaches creating a real risk of significant harm (RROSH) shall be reported to the Office of the Privacy Commissioner (OPC) and affected individuals as soon as feasible. The organization shall maintain a record of all breaches for at least 24 months. Reports shall include description of the circumstances, date of breach, personal information involved, assessment of risk of harm, and steps taken to reduce risk.',
    category: 'Incident Management',
    tags: ['pipeda', 'breach-notification', 'opc', 'rrosh', 'canada'],
    riskLevel: 'critical',
    regulatoryRef: 'PIPEDA Section 10.1; Breach of Security Safeguards Regulations (SOR/2018-64)',
  },
  // -----------------------------------------------------------------------
  // PHIPA — Personal Health Information Protection Act (Ontario)
  // -----------------------------------------------------------------------
  {
    title: 'PHIPA — Health Information Custodian Obligations',
    description:
      'Health information custodians (HICs) operating in Ontario shall comply with PHIPA for the collection, use, disclosure, retention, and disposal of personal health information (PHI). Requirements include: implementing information practices that comply with PHIPA, designating a contact person for PHI inquiries, providing a public statement of information practices, limiting collection to what is necessary, ensuring accuracy of PHI, and implementing administrative/technical/physical safeguards per O. Reg. 329/04.',
    category: 'Health Privacy',
    tags: ['phipa', 'health-privacy', 'phi', 'ontario', 'canada'],
    riskLevel: 'critical',
    regulatoryRef: 'PHIPA 2004, S.O. 2004, c. 3, Sched. A; O. Reg. 329/04',
  },
  // -----------------------------------------------------------------------
  // CSA Standards
  // -----------------------------------------------------------------------
  {
    title: 'CSA Group Standards — Product Safety Certification',
    description:
      'Products sold in Canada that fall under provincial electrical safety regulations shall bear CSA certification marks or equivalent SCC-accredited marks. Certification involves testing to applicable CSA standards (e.g., CSA C22.2 for electrical equipment, CSA Z462 for workplace electrical safety) by an SCC-accredited certification body. Factory audits and periodic follow-up inspections are required to maintain certification.',
    category: 'Product Certification',
    tags: ['csa', 'product-safety', 'scc', 'certification', 'canada'],
    riskLevel: 'medium',
    regulatoryRef: 'CSA C22.2 Series; Provincial Electrical Safety Codes; SCC Accreditation',
  },
  {
    title: 'CSA/CAN National Standard for Cyber Security',
    description:
      'Systems handling critical infrastructure or government data shall consider alignment with CAN/CIOSC 104 (Cyber Security for Organizations) and CSA T200 (Cyber Security Framework). These frameworks address governance, risk management, asset management, identity management, access control, threat detection, incident response, and recovery. Federal government suppliers shall meet TBS Directive on Security Management requirements.',
    category: 'Cybersecurity',
    tags: ['csa', 'cybersecurity', 'ciosc', 'tbs', 'canada'],
    riskLevel: 'high',
    regulatoryRef: 'CAN/CIOSC 104:2021; TBS Directive on Security Management',
  },
  // -----------------------------------------------------------------------
  // AODA — Accessibility for Ontarians with Disabilities Act
  // -----------------------------------------------------------------------
  {
    title: 'AODA — Web Content Accessibility',
    description:
      'Web content and web applications shall comply with the Accessibility for Ontarians with Disabilities Act, 2005 (AODA) and its Integrated Accessibility Standards Regulation (IASR). Public sector organizations shall meet WCAG 2.0 Level AA standards. Requirements include: text alternatives for non-text content, keyboard accessibility, sufficient color contrast, resizable text, compatible assistive technology support, and accessible forms. Annual compliance reporting is required for organizations with 20+ employees.',
    category: 'Accessibility',
    tags: ['aoda', 'accessibility', 'wcag', 'ontario', 'canada'],
    riskLevel: 'medium',
    regulatoryRef: 'AODA 2005; O. Reg. 191/11 (IASR) Section 14',
  },
  // -----------------------------------------------------------------------
  // CASL — Canada's Anti-Spam Legislation
  // -----------------------------------------------------------------------
  {
    title: 'CASL — Commercial Electronic Messages Compliance',
    description:
      'Commercial electronic messages (CEMs) shall comply with Canada\'s Anti-Spam Legislation (S.C. 2010, c. 23). Requirements include: obtaining express or implied consent before sending CEMs, including prescribed identification information (sender name, contact address, unsubscribe mechanism), honoring unsubscribe requests within 10 business days, and maintaining consent records. Installation of software requires express consent with prescribed disclosures. Violations may result in AMPs of up to $10M per violation for corporations.',
    category: 'Compliance',
    tags: ['casl', 'anti-spam', 'electronic-messages', 'canada'],
    riskLevel: 'medium',
    regulatoryRef: 'CASL S.C. 2010, c. 23; CRTC CASL Compliance Guidelines',
  },
  {
    title: 'Quebec Law 25 — Privacy Modernization',
    description:
      'Organizations handling personal information of Quebec residents shall comply with Quebec\'s Act respecting the protection of personal information in the private sector (Law 25, formerly Bill 64). Requirements include: Privacy Impact Assessments for any project involving personal information, designation of a person responsible for privacy protection, mandatory breach notification to the Commission d\'acces a l\'information (CAI), data portability rights, and anonymization governance. Consent must be requested for each purpose separately.',
    category: 'Privacy',
    tags: ['law-25', 'quebec', 'privacy', 'cai', 'canada'],
    riskLevel: 'high',
    regulatoryRef: 'Quebec Act respecting the protection of personal information in the private sector (Law 25, 2023 provisions)',
  },
  {
    title: 'OSFI B-13 — Technology and Cyber Risk Management',
    description:
      'Federally regulated financial institutions shall comply with OSFI Guideline B-13 on Technology and Cyber Risk Management. Requirements include: technology risk governance and accountability at the board level, technology asset management, vulnerability management, patch management, identity and access management, data management, third-party technology risk management, incident management, and technology resilience including disaster recovery testing at least annually.',
    category: 'Financial Security',
    tags: ['osfi', 'b-13', 'cyber-risk', 'financial', 'canada'],
    riskLevel: 'high',
    regulatoryRef: 'OSFI Guideline B-13 (2023)',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify PIPEDA Fair Information Principles Implementation',
    description:
      'Audit the system against all 10 PIPEDA fair information principles. Verify that a Privacy Officer is designated, privacy policies are published and accessible, data collection is limited to stated purposes, retention schedules are enforced, and individual access requests can be fulfilled within 30 days.',
    category: 'Privacy',
    tags: ['pipeda', 'fair-information', 'privacy-test'],
    linkedReqTags: ['pipeda', 'privacy', 'fair-information-principles'],
  },
  {
    title: 'Verify PIPEDA Breach Notification Process',
    description:
      'Simulate a breach with real risk of significant harm (RROSH). Verify that the breach assessment determines RROSH correctly, that OPC notification is generated with all mandatory fields, that affected individuals are notified as soon as feasible, and that the breach is recorded in the 24-month breach register.',
    category: 'Incident Management',
    tags: ['pipeda', 'breach', 'notification-test'],
    linkedReqTags: ['pipeda', 'breach-notification', 'opc', 'rrosh'],
  },
  {
    title: 'Verify PHIPA Health Information Safeguards',
    description:
      'Test administrative, technical, and physical safeguards for personal health information. Verify access controls limit PHI access to authorized HICs. Confirm audit logging of all PHI access. Test that PHI collection is limited to necessary information and that disposal procedures securely destroy PHI per PHIPA requirements.',
    category: 'Health Privacy',
    tags: ['phipa', 'health-privacy', 'safeguards-test'],
    linkedReqTags: ['phipa', 'health-privacy', 'phi'],
  },
  {
    title: 'Verify AODA WCAG 2.0 Level AA Accessibility',
    description:
      'Run automated accessibility testing (axe-core, WAVE) against all user-facing pages. Verify WCAG 2.0 Level AA compliance for: text alternatives, keyboard navigation, color contrast (4.5:1 minimum), resizable text, form labels, error identification, and assistive technology compatibility. Conduct manual testing with screen reader (NVDA/JAWS).',
    category: 'Accessibility',
    tags: ['aoda', 'wcag', 'accessibility-test'],
    linkedReqTags: ['aoda', 'accessibility', 'wcag'],
  },
  {
    title: 'Verify CASL Commercial Message Compliance',
    description:
      'Test that commercial electronic messages include all prescribed elements: sender identification, contact information, functional unsubscribe mechanism. Verify that unsubscribe requests are processed within 10 business days. Confirm that consent records are maintained and that messages are not sent to recipients who have not consented.',
    category: 'Compliance',
    tags: ['casl', 'anti-spam', 'compliance-test'],
    linkedReqTags: ['casl', 'anti-spam', 'electronic-messages'],
  },
  {
    title: 'Verify Quebec Law 25 Privacy Impact Assessment',
    description:
      'Confirm that Privacy Impact Assessments (PIAs) are conducted for projects involving personal information of Quebec residents. Verify that the designated privacy responsible person is documented, that breach notifications are routed to the CAI, and that data portability requests can be fulfilled in a structured, commonly used format.',
    category: 'Privacy',
    tags: ['law-25', 'quebec', 'pia-test'],
    linkedReqTags: ['law-25', 'quebec', 'privacy', 'cai'],
  },
  {
    title: 'Verify OSFI B-13 Technology Risk Controls',
    description:
      'Audit technology risk management controls against OSFI B-13 requirements. Verify vulnerability management and patch management processes, identity and access management controls, third-party technology risk assessments, incident management procedures, and annual disaster recovery testing documentation.',
    category: 'Financial Security',
    tags: ['osfi', 'b-13', 'risk-test'],
    linkedReqTags: ['osfi', 'b-13', 'cyber-risk'],
  },
];
