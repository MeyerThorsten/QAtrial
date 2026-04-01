/**
 * Japan + Pharmaceutical Vertical — Overlay Template
 *
 * Japan-specific pharmaceutical regulatory requirements that layer on top of
 * the JP base and the pharma vertical common templates. Covers PMDA
 * requirements, J-GMP, and the Japanese Pharmacopoeia.
 */

import type { VerticalTemplateSet } from '../../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'pharma',
  projectType: undefined,
  requirements: [
    // -----------------------------------------------------------------------
    // PMDA (Pharmaceuticals and Medical Devices Agency)
    // -----------------------------------------------------------------------
    {
      templateId: 'jp-pharma:regulatory:req-01',
      title: 'PMDA Regulatory Approval and Consultation',
      description:
        'Pharmaceutical products marketed in Japan shall obtain marketing approval (shonin) from the Minister of Health, Labour and Welfare (MHLW) based on PMDA review. The approval process includes: pre-submission consultation (jizensodan), CTD/eCTD submission in Japanese, PMDA new drug review (shinsa), GMP compliance inspection, and post-approval conditions. PMDA consultations shall be utilized to align development plans with regulatory expectations.',
      category: 'Regulatory',
      tags: ['pmda', 'marketing-approval', 'shonin', 'ctd-submission'],
      riskLevel: 'critical',
      regulatoryRef: 'PAL (Pharmaceutical Affairs Law); PMDA Review Guidelines',
    },
    {
      templateId: 'jp-pharma:gmp:req-01',
      title: 'PMDA GMP Inspection and Compliance Certificate',
      description:
        'Manufacturing facilities for products marketed in Japan shall undergo PMDA GMP inspection. A GMP compliance certificate (tekigou shomeisho) is required for marketing approval and renewal. PMDA inspections cover: quality management system, buildings and facilities, equipment, documentation, production controls, quality controls, and change management. Inspections may be conducted at overseas facilities. Compliance certificates are typically valid for 5 years.',
      category: 'GMP',
      tags: ['pmda', 'gmp-inspection', 'compliance-certificate', 'tekigou'],
      riskLevel: 'critical',
      regulatoryRef: 'MHLW Ministerial Ordinance on GMP; PMDA GMP Inspection Guidelines',
    },
    {
      templateId: 'jp-pharma:regulatory-submissions:req-01',
      title: 'PMDA Electronic Submission Requirements (eCTD)',
      description:
        'Regulatory submissions to PMDA shall follow the Japanese eCTD (electronic Common Technical Document) specification. Requirements include: compliance with PMDA eCTD specification v2.0+, submission via the PMDA Gateway, Japanese language for Modules 1 and 2 (regional), English accepted for Modules 3-5 with Japanese summaries, and compliance with PMDA-specific DTD and controlled vocabulary for document types.',
      category: 'Regulatory Submissions',
      tags: ['pmda', 'ectd', 'gateway', 'electronic-submission'],
      riskLevel: 'high',
      regulatoryRef: 'PMDA eCTD Specification; MHLW Notification on Electronic Submissions',
    },
    {
      templateId: 'jp-pharma:pharmacovigilance:req-01',
      title: 'PMDA Pharmacovigilance and Safety Reporting',
      description:
        'Post-marketing safety activities shall comply with PMDA pharmacovigilance requirements. Reporting obligations include: prompt reports (within 15 days for serious/unexpected domestic ADRs, 30 days for serious known), periodic safety reports (Periodic Safety Update Report / PSUR), Risk Management Plans (RMP), Re-examination studies (sai-shinsa) for new drugs during the re-examination period (typically 8 years), and Post-Marketing Surveillance (PMS) studies.',
      category: 'Pharmacovigilance',
      tags: ['pmda', 'pharmacovigilance', 'adr-reporting', 'rmp'],
      riskLevel: 'critical',
      regulatoryRef: 'MHLW Notification on PV Reporting; PMDA Safety Division Guidelines',
    },

    // -----------------------------------------------------------------------
    // J-GMP (Japanese GMP)
    // -----------------------------------------------------------------------
    {
      templateId: 'jp-pharma:gmp:req-02',
      title: 'J-GMP Manufacturing Control and Quality Control',
      description:
        'Pharmaceutical manufacturing in or for Japan shall comply with the Ministerial Ordinance on Standards for Manufacturing Control and Quality Control (J-GMP). J-GMP requirements cover: quality management system with quality management director (hinshitsu kanri sekininsha), manufacturing control director (seizou kanri sekininsha), quality assurance activities, validation, documentation management, deviation management, change control, CAPA, self-inspections, product release, and stability testing.',
      category: 'GMP',
      tags: ['j-gmp', 'manufacturing-control', 'quality-control', 'hinshitsu-kanri'],
      riskLevel: 'critical',
      regulatoryRef: 'MHLW Ministerial Ordinance No. 179; J-GMP Guidelines',
    },
    {
      templateId: 'jp-pharma:computer-systems:req-01',
      title: 'J-GMP Computerized System Validation',
      description:
        'Computerized systems used in pharmaceutical manufacturing and quality operations in Japan shall be validated per the MHLW guideline on CSV (Computerized System Validation). The guideline aligns with GAMP 5 principles but includes Japan-specific requirements including: CSV categorization (equivalent to GAMP categories), risk-based validation approach, operational management (including periodic review), and IT infrastructure qualification.',
      category: 'Computer Systems',
      tags: ['j-gmp', 'csv', 'computerized-system', 'validation'],
      riskLevel: 'high',
      regulatoryRef: 'MHLW CSV Guideline (PFSB Notification 1003 No. 11)',
    },
    {
      templateId: 'jp-pharma:data-integrity:req-01',
      title: 'J-GMP Data Integrity Requirements',
      description:
        'Data integrity requirements for Japanese pharmaceutical operations shall align with PIC/S PI 041-1 guidance (of which Japan/PMDA is a PIC/S member) and MHLW expectations. Requirements include: ALCOA+ principles application, electronic record controls per CSV guideline, audit trail implementation and review, prevention of unauthorized data modification, and data governance framework. PMDA inspections increasingly focus on data integrity.',
      category: 'Data Integrity',
      tags: ['j-gmp', 'data-integrity', 'pics', 'alcoa-plus'],
      riskLevel: 'critical',
      regulatoryRef: 'PIC/S PI 041-1; MHLW Data Integrity Communication',
    },

    // -----------------------------------------------------------------------
    // Japanese Pharmacopoeia (JP)
    // -----------------------------------------------------------------------
    {
      templateId: 'jp-pharma:quality-standards:req-01',
      title: 'Japanese Pharmacopoeia (JP) Compliance',
      description:
        'Active pharmaceutical ingredients, excipients, and finished products marketed in Japan shall comply with the Japanese Pharmacopoeia (Nihon Yakkyokuhou) monographs and general chapters where listed. JP 18th edition (JP XVIII) provides: monograph specifications (identity, purity, assay), general tests and methods, reference standards, and general notices. JP compliance shall be referenced in CTD Module 3 and manufacturing specifications.',
      category: 'Quality Standards',
      tags: ['japanese-pharmacopoeia', 'jp-xviii', 'monographs', 'specifications'],
      riskLevel: 'high',
      regulatoryRef: 'Japanese Pharmacopoeia 18th Edition; MHLW Notification',
    },
  ],

  tests: [
    {
      templateId: 'jp-pharma:regulatory:tst-01',
      title: 'Verify PMDA Submission and Approval Process',
      description:
        'Review the PMDA regulatory submission package. Verify: eCTD is compiled per PMDA specification, submission via PMDA Gateway is documented, Japanese translations for Module 1 and 2 are complete, PMDA consultation records (jizensodan) are maintained, and the approval timeline is tracked with milestone management.',
      category: 'Regulatory',
      tags: ['pmda', 'submission', 'ectd-test'],
      linkedReqTags: ['pmda', 'marketing-approval', 'ectd'],
    },
    {
      templateId: 'jp-pharma:gmp:tst-01',
      title: 'Verify PMDA GMP Inspection Readiness',
      description:
        'Conduct a mock PMDA GMP inspection. Verify: GMP compliance certificate is current, quality management and manufacturing control directors are designated, documentation is available in Japanese or with certified translations, validation records are complete, deviation and CAPA records demonstrate effective quality systems, and change control procedures meet PMDA expectations.',
      category: 'GMP',
      tags: ['pmda', 'gmp-inspection', 'readiness-test'],
      linkedReqTags: ['pmda', 'gmp-inspection', 'compliance-certificate'],
    },
    {
      templateId: 'jp-pharma:pharmacovigilance:tst-01',
      title: 'Verify PMDA Pharmacovigilance Compliance',
      description:
        'Review pharmacovigilance operations for PMDA compliance. Verify: prompt ADR reports are submitted within 15/30 day timelines, PSURs are prepared per schedule, the RMP is filed and updated, re-examination studies (sai-shinsa) are conducted during the re-examination period, and PMS study plans are approved and executed per PMDA requirements.',
      category: 'Pharmacovigilance',
      tags: ['pmda', 'pharmacovigilance', 'compliance-test'],
      linkedReqTags: ['pmda', 'pharmacovigilance', 'adr-reporting'],
    },
    {
      templateId: 'jp-pharma:computer-systems:tst-01',
      title: 'Verify J-GMP CSV Compliance',
      description:
        'Review computerized system validation for J-GMP compliance. Verify: CSV categorization follows the MHLW guideline, risk assessment drives validation scope, validation documentation (URS, FS, IQ/OQ/PQ) is complete, operational management procedures include periodic review, IT infrastructure is qualified, and audit trail is implemented for GMP-critical systems.',
      category: 'Computer Systems',
      tags: ['j-gmp', 'csv', 'compliance-test'],
      linkedReqTags: ['j-gmp', 'csv', 'computerized-system'],
    },
    {
      templateId: 'jp-pharma:quality-standards:tst-01',
      title: 'Verify Japanese Pharmacopoeia Compliance',
      description:
        'Review JP compliance for representative APIs and finished products. Verify: applicable JP monographs are identified, specifications reference JP methods and limits, reference standards are traceable to JP reference standards, test methods are validated per JP general chapters, and any deviations from JP monographs are justified and approved by the quality unit.',
      category: 'Quality Standards',
      tags: ['japanese-pharmacopoeia', 'compliance', 'monograph-test'],
      linkedReqTags: ['japanese-pharmacopoeia', 'jp-xviii', 'monographs'],
    },
  ],
};

export default templateSet;
