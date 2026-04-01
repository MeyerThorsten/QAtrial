/**
 * European Union — Base Regulatory Template
 *
 * Generic EU regulatory requirements applicable to all EU/EEA member states
 * regardless of industry vertical. Covers GDPR, Cyber Resilience Act,
 * accessibility, eIDAS, NIS2, and related directives.
 */

import type { CountryTemplateSet } from '../../types';

export const templateSet: CountryTemplateSet = {
  countryCode: 'EU',
  requirements: [
    // -----------------------------------------------------------------------
    // GDPR — Core Principles
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:data-protection:req-01',
      title: 'GDPR Article 5 — Data Processing Principles',
      description:
        'Personal data shall be processed in accordance with GDPR Article 5 principles: (a) lawfulness, fairness, and transparency, (b) purpose limitation, (c) data minimisation, (d) accuracy, (e) storage limitation, (f) integrity and confidentiality, and the controller shall be responsible for and able to demonstrate compliance (accountability).',
      category: 'Data Protection',
      tags: ['gdpr', 'article-5', 'principles', 'accountability'],
      riskLevel: 'critical',
      regulatoryRef: 'GDPR Article 5',
    },
    {
      templateId: 'eu:data-protection:req-02',
      title: 'GDPR Article 6 — Lawful Basis for Processing',
      description:
        'Processing of personal data shall be lawful only if at least one basis under Article 6 applies: (a) consent, (b) contract performance, (c) legal obligation, (d) vital interests, (e) public interest, or (f) legitimate interests. The lawful basis shall be determined and documented before processing begins.',
      category: 'Data Protection',
      tags: ['gdpr', 'article-6', 'lawful-basis', 'legal-ground'],
      riskLevel: 'critical',
      regulatoryRef: 'GDPR Article 6',
    },
    {
      templateId: 'eu:data-protection:req-03',
      title: 'GDPR Article 7 — Conditions for Consent',
      description:
        'Where consent is the lawful basis, it shall be freely given, specific, informed, and unambiguous. The system shall support: granular consent collection, clear plain-language consent requests, easy withdrawal of consent (as easy as giving it), and documented proof of consent including timestamp and scope.',
      category: 'Data Protection',
      tags: ['gdpr', 'article-7', 'consent', 'withdrawal'],
      riskLevel: 'high',
      regulatoryRef: 'GDPR Article 7',
    },

    // -----------------------------------------------------------------------
    // GDPR — Data Subject Rights
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:data-protection:req-04',
      title: 'GDPR Articles 13-14 — Right to Information',
      description:
        'Data subjects shall be informed at the time of data collection (Article 13) or within one month if data is obtained indirectly (Article 14). Information shall include: controller identity, DPO contact, purposes, lawful basis, recipients, transfer intentions, retention periods, and data subject rights.',
      category: 'Data Protection',
      tags: ['gdpr', 'article-13', 'article-14', 'transparency', 'privacy-notice'],
      riskLevel: 'high',
      regulatoryRef: 'GDPR Articles 13-14',
    },
    {
      templateId: 'eu:data-protection:req-05',
      title: 'GDPR Articles 15-22 — Data Subject Rights',
      description:
        'The system shall support the exercise of all data subject rights: right of access (Art. 15), right to rectification (Art. 16), right to erasure (Art. 17), right to restriction (Art. 18), right to data portability (Art. 20), right to object (Art. 21), and rights related to automated decision-making (Art. 22). Requests shall be fulfilled within one month.',
      category: 'Data Protection',
      tags: ['gdpr', 'data-subject-rights', 'access', 'erasure', 'portability'],
      riskLevel: 'critical',
      regulatoryRef: 'GDPR Articles 15-22',
    },

    // -----------------------------------------------------------------------
    // GDPR — Privacy by Design
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:data-protection:req-06',
      title: 'GDPR Article 25 — Data Protection by Design and Default',
      description:
        'The system shall implement data protection by design (appropriate technical and organisational measures such as pseudonymisation, minimisation) and by default (only data necessary for the specific purpose is processed, not accessible to an indefinite number of persons). A Data Protection Impact Assessment (DPIA) per Article 35 shall be conducted for high-risk processing.',
      category: 'Data Protection',
      tags: ['gdpr', 'article-25', 'privacy-by-design', 'dpia'],
      riskLevel: 'high',
      regulatoryRef: 'GDPR Articles 25 and 35',
    },

    // -----------------------------------------------------------------------
    // GDPR — Security
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:security:req-01',
      title: 'GDPR Article 32 — Security of Processing',
      description:
        'Appropriate technical and organisational security measures shall be implemented, including as appropriate: (a) pseudonymisation and encryption, (b) ability to ensure ongoing confidentiality, integrity, availability and resilience, (c) ability to restore availability in a timely manner, (d) regular testing and evaluation of effectiveness. Measures shall be proportionate to the risk.',
      category: 'Security',
      tags: ['gdpr', 'article-32', 'security', 'pseudonymisation', 'encryption'],
      riskLevel: 'critical',
      regulatoryRef: 'GDPR Article 32',
    },

    // -----------------------------------------------------------------------
    // GDPR — Breach Notification
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:data-protection:req-07',
      title: 'GDPR Articles 33-34 — Data Breach Notification',
      description:
        'A personal data breach shall be reported to the supervisory authority within 72 hours of becoming aware (Article 33) unless unlikely to result in risk. If the breach is likely to result in a high risk to individuals, affected data subjects shall be notified without undue delay (Article 34). The system shall maintain a breach register.',
      category: 'Data Protection',
      tags: ['gdpr', 'article-33', 'article-34', 'breach-notification', 'incident'],
      riskLevel: 'critical',
      regulatoryRef: 'GDPR Articles 33-34',
    },

    // -----------------------------------------------------------------------
    // Cyber Resilience Act
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:cybersecurity:req-01',
      title: 'EU Cyber Resilience Act (CRA) Compliance',
      description:
        'Products with digital elements shall comply with the EU Cyber Resilience Act essential cybersecurity requirements: security by design, no known exploitable vulnerabilities at release, secure default configuration, protection against unauthorized access, confidentiality protection, integrity protection, availability protection, minimal data processing, vulnerability handling process, and security updates for the support period.',
      category: 'Cybersecurity',
      tags: ['cra', 'cyber-resilience', 'security-by-design', 'vulnerability-handling'],
      riskLevel: 'high',
      regulatoryRef: 'EU Cyber Resilience Act (Regulation 2024/2847)',
    },

    // -----------------------------------------------------------------------
    // Accessibility
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:accessibility:req-01',
      title: 'EN 301 549 Accessibility Requirements',
      description:
        'The system shall conform to EN 301 549 (European accessibility standard harmonised with the European Accessibility Act). Requirements align with WCAG 2.1 Level AA for web content and include additional provisions for: software, hardware, documentation, and support services. Conformance shall be documented in an Accessibility Statement.',
      category: 'Accessibility',
      tags: ['accessibility', 'en-301-549', 'wcag', 'eaa'],
      riskLevel: 'medium',
      regulatoryRef: 'EN 301 549 v3.2.1; European Accessibility Act (Directive 2019/882)',
    },

    // -----------------------------------------------------------------------
    // eIDAS
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:trust-services:req-01',
      title: 'eIDAS Electronic Identification and Trust Services',
      description:
        'Where the system issues or relies on electronic signatures, seals, timestamps, or electronic delivery, it shall comply with eIDAS Regulation (EU) 910/2014. Qualified electronic signatures shall have the legal equivalent of handwritten signatures. The system shall support qualified trust service providers (QTSPs) and qualified certificates.',
      category: 'Trust Services',
      tags: ['eidas', 'electronic-signature', 'qualified', 'trust-services'],
      riskLevel: 'high',
      regulatoryRef: 'eIDAS Regulation (EU) 910/2014; eIDAS 2.0',
    },

    // -----------------------------------------------------------------------
    // EU Cookie Directive
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:privacy:req-01',
      title: 'EU ePrivacy Directive — Cookie Consent',
      description:
        'The system shall obtain prior informed consent before storing or accessing information on a user terminal device (cookies, local storage, fingerprinting) unless strictly necessary for the service requested. A cookie consent mechanism shall allow granular category-based choices (necessary, functional, analytics, marketing) and be as easy to withdraw as to give consent.',
      category: 'Privacy',
      tags: ['eprivacy', 'cookies', 'consent', 'tracking'],
      riskLevel: 'medium',
      regulatoryRef: 'ePrivacy Directive 2002/58/EC as amended by 2009/136/EC',
    },

    // -----------------------------------------------------------------------
    // NIS2 Directive
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:cybersecurity:req-02',
      title: 'NIS2 Directive — Cybersecurity Risk Management',
      description:
        'If the organisation falls within NIS2 scope (essential or important entity), cybersecurity risk management measures shall include: risk analysis and information system security policies, incident handling, business continuity and crisis management, supply chain security, security in network and information systems acquisition/development/maintenance, vulnerability handling and disclosure, cybersecurity training, and cryptography/encryption policies.',
      category: 'Cybersecurity',
      tags: ['nis2', 'cybersecurity', 'risk-management', 'incident-handling'],
      riskLevel: 'high',
      regulatoryRef: 'NIS2 Directive (EU) 2022/2555',
    },

    // -----------------------------------------------------------------------
    // Data Transfer
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:data-protection:req-08',
      title: 'GDPR Chapter V — International Data Transfers',
      description:
        'Transfers of personal data to third countries shall only occur based on an adequacy decision (Article 45), appropriate safeguards such as Standard Contractual Clauses or Binding Corporate Rules (Article 46), or specific derogations (Article 49). Transfer Impact Assessments (TIAs) shall be conducted for SCC-based transfers to evaluate the legal framework of the recipient country.',
      category: 'Data Protection',
      tags: ['gdpr', 'data-transfer', 'scc', 'bcr', 'adequacy'],
      riskLevel: 'high',
      regulatoryRef: 'GDPR Articles 44-49; Schrems II (C-311/18)',
    },

    // -----------------------------------------------------------------------
    // Records of Processing
    // -----------------------------------------------------------------------
    {
      templateId: 'eu:data-protection:req-09',
      title: 'GDPR Article 30 — Records of Processing Activities',
      description:
        'The controller shall maintain records of processing activities containing: name and contact details of controller/DPO, purposes of processing, categories of data subjects and personal data, categories of recipients, transfers to third countries, retention periods, and description of security measures. Records shall be in writing (including electronic form) and made available to the supervisory authority on request.',
      category: 'Data Protection',
      tags: ['gdpr', 'article-30', 'ropa', 'processing-records'],
      riskLevel: 'high',
      regulatoryRef: 'GDPR Article 30',
    },
  ],

  tests: [
    {
      templateId: 'eu:privacy:tst-01',
      title: 'Verify GDPR Consent Mechanism',
      description:
        'Test the consent collection workflow: verify consent is freely given (no pre-ticked boxes), purpose-specific (granular choices), informed (clear language), and unambiguous (affirmative action). Verify consent withdrawal is as easy as giving it. Verify consent records capture: timestamp, identity, scope, and version of privacy notice.',
      category: 'Privacy',
      tags: ['gdpr', 'consent', 'mechanism-test'],
      linkedReqTags: ['gdpr', 'article-7', 'consent', 'withdrawal'],
    },
    {
      templateId: 'eu:privacy:tst-02',
      title: 'Verify Data Subject Rights Fulfillment',
      description:
        'Submit test requests for each GDPR data subject right: access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), portability (Art. 20), and objection (Art. 21). Verify each is fulfilled within 30 days. Verify the exported data format is machine-readable for portability. Verify erasure handles cascading data relationships.',
      category: 'Privacy',
      tags: ['gdpr', 'data-subject-rights', 'fulfillment-test'],
      linkedReqTags: ['gdpr', 'data-subject-rights', 'access', 'erasure'],
    },
    {
      templateId: 'eu:privacy:tst-03',
      title: 'Verify Privacy by Design Implementation',
      description:
        'Review system design for privacy-by-design principles: data minimisation (no unnecessary fields collected), pseudonymisation (where feasible), purpose limitation (data not reused), storage limitation (retention enforced), and default privacy settings (most restrictive). Review the DPIA for high-risk processing operations.',
      category: 'Privacy',
      tags: ['gdpr', 'privacy-by-design', 'dpia-review'],
      linkedReqTags: ['gdpr', 'article-25', 'privacy-by-design', 'dpia'],
    },
    {
      templateId: 'eu:security:tst-01',
      title: 'Verify Data Breach Notification Process',
      description:
        'Simulate a personal data breach. Verify: the incident response procedure is activated, severity assessment is completed, the supervisory authority notification template is generated within 72 hours, affected individuals are notified if high risk, and the breach is recorded in the breach register with all required details.',
      category: 'Security',
      tags: ['gdpr', 'breach-notification', 'incident-test'],
      linkedReqTags: ['gdpr', 'article-33', 'article-34', 'breach-notification'],
    },
    {
      templateId: 'eu:security:tst-02',
      title: 'Verify GDPR Article 32 Security Measures',
      description:
        'Assess the security measures implemented under Article 32: verify encryption is applied to personal data at rest and in transit, access controls enforce confidentiality, backup/restore demonstrates availability resilience, and security testing is performed regularly. Document the assessment against the identified risks.',
      category: 'Security',
      tags: ['gdpr', 'article-32', 'security-assessment'],
      linkedReqTags: ['gdpr', 'article-32', 'security', 'encryption'],
    },
    {
      templateId: 'eu:accessibility:tst-01',
      title: 'Verify EN 301 549 Accessibility Conformance',
      description:
        'Perform accessibility testing against EN 301 549 / WCAG 2.1 Level AA. Use automated scanning tools (axe-core, Pa11y) and manual testing with assistive technologies (NVDA/JAWS screen reader, keyboard-only navigation). Verify conformance documentation (Accessibility Statement) is published and accurate.',
      category: 'Accessibility',
      tags: ['accessibility', 'en-301-549', 'conformance-test'],
      linkedReqTags: ['accessibility', 'en-301-549', 'wcag'],
    },
    {
      templateId: 'eu:privacy:tst-04',
      title: 'Verify Cookie Consent Implementation',
      description:
        'Test the cookie consent mechanism: verify no non-essential cookies are set before consent, verify granular category selection works, verify "reject all" is as prominent as "accept all", verify consent preference is remembered, verify withdrawal works correctly and removes non-essential cookies, and verify the consent log captures all interactions.',
      category: 'Privacy',
      tags: ['eprivacy', 'cookies', 'consent-test'],
      linkedReqTags: ['eprivacy', 'cookies', 'consent'],
    },
    {
      templateId: 'eu:privacy:tst-05',
      title: 'Verify International Data Transfer Safeguards',
      description:
        'Review all international data transfers. Verify: each transfer has an identified legal basis (adequacy decision, SCCs, BCR), Transfer Impact Assessments are documented for SCC-based transfers, supplementary measures are implemented where needed, and a register of all transfers is maintained. Test data flow mapping accuracy.',
      category: 'Privacy',
      tags: ['gdpr', 'data-transfer', 'safeguards-test'],
      linkedReqTags: ['gdpr', 'data-transfer', 'scc', 'adequacy'],
    },
    {
      templateId: 'eu:cybersecurity:tst-01',
      title: 'Verify NIS2 Incident Response Capability',
      description:
        'Review the incident response procedure for NIS2 compliance. Verify: significant incidents are reported to the CSIRT within 24 hours (early warning) and 72 hours (full notification), incident handling procedures are documented, the incident response team is identified and trained, and post-incident reviews are conducted.',
      category: 'Cybersecurity',
      tags: ['nis2', 'incident-response', 'csirt-test'],
      linkedReqTags: ['nis2', 'cybersecurity', 'incident-handling'],
    },
    {
      templateId: 'eu:privacy:tst-06',
      title: 'Verify Records of Processing Activities (ROPA)',
      description:
        'Review the ROPA per Article 30. Verify it contains all required fields for each processing activity. Verify it is current (reflects actual processing), consistent with privacy notices, and available in electronic form. Cross-check ROPA entries against system data flows to identify any undocumented processing.',
      category: 'Privacy',
      tags: ['gdpr', 'ropa', 'completeness-test'],
      linkedReqTags: ['gdpr', 'article-30', 'ropa', 'processing-records'],
    },
  ],
};

export default templateSet;
