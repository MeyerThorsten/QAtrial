/**
 * Mexico — Country-Specific Base Regulatory Template
 *
 * Mexico-specific requirements covering LFPDPPP (Federal Law on Protection
 * of Personal Data Held by Private Parties), NOM standards, INAI oversight,
 * and IFT telecommunications regulation.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // LFPDPPP — Federal Law on Protection of Personal Data
  // -----------------------------------------------------------------------
  {
    title: 'LFPDPPP — Privacy Notice (Aviso de Privacidad)',
    description:
      'Data controllers shall provide a Privacy Notice (Aviso de Privacidad) to data subjects before or at the time of data collection, in accordance with Article 15-18 of the LFPDPPP. The Privacy Notice shall include: identity and domicile of the data controller, purposes of processing (primary and secondary), data categories collected, transfer and sharing mechanisms, means for exercising ARCO rights (Access, Rectification, Cancellation, Opposition), consent revocation procedures, and any data transfers to third parties or internationally.',
    category: 'Privacy',
    tags: ['lfpdppp', 'privacy-notice', 'aviso-de-privacidad', 'mexico'],
    riskLevel: 'critical',
    regulatoryRef: 'LFPDPPP Articles 15-18; LFPDPPP Regulations Articles 24-32',
  },
  {
    title: 'LFPDPPP — ARCO Rights Implementation',
    description:
      'Data subjects shall be able to exercise their ARCO rights (Acceso, Rectificacion, Cancelacion, Oposicion) through clearly defined mechanisms. The data controller shall respond to ARCO requests within 20 business days of receipt, with a possible 20-day extension. If the request is granted, it shall be implemented within 15 business days. The system shall maintain records of all ARCO requests and their resolution. ARCO rights may be exercised at no cost to the data subject, except for reasonable reproduction/shipping costs.',
    category: 'Privacy',
    tags: ['lfpdppp', 'arco-rights', 'data-subject-rights', 'mexico'],
    riskLevel: 'high',
    regulatoryRef: 'LFPDPPP Articles 22-35; LFPDPPP Regulations Articles 87-103',
  },
  {
    title: 'LFPDPPP — Security Measures and Breach Notification',
    description:
      'Data controllers shall implement administrative, physical, and technical security measures to protect personal data against damage, loss, alteration, destruction, unauthorized use, access, or processing. A risk assessment considering the sensitivity of data, technological development, and potential consequences of breach shall determine the appropriate level of security. Data breaches that significantly affect the patrimonial or moral rights of data subjects shall be reported to the affected individuals without delay.',
    category: 'Data Security',
    tags: ['lfpdppp', 'security-measures', 'breach-notification', 'mexico'],
    riskLevel: 'critical',
    regulatoryRef: 'LFPDPPP Articles 19-20; LFPDPPP Regulations Articles 57-66',
  },
  // -----------------------------------------------------------------------
  // NOM — Normas Oficiales Mexicanas
  // -----------------------------------------------------------------------
  {
    title: 'NOM Compliance — Official Mexican Standards for Products',
    description:
      'Products entering the Mexican market shall comply with applicable Normas Oficiales Mexicanas (NOM). Relevant NOMs include: NOM-019-SCFI (electronic and electrical safety), NOM-001-SCFI (labeling), NOM-024-SSA3 (electronic health records), and sector-specific NOMs. Conformity assessment shall be performed by accredited conformity assessment bodies (Organismos de Evaluacion de la Conformidad, OECs) authorized by the appropriate Secretariat. Products shall bear the NOM mark.',
    category: 'Product Certification',
    tags: ['nom', 'product-certification', 'oec', 'mexico'],
    riskLevel: 'medium',
    regulatoryRef: 'Federal Law on Metrology and Standardization; Applicable NOM standards',
  },
  {
    title: 'NOM-024-SSA3 — Electronic Health Records',
    description:
      'Electronic health record systems used in Mexico shall comply with NOM-024-SSA3-2012, which defines minimum interoperability requirements for health information exchange. Requirements include: patient identification standards, clinical document architecture, data dictionaries, messaging standards (HL7), security and access controls, audit trails for health record access and modification, and data integrity verification.',
    category: 'Health IT',
    tags: ['nom-024', 'ehr', 'health-records', 'interoperability', 'mexico'],
    riskLevel: 'high',
    regulatoryRef: 'NOM-024-SSA3-2012',
  },
  // -----------------------------------------------------------------------
  // INAI — National Institute for Transparency, Access to Information
  // -----------------------------------------------------------------------
  {
    title: 'INAI — Data Protection Impact Assessments',
    description:
      'Processing activities involving sensitive personal data, large-scale profiling, systematic monitoring, or new technologies shall undergo a Data Protection Impact Assessment as recommended by INAI guidelines. The assessment shall identify and evaluate risks to data subjects, propose mitigation measures, and document the residual risk acceptance. INAI may issue binding recommendations for public sector entities and voluntary guidance for private sector entities.',
    category: 'Privacy',
    tags: ['inai', 'dpia', 'privacy', 'mexico'],
    riskLevel: 'medium',
    regulatoryRef: 'INAI Guidelines on Data Protection Impact Assessments; LFPDPPP Regulations Article 62',
  },
  // -----------------------------------------------------------------------
  // IFT — Federal Telecommunications Institute
  // -----------------------------------------------------------------------
  {
    title: 'IFT — Telecommunications Equipment Homologation',
    description:
      'Telecommunications terminal equipment and radio communication equipment operating in Mexico shall obtain homologation (type approval) from the Instituto Federal de Telecomunicaciones (IFT). The process involves submitting technical documentation and test reports from accredited laboratories demonstrating compliance with applicable IFT technical provisions (Disposiciones Tecnicas). Equipment shall comply with electromagnetic compatibility, radio frequency emission, and safety requirements.',
    category: 'Telecommunications',
    tags: ['ift', 'homologation', 'telecommunications', 'mexico'],
    riskLevel: 'medium',
    regulatoryRef: 'Federal Telecommunications and Broadcasting Law Articles 190, 196; IFT Disposiciones Tecnicas',
  },
  {
    title: 'LFPDPPP — International Data Transfers',
    description:
      'International transfers of personal data shall comply with LFPDPPP Article 36-37. The transferring party shall communicate the Privacy Notice and obtain consent where applicable. The receiving party shall assume the same obligations as the transferring data controller. Transfers may proceed without consent when necessary for medical diagnosis/treatment, bank transfers, treaty obligations, or legal proceedings, or when the controller establishes adequate safeguards per LFPDPPP Regulations.',
    category: 'Privacy',
    tags: ['lfpdppp', 'international-transfer', 'cross-border', 'mexico'],
    riskLevel: 'high',
    regulatoryRef: 'LFPDPPP Articles 36-37; LFPDPPP Regulations Articles 68-72',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify Privacy Notice (Aviso de Privacidad) Compliance',
    description:
      'Confirm that the Privacy Notice includes all LFPDPPP-required elements: controller identity/domicile, primary and secondary purposes, data categories, ARCO rights procedures, consent revocation mechanism, and transfer disclosures. Verify the notice is presented before or at the time of data collection. Test that simplified and short-form notices are available where applicable.',
    category: 'Privacy',
    tags: ['lfpdppp', 'privacy-notice', 'compliance-test'],
    linkedReqTags: ['lfpdppp', 'privacy-notice', 'aviso-de-privacidad'],
  },
  {
    title: 'Verify ARCO Rights Workflow',
    description:
      'Submit Access, Rectification, Cancellation, and Opposition requests. Verify that each request is acknowledged within 20 business days. Confirm that granted requests are implemented within 15 business days. Test that ARCO request records are maintained with complete audit trail. Verify no cost is charged beyond reasonable reproduction expenses.',
    category: 'Privacy',
    tags: ['lfpdppp', 'arco', 'rights-test'],
    linkedReqTags: ['lfpdppp', 'arco-rights', 'data-subject-rights'],
  },
  {
    title: 'Verify LFPDPPP Security Measures',
    description:
      'Audit administrative, physical, and technical security measures for personal data protection. Verify risk assessment has been conducted considering data sensitivity and potential consequences. Test access controls, encryption, backup procedures, and incident response. Confirm that breach notification procedures are documented and tested.',
    category: 'Data Security',
    tags: ['lfpdppp', 'security', 'measures-test'],
    linkedReqTags: ['lfpdppp', 'security-measures', 'breach-notification'],
  },
  {
    title: 'Verify NOM Product Certification',
    description:
      'Confirm that products requiring NOM certification have been tested by accredited OECs. Verify NOM mark is properly displayed. For electronic health records, verify compliance with NOM-024-SSA3 interoperability requirements including HL7 messaging, data dictionaries, and audit trail functionality.',
    category: 'Product Certification',
    tags: ['nom', 'certification', 'product-test'],
    linkedReqTags: ['nom', 'product-certification', 'oec'],
  },
  {
    title: 'Verify INAI Data Protection Impact Assessment',
    description:
      'For processing activities involving sensitive data or large-scale profiling, verify that a DPIA has been conducted per INAI guidelines. Confirm that risks are identified, mitigation measures are documented, and residual risk is formally accepted. Verify that the DPIA is reviewed and updated when processing activities change.',
    category: 'Privacy',
    tags: ['inai', 'dpia', 'assessment-test'],
    linkedReqTags: ['inai', 'dpia', 'privacy'],
  },
];
