/**
 * Template Composition Engine
 *
 * Composes a complete set of requirements and tests by merging:
 * 1. Country base regulatory templates
 * 2. Vertical industry templates (optionally with project type)
 * 3. Country + Vertical overlay templates
 * 4. Selected functional module templates
 *
 * Templates are lazy-loaded via dynamic import and gracefully skipped
 * if not yet implemented for a given combination.
 */

import type {
  TemplateRequirement,
  TemplateTest,
  CountryTemplateSet,
  VerticalTemplateSet,
} from './types';
import { MODULE_DEFINITIONS, COUNTRY_REGISTRY } from './registry';

/** Configuration for template composition */
export interface ComposeConfig {
  /** ISO 3166-1 alpha-2 country code */
  country: string;
  /** Vertical industry ID (optional) */
  vertical?: string;
  /** Project type within the vertical (optional) */
  projectType?: string;
  /** Array of module IDs to include */
  modules: string[];
}

/** Result of template composition */
export interface ComposeResult {
  /** Deduplicated requirements from all sources */
  requirements: TemplateRequirement[];
  /** Deduplicated tests from all sources */
  tests: TemplateTest[];
}

/**
 * Safely attempt a dynamic import, returning null if the module
 * does not exist or fails to load.
 */
async function safeImport<T>(path: string): Promise<T | null> {
  try {
    return await import(/* @vite-ignore */ path);
  } catch {
    // Module not yet implemented — skip gracefully
    return null;
  }
}

/**
 * Deduplicate an array of requirements by stable templateId.
 * Falls back to title-based dedup for legacy templates without templateId.
 * When duplicates are found, the later entry wins (overlay overrides base).
 */
function deduplicateRequirements(
  reqs: TemplateRequirement[],
): TemplateRequirement[] {
  const map = new Map<string, TemplateRequirement>();
  for (const req of reqs) {
    const key = req.templateId || `__title:${req.title}`;
    map.set(key, req);
  }
  return Array.from(map.values());
}

/**
 * Deduplicate an array of tests by stable templateId.
 * Falls back to title-based dedup for legacy templates without templateId.
 * When duplicates are found, the later entry wins.
 */
function deduplicateTests(tests: TemplateTest[]): TemplateTest[] {
  const map = new Map<string, TemplateTest>();
  for (const test of tests) {
    const key = test.templateId || `__title:${test.title}`;
    map.set(key, test);
  }
  return Array.from(map.values());
}

/**
 * Determine the region directory for a country.
 * EU member states and EFTA countries load the EU base first,
 * then the country-specific overlay.
 */
function getRegionForCountry(countryCode: string): string | null {
  const entry = COUNTRY_REGISTRY.find(
    (c) => c.code === countryCode.toUpperCase(),
  );
  if (!entry) return null;

  // EU/EFTA countries also load the EU base
  const euCountries = [
    'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'IE',
    'PL', 'PT', 'CZ', 'FI', 'NO', 'CH',
  ];
  if (euCountries.includes(countryCode.toUpperCase())) {
    return 'eu';
  }
  return null;
}

/**
 * Compose a complete template from country, vertical, overlay, and module sources.
 *
 * Loading order (later entries override earlier on deduplication):
 * 1. Regional base (e.g., EU base for European countries)
 * 2. Country-specific base (e.g., DE-specific)
 * 3. Vertical common templates
 * 4. Vertical project-type templates
 * 5. Country + Vertical overlay
 * 6. Selected modules
 */
export async function composeTemplate(
  config: ComposeConfig,
): Promise<ComposeResult> {
  const allRequirements: TemplateRequirement[] = [];
  const allTests: TemplateTest[] = [];

  const countryLower = config.country.toLowerCase();

  // ------------------------------------------------------------------
  // 1. Regional base (e.g., EU for European countries)
  // ------------------------------------------------------------------
  const region = getRegionForCountry(config.country);
  if (region && region !== countryLower) {
    const regionModule = await safeImport<{
      default?: CountryTemplateSet;
      templateSet?: CountryTemplateSet;
    }>(`./regions/${region}/base`);

    if (regionModule) {
      const data = regionModule.default ?? regionModule.templateSet;
      if (data) {
        allRequirements.push(...data.requirements);
        allTests.push(...data.tests);
      }
    }
  }

  // ------------------------------------------------------------------
  // 2. Country-specific base
  // ------------------------------------------------------------------
  const countryModule = await safeImport<{
    default?: CountryTemplateSet;
    templateSet?: CountryTemplateSet;
  }>(`./regions/${countryLower}/base`);

  if (countryModule) {
    const data = countryModule.default ?? countryModule.templateSet;
    if (data) {
      allRequirements.push(...data.requirements);
      allTests.push(...data.tests);
    }
  }

  // ------------------------------------------------------------------
  // 3. Vertical common templates
  // ------------------------------------------------------------------
  if (config.vertical) {
    const verticalModule = await safeImport<{
      default?: VerticalTemplateSet;
      templateSet?: VerticalTemplateSet;
    }>(`./verticals/${config.vertical}/common`);

    if (verticalModule) {
      const data = verticalModule.default ?? verticalModule.templateSet;
      if (data) {
        allRequirements.push(...data.requirements);
        allTests.push(...data.tests);
      }
    }

    // ----------------------------------------------------------------
    // 4. Vertical project-type specialization
    // ----------------------------------------------------------------
    if (config.projectType) {
      const projectModule = await safeImport<{
        default?: VerticalTemplateSet;
        templateSet?: VerticalTemplateSet;
      }>(`./verticals/${config.vertical}/${config.projectType}`);

      if (projectModule) {
        const data = projectModule.default ?? projectModule.templateSet;
        if (data) {
          allRequirements.push(...data.requirements);
          allTests.push(...data.tests);
        }
      }
    }

    // ----------------------------------------------------------------
    // 5. Country + Vertical overlay
    // ----------------------------------------------------------------
    const overlayModule = await safeImport<{
      default?: VerticalTemplateSet;
      templateSet?: VerticalTemplateSet;
    }>(`./regions/${countryLower}/overlays/${config.vertical}`);

    if (overlayModule) {
      const data = overlayModule.default ?? overlayModule.templateSet;
      if (data) {
        allRequirements.push(...data.requirements);
        allTests.push(...data.tests);
      }
    }
  }

  // ------------------------------------------------------------------
  // 6. Selected modules
  // ------------------------------------------------------------------
  for (const moduleId of config.modules) {
    const moduleDef = MODULE_DEFINITIONS.find((m) => m.id === moduleId);
    if (moduleDef) {
      allRequirements.push(...moduleDef.requirements);
      allTests.push(...moduleDef.tests);
    }
  }

  // ------------------------------------------------------------------
  // Deduplicate and return
  // ------------------------------------------------------------------
  return {
    requirements: deduplicateRequirements(allRequirements),
    tests: deduplicateTests(allTests),
  };
}
