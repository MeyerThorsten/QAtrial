/**
 * Template Composition System Types
 *
 * Defines the core type system for QAtrial's composable template engine.
 * Templates are composed from verticals, country regulations, modules,
 * and overlay intersections to produce a tailored set of requirements and tests.
 */

/** Supported risk taxonomy frameworks */
export type RiskTaxonomy = 'iso14971' | 'ichQ9' | 'fmea' | 'gamp5' | 'generic';

/** Risk severity levels for requirements */
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

/** Geographic region groupings */
export type Region = 'americas' | 'europe' | 'asia';

/**
 * Defines an industry vertical (e.g., pharma, medical devices).
 * Each vertical carries its own risk taxonomy, applicable standards,
 * and UI metadata for presentation.
 */
export interface VerticalDefinition {
  /** Unique identifier matching IndustryVertical enum value */
  id: string;
  /** i18n key for display name, e.g. 'verticals.pharma.name' */
  name: string;
  /** i18n key for the vertical's primary focus area */
  focusKey: string;
  /** Lucide icon name for UI rendering */
  icon: string;
  /** Primary risk assessment framework */
  riskTaxonomy: RiskTaxonomy;
  /** Optional safety classification scheme (e.g., FDA Class I/II/III) */
  safetyClassification?: string;
  /** List of primary regulatory standards applicable to this vertical */
  primaryStandards: string[];
}

/**
 * A functional module that can be added to any project (e.g., audit_trail, e_signatures).
 * Modules carry their own baseline requirements and tests that are
 * merged into the composed template when selected.
 */
export interface ModuleDefinition {
  /** Unique module identifier */
  id: string;
  /** i18n key for module name */
  nameKey: string;
  /** i18n key for module description */
  descKey: string;
  /** Lucide icon name for UI rendering */
  icon: string;
  /** Baseline requirements provided by this module */
  requirements: TemplateRequirement[];
  /** Baseline tests provided by this module */
  tests: TemplateTest[];
}

/**
 * A single regulatory or quality requirement.
 * Requirements are the atomic units of compliance tracking.
 */
export interface TemplateRequirement {
  /**
   * Stable unique identifier for deduplication and provenance tracking.
   * Format: `{source}:{category-slug}:{short-id}` e.g. `eu:data-integrity:di-01`
   * When duplicates with the same templateId are found during composition,
   * the later entry wins (overlay overrides base). This replaces fragile
   * title-based deduplication.
   *
   * Optional for backward compatibility with templates that haven't been
   * migrated yet — the composer falls back to title-based dedup when absent.
   */
  templateId?: string;
  /** Human-readable requirement title */
  title: string;
  /** Detailed description of what must be fulfilled */
  description: string;
  /** Grouping category (e.g., 'Data Integrity', 'Access Control') */
  category: string;
  /** Tags for matching, filtering, and linking to tests */
  tags: string[];
  /** Risk severity level */
  riskLevel: RiskLevel;
  /** Optional reference to the regulatory source (e.g., '21 CFR 11.10(e)') */
  regulatoryRef?: string;
  /** Source provenance: which template file contributed this requirement */
  source?: string;
}

/**
 * A single test case template linked to requirements via tags.
 * Tests validate that requirements have been properly implemented.
 */
export interface TemplateTest {
  /**
   * Stable unique identifier for deduplication and provenance tracking.
   * Format: `{source}:{category-slug}:{short-id}` e.g. `eu:audit:tst-01`
   * Optional for backward compatibility — composer falls back to title-based dedup.
   */
  templateId?: string;
  /** Human-readable test title */
  title: string;
  /** Detailed description of test procedure and expected outcome */
  description: string;
  /** Grouping category (e.g., 'Functional', 'Security', 'Performance') */
  category: string;
  /** Tags for filtering and categorization */
  tags: string[];
  /** Tags that link this test to matching requirements */
  linkedReqTags: string[];
  /** Source provenance: which template file contributed this test */
  source?: string;
}

/**
 * Country-specific regulatory template set.
 * Loaded per country to apply local regulatory requirements.
 */
export interface CountryTemplateSet {
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  /** Country-specific regulatory requirements */
  requirements: TemplateRequirement[];
  /** Country-specific test cases */
  tests: TemplateTest[];
}

/**
 * Vertical-specific template set with optional project type specialization.
 * Provides industry-specific requirements and tests.
 */
export interface VerticalTemplateSet {
  /** Vertical identifier matching VerticalDefinition.id */
  verticalId: string;
  /** Optional project type for further specialization (e.g., 'api_manufacturing') */
  projectType?: string;
  /** Vertical-specific requirements */
  requirements: TemplateRequirement[];
  /** Vertical-specific test cases */
  tests: TemplateTest[];
}

/**
 * Country registry entry defining a supported country and its metadata.
 */
export interface CountryRegistryEntry {
  /** ISO 3166-1 alpha-2 country code */
  code: string;
  /** i18n key for country name */
  nameKey: string;
  /** Geographic region */
  region: Region;
  /** Default UI language (BCP 47 tag) */
  defaultLanguage: string;
  /** Country flag emoji */
  flag: string;
  /** Vertical IDs that have country-specific templates */
  availableVerticals: string[];
}
