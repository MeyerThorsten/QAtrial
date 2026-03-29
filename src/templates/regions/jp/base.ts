/**
 * Japan — Country-Specific Base Regulatory Template
 *
 * Japan-specific requirements covering APPI (Act on Protection of Personal
 * Information), METI cybersecurity framework, JIS standards, and TELEC
 * certification.
 */

import type { CountryTemplateSet } from '../../types';

export const templateSet: CountryTemplateSet = {
  countryCode: 'JP',
  requirements: [
    // -----------------------------------------------------------------------
    // APPI (Act on Protection of Personal Information)
    // -----------------------------------------------------------------------
    {
      title: 'APPI — Act on Protection of Personal Information',
      description:
        'Processing of personal information in Japan shall comply with the APPI (as amended 2022). Key requirements include: specifying the purpose of use and limiting processing to that purpose, proper acquisition of personal information (no deceptive means), consent for handling sensitive personal information (medical, racial, religious data), data security measures, third-party provision restrictions and record-keeping, and responding to data subject requests (disclosure, correction, suspension of use).',
      category: 'Data Protection',
      tags: ['appi', 'personal-information', 'purpose-limitation', 'consent'],
      riskLevel: 'critical',
      regulatoryRef: 'APPI (Act No. 57 of 2003, amended 2022); PPC Guidelines',
    },
    {
      title: 'APPI — Cross-Border Data Transfer',
      description:
        'Transfer of personal data outside Japan shall comply with APPI Article 28. Transfer is permitted to: countries recognized by the PPC as having equivalent data protection (EU, UK), entities with a system conforming to APPI standards, or with the data subject\'s consent after providing information about the recipient country\'s system. Records of cross-border transfers shall be maintained for three years.',
      category: 'Data Protection',
      tags: ['appi', 'cross-border', 'data-transfer', 'ppc'],
      riskLevel: 'high',
      regulatoryRef: 'APPI Article 28; PPC Cross-Border Transfer Guidelines',
    },
    {
      title: 'APPI — Pseudonymously Processed Information',
      description:
        'Pseudonymously processed information (kaiming kako joho) and anonymously processed information (tokumei kako joho) shall be handled per APPI requirements. Pseudonymous processing requires: documented processing methods, security measures for identification codes, prohibition of re-identification, and internal use limitation. Anonymous processing requires: irreversible de-identification, public announcement of information types, and prohibition of re-identification.',
      category: 'Data Protection',
      tags: ['appi', 'pseudonymization', 'anonymization', 'de-identification'],
      riskLevel: 'medium',
      regulatoryRef: 'APPI Articles 41-43 (pseudonymous); Articles 43-46 (anonymous)',
    },

    // -----------------------------------------------------------------------
    // METI Cybersecurity
    // -----------------------------------------------------------------------
    {
      title: 'METI Cybersecurity Management Guidelines',
      description:
        'The organisation shall align its cybersecurity management with METI (Ministry of Economy, Trade and Industry) Cybersecurity Management Guidelines. Senior management shall demonstrate leadership in cybersecurity, a cybersecurity policy shall be established, risk management processes shall be implemented, supply chain cybersecurity shall be addressed, and cybersecurity measures shall be continuously improved. Disclosure of cybersecurity initiatives to stakeholders is encouraged.',
      category: 'Cybersecurity',
      tags: ['meti', 'cybersecurity-management', 'risk-management', 'supply-chain'],
      riskLevel: 'high',
      regulatoryRef: 'METI Cybersecurity Management Guidelines v3.0',
    },
    {
      title: 'ISMAP — Information System Security Management and Assessment Program',
      description:
        'Cloud services used by Japanese government agencies shall be registered on the ISMAP (Information System Security Management and Assessment Program) or ISMAP-LIU (Low-Impact Use) list. ISMAP assessment covers security controls based on international standards (ISO 27001, ISO 27017, SOC 2) adapted for the Japanese government context. Registration requires independent third-party assessment.',
      category: 'Cloud Security',
      tags: ['ismap', 'cloud-security', 'government', 'assessment'],
      riskLevel: 'high',
      regulatoryRef: 'ISMAP Registration Requirements; NISC Cloud Security Guidelines',
    },

    // -----------------------------------------------------------------------
    // JIS Standards
    // -----------------------------------------------------------------------
    {
      title: 'JIS (Japanese Industrial Standards) Compliance',
      description:
        'Products and systems sold or deployed in Japan shall comply with applicable JIS standards. Key JIS standards include: JIS Q 27001 (ISMS - identical to ISO 27001), JIS Q 15001 (Personal Information Protection Management System - Privacy Mark), JIS X 8341-3 (Web accessibility guidelines - aligned with WCAG 2.1), and JIS T series for medical devices. JIS mark certification may be required for certain product categories.',
      category: 'Standards',
      tags: ['jis', 'standards', 'jis-q-27001', 'jis-q-15001'],
      riskLevel: 'medium',
      regulatoryRef: 'JIS Q 27001:2023; JIS Q 15001:2023; Industrial Standardization Act',
    },
    {
      title: 'Privacy Mark (P-Mark) Certification',
      description:
        'The organisation should consider obtaining Privacy Mark (P-Mark) certification per JIS Q 15001, which is widely recognized in Japan as demonstrating proper personal information handling. Requirements go beyond APPI to include: a personal information protection management system (PMS), documented policies and procedures, regular internal audits, management review, employee training, and continuous improvement. Certification is renewed every two years.',
      category: 'Data Protection',
      tags: ['privacy-mark', 'jis-q-15001', 'pms', 'certification'],
      riskLevel: 'medium',
      regulatoryRef: 'JIS Q 15001:2023; JIPDEC Privacy Mark System',
    },

    // -----------------------------------------------------------------------
    // TELEC Certification
    // -----------------------------------------------------------------------
    {
      title: 'TELEC / MIC Radio Equipment Certification',
      description:
        'Radio equipment and telecommunications terminal equipment used in Japan shall obtain certification from TELEC (Telecom Engineering Center) or other registered certification body, or a technical regulation conformity certification from MIC (Ministry of Internal Affairs and Communications). Certification types include: Technical Conformity Mark (giteki mark) for radio equipment and Technical Conditions Compliance Mark for terminal equipment.',
      category: 'Telecommunications',
      tags: ['telec', 'mic', 'giteki', 'radio-certification'],
      riskLevel: 'high',
      regulatoryRef: 'Radio Act (Denpa-hō); Telecommunications Business Act',
    },

    // -----------------------------------------------------------------------
    // Japan Accessibility
    // -----------------------------------------------------------------------
    {
      title: 'JIS X 8341-3 Web Accessibility',
      description:
        'Web content and web applications shall conform to JIS X 8341-3:2016 (based on WCAG 2.0/2.1). For public sector services, conformance level AA is required per the "Guidelines for Ensuring Accessibility of Public Sector Websites and Apps." Testing shall follow the JIS X 8341-3 assessment methodology, and an accessibility policy including a target conformance level and achievement deadline shall be published.',
      category: 'Accessibility',
      tags: ['jis-x-8341', 'accessibility', 'wcag', 'public-sector'],
      riskLevel: 'medium',
      regulatoryRef: 'JIS X 8341-3:2016; Digital Agency Accessibility Guidelines',
    },

    // -----------------------------------------------------------------------
    // Act on Security of Critical Infrastructure
    // -----------------------------------------------------------------------
    {
      title: 'Critical Infrastructure Security (NISC Guidelines)',
      description:
        'If the system supports critical infrastructure sectors (information/communications, finance, aviation, rail, electricity, gas, government services, medical, water, logistics, chemicals, credit, petroleum), it shall comply with NISC (National center of Incident readiness and Strategy for Cybersecurity) Cybersecurity Policy for Critical Infrastructure Protection. This includes: implementing the cybersecurity framework, conducting risk assessments, preparing for and responding to cyber incidents, and participating in cross-sector exercises.',
      category: 'Critical Infrastructure',
      tags: ['nisc', 'critical-infrastructure', 'cybersecurity-framework', 'incident-response'],
      riskLevel: 'high',
      regulatoryRef: 'NISC Cybersecurity Policy for CIP (5th); Basic Act on Cybersecurity',
    },
  ],

  tests: [
    {
      title: 'Verify APPI Compliance Controls',
      description:
        'Assess APPI compliance: verify purpose of use is specified and publicly available, consent is obtained for sensitive personal information, data subject requests (disclosure, correction, suspension) can be fulfilled within statutory timeframes, third-party provision records are maintained, and the personal information protection manager (koninshiki kanri sekininsha) is designated.',
      category: 'Data Protection',
      tags: ['appi', 'compliance', 'assessment-test'],
      linkedReqTags: ['appi', 'personal-information', 'purpose-limitation'],
    },
    {
      title: 'Verify APPI Cross-Border Transfer Compliance',
      description:
        'Review all cross-border transfers of personal data from Japan. Verify: each transfer has an identified legal basis per APPI Article 28, recipient country protections are assessed, data subjects are informed about the transfer, records of transfers are maintained for three years, and contracts with foreign processors include APPI-required provisions.',
      category: 'Data Protection',
      tags: ['appi', 'cross-border', 'transfer-test'],
      linkedReqTags: ['appi', 'cross-border', 'data-transfer'],
    },
    {
      title: 'Verify METI Cybersecurity Management Alignment',
      description:
        'Assess alignment with METI Cybersecurity Management Guidelines. Verify: senior management cybersecurity policy exists, cybersecurity risk assessment is documented, supply chain cybersecurity measures are implemented, cybersecurity incident response procedures are defined and tested, and cybersecurity metrics are reported to management.',
      category: 'Cybersecurity',
      tags: ['meti', 'cybersecurity', 'alignment-test'],
      linkedReqTags: ['meti', 'cybersecurity-management', 'risk-management'],
    },
    {
      title: 'Verify TELEC / Giteki Certification',
      description:
        'For radio equipment, verify: current TELEC/MIC certification or technical conformity mark (giteki mark) is obtained, certification covers the specific radio frequencies and power levels used, the giteki mark is displayed on the equipment, and certification remains valid for the equipment configuration deployed in Japan.',
      category: 'Telecommunications',
      tags: ['telec', 'giteki', 'certification-test'],
      linkedReqTags: ['telec', 'mic', 'giteki'],
    },
    {
      title: 'Verify JIS X 8341-3 Accessibility',
      description:
        'Test web content against JIS X 8341-3:2016 (WCAG 2.1 Level AA). Use the JIS assessment methodology: select representative pages, test against all applicable success criteria, calculate the conformance rate, and document results. Verify the accessibility policy is published with a target conformance level and achievement timeline.',
      category: 'Accessibility',
      tags: ['jis-x-8341', 'accessibility', 'conformance-test'],
      linkedReqTags: ['jis-x-8341', 'accessibility', 'wcag'],
    },
    {
      title: 'Verify Privacy Mark (P-Mark) Controls',
      description:
        'If P-Mark certification is pursued or maintained, verify: the PMS (Personal Information Protection Management System) is documented, internal audits are conducted annually, management review is performed, employee training on personal information handling is current, and the PMS addresses all JIS Q 15001 requirements including complaint handling and continuous improvement.',
      category: 'Data Protection',
      tags: ['privacy-mark', 'pms', 'verification-test'],
      linkedReqTags: ['privacy-mark', 'jis-q-15001', 'pms'],
    },
    {
      title: 'Verify ISMAP Cloud Registration',
      description:
        'If using cloud services for Japanese government data, verify: the cloud provider is registered on the ISMAP list (or ISMAP-LIU for low-impact use), the registration scope covers the services used, the most recent assessment report is current, complementary controls required of the customer are implemented, and service-level agreements meet government requirements.',
      category: 'Cloud Security',
      tags: ['ismap', 'cloud', 'registration-test'],
      linkedReqTags: ['ismap', 'cloud-security', 'government'],
    },
  ],
};

export default templateSet;
