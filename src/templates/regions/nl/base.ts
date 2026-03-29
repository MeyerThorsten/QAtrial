/**
 * Netherlands — Country-Specific Base Regulatory Template
 *
 * Netherlands-specific requirements covering AP (Autoriteit Persoonsgegevens),
 * DigiD authentication, DNB (De Nederlandsche Bank) oversight, and AFM
 * (Autoriteit Financiele Markten) financial conduct regulation.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // AP — Autoriteit Persoonsgegevens (Dutch DPA)
  // -----------------------------------------------------------------------
  {
    title: 'AP — Dutch GDPR Implementation (UAVG)',
    description:
      'Data processing shall comply with the Uitvoeringswet AVG (UAVG, Implementation Act GDPR) which implements GDPR in the Netherlands with additional national provisions. Key Dutch-specific rules include: BSN (Burgerservicenummer) processing restricted to entities with a legal basis (Art. 46 UAVG), specific provisions for processing of biometric data for unique identification (Art. 29 UAVG), national security number exemptions, health data processing by healthcare providers under the Wbp-successor provisions, and AP enforcement with administrative fines up to EUR 20M or 4% of turnover.',
    category: 'Privacy',
    tags: ['ap', 'uavg', 'gdpr', 'bsn', 'netherlands'],
    riskLevel: 'critical',
    regulatoryRef: 'UAVG (Stb. 2018, 144); GDPR',
  },
  {
    title: 'AP — Data Breach Notification (Meldplicht Datalekken)',
    description:
      'Data breaches shall be reported to the Autoriteit Persoonsgegevens within 72 hours of discovery through the AP\'s online notification portal. The AP requires: description of the nature of the breach, categories and approximate number of data subjects affected, likely consequences, measures taken or proposed to address the breach, and contact details of the DPO or other contact point. Breaches likely to result in a high risk to individuals\' rights and freedoms shall also be communicated to affected data subjects without undue delay.',
    category: 'Incident Management',
    tags: ['ap', 'breach-notification', 'meldplicht', 'netherlands'],
    riskLevel: 'critical',
    regulatoryRef: 'GDPR Art. 33-34; AP Guidelines on Data Breach Notification',
  },
  {
    title: 'AP — DPIA and Prior Consultation',
    description:
      'A Data Protection Impact Assessment (DPIA) shall be conducted for processing operations likely to result in a high risk to the rights and freedoms of natural persons. The AP has published a list of processing types requiring DPIA in the Netherlands, including: large-scale profiling, systematic monitoring of public areas, covert investigation, biometric data processing for identification, and combining datasets from multiple sources. If the DPIA indicates high residual risk despite mitigation, prior consultation with the AP is mandatory before commencing processing.',
    category: 'Privacy',
    tags: ['ap', 'dpia', 'prior-consultation', 'netherlands'],
    riskLevel: 'high',
    regulatoryRef: 'GDPR Art. 35-36; AP DPIA List (Stcrt. 2019, 64418)',
  },
  // -----------------------------------------------------------------------
  // DigiD — Digital Identity
  // -----------------------------------------------------------------------
  {
    title: 'DigiD — Digital Identity Authentication Integration',
    description:
      'Online services of Dutch government organizations and designated private sector entities (healthcare, pensions) requiring citizen authentication shall integrate DigiD (Digitale Identiteit). Integration requirements include: compliance with Logius DigiD technical specifications (SAML 2.0 or BSNk/Polymorfe Pseudoniemen), support for DigiD assurance levels (Basis, Midden, Substantieel, Hoog corresponding to eIDAS levels), passing the DigiD assessment framework (DigiD Norm), annual ICT security assessment (pentest) per Logius requirements, and compliance with the DigiD Koppelvlak specifications.',
    category: 'Identity',
    tags: ['digid', 'digital-identity', 'logius', 'saml', 'netherlands'],
    riskLevel: 'high',
    regulatoryRef: 'Wet digitale overheid (Wdo); Logius DigiD Koppelvlakspecificatie; DigiD Norm',
  },
  {
    title: 'DigiD — Annual ICT Security Assessment',
    description:
      'Organizations using DigiD shall undergo an annual ICT security assessment as required by Logius. The assessment covers: vulnerability scanning, penetration testing, OWASP Top 10 compliance, infrastructure security, application security, logging and monitoring, incident response, and change management. Assessment results shall be submitted to Logius via the DigiD ICT-beveiligingsassessment process. Non-compliance may result in DigiD connection suspension.',
    category: 'Security Assessment',
    tags: ['digid', 'pentest', 'ict-assessment', 'logius', 'netherlands'],
    riskLevel: 'high',
    regulatoryRef: 'Logius ICT-beveiligingsassessment DigiD; NCSC Guidelines',
  },
  // -----------------------------------------------------------------------
  // DNB — De Nederlandsche Bank
  // -----------------------------------------------------------------------
  {
    title: 'DNB — Information Security and IT Risk Management',
    description:
      'Financial institutions supervised by DNB (banks, insurers, pension funds, payment institutions) shall comply with DNB Good Practices for Information Security. Requirements include: IT risk governance integrated into enterprise risk management, information security policy approved by the management board, IT risk assessment methodology covering confidentiality, integrity, and availability, logical access management with periodic recertification, vulnerability management with timely patching, and IT outsourcing risk management per DNB Outsourcing Guidelines. DORA compliance is also required from January 2025.',
    category: 'Financial Security',
    tags: ['dnb', 'information-security', 'it-risk', 'dora', 'netherlands'],
    riskLevel: 'critical',
    regulatoryRef: 'DNB Good Practices Information Security (2019); DORA Regulation 2022/2554',
  },
  {
    title: 'DNB — TIBER-NL Threat Intelligence-Based Ethical Red Teaming',
    description:
      'Systemically important financial institutions supervised by DNB shall participate in the TIBER-NL program (Threat Intelligence-Based Ethical Red Teaming, the Dutch implementation of TIBER-EU). TIBER-NL tests involve: a threat intelligence phase producing a targeted threat intelligence report, a red team testing phase simulating real-world attack scenarios against live production systems, and a blue team assessment evaluating detection and response capabilities. Test results and remediation plans shall be shared with DNB.',
    category: 'Security Testing',
    tags: ['dnb', 'tiber-nl', 'red-team', 'threat-intelligence', 'netherlands'],
    riskLevel: 'high',
    regulatoryRef: 'DNB TIBER-NL Guide (2018); TIBER-EU Framework (ECB)',
  },
  // -----------------------------------------------------------------------
  // AFM — Autoriteit Financiele Markten
  // -----------------------------------------------------------------------
  {
    title: 'AFM — Algorithmic Trading and IT Systems Requirements',
    description:
      'Investment firms engaging in algorithmic trading under AFM supervision shall comply with MiFID II/MiFIR requirements implemented in the Wet op het financieel toezicht (Wft). Requirements include: algorithmic trading registration with AFM, annual self-assessment of trading algorithms, kill functionality for immediate order cancellation, pre-trade risk controls (price collars, maximum order value, maximum position limits), business continuity arrangements, and record retention of all orders (including cancelled/modified) for at least 5 years in a format accessible to AFM.',
    category: 'Financial Compliance',
    tags: ['afm', 'algorithmic-trading', 'mifid', 'wft', 'netherlands'],
    riskLevel: 'high',
    regulatoryRef: 'Wft; MiFID II Directive 2014/65/EU; RTS 6 (Algorithmic Trading)',
  },
  {
    title: 'BIO — Baseline Informatiebeveiliging Overheid',
    description:
      'Information systems of Dutch government organizations shall comply with the Baseline Informatiebeveiliging Overheid (BIO), which is the government-wide information security framework based on ISO 27001/27002. BIO applies to all government layers (Rijk, provinces, municipalities, water boards). Requirements include: risk-based classification of information (BBN levels 1-3), implementation of mandatory BIO controls per classification, annual ENSIA self-assessment, and for BBN3 systems, independent third-party audit. Results are reported via the ENSIA platform.',
    category: 'Information Security',
    tags: ['bio', 'government-security', 'ensia', 'iso-27001', 'netherlands'],
    riskLevel: 'high',
    regulatoryRef: 'BIO (2020); ENSIA Framework; Besluit informatiebeveiliging gegevensverwerking',
  },
  {
    title: 'Wbni — Network and Information Systems Security Act',
    description:
      'Essential service providers and digital service providers as defined by the Wet beveiliging netwerk- en informatiesystemen (Wbni, implementing NIS/NIS2 Directive) shall: take appropriate technical and organizational measures to manage cybersecurity risks, report significant incidents to the NCSC (Nationaal Cyber Security Centrum) or relevant CSIRT without delay and in any case within 24 hours for early warning and 72 hours for full notification, and cooperate with NCSC during incidents. Sector-specific obligations apply for energy, transport, finance, health, and digital infrastructure.',
    category: 'Cybersecurity',
    tags: ['wbni', 'nis2', 'ncsc', 'cybersecurity', 'netherlands'],
    riskLevel: 'critical',
    regulatoryRef: 'Wbni (Stb. 2018, 387); NIS2 Directive 2022/2555',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify UAVG/GDPR Dutch-Specific Compliance',
    description:
      'Audit data processing against UAVG requirements. Verify that BSN processing has a valid legal basis. Confirm biometric data processing complies with Art. 29 UAVG restrictions. Test that the breach notification workflow routes to the AP within 72 hours. Verify DPO appointment and registration with AP.',
    category: 'Privacy',
    tags: ['ap', 'uavg', 'compliance-test'],
    linkedReqTags: ['ap', 'uavg', 'gdpr', 'bsn'],
  },
  {
    title: 'Verify AP Data Breach Notification Process',
    description:
      'Simulate a data breach and verify the notification workflow triggers within 72 hours. Confirm the AP notification contains all required fields (nature, categories, numbers, consequences, measures, DPO contact). For high-risk breaches, verify that data subject notification is generated. Test the 72-hour SLA tracking mechanism.',
    category: 'Incident Management',
    tags: ['ap', 'breach', 'notification-test'],
    linkedReqTags: ['ap', 'breach-notification', 'meldplicht'],
  },
  {
    title: 'Verify DigiD Integration and ICT Assessment',
    description:
      'Test DigiD authentication integration at applicable assurance levels (Basis through Hoog). Verify SAML 2.0 compliance per Logius specifications. Confirm BSNk/PP handling is correct. Verify that the annual ICT security assessment has been completed and submitted to Logius. Test OWASP Top 10 vulnerabilities are mitigated.',
    category: 'Identity',
    tags: ['digid', 'authentication', 'assessment-test'],
    linkedReqTags: ['digid', 'digital-identity', 'logius', 'saml'],
  },
  {
    title: 'Verify DNB Information Security Good Practices',
    description:
      'Audit IT risk governance and information security controls against DNB Good Practices. Verify management board-approved security policy, IT risk assessment coverage, logical access management with recertification evidence, vulnerability management with patching SLAs, and IT outsourcing risk management. Confirm DORA alignment roadmap.',
    category: 'Financial Security',
    tags: ['dnb', 'security', 'good-practices-test'],
    linkedReqTags: ['dnb', 'information-security', 'it-risk', 'dora'],
  },
  {
    title: 'Verify BIO Government Security Baseline',
    description:
      'For government organizations, audit information security against BIO controls at the applicable BBN level. Verify risk-based classification documentation. Confirm mandatory BIO controls are implemented. Test ENSIA self-assessment completion. For BBN3 systems, verify independent third-party audit report is current.',
    category: 'Information Security',
    tags: ['bio', 'government', 'baseline-test'],
    linkedReqTags: ['bio', 'government-security', 'ensia', 'iso-27001'],
  },
  {
    title: 'Verify TIBER-NL Red Team Testing Program',
    description:
      'For systemically important financial institutions, verify TIBER-NL program participation. Confirm threat intelligence report was produced by an accredited provider. Verify red team test was conducted against live production systems. Assess blue team detection and response capabilities. Confirm remediation plan was shared with DNB.',
    category: 'Security Testing',
    tags: ['dnb', 'tiber-nl', 'red-team-test'],
    linkedReqTags: ['dnb', 'tiber-nl', 'red-team', 'threat-intelligence'],
  },
  {
    title: 'Verify Wbni/NIS2 Incident Reporting to NCSC',
    description:
      'For essential and digital service providers, simulate a significant cybersecurity incident. Verify early warning to NCSC within 24 hours and full notification within 72 hours. Confirm incident reports meet Wbni requirements. Test cooperation capabilities with NCSC during incident response.',
    category: 'Cybersecurity',
    tags: ['wbni', 'ncsc', 'incident-test'],
    linkedReqTags: ['wbni', 'nis2', 'ncsc', 'cybersecurity'],
  },
];
