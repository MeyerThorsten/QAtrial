/**
 * Demo Project Configurations
 *
 * One demo project per country that has templates.
 * Each project includes realistic company names and descriptions
 * in the local language of the country, plus English translations.
 */

export interface DemoProject {
  countryCode: string;
  companyName: string;
  companyNameEn: string;
  projectName: string;
  projectNameEn: string;
  description: string;
  descriptionEn: string;
  vertical: string;
  projectType: string;
  modules: string[];
  owner: string;
  version: string;
}

export const DEMO_PROJECTS: DemoProject[] = [
  // ─── Americas ────────────────────────────────────────────────────────────────

  {
    countryCode: 'US',
    companyName: 'Meridian Therapeutics',
    companyNameEn: 'Meridian Therapeutics',
    projectName: 'LIMS Validation Suite v3.2',
    projectNameEn: 'LIMS Validation Suite v3.2',
    description:
      'Computer System Validation for the enterprise LIMS platform used across all Meridian Therapeutics manufacturing sites. Covers 21 CFR Part 11 compliance, data integrity, and electronic signatures per FDA guidance.',
    descriptionEn:
      'Computer System Validation for the enterprise LIMS platform used across all Meridian Therapeutics manufacturing sites. Covers 21 CFR Part 11 compliance, data integrity, and electronic signatures per FDA guidance.',
    vertical: 'pharma',
    projectType: 'software',
    modules: ['audit_trail', 'e_signatures', 'data_integrity', 'validation_csv', 'change_control'],
    owner: 'Sarah Chen, VP Quality Assurance',
    version: '3.2',
  },

  {
    countryCode: 'CA',
    companyName: 'NorthStar BioSystems',
    companyNameEn: 'NorthStar BioSystems',
    projectName: 'QMS Implementation for Class III Cardiac Monitor',
    projectNameEn: 'QMS Implementation for Class III Cardiac Monitor',
    description:
      'Full Quality Management System implementation for the NorthStar CardioVue continuous cardiac monitoring device. Aligned with Health Canada CMDR, ISO 13485:2016, and ISO 14971 risk management requirements.',
    descriptionEn:
      'Full Quality Management System implementation for the NorthStar CardioVue continuous cardiac monitoring device. Aligned with Health Canada CMDR, ISO 13485:2016, and ISO 14971 risk management requirements.',
    vertical: 'medical_devices',
    projectType: 'quality_system',
    modules: ['risk_management', 'document_control', 'capa', 'training'],
    owner: 'Dr. James Whitfield, Director RA/QA',
    version: '1.0',
  },

  {
    countryCode: 'MX',
    companyName: 'Laboratorios Azteca S.A. de C.V.',
    companyNameEn: 'Laboratorios Azteca S.A. de C.V.',
    projectName: 'Cumplimiento NOM-059-SSA1 y Buenas Prácticas de Fabricación',
    projectNameEn: 'NOM-059-SSA1 Compliance and Good Manufacturing Practices',
    description:
      'Proyecto de cumplimiento regulatorio para asegurar la conformidad con la NOM-059-SSA1-2015 de COFEPRIS. Incluye calificación de áreas limpias, validación de procesos de fabricación de formas farmacéuticas sólidas y documentación de Buenas Prácticas de Fabricación.',
    descriptionEn:
      'Regulatory compliance project to ensure conformity with COFEPRIS NOM-059-SSA1-2015. Includes clean room qualification, validation of solid dosage form manufacturing processes, and Good Manufacturing Practices documentation.',
    vertical: 'pharma',
    projectType: 'compliance',
    modules: ['document_control', 'capa', 'deviation', 'training', 'change_control'],
    owner: 'Ing. María Guadalupe Hernández, Directora de Calidad',
    version: '2.1',
  },

  // ─── Europe ──────────────────────────────────────────────────────────────────

  {
    countryCode: 'DE',
    companyName: 'Rheinland MedTech GmbH',
    companyNameEn: 'Rheinland MedTech GmbH',
    projectName: 'Embedded Firmware Validierung — Infusionspumpe RP-400',
    projectNameEn: 'Embedded Firmware Validation — Infusion Pump RP-400',
    description:
      'Vollständige IEC 62304 Software-Lebenszyklus-Dokumentation und Validierung der eingebetteten Firmware für die Infusionspumpe RP-400. Umfasst Risikoanalyse nach ISO 14971, Sicherheitsklassifizierung (Klasse C) und EU-MDR-konforme technische Dokumentation.',
    descriptionEn:
      'Complete IEC 62304 software lifecycle documentation and validation of embedded firmware for the RP-400 infusion pump. Includes ISO 14971 risk analysis, safety classification (Class C), and EU MDR-compliant technical documentation.',
    vertical: 'medical_devices',
    projectType: 'embedded',
    modules: ['risk_management', 'traceability', 'change_control', 'document_control'],
    owner: 'Dr.-Ing. Klaus Weber, Leiter Softwareentwicklung',
    version: '4.0',
  },

  {
    countryCode: 'GB',
    companyName: 'Thames Pharma Solutions Ltd',
    companyNameEn: 'Thames Pharma Solutions Ltd',
    projectName: 'CSV Programme for MES Platform Migration',
    projectNameEn: 'CSV Programme for MES Platform Migration',
    description:
      'Computer System Validation programme for the migration of the Manufacturing Execution System from legacy on-premises to cloud-hosted platform. Covers MHRA Data Integrity requirements, GAMP 5 risk-based approach, and EU Annex 11 compliance.',
    descriptionEn:
      'Computer System Validation programme for the migration of the Manufacturing Execution System from legacy on-premises to cloud-hosted platform. Covers MHRA Data Integrity requirements, GAMP 5 risk-based approach, and EU Annex 11 compliance.',
    vertical: 'pharma',
    projectType: 'validation',
    modules: ['validation_csv', 'data_integrity', 'audit_trail', 'backup_recovery', 'data_migration'],
    owner: 'Helen McPherson, Head of CSV',
    version: '1.0',
  },

  {
    countryCode: 'FR',
    companyName: 'Laboratoires Pasteur-Curie S.A.',
    companyNameEn: 'Laboratoires Pasteur-Curie S.A.',
    projectName: "Système qualité pour la production d'anticorps monoclonaux",
    projectNameEn: 'Quality System for Monoclonal Antibody Production',
    description:
      "Mise en place du système de management de la qualité pour la nouvelle ligne de production d'anticorps monoclonaux thérapeutiques. Conforme aux Bonnes Pratiques de Fabrication (BPF) de l'ANSM, aux exigences de l'EMA et à la norme ISO 13485 pour les dispositifs médicaux de diagnostic in vitro.",
    descriptionEn:
      'Implementation of the quality management system for the new therapeutic monoclonal antibody production line. Compliant with ANSM Good Manufacturing Practices (BPF), EMA requirements, and ISO 13485 for in vitro diagnostic medical devices.',
    vertical: 'biotech',
    projectType: 'quality_system',
    modules: ['document_control', 'change_control', 'deviation', 'capa', 'training'],
    owner: 'Dr. Isabelle Moreau, Directrice Assurance Qualité',
    version: '1.0',
  },

  {
    countryCode: 'IT',
    companyName: 'Farmaceutica Adriatica S.r.l.',
    companyNameEn: 'Farmaceutica Adriatica S.r.l.',
    projectName: 'Conformità GMP per produzione forme solide orali',
    projectNameEn: 'GMP Compliance for Oral Solid Dosage Production',
    description:
      "Progetto di conformità alle Norme di Buona Fabbricazione (NBF) per lo stabilimento di produzione di forme farmaceutiche solide orali. Include qualifica degli ambienti a contaminazione controllata, convalida dei processi produttivi e gestione della documentazione secondo le linee guida AIFA e dell'EMA.",
    descriptionEn:
      'Good Manufacturing Practice compliance project for the oral solid dosage manufacturing facility. Includes clean room qualification, manufacturing process validation, and documentation management per AIFA and EMA guidelines.',
    vertical: 'pharma',
    projectType: 'compliance',
    modules: ['document_control', 'deviation', 'capa', 'change_control'],
    owner: 'Dott.ssa Giulia Bianchi, Responsabile Qualità',
    version: '2.0',
  },

  {
    countryCode: 'ES',
    companyName: 'Laboratorios Ibéricos S.L.',
    companyNameEn: 'Laboratorios Ibéricos S.L.',
    projectName: 'Gestión de ensayos clínicos Fase II/III — Oncología',
    projectNameEn: 'Phase II/III Clinical Trial Management — Oncology',
    description:
      'Sistema de gestión de ensayos clínicos de Fase II y III en oncología. Cumplimiento con las Buenas Prácticas Clínicas (BPC) de la AEMPS, el Reglamento europeo de ensayos clínicos (UE) 536/2014 y los requisitos de integridad de datos del CTIS.',
    descriptionEn:
      'Phase II and III oncology clinical trial management system. Compliant with AEMPS Good Clinical Practice (GCP), European Clinical Trials Regulation (EU) 536/2014, and CTIS data integrity requirements.',
    vertical: 'cro',
    projectType: 'clinical',
    modules: ['audit_trail', 'e_signatures', 'data_integrity', 'document_control'],
    owner: 'Dra. Carmen Ruiz López, Directora de Investigación Clínica',
    version: '1.0',
  },

  {
    countryCode: 'NL',
    companyName: 'Van der Berg Diagnostics B.V.',
    companyNameEn: 'Van der Berg Diagnostics B.V.',
    projectName: 'Kwaliteitssysteem klinisch laboratorium ISO 15189',
    projectNameEn: 'Clinical Laboratory Quality System ISO 15189',
    description:
      'Implementatie van het kwaliteitsmanagementsysteem voor het klinisch diagnostisch laboratorium conform ISO 15189:2022 en de eisen van de Raad voor Accreditatie (RvA). Omvat meetonzekerheidsanalyse, interne kwaliteitscontrole en validatie van diagnostische methoden.',
    descriptionEn:
      'Quality management system implementation for the clinical diagnostic laboratory compliant with ISO 15189:2022 and Dutch Accreditation Council (RvA) requirements. Covers measurement uncertainty analysis, internal quality control, and diagnostic method validation.',
    vertical: 'clinical_lab',
    projectType: 'quality_system',
    modules: ['document_control', 'training', 'deviation', 'capa'],
    owner: 'Dr. Willem de Vries, Hoofd Laboratorium',
    version: '1.0',
  },

  {
    countryCode: 'PT',
    companyName: 'Farmácia Atlântica Lda.',
    companyNameEn: 'Farmácia Atlântica Lda.',
    projectName: 'Conformidade GDP para distribuição farmacêutica',
    projectNameEn: 'GDP Compliance for Pharmaceutical Distribution',
    description:
      'Projeto de conformidade com as Boas Práticas de Distribuição (BPD) para a cadeia de distribuição farmacêutica. Inclui qualificação de veículos de transporte, monitorização de temperatura, gestão de desvios e rastreabilidade conforme as diretrizes do INFARMED e da UE.',
    descriptionEn:
      'Good Distribution Practice (GDP) compliance project for the pharmaceutical distribution chain. Includes transport vehicle qualification, temperature monitoring, deviation management, and traceability per INFARMED and EU guidelines.',
    vertical: 'logistics',
    projectType: 'compliance',
    modules: ['document_control', 'deviation', 'training', 'supplier_qualification'],
    owner: 'Dr. António Ferreira, Diretor de Qualidade',
    version: '1.0',
  },

  // ─── Asia ────────────────────────────────────────────────────────────────────

  {
    countryCode: 'JP',
    companyName: '東京バイオサイエンス株式会社',
    companyNameEn: 'Tokyo BioScience K.K.',
    projectName: '再生医療等製品の製造管理・品質管理バリデーション',
    projectNameEn: 'Manufacturing and Quality Control Validation for Regenerative Medicine Products',
    description:
      '再生医療等製品の製造施設におけるコンピュータ化システムバリデーション（CSV）プロジェクト。PMDA（医薬品医療機器総合機構）のガイドライン、GMP省令、およびPIC/Sガイドラインに準拠。データインテグリティ要件とER/ES指針への適合を含む。',
    descriptionEn:
      'Computerized System Validation (CSV) project for the regenerative medicine product manufacturing facility. Compliant with PMDA guidelines, GMP ministerial ordinance, and PIC/S guidelines. Includes data integrity requirements and ER/ES guidance compliance.',
    vertical: 'biotech',
    projectType: 'validation',
    modules: ['validation_csv', 'data_integrity', 'audit_trail', 'change_control'],
    owner: '田中裕子, 品質保証部長',
    version: '1.0',
  },

  {
    countryCode: 'CN',
    companyName: '上海精准医疗科技有限公司',
    companyNameEn: 'Shanghai Precision Medical Technology Co., Ltd.',
    projectName: '体外诊断设备注册合规管理',
    projectNameEn: 'IVD Device Registration Compliance Management',
    description:
      '体外诊断医疗器械的注册合规项目。符合国家药品监督管理局（NMPA）医疗器械注册管理办法、医疗器械生产质量管理规范（GMP）以及GB/T 42061-2022（等同ISO 13485）的要求。涵盖设计开发控制、风险管理和临床评价文档。',
    descriptionEn:
      'IVD medical device registration compliance project. Compliant with NMPA medical device registration regulations, medical device GMP requirements, and GB/T 42061-2022 (equivalent to ISO 13485). Covers design and development controls, risk management, and clinical evaluation documentation.',
    vertical: 'medical_devices',
    projectType: 'compliance',
    modules: ['risk_management', 'document_control', 'change_control', 'traceability'],
    owner: '王明华, 法规事务总监',
    version: '2.0',
  },

  {
    countryCode: 'KR',
    companyName: '서울제약 주식회사',
    companyNameEn: 'Seoul Pharmaceutical Co., Ltd.',
    projectName: 'GMP 적합성 검증 — 바이오시밀러 생산시설',
    projectNameEn: 'GMP Compliance Validation — Biosimilar Production Facility',
    description:
      '바이오시밀러 의약품 생산시설의 GMP 적합성 검증 프로젝트. 식품의약품안전처(MFDS) 의약품 제조 및 품질관리 기준(KGMP), PIC/S 가이드라인, ICH Q7 요건에 적합합니다. 공정 밸리데이션, 세정 밸리데이션 및 컴퓨터화 시스템 검증을 포함합니다.',
    descriptionEn:
      'GMP compliance validation project for the biosimilar pharmaceutical production facility. Compliant with MFDS Korean GMP (KGMP), PIC/S guidelines, and ICH Q7 requirements. Includes process validation, cleaning validation, and computerized system verification.',
    vertical: 'pharma',
    projectType: 'validation',
    modules: ['validation_csv', 'document_control', 'deviation', 'capa', 'change_control'],
    owner: '김수진, 품질보증팀장',
    version: '1.0',
  },

  {
    countryCode: 'IN',
    companyName: 'Mumbai MedTech Pvt. Ltd.',
    companyNameEn: 'Mumbai MedTech Pvt. Ltd.',
    projectName: 'CSV for Hospital Information Management System',
    projectNameEn: 'CSV for Hospital Information Management System',
    description:
      'Computer System Validation for the Hospital Information Management System (HIMS) deployed across Mumbai MedTech partner hospitals. Compliant with CDSCO guidelines, Schedule M (GMP), and WHO guidance on computerized systems. Covers user access management, data integrity, and audit trail requirements.',
    descriptionEn:
      'Computer System Validation for the Hospital Information Management System (HIMS) deployed across Mumbai MedTech partner hospitals. Compliant with CDSCO guidelines, Schedule M (GMP), and WHO guidance on computerized systems. Covers user access management, data integrity, and audit trail requirements.',
    vertical: 'software_it',
    projectType: 'software',
    modules: ['audit_trail', 'access_control', 'data_integrity', 'validation_csv'],
    owner: 'Priya Sharma, Head of IT Quality',
    version: '2.0',
  },

  {
    countryCode: 'TH',
    companyName: 'บริษัท กรุงเทพ ฟาร์มา จำกัด',
    companyNameEn: 'Bangkok Pharma Co., Ltd.',
    projectName: 'การปฏิบัติตามหลักเกณฑ์วิธีการที่ดีในการผลิตยา (GMP)',
    projectNameEn: 'Good Manufacturing Practice (GMP) Compliance',
    description:
      'โครงการปฏิบัติตามหลักเกณฑ์วิธีการที่ดีในการผลิตยา (GMP) สำหรับโรงงานผลิตยาแผนปัจจุบัน สอดคล้องกับข้อกำหนดของสำนักงานคณะกรรมการอาหารและยา (อย.) หลักเกณฑ์ PIC/S GMP และแนวทาง ASEAN GMP รวมถึงการตรวจรับรองระบบคอมพิวเตอร์ การจัดการเอกสาร และการควบคุมการเปลี่ยนแปลง',
    descriptionEn:
      'Good Manufacturing Practice (GMP) compliance project for the pharmaceutical manufacturing facility. Compliant with Thai FDA requirements, PIC/S GMP guidelines, and ASEAN GMP guidance. Includes computerized system validation, document management, and change control.',
    vertical: 'pharma',
    projectType: 'compliance',
    modules: ['document_control', 'change_control', 'deviation', 'training'],
    owner: 'ดร. สมชาย วงศ์สุวรรณ, ผู้อำนวยการฝ่ายประกันคุณภาพ',
    version: '1.0',
  },
];

/**
 * Look up the demo project for a given country code.
 * Returns undefined if no demo project exists for that country.
 */
export function getDemoProject(countryCode: string): DemoProject | undefined {
  return DEMO_PROJECTS.find((p) => p.countryCode === countryCode);
}

/**
 * Set of country codes that have a demo project available.
 * Used for quick membership checks in the UI.
 */
export const DEMO_COUNTRY_CODES = new Set(DEMO_PROJECTS.map((p) => p.countryCode));
