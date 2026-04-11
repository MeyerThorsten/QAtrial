/**
 * Brazil — Country-Specific Base Regulatory Template
 *
 * Brazil-specific requirements covering ANVISA medical device and
 * pharmaceutical regulations, LGPD (Lei Geral de Protecao de Dados),
 * BGMP (Boas Praticas de Fabricacao de Medicamentos), and RDC 665/2022
 * (medical device technical requirements).
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // ANVISA — Agencia Nacional de Vigilancia Sanitaria
  // -----------------------------------------------------------------------
  {
    title: 'ANVISA — Medical Device Registration (RDC 751/2022)',
    description:
      'Medical devices marketed in Brazil shall be registered with ANVISA per RDC 751/2022. Registration requires a complete technical dossier including: device description, intended use, risk classification (Class I-IV per RDC 185/2001), essential safety and performance requirements, clinical evaluation, labeling in Portuguese, and post-market surveillance plan. Class III and IV devices require pre-market approval; Class I and II follow notification/registration.',
    category: 'Medical Device Registration',
    tags: ['anvisa', 'rdc-751', 'device-registration', 'brazil'],
    riskLevel: 'critical',
    regulatoryRef: 'ANVISA RDC 751/2022; RDC 185/2001',
  },
  {
    title: 'ANVISA — GMP Certification (RDC 658/2022)',
    description:
      'Manufacturing facilities producing pharmaceuticals, medical devices, or health products for the Brazilian market shall hold a valid ANVISA GMP certificate (Certificado de Boas Praticas de Fabricacao). ANVISA conducts on-site inspections to verify compliance with RDC 658/2022 (pharmaceutical GMP) or RDC 665/2022 (medical device GMP). Foreign manufacturers must also undergo ANVISA inspection.',
    category: 'Manufacturing',
    tags: ['anvisa', 'gmp', 'rdc-658', 'rdc-665', 'brazil'],
    riskLevel: 'critical',
    regulatoryRef: 'ANVISA RDC 658/2022; RDC 665/2022',
  },
  {
    title: 'RDC 665/2022 — Medical Device GMP Requirements',
    description:
      'Medical device manufacturers shall comply with RDC 665/2022 establishing Good Manufacturing Practices for medical devices. Requirements include: quality management system, management responsibility, resource management, product realization (design controls, purchasing, production), measurement/analysis/improvement, corrective and preventive actions, and risk management per ISO 14971.',
    category: 'Manufacturing',
    tags: ['anvisa', 'rdc-665', 'device-gmp', 'quality-system', 'brazil'],
    riskLevel: 'high',
    regulatoryRef: 'ANVISA RDC 665/2022',
  },
  // -----------------------------------------------------------------------
  // LGPD — Lei Geral de Protecao de Dados
  // -----------------------------------------------------------------------
  {
    title: 'LGPD — Legal Bases for Personal Data Processing',
    description:
      'Personal data processing shall be performed under one of the legal bases defined in LGPD Article 7 (or Article 11 for sensitive data). Legal bases include: consent, legal obligation, public administration, research, contract execution, exercise of rights, life/safety protection, health protection, credit protection, and legitimate interest. Sensitive personal data (health, genetic, biometric) requires explicit and specific consent or falls under Article 11 exceptions.',
    category: 'Privacy',
    tags: ['lgpd', 'legal-basis', 'consent', 'brazil'],
    riskLevel: 'critical',
    regulatoryRef: 'LGPD Articles 7, 11 (Lei 13.709/2018)',
  },
  {
    title: 'LGPD — Data Subject Rights (Titular Rights)',
    description:
      'Data subjects (titulares) shall be able to exercise their rights per LGPD Article 18: confirmation of processing, access, correction, anonymization/blocking/deletion of unnecessary data, data portability, information about sharing with third parties, information about consent denial consequences, and consent revocation. Controllers shall respond within 15 days.',
    category: 'Privacy',
    tags: ['lgpd', 'data-subject-rights', 'titular', 'brazil'],
    riskLevel: 'high',
    regulatoryRef: 'LGPD Articles 17-22 (Lei 13.709/2018)',
  },
  {
    title: 'LGPD — Data Protection Impact Assessment (RIPD)',
    description:
      'The ANPD (National Data Protection Authority) may require a RIPD (Relatorio de Impacto a Protecao de Dados Pessoais) when processing poses risks to fundamental rights and freedoms. The RIPD shall describe processing activities, data categories, security measures, risk analysis, and mitigation mechanisms. Processing of sensitive personal data or data of children/adolescents should proactively include a RIPD.',
    category: 'Privacy',
    tags: ['lgpd', 'ripd', 'impact-assessment', 'anpd', 'brazil'],
    riskLevel: 'medium',
    regulatoryRef: 'LGPD Articles 5(XVII), 38 (Lei 13.709/2018)',
  },
  // -----------------------------------------------------------------------
  // BGMP — Pharmaceutical GMP
  // -----------------------------------------------------------------------
  {
    title: 'BGMP — Data Integrity in Pharmaceutical Manufacturing',
    description:
      'Pharmaceutical manufacturers shall ensure data integrity across all GMP-relevant activities per ANVISA BGMP requirements. Data shall be ALCOA+ compliant: Attributable, Legible, Contemporaneous, Original, Accurate, Complete, Consistent, Enduring, and Available. Electronic records shall comply with ANVISA RDC 658/2022 Annex requirements for computerized systems.',
    category: 'Data Integrity',
    tags: ['bgmp', 'data-integrity', 'alcoa', 'anvisa', 'brazil'],
    riskLevel: 'high',
    regulatoryRef: 'ANVISA RDC 658/2022; BGMP Guidelines',
  },
  {
    title: 'ANVISA — Post-Market Surveillance (Tecnovigilancia)',
    description:
      'Registration holders shall maintain a post-market surveillance (tecnovigilancia) system per ANVISA requirements. Adverse events and technical complaints involving medical devices shall be reported to ANVISA via the NOTIVISA system within defined timeframes: deaths within 10 days, serious injuries within 30 days. A periodic safety update report (PSUR equivalent) shall be maintained.',
    category: 'Post-Market',
    tags: ['anvisa', 'tecnovigilancia', 'post-market', 'adverse-events', 'brazil'],
    riskLevel: 'high',
    regulatoryRef: 'ANVISA RDC 67/2009; IN 107/2022',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify ANVISA Device Registration Dossier Completeness',
    description:
      'Review the technical dossier for completeness per RDC 751/2022 requirements. Verify presence of: device description, classification justification, essential safety/performance requirements checklist, clinical evaluation report, Portuguese labeling, and post-market plan. Confirm risk classification aligns with RDC 185/2001 categories.',
    category: 'Regulatory',
    tags: ['anvisa', 'registration', 'dossier-test'],
    linkedReqTags: ['anvisa', 'rdc-751', 'device-registration'],
  },
  {
    title: 'Verify LGPD Consent and Legal Basis Compliance',
    description:
      'For each data processing activity, verify that a valid legal basis under LGPD Article 7 (or Article 11 for sensitive data) is documented. Test consent collection mechanisms: verify consent is freely given, informed, unambiguous, and specific to each purpose. Confirm sensitive data processing has explicit consent with separate granular controls.',
    category: 'Privacy',
    tags: ['lgpd', 'consent', 'legal-basis-test'],
    linkedReqTags: ['lgpd', 'legal-basis', 'consent'],
  },
  {
    title: 'Verify LGPD Data Subject Rights Implementation',
    description:
      'Submit requests for each right under LGPD Article 18: access, correction, deletion, portability, and consent revocation. Verify responses are provided within 15 days. Test anonymization/blocking functionality. Confirm data portability output is in a structured, machine-readable format.',
    category: 'Privacy',
    tags: ['lgpd', 'rights', 'titular-test'],
    linkedReqTags: ['lgpd', 'data-subject-rights', 'titular'],
  },
  {
    title: 'Verify RDC 665/2022 GMP Compliance',
    description:
      'Audit the quality management system against RDC 665/2022 requirements. Verify design control procedures, supplier qualification records, production controls, CAPA system, and risk management per ISO 14971. Confirm management review records and internal audit schedule.',
    category: 'Manufacturing',
    tags: ['rdc-665', 'gmp', 'audit-test'],
    linkedReqTags: ['anvisa', 'rdc-665', 'device-gmp', 'quality-system'],
  },
  {
    title: 'Verify ANVISA Tecnovigilancia Reporting',
    description:
      'Test adverse event reporting workflows. Verify that death-related events trigger 10-day reporting to NOTIVISA, serious injuries trigger 30-day reporting. Confirm complaint trending analysis is performed. Verify periodic safety update reports are generated on schedule.',
    category: 'Post-Market',
    tags: ['tecnovigilancia', 'reporting', 'adverse-event-test'],
    linkedReqTags: ['anvisa', 'tecnovigilancia', 'post-market', 'adverse-events'],
  },
];
