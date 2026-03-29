/**
 * Spain — Country-Specific Base Regulatory Template
 *
 * Spain-specific requirements covering AEPD (Agencia Espanola de Proteccion de Datos),
 * ENS (Esquema Nacional de Seguridad), CCN-STIC guidelines, and CNMV financial oversight.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // AEPD — Agencia Espanola de Proteccion de Datos
  // -----------------------------------------------------------------------
  {
    title: 'LOPDGDD — Spanish GDPR Implementation',
    description:
      'Data processing shall comply with Ley Organica 3/2018 de Proteccion de Datos Personales y garantia de los derechos digitales (LOPDGDD), which implements GDPR in Spain with additional national provisions. Key Spanish-specific requirements include: digital rights of employees (Art. 87-91) including the right to digital disconnection, specific rules for video surveillance and recording systems (Art. 22), processing of data from deceased persons by heirs (Art. 3), and the AEPD\'s authority to issue binding instructions and impose sanctions up to EUR 20M or 4% of global turnover.',
    category: 'Privacy',
    tags: ['aepd', 'lopdgdd', 'gdpr', 'privacy', 'spain'],
    riskLevel: 'critical',
    regulatoryRef: 'Ley Organica 3/2018 (LOPDGDD); GDPR',
  },
  {
    title: 'AEPD — Data Protection Officer Registration',
    description:
      'Organizations required to appoint a Data Protection Officer (DPO) under GDPR Article 37 or LOPDGDD Article 34 shall communicate the DPO appointment to the AEPD within 10 days via the AEPD\'s electronic headquarters (sede electronica). LOPDGDD Article 34 extends mandatory DPO appointment beyond GDPR requirements to include: educational establishments, telecommunications operators, financial entities, insurance companies, energy suppliers, health establishments, professional colleges (colegios profesionales), and distributors/marketers of electrical energy and natural gas.',
    category: 'Privacy',
    tags: ['aepd', 'dpo', 'lopdgdd', 'registration', 'spain'],
    riskLevel: 'high',
    regulatoryRef: 'LOPDGDD Article 34; AEPD Circular 1/2019',
  },
  {
    title: 'AEPD — Facilita DPIA Tool and Risk Assessment',
    description:
      'Data Protection Impact Assessments (DPIAs) shall be conducted for high-risk processing activities as defined by the AEPD\'s published list of processing requiring DPIA (Lista de tipos de tratamientos de datos). The AEPD\'s Facilita DPIA tool or equivalent methodology shall be used to assess risks to rights and freedoms. The assessment shall identify risks, evaluate their severity and likelihood, propose mitigation measures, and document the decision on residual risk. Prior consultation with the AEPD is required if residual risk remains high.',
    category: 'Privacy',
    tags: ['aepd', 'dpia', 'risk-assessment', 'spain'],
    riskLevel: 'high',
    regulatoryRef: 'GDPR Art. 35-36; AEPD List of Processing Requiring DPIA (2019)',
  },
  // -----------------------------------------------------------------------
  // ENS — Esquema Nacional de Seguridad
  // -----------------------------------------------------------------------
  {
    title: 'ENS — Esquema Nacional de Seguridad Compliance',
    description:
      'Information systems of Spanish public administrations and their suppliers shall comply with the Esquema Nacional de Seguridad (ENS) as updated by Real Decreto 311/2022. Systems shall be categorized (BASICA, MEDIA, ALTA) based on security dimensions (confidentiality, integrity, traceability, authenticity, availability). ENS compliance requires implementation of 73 security measures across organizational framework, operational framework, and protection measures. ALTA category systems require certification by an accredited ENS auditor.',
    category: 'Information Security',
    tags: ['ens', 'national-security-scheme', 'public-administration', 'spain'],
    riskLevel: 'critical',
    regulatoryRef: 'Real Decreto 311/2022 (ENS); CCN-STIC Guidelines',
  },
  {
    title: 'ENS — Security Incident Notification to CCN-CERT',
    description:
      'Security incidents affecting public administration systems or ENS-regulated systems shall be reported to CCN-CERT (Centro Criptologico Nacional - Computer Emergency Response Team) through the LUCIA platform. Notification timelines depend on criticality: critical incidents within 12 hours, high within 48 hours. Reports shall include: incident classification per CCN-STIC 817, affected systems, impact assessment, containment measures, and remediation timeline. Annual security status reports shall be submitted to CCN.',
    category: 'Incident Management',
    tags: ['ens', 'ccn-cert', 'incident-reporting', 'lucia', 'spain'],
    riskLevel: 'high',
    regulatoryRef: 'Real Decreto 311/2022, Art. 36; CCN-STIC 817 (Incident Classification)',
  },
  // -----------------------------------------------------------------------
  // CCN-STIC — Centro Criptologico Nacional Security Guidelines
  // -----------------------------------------------------------------------
  {
    title: 'CCN-STIC — Security Configuration Guides',
    description:
      'IT systems within ENS scope shall be configured according to applicable CCN-STIC security guides. Key guides include: CCN-STIC 301 (security requirements overview), CCN-STIC 599 (cloud computing security), CCN-STIC 885 (secure configuration for MS Office 365), CCN-STIC 836 (Windows 10 hardening), and sector-specific guides. The INES (Informe Nacional del Estado de Seguridad) platform shall be used for compliance self-assessment and reporting to CCN.',
    category: 'Security Configuration',
    tags: ['ccn-stic', 'hardening', 'configuration', 'ines', 'spain'],
    riskLevel: 'medium',
    regulatoryRef: 'CCN-STIC 301; CCN-STIC 800 Series',
  },
  {
    title: 'CCN-STIC — STIC Product Qualification (CPSTIC)',
    description:
      'Security products deployed in ENS ALTA category systems should preferably be selected from the Catalogo de Productos de Seguridad de las Tecnologias de la Informacion y la Comunicacion (CPSTIC) maintained by CCN. Products in the catalog have been evaluated against Common Criteria or CCN-specific qualification processes. For cryptographic products, compliance with CCN-STIC 807 (cryptographic algorithms) is required, mandating the use of approved algorithms and key lengths.',
    category: 'Product Security',
    tags: ['ccn-stic', 'cpstic', 'product-qualification', 'cryptography', 'spain'],
    riskLevel: 'medium',
    regulatoryRef: 'CCN-STIC 105 (CPSTIC); CCN-STIC 807 (Cryptographic Algorithms)',
  },
  // -----------------------------------------------------------------------
  // CNMV — Comision Nacional del Mercado de Valores
  // -----------------------------------------------------------------------
  {
    title: 'CNMV — Financial Market IT Systems Compliance',
    description:
      'IT systems of entities supervised by the CNMV (investment firms, fund managers, market infrastructures) shall comply with CNMV Circular 1/2022 on ICT risk management and digital operational resilience (aligned with DORA). Requirements include: ICT governance framework approved by the management body, comprehensive ICT risk management including third-party ICT risk, incident classification and reporting to CNMV within 4 hours for major incidents, digital operational resilience testing (TLPT for significant entities), and ICT business continuity plans with annual testing.',
    category: 'Financial Compliance',
    tags: ['cnmv', 'dora', 'ict-risk', 'financial-markets', 'spain'],
    riskLevel: 'high',
    regulatoryRef: 'CNMV Circular 1/2022; EU DORA Regulation 2022/2554',
  },
  {
    title: 'Ley 11/2022 — General Telecommunications Law',
    description:
      'Telecommunications services and electronic communications networks shall comply with Ley 11/2022, General de Telecomunicaciones. Requirements include: registration with the CNMC (Comision Nacional de los Mercados y la Competencia) operator registry, network security obligations per Article 40, user rights protections, number portability support, lawful interception capabilities as required by judicial authority, and data retention obligations for traffic and location data per Ley 25/2007 (subject to CJEU case law limitations).',
    category: 'Telecommunications',
    tags: ['telecommunications', 'cnmc', 'ley-11-2022', 'spain'],
    riskLevel: 'medium',
    regulatoryRef: 'Ley 11/2022 General de Telecomunicaciones; Ley 25/2007 (Data Retention)',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify LOPDGDD Compliance and Digital Rights',
    description:
      'Audit data processing against LOPDGDD requirements. Verify implementation of employee digital rights (right to disconnection, privacy in digital communications). Test video surveillance processing compliance with Art. 22. Confirm DPO registration with AEPD is current.',
    category: 'Privacy',
    tags: ['aepd', 'lopdgdd', 'privacy-test'],
    linkedReqTags: ['aepd', 'lopdgdd', 'gdpr', 'privacy'],
  },
  {
    title: 'Verify AEPD DPIA Process',
    description:
      'For processing activities on the AEPD mandatory DPIA list, verify that a DPIA has been completed using Facilita or equivalent methodology. Confirm risk identification, severity/likelihood assessment, mitigation measures, and residual risk documentation. Verify prior consultation with AEPD was conducted where residual risk remained high.',
    category: 'Privacy',
    tags: ['aepd', 'dpia', 'assessment-test'],
    linkedReqTags: ['aepd', 'dpia', 'risk-assessment'],
  },
  {
    title: 'Verify ENS Security Categorization and Controls',
    description:
      'Confirm system categorization (BASICA/MEDIA/ALTA) is documented with justification across all five security dimensions. Verify implementation of all applicable ENS security measures from the 73 control set. For ALTA systems, confirm valid ENS certification from an accredited auditor. Test INES platform compliance reporting.',
    category: 'Information Security',
    tags: ['ens', 'categorization', 'controls-test'],
    linkedReqTags: ['ens', 'national-security-scheme', 'public-administration'],
  },
  {
    title: 'Verify CCN-CERT Incident Reporting via LUCIA',
    description:
      'Simulate security incidents of varying criticality levels. Verify that critical incidents trigger CCN-CERT notification within 12 hours and high incidents within 48 hours via the LUCIA platform. Confirm incident reports include proper CCN-STIC 817 classification, impact assessment, and remediation timeline.',
    category: 'Incident Management',
    tags: ['ccn-cert', 'incident', 'lucia-test'],
    linkedReqTags: ['ens', 'ccn-cert', 'incident-reporting', 'lucia'],
  },
  {
    title: 'Verify CCN-STIC Security Configuration Compliance',
    description:
      'Audit system configurations against applicable CCN-STIC hardening guides. Test OS hardening per CCN-STIC 836/885, cloud configuration per CCN-STIC 599, and cryptographic implementations per CCN-STIC 807. Verify that INES self-assessment has been completed and submitted.',
    category: 'Security Configuration',
    tags: ['ccn-stic', 'hardening', 'configuration-test'],
    linkedReqTags: ['ccn-stic', 'hardening', 'configuration', 'ines'],
  },
  {
    title: 'Verify CNMV ICT Risk Management and DORA Alignment',
    description:
      'For CNMV-supervised entities, audit ICT governance framework and risk management processes. Verify incident classification and 4-hour reporting capability for major incidents. Confirm ICT business continuity plan with evidence of annual testing. For significant entities, verify digital operational resilience testing (TLPT) program.',
    category: 'Financial Compliance',
    tags: ['cnmv', 'dora', 'risk-test'],
    linkedReqTags: ['cnmv', 'dora', 'ict-risk', 'financial-markets'],
  },
  {
    title: 'Verify ENS ALTA Certification Requirements',
    description:
      'For ALTA category systems, verify that ENS certification has been obtained from an accredited audit firm. Confirm certification scope covers all system components. Verify that corrective actions from the certification audit have been implemented. Check certification validity and renewal schedule.',
    category: 'Information Security',
    tags: ['ens', 'certification', 'alta-test'],
    linkedReqTags: ['ens', 'national-security-scheme'],
  },
];
