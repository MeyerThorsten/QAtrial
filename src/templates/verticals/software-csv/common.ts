/**
 * Software & IT / GAMP / CSV Vertical — Common Templates
 *
 * Comprehensive computerized system validation requirements and tests per
 * GAMP 5, 21 CFR Part 11, EU Annex 11, and data integrity guidelines.
 * Covers URS/FS/DS, IQ/OQ/PQ, access control, audit trail, backup/restore,
 * and periodic review.
 */

import type { VerticalTemplateSet } from '../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'software_it',
  requirements: [
    // -----------------------------------------------------------------------
    // GAMP 5 System Classification
    // -----------------------------------------------------------------------
    {
      templateId: 'software:system-classification:req-01',
      title: 'GAMP 5 Software Category Classification',
      description:
        'All GxP-relevant computerized systems shall be classified per GAMP 5 software categories: Category 1 (Infrastructure Software), Category 3 (Non-Configured Products), Category 4 (Configured Products), or Category 5 (Custom Applications). The classification shall drive the extent of validation activities, documentation depth, and testing rigor. Classification rationale shall be documented in the validation plan.',
      category: 'System Classification',
      tags: ['gamp5', 'software-category', 'classification', 'risk-based'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Guide (2nd Edition); ISPE Baseline Guide',
    },
    {
      templateId: 'software:specification:req-01',
      title: 'User Requirements Specification (URS)',
      description:
        'A User Requirements Specification shall be developed for each GxP system defining: business process requirements, regulatory requirements, functional requirements, data requirements, interface requirements, security requirements, and quality attributes (performance, availability, scalability). Each requirement shall be uniquely numbered, testable, and traceable. The URS shall be reviewed and approved by business process owners and quality assurance.',
      category: 'Specification',
      tags: ['urs', 'user-requirements', 'specification', 'traceability'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Appendix D3; 21 CFR Part 11',
    },
    {
      templateId: 'software:specification:req-02',
      title: 'Functional Specification (FS)',
      description:
        'A Functional Specification shall describe what the system does to satisfy the URS. The FS shall cover: system architecture overview, functional descriptions for each URS requirement, data flow diagrams, user interface specifications, integration and interface specifications, security model, and error handling. Each FS item shall be traceable to the URS.',
      category: 'Specification',
      tags: ['fs', 'functional-specification', 'architecture', 'data-flow'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Appendix D4; IEEE 830',
    },
    {
      templateId: 'software:specification:req-03',
      title: 'Design Specification (DS) / Configuration Specification',
      description:
        'A Design Specification shall describe how the system implements the functional requirements. For configured products (GAMP Cat 4), a Configuration Specification shall document: parameter settings, workflow configurations, report definitions, interface configurations, and security settings. For custom applications (GAMP Cat 5), detailed design including module specifications, database schema, and algorithm descriptions shall be documented.',
      category: 'Specification',
      tags: ['ds', 'design-specification', 'configuration', 'custom'],
      riskLevel: 'medium',
      regulatoryRef: 'GAMP 5 Appendix D5',
    },
    {
      templateId: 'software:risk-management:req-01',
      title: 'Risk Assessment for Computerized Systems',
      description:
        'A risk assessment shall be performed for each GxP computerized system per GAMP 5 risk-based approach. The assessment shall evaluate: patient safety impact, product quality impact, data integrity impact, and regulatory compliance impact. Risk control measures shall be defined for high-risk functions. The risk assessment shall drive the validation strategy, testing extent, and ongoing operational controls.',
      category: 'Risk Management',
      tags: ['risk-assessment', 'gamp5-risk', 'patient-safety', 'data-integrity'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Section 5; ICH Q9',
    },
    {
      templateId: 'software:qualification:req-01',
      title: 'Installation Qualification (IQ)',
      description:
        'Installation Qualification shall verify that the system and its components are installed correctly per the design specification in the target environment. IQ shall verify: hardware installation, software installation and version, network and infrastructure configuration, database installation, operating system patches, third-party component versions, and environmental parameters. All deviations shall be documented and resolved.',
      category: 'Qualification',
      tags: ['iq', 'installation', 'qualification', 'environment'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Appendix D8; 21 CFR 211.68',
    },
    {
      templateId: 'software:qualification:req-02',
      title: 'Operational Qualification (OQ)',
      description:
        'Operational Qualification shall verify that the system operates as intended under normal and boundary conditions. OQ shall test: all functional requirements from the FS, boundary conditions, error handling, security controls, audit trail functionality, electronic signature compliance, interface operations, and calculations/algorithms. Positive and negative test cases shall be included.',
      category: 'Qualification',
      tags: ['oq', 'operational', 'qualification', 'functional-testing'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Appendix D9; 21 CFR Part 11',
    },
    {
      templateId: 'software:qualification:req-03',
      title: 'Performance Qualification (PQ)',
      description:
        'Performance Qualification shall demonstrate that the system performs as intended in its actual production environment with real users and representative data. PQ shall include: end-to-end business process testing, performance under expected load, integration with production interfaces, user acceptance testing, and verification that the system meets the URS in the operational context.',
      category: 'Qualification',
      tags: ['pq', 'performance', 'qualification', 'uat'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Appendix D10; EU Annex 11 Section 4',
    },
    {
      templateId: 'software:regulatory-compliance:req-01',
      title: '21 CFR Part 11 Electronic Records Compliance',
      description:
        'Systems maintaining electronic records that are predicate rule records shall comply with 21 CFR Part 11. Requirements include: system validation, audit trail (who/what/when/why), record retention and retrieval, system access limited to authorized individuals, authority checks, device checks, operational system checks, unique user IDs, and controls over open and closed systems.',
      category: 'Regulatory Compliance',
      tags: ['part-11', 'electronic-records', 'compliance', 'audit-trail'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR Part 11 Subpart B',
    },
    {
      templateId: 'software:regulatory-compliance:req-02',
      title: 'EU Annex 11 Computerized Systems Compliance',
      description:
        'GxP computerized systems operated within the EU shall comply with EU GMP Annex 11. Requirements include: risk management, personnel qualification, supplier assessment for commercial systems, system validation, data integrity controls, accuracy checks for manual data entry, data storage and archiving, printouts, change and configuration management, periodic evaluation, and business continuity planning.',
      category: 'Regulatory Compliance',
      tags: ['annex-11', 'eu-gmp', 'computerized-systems', 'periodic-evaluation'],
      riskLevel: 'critical',
      regulatoryRef: 'EU GMP Annex 11 (2011)',
    },
    {
      templateId: 'software:data-integrity:req-01',
      title: 'Data Integrity Controls (ALCOA+)',
      description:
        'Computerized systems shall implement data integrity controls per ALCOA+ principles and regulatory guidance. Controls shall include: unique user identification (attributable), protected audit trails (legible, contemporaneous), prevention of unauthorized data modification (original, accurate), backup and archival procedures (complete, consistent, enduring), and data availability throughout the required retention period (available).',
      category: 'Data Integrity',
      tags: ['data-integrity', 'alcoa-plus', 'controls', 'audit-trail'],
      riskLevel: 'critical',
      regulatoryRef: 'FDA Data Integrity Guidance (2018); MHRA Data Integrity Guidance; WHO TRS 996 Annex 5',
    },
    {
      templateId: 'software:security:req-01',
      title: 'Access Control and Segregation of Duties',
      description:
        'Role-based access control (RBAC) shall be implemented with documented security roles, permissions, and segregation of duties. Requirements include: unique user IDs, password policy enforcement (complexity, expiry, history), account lockout after failed attempts, automatic session timeout, privilege management (least privilege), access review at defined intervals, and deactivation upon personnel departure or role change.',
      category: 'Security',
      tags: ['access-control', 'rbac', 'segregation-of-duties', 'password-policy'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 11.10(d); EU Annex 11 Section 12',
    },
    {
      templateId: 'software:business-continuity:req-01',
      title: 'Backup, Restore, and Archival Procedures',
      description:
        'Backup, restore, and archival procedures shall be documented and validated. Requirements include: defined backup schedule based on RPO, backup integrity verification, periodic restore testing (at least annually), off-site backup storage, archival of validated system configurations, data migration validation when changing platforms, and retention of electronic records for the required period with continued readability.',
      category: 'Business Continuity',
      tags: ['backup', 'restore', 'archival', 'data-migration'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 11.10(c); EU Annex 11 Section 7',
    },
    {
      templateId: 'software:change-management:req-01',
      title: 'Change Control for Validated Systems',
      description:
        'All changes to validated computerized systems shall be managed through a formal change control process. Changes shall be classified by impact on validated state (no impact, minor, major). Regression testing scope shall be commensurate with change risk. Emergency changes shall follow an expedited procedure with retrospective documentation. Change history shall be maintained as part of the system validation package.',
      category: 'Change Management',
      tags: ['change-control', 'regression-testing', 'validated-state', 'configuration'],
      riskLevel: 'high',
      regulatoryRef: 'GAMP 5 Section 10; EU Annex 11 Section 10',
    },
    {
      templateId: 'software:ongoing-compliance:req-01',
      title: 'Periodic Review of Validated Systems',
      description:
        'Validated computerized systems shall undergo periodic review at defined intervals (typically annually) to confirm the system remains in a validated state. The review shall assess: change history, incident and deviation trends, SOP currency, security review, backup/restore verification, regulatory changes impacting the system, support and maintenance status, and continued fitness for intended use.',
      category: 'Ongoing Compliance',
      tags: ['periodic-review', 'validated-state', 'fitness-for-use', 'annual-review'],
      riskLevel: 'medium',
      regulatoryRef: 'EU Annex 11 Section 11; GAMP 5 Section 11',
    },
  ],

  tests: [
    // -----------------------------------------------------------------------
    // Test Cases
    // -----------------------------------------------------------------------
    {
      templateId: 'software:system-classification:tst-01',
      title: 'GAMP 5 Classification Verification',
      description:
        'Review the GAMP 5 category classification for five representative systems. Verify: classification rationale is documented, classification drives the validation approach, Cat 4 systems have configuration specifications, Cat 5 systems have detailed design specifications, and validation scope is proportionate to risk and category.',
      category: 'System Classification',
      tags: ['gamp5', 'classification', 'verification-test'],
      linkedReqTags: ['gamp5', 'software-category', 'classification'],
    },
    {
      templateId: 'software:specification:tst-01',
      title: 'URS/FS/DS Traceability Matrix Review',
      description:
        'Review the traceability matrix for a representative system. Verify: each URS requirement traces to at least one FS item, each FS item traces to at least one test case, bidirectional traceability is maintained (forward and backward), no orphaned requirements or test cases exist, and the traceability matrix has been reviewed and approved.',
      category: 'Specification',
      tags: ['urs', 'traceability', 'matrix-review'],
      linkedReqTags: ['urs', 'user-requirements', 'traceability'],
    },
    {
      templateId: 'software:qualification:tst-01',
      title: 'IQ Protocol Execution Verification',
      description:
        'Review completed IQ protocols for three systems. Verify: all installation checks passed, hardware and software versions match specifications, network configuration is documented, database setup is confirmed, all deviations are documented with resolutions, and the IQ report is approved by the validation team and quality assurance.',
      category: 'Qualification',
      tags: ['iq', 'protocol', 'execution-test'],
      linkedReqTags: ['iq', 'installation', 'qualification'],
    },
    {
      templateId: 'software:qualification:tst-02',
      title: 'OQ Functional Testing Completeness',
      description:
        'Review OQ test execution for a representative system. Verify: all functional requirements are tested, boundary conditions are included, negative test cases verify error handling, audit trail entries are verified for critical operations, electronic signature functionality is tested per Part 11 requirements, and test evidence (screenshots, data) is retained.',
      category: 'Qualification',
      tags: ['oq', 'functional-testing', 'completeness-test'],
      linkedReqTags: ['oq', 'operational', 'functional-testing'],
    },
    {
      templateId: 'software:compliance:tst-01',
      title: 'Part 11 Audit Trail Verification',
      description:
        'Test audit trail functionality for a GxP system. Create, modify, and delete records. Verify: each action generates an audit trail entry, entries capture who (user ID), what (field changed, old/new values), when (date/time stamp), and why (reason for change). Verify audit trail is protected from modification/deletion, is computer-generated, and can be reviewed and exported by authorized personnel.',
      category: 'Compliance',
      tags: ['part-11', 'audit-trail', 'verification-test'],
      linkedReqTags: ['part-11', 'electronic-records', 'audit-trail'],
    },
    {
      templateId: 'software:data-integrity:tst-01',
      title: 'ALCOA+ Data Integrity Assessment',
      description:
        'Assess data integrity controls for a validated system. Test: unique user identification (no shared accounts), audit trail protection (attempt modification), original data preservation (attempt backdating), data completeness (verify required fields), and data availability (retrieve archived records). Document findings against each ALCOA+ attribute.',
      category: 'Data Integrity',
      tags: ['data-integrity', 'alcoa-plus', 'assessment-test'],
      linkedReqTags: ['data-integrity', 'alcoa-plus', 'controls'],
    },
    {
      templateId: 'software:security:tst-01',
      title: 'Access Control and Password Policy Testing',
      description:
        'Test access control implementation. Verify: unique user IDs are enforced, password policy meets requirements (complexity, length, history), account lockout occurs after defined failed attempts, session timeout is enforced, users can only access functions per their role, segregation of duties is maintained for critical functions, and access reviews are documented.',
      category: 'Security',
      tags: ['access-control', 'password-policy', 'security-test'],
      linkedReqTags: ['access-control', 'rbac', 'segregation-of-duties'],
    },
    {
      templateId: 'software:business-continuity:tst-01',
      title: 'Backup and Restore Validation',
      description:
        'Execute a backup and restore test. Create known test data, perform a backup, modify or delete the data, then restore from backup. Verify: restored data matches the original exactly, audit trails are intact after restore, system functionality is unaffected, restore completes within the documented RTO, and the entire process is documented with evidence.',
      category: 'Business Continuity',
      tags: ['backup', 'restore', 'validation-test'],
      linkedReqTags: ['backup', 'restore', 'archival'],
    },
    {
      templateId: 'software:change-management:tst-01',
      title: 'Change Control Process Verification',
      description:
        'Review five recent changes to validated systems. For each, verify: the change request documents the proposed change, impact assessment on validated state is documented, testing scope is commensurate with change risk, regression testing was performed where warranted, updated documentation reflects the change, and quality approval was obtained before go-live.',
      category: 'Change Management',
      tags: ['change-control', 'regression', 'process-test'],
      linkedReqTags: ['change-control', 'regression-testing', 'validated-state'],
    },
    {
      templateId: 'software:ongoing-compliance:tst-01',
      title: 'Periodic Review Execution Verification',
      description:
        'Review the most recent periodic review for three validated systems. Verify each review covers: change log summary, incident and deviation assessment, SOP review for currency, security and access review results, backup/restore verification evidence, regulatory change impact, vendor/support status, and a conclusion on continued validated state with action items for any identified gaps.',
      category: 'Ongoing Compliance',
      tags: ['periodic-review', 'annual-review', 'verification-test'],
      linkedReqTags: ['periodic-review', 'validated-state', 'fitness-for-use'],
    },
  ],
};

export default templateSet;
