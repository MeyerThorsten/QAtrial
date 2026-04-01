/**
 * Medical Devices Vertical — Common Templates
 *
 * Comprehensive requirements and tests for medical device development,
 * manufacturing, and post-market activities per FDA QSR/QMSR, EU MDR,
 * ISO 13485, and related standards.
 */

import type { VerticalTemplateSet } from '../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'medical_devices',
  requirements: [
    // -----------------------------------------------------------------------
    // Design Controls
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:design-controls:req-01',
      title: 'Design Input Requirements',
      description:
        'Design inputs shall be established and documented for each medical device, including: intended use and user needs, performance requirements, safety requirements, applicable regulatory requirements, risk management outputs, human factors requirements, and cybersecurity requirements. Design inputs shall be reviewed and approved before design activities proceed.',
      category: 'Design Controls',
      tags: ['design-input', 'user-needs', 'requirements'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 820.30(c); QMSR; ISO 13485 Section 7.3.3',
    },
    {
      templateId: 'meddevice:design-controls:req-02',
      title: 'Design Output Verification',
      description:
        'Design outputs shall satisfy design input requirements and be documented in a form that enables verification against design inputs. Outputs shall include: device specifications, manufacturing specifications, packaging specifications, labeling, and reference to applicable standards. Design outputs shall be approved before release.',
      category: 'Design Controls',
      tags: ['design-output', 'specifications', 'verification'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 820.30(d); QMSR; ISO 13485 Section 7.3.4',
    },

    // -----------------------------------------------------------------------
    // Risk Management
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:risk-management:req-01',
      title: 'Risk Management Process (ISO 14971)',
      description:
        'A risk management process per ISO 14971 shall be applied throughout the device lifecycle. The process shall include: risk analysis (hazard identification, estimation of risks using FMEA/FTA), risk evaluation against acceptability criteria, risk control (inherent safety, protective measures, information for safety), evaluation of overall residual risk, risk management review, and post-production monitoring.',
      category: 'Risk Management',
      tags: ['risk-management', 'iso-14971', 'fmea', 'hazard-analysis'],
      riskLevel: 'critical',
      regulatoryRef: 'ISO 14971:2019; EU MDR Annex I Section 3',
    },

    // -----------------------------------------------------------------------
    // Biocompatibility
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:biocompatibility:req-01',
      title: 'Biocompatibility Evaluation',
      description:
        'Materials in direct or indirect contact with the patient shall be evaluated for biocompatibility per ISO 10993-1. The biological evaluation plan shall consider: nature of body contact (surface, external communicating, implant), duration of contact (limited, prolonged, permanent), applicable endpoints (cytotoxicity, sensitization, irritation, systemic toxicity, genotoxicity, implantation, hemocompatibility), and chemical characterization per ISO 10993-18.',
      category: 'Biocompatibility',
      tags: ['biocompatibility', 'iso-10993', 'biological-evaluation'],
      riskLevel: 'critical',
      regulatoryRef: 'ISO 10993-1:2018; FDA Guidance on Biocompatibility',
    },

    // -----------------------------------------------------------------------
    // Usability Engineering
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:usability:req-01',
      title: 'Usability Engineering Process',
      description:
        'A usability engineering process per IEC 62366-1 shall be applied to identify and mitigate use-related risks. Activities shall include: use specification, user interface analysis, user research, task analysis, formative usability evaluations during design, and summative (validation) usability testing with representative users to demonstrate the user interface can be used safely and effectively.',
      category: 'Usability',
      tags: ['usability', 'iec-62366', 'human-factors', 'use-error'],
      riskLevel: 'high',
      regulatoryRef: 'IEC 62366-1:2015; FDA HFE/UE Guidance',
    },

    // -----------------------------------------------------------------------
    // Software Lifecycle
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:software:req-01',
      title: 'Software Lifecycle Process (IEC 62304)',
      description:
        'Software that is part of a medical device or is a medical device (SaMD) shall be developed, maintained, and risk-managed per IEC 62304. Activities shall be commensurate with the software safety classification (Class A/B/C). Required deliverables include: software development plan, requirements, architecture, detailed design (Class C), unit/integration/system testing, and release documentation.',
      category: 'Software',
      tags: ['software-lifecycle', 'iec-62304', 'samd', 'software-class'],
      riskLevel: 'critical',
      regulatoryRef: 'IEC 62304:2006/AMD1:2015; FDA SW Guidance',
    },

    // -----------------------------------------------------------------------
    // Electrical Safety
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:safety:req-01',
      title: 'Electrical Safety Compliance (IEC 60601)',
      description:
        'Medical electrical equipment shall comply with IEC 60601-1 (general requirements) and applicable particular standards (IEC 60601-1-x collateral standards and IEC 60601-2-x particular standards). Testing shall cover: protection against electrical hazards, mechanical hazards, radiation, excessive temperatures, fire, and accuracy of controls and instruments.',
      category: 'Safety',
      tags: ['electrical-safety', 'iec-60601', 'type-testing'],
      riskLevel: 'critical',
      regulatoryRef: 'IEC 60601-1:2005/AMD2:2020',
    },

    // -----------------------------------------------------------------------
    // EMC
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:safety:req-02',
      title: 'Electromagnetic Compatibility (EMC)',
      description:
        'Medical electrical equipment shall comply with IEC 60601-1-2 for electromagnetic compatibility. EMC testing shall demonstrate: emissions do not exceed limits (conducted and radiated), immunity to electrostatic discharge (ESD), radiated/conducted RF, electrical fast transients, surges, voltage dips, and power frequency magnetic fields. Risk assessment of essential performance degradation shall be documented.',
      category: 'Safety',
      tags: ['emc', 'iec-60601-1-2', 'electromagnetic', 'immunity'],
      riskLevel: 'high',
      regulatoryRef: 'IEC 60601-1-2:2014/AMD1:2020',
    },

    // -----------------------------------------------------------------------
    // Sterilization Validation
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:manufacturing:req-01',
      title: 'Sterilization Validation',
      description:
        'Sterilization processes for medical devices shall be validated per the applicable ISO 11135 (EO), ISO 17665 (moist heat), ISO 11137 (radiation), or ISO 14937 (other agents). Validation shall demonstrate a Sterility Assurance Level (SAL) of 10^-6. Revalidation shall be performed after significant changes and at defined periodic intervals.',
      category: 'Manufacturing',
      tags: ['sterilization', 'validation', 'sal', 'revalidation'],
      riskLevel: 'critical',
      regulatoryRef: 'ISO 11135; ISO 17665; ISO 11137; 21 CFR 820.75',
    },

    // -----------------------------------------------------------------------
    // Packaging Validation
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:manufacturing:req-02',
      title: 'Packaging Validation (Sterile Barrier)',
      description:
        'Sterile barrier system packaging shall be validated per ISO 11607. Validation shall include: seal strength testing, package integrity testing (dye penetration, bubble emission, or visual), accelerated and real-time aging studies, distribution simulation (ISTA/ASTM), and microbial barrier property verification. Packaging materials shall be biocompatibility-evaluated.',
      category: 'Manufacturing',
      tags: ['packaging', 'sterile-barrier', 'iso-11607', 'aging'],
      riskLevel: 'high',
      regulatoryRef: 'ISO 11607-1:2019; ISO 11607-2:2019',
    },

    // -----------------------------------------------------------------------
    // Clinical Evaluation
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:clinical:req-01',
      title: 'Clinical Evaluation and Evidence',
      description:
        'A clinical evaluation shall be conducted per EU MDR Annex XIV / MEDDEV 2.7/1 Rev 4 to demonstrate conformity with general safety and performance requirements. The evaluation shall include: identification of pertinent data (literature, clinical investigations, PMS data), appraisal of data quality, analysis of clinical evidence, and conclusions on safety, performance, and benefit-risk. The clinical evaluation report (CER) shall be updated at least annually.',
      category: 'Clinical',
      tags: ['clinical-evaluation', 'cer', 'clinical-evidence', 'mdr'],
      riskLevel: 'critical',
      regulatoryRef: 'EU MDR Annex XIV; MEDDEV 2.7/1 Rev 4',
    },

    // -----------------------------------------------------------------------
    // Post-Market Surveillance
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:post-market:req-01',
      title: 'Post-Market Surveillance System',
      description:
        'A post-market surveillance (PMS) system shall be established per EU MDR Article 83. The system shall systematically collect, record, and analyze data on device performance in the field, including: complaints, vigilance reports, literature, registries, and field data. For Class IIa and higher devices, a periodic safety update report (PSUR) shall be prepared. For Class III and implantable devices, a summary of safety and clinical performance (SSCP) shall be maintained.',
      category: 'Post-Market',
      tags: ['pms', 'post-market', 'vigilance', 'psur'],
      riskLevel: 'high',
      regulatoryRef: 'EU MDR Articles 83-86; 21 CFR 803 (MDR)',
    },

    // -----------------------------------------------------------------------
    // UDI
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:regulatory:req-01',
      title: 'Unique Device Identification (UDI)',
      description:
        'Each medical device shall be assigned a Unique Device Identifier per FDA UDI Rule and EU MDR Article 27. The UDI shall consist of a Device Identifier (DI) and Production Identifier (PI) in GS1, HIBCC, or ICCBBA format. UDI data shall be submitted to GUDID (FDA) and EUDAMED (EU). UDI shall appear on device labels and, where feasible, directly on the device.',
      category: 'Regulatory',
      tags: ['udi', 'device-identification', 'gudid', 'eudamed'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 801.20; EU MDR Article 27',
    },

    // -----------------------------------------------------------------------
    // Technical File
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:documentation:req-01',
      title: 'Technical Documentation / Design History File',
      description:
        'A technical file (EU MDR Annex II/III) or Design History File (DHF per 21 CFR 820.30(j)) shall be maintained containing: device description, design and manufacturing information, general safety and performance requirements checklist, benefit-risk analysis, verification and validation reports, clinical evaluation, labeling, and post-market surveillance plan. The file shall be kept current throughout the device lifecycle.',
      category: 'Documentation',
      tags: ['technical-file', 'dhf', 'documentation', 'annex-ii'],
      riskLevel: 'high',
      regulatoryRef: 'EU MDR Annex II/III; 21 CFR 820.30(j)',
    },

    // -----------------------------------------------------------------------
    // Complaint Handling
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:post-market:req-02',
      title: 'Medical Device Complaint Handling',
      description:
        'A complaint handling procedure shall be maintained per 21 CFR 820.198 / ISO 13485 Section 8.2.2. All complaints shall be evaluated for reportability (MDR, field safety corrective action). Investigation shall determine: root cause, risk to patient/user, affected lots, and whether a field action is warranted. Complaint trending shall feed into the PMS system and CAPA process.',
      category: 'Post-Market',
      tags: ['complaint', 'mdr-reporting', 'field-action', 'trending'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 820.198; ISO 13485 Section 8.2.2; EU MDR Article 87',
    },

    // -----------------------------------------------------------------------
    // Supplier Controls
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:supplier-quality:req-01',
      title: 'Supplier Controls and Purchasing',
      description:
        'Suppliers of components, materials, and services affecting device quality shall be evaluated, selected, and monitored per documented criteria. Purchasing data shall include: specifications, quality requirements, and applicable standards. Incoming inspection or verification shall ensure purchased products meet specified requirements. An approved supplier list shall be maintained.',
      category: 'Supplier Quality',
      tags: ['supplier-controls', 'purchasing', 'incoming-inspection'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 820.50; ISO 13485 Section 7.4',
    },

    // -----------------------------------------------------------------------
    // Design Transfer
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:design-controls:req-03',
      title: 'Design Transfer to Production',
      description:
        'Design transfer procedures shall ensure the device design is correctly translated into production specifications. Transfer activities shall include: verification that manufacturing processes produce devices meeting design output specifications, process validation (IQ/OQ/PQ), work instruction creation, training of production personnel, and confirmation of in-process and finished device testing.',
      category: 'Design Controls',
      tags: ['design-transfer', 'production', 'process-validation'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 820.30(h); ISO 13485 Section 7.3.8',
    },

    // -----------------------------------------------------------------------
    // Production Controls
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:manufacturing:req-03',
      title: 'Production and Process Controls',
      description:
        'Production processes shall be controlled to ensure the device conforms to specifications. Controls shall include: documented work instructions, monitoring of process parameters, environmental controls, equipment maintenance and calibration, process validation for special processes, and in-process acceptance activities. Device History Records (DHR) shall be maintained for each production unit or batch.',
      category: 'Manufacturing',
      tags: ['production-controls', 'dhr', 'process-monitoring'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 820.70; ISO 13485 Section 7.5.1',
    },

    // -----------------------------------------------------------------------
    // Labeling
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:regulatory:req-02',
      title: 'Medical Device Labeling Requirements',
      description:
        'Device labeling shall comply with applicable regulations including: 21 CFR 801 (US), EU MDR Annex I Chapter III, and ISO 15223-1 for symbols. Labels shall include: manufacturer name and address, device name, model/catalog number, lot/serial number, UDI, expiry date (if applicable), intended use, warnings, storage conditions, and CE marking (EU). IFU shall be provided per applicable regulations.',
      category: 'Regulatory',
      tags: ['labeling', 'ifu', 'symbols', 'ce-marking'],
      riskLevel: 'high',
      regulatoryRef: '21 CFR 801; EU MDR Annex I Chapter III; ISO 15223-1',
    },

    // -----------------------------------------------------------------------
    // Cybersecurity
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:cybersecurity:req-01',
      title: 'Medical Device Cybersecurity',
      description:
        'Connected medical devices shall address cybersecurity throughout the total product lifecycle. Premarket activities shall include: threat modeling, security risk assessment, secure design principles (defense in depth), software bill of materials (SBOM), penetration testing, and vulnerability management. Postmarket cybersecurity shall include: coordinated vulnerability disclosure, patch management, and security monitoring.',
      category: 'Cybersecurity',
      tags: ['cybersecurity', 'threat-model', 'sbom', 'vulnerability'],
      riskLevel: 'critical',
      regulatoryRef: 'FDA Premarket Cybersecurity Guidance (2023); EU MDR Annex I Section 17.2',
    },
  ],

  tests: [
    // -----------------------------------------------------------------------
    // Test Cases
    // -----------------------------------------------------------------------
    {
      templateId: 'meddevice:design-controls:tst-01',
      title: 'Design Input/Output Traceability Review',
      description:
        'Review the design input requirements and design output specifications for a representative device. Verify bidirectional traceability: each design input traces to at least one design output and verification activity, and each design output traces back to a design input. Verify no orphaned requirements or outputs exist.',
      category: 'Design Controls',
      tags: ['design-input', 'design-output', 'traceability-test'],
      linkedReqTags: ['design-input', 'design-output', 'requirements', 'specifications'],
    },
    {
      templateId: 'meddevice:risk-management:tst-01',
      title: 'Risk Management File Completeness',
      description:
        'Review the risk management file. Verify it contains: risk management plan, hazard analysis (FMEA or equivalent), risk evaluation against acceptability criteria, risk control measures for unacceptable risks, verification of risk control effectiveness, evaluation of overall residual risk, and risk management review minutes. Verify traceability from hazards through controls to verification.',
      category: 'Risk Management',
      tags: ['risk-management', 'fmea', 'file-review'],
      linkedReqTags: ['risk-management', 'iso-14971', 'fmea', 'hazard-analysis'],
    },
    {
      templateId: 'meddevice:biocompatibility:tst-01',
      title: 'Biocompatibility Test Report Review',
      description:
        'Review the biological evaluation report per ISO 10993-1. Verify: material characterization is complete (ISO 10993-18), applicable biological endpoints were identified based on body contact and duration, testing was performed by accredited laboratories, results are within acceptable limits, and the overall biocompatibility conclusion is scientifically justified.',
      category: 'Biocompatibility',
      tags: ['biocompatibility', 'testing', 'report-review'],
      linkedReqTags: ['biocompatibility', 'iso-10993', 'biological-evaluation'],
    },
    {
      templateId: 'meddevice:usability:tst-01',
      title: 'Summative Usability Test Execution',
      description:
        'Execute or review a summative usability test with representative users. Verify: participants match the intended user profile, critical tasks are tested, use errors and close calls are captured, no use errors resulted in unacceptable residual risk, and the user interface supports safe and effective use. Verify the usability engineering file is complete per IEC 62366-1.',
      category: 'Usability',
      tags: ['usability', 'summative-test', 'human-factors-test'],
      linkedReqTags: ['usability', 'iec-62366', 'human-factors'],
    },
    {
      templateId: 'meddevice:software:tst-01',
      title: 'Software Verification and Validation',
      description:
        'Review software V&V records for a Class C software item. Verify: unit tests achieve required code coverage, integration testing verifies software architecture, system testing covers all software requirements, regression testing is performed after changes, anomaly management is documented, and the software release record is complete.',
      category: 'Software',
      tags: ['software-lifecycle', 'verification', 'validation-test'],
      linkedReqTags: ['software-lifecycle', 'iec-62304', 'samd'],
    },
    {
      templateId: 'meddevice:safety:tst-01',
      title: 'IEC 60601 Type Test Verification',
      description:
        'Review IEC 60601-1 type test reports. Verify testing was performed by an accredited laboratory covering: electrical safety (leakage currents, dielectric strength), mechanical safety, thermal safety, fire risk, and EMC per IEC 60601-1-2. Verify all applicable particular standards (IEC 60601-2-x) are addressed. Confirm no unresolved non-conformances.',
      category: 'Safety',
      tags: ['electrical-safety', 'type-test', 'report-review'],
      linkedReqTags: ['electrical-safety', 'iec-60601', 'emc'],
    },
    {
      templateId: 'meddevice:manufacturing:tst-01',
      title: 'Sterilization Validation Review',
      description:
        'Review sterilization validation records. Verify: the sterilization method is appropriate for the device, process parameters are defined, bioburden data supports the SAL claim, dose auditing or cycle monitoring is current, revalidation is performed per schedule, and parametric release criteria (if used) are justified.',
      category: 'Manufacturing',
      tags: ['sterilization', 'validation-review', 'sal-test'],
      linkedReqTags: ['sterilization', 'validation', 'sal'],
    },
    {
      templateId: 'meddevice:manufacturing:tst-02',
      title: 'Packaging Integrity and Aging Study Review',
      description:
        'Review packaging validation records. Verify: seal strength meets acceptance criteria, package integrity testing shows no failures, accelerated aging study supports the claimed shelf life, distribution simulation testing was performed and passed, and real-time aging data (if available) corroborates accelerated aging results.',
      category: 'Manufacturing',
      tags: ['packaging', 'integrity', 'aging-test'],
      linkedReqTags: ['packaging', 'sterile-barrier', 'iso-11607'],
    },
    {
      templateId: 'meddevice:clinical:tst-01',
      title: 'Clinical Evaluation Report Assessment',
      description:
        'Review the Clinical Evaluation Report (CER). Verify: the clinical evaluation plan defines scope and methodology, literature search strategy is reproducible, data appraisal criteria are applied consistently, clinical evidence supports the intended purpose, residual risks are acceptable in light of clinical benefit, and the report has been updated within the last 12 months.',
      category: 'Clinical',
      tags: ['clinical-evaluation', 'cer', 'assessment-test'],
      linkedReqTags: ['clinical-evaluation', 'cer', 'clinical-evidence'],
    },
    {
      templateId: 'meddevice:post-market:tst-01',
      title: 'Post-Market Surveillance Effectiveness',
      description:
        'Review the PMS system implementation. Verify: complaint data is systematically collected and analyzed, vigilance reporting timelines are met, literature monitoring is active, PMS plan is current, PSUR (Class IIa+) is prepared per schedule, and PMS findings feed into risk management and clinical evaluation updates.',
      category: 'Post-Market',
      tags: ['pms', 'effectiveness', 'system-review'],
      linkedReqTags: ['pms', 'post-market', 'vigilance'],
    },
    {
      templateId: 'meddevice:regulatory:tst-01',
      title: 'UDI Compliance Verification',
      description:
        'Verify UDI implementation for representative devices. Confirm: DI and PI are correctly formatted per the selected issuing agency, UDI data is submitted to GUDID and/or EUDAMED, UDI appears on the device label in both human-readable and AIDC (barcode) format, and direct marking is applied where required.',
      category: 'Regulatory',
      tags: ['udi', 'compliance', 'verification-test'],
      linkedReqTags: ['udi', 'device-identification', 'gudid'],
    },
    {
      templateId: 'meddevice:documentation:tst-01',
      title: 'Technical File / DHF Completeness Audit',
      description:
        'Audit the technical file (EU) or Design History File (US) for a representative device. Verify all required sections are present, current, and internally consistent. Verify cross-references between design controls, risk management, clinical evaluation, and labeling are accurate. Identify any gaps that would be flagged during a regulatory audit.',
      category: 'Documentation',
      tags: ['technical-file', 'dhf', 'completeness-audit'],
      linkedReqTags: ['technical-file', 'dhf', 'documentation'],
    },
    {
      templateId: 'meddevice:post-market:tst-02',
      title: 'Complaint Trending and Reportability Assessment',
      description:
        'Review 12 months of complaint data. Verify: all complaints were evaluated for MDR reportability, reportable events were submitted within required timelines (30 days MDR, 15 days for field safety corrective actions), trending analysis identifies emerging signals, and complaint data feeds into the PMS system and risk management updates.',
      category: 'Post-Market',
      tags: ['complaint', 'trending', 'reportability-test'],
      linkedReqTags: ['complaint', 'mdr-reporting', 'field-action'],
    },
    {
      templateId: 'meddevice:design-controls:tst-02',
      title: 'Design Transfer Verification',
      description:
        'Review design transfer records for a recently transferred device. Verify: production specifications match approved design outputs, manufacturing process validation (IQ/OQ/PQ) is complete, work instructions are issued and training is documented, in-process and finished device testing is defined and operational, and first production units meet all design specifications.',
      category: 'Design Controls',
      tags: ['design-transfer', 'verification', 'production-test'],
      linkedReqTags: ['design-transfer', 'production', 'process-validation'],
    },
    {
      templateId: 'meddevice:cybersecurity:tst-01',
      title: 'Cybersecurity Risk Assessment Review',
      description:
        'Review the cybersecurity risk assessment. Verify: threat model covers all attack surfaces, security risk assessment follows a recognized framework (e.g., STRIDE, MITRE ATT&CK), SBOM is complete and current, penetration testing has been performed, identified vulnerabilities have mitigations, and a coordinated vulnerability disclosure policy is established.',
      category: 'Cybersecurity',
      tags: ['cybersecurity', 'risk-assessment', 'penetration-test'],
      linkedReqTags: ['cybersecurity', 'threat-model', 'sbom'],
    },
  ],
};

export default templateSet;
