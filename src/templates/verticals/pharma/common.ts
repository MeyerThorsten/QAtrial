/**
 * Pharmaceutical Industry Vertical — Common Templates
 *
 * Comprehensive GxP requirements and tests applicable to pharmaceutical
 * manufacturing, quality control, and regulatory compliance. These templates
 * apply to all pharma projects regardless of country or project type.
 */

import type { VerticalTemplateSet } from '../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'pharma',
  requirements: [
    // -----------------------------------------------------------------------
    // GMP Fundamentals
    // -----------------------------------------------------------------------
    {
      templateId: 'pharma:gmp:req-01',
      title: 'GMP Quality System Foundation',
      description:
        'A pharmaceutical quality system (PQS) compliant with ICH Q10 shall be established and maintained. The PQS shall encompass GMP requirements, define quality objectives, allocate resources, and establish communication channels to ensure product quality throughout the lifecycle.',
      category: 'GMP',
      tags: ['gmp', 'quality-system', 'ich-q10'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH Q10; 21 CFR 211 Subpart B',
    },
    {
      title: 'cGMP Compliance for API Manufacturing',
      description:
        'Active Pharmaceutical Ingredient (API) manufacturing operations shall comply with ICH Q7 guidelines covering: quality management, personnel, buildings/facilities, process equipment, documentation, materials management, production and in-process controls, packaging and labeling, storage and distribution, and laboratory controls.',
      category: 'GMP',
      tags: ['gmp', 'api', 'ich-q7', 'manufacturing'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH Q7; 21 CFR Parts 210/211',
    },

    // -----------------------------------------------------------------------
    // Process Validation
    // -----------------------------------------------------------------------
    {
      title: 'Process Validation Lifecycle Approach',
      description:
        'Process validation shall follow the FDA lifecycle approach encompassing three stages: Stage 1 (Process Design) — defining commercial process based on development knowledge; Stage 2 (Process Qualification) — IQ/OQ/PQ of facility, utilities, and equipment; Stage 3 (Continued Process Verification) — ongoing assurance of validated state during routine production.',
      category: 'Validation',
      tags: ['process-validation', 'iq-oq-pq', 'lifecycle'],
      riskLevel: 'critical',
      regulatoryRef: 'FDA Guidance on Process Validation (2011); 21 CFR 211.100',
    },

    // -----------------------------------------------------------------------
    // Cleaning Validation
    // -----------------------------------------------------------------------
    {
      title: 'Cleaning Validation Program',
      description:
        'A cleaning validation program shall demonstrate that cleaning procedures effectively remove product residues, cleaning agents, and microbial contamination to predetermined acceptable levels. Validation shall address: worst-case product groupings (toxicity-based limits per EMA/FDA guidance), sampling methods (swab and rinse), analytical method validation, and hold-time studies for dirty and clean equipment.',
      category: 'Validation',
      tags: ['cleaning-validation', 'residue', 'cross-contamination'],
      riskLevel: 'high',
      regulatoryRef: 'FDA Guide to Inspection of Validation of Cleaning Processes; EMA Guideline on Shared Facilities',
    },

    // -----------------------------------------------------------------------
    // Environmental Monitoring
    // -----------------------------------------------------------------------
    {
      title: 'Environmental Monitoring Program',
      description:
        'An environmental monitoring (EM) program shall be established for all classified manufacturing areas. The program shall define: monitoring locations (based on risk assessment), sampling frequency, alert and action limits for viable and non-viable particulates, trending requirements, and excursion investigation procedures. EM data shall be reviewed as part of batch disposition.',
      category: 'GMP',
      tags: ['environmental-monitoring', 'cleanroom', 'particulates'],
      riskLevel: 'high',
      regulatoryRef: 'FDA Guidance on Sterile Drug Products; EU GMP Annex 1',
    },

    // -----------------------------------------------------------------------
    // Stability Testing
    // -----------------------------------------------------------------------
    {
      title: 'Stability Testing Program',
      description:
        'A stability testing program per ICH Q1A-Q1E shall be maintained to establish shelf life and storage conditions. The program shall include: selection of batches (at least one batch per year per product), testing intervals per ICH guidelines, storage conditions (long-term, accelerated, stress), specification limits, and out-of-specification investigation procedures.',
      category: 'Quality Control',
      tags: ['stability', 'shelf-life', 'ich-q1'],
      riskLevel: 'high',
      regulatoryRef: 'ICH Q1A(R2); 21 CFR 211.166',
    },

    // -----------------------------------------------------------------------
    // Batch Record Review
    // -----------------------------------------------------------------------
    {
      title: 'Batch Record Review and Release',
      description:
        'Each production batch record shall be reviewed by the quality unit before batch disposition. Review shall verify: identity and quantity of raw materials, critical process parameters within specification, in-process test results, yield calculations, equipment usage and cleaning status, deviations, and environmental monitoring data. Batch release shall require quality unit approval.',
      category: 'Production',
      tags: ['batch-record', 'review', 'release'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 211.192; EU GMP Chapter 6',
    },

    // -----------------------------------------------------------------------
    // Deviation Management
    // -----------------------------------------------------------------------
    {
      title: 'Pharmaceutical Deviation Management',
      description:
        'All deviations from approved manufacturing procedures, specifications, or validated parameters shall be documented, investigated, and resolved per a written procedure. Critical deviations shall be escalated immediately to the quality unit. Deviation impact on batch quality and patient safety shall be assessed before batch disposition.',
      category: 'Quality Management',
      tags: ['deviation', 'investigation', 'batch-impact'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 211.192; EU GMP Chapter 1.4(xiv)',
    },

    // -----------------------------------------------------------------------
    // CAPA System
    // -----------------------------------------------------------------------
    {
      title: 'Pharmaceutical CAPA System',
      description:
        'A CAPA system shall be maintained to address recurring deviations, complaint trends, audit findings, and regulatory observations. CAPAs shall include: root cause analysis, risk assessment, corrective and preventive actions, implementation verification, and effectiveness checks. CAPA metrics shall be reported in management review.',
      category: 'Quality Management',
      tags: ['capa', 'root-cause', 'effectiveness'],
      riskLevel: 'high',
      regulatoryRef: 'ICH Q10 Section 3.2; 21 CFR 211.192',
    },

    // -----------------------------------------------------------------------
    // Change Control
    // -----------------------------------------------------------------------
    {
      title: 'Pharmaceutical Change Control System',
      description:
        'All changes to GMP-relevant systems, processes, equipment, materials, specifications, or procedures shall be managed through a formal change control system. Changes shall be classified by potential impact on product quality and regulatory status. Pre-approval regulatory submissions (SUPPL, CBE-30, annual report) shall be determined during change assessment.',
      category: 'Change Management',
      tags: ['change-control', 'impact-assessment', 'regulatory-filing'],
      riskLevel: 'high',
      regulatoryRef: 'ICH Q10 Section 3.2.4; 21 CFR 314.70',
    },

    // -----------------------------------------------------------------------
    // Supplier Qualification
    // -----------------------------------------------------------------------
    {
      title: 'Pharmaceutical Supplier Qualification',
      description:
        'Suppliers of APIs, excipients, primary packaging materials, and GMP-critical services shall be qualified through: quality questionnaire, on-site audit (risk-based), quality agreement, and ongoing monitoring. Supplier qualification status shall be reviewed annually and following significant quality events.',
      category: 'Supplier Quality',
      tags: ['supplier', 'qualification', 'quality-agreement'],
      riskLevel: 'high',
      regulatoryRef: 'ICH Q10 Section 2.7; 21 CFR 211.84',
    },

    // -----------------------------------------------------------------------
    // Annual Product Review
    // -----------------------------------------------------------------------
    {
      title: 'Annual Product Quality Review (APQR)',
      description:
        'An annual product quality review shall be conducted for each product covering: batch analysis results, out-of-specification investigations, deviations, changes, stability data, returns/complaints, CAPA status, reprocessing, process capability trends, and post-market commitments. The review shall identify trends and opportunities for improvement.',
      category: 'Quality Management',
      tags: ['apqr', 'product-review', 'trending'],
      riskLevel: 'medium',
      regulatoryRef: '21 CFR 211.180(e); EU GMP Chapter 1.10',
    },

    // -----------------------------------------------------------------------
    // Equipment Calibration
    // -----------------------------------------------------------------------
    {
      title: 'Equipment Calibration and Maintenance Program',
      description:
        'All GMP-critical instruments and equipment shall be included in a calibration program with defined intervals, methods, and acceptance criteria traceable to NIST or equivalent national standards. Calibration status shall be clearly indicated on equipment. Out-of-calibration events shall trigger impact assessments on previously manufactured batches.',
      category: 'Equipment',
      tags: ['calibration', 'maintenance', 'traceability'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 211.68; EU GMP Chapter 3',
    },

    // -----------------------------------------------------------------------
    // Water System
    // -----------------------------------------------------------------------
    {
      title: 'Pharmaceutical Water System Qualification',
      description:
        'Purified Water and Water for Injection systems shall be qualified through a three-phase approach: Phase 1 (2 weeks daily sampling), Phase 2 (2 weeks operational), Phase 3 (1 year seasonal). Ongoing monitoring shall include TOC, conductivity, microbial counts, and endotoxin (WFI). Alert and action limits shall be established and trended.',
      category: 'Utilities',
      tags: ['water-system', 'purified-water', 'wfi', 'qualification'],
      riskLevel: 'high',
      regulatoryRef: 'USP <1231>; EU GMP Annex 1; WHO TRS 970',
    },

    // -----------------------------------------------------------------------
    // Computerized System Validation
    // -----------------------------------------------------------------------
    {
      title: 'Computerized System Validation (CSV)',
      description:
        'All GxP-relevant computerized systems shall be validated per a risk-based approach (GAMP 5). Validation deliverables shall include: User Requirements Specification (URS), Functional Specification, risk assessment, validation plan, IQ/OQ/PQ protocols, traceability matrix, and validation summary report. The system shall comply with 21 CFR Part 11 / EU Annex 11 as applicable.',
      category: 'Validation',
      tags: ['csv', 'gamp5', 'part-11', 'annex-11'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR Part 11; EU Annex 11; GAMP 5',
    },

    // -----------------------------------------------------------------------
    // Pharmacovigilance
    // -----------------------------------------------------------------------
    {
      title: 'Pharmacovigilance System and Reporting',
      description:
        'A pharmacovigilance system shall be established to collect, assess, and report adverse drug reactions. Individual Case Safety Reports (ICSRs) shall be submitted to regulatory authorities within mandated timelines (15 days for serious/unexpected, 90 days for periodic). Signal detection and risk-benefit evaluation shall be performed periodically.',
      category: 'Regulatory',
      tags: ['pharmacovigilance', 'adverse-event', 'icsr', 'safety'],
      riskLevel: 'critical',
      regulatoryRef: 'ICH E2A; 21 CFR 314.80; EU GVP Module VI',
    },

    // -----------------------------------------------------------------------
    // GDP Transport
    // -----------------------------------------------------------------------
    {
      title: 'Good Distribution Practice (GDP) Compliance',
      description:
        'Storage and distribution of pharmaceutical products shall comply with GDP guidelines. Temperature-controlled supply chain requirements shall be maintained including: qualified shipping containers, temperature monitoring during transit, deviation investigation for excursions, cold chain management for temperature-sensitive products, and GDP training for logistics personnel.',
      category: 'Distribution',
      tags: ['gdp', 'cold-chain', 'transport', 'temperature'],
      riskLevel: 'high',
      regulatoryRef: 'EU GDP Guidelines 2013/C 343/01; WHO TRS 957 Annex 5',
    },

    // -----------------------------------------------------------------------
    // Labeling Controls
    // -----------------------------------------------------------------------
    {
      title: 'Labeling Control and Reconciliation',
      description:
        'Labeling operations shall include controls to prevent mix-ups: line clearance before operations, label reconciliation (issued vs. used vs. destroyed), electronic verification where feasible, and 100% inspection of critical label elements (product name, strength, lot, expiry). Excess labels shall be destroyed and documented.',
      category: 'Production',
      tags: ['labeling', 'reconciliation', 'mix-up-prevention'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 211.125; EU GMP Annex 13',
    },

    // -----------------------------------------------------------------------
    // Sterility Assurance
    // -----------------------------------------------------------------------
    {
      title: 'Sterility Assurance Program',
      description:
        'For sterile products, a sterility assurance program shall be maintained covering: aseptic process simulation (media fill) at least semi-annually per line, sterilization validation (overkill or bioburden-based), container closure integrity testing, personnel gowning qualification, and environmental monitoring of aseptic processing areas.',
      category: 'GMP',
      tags: ['sterility', 'aseptic', 'media-fill', 'sterilization'],
      riskLevel: 'critical',
      regulatoryRef: 'FDA Guidance on Sterile Drug Products; EU GMP Annex 1 (2022)',
    },

    // -----------------------------------------------------------------------
    // Reference Standards
    // -----------------------------------------------------------------------
    {
      title: 'Reference Standard Management',
      description:
        'A reference standard management program shall ensure that primary and working reference standards are properly characterized, stored under appropriate conditions, assigned expiry dates, and recharacterized at defined intervals. Traceability to pharmacopeial standards (USP, EP, JP) shall be maintained.',
      category: 'Quality Control',
      tags: ['reference-standard', 'characterization', 'pharmacopeial'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 211.194(a); USP General Chapter <11>',
    },

    // -----------------------------------------------------------------------
    // OOS/OOT Investigation
    // -----------------------------------------------------------------------
    {
      title: 'OOS/OOT Investigation Procedure',
      description:
        'Out-of-Specification (OOS) and Out-of-Trend (OOT) results shall be investigated per a written procedure following the FDA OOS guidance. Phase I shall assess laboratory error. Phase II shall assess manufacturing process. Retesting and resampling shall follow predefined rules. Conclusions shall be documented with root cause and CAPA where applicable.',
      category: 'Quality Control',
      tags: ['oos', 'oot', 'investigation', 'laboratory'],
      riskLevel: 'critical',
      regulatoryRef: 'FDA Guidance on OOS (2006); 21 CFR 211.192',
    },
  ],

  tests: [
    // -----------------------------------------------------------------------
    // Test Cases
    // -----------------------------------------------------------------------
    {
      title: 'Process Validation Protocol Verification',
      description:
        'Review the process validation protocol for a representative product. Verify it includes: process description, critical process parameters (CPPs), critical quality attributes (CQAs), acceptance criteria, sampling plan, and statistical rationale. Execute the protocol on three consecutive batches and verify all acceptance criteria are met.',
      category: 'Validation',
      tags: ['process-validation', 'protocol', 'verification'],
      linkedReqTags: ['process-validation', 'iq-oq-pq', 'lifecycle'],
    },
    {
      title: 'Cleaning Validation Execution',
      description:
        'Execute cleaning validation for the worst-case product/equipment combination. Perform swab and rinse sampling at predefined locations. Verify residue levels are below calculated acceptance criteria (based on MACO/PDE approach). Verify analytical methods are validated for the specific matrices.',
      category: 'Validation',
      tags: ['cleaning-validation', 'sampling', 'residue-test'],
      linkedReqTags: ['cleaning-validation', 'residue', 'cross-contamination'],
    },
    {
      title: 'Environmental Monitoring Trend Analysis',
      description:
        'Review 12 months of environmental monitoring data for classified areas. Verify alert and action limit excursions were investigated. Confirm trending analysis was performed and adverse trends were addressed. Verify EM data was considered during batch disposition.',
      category: 'Quality Control',
      tags: ['environmental-monitoring', 'trending', 'data-review'],
      linkedReqTags: ['environmental-monitoring', 'cleanroom', 'particulates'],
    },
    {
      title: 'Deviation Investigation Completeness',
      description:
        'Select five critical deviations from the past year. For each, verify: timely recording, appropriate classification, thorough investigation with root cause analysis, impact assessment on affected batches, CAPA where warranted, and quality unit closure approval.',
      category: 'Quality Management',
      tags: ['deviation', 'investigation', 'audit-test'],
      linkedReqTags: ['deviation', 'investigation', 'batch-impact'],
    },
    {
      title: 'CAPA Effectiveness Verification',
      description:
        'Select five closed CAPAs. For each, verify: root cause was identified, corrective actions were implemented, effectiveness check was performed at the scheduled interval, and the original nonconformance has not recurred. Verify CAPA trending data is reported in management review.',
      category: 'Quality Management',
      tags: ['capa', 'effectiveness', 'verification-test'],
      linkedReqTags: ['capa', 'root-cause', 'effectiveness'],
    },
    {
      title: 'Supplier Audit Program Review',
      description:
        'Review the supplier audit schedule. Verify audit frequency is based on supplier criticality and risk. Select three recent audit reports and verify: scope covered GMP requirements, findings were classified, CAPAs were tracked to closure, and supplier qualification status was updated.',
      category: 'Supplier Quality',
      tags: ['supplier', 'audit', 'program-review'],
      linkedReqTags: ['supplier', 'qualification', 'quality-agreement'],
    },
    {
      title: 'CSV IQ/OQ/PQ Execution Verification',
      description:
        'For a recently validated GxP system, verify: IQ confirmed correct installation and configuration, OQ verified all functional requirements under normal and boundary conditions, PQ demonstrated the system performs as intended under actual operating conditions. Verify traceability from requirements through test cases to results.',
      category: 'Validation',
      tags: ['csv', 'iq-oq-pq', 'execution-test'],
      linkedReqTags: ['csv', 'gamp5', 'part-11'],
    },
    {
      title: 'Stability Data Review and Trending',
      description:
        'Review stability data for a representative product. Verify: batches are enrolled per the stability protocol, testing intervals comply with ICH Q1A, results are within specification, trending analysis is performed, and out-of-trend results are investigated. Verify shelf-life is supported by the data.',
      category: 'Quality Control',
      tags: ['stability', 'trending', 'data-review'],
      linkedReqTags: ['stability', 'shelf-life', 'ich-q1'],
    },
    {
      title: 'Batch Release Checklist Verification',
      description:
        'Observe the batch release process for three batches. Verify: batch record review is complete, all in-process and finished product tests pass, deviations are resolved, environmental monitoring is acceptable, yields are within limits, and quality unit provides documented approval before distribution.',
      category: 'Production',
      tags: ['batch-record', 'release', 'checklist-test'],
      linkedReqTags: ['batch-record', 'review', 'release'],
    },
    {
      title: 'Calibration Verification and Impact Assessment',
      description:
        'Select five GMP-critical instruments. Verify: calibration is current, calibration certificates reference NIST-traceable standards, acceptance criteria are defined, and calibration status is displayed. Simulate an out-of-calibration event and verify the impact assessment procedure is executed for affected batches.',
      category: 'Equipment',
      tags: ['calibration', 'verification', 'impact-test'],
      linkedReqTags: ['calibration', 'maintenance', 'traceability'],
    },
    {
      title: 'Water System Sampling and Trending',
      description:
        'Review the pharmaceutical water system monitoring program. Verify: sampling points cover the full distribution loop, frequency meets regulatory expectations, results for TOC/conductivity/microbial are within alert and action limits, trends are analyzed monthly, and excursions trigger investigation and corrective action.',
      category: 'Utilities',
      tags: ['water-system', 'sampling', 'monitoring-test'],
      linkedReqTags: ['water-system', 'purified-water', 'wfi'],
    },
    {
      title: 'Pharmacovigilance System Audit',
      description:
        'Audit the pharmacovigilance system. Verify: adverse event intake process captures all required ICSR fields, serious/unexpected reports are submitted within 15-day regulatory timelines, periodic safety reports (PSUR/PBRER) are current, signal detection activities are documented, and the QPPV/responsible person is designated and qualified.',
      category: 'Regulatory',
      tags: ['pharmacovigilance', 'audit', 'compliance-test'],
      linkedReqTags: ['pharmacovigilance', 'adverse-event', 'icsr'],
    },
    {
      title: 'GDP Temperature Mapping and Excursion Review',
      description:
        'Review GDP compliance for the distribution chain. Verify: shipping containers are qualified for stated temperature range, temperature monitoring devices are calibrated, excursion investigation procedures are followed, cold chain is maintained for temperature-sensitive products, and GDP training records are current for logistics personnel.',
      category: 'Distribution',
      tags: ['gdp', 'temperature-mapping', 'excursion-test'],
      linkedReqTags: ['gdp', 'cold-chain', 'transport'],
    },
    {
      title: 'Annual Product Quality Review Assessment',
      description:
        'Review the most recent APQR for a representative product. Verify it covers all required elements: batch analysis summaries, deviation/CAPA/change control summaries, stability data, complaint trends, process capability metrics, and regulatory commitment status. Verify management has reviewed and approved the report with documented action items.',
      category: 'Quality Management',
      tags: ['apqr', 'review', 'assessment-test'],
      linkedReqTags: ['apqr', 'product-review', 'trending'],
    },
    {
      title: 'OOS Investigation Protocol Execution',
      description:
        'Review five OOS investigations from the past year. Verify: Phase I laboratory investigation was completed within defined timelines, retesting followed the approved procedure, Phase II manufacturing investigation was initiated when Phase I was inconclusive, conclusions were scientifically justified, and CAPA was initiated for confirmed OOS results.',
      category: 'Quality Control',
      tags: ['oos', 'investigation', 'protocol-test'],
      linkedReqTags: ['oos', 'oot', 'investigation'],
    },
  ],
};

export default templateSet;
