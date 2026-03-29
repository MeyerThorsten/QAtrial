/**
 * United Kingdom — Country-Specific Base Regulatory Template
 *
 * UK-specific requirements post-Brexit, covering UKCA marking, UK GDPR,
 * NCSC Cyber Essentials, FCA requirements, and ICO guidance.
 */

import type { CountryTemplateSet } from '../../types';

export const templateSet: CountryTemplateSet = {
  countryCode: 'GB',
  requirements: [
    // -----------------------------------------------------------------------
    // UKCA Marking
    // -----------------------------------------------------------------------
    {
      title: 'UKCA Marking and Conformity Assessment',
      description:
        'Products placed on the Great Britain market (England, Wales, Scotland) shall carry the UKCA (UK Conformity Assessed) mark where applicable. Conformity assessment shall be performed by a UK-recognised Approved Body. A UK Declaration of Conformity shall be issued. Technical documentation shall be maintained and available to market surveillance authorities. CE marking remains valid for Northern Ireland under the Windsor Framework.',
      category: 'Product Compliance',
      tags: ['ukca', 'conformity-assessment', 'approved-body', 'gb-market'],
      riskLevel: 'high',
      regulatoryRef: 'Product Safety and Metrology etc. (Amendment) Regulations 2022; UKCA Guidance',
    },
    {
      title: 'UK GDPR and Data Protection Act 2018',
      description:
        'Processing of personal data in the UK shall comply with the UK GDPR (retained EU GDPR) and the Data Protection Act 2018. Key requirements include: lawful basis for processing, data subject rights, Data Protection Impact Assessments for high-risk processing, appointment of a DPO where required, records of processing activities, and breach notification to the ICO within 72 hours.',
      category: 'Data Protection',
      tags: ['uk-gdpr', 'dpa-2018', 'ico', 'data-protection'],
      riskLevel: 'critical',
      regulatoryRef: 'UK GDPR; Data Protection Act 2018',
    },
    {
      title: 'UK International Data Transfers',
      description:
        'Transfers of personal data from the UK to countries outside the UK shall be governed by the UK adequacy framework. Where no adequacy decision exists, International Data Transfer Agreements (IDTAs) or the UK Addendum to EU SCCs shall be used. A Transfer Risk Assessment (TRA) shall be conducted per ICO guidance to evaluate the data protection framework of the recipient country.',
      category: 'Data Protection',
      tags: ['uk-gdpr', 'data-transfer', 'idta', 'adequacy'],
      riskLevel: 'high',
      regulatoryRef: 'UK GDPR Articles 44-49; ICO International Transfer Guidance',
    },
    {
      title: 'NCSC Cyber Essentials Certification',
      description:
        'The organisation shall achieve and maintain NCSC Cyber Essentials (or Cyber Essentials Plus) certification. Controls shall address the five technical areas: firewalls and internet gateways, secure configuration, access control, malware protection, and patch management. Cyber Essentials Plus requires an independent assessment with on-site technical verification. Certification shall be renewed annually.',
      category: 'Cybersecurity',
      tags: ['ncsc', 'cyber-essentials', 'certification', 'security-controls'],
      riskLevel: 'high',
      regulatoryRef: 'NCSC Cyber Essentials Requirements for IT Infrastructure v3.1',
    },
    {
      title: 'ICO Accountability Framework Compliance',
      description:
        'The organisation shall demonstrate compliance with the ICO Accountability Framework covering: leadership and oversight, policies and procedures, training and awareness, individuals\' rights, transparency, records of processing and lawful basis, contracts and data sharing, risks and DPIAs, records management and security, and breach response and monitoring.',
      category: 'Data Protection',
      tags: ['ico', 'accountability', 'framework', 'compliance'],
      riskLevel: 'high',
      regulatoryRef: 'ICO Accountability Framework; UK GDPR Article 5(2)',
    },
    {
      title: 'FCA Regulatory Compliance (Financial Services)',
      description:
        'If the system processes financial data or serves regulated financial services firms, it shall comply with FCA requirements including: Senior Managers and Certification Regime (SM&CR) record-keeping, MiFID II transaction reporting data integrity, operational resilience (Important Business Services mapping, impact tolerances, scenario testing), and FCA Principles for Business including proper systems and controls.',
      category: 'Financial Regulation',
      tags: ['fca', 'smcr', 'operational-resilience', 'mifid-ii'],
      riskLevel: 'high',
      regulatoryRef: 'FCA Handbook SYSC; PS21/3 Operational Resilience',
    },
    {
      title: 'UK Accessibility Regulations',
      description:
        'Public sector websites and mobile applications shall meet the Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018, requiring WCAG 2.1 Level AA conformance. An accessibility statement shall be published. Private sector organisations shall prepare for the Accessibility Act transposition. Digital services shall be inclusive by design.',
      category: 'Accessibility',
      tags: ['accessibility', 'wcag', 'public-sector', 'uk-regulations'],
      riskLevel: 'medium',
      regulatoryRef: 'Public Sector Bodies Accessibility Regulations 2018; WCAG 2.1 AA',
    },
    {
      title: 'UK Network and Information Systems (NIS) Regulations',
      description:
        'Operators of essential services and relevant digital service providers shall comply with the UK NIS Regulations 2018 (as amended). Requirements include: appropriate and proportionate security measures, notification of significant incidents to the competent authority, implementation of the NCSC Cyber Assessment Framework (CAF) principles, and cooperation with the designated competent authority.',
      category: 'Cybersecurity',
      tags: ['nis', 'essential-services', 'caf', 'incident-notification'],
      riskLevel: 'high',
      regulatoryRef: 'NIS Regulations 2018 (SI 2018/506); NCSC CAF',
    },
    {
      title: 'UK PECR — Privacy and Electronic Communications',
      description:
        'Electronic communications (emails, calls, cookies, direct marketing) shall comply with the Privacy and Electronic Communications Regulations 2003 (PECR). Requirements include: opt-in consent for marketing emails/texts (soft opt-in exception for existing customers), cookie consent before non-essential cookies are set, caller line identification, and restrictions on automated calling systems.',
      category: 'Privacy',
      tags: ['pecr', 'cookies', 'direct-marketing', 'e-privacy'],
      riskLevel: 'medium',
      regulatoryRef: 'PECR 2003 (SI 2003/2426); ICO PECR Guidance',
    },
    {
      title: 'UK Data Residency and Cloud Guidance',
      description:
        'For UK public sector and regulated industries, data residency considerations per NCSC cloud guidance shall be followed. Cloud service providers shall be assessed for security posture per the NCSC Cloud Security Principles (14 principles covering data in transit, asset protection, separation, governance, operational security, personnel, physical security, supply chain, identity/authentication, external interfaces, secure service administration, audit information, secure use, and secure development).',
      category: 'Cloud Security',
      tags: ['cloud-security', 'ncsc-principles', 'data-residency', 'uk-cloud'],
      riskLevel: 'medium',
      regulatoryRef: 'NCSC Cloud Security Principles; UK G-Cloud Framework',
    },
  ],

  tests: [
    {
      title: 'Verify UKCA Marking Compliance',
      description:
        'For applicable products, verify: UKCA marking is correctly applied, a UK Declaration of Conformity is issued, conformity assessment was performed by a UK Approved Body where required, technical documentation is available, and the responsible person in the UK is identified. For Northern Ireland products, verify CE/UKNI marking as applicable under the Windsor Framework.',
      category: 'Product Compliance',
      tags: ['ukca', 'marking', 'compliance-test'],
      linkedReqTags: ['ukca', 'conformity-assessment', 'approved-body'],
    },
    {
      title: 'Verify UK GDPR Compliance Controls',
      description:
        'Assess UK GDPR compliance: verify lawful basis is documented for each processing activity, privacy notices are provided, data subject rights can be exercised within 30 days, ROPA is maintained, DPIA is completed for high-risk processing, breach notification procedures enable 72-hour reporting to the ICO, and a DPO is appointed where required.',
      category: 'Data Protection',
      tags: ['uk-gdpr', 'compliance', 'assessment-test'],
      linkedReqTags: ['uk-gdpr', 'dpa-2018', 'ico'],
    },
    {
      title: 'Verify UK Data Transfer Mechanisms',
      description:
        'Review all international data transfers from the UK. Verify: each transfer has an identified legal mechanism (adequacy, IDTA, UK Addendum to SCCs), Transfer Risk Assessments are documented, supplementary measures are implemented where needed, and a transfer register is maintained. Test a sample transfer for compliance with ICO guidance.',
      category: 'Data Protection',
      tags: ['uk-gdpr', 'data-transfer', 'idta-test'],
      linkedReqTags: ['uk-gdpr', 'data-transfer', 'idta'],
    },
    {
      title: 'Verify Cyber Essentials Controls',
      description:
        'Assess the five Cyber Essentials control areas: verify firewalls are configured to deny unauthorized connections, systems are securely configured (default passwords changed, unnecessary services disabled), access control is role-based with unique credentials, malware protection is active and current, and security patches are applied within 14 days of release.',
      category: 'Cybersecurity',
      tags: ['cyber-essentials', 'controls', 'verification-test'],
      linkedReqTags: ['ncsc', 'cyber-essentials', 'security-controls'],
    },
    {
      title: 'Verify ICO Accountability Framework',
      description:
        'Perform an assessment against the ICO Accountability Framework expectations. Verify: data protection leadership is designated, policies are documented and communicated, training records are current, individuals\' rights procedures are operational, transparency measures (privacy notices) are adequate, and breach response procedures have been tested.',
      category: 'Data Protection',
      tags: ['ico', 'accountability', 'framework-test'],
      linkedReqTags: ['ico', 'accountability', 'framework'],
    },
    {
      title: 'Verify UK Accessibility Requirements',
      description:
        'Test the digital service against WCAG 2.1 Level AA requirements. Use automated scanning (axe, Lighthouse) and manual testing (keyboard navigation, screen reader). Verify the accessibility statement is published and contains: conformance level, non-accessible content, preparation date, and feedback mechanism. Identify and plan remediation for any failures.',
      category: 'Accessibility',
      tags: ['accessibility', 'wcag', 'uk-test'],
      linkedReqTags: ['accessibility', 'wcag', 'uk-regulations'],
    },
    {
      title: 'Verify PECR Cookie Consent Implementation',
      description:
        'Test cookie consent per PECR and ICO guidance. Verify: no non-essential cookies are set before consent, the consent mechanism offers genuine choice (reject is as easy as accept), consent preferences are stored and respected, analytics and marketing cookies require opt-in, and the cookie policy accurately describes all cookies used.',
      category: 'Privacy',
      tags: ['pecr', 'cookies', 'consent-test'],
      linkedReqTags: ['pecr', 'cookies', 'direct-marketing'],
    },
  ],
};

export default templateSet;
