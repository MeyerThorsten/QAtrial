/**
 * France — Country-Specific Base Regulatory Template
 *
 * France-specific requirements that layer on top of the EU base template.
 * Covers CNIL guidance, ANSSI security requirements, RGAA accessibility,
 * and NF certification standards.
 */

import type { CountryTemplateSet } from '../../types';

export const templateSet: CountryTemplateSet = {
  countryCode: 'FR',
  requirements: [
    // -----------------------------------------------------------------------
    // CNIL (Commission Nationale de l'Informatique et des Libertés)
    // -----------------------------------------------------------------------
    {
      title: 'CNIL Data Protection Compliance',
      description:
        'Processing of personal data in France shall comply with CNIL guidelines supplementing the GDPR. Key CNIL-specific requirements include: compliance with CNIL deliberations and guidelines, use of CNIL reference frameworks (référentiels) for specific sectors, appointment of a DPO (Délégué à la protection des données) where required, CNIL registration/notification where mandated, and adherence to CNIL cookie consent guidelines (no cookie wall, equal reject/accept buttons).',
      category: 'Data Protection',
      tags: ['cnil', 'data-protection', 'dpo', 'referentiel'],
      riskLevel: 'critical',
      regulatoryRef: 'Loi Informatique et Libertés (modified); CNIL Guidelines',
    },
    {
      title: 'CNIL Cookie and Tracker Guidelines',
      description:
        'Cookie and tracker implementation shall comply with CNIL guidelines on cookies and other trackers (délibération n°2020-091). Requirements include: no cookie wall (access to service must not be conditional on consent), "Continue without accepting" option equally visible as accept, consent must be specific per purpose, consent records must be retained, consent must be refreshed every 6 months maximum, and no cookie shall be deposited before valid consent.',
      category: 'Privacy',
      tags: ['cnil', 'cookies', 'trackers', 'consent-refresh'],
      riskLevel: 'medium',
      regulatoryRef: 'CNIL Délibération n°2020-091; Article 82 Loi Informatique et Libertés',
    },
    {
      title: 'CNIL Security Recommendations',
      description:
        'Data security measures shall align with CNIL security recommendations (Guide de la sécurité des données personnelles). The guide covers: user awareness, authentication management, access rights management, tracing and log management, workstation security, mobile device security, network protection, server security, subcontracting, archiving, software development, encryption, and physical security.',
      category: 'Security',
      tags: ['cnil', 'security-guide', 'data-security', 'encryption'],
      riskLevel: 'high',
      regulatoryRef: 'CNIL Guide de la sécurité des données personnelles (2024)',
    },

    // -----------------------------------------------------------------------
    // ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information)
    // -----------------------------------------------------------------------
    {
      title: 'ANSSI Cybersecurity Requirements',
      description:
        'Information systems shall align with ANSSI guidelines and, where applicable, achieve SecNumCloud or ANSSI CSPN certification. For operators of essential services (OES) and operators of vital importance (OIV), compliance with ANSSI rules is mandatory. Requirements include: information system mapping, access control, system hardening, security monitoring, incident detection and response, and regular security audits per the ANSSI guide d\'hygiène informatique.',
      category: 'Cybersecurity',
      tags: ['anssi', 'secnumcloud', 'oiv', 'cyber-hygiene'],
      riskLevel: 'high',
      regulatoryRef: 'ANSSI Guide d\'hygiène informatique; LPM (Loi de Programmation Militaire)',
    },
    {
      title: 'ANSSI SecNumCloud Qualification for Cloud Services',
      description:
        'Cloud services processing sensitive data for French public entities or OIV shall seek SecNumCloud qualification from ANSSI. SecNumCloud requirements include: data hosting within the EU, governance by EU-based entities (protection against extraterritorial laws), ISO 27001 certification, comprehensive security controls, incident response, and business continuity. The qualification covers IaaS, PaaS, and SaaS service models.',
      category: 'Cloud Security',
      tags: ['anssi', 'secnumcloud', 'cloud-qualification', 'data-sovereignty'],
      riskLevel: 'high',
      regulatoryRef: 'ANSSI SecNumCloud Référentiel v3.2',
    },

    // -----------------------------------------------------------------------
    // RGAA (Référentiel Général d'Amélioration de l'Accessibilité)
    // -----------------------------------------------------------------------
    {
      title: 'RGAA Accessibility Compliance',
      description:
        'Digital services shall conform to the RGAA (Référentiel Général d\'Amélioration de l\'Accessibilité) version 4.1, which operationalizes EN 301 549 / WCAG 2.1 Level AA for France. Requirements include: publishing an accessibility statement (déclaration d\'accessibilité), achieving and maintaining the target compliance rate, establishing a multi-year accessibility improvement plan (schéma pluriannuel), and providing a contact mechanism for accessibility issues.',
      category: 'Accessibility',
      tags: ['rgaa', 'accessibility', 'wcag', 'declaration-accessibilite'],
      riskLevel: 'medium',
      regulatoryRef: 'RGAA 4.1; Article 47 Loi n°2005-102; Décret n°2019-768',
    },

    // -----------------------------------------------------------------------
    // NF Certification
    // -----------------------------------------------------------------------
    {
      title: 'NF Certification and AFNOR Standards',
      description:
        'Where applicable, products and services shall comply with NF standards (normes françaises) managed by AFNOR. For software and IT services, relevant standards include: NF EN ISO/IEC 27001 for information security, NF Logiciel for software quality, and sector-specific NF marks. NF certification provides market confidence and may be required for public sector procurement in France.',
      category: 'Standards',
      tags: ['nf', 'afnor', 'certification', 'french-standards'],
      riskLevel: 'medium',
      regulatoryRef: 'AFNOR NF Standards; Code de la consommation',
    },

    // -----------------------------------------------------------------------
    // Hébergement de Données de Santé (HDS)
    // -----------------------------------------------------------------------
    {
      title: 'HDS — Health Data Hosting Certification',
      description:
        'If the system hosts personal health data (données de santé) for French healthcare, the hosting provider must hold HDS (Hébergeur de Données de Santé) certification per Article L.1111-8 of the Code de la santé publique. HDS certification requires ISO 27001 certification plus specific health data protection controls covering: physical security, data management, backup/recovery, confidentiality, and contractual obligations.',
      category: 'Healthcare',
      tags: ['hds', 'health-data', 'hosting-certification', 'iso-27001'],
      riskLevel: 'critical',
      regulatoryRef: 'Article L.1111-8 CSP; Décret n°2018-137',
    },

    // -----------------------------------------------------------------------
    // RGS (Référentiel Général de Sécurité)
    // -----------------------------------------------------------------------
    {
      title: 'RGS — General Security Framework for Public Services',
      description:
        'Information systems providing online public services shall comply with the RGS (Référentiel Général de Sécurité). Requirements include: security risk analysis, implementation of security controls proportionate to risk, use of qualified security products and services (per ANSSI qualification), electronic certificate management, and periodic security audits. The RGS defines three security levels based on impact.',
      category: 'Public Sector Security',
      tags: ['rgs', 'public-services', 'security-framework', 'anssi-qualification'],
      riskLevel: 'high',
      regulatoryRef: 'RGS v2.0; Ordonnance n°2005-1516',
    },
  ],

  tests: [
    {
      title: 'Verify CNIL Cookie Compliance',
      description:
        'Test cookie implementation per CNIL guidelines. Verify: no cookies are deposited before consent, no cookie wall exists, the "Continue without accepting" option is as visible as "Accept all", consent is granular per purpose, consent is stored with timestamp, consent refresh occurs within 6 months, and the cookie policy is written in French and accessible.',
      category: 'Privacy',
      tags: ['cnil', 'cookies', 'compliance-test'],
      linkedReqTags: ['cnil', 'cookies', 'trackers'],
    },
    {
      title: 'Verify CNIL Security Recommendations',
      description:
        'Assess security controls against the CNIL security guide. Verify: user authentication meets CNIL recommendations (password length/complexity), access rights follow least-privilege principle, logging captures security events and is retained appropriately, encryption is applied per CNIL guidance, and a data breach response procedure enables notification within 72 hours.',
      category: 'Security',
      tags: ['cnil', 'security', 'assessment-test'],
      linkedReqTags: ['cnil', 'security-guide', 'data-security'],
    },
    {
      title: 'Verify ANSSI Cyber Hygiene Controls',
      description:
        'Assess the system against the ANSSI guide d\'hygiène informatique (42 measures). Verify a sample covering: system inventory is maintained, accounts are managed with least privilege, systems are hardened per ANSSI guidelines, security updates are applied promptly, network segmentation is implemented, and incident detection capabilities are operational.',
      category: 'Cybersecurity',
      tags: ['anssi', 'cyber-hygiene', 'controls-test'],
      linkedReqTags: ['anssi', 'secnumcloud', 'oiv'],
    },
    {
      title: 'Verify RGAA Accessibility Compliance',
      description:
        'Perform accessibility testing per RGAA 4.1 methodology. Test a representative sample of pages against the 106 RGAA criteria. Verify: the accessibility statement (déclaration d\'accessibilité) is published with required elements, compliance rate is calculated correctly, a multi-year improvement plan exists, and a feedback mechanism for accessibility issues is functional and monitored.',
      category: 'Accessibility',
      tags: ['rgaa', 'accessibility', 'audit-test'],
      linkedReqTags: ['rgaa', 'accessibility', 'declaration-accessibilite'],
    },
    {
      title: 'Verify HDS Certification for Health Data',
      description:
        'If hosting health data, verify: the hosting provider holds current HDS certification, the certification scope covers the services used, ISO 27001 certification is maintained, health data protection controls are implemented per the HDS reference framework, and the hosting contract includes all required HDS clauses.',
      category: 'Healthcare',
      tags: ['hds', 'health-data', 'certification-test'],
      linkedReqTags: ['hds', 'health-data', 'hosting-certification'],
    },
    {
      title: 'Verify SecNumCloud Qualification',
      description:
        'If using cloud services for sensitive data, verify: the cloud provider holds current ANSSI SecNumCloud qualification, the qualification scope covers the service model used (IaaS/PaaS/SaaS), data is hosted within the EU, governance structure protects against extraterritorial access, and complementary customer controls are implemented.',
      category: 'Cloud Security',
      tags: ['secnumcloud', 'cloud', 'qualification-test'],
      linkedReqTags: ['anssi', 'secnumcloud', 'cloud-qualification'],
    },
    {
      title: 'Verify RGS Compliance for Public Services',
      description:
        'If providing online public services, verify: security risk analysis is documented, security controls are proportionate to the identified risk level, qualified security products are used where required, electronic certificates comply with RGS requirements, and periodic security audits are conducted and findings are remediated.',
      category: 'Public Sector Security',
      tags: ['rgs', 'public-services', 'compliance-test'],
      linkedReqTags: ['rgs', 'public-services', 'security-framework'],
    },
  ],
};

export default templateSet;
