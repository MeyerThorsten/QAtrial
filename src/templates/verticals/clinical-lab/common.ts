/**
 * Clinical Laboratory Industry Vertical — Common Templates
 *
 * Comprehensive clinical lab requirements and tests covering method validation,
 * proficiency testing, personnel competency, equipment calibration, QC (Westgard),
 * reference ranges, LIS validation, critical values, accreditation, inter-lab
 * comparison, TAT SLAs, and LIMS audit trail.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // Method Validation
  // -----------------------------------------------------------------------
  {
    title: 'Analytical Method Validation for Clinical Assays',
    description:
      'All clinical laboratory test methods shall be validated or verified before use for patient testing per CLIA 42 CFR 493.1253 and ISO 15189:2022 Section 7.3. Validation shall demonstrate: accuracy (comparison with reference method using at least 40 patient samples across the reportable range), precision (within-run, between-run, and total precision per CLSI EP05-A3), analytical measurement range (AMR) / linearity (per CLSI EP06-A), limit of detection (LoD per CLSI EP17-A2), limit of quantitation (LoQ), analytical specificity/interference testing (per CLSI EP07-A3), and reference range verification or establishment (per CLSI EP28-A3c).',
    category: 'Method Validation',
    tags: ['method-validation', 'clia', 'iso-15189', 'clsi'],
    riskLevel: 'critical',
    regulatoryRef: 'CLIA 42 CFR 493.1253; ISO 15189:2022 Section 7.3; CAP Checklist COM.30000',
  },
  // -----------------------------------------------------------------------
  // Proficiency Testing
  // -----------------------------------------------------------------------
  {
    title: 'Proficiency Testing / External Quality Assessment',
    description:
      'The laboratory shall participate in proficiency testing (PT) / external quality assessment (EQA) programs for all regulated analytes per CLIA 42 CFR 493.801-865 and ISO 15189:2022 Section 7.7.2. Requirements include: enrollment in CMS-approved PT programs (or ISO 17043-accredited EQA providers), analysis of PT samples by regular staff using routine methods without inter-laboratory communication, timely submission of results, investigation of unsatisfactory PT performance (two consecutive or two out of three events), and corrective action documentation. For analytes without PT programs, alternative assessment methods (split sample, inter-laboratory comparison) shall be implemented.',
    category: 'External Quality',
    tags: ['proficiency-testing', 'eqa', 'clia', 'iso-15189'],
    riskLevel: 'critical',
    regulatoryRef: 'CLIA 42 CFR 493.801-865; ISO 15189:2022 Section 7.7.2; CAP Checklist COM.01000',
  },
  // -----------------------------------------------------------------------
  // Personnel Competency
  // -----------------------------------------------------------------------
  {
    title: 'Personnel Competency Assessment Program',
    description:
      'All testing personnel shall have their competency assessed at hire, at 6 months, and annually thereafter per CLIA 42 CFR 493.1451 and ISO 15189:2022 Section 6.2. Assessment shall evaluate six competency elements: direct observation of routine test performance, monitoring the recording and reporting of test results, review of intermediate test results/worksheets/QC records, assessment using previously analyzed specimens (blind samples), assessment of problem-solving skills, and evaluation of specimen processing and handling. Competency records shall be maintained for at least two years beyond the individual\'s tenure.',
    category: 'Personnel',
    tags: ['competency', 'personnel', 'clia', 'training'],
    riskLevel: 'high',
    regulatoryRef: 'CLIA 42 CFR 493.1451; ISO 15189:2022 Section 6.2; CAP Checklist GEN.55000',
  },
  // -----------------------------------------------------------------------
  // Equipment Calibration
  // -----------------------------------------------------------------------
  {
    title: 'Equipment Calibration and Maintenance Program',
    description:
      'All laboratory instruments and equipment shall be calibrated, maintained, and verified per manufacturer specifications and applicable regulatory requirements. The program shall include: calibration using NIST-traceable or reference material-traceable calibrators (per CLIA 42 CFR 493.1255), calibration verification at least every six months (per CLIA 42 CFR 493.1255(b)), preventive maintenance per manufacturer schedules, function checks at defined intervals, and documentation of all calibration, verification, maintenance, and corrective actions. Equipment shall be removed from service immediately upon failure and shall not be returned to patient testing until recalibrated and verified.',
    category: 'Equipment',
    tags: ['calibration', 'equipment', 'maintenance', 'nist-traceable'],
    riskLevel: 'high',
    regulatoryRef: 'CLIA 42 CFR 493.1255; ISO 15189:2022 Section 6.5; CAP Checklist COM.40000',
  },
  // -----------------------------------------------------------------------
  // QC (Westgard Rules)
  // -----------------------------------------------------------------------
  {
    title: 'Quality Control Program with Westgard Rules',
    description:
      'A statistical quality control (SQC) program shall be implemented per CLIA 42 CFR 493.1256 and the IQCP/Westgard framework. Requirements include: running a minimum of two levels of QC per testing day (or per CMS-approved IQCP frequency), applying Westgard multi-rules (1-2s warning, 1-3s rejection, 2-2s, R-4s, 4-1s, 10x) for run acceptance/rejection decisions, establishing QC ranges using a minimum of 20 data points, monthly Levey-Jennings charting, CV and SDI monitoring, and investigation of out-of-control events before reporting patient results. Third-party QC materials shall be used where available.',
    category: 'Quality Control',
    tags: ['qc', 'westgard', 'statistical-qc', 'levey-jennings'],
    riskLevel: 'critical',
    regulatoryRef: 'CLIA 42 CFR 493.1256; CMS IQCP; ISO 15189:2022 Section 7.7.1; Westgard Rules',
  },
  // -----------------------------------------------------------------------
  // Reference Ranges
  // -----------------------------------------------------------------------
  {
    title: 'Reference Range Establishment and Verification',
    description:
      'Reference ranges (reference intervals) for all reported analytes shall be established or verified per CLSI EP28-A3c and ISO 15189:2022. For reference range establishment: a minimum of 120 reference individuals from the relevant population, stratified by age and sex where clinically significant differences exist. For verification of manufacturer-published ranges: a minimum of 20 reference individuals with no more than 10% (2/20) falling outside the stated range. Pediatric, geriatric, and pregnancy-specific reference ranges shall be provided where applicable. Reference ranges shall be reviewed biennially or upon significant method/population changes.',
    category: 'Reference Ranges',
    tags: ['reference-ranges', 'reference-intervals', 'clsi-ep28', 'population'],
    riskLevel: 'high',
    regulatoryRef: 'CLSI EP28-A3c; CLIA 42 CFR 493.1253(b)(6); ISO 15189:2022 Section 7.3.7',
  },
  // -----------------------------------------------------------------------
  // LIS Validation
  // -----------------------------------------------------------------------
  {
    title: 'Laboratory Information System (LIS) Validation',
    description:
      'The Laboratory Information System shall be validated before go-live and upon major upgrades per CAP checklist requirements and ISO 15189:2022 Section 8.3. Validation shall cover: correct transmission of results from analyzers to LIS (interface validation with bi-directional testing), result calculation accuracy (formulas, derived values, delta checks), auto-verification rules (critical value flagging, absurd value detection, AMR/clinical range checks), report formatting (units, reference ranges, interpretive comments), order entry and specimen tracking workflows, and user access controls. Validation shall be repeated for major LIS version upgrades.',
    category: 'Information Systems',
    tags: ['lis', 'validation', 'interface', 'auto-verification'],
    riskLevel: 'high',
    regulatoryRef: 'CAP Checklist GEN.43950; ISO 15189:2022 Section 8.3; 21 CFR Part 11 (if applicable)',
  },
  // -----------------------------------------------------------------------
  // Critical Values
  // -----------------------------------------------------------------------
  {
    title: 'Critical Value Notification and Documentation',
    description:
      'A critical (panic) value notification policy shall be established and maintained per CLIA requirements and TJC NPSG.02.03.01. The policy shall define: critical value thresholds for all applicable analytes (based on published literature and medical staff input), notification timeline (verbal notification to responsible provider within 30 minutes of result verification), read-back verification of communicated values, documentation of notification (date, time, result, person notified, person communicating), and escalation procedures when the responsible provider is unreachable. Critical value lists shall be reviewed annually by the laboratory director and medical staff.',
    category: 'Patient Safety',
    tags: ['critical-values', 'panic-values', 'notification', 'patient-safety'],
    riskLevel: 'critical',
    regulatoryRef: 'CLIA 42 CFR 493.1291; TJC NPSG.02.03.01; CAP Checklist GEN.41325',
  },
  // -----------------------------------------------------------------------
  // Accreditation
  // -----------------------------------------------------------------------
  {
    title: 'Laboratory Accreditation Maintenance',
    description:
      'The laboratory shall obtain and maintain accreditation from a CMS-deemed accreditation organization (CAP, COLA, AABB, ASHI, or state equivalent) and/or ISO 15189 accreditation from an ILAC signatory accreditation body. Requirements include: biennial self-inspection using the applicable checklist, successful inspection by the accrediting body, timely correction of cited deficiencies (Phase I within 30 days, Phase II within 60 days for CAP), continuous standards compliance between inspections, and CLIA certificate maintenance. Accreditation scope shall cover all testing disciplines and sites.',
    category: 'Accreditation',
    tags: ['accreditation', 'cap', 'clia', 'iso-15189', 'compliance'],
    riskLevel: 'critical',
    regulatoryRef: 'CLIA 42 CFR 493.1773-1780; CAP Accreditation Standards; ISO 15189:2022',
  },
  // -----------------------------------------------------------------------
  // Inter-Laboratory Comparison
  // -----------------------------------------------------------------------
  {
    title: 'Inter-Laboratory Comparison and Method Correlation',
    description:
      'For multi-site laboratory networks or when multiple analyzers measure the same analyte, inter-laboratory comparison and method correlation studies shall be performed per CLSI EP09-A3 at least semiannually. A minimum of 40 patient samples spanning the analytical measurement range shall be tested on each system. Regression analysis (Deming or Passing-Bablok) and bias assessment shall be performed. Clinically significant bias shall be addressed through calibration adjustment, mathematical correction factors, or method-specific reference ranges. Results shall be reviewed by the laboratory director.',
    category: 'Analytical Quality',
    tags: ['inter-lab-comparison', 'method-correlation', 'clsi-ep09', 'bias'],
    riskLevel: 'medium',
    regulatoryRef: 'CLSI EP09-A3; CAP Checklist COM.30550; ISO 15189:2022 Section 7.3.3',
  },
  // -----------------------------------------------------------------------
  // TAT SLAs
  // -----------------------------------------------------------------------
  {
    title: 'Turnaround Time (TAT) Monitoring and SLA Compliance',
    description:
      'Laboratory turnaround time (TAT) shall be monitored, reported, and maintained within established service level agreements (SLAs) per ISO 15189:2022 Section 8.6. TAT monitoring shall include: definition of TAT start and end points (order-to-result, receipt-to-result, collection-to-result), target TAT for each test category (STAT: < 60 minutes, routine: same day, send-out: as defined per reference lab), automated TAT tracking in the LIS, monthly TAT performance reports with percentile analysis (median, 90th percentile), investigation and CAPA for sustained TAT breaches, and regular review with clinical stakeholders.',
    category: 'Service Quality',
    tags: ['tat', 'turnaround-time', 'sla', 'service-quality'],
    riskLevel: 'medium',
    regulatoryRef: 'ISO 15189:2022 Section 8.6; CAP Checklist GEN.20316',
  },
  // -----------------------------------------------------------------------
  // LIMS Audit Trail
  // -----------------------------------------------------------------------
  {
    title: 'LIMS Audit Trail and Data Integrity',
    description:
      'The Laboratory Information Management System (LIMS) / LIS shall maintain a comprehensive, tamper-evident audit trail per 21 CFR Part 11 (where applicable), ALCOA+ principles, and ISO 15189:2022 Section 8.3. The audit trail shall capture: all data entries and modifications (original and amended values), user identification (unique login), date and time stamps (NTP-synchronized), reason for change (mandatory for amended results), result authorization/verification events, and system configuration changes. Audit trails shall be reviewed periodically as part of the data integrity program. Results shall not be deletable from the system.',
    category: 'Data Integrity',
    tags: ['lims', 'audit-trail', 'data-integrity', 'alcoa'],
    riskLevel: 'critical',
    regulatoryRef: '21 CFR Part 11; ISO 15189:2022 Section 8.3; ALCOA+',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify Method Validation Completeness',
    description:
      'Review method validation reports for all clinical assays against CLIA and ISO 15189 requirements. Verify that accuracy (40 patient comparison), precision (EP05-A3), linearity/AMR (EP06-A), LoD (EP17-A2), interference (EP07-A3), and reference range verification/establishment (EP28-A3c) studies are documented with acceptance criteria and conclusions.',
    category: 'Method Validation',
    tags: ['method-validation', 'completeness', 'review-test'],
    linkedReqTags: ['method-validation', 'clia', 'iso-15189', 'clsi'],
  },
  {
    title: 'Verify Proficiency Testing Performance and Corrective Actions',
    description:
      'Audit PT/EQA enrollment records for all regulated analytes. Verify that PT samples were analyzed by routine staff using standard methods. Review performance scores for the past two years. Confirm that unsatisfactory results (two consecutive or two out of three failures) triggered documented investigations and corrective actions. Verify alternative assessment for non-PT analytes.',
    category: 'External Quality',
    tags: ['proficiency-testing', 'performance', 'review-test'],
    linkedReqTags: ['proficiency-testing', 'eqa', 'clia'],
  },
  {
    title: 'Verify Personnel Competency Assessment Records',
    description:
      'Audit competency assessment records for all testing personnel. Verify six competency elements are assessed at hire, 6 months, and annually. Confirm that records document direct observation, result monitoring, worksheet review, blind sample testing, problem-solving assessment, and specimen handling evaluation. Verify records are retained for the required period.',
    category: 'Personnel',
    tags: ['competency', 'assessment', 'records-test'],
    linkedReqTags: ['competency', 'personnel', 'clia'],
  },
  {
    title: 'Verify Westgard QC Rules Implementation',
    description:
      'Observe a QC event during a routine testing run. Verify that at least two levels of QC are run, Westgard rules are correctly applied (1-3s, 2-2s, R-4s, 4-1s, 10x), out-of-control events trigger result hold, Levey-Jennings charts are current, and patient results are not released until QC is within acceptable limits. Review investigation records for recent out-of-control events.',
    category: 'Quality Control',
    tags: ['qc', 'westgard', 'implementation-test'],
    linkedReqTags: ['qc', 'westgard', 'statistical-qc'],
  },
  {
    title: 'Verify LIS Interface Validation and Auto-Verification',
    description:
      'Test bi-directional LIS-analyzer interfaces by sending known results and verifying correct transmission. Test auto-verification rules: verify critical value flagging triggers, absurd value detection blocks auto-release, delta check rules fire correctly, and AMR flags are applied. Verify result report formatting (units, reference ranges, comments) matches validated configuration.',
    category: 'Information Systems',
    tags: ['lis', 'interface', 'auto-verification-test'],
    linkedReqTags: ['lis', 'validation', 'interface', 'auto-verification'],
  },
  {
    title: 'Verify Critical Value Notification Process',
    description:
      'Generate a critical (panic) value result and time the notification process. Verify notification reaches the responsible provider within 30 minutes. Confirm read-back verification is performed and documented. Verify documentation includes all required elements (date, time, result, persons involved). Test the escalation procedure when the primary provider is unreachable.',
    category: 'Patient Safety',
    tags: ['critical-values', 'notification', 'timing-test'],
    linkedReqTags: ['critical-values', 'panic-values', 'notification'],
  },
  {
    title: 'Verify LIMS Audit Trail Integrity',
    description:
      'Perform data modifications in the LIMS/LIS and verify audit trail captures: original value, amended value, user identity, timestamp, and mandatory reason for change. Attempt to delete a result and verify prevention. Verify NTP synchronization of timestamps. Confirm audit trail review is performed as part of the periodic data integrity program.',
    category: 'Data Integrity',
    tags: ['lims', 'audit-trail', 'integrity-test'],
    linkedReqTags: ['lims', 'audit-trail', 'data-integrity'],
  },
  {
    title: 'Verify TAT Monitoring and SLA Compliance',
    description:
      'Review monthly TAT performance reports. Verify that TAT metrics are calculated correctly (order-to-result, receipt-to-result). Confirm STAT tests achieve < 60 minute TAT at the 90th percentile. Review investigation records for sustained TAT breaches. Verify automated LIS TAT tracking is operational and that reports are shared with clinical stakeholders.',
    category: 'Service Quality',
    tags: ['tat', 'sla', 'monitoring-test'],
    linkedReqTags: ['tat', 'turnaround-time', 'sla'],
  },
];
