# Sprint 1: Foundation — Completed

## What was built

### 1. i18n Infrastructure
- **Library**: react-i18next + i18next-http-backend + i18next-browser-languagedetector
- **Config**: `src/i18n/index.ts` — lazy-loads translations from `public/locales/{lang}/common.json`
- **Fallback chains**: es-MX → es → en, fr-CA → fr → en, etc.
- **Languages**: EN (canonical) + DE complete, 35+ locale directories created
- **330 translation keys** covering: app, nav, wizard, common, requirements, tests, dashboard, statuses, risk, ai, reports, audit, signature, changeControl, importExport, countries (37), verticals (10), modules (15), projectTypes (8)

### 2. Extended Data Model (`src/types/index.ts`)
- 25+ new types: IndustryVertical, VerticalConfig, RiskAssessment, AIGeneratedTestCase, AIGapAnalysis, AIRiskClassification, AuditEntry, ElectronicSignature, ReportConfig, LLMProvider, ChangeControlConfig, CountryConfig, ModuleConfig
- Requirement extended with: tags, jurisdictions, verticals, riskLevel, regulatoryRef, evidenceHints
- ProjectMeta extended with: country, vertical, modules

### 3. Template Composition System
- **Types**: `src/templates/types.ts` — VerticalDefinition, ModuleDefinition, TemplateRequirement, TemplateTest
- **Registry**: `src/templates/registry.ts` — 10 verticals, 37 countries, 15 modules with full GxP content
- **Composer**: `src/templates/composer.ts` — merges country base + vertical base + country overlay + modules
- **Vertical templates**: Pharma (20 reqs + 15 tests), Medical Devices (20 reqs + 15 tests)
- **Country templates**: US base (15 reqs + 10 tests), EU base (15 reqs + 10 tests), DE base (10 reqs + 7 tests)
- **Country overlay**: US Pharma overlay (10 reqs + 7 tests) with FDA 21 CFR 210/211, cGMP

### 4. New Stores
- `src/store/useAuditStore.ts` — audit trail logging with persist
- `src/store/useLocaleStore.ts` — language + country persistence

### 5. New UI Components
- `src/components/shared/LanguageSelector.tsx` — header dropdown, 37 languages grouped by region
- `src/components/wizard/StepCountry.tsx` — searchable country selector
- `src/components/wizard/StepVertical.tsx` — industry vertical selector with GxP info
- `src/components/wizard/StepModules.tsx` — 15 quality module checkboxes

### 6. Updated Wizard (6 steps)
Country → Vertical → Metadata → Project Type → Modules → Preview

### 7. All 17 Components Migrated to i18n
Every component now uses `useTranslation()` with `t()` calls. Zero hardcoded German strings remain in the UI.

## Files created: 15 new files
## Files modified: 20 existing files
## Build status: Clean (0 TypeScript errors)
