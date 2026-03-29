/**
 * Biotechnology Industry Vertical — Common Templates
 *
 * Comprehensive biotech-specific requirements and tests covering cell bank
 * characterization, viral clearance, protein purification, bioassay validation,
 * cold chain, biosafety, genetic stability, HCP quantification, endotoxin testing,
 * chromatography qualification, fermentation, formulation stability, comparability
 * studies, reference standards, and Process Analytical Technology (PAT).
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // Cell Bank Characterization
  // -----------------------------------------------------------------------
  {
    title: 'Cell Bank Characterization and Testing',
    description:
      'Master Cell Banks (MCBs) and Working Cell Banks (WCBs) shall be established, characterized, and tested in accordance with ICH Q5A(R2) and ICH Q5D. Characterization shall include: identity testing (isoenzyme analysis, DNA fingerprinting, or STR profiling), purity testing (sterility, mycoplasma, adventitious virus detection), karyology (for continuous cell lines), tumorigenicity assessment (where applicable), growth characteristics, and expression stability over the production cell age limit. Cell banks shall be stored under validated conditions with two-site backup.',
    category: 'Cell Biology',
    tags: ['cell-bank', 'mcb', 'wcb', 'characterization', 'ich-q5a', 'ich-q5d'],
    riskLevel: 'critical',
    regulatoryRef: 'ICH Q5A(R2); ICH Q5D; 21 CFR 610.18',
  },
  // -----------------------------------------------------------------------
  // Viral Clearance
  // -----------------------------------------------------------------------
  {
    title: 'Viral Clearance Validation',
    description:
      'Viral clearance studies shall demonstrate that the manufacturing process provides adequate assurance of viral safety for biotechnology-derived products per ICH Q5A(R2). Studies shall: use relevant and model viruses representing a range of physicochemical properties, evaluate both inactivation and removal steps independently, employ scaled-down models qualified to represent manufacturing-scale operations, calculate log reduction values (LRV) for each step, and establish cumulative clearance factors. A minimum overall clearance of 12-18 log10 for relevant retroviruses is typically expected.',
    category: 'Viral Safety',
    tags: ['viral-clearance', 'virus-validation', 'lrv', 'ich-q5a'],
    riskLevel: 'critical',
    regulatoryRef: 'ICH Q5A(R2) Section 6; EMEA/CHMP/BWP/398498/2005',
  },
  // -----------------------------------------------------------------------
  // Protein Purification
  // -----------------------------------------------------------------------
  {
    title: 'Protein Purification Process Validation',
    description:
      'Downstream purification processes for recombinant proteins and monoclonal antibodies shall be validated to consistently produce drug substance meeting predetermined quality attributes. Validation shall address: chromatography step performance (binding capacity, selectivity, resolution), filtration integrity (virus filtration, UF/DF), host cell protein (HCP) clearance, DNA clearance, aggregate removal, leached Protein A clearance (for mAb processes), and process-related impurity profiles. Resin/membrane lifetime and reuse studies shall support the maximum number of cycles claimed.',
    category: 'Downstream Processing',
    tags: ['protein-purification', 'downstream', 'chromatography', 'validation'],
    riskLevel: 'high',
    regulatoryRef: 'ICH Q7 Section 12; ICH Q11; FDA Guidance on Process Validation (2011)',
  },
  // -----------------------------------------------------------------------
  // Bioassay Validation
  // -----------------------------------------------------------------------
  {
    title: 'Bioassay Validation for Potency Testing',
    description:
      'Bioassays used for potency determination of biological products shall be validated per ICH Q2(R2) with additional considerations for biological assay variability. Validation shall demonstrate: specificity, linearity (relative potency using parallel line analysis or logistic regression), accuracy (recovery studies against reference standard), precision (repeatability, intermediate precision, and reproducibility), range, and robustness. System suitability criteria shall be established. Assay qualification with potency trending shall be maintained to monitor assay performance over time.',
    category: 'Analytical',
    tags: ['bioassay', 'potency', 'validation', 'ich-q2'],
    riskLevel: 'critical',
    regulatoryRef: 'ICH Q2(R2); ICH Q6B; USP <1032>-<1034> (Biological Assay Validation)',
  },
  // -----------------------------------------------------------------------
  // Cold Chain
  // -----------------------------------------------------------------------
  {
    title: 'Cold Chain Qualification and Monitoring',
    description:
      'Cold chain systems for storage and transport of biological materials, drug substances, and drug products requiring controlled temperature shall be qualified and continuously monitored. Qualification shall include: thermal mapping of storage areas (per WHO TRS 961 Annex 9 or equivalent), qualification of shipping containers and insulated packaging (summer and winter profiles), validation of temperature monitoring devices (calibrated to traceable standards), alarm systems with 24/7 notification, and documented backup procedures for equipment failure. Temperature excursion investigation and product impact assessment SOPs shall be in place.',
    category: 'Supply Chain',
    tags: ['cold-chain', 'temperature-control', 'qualification', 'monitoring'],
    riskLevel: 'high',
    regulatoryRef: 'WHO TRS 961 Annex 9; EU GDP Guidelines; USP <1079>',
  },
  // -----------------------------------------------------------------------
  // Biosafety
  // -----------------------------------------------------------------------
  {
    title: 'Biosafety Classification and Containment',
    description:
      'Facilities handling biological agents shall implement biosafety measures commensurate with the risk group classification of the organisms per WHO Laboratory Biosafety Manual (4th edition) and national biosafety regulations. Requirements include: biological risk assessment, appropriate Biosafety Level (BSL-1 through BSL-4) containment, engineering controls (biological safety cabinets, HEPA filtration, negative pressure), administrative controls (SOPs, access restrictions, training), personal protective equipment, waste decontamination procedures (autoclaving, chemical inactivation), and emergency response plans for spills or exposures.',
    category: 'Biosafety',
    tags: ['biosafety', 'containment', 'risk-group', 'bsl'],
    riskLevel: 'critical',
    regulatoryRef: 'WHO Laboratory Biosafety Manual (4th ed., 2020); NIH Guidelines for rDNA; EU Directive 2000/54/EC',
  },
  // -----------------------------------------------------------------------
  // Genetic Stability
  // -----------------------------------------------------------------------
  {
    title: 'Genetic Stability Assessment',
    description:
      'Genetic stability of the production cell line shall be demonstrated over the proposed production cell age (in vitro cell age or population doublings) per ICH Q5B. Assessment shall include: restriction enzyme mapping or sequence analysis of the expression construct at MCB, WCB, and end-of-production (EOP) cells; copy number analysis; mRNA expression levels; and product quality attribute comparison (glycosylation profile, charge variants, potency) between early and late passage material. Predefined acceptance criteria shall be established for each stability indicator.',
    category: 'Cell Biology',
    tags: ['genetic-stability', 'cell-line', 'expression-construct', 'ich-q5b'],
    riskLevel: 'high',
    regulatoryRef: 'ICH Q5B; ICH Q5D',
  },
  // -----------------------------------------------------------------------
  // HCP Quantification
  // -----------------------------------------------------------------------
  {
    title: 'Host Cell Protein (HCP) Quantification and Control',
    description:
      'Host cell protein (HCP) levels in drug substance and drug product shall be quantified using validated immunoassays (ELISA) with demonstrated coverage and orthogonal methods. The HCP ELISA shall be qualified for: antibody coverage (2D Western blot or mass spectrometry comparison), specificity, process-specific reactivity, linearity, precision, accuracy, and limit of quantitation. HCP specifications shall be established based on clinical experience and risk assessment. Orthogonal methods (LC-MS/MS HCP profiling) shall be used to identify and monitor individual HCPs that may pose immunogenicity or safety risks.',
    category: 'Analytical',
    tags: ['hcp', 'host-cell-protein', 'elisa', 'impurity-control'],
    riskLevel: 'high',
    regulatoryRef: 'ICH Q6B; FDA Guidance on Immunogenicity Assessment; USP <1132>',
  },
  // -----------------------------------------------------------------------
  // Endotoxin Testing
  // -----------------------------------------------------------------------
  {
    title: 'Endotoxin Testing and Pyrogen Control',
    description:
      'Bacterial endotoxin testing (BET) shall be performed on raw materials, in-process intermediates, drug substances, and drug products per USP <85> / Ph. Eur. 2.6.14 using validated Limulus Amebocyte Lysate (LAL) methods or recombinant Factor C (rFC) assays. Method suitability shall be demonstrated including interference testing. Endotoxin limits shall be calculated based on the maximum valid dilution (MVD) and the route/dose of administration (typically 5 EU/kg for parenteral products). Process endotoxin controls including depyrogenation validation (minimum 3-log reduction) shall be established.',
    category: 'Quality Control',
    tags: ['endotoxin', 'bet', 'lal', 'pyrogen', 'depyrogenation'],
    riskLevel: 'critical',
    regulatoryRef: 'USP <85>; Ph. Eur. 2.6.14; FDA Guidance on Pyrogen and Endotoxins Testing',
  },
  // -----------------------------------------------------------------------
  // Chromatography Qualification
  // -----------------------------------------------------------------------
  {
    title: 'Chromatography Column and Resin Qualification',
    description:
      'Chromatography columns and resins used in manufacturing shall be qualified for their intended use. Qualification shall address: packing qualification (HETP and asymmetry testing per column dimensions), resin lifetime/reuse validation (binding capacity trending, impurity clearance at end-of-life, leachables assessment), sanitization/CIP effectiveness, storage stability, and shipping qualification. Resin lot-to-lot variability assessment shall be performed. Column packing integrity tests shall be conducted at installation and periodically during use. Resin replacement criteria shall be predefined.',
    category: 'Downstream Processing',
    tags: ['chromatography', 'column-qualification', 'resin', 'hetp'],
    riskLevel: 'medium',
    regulatoryRef: 'ICH Q7 Section 12.7; PDA TR No. 14 (Chromatography)',
  },
  // -----------------------------------------------------------------------
  // Fermentation / Cell Culture
  // -----------------------------------------------------------------------
  {
    title: 'Fermentation / Cell Culture Process Characterization',
    description:
      'Upstream cell culture or fermentation processes shall be characterized per ICH Q8/Q11 principles to identify critical process parameters (CPPs) and their relationship to critical quality attributes (CQAs). Characterization shall include: DoE-based multivariate studies, scale-down model qualification, establishment of proven acceptable ranges (PARs) and normal operating ranges (NORs), characterization of raw material impacts (especially serum-free media components), and demonstration of process robustness. Process parameters classified as critical shall have defined control strategies.',
    category: 'Upstream Processing',
    tags: ['fermentation', 'cell-culture', 'process-characterization', 'cpp', 'cqa'],
    riskLevel: 'high',
    regulatoryRef: 'ICH Q8(R2); ICH Q11; ICH Q12 (Lifecycle Management)',
  },
  // -----------------------------------------------------------------------
  // Formulation Stability
  // -----------------------------------------------------------------------
  {
    title: 'Biologic Formulation Stability Program',
    description:
      'A stability program for biologic drug products shall be established per ICH Q5C to evaluate the impact of storage conditions on product quality over time. Studies shall include: real-time/real-condition stability (e.g., 2-8 C), accelerated stability (e.g., 25 C), stress stability (e.g., 40 C, light, agitation, freeze-thaw), and in-use stability. Stability-indicating methods shall detect degradation pathways specific to biologics: aggregation (SEC, DLS), fragmentation (CE-SDS), oxidation (peptide mapping), deamidation (IEX/iCIEF), glycosylation changes, and potency loss. Shelf life shall be established from primary stability data.',
    category: 'Stability',
    tags: ['stability', 'formulation', 'ich-q5c', 'shelf-life', 'degradation'],
    riskLevel: 'high',
    regulatoryRef: 'ICH Q5C; ICH Q1A(R2); WHO TRS 953 Annex 2',
  },
  // -----------------------------------------------------------------------
  // Comparability Studies
  // -----------------------------------------------------------------------
  {
    title: 'Comparability Studies for Manufacturing Changes',
    description:
      'Manufacturing changes to biotechnology products shall be evaluated through comparability studies per ICH Q5E to demonstrate that the change does not adversely impact quality, safety, or efficacy. The comparability protocol shall define: analytical methods (physicochemical, biological activity, immunochemical), acceptance criteria (equivalence or non-inferiority), statistical approach, and the extent of non-clinical/clinical bridging data required. Changes classified as major (e.g., cell line change, new facility) require comprehensive comparability with potential clinical bridging. Head-to-head analytical comparisons shall include multiple pre-change and post-change batches.',
    category: 'Change Management',
    tags: ['comparability', 'manufacturing-change', 'ich-q5e', 'bridging'],
    riskLevel: 'critical',
    regulatoryRef: 'ICH Q5E; FDA Guidance on Comparability Protocols; EMA Guideline on Comparability',
  },
  // -----------------------------------------------------------------------
  // Reference Standards
  // -----------------------------------------------------------------------
  {
    title: 'Biological Reference Standard Qualification',
    description:
      'In-house reference standards for biological products shall be established and qualified per ICH Q6B and WHO guidelines. Qualification shall include: comprehensive physicochemical and biological characterization, assignment of potency value traceable to an international or national reference standard (where available), stability determination under proposed storage conditions, and homogeneity assessment. Reference standard replacement shall follow a bridging protocol comparing the new lot to the outgoing lot using multiple analytical techniques. Reference standard use records and remaining inventory shall be monitored.',
    category: 'Quality Control',
    tags: ['reference-standard', 'qualification', 'potency-assignment', 'ich-q6b'],
    riskLevel: 'high',
    regulatoryRef: 'ICH Q6B; WHO TRS 943 Annex 2; USP <1121>',
  },
  // -----------------------------------------------------------------------
  // Process Analytical Technology (PAT)
  // -----------------------------------------------------------------------
  {
    title: 'Process Analytical Technology (PAT) Implementation',
    description:
      'Process Analytical Technology (PAT) tools shall be implemented per FDA PAT Guidance and ICH Q8/Q9/Q10 to enable real-time monitoring and control of critical process parameters and quality attributes during biologic manufacturing. PAT implementation shall include: selection and qualification of appropriate analyzers (Raman, NIR, FTIR, multi-angle light scattering, capacitance probes, off-gas analysis), multivariate data analysis (MVDA) model development and maintenance, integration with process control systems, definition of PAT-based control strategies (e.g., automated harvest triggers, feedback control of nutrient feeds), and lifecycle management of PAT models.',
    category: 'Process Control',
    tags: ['pat', 'process-analytical-technology', 'real-time-monitoring', 'mvda'],
    riskLevel: 'medium',
    regulatoryRef: 'FDA PAT Guidance (2004); ICH Q8(R2); ICH Q13 (Continuous Manufacturing)',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify Cell Bank Characterization Documentation',
    description:
      'Review MCB and WCB characterization reports for completeness per ICH Q5A/Q5D. Verify identity testing results, purity test results (sterility, mycoplasma, adventitious virus), karyology (if applicable), and two-site storage records. Confirm that cell bank testing was performed at a qualified laboratory.',
    category: 'Cell Biology',
    tags: ['cell-bank', 'characterization', 'documentation-test'],
    linkedReqTags: ['cell-bank', 'mcb', 'wcb', 'characterization'],
  },
  {
    title: 'Verify Viral Clearance Study Design and Results',
    description:
      'Audit viral clearance study reports for ICH Q5A(R2) compliance. Verify that relevant and model viruses with diverse physicochemical properties were used, that scale-down models were qualified, that individual step LRVs and cumulative clearance factors are calculated correctly, and that overall clearance meets the expected safety margin for the product type.',
    category: 'Viral Safety',
    tags: ['viral-clearance', 'study-review', 'safety-test'],
    linkedReqTags: ['viral-clearance', 'virus-validation', 'lrv'],
  },
  {
    title: 'Verify Bioassay Validation Report',
    description:
      'Review the bioassay validation report for potency testing against ICH Q2(R2) and USP requirements. Verify parallel line or logistic regression analysis is statistically sound, system suitability criteria are defined and met, accuracy and precision results are within predefined limits, and trending data demonstrates consistent assay performance.',
    category: 'Analytical',
    tags: ['bioassay', 'potency', 'validation-test'],
    linkedReqTags: ['bioassay', 'potency', 'validation'],
  },
  {
    title: 'Verify Cold Chain Qualification and Monitoring',
    description:
      'Review thermal mapping reports for storage areas, shipping container qualification data (summer/winter profiles), temperature monitoring device calibration records, and alarm notification test results. Verify that temperature excursion investigation SOPs are in place and that backup procedures for equipment failure are documented and tested.',
    category: 'Supply Chain',
    tags: ['cold-chain', 'qualification', 'monitoring-test'],
    linkedReqTags: ['cold-chain', 'temperature-control', 'qualification'],
  },
  {
    title: 'Verify Genetic Stability Data Over Production Cell Age',
    description:
      'Review genetic stability data from MCB, WCB, and end-of-production cells. Verify restriction enzyme mapping or sequencing results show construct integrity, copy number is consistent, mRNA expression levels are maintained, and product quality attributes (glycosylation, charge variants, potency) remain within acceptance criteria at the production cell age limit.',
    category: 'Cell Biology',
    tags: ['genetic-stability', 'cell-line', 'stability-test'],
    linkedReqTags: ['genetic-stability', 'cell-line', 'expression-construct'],
  },
  {
    title: 'Verify HCP ELISA Coverage and Orthogonal Profiling',
    description:
      'Review HCP ELISA qualification data including antibody coverage assessment (2D Western blot or mass spectrometry). Verify that process-specific reactivity is demonstrated, validation parameters (specificity, linearity, precision, accuracy, LOQ) meet acceptance criteria, and orthogonal LC-MS/MS HCP profiling has been performed to identify individual risk-relevant HCPs.',
    category: 'Analytical',
    tags: ['hcp', 'elisa', 'coverage-test'],
    linkedReqTags: ['hcp', 'host-cell-protein', 'elisa'],
  },
  {
    title: 'Verify Endotoxin Testing Method Suitability',
    description:
      'Review BET method suitability studies for each sample type (raw materials, intermediates, drug substance, drug product). Verify interference testing results, confirm endotoxin limits are correctly calculated based on MVD and dosing, and verify depyrogenation validation data demonstrates minimum 3-log endotoxin reduction.',
    category: 'Quality Control',
    tags: ['endotoxin', 'bet', 'suitability-test'],
    linkedReqTags: ['endotoxin', 'bet', 'lal', 'pyrogen'],
  },
  {
    title: 'Verify Comparability Study Protocol and Results',
    description:
      'For manufacturing changes, review the comparability protocol for completeness per ICH Q5E. Verify analytical methods cover all CQAs, acceptance criteria are predefined using appropriate statistical approaches, pre-change and post-change batches are adequately represented, and conclusions are supported by data. Confirm that clinical bridging is addressed for major changes.',
    category: 'Change Management',
    tags: ['comparability', 'manufacturing-change', 'protocol-test'],
    linkedReqTags: ['comparability', 'manufacturing-change', 'ich-q5e'],
  },
  {
    title: 'Verify Fermentation/Cell Culture Process Characterization',
    description:
      'Review process characterization study reports. Verify DoE study designs are appropriate, scale-down model qualification is documented, CPP-CQA relationships are established with statistical rigor, proven acceptable ranges and normal operating ranges are defined, and the control strategy addresses all identified critical parameters.',
    category: 'Upstream Processing',
    tags: ['fermentation', 'process-characterization', 'doe-test'],
    linkedReqTags: ['fermentation', 'cell-culture', 'process-characterization'],
  },
  {
    title: 'Verify PAT Implementation and Model Lifecycle',
    description:
      'Audit PAT instrument qualification records and multivariate model validation documentation. Verify analyzer calibration and performance qualification, MVDA model training/validation/test dataset segregation, model performance metrics (RMSEP, R-squared), integration with process control systems, and lifecycle management procedures for model retraining and version control.',
    category: 'Process Control',
    tags: ['pat', 'model-validation', 'pat-test'],
    linkedReqTags: ['pat', 'process-analytical-technology', 'real-time-monitoring'],
  },
];
