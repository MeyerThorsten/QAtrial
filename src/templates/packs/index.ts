/**
 * Compliance Starter Packs
 *
 * Pre-configured bundles of country + vertical + modules + project type
 * that provide a one-click setup for common regulatory frameworks.
 */

export interface CompliancePack {
  id: string;
  name: string;           // i18n key
  description: string;    // i18n key
  icon: string;           // lucide icon name
  country: string;
  vertical: string;
  projectType: string;
  modules: string[];
  tags: string[];          // for filtering: ['fda', 'gamp', 'csv']
}

export const COMPLIANCE_PACKS: CompliancePack[] = [
  {
    id: 'fda_csv',
    name: 'packs.fdaCsv',
    description: 'packs.fdaCsvDesc',
    icon: 'Monitor',
    country: 'US',
    vertical: 'software_it',
    projectType: 'validation',
    modules: [
      'audit_trail',
      'e_signatures',
      'data_integrity',
      'change_control',
      'validation_csv',
      'access_control',
      'document_control',
    ],
    tags: ['fda', 'gamp5', 'csv', 'part11', 'software'],
  },
  {
    id: 'eu_mdr',
    name: 'packs.euMdr',
    description: 'packs.euMdrDesc',
    icon: 'HeartPulse',
    country: 'DE',
    vertical: 'medical_devices',
    projectType: 'quality_system',
    modules: [
      'audit_trail',
      'e_signatures',
      'risk_management',
      'capa',
      'deviation',
      'supplier_management',
      'complaint_handling',
      'document_control',
      'training',
    ],
    tags: ['mdr', 'iso13485', 'meddevice', 'ce', 'europe'],
  },
  {
    id: 'fda_gmp',
    name: 'packs.fdaGmp',
    description: 'packs.fdaGmpDesc',
    icon: 'Pill',
    country: 'US',
    vertical: 'pharma',
    projectType: 'quality_system',
    modules: [
      'audit_trail',
      'e_signatures',
      'data_integrity',
      'change_control',
      'capa',
      'deviation',
      'training',
      'supplier_management',
      'document_control',
      'validation_csv',
    ],
    tags: ['fda', 'gmp', 'pharma', 'cgmp', '21cfr'],
  },
  {
    id: 'iso_gdpr',
    name: 'packs.isoGdpr',
    description: 'packs.isoGdprDesc',
    icon: 'Shield',
    country: 'DE',
    vertical: 'software_it',
    projectType: 'compliance',
    modules: [
      'audit_trail',
      'access_control',
      'data_integrity',
      'change_control',
      'risk_management',
      'document_control',
      'backup_recovery',
    ],
    tags: ['iso27001', 'gdpr', 'privacy', 'infosec', 'europe'],
  },
];
