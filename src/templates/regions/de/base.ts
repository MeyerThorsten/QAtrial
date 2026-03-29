/**
 * Germany — Country-Specific Base Regulatory Template
 *
 * Germany-specific requirements that layer on top of the EU base template.
 * Covers BDSG, BSI IT-Grundschutz, BITV 2.0, Telemediengesetz,
 * and IT-Sicherheitsgesetz 2.0.
 */

import type { CountryTemplateSet } from '../../types';

export const templateSet: CountryTemplateSet = {
  countryCode: 'DE',
  requirements: [
    // -----------------------------------------------------------------------
    // BSI IT-Grundschutz
    // -----------------------------------------------------------------------
    {
      title: 'BSI IT-Grundschutz Compliance',
      description:
        'The information security management system shall be aligned with the BSI IT-Grundschutz methodology. This includes: structural analysis of the information domain (Strukturanalyse), protection needs assessment (Schutzbedarfsfeststellung), modelling per IT-Grundschutz Compendium modules (Modellierung), IT-Grundschutz check (Soll-Ist-Vergleich), and supplementary security analysis for high-protection-needs components. BSI certification or attestation may be required for critical infrastructure.',
      category: 'Information Security',
      tags: ['bsi', 'it-grundschutz', 'isms', 'schutzbedarfsfeststellung'],
      riskLevel: 'high',
      regulatoryRef: 'BSI IT-Grundschutz Compendium (Edition 2023); BSI Standard 200-1/200-2/200-3',
    },
    {
      title: 'BSI IT-Grundschutz — Business Continuity Module',
      description:
        'Business continuity management shall be implemented per BSI Standard 200-4 (BCM). Requirements include: business impact analysis (BIA), identification of time-critical business processes, definition of maximum tolerable downtime (MTA), business continuity strategies, emergency plans, and regular exercises. Documentation shall follow the BSI template structure.',
      category: 'Business Continuity',
      tags: ['bsi', 'bcm', 'business-continuity', 'bsi-200-4'],
      riskLevel: 'high',
      regulatoryRef: 'BSI Standard 200-4 (Business Continuity Management)',
    },

    // -----------------------------------------------------------------------
    // BDSG (Bundesdatenschutzgesetz)
    // -----------------------------------------------------------------------
    {
      title: 'BDSG — Federal Data Protection Act Compliance',
      description:
        'Processing of personal data shall additionally comply with the BDSG (Bundesdatenschutzgesetz) where it supplements or specifies GDPR provisions for Germany. Key BDSG-specific requirements include: appointment of a Data Protection Officer (Datenschutzbeauftragte/r) when 20+ persons are regularly engaged in automated processing (Section 38), specific rules for employment data processing (Section 26), video surveillance limitations (Section 4), and scoring/profiling restrictions (Section 31).',
      category: 'Data Protection',
      tags: ['bdsg', 'datenschutz', 'dpo', 'employment-data'],
      riskLevel: 'high',
      regulatoryRef: 'BDSG Sections 4, 22, 26, 31, 38',
    },
    {
      title: 'BDSG Section 22 — Processing of Special Categories',
      description:
        'Processing of special categories of personal data (health, biometric, genetic data) under BDSG Section 22 requires appropriate and specific safeguards including: technical-organizational measures per Art. 32 GDPR, access restrictions to authorized personnel, pseudonymisation, encryption, logging of access, and regular review of necessity for continued processing.',
      category: 'Data Protection',
      tags: ['bdsg', 'special-categories', 'health-data', 'safeguards'],
      riskLevel: 'critical',
      regulatoryRef: 'BDSG Section 22; GDPR Article 9',
    },

    // -----------------------------------------------------------------------
    // BITV 2.0 (Barrierefreie-Informationstechnik-Verordnung)
    // -----------------------------------------------------------------------
    {
      title: 'BITV 2.0 — Accessible Information Technology',
      description:
        'Web applications and mobile applications of public sector bodies and, under BFSG (Barrierefreiheitsstärkungsgesetz), private sector entities providing consumer services shall conform to BITV 2.0. Requirements align with EN 301 549 / WCAG 2.1 Level AA with additional German-specific provisions: German Sign Language (DGS) and Easy Language (Leichte Sprache) content for key information, and an accessibility feedback mechanism (Barrierefreiheitserklärung) per Section 12b BGG.',
      category: 'Accessibility',
      tags: ['bitv-2', 'accessibility', 'barrierefreiheit', 'bfsg', 'dgs'],
      riskLevel: 'medium',
      regulatoryRef: 'BITV 2.0; BFSG (BGBl. I 2021 S. 2970); Section 12b BGG',
    },

    // -----------------------------------------------------------------------
    // TTDSG / TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz)
    // -----------------------------------------------------------------------
    {
      title: 'TDDDG — Telecommunications and Digital Services Data Protection',
      description:
        'The system shall comply with the TDDDG (formerly TTDSG/TMG) for digital services. Key requirements include: strict consent requirement for storing or accessing information on terminal equipment (Section 25 — German implementation of ePrivacy), protection of telecommunications metadata, information obligations for digital services, and specific rules for usage data processing. Cookie consent implementation must follow the German interpretation emphasizing genuine choice.',
      category: 'Privacy',
      tags: ['tdddg', 'ttdsg', 'tmg', 'telemedien', 'cookie-consent'],
      riskLevel: 'medium',
      regulatoryRef: 'TDDDG (BGBl. I 2021 S. 1982) Section 25',
    },

    // -----------------------------------------------------------------------
    // IT-Sicherheitsgesetz 2.0
    // -----------------------------------------------------------------------
    {
      title: 'IT-Sicherheitsgesetz 2.0 — Critical Infrastructure',
      description:
        'If the system supports critical infrastructure (KRITIS) as defined by BSI-KritisV, compliance with the IT-Sicherheitsgesetz 2.0 is required. Obligations include: implementation of state-of-the-art security measures, registration with BSI, reporting of significant IT security incidents within defined timelines (initially within 24 hours), use of intrusion detection systems, and submission of evidence of compliance (Nachweis) every two years.',
      category: 'Cybersecurity',
      tags: ['it-sig-2', 'kritis', 'bsi', 'incident-reporting', 'ids'],
      riskLevel: 'high',
      regulatoryRef: 'IT-Sicherheitsgesetz 2.0 (ITSiG 2.0); BSI-KritisV',
    },
    {
      title: 'IT-Sicherheitsgesetz 2.0 — Attestation of Compliance',
      description:
        'KRITIS operators shall provide attestation of compliance (Nachweis) to the BSI every two years demonstrating that appropriate organisational and technical precautions have been taken. Attestation may be provided through: security audits, inspections, or certifications (e.g., ISO 27001 on the basis of IT-Grundschutz). Identified deficiencies shall have documented remediation plans.',
      category: 'Cybersecurity',
      tags: ['it-sig-2', 'attestation', 'nachweis', 'bsi-certification'],
      riskLevel: 'high',
      regulatoryRef: 'BSI Act (BSIG) Section 8a',
    },

    // -----------------------------------------------------------------------
    // GoBD (Grundsätze ordnungsmäßiger Buchführung und Dokumentation)
    // -----------------------------------------------------------------------
    {
      title: 'GoBD — Proper Bookkeeping in Digital Systems',
      description:
        'If the system manages tax-relevant data, it shall comply with GoBD requirements: traceability and verifiability (Nachvollziehbarkeit und Nachprüfbarkeit), completeness (Vollständigkeit), correctness (Richtigkeit), timely recording (zeitgerechte Buchung), orderly presentation (Ordnung), and immutability (Unveränderbarkeit). A procedural documentation (Verfahrensdokumentation) describing the system shall be maintained.',
      category: 'Compliance',
      tags: ['gobd', 'bookkeeping', 'verfahrensdokumentation', 'immutability'],
      riskLevel: 'medium',
      regulatoryRef: 'GoBD (BMF-Schreiben vom 28.11.2019)',
    },

    // -----------------------------------------------------------------------
    // Data Residency
    // -----------------------------------------------------------------------
    {
      title: 'German Data Residency Preferences',
      description:
        'While GDPR allows EEA-wide processing, German regulatory authorities and customers strongly prefer data residency within Germany or, at minimum, the EU/EEA. For KRITIS and public sector deployments, data processing and storage shall occur in Germany. Cloud service providers shall be assessed for C5 attestation (Cloud Computing Compliance Criteria Catalogue).',
      category: 'Data Governance',
      tags: ['data-residency', 'c5', 'cloud', 'germany'],
      riskLevel: 'medium',
      regulatoryRef: 'BSI C5:2020; BSIG Section 8a',
    },
  ],

  tests: [
    {
      title: 'Verify BSI IT-Grundschutz Alignment',
      description:
        'Review the ISMS documentation against BSI IT-Grundschutz requirements. Verify: structural analysis identifies all information assets, protection needs assessment is complete and current, applicable IT-Grundschutz Compendium modules are modelled, a Soll-Ist-Vergleich has been performed, and identified gaps have documented treatment plans. For high-protection components, verify supplementary risk analysis is documented.',
      category: 'Information Security',
      tags: ['bsi', 'it-grundschutz', 'alignment-test'],
      linkedReqTags: ['bsi', 'it-grundschutz', 'isms'],
    },
    {
      title: 'Verify BDSG Data Protection Officer Appointment',
      description:
        'Verify that a Data Protection Officer (Datenschutzbeauftragte/r) is formally appointed in writing where required under BDSG Section 38. Verify the DPO has adequate expertise, is properly registered with the supervisory authority (Landesdatenschutzbeauftragte/r), has no conflict of interest, and is involved in all relevant data protection matters.',
      category: 'Data Protection',
      tags: ['bdsg', 'dpo', 'appointment-test'],
      linkedReqTags: ['bdsg', 'datenschutz', 'dpo'],
    },
    {
      title: 'Verify BITV 2.0 Accessibility Compliance',
      description:
        'Perform accessibility testing per BITV 2.0 / EN 301 549. In addition to standard WCAG 2.1 Level AA testing, verify: German Sign Language (DGS) videos are provided for key content (where required), Easy Language (Leichte Sprache) alternatives are available, the accessibility statement (Erklärung zur Barrierefreiheit) is published and contains the required elements per Section 12b BGG, and a feedback mechanism is operational.',
      category: 'Accessibility',
      tags: ['bitv-2', 'accessibility', 'dgs-test'],
      linkedReqTags: ['bitv-2', 'accessibility', 'barrierefreiheit'],
    },
    {
      title: 'Verify TDDDG Cookie Consent Implementation',
      description:
        'Test the cookie consent implementation against German regulatory expectations. Verify: consent is obtained before any non-essential tracking (Section 25 TDDDG), the "Reject" option is equally prominent as "Accept", no dark patterns are used, consent granularity allows individual category selection, and the consent mechanism reflects current guidance from German DPAs (Datenschutzkonferenz Orientierungshilfe).',
      category: 'Privacy',
      tags: ['tdddg', 'cookie-consent', 'implementation-test'],
      linkedReqTags: ['tdddg', 'ttdsg', 'cookie-consent'],
    },
    {
      title: 'Verify IT-Sicherheitsgesetz 2.0 Incident Reporting',
      description:
        'Review the incident reporting procedure for KRITIS compliance. Verify: significant IT security incidents are classified per BSI criteria, initial notification to BSI can be made within 24 hours, the reporting template captures all required information, incident response team roles are defined, and BSI contact channels are current and tested.',
      category: 'Cybersecurity',
      tags: ['it-sig-2', 'incident-reporting', 'process-test'],
      linkedReqTags: ['it-sig-2', 'kritis', 'incident-reporting'],
    },
    {
      title: 'Verify BSI C5 Cloud Compliance',
      description:
        'If cloud services are used, verify the provider holds a current BSI C5 attestation (Type 2). Review the C5 report for: scope coverage of the services used, complementary customer controls (CCC) that must be implemented, any qualified findings or exceptions, and the attestation validity period. Verify data residency is within Germany/EU as required.',
      category: 'Cloud Security',
      tags: ['c5', 'cloud', 'attestation-test'],
      linkedReqTags: ['data-residency', 'c5', 'cloud'],
    },
    {
      title: 'Verify GoBD Procedural Documentation',
      description:
        'Review the GoBD Verfahrensdokumentation for completeness. Verify it describes: system purpose and scope, data entry procedures, processing rules, storage and archiving, access controls, change management, and internal controls. Verify the system enforces immutability of tax-relevant records and maintains a complete audit trail per GoBD requirements.',
      category: 'Compliance',
      tags: ['gobd', 'verfahrensdokumentation', 'review-test'],
      linkedReqTags: ['gobd', 'bookkeeping', 'verfahrensdokumentation'],
    },
  ],
};

export default templateSet;
