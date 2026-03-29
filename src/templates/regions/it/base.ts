/**
 * Italy — Country-Specific Base Regulatory Template
 *
 * Italy-specific requirements covering Garante per la protezione dei dati personali,
 * AgID (Agenzia per l'Italia Digitale), SPID identity system, and CAD
 * (Codice dell'Amministrazione Digitale).
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // Garante — Italian Data Protection Authority
  // -----------------------------------------------------------------------
  {
    title: 'Garante — Italian GDPR Implementation (D.Lgs. 196/2003)',
    description:
      'Data processing shall comply with the Italian Data Protection Code (Codice Privacy, D.Lgs. 196/2003 as amended by D.Lgs. 101/2018 to align with GDPR). The Garante per la protezione dei dati personali enforces GDPR in Italy with additional national provisions including: specific rules for health data processing requiring Garante authorization, employment data processing guidelines, genetic data and biometric data protections, and the requirement for prior consultation with the Garante for high-risk processing of sensitive categories.',
    category: 'Privacy',
    tags: ['garante', 'gdpr', 'codice-privacy', 'italy'],
    riskLevel: 'critical',
    regulatoryRef: 'D.Lgs. 196/2003 (as amended by D.Lgs. 101/2018); GDPR',
  },
  {
    title: 'Garante — Cookie and Tracking Consent (Linee Guida)',
    description:
      'Websites and applications targeting Italian users shall comply with Garante Linee Guida on cookies and tracking technologies (Provvedimento n. 231/2021). Requirements include: a cookie banner providing granular consent options per category (technical, analytics, profiling), no pre-ticked checkboxes, a persistent mechanism to modify consent, no cookie wall (denial of service for refusing non-essential cookies), and retention of consent proof for at least 12 months. Analytics cookies may be used without consent only if properly anonymized.',
    category: 'Privacy',
    tags: ['garante', 'cookies', 'consent', 'tracking', 'italy'],
    riskLevel: 'medium',
    regulatoryRef: 'Garante Provvedimento n. 231/2021; ePrivacy Directive (2002/58/EC)',
  },
  {
    title: 'Garante — Employee Monitoring and Surveillance',
    description:
      'Monitoring of employee communications and activity shall comply with Garante guidelines and the Workers\' Statute (Legge 300/1970, Art. 4 as amended by Jobs Act D.Lgs. 151/2015). Remote monitoring tools require: trade union agreement or authorization from the National Labour Inspectorate (INL), a clear and documented information notice to employees per Art. 13 GDPR, proportionality assessment, and data minimization. GPS tracking and email monitoring are subject to specific Garante restrictions.',
    category: 'Employment Privacy',
    tags: ['garante', 'employee-monitoring', 'workers-statute', 'italy'],
    riskLevel: 'high',
    regulatoryRef: 'Legge 300/1970, Art. 4; D.Lgs. 151/2015; Garante Guidelines on Email and Internet Use',
  },
  // -----------------------------------------------------------------------
  // AgID — Agenzia per l'Italia Digitale
  // -----------------------------------------------------------------------
  {
    title: 'AgID — Cloud Qualification for Public Administration',
    description:
      'Cloud services used by Italian public administrations shall be qualified under the AgID Cloud Marketplace framework (now managed by ACN, Agenzia per la Cybersicurezza Nazionale). Services are classified into three levels (strategic, critical, ordinary) based on data sensitivity. Requirements include: data residency within EU/EEA for strategic and critical data, ISO 27001 and ISO 27017/27018 certifications, SLA guarantees, data portability, and annual security assessments. Service providers shall register on the AgID/ACN Cloud Marketplace.',
    category: 'Cloud Compliance',
    tags: ['agid', 'acn', 'cloud', 'public-administration', 'italy'],
    riskLevel: 'high',
    regulatoryRef: 'AgID Cloud Qualification Circulars; ACN Regulation on Cloud Services for PA (2022)',
  },
  {
    title: 'AgID — Linee Guida Accessibilita (Accessibility Guidelines)',
    description:
      'Web applications and mobile applications of Italian public administrations and their contracted suppliers shall comply with AgID Linee Guida sull\'accessibilita degli strumenti informatici, implementing the European Accessibility Act (EAA) and European Standard EN 301 549. Requirements include WCAG 2.1 Level AA compliance, annual accessibility declaration publication (Dichiarazione di Accessibilita) on the AgID platform, and a mechanism for reporting accessibility issues (Meccanismo di Feedback).',
    category: 'Accessibility',
    tags: ['agid', 'accessibility', 'wcag', 'en-301-549', 'italy'],
    riskLevel: 'medium',
    regulatoryRef: 'AgID Linee Guida Accessibilita (2020); Legge 4/2004 (Legge Stanca); D.Lgs. 82/2005 Art. 53',
  },
  // -----------------------------------------------------------------------
  // SPID — Sistema Pubblico di Identita Digitale
  // -----------------------------------------------------------------------
  {
    title: 'SPID — Digital Identity Integration',
    description:
      'Online services provided by Italian public administrations and regulated private entities shall integrate SPID (Sistema Pubblico di Identita Digitale) for user authentication. Integration requires: SAML 2.0 or OpenID Connect compliance per AgID technical specifications, support for three SPID authentication levels (Level 1: username/password, Level 2: two-factor, Level 3: smartcard/hardware token), metadata registration with AgID, and adherence to the SPID UI/UX guidelines for the login button and authentication flow.',
    category: 'Identity',
    tags: ['spid', 'digital-identity', 'saml', 'oidc', 'italy'],
    riskLevel: 'high',
    regulatoryRef: 'DPCM 24 October 2014; AgID SPID Technical Rules; D.Lgs. 82/2005 Art. 64',
  },
  // -----------------------------------------------------------------------
  // CAD — Codice dell'Amministrazione Digitale
  // -----------------------------------------------------------------------
  {
    title: 'CAD — Document Management and Digital Preservation',
    description:
      'Digital document management for public administrations shall comply with the Codice dell\'Amministrazione Digitale (D.Lgs. 82/2005, CAD). Requirements include: digital protocol registration (protocollo informatico) per DPR 445/2000, digital preservation (conservazione digitale) compliant with AgID Linee Guida (OAIS model, ISO 14721), qualified electronic seals or signatures for document authenticity, use of PEC (Posta Elettronica Certificata) or equivalent for official communications, and interoperability via PagoPA for payments.',
    category: 'Digital Government',
    tags: ['cad', 'digital-preservation', 'protocollo', 'pec', 'italy'],
    riskLevel: 'high',
    regulatoryRef: 'D.Lgs. 82/2005 (CAD); DPR 445/2000; AgID Linee Guida sulla conservazione',
  },
  {
    title: 'ACN — National Cybersecurity Perimeter (PSNC)',
    description:
      'Entities included in the National Cybersecurity Perimeter (Perimetro di Sicurezza Nazionale Cibernetica, PSNC) shall comply with DPCM 81/2021 and DL 105/2019. Requirements include: reporting cybersecurity incidents to CSIRT Italia within 6 hours (1 hour for critical incidents), performing risk assessments on ICT assets, notifying ACN before procuring ICT goods/services above prescribed thresholds, implementing security measures defined by DPCM technical annexes, and undergoing verification by CVCN (Centro di Valutazione e Certificazione Nazionale).',
    category: 'Cybersecurity',
    tags: ['acn', 'psnc', 'csirt', 'cybersecurity', 'italy'],
    riskLevel: 'critical',
    regulatoryRef: 'DL 105/2019 (converted L. 133/2019); DPCM 81/2021; DPCM 131/2020',
  },
  {
    title: 'Fatturazione Elettronica — Electronic Invoicing',
    description:
      'Business-to-business (B2B), business-to-consumer (B2C), and business-to-government (B2G) invoices in Italy shall be issued in the FatturaPA XML format and transmitted through the Sistema di Interscambio (SdI) operated by the Agenzia delle Entrate. Requirements include: compliance with FatturaPA technical specifications (format 1.2.1), qualified electronic signature or digital seal on invoices, retention for 10 years per fiscal regulations, and integration with the SdI web service or PEC channel.',
    category: 'Financial Compliance',
    tags: ['fattura-elettronica', 'sdi', 'invoicing', 'italy'],
    riskLevel: 'medium',
    regulatoryRef: 'D.Lgs. 127/2015; Provvedimento Agenzia delle Entrate 89757/2018',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify Garante GDPR Implementation',
    description:
      'Audit data processing activities against Italian GDPR implementation (D.Lgs. 196/2003 as amended). Verify that health data processing has required authorizations, employment data processing follows Garante guidelines, and prior consultation is conducted for high-risk processing. Confirm that Data Protection Officer is appointed where required.',
    category: 'Privacy',
    tags: ['garante', 'gdpr', 'compliance-test'],
    linkedReqTags: ['garante', 'gdpr', 'codice-privacy'],
  },
  {
    title: 'Verify Garante Cookie Consent Implementation',
    description:
      'Test cookie consent mechanism against Provvedimento n. 231/2021 requirements. Verify granular consent per cookie category, absence of pre-ticked checkboxes, persistent consent modification mechanism, no cookie wall behavior, and 12-month consent record retention. Confirm analytics cookies are properly anonymized if used without consent.',
    category: 'Privacy',
    tags: ['garante', 'cookies', 'consent-test'],
    linkedReqTags: ['garante', 'cookies', 'consent', 'tracking'],
  },
  {
    title: 'Verify SPID Integration Compliance',
    description:
      'Test SPID authentication integration at all three levels. Verify SAML 2.0 or OIDC compliance per AgID technical specifications. Confirm metadata is registered with AgID. Test the SPID login button UI/UX compliance. Verify proper handling of SPID attributes and session management.',
    category: 'Identity',
    tags: ['spid', 'authentication', 'integration-test'],
    linkedReqTags: ['spid', 'digital-identity', 'saml', 'oidc'],
  },
  {
    title: 'Verify AgID Cloud Qualification Requirements',
    description:
      'Confirm cloud service is listed on the AgID/ACN Cloud Marketplace. Verify data residency within EU/EEA for strategic and critical data. Check ISO 27001, 27017, and 27018 certification currency. Validate SLA guarantees, data portability capabilities, and annual security assessment completion.',
    category: 'Cloud Compliance',
    tags: ['agid', 'cloud', 'qualification-test'],
    linkedReqTags: ['agid', 'acn', 'cloud', 'public-administration'],
  },
  {
    title: 'Verify CAD Digital Preservation Compliance',
    description:
      'Test digital document management for CAD compliance. Verify protocol registration (protocollo informatico) functionality. Confirm digital preservation meets OAIS model and AgID Linee Guida. Test qualified electronic signature/seal application on documents. Verify PEC integration for official communications.',
    category: 'Digital Government',
    tags: ['cad', 'preservation', 'document-test'],
    linkedReqTags: ['cad', 'digital-preservation', 'protocollo', 'pec'],
  },
  {
    title: 'Verify ACN/PSNC Cybersecurity Incident Reporting',
    description:
      'Simulate a cybersecurity incident for PSNC-included entities. Verify incident reporting to CSIRT Italia within 6 hours (1 hour for critical). Confirm incident report contains all required fields. Test ICT procurement notification workflow to ACN. Validate security measures implementation per DPCM technical annexes.',
    category: 'Cybersecurity',
    tags: ['acn', 'psnc', 'incident-test'],
    linkedReqTags: ['acn', 'psnc', 'csirt', 'cybersecurity'],
  },
];
