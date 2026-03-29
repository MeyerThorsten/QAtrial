/**
 * Cosmetics / Chemical Industry Vertical — Common Templates
 *
 * Comprehensive requirements and tests covering product safety assessment,
 * microbiological quality, preservative efficacy, stability testing, heavy metals,
 * INCI labeling, ISO 22716 GMP, allergen management, packaging compatibility,
 * Product Information File (PIF), toxicological assessment, and marketing claims.
 */

import type { TemplateRequirement, TemplateTest } from '../../types';

export const requirements: TemplateRequirement[] = [
  // -----------------------------------------------------------------------
  // Product Safety Assessment
  // -----------------------------------------------------------------------
  {
    title: 'Cosmetic Product Safety Assessment (CPSR)',
    description:
      'Every cosmetic product placed on the market shall undergo a safety assessment performed by a qualified safety assessor per EU Cosmetics Regulation 1223/2009 Article 10 and Annex I. The Cosmetic Product Safety Report (CPSR) shall contain Part A (cosmetic product safety information): quantitative/qualitative composition, physical/chemical characteristics, microbiological quality, impurities, packaging information, normal/reasonably foreseeable use, exposure assessment, substance toxicological profiles, undesirable effects, and product information; and Part B (cosmetic product safety assessment): assessment conclusion, labeled warnings, reasoning, and assessor credentials. The safety assessment shall be updated when new information becomes available.',
    category: 'Product Safety',
    tags: ['cpsr', 'safety-assessment', 'eu-1223-2009', 'cosmetics'],
    riskLevel: 'critical',
    regulatoryRef: 'EU Cosmetics Regulation 1223/2009 Article 10, Annex I',
  },
  // -----------------------------------------------------------------------
  // Microbiological Quality
  // -----------------------------------------------------------------------
  {
    title: 'Microbiological Quality Testing of Cosmetic Products',
    description:
      'Cosmetic products shall be tested for microbiological quality per ISO 17516 (Microbiological Limits) and the specific test methods of ISO 21149 (aerobic mesophilic bacteria), ISO 22717 (Pseudomonas aeruginosa), ISO 22718 (Staphylococcus aureus), ISO 18416 (Candida albicans), and ISO 21150 (Escherichia coli). Products shall meet the following limits: Category 1 products (eye area, children under 3, mucous membranes) — total aerobic count < 100 CFU/g and absence of specified organisms; Category 2 products (all others) — total aerobic count < 1,000 CFU/g and absence of specified organisms. Testing shall be performed on finished products from each manufacturing lot.',
    category: 'Microbiological Quality',
    tags: ['microbiology', 'iso-17516', 'cfu', 'cosmetics'],
    riskLevel: 'high',
    regulatoryRef: 'ISO 17516:2014; ISO 21149; ISO 22717; ISO 22718; ISO 18416; ISO 21150',
  },
  // -----------------------------------------------------------------------
  // Preservative Efficacy
  // -----------------------------------------------------------------------
  {
    title: 'Preservative Efficacy Testing (Challenge Test)',
    description:
      'Cosmetic products containing water or susceptible to microbial contamination shall undergo preservative efficacy testing (challenge test) per ISO 11930 (Evaluation of the Antimicrobial Protection of a Cosmetic Product) or equivalent pharmacopoeial methods (Ph. Eur. 5.1.3, USP <51>). The test shall challenge the product with standardized inocula of bacteria (Pseudomonas aeruginosa, Staphylococcus aureus, Escherichia coli), yeasts (Candida albicans), and molds (Aspergillus brasiliensis) at defined concentrations. Log reduction criteria must be met at specified time intervals (Day 7, 14, and 28). Testing shall be performed on the final formulation in the intended primary packaging.',
    category: 'Preservation',
    tags: ['preservative-efficacy', 'challenge-test', 'iso-11930', 'cosmetics'],
    riskLevel: 'high',
    regulatoryRef: 'ISO 11930:2019; Ph. Eur. 5.1.3; USP <51>',
  },
  // -----------------------------------------------------------------------
  // Stability Testing
  // -----------------------------------------------------------------------
  {
    title: 'Cosmetic Product Stability Testing Program',
    description:
      'A stability testing program shall be established for all cosmetic products to determine shelf life and establish appropriate storage conditions. The program shall include: accelerated stability testing (40 C / 75% RH or thermal cycling 4 C / 45 C), long-term stability (25 C / 60% RH or room temperature), photostability testing (ICH Q1B-aligned for light-sensitive products), freeze-thaw cycling, and centrifugation stress testing. Stability-indicating parameters shall include: organoleptic properties (appearance, color, odor), pH, viscosity, specific gravity, microbiological quality, preservative efficacy, and active ingredient assay (for functional cosmetics). Testing intervals: 0, 1, 2, 3, 6, 9, 12 months minimum.',
    category: 'Stability',
    tags: ['stability', 'shelf-life', 'accelerated', 'cosmetics'],
    riskLevel: 'high',
    regulatoryRef: 'EU Cosmetics Regulation 1223/2009 Annex I; CTFA/PCPC Stability Testing Guidelines; ISO 22716:2007 Section 9',
  },
  // -----------------------------------------------------------------------
  // Heavy Metals
  // -----------------------------------------------------------------------
  {
    title: 'Heavy Metal and Trace Element Limits',
    description:
      'Cosmetic products and raw materials shall be tested for heavy metals and trace elements to ensure they comply with established safety limits. Testing shall cover: lead (< 10 ppm per EU SCCS, < 10 ppm per FDA draft guidance), arsenic (< 2 ppm), mercury (< 1 ppm per EU Annex II, < 1 ppm per FDA), cadmium (< 5 ppm per ASEAN Guidelines), chromium (< 1 ppm Cr(VI)), nickel (< 10 ppm for leave-on products per SCCS), and antimony (< 5 ppm). Analysis shall be performed using validated ICP-MS or ICP-OES methods per ISO 17025-accredited procedures. Raw material specifications shall include heavy metal limits.',
    category: 'Chemical Safety',
    tags: ['heavy-metals', 'trace-elements', 'icp-ms', 'cosmetics'],
    riskLevel: 'high',
    regulatoryRef: 'EU SCCS Notes of Guidance (12th Revision); FDA Draft Guidance on Lead in Cosmetics; ASEAN Cosmetics Directive',
  },
  // -----------------------------------------------------------------------
  // INCI Labeling
  // -----------------------------------------------------------------------
  {
    title: 'INCI Labeling and Product Information',
    description:
      'Cosmetic product labeling shall comply with EU Cosmetics Regulation 1223/2009 Article 19 (or FDA FD&C Act Section 701 for US market). The ingredient list shall use International Nomenclature of Cosmetic Ingredients (INCI) names per ISO 16128 and the INCI Ingredient Dictionary (PCPC). Requirements include: ingredients listed in descending order of concentration (ingredients below 1% may be listed in any order), colorants listed by CI number, fragrance/aroma identified as "parfum"/"aroma", nanomaterials identified with "(nano)" suffix, mandatory labeling of 26 allergenic fragrance substances (per EU Regulation when exceeding 10 ppm in leave-on or 100 ppm in rinse-off products), and PAO (Period After Opening) or minimum durability date.',
    category: 'Labeling',
    tags: ['inci', 'labeling', 'ingredients', 'eu-1223-2009', 'cosmetics'],
    riskLevel: 'critical',
    regulatoryRef: 'EU Cosmetics Regulation 1223/2009 Article 19; ISO 16128; FDA 21 CFR 701.3',
  },
  // -----------------------------------------------------------------------
  // ISO 22716 GMP
  // -----------------------------------------------------------------------
  {
    title: 'ISO 22716 GMP for Cosmetics Manufacturing',
    description:
      'Cosmetic manufacturing operations shall comply with ISO 22716:2007 (GMP for Cosmetics), which is the harmonized standard referenced by EU Cosmetics Regulation 1223/2009 Article 8. The GMP system shall cover: personnel (training, hygiene, health), premises (design, maintenance, cleaning, pest control), equipment (design, installation, calibration, maintenance), raw materials and packaging materials (purchasing, receipt, identification, storage, release), production (documentation, manufacturing, filling, bulk storage), finished products (release, storage, shipment), quality control laboratory (sampling, testing, OOS investigation), waste treatment, deviation and complaint handling, change control, internal audits, and documentation management.',
    category: 'GMP',
    tags: ['iso-22716', 'gmp', 'manufacturing', 'cosmetics'],
    riskLevel: 'critical',
    regulatoryRef: 'ISO 22716:2007; EU Cosmetics Regulation 1223/2009 Article 8',
  },
  // -----------------------------------------------------------------------
  // Allergen Management
  // -----------------------------------------------------------------------
  {
    title: 'Allergen Management and Sensitization Risk Control',
    description:
      'A comprehensive allergen management program shall be implemented to control sensitization risk in cosmetic products. The program shall include: identification and labeling of 26 EU-regulated allergenic fragrance substances (per 7th Amendment to the Cosmetics Directive, with expanded list under EU 2023/1545), QSAR and in vitro sensitization testing for novel ingredients (DPRA, h-CLAT, KeratinoSens per OECD TG 442C/D/E), cross-contamination controls during manufacturing (dedicated lines or validated cleaning), nickel release testing for metal components in contact with skin (per EN 1811), and post-market surveillance for adverse reaction reports related to allergic contact dermatitis.',
    category: 'Safety',
    tags: ['allergen', 'sensitization', 'fragrance', 'cosmetics'],
    riskLevel: 'high',
    regulatoryRef: 'EU Cosmetics Regulation 1223/2009 Annex III; EU 2023/1545; SCCS Sensitization Guidance',
  },
  // -----------------------------------------------------------------------
  // Packaging Compatibility
  // -----------------------------------------------------------------------
  {
    title: 'Packaging Compatibility and Interaction Testing',
    description:
      'Primary packaging materials shall be evaluated for compatibility with the cosmetic formulation per ISO 22716:2007 Section 8. Testing shall assess: chemical compatibility (migration of packaging components into product, absorption of product components by packaging), physical compatibility (seal integrity, barrier properties, dimensional stability), functional performance (dispensing accuracy for pumps/sprays, closure torque retention), and aesthetic stability (label adhesion, print durability, color stability). Compatibility studies shall be conducted at accelerated and long-term storage conditions. Materials in contact with the product shall comply with applicable food-contact or pharmaceutical packaging regulations where consumer safety applies.',
    category: 'Packaging',
    tags: ['packaging', 'compatibility', 'migration', 'cosmetics'],
    riskLevel: 'medium',
    regulatoryRef: 'ISO 22716:2007 Section 8; EU Framework Regulation 1935/2004 (where applicable)',
  },
  // -----------------------------------------------------------------------
  // Product Information File (PIF)
  // -----------------------------------------------------------------------
  {
    title: 'Product Information File (PIF) Maintenance',
    description:
      'A Product Information File (PIF) shall be established and maintained for each cosmetic product placed on the EU market per EU Cosmetics Regulation 1223/2009 Article 11. The PIF shall contain: product description, CPSR (Part A and Part B), manufacturing method description and GMP declaration, proof of claimed effects (efficacy evidence), and animal testing data (pre-March 2013 ingredients only). The PIF shall be kept at the designated EU address for 10 years after the last batch is placed on the market. The PIF shall be made available to competent authorities upon request. The Responsible Person shall keep the PIF electronically organized and readily accessible.',
    category: 'Regulatory Documentation',
    tags: ['pif', 'product-information-file', 'eu-1223-2009', 'cosmetics'],
    riskLevel: 'critical',
    regulatoryRef: 'EU Cosmetics Regulation 1223/2009 Article 11; CPNP Registration',
  },
  // -----------------------------------------------------------------------
  // Toxicological Assessment
  // -----------------------------------------------------------------------
  {
    title: 'Toxicological Assessment of Cosmetic Ingredients',
    description:
      'Toxicological profiles shall be established for all cosmetic ingredients using non-animal alternative methods in compliance with the EU animal testing ban (Regulation 1223/2009 Article 18). Assessment shall include: acute toxicity (in silico / in vitro), skin and eye irritation (EpiDerm/EpiSkin per OECD TG 431/439, EpiOcular per OECD TG 492), skin sensitization (DPRA OECD TG 442C, h-CLAT TG 442E, KeratinoSens TG 442D), genotoxicity (Ames OECD TG 471, in vitro micronucleus OECD TG 487), dermal absorption (OECD TG 428), reproductive toxicity assessment, and calculation of Margin of Safety (MoS >= 100 based on NOAEL/SED per SCCS Notes of Guidance).',
    category: 'Toxicology',
    tags: ['toxicology', 'mos', 'sccs', 'alternative-methods', 'cosmetics'],
    riskLevel: 'critical',
    regulatoryRef: 'EU Cosmetics Regulation 1223/2009 Article 18, Annex I; SCCS Notes of Guidance (12th Revision); OECD TG Series',
  },
  // -----------------------------------------------------------------------
  // Marketing Claims
  // -----------------------------------------------------------------------
  {
    title: 'Marketing Claims Substantiation',
    description:
      'Marketing claims for cosmetic products shall comply with EU Commission Regulation 655/2013 (Common Criteria for Claims) and the Technical Document on Cosmetic Claims. Claims shall be: legally compliant (no medicinal claims for cosmetics), truthful (supported by evidence), evidence-based (instrumental studies, consumer panels, clinical evaluation as appropriate), honest (not misleading about product function), fair (no denigration of competitors), and enabling informed decisions (clear and understandable). Specific claim types requiring substantiation include: anti-aging (clinical photography, profilometry), moisturizing (corneometry), SPF (ISO 24444 in vivo or equivalent), hypoallergenic (HRIPT or repeat open application test), and natural/organic (ISO 16128 index calculation).',
    category: 'Claims',
    tags: ['claims', 'substantiation', 'eu-655-2013', 'cosmetics'],
    riskLevel: 'medium',
    regulatoryRef: 'EU Commission Regulation 655/2013; Technical Document on Cosmetic Claims; ISO 24444 (SPF); ISO 16128 (Natural/Organic)',
  },
];

