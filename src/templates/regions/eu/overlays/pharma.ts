/**
 * European Union + Pharmaceutical Vertical — Overlay Template
 *
 * EU-specific pharmaceutical regulatory requirements that layer on top of
 * the EU base and the pharma vertical common templates. Covers EU GMP
 * Annex 11, EMA guidelines, and Falsified Medicines Directive (FMD).
 */

import type { VerticalTemplateSet } from '../../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'pharma',
  projectType: undefined,
  requirements: [
    // -----------------------------------------------------------------------
    // EU GMP Annex 11 — Computerized Systems
    // -----------------------------------------------------------------------
    {
      title: 'EU GMP Annex 11 — Computerized Systems in GMP',
      description:
        'All GxP-relevant computerized systems used in EU pharmaceutical manufacturing and quality operations shall comply with EU GMP Annex 11 (2011). Requirements include: risk management throughout the system lifecycle, personnel training and defined responsibilities, supplier assessment for commercial off-the-shelf software, validation documentation, data integrity controls, accuracy checks for manual data entry, storage and backup, printout capability, change and configuration management, periodic evaluation, and business continuity planning.',
      category: 'Computer Systems',
      tags: ['annex-11', 'eu-gmp', 'computerized-systems', 'validation'],
      riskLevel: 'critical',
      regulatoryRef: 'EU GMP Annex 11 (2011); EudraLex Volume 4',
    },
    {
      title: 'EU GMP Annex 11 — Audit Trail Requirements',
      description:
        'Per EU GMP Annex 11 Section 9, computerized systems creating, modifying, or deleting GMP-relevant data shall include an audit trail recording: the operator identity (who), date and time (when), the data changed including old and new values (what), and the reason for change (why). Audit trail review shall be part of routine GMP operations. The audit trail shall be protected from modification and available for inspection.',
      category: 'Data Integrity',
      tags: ['annex-11', 'audit-trail', 'data-integrity', 'gmp-data'],
      riskLevel: 'critical',
      regulatoryRef: 'EU GMP Annex 11 Section 9; EMA Q&A on Data Integrity',
    },
    {
      title: 'EU GMP Annex 11 — Electronic Signatures',
      description:
        'Electronic signatures used within EU GMP computerized systems shall have the same legal impact as handwritten signatures per EU GMP Annex 11 Section 14. Electronic signatures shall be: permanently linked to the signed record, include date and time of signing, clearly indicate the meaning of the signature (e.g., approval, review, authoring), and be uniquely identifiable to the signatory. eIDAS-qualified signatures may be used for regulatory submissions.',
      category: 'Electronic Signatures',
      tags: ['annex-11', 'electronic-signatures', 'eidas', 'gmp-signing'],
      riskLevel: 'high',
      regulatoryRef: 'EU GMP Annex 11 Section 14; eIDAS Regulation',
    },
    {
      title: 'EMA Data Integrity Guidance Compliance',
      description:
        'Data integrity practices shall align with EMA\'s expectations communicated through Q&A documents and GMP inspection findings. Requirements include: no shared login accounts, protection of original (raw) data, prohibition of data modification without audit trail, regular audit trail review, data governance policies, documented data lifecycle management, and training on data integrity principles for all GMP personnel.',
      category: 'Data Integrity',
      tags: ['ema', 'data-integrity', 'gmp-inspection', 'data-governance'],
      riskLevel: 'critical',
      regulatoryRef: 'EMA Q&A on Data Integrity; PIC/S PI 041-1',
    },

    // -----------------------------------------------------------------------
    // EMA Regulatory Guidelines
    // -----------------------------------------------------------------------
    {
      title: 'EMA Marketing Authorisation and Variations',
      description:
        'Changes to approved medicinal products in the EU shall follow the EMA/EC Variations Regulation (1234/2008). Changes shall be classified as: Type IA (minor, notify within 12 months), Type IB (minor, 30-day review), Type II (major, requires assessment), or Extension. The system shall support variation tracking, classification, and regulatory timeline management. Annual reassessment and PSUR submissions shall be tracked.',
      category: 'Regulatory Affairs',
      tags: ['ema', 'variations', 'marketing-authorisation', 'type-ia-ib-ii'],
      riskLevel: 'high',
      regulatoryRef: 'EC Regulation 1234/2008; EMA Variation Classification Guideline',
    },
    {
      title: 'EU Pharmacovigilance (GVP) Compliance',
      description:
        'Pharmacovigilance activities shall comply with EMA Good Pharmacovigilance Practices (GVP) modules. Requirements include: a pharmacovigilance system master file (PSMF) per GVP Module II, individual case safety reports (ICSRs) via EudraVigilance using ICH E2B(R3) format, periodic safety update reports (PSURs/PBRERs) per GVP Module VII, risk management plans (RMPs) per GVP Module V, and signal detection per GVP Module IX.',
      category: 'Pharmacovigilance',
      tags: ['gvp', 'eudravigilance', 'psmf', 'rmp'],
      riskLevel: 'critical',
      regulatoryRef: 'EU GVP Modules I-XVI; Directive 2010/84/EU',
    },
    {
      title: 'EMA Guideline on Computerised Systems in Clinical Trials',
      description:
        'Computerised systems used in EU clinical trials shall comply with the EMA Reflection Paper on expectations for electronic source data and data transcribed to eCRFs. Requirements include: validated systems, data protection per GDPR, audit trail for all data changes, certified copies, direct access for inspectors, and electronic archival. The Clinical Trials Information System (CTIS) shall be used for EU clinical trial applications under CTR 536/2014.',
      category: 'Clinical Systems',
      tags: ['ema', 'clinical-trials', 'edc', 'ctis'],
      riskLevel: 'high',
      regulatoryRef: 'EMA Reflection Paper on Electronic Source Data; EU CTR 536/2014',
    },

    // -----------------------------------------------------------------------
    // Falsified Medicines Directive (FMD)
    // -----------------------------------------------------------------------
    {
      title: 'EU Falsified Medicines Directive (FMD) Compliance',
      description:
        'Prescription medicines in the EU shall comply with the Falsified Medicines Directive (2011/62/EU) and the Delegated Regulation (EU) 2016/161. Requirements include: unique identifier (2D DataMatrix with serialization) and anti-tampering device on each pack, verification against the EU Hub / national verification systems (EMVS/NMVS) at dispensing, manufacturer upload of serial data, and alert management for verification failures.',
      category: 'Supply Chain Security',
      tags: ['fmd', 'serialization', 'emvs', 'anti-tampering'],
      riskLevel: 'high',
      regulatoryRef: 'Directive 2011/62/EU; Delegated Regulation (EU) 2016/161',
    },
  ],

  tests: [
    {
      title: 'Verify EU GMP Annex 11 Computerized System Controls',
      description:
        'Review a representative GxP computerized system for Annex 11 compliance. Verify: validation documentation is complete and current, supplier assessment is documented (for COTS systems), risk assessment drives the validation approach, data integrity controls meet Annex 11 Sections 7-12, periodic evaluation is performed, and business continuity measures (backup, disaster recovery) are tested.',
      category: 'Computer Systems',
      tags: ['annex-11', 'computerized-systems', 'compliance-test'],
      linkedReqTags: ['annex-11', 'eu-gmp', 'computerized-systems'],
    },
    {
      title: 'Verify Annex 11 Audit Trail Compliance',
      description:
        'Test audit trail functionality for a GMP computerized system. Create, modify, and delete GMP records. Verify: each change generates an audit trail entry with who/what/when/why, old and new values are captured, the audit trail cannot be modified or disabled by users, audit trail data is included in backups, and audit trail review is part of documented GMP procedures (e.g., batch record review).',
      category: 'Data Integrity',
      tags: ['annex-11', 'audit-trail', 'compliance-test'],
      linkedReqTags: ['annex-11', 'audit-trail', 'data-integrity'],
    },
    {
      title: 'Verify EMA Data Integrity Expectations',
      description:
        'Assess data integrity controls against EMA and PIC/S expectations. Verify: no shared user accounts exist, original (raw) data is protected from deletion, data modifications are captured in audit trails, regular audit trail review is documented, data governance policies are established, and GMP personnel are trained on data integrity principles with documented evidence.',
      category: 'Data Integrity',
      tags: ['ema', 'data-integrity', 'assessment-test'],
      linkedReqTags: ['ema', 'data-integrity', 'data-governance'],
    },
    {
      title: 'Verify FMD Serialization and Verification',
      description:
        'Test FMD compliance end-to-end. Verify: unique identifiers (2D DataMatrix) are generated and applied per GS1 standards, serial data is uploaded to the EU Hub, verification against EMVS/NMVS succeeds for legitimate packs, tampered packs generate alerts, decommissioning at dispensing point works correctly, and alert management procedures are defined for verification failures.',
      category: 'Supply Chain Security',
      tags: ['fmd', 'serialization', 'verification-test'],
      linkedReqTags: ['fmd', 'serialization', 'emvs'],
    },
    {
      title: 'Verify EU GVP Pharmacovigilance System',
      description:
        'Audit the pharmacovigilance system for EU GVP compliance. Verify: PSMF is current and describes the PV system, ICSRs are submitted to EudraVigilance in E2B(R3) format within mandated timelines (15 days for serious/unexpected), PSURs/PBRERs are prepared per schedule, the RMP is maintained and updated as needed, and signal detection processes are documented and operational.',
      category: 'Pharmacovigilance',
      tags: ['gvp', 'eudravigilance', 'audit-test'],
      linkedReqTags: ['gvp', 'eudravigilance', 'psmf'],
    },
  ],
};

export default templateSet;
