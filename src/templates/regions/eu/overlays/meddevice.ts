/**
 * European Union + Medical Devices Vertical — Overlay Template
 *
 * EU-specific medical device regulatory requirements that layer on top of
 * the EU base and the medical devices vertical common templates. Covers
 * EU MDR 2017/745, IVDR 2017/746, and Notified Body requirements.
 */

import type { VerticalTemplateSet } from '../../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'medical_devices',
  projectType: undefined,
  requirements: [
    // -----------------------------------------------------------------------
    // EU MDR 2017/745
    // -----------------------------------------------------------------------
    {
      templateId: 'eu-meddevice:regulatory-classification:req-01',
      title: 'EU MDR 2017/745 — Classification and Conformity Assessment',
      description:
        'Medical devices placed on the EU market shall be classified per EU MDR 2017/745 Annex VIII classification rules. The conformity assessment route shall match the device class: Class I (self-declaration with exceptions), Class IIa (Annex IX Chapter I + III or Annex XI Part A), Class IIb (Annex IX Chapter I + II or Annex X + XI Part A), Class III (Annex IX or Annex X + XI Part A). A Notified Body shall be involved for all classes except non-sterile, non-measuring Class I devices.',
      category: 'Regulatory Classification',
      tags: ['eu-mdr', 'classification', 'conformity-assessment', 'annex-viii'],
      riskLevel: 'critical',
      regulatoryRef: 'EU MDR 2017/745 Articles 51-52; Annex VIII',
    },
    {
      templateId: 'eu-meddevice:safety-performance:req-01',
      title: 'EU MDR — General Safety and Performance Requirements (GSPR)',
      description:
        'Medical devices shall meet the General Safety and Performance Requirements per EU MDR Annex I. A GSPR checklist shall be maintained documenting: each applicable requirement, the standards or methods used for compliance, the evidence references (test reports, clinical data, risk analyses), and the residual risk acceptability conclusion. The GSPR checklist forms a core element of the technical documentation.',
      category: 'Safety & Performance',
      tags: ['eu-mdr', 'gspr', 'annex-i', 'essential-requirements'],
      riskLevel: 'critical',
      regulatoryRef: 'EU MDR 2017/745 Annex I',
    },
    {
      templateId: 'eu-meddevice:technical-documentation:req-01',
      title: 'EU MDR — Technical Documentation per Annex II and III',
      description:
        'Technical documentation shall be prepared per EU MDR Annex II (device description, design, manufacturing, GSPR, benefit-risk, V&V, clinical evaluation) and Annex III (post-market surveillance). Documentation shall be maintained throughout the device lifecycle and updated following significant changes, post-market findings, or at Notified Body request. Documentation language shall meet member state requirements.',
      category: 'Technical Documentation',
      tags: ['eu-mdr', 'technical-documentation', 'annex-ii', 'annex-iii'],
      riskLevel: 'high',
      regulatoryRef: 'EU MDR 2017/745 Annexes II and III',
    },
    {
      templateId: 'eu-meddevice:regulatory-registration:req-01',
      title: 'EU MDR — EUDAMED Registration and UDI-DI Assignment',
      description:
        'Manufacturers shall register in EUDAMED (European Database on Medical Devices) and assign UDI-DI codes per EU MDR Article 29. EUDAMED modules cover: actor registration, UDI/device registration, certificates and Notified Body data, clinical investigations, vigilance, and post-market surveillance. UDI-DI shall follow an EU-accepted issuing entity (GS1, HIBCC, ICCBBA, IFA) and be submitted to the UDI database.',
      category: 'Regulatory Registration',
      tags: ['eu-mdr', 'eudamed', 'udi-di', 'registration'],
      riskLevel: 'high',
      regulatoryRef: 'EU MDR 2017/745 Articles 29-34; EUDAMED Guidance',
    },
    {
      templateId: 'eu-meddevice:clinical-evidence:req-01',
      title: 'EU MDR — Clinical Evaluation and PMCF',
      description:
        'A clinical evaluation shall be conducted per EU MDR Article 61 and Annex XIV to demonstrate GSPR conformity. For Class III and implantable devices, clinical investigations may be required unless justified exceptions per Article 61(4-6) apply. Post-Market Clinical Follow-up (PMCF) shall be planned and executed to proactively collect clinical data from marketed devices. The PMCF plan shall define methods (literature, registries, PMCF studies) and update intervals.',
      category: 'Clinical Evidence',
      tags: ['eu-mdr', 'clinical-evaluation', 'pmcf', 'annex-xiv'],
      riskLevel: 'critical',
      regulatoryRef: 'EU MDR 2017/745 Article 61; Annex XIV; MDCG 2020-6',
    },

    // -----------------------------------------------------------------------
    // IVDR 2017/746
    // -----------------------------------------------------------------------
    {
      templateId: 'eu-meddevice:ivd-regulatory:req-01',
      title: 'EU IVDR 2017/746 — In Vitro Diagnostic Classification',
      description:
        'In vitro diagnostic medical devices placed on the EU market shall be classified per IVDR 2017/746 Annex VIII into Classes A, B, C, or D based on risk. Classification criteria consider: intended purpose, target condition severity, specimen type, and near-patient testing. The conformity assessment route shall match the device class, with Notified Body involvement required for Classes B, C, and D.',
      category: 'IVD Regulatory',
      tags: ['ivdr', 'ivd-classification', 'annex-viii-ivd', 'conformity'],
      riskLevel: 'high',
      regulatoryRef: 'IVDR 2017/746 Article 48; Annex VIII',
    },
    {
      templateId: 'eu-meddevice:ivd-performance:req-01',
      title: 'EU IVDR — Performance Evaluation and Performance Studies',
      description:
        'IVD devices shall undergo performance evaluation per IVDR Annex XIII demonstrating: scientific validity, analytical performance (sensitivity, specificity, accuracy, precision, LOD/LOQ), and clinical performance (diagnostic sensitivity, diagnostic specificity, PPV, NPV). For Class C and D IVDs, performance studies may be required. Performance evaluation reports shall be updated with post-market performance follow-up (PMPF) data.',
      category: 'IVD Performance',
      tags: ['ivdr', 'performance-evaluation', 'analytical-performance', 'pmpf'],
      riskLevel: 'high',
      regulatoryRef: 'IVDR 2017/746 Article 56; Annex XIII',
    },

    // -----------------------------------------------------------------------
    // Notified Body Requirements
    // -----------------------------------------------------------------------
    {
      templateId: 'eu-meddevice:notified-body:req-01',
      title: 'Notified Body Certification and QMS Audit',
      description:
        'For devices requiring Notified Body (NB) involvement, the manufacturer shall maintain a quality management system certified by the NB. The NB shall conduct: initial QMS audit (announced), unannounced surveillance audits (at least annually), technical documentation assessments (sampling-based for Class IIa/IIb), and product-specific assessments for Class III. Non-conformities shall be addressed within NB-specified timelines.',
      category: 'Notified Body',
      tags: ['notified-body', 'qms-audit', 'certification', 'surveillance'],
      riskLevel: 'critical',
      regulatoryRef: 'EU MDR 2017/745 Annex IX; Annex XI',
    },
  ],

  tests: [
    {
      templateId: 'eu-meddevice:regulatory-classification:tst-01',
      title: 'Verify EU MDR Classification and Conformity Route',
      description:
        'Review the device classification per Annex VIII rules. Verify: the classification rationale is documented, all applicable classification rules were considered, the chosen conformity assessment route matches the device class, a designated Notified Body is engaged where required, and the EU Declaration of Conformity is current and references the applicable annexes.',
      category: 'Regulatory Classification',
      tags: ['eu-mdr', 'classification', 'route-verification'],
      linkedReqTags: ['eu-mdr', 'classification', 'conformity-assessment'],
    },
    {
      templateId: 'eu-meddevice:safety-performance:tst-01',
      title: 'Verify GSPR Checklist Completeness',
      description:
        'Review the GSPR checklist per EU MDR Annex I. Verify: all applicable requirements are identified, each requirement has an identified standard or method, evidence references are complete and current (test reports, clinical data, risk analysis), residual risk acceptability is justified for each requirement, and the checklist is version-controlled and part of the technical documentation.',
      category: 'Safety & Performance',
      tags: ['eu-mdr', 'gspr', 'checklist-review'],
      linkedReqTags: ['eu-mdr', 'gspr', 'annex-i'],
    },
    {
      templateId: 'eu-meddevice:regulatory-registration:tst-01',
      title: 'Verify EUDAMED Registration and UDI',
      description:
        'Verify EUDAMED registration status. Confirm: the manufacturer is registered as an economic operator, devices are registered with correct UDI-DI codes, UDI-DI data is submitted to the EUDAMED UDI database, the Single Registration Number (SRN) is assigned, and the registration data is current and consistent with the technical documentation and labeling.',
      category: 'Regulatory Registration',
      tags: ['eudamed', 'udi-di', 'registration-test'],
      linkedReqTags: ['eu-mdr', 'eudamed', 'udi-di'],
    },
    {
      templateId: 'eu-meddevice:clinical-evidence:tst-01',
      title: 'Verify Clinical Evaluation and PMCF Plan',
      description:
        'Review the clinical evaluation report (CER) and PMCF plan. Verify: CER methodology follows MDCG 2020-6 guidance, clinical data appraisal is systematic, conclusions address all GSPR, benefit-risk is documented, the PMCF plan defines specific methods and endpoints, PMCF data is collected and feeds back into the CER update cycle, and the CER is updated at least annually.',
      category: 'Clinical Evidence',
      tags: ['clinical-evaluation', 'pmcf', 'cer-review'],
      linkedReqTags: ['eu-mdr', 'clinical-evaluation', 'pmcf'],
    },
    {
      templateId: 'eu-meddevice:notified-body:tst-01',
      title: 'Verify Notified Body Audit Readiness',
      description:
        'Conduct a mock Notified Body audit. Verify: QMS documentation is current and accessible, technical documentation samples are complete, unannounced audit preparedness procedures are in place, previous NB non-conformities are closed with evidence, CAPA from prior audits is effective, and personnel can demonstrate GMP/QMS knowledge during interviews.',
      category: 'Notified Body',
      tags: ['notified-body', 'audit-readiness', 'mock-audit'],
      linkedReqTags: ['notified-body', 'qms-audit', 'certification'],
    },
  ],
};

export default templateSet;