export const tests: TemplateTest[] = [
  {
    title: 'Verify Cosmetic Product Safety Report (CPSR) Completeness',
    description:
      'Review CPSR for a representative product against EU 1223/2009 Annex I requirements. Verify Part A completeness (composition, characteristics, microbiology, impurities, packaging, exposure, toxicological profiles) and Part B (safety conclusion, warnings, assessor qualifications). Confirm the safety assessor holds appropriate qualifications and the assessment is current.',
    category: 'Product Safety',
    tags: ['cpsr', 'safety-assessment', 'completeness-test'],
    linkedReqTags: ['cpsr', 'safety-assessment', 'eu-1223-2009'],
  },
  {
    title: 'Verify Microbiological Quality Testing and Limits',
    description:
      'Review microbiological testing records for finished products. Verify testing is performed per ISO 17516 with appropriate methods (ISO 21149, 22717, 22718, 18416, 21150). Confirm Category 1 products meet < 100 CFU/g and Category 2 products meet < 1,000 CFU/g. Verify absence of specified organisms. Check that testing is performed per lot.',
    category: 'Microbiological Quality',
    tags: ['microbiology', 'limits', 'testing-review'],
    linkedReqTags: ['microbiology', 'iso-17516', 'cfu'],
  },
  {
    title: 'Verify Preservative Efficacy (Challenge Test) Results',
    description:
      'Review challenge test reports per ISO 11930. Verify that all five challenge organisms were tested at prescribed inoculum concentrations. Confirm log reduction criteria are met at Day 7, 14, and 28 intervals. Verify testing was performed on the final formulation in its intended primary packaging. Check that the test laboratory is ISO 17025 accredited.',
    category: 'Preservation',
    tags: ['preservative-efficacy', 'challenge-test', 'results-review'],
    linkedReqTags: ['preservative-efficacy', 'challenge-test', 'iso-11930'],
  },
  {
    title: 'Verify ISO 22716 GMP Compliance',
    description:
      'Audit manufacturing operations against ISO 22716:2007 requirements. Verify: personnel training and hygiene records, premises cleaning and pest control logs, equipment calibration and maintenance records, raw material receipt and testing documentation, batch manufacturing records, finished product release criteria, QC laboratory OOS investigation procedures, and internal audit program. Confirm GMP declaration is available for the PIF.',
    category: 'GMP',
    tags: ['iso-22716', 'gmp', 'audit-test'],
    linkedReqTags: ['iso-22716', 'gmp', 'manufacturing'],
  },
  {
    title: 'Verify INCI Labeling Compliance',
    description:
      'Review product labels for INCI compliance. Verify ingredients are listed in descending concentration order, INCI nomenclature is correct (per PCPC Dictionary), CI numbers are used for colorants, nanomaterials are identified with "(nano)", the 26 allergenic fragrance substances are declared when exceeding thresholds (10/100 ppm), and PAO or durability date is displayed. Cross-check label against CPNP notification.',
    category: 'Labeling',
    tags: ['inci', 'labeling', 'compliance-test'],
    linkedReqTags: ['inci', 'labeling', 'ingredients', 'eu-1223-2009'],
  },
  {
    title: 'Verify Heavy Metal Testing Results',
    description:
      'Review heavy metal testing reports for raw materials and finished products. Verify ICP-MS or ICP-OES method validation. Confirm lead (< 10 ppm), arsenic (< 2 ppm), mercury (< 1 ppm), cadmium (< 5 ppm), and other specified elements are within limits per SCCS/FDA guidance. Verify testing laboratory ISO 17025 accreditation.',
    category: 'Chemical Safety',
    tags: ['heavy-metals', 'testing', 'results-review'],
    linkedReqTags: ['heavy-metals', 'trace-elements', 'icp-ms'],
  },
  {
    title: 'Verify Toxicological Assessment and Margin of Safety',
    description:
      'Review toxicological profiles for key ingredients. Verify non-animal alternative methods are used (EpiDerm/EpiSkin, DPRA, h-CLAT, KeratinoSens, Ames, in vitro micronucleus). Confirm Margin of Safety (MoS) calculations use NOAEL and SED values with MoS >= 100 per SCCS guidance. Verify dermal absorption data supports the exposure assessment.',
    category: 'Toxicology',
    tags: ['toxicology', 'mos', 'assessment-review'],
    linkedReqTags: ['toxicology', 'mos', 'sccs', 'alternative-methods'],
  },
  {
    title: 'Verify Marketing Claims Substantiation',
    description:
      'Review claims substantiation dossiers for representative products against EU 655/2013 criteria (legal, truthful, evidence-based, honest, fair, informative). Verify that instrumental studies (profilometry, corneometry), clinical evaluations, or consumer panels support specific claims. For SPF claims, verify ISO 24444 testing. For natural/organic claims, verify ISO 16128 index calculations.',
    category: 'Claims',
    tags: ['claims', 'substantiation', 'dossier-review'],
    linkedReqTags: ['claims', 'substantiation', 'eu-655-2013'],
  },
];
