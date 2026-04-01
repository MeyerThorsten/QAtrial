/**
 * United States + Pharmaceutical Vertical — Overlay Template
 *
 * US-specific pharmaceutical regulatory requirements that layer on top of
 * the US base and the pharma vertical common templates. Covers FDA cGMP,
 * Part 11 pharma-specific guidance, DSCSA, REMS, and FDA inspection readiness.
 */

import type { VerticalTemplateSet } from '../../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'pharma',
  projectType: undefined,
  requirements: [
    // -----------------------------------------------------------------------
    // 21 CFR 210/211 — cGMP
    // -----------------------------------------------------------------------
    {
      templateId: 'us-pharma:gmp:req-01',
      title: 'FDA 21 CFR 211 — cGMP for Finished Pharmaceuticals',
      description:
        'Manufacturing operations shall comply with 21 CFR Part 211 cGMP requirements including: organization and personnel (Subpart B), buildings and facilities (Subpart C), equipment (Subpart D), production and process controls (Subpart F), packaging and labeling controls (Subpart G), holding and distribution (Subpart H), laboratory controls (Subpart I), records and reports (Subpart J), and returned and salvaged drug products (Subpart K). SOPs shall be maintained for all GMP operations.',
      category: 'GMP',
      tags: ['cgmp', '21-cfr-211', 'fda', 'finished-pharma'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR Parts 210 and 211',
    },
    {
      templateId: 'us-pharma:computer-systems:req-01',
      title: 'FDA 21 CFR 211.68 — Automatic Data Processing Systems',
      description:
        'Computerized systems used in manufacturing, processing, packing, or holding of drug products shall be validated per 21 CFR 211.68. Input and output data shall be checked for accuracy. Backup systems shall ensure data is exact and complete. Hard copy or alternative systems shall be available in case of system failure.',
      category: 'Computer Systems',
      tags: ['cgmp', '211-68', 'computer-systems', 'backup'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 211.68',
    },

    // -----------------------------------------------------------------------
    // Part 11 — Pharma-Specific Application
    // -----------------------------------------------------------------------
    {
      templateId: 'us-pharma:regulatory-compliance:req-01',
      title: 'FDA Part 11 — Pharma-Specific Scope Assessment',
      description:
        'A 21 CFR Part 11 scope assessment shall be performed per FDA guidance "Scope and Application" (2003). Predicate rule records requiring Part 11 compliance in the pharmaceutical context include: batch production records (211.186-188), laboratory records (211.194), stability records (211.166), complaint files (211.198), distribution records (211.196), and validation records. The assessment shall distinguish records subject to Part 11 from those that are not.',
      category: 'Regulatory Compliance',
      tags: ['part-11', 'scope-assessment', 'predicate-rules', 'fda-guidance'],
      riskLevel: 'high',
      regulatoryRef: 'FDA Guidance: 21 CFR Part 11 Scope and Application (2003)',
    },
    {
      templateId: 'us-pharma:data-integrity:req-01',
      title: 'FDA Data Integrity Guidance Compliance',
      description:
        'Data integrity controls shall align with FDA data integrity guidance (2018) and ALCOA+ principles. Requirements include: attribution (who), legibility (readable), contemporaneousness (real-time), originality (first capture), accuracy (correct), completeness, consistency, enduring (available throughout retention), and available (accessible when needed). Original data and true copies shall be maintained.',
      category: 'Data Integrity',
      tags: ['data-integrity', 'alcoa-plus', 'fda-guidance', 'original-data'],
      riskLevel: 'critical',
      regulatoryRef: 'FDA Guidance: Data Integrity and Compliance with Drug CGMP (2018)',
    },

    // -----------------------------------------------------------------------
    // cGMP for APIs
    // -----------------------------------------------------------------------
    {
      templateId: 'us-pharma:gmp:req-02',
      title: 'FDA cGMP for Active Pharmaceutical Ingredients',
      description:
        'API manufacturing shall comply with ICH Q7 as adopted by FDA. Specific US requirements include: FDA registration of API facilities, Drug Master File (DMF) Type II submissions, compliance with Current Good Manufacturing Practice (cGMP) for starting materials through final API, and readiness for FDA pre-approval inspections (PAI) for APIs in new drug applications.',
      category: 'GMP',
      tags: ['api', 'cgmp', 'ich-q7', 'dmf', 'fda-registration'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH Q7; 21 CFR 211; FDA Compliance Program 7356.002F',
    },

    // -----------------------------------------------------------------------
    // FDA Inspection Readiness
    // -----------------------------------------------------------------------
    {
      templateId: 'us-pharma:regulatory:req-01',
      title: 'FDA Inspection Readiness Program',
      description:
        'A continuous FDA inspection readiness program shall be maintained. The program shall include: designated inspection host team, current facility tour route, organized document rooms (paper and electronic), back-room support team procedures, procedures for handling FDA 483 observations, response timeline management (15 business days), mock inspection schedule (at least annually), and training on interaction with FDA investigators.',
      category: 'Regulatory',
      tags: ['fda-inspection', 'readiness', '483', 'mock-inspection'],
      riskLevel: 'high',
      regulatoryRef: 'FDA Compliance Program Guidance Manuals; 21 CFR 211',
    },
    {
      templateId: 'us-pharma:regulatory:req-02',
      title: 'FDA 483 and Warning Letter Response Management',
      description:
        'A procedure shall be maintained for managing FDA Form 483 observations and Warning Letters. The procedure shall define: immediate containment actions within 24 hours, comprehensive CAPA within 15 business days of 483 issuance, Warning Letter response strategy, executive management notification, commitment tracking, and evidence of completion. Responses shall be reviewed by regulatory affairs and legal counsel.',
      category: 'Regulatory',
      tags: ['fda-483', 'warning-letter', 'response', 'capa'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 211; FDA Regulatory Procedures Manual',
    },

    // -----------------------------------------------------------------------
    // REMS
    // -----------------------------------------------------------------------
    {
      templateId: 'us-pharma:drug-safety:req-01',
      title: 'Risk Evaluation and Mitigation Strategy (REMS)',
      description:
        'For products with an approved REMS, the system shall support REMS program management including: Elements to Assure Safe Use (ETASU) tracking, prescriber/pharmacy/patient certification, medication guide distribution, communication plan execution, and REMS assessment reporting to FDA at defined intervals. The system shall prevent dispensing to non-certified entities when ETASU requires certification.',
      category: 'Drug Safety',
      tags: ['rems', 'etasu', 'drug-safety', 'risk-mitigation'],
      riskLevel: 'critical',
      regulatoryRef: 'FDCA Section 505-1; FDA REMS Guidance',
    },

    // -----------------------------------------------------------------------
    // DSCSA
    // -----------------------------------------------------------------------
    {
      templateId: 'us-pharma:supply-chain:req-01',
      title: 'Drug Supply Chain Security Act (DSCSA) Compliance',
      description:
        'The system shall support DSCSA requirements for pharmaceutical product tracing. By the 2023+ enhanced requirements: interoperable electronic tracing at package level using standardized numerical identifiers (SNI), transaction information (TI), transaction history (TH), and transaction statements (TS). Verification of product identifiers (saleable returns, suspect/illegitimate product) shall be supported. Data exchange shall use EPCIS standards.',
      category: 'Supply Chain',
      tags: ['dscsa', 'track-trace', 'serialization', 'supply-chain'],
      riskLevel: 'high',
      regulatoryRef: 'Drug Supply Chain Security Act (DSCSA); 21 USC 360eee',
    },

    // -----------------------------------------------------------------------
    // Annual Reporting
    // -----------------------------------------------------------------------
    {
      templateId: 'us-pharma:regulatory:req-03',
      title: 'FDA Annual Report and Regulatory Submissions',
      description:
        'The system shall support generation of data for FDA regulatory submissions including: Annual Reports (21 CFR 314.81(b)(2)) covering manufacturing changes, product quality data, and distribution data; Field Alert Reports (FAR) within three working days; Biological Product Deviation Reports (BPDR) for biologics; and NDA/ANDA/BLA supplement management. Submission timelines shall be tracked and escalated.',
      category: 'Regulatory',
      tags: ['annual-report', 'far', 'regulatory-submissions', 'nda'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 314.81(b)(2); 21 CFR 600.14',
    },
  ],

  tests: [
    {
      templateId: 'us-pharma:gmp:tst-01',
      title: 'Verify 21 CFR 211 cGMP System Compliance',
      description:
        'Conduct a comprehensive review of cGMP compliance against 21 CFR 211 requirements. Verify: SOPs exist for all GMP operations, batch records capture required information (211.186-188), laboratory records meet 211.194 requirements, equipment cleaning and use logs are maintained, and rejected materials are properly controlled.',
      category: 'GMP',
      tags: ['cgmp', '21-cfr-211', 'compliance-test'],
      linkedReqTags: ['cgmp', '21-cfr-211', 'fda'],
    },
    {
      templateId: 'us-pharma:compliance:tst-01',
      title: 'Verify Part 11 Predicate Rule Coverage',
      description:
        'Review the Part 11 scope assessment document. Verify all predicate rule records have been identified. For each identified record type, verify: audit trail is implemented, electronic signatures meet Part 11 requirements, access controls are appropriate, and the system is validated. Test a representative sample of electronic records for Part 11 compliance.',
      category: 'Compliance',
      tags: ['part-11', 'predicate-rules', 'scope-test'],
      linkedReqTags: ['part-11', 'scope-assessment', 'predicate-rules'],
    },
    {
      templateId: 'us-pharma:data-integrity:tst-01',
      title: 'Verify ALCOA+ Data Integrity Controls',
      description:
        'Assess data integrity controls against ALCOA+ principles. For a representative GxP system: create a record (verify attribution, contemporaneousness), modify it (verify audit trail captures before/after), attempt to delete it (verify protection of original), export it (verify completeness), and verify the record remains accessible through the required retention period.',
      category: 'Data Integrity',
      tags: ['data-integrity', 'alcoa-plus', 'controls-test'],
      linkedReqTags: ['data-integrity', 'alcoa-plus', 'original-data'],
    },
    {
      templateId: 'us-pharma:regulatory:tst-01',
      title: 'Verify FDA Inspection Readiness',
      description:
        'Conduct a mock FDA inspection. Verify: the host team can assemble within 30 minutes, the facility tour route is current and presentable, document retrieval (paper and electronic) can be completed within a reasonable timeframe, the back-room team can support investigator requests, and 483 observation response procedures are understood by the quality team.',
      category: 'Regulatory',
      tags: ['fda-inspection', 'mock-inspection', 'readiness-test'],
      linkedReqTags: ['fda-inspection', 'readiness', 'mock-inspection'],
    },
    {
      templateId: 'us-pharma:regulatory:tst-02',
      title: 'Verify FDA 483 Response Process',
      description:
        'Simulate receipt of FDA 483 observations. Verify: management is notified within 24 hours, containment actions are initiated for critical observations, root cause analysis begins promptly, a comprehensive response is drafted within 15 business days, the response addresses each observation with specific CAPA and timelines, and regulatory/legal review is completed before submission.',
      category: 'Regulatory',
      tags: ['fda-483', 'response', 'simulation-test'],
      linkedReqTags: ['fda-483', 'warning-letter', 'response'],
    },
    {
      templateId: 'us-pharma:drug-safety:tst-01',
      title: 'Verify REMS Program Controls',
      description:
        'For a REMS product, verify: ETASU requirements are enforced by the system, prescriber certification is verified before order processing, patient enrollment/consent is captured, medication guides are distributed with each dispensing, and REMS assessment data can be generated for FDA reporting at required intervals.',
      category: 'Drug Safety',
      tags: ['rems', 'etasu', 'controls-test'],
      linkedReqTags: ['rems', 'etasu', 'drug-safety'],
    },
    {
      templateId: 'us-pharma:supply-chain:tst-01',
      title: 'Verify DSCSA Track-and-Trace Capability',
      description:
        'Test the DSCSA compliance capabilities: verify product serialization data (SNI) can be captured and stored, transaction information and history can be exchanged with trading partners, suspect/illegitimate product verification is functional, saleable returns verification works correctly, and EPCIS data format is generated accurately.',
      category: 'Supply Chain',
      tags: ['dscsa', 'serialization', 'tracing-test'],
      linkedReqTags: ['dscsa', 'track-trace', 'serialization'],
    },
  ],
};

export default templateSet;
