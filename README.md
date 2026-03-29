# QAtrial — Regulated Quality Workspace

A country-aware, GxP-aware, AI-assisted quality and validation platform for regulated industries. Inspired by IBM DOORS, extended with industry verticals, AI compliance co-pilot, and audit-ready reporting.

## Core Model

```
Country (jurisdiction) × Vertical (domain) × Project Type (execution) × Modules (quality controls)
```

## Features

### Requirements & Test Management
- CRUD for requirements and tests with auto-generated IDs (REQ-001, TST-001)
- Multi-select linking between tests and requirements
- Status tracking (Draft/Active/Closed for reqs, Not Run/Passed/Failed for tests)
- Enriched metadata: tags, regulatory references, risk level, evidence hints
- Sortable, searchable tables with TanStack Table

### Industry Verticals (8 GxP domains)
| Vertical | Standards |
|----------|----------|
| Pharmaceuticals | FDA 21 CFR 210/211, ICH Q7/Q10, EU GMP Annex 11 |
| Biotechnology | 21 CFR Part 600, ICH Q5A-E |
| Medical Devices | QMSR/21 CFR 820, ISO 13485, IEC 62304, ISO 14971 |
| CRO / Clinical Research | ICH E6(R3), 21 CFR Part 58 |
| Clinical Laboratories | CLIA, CAP, ISO 15189 |
| Logistics / GDP | WHO GDP, EU GDP, FDA DSCSA |
| Software & IT (GAMP/CSV) | 21 CFR Part 11, EU Annex 11, GAMP 5 2nd Ed |
| Cosmetics / Chemical | ISO 22716, OECD GLP, REACH |

### 15 Composable Quality Modules
Audit Trail, Electronic Signatures, Data Integrity (ALCOA+), Change Control, CAPA, Deviation Management, Training, Supplier Qualification, Complaint Handling, Risk Management, Document Control, Backup/DR, Access Control, Validation/CSV, Traceability Matrix

### Country-Specific Templates (6 countries + EU-wide)
US, Germany, UK, France, Japan + EU-wide base. Each with regulatory requirements and tests referencing local standards and authorities.

### AI Compliance Co-Pilot
- **Test Case Generator**: Auto-generate 4-6 test cases from a requirement, context-aware (country, vertical, standards, risk level)
- **Risk Classification**: AI proposes severity/likelihood using vertical-specific taxonomies (ISO 14971, ICH Q9, GAMP 5)
- **Gap Analysis**: Compare project against regulatory standards, identify covered/partial/missing clauses
- **CAPA Suggestions**: AI-powered root cause analysis and corrective action proposals for failed tests
- **Executive Brief**: One-click C-level compliance summary
- Multi-provider support: Anthropic, OpenAI-compatible (OpenRouter, Ollama, etc.)

### 7 Dashboard Views
1. **Overview**: Coverage metrics, status charts, traceability matrix, orphaned items
2. **Compliance**: Weighted readiness score + gap analysis heatmap
3. **Risk**: Interactive 5×5 severity × likelihood matrix
4. **Evidence**: Per-requirement evidence completeness tracking
5. **CAPA**: Failed test funnel with AI corrective action suggestions
6. **Trends**: Status distributions, risk distribution, coverage by category
7. **Portfolio**: Multi-project overview with readiness scores

### Report Generation
- Validation Summary Report (VSR) — 7-section audit-ready report
- Executive Compliance Brief — AI-generated one-pager
- Regulatory Submission Package — formatted per authority (FDA 510(k), EU MDR, PMDA STED)
- Traceability Matrix, Gap Analysis, Risk Assessment exports

### Compliance Features
- **Electronic Signatures**: 21 CFR Part 11 / EU Annex 11 compliant (meaning, reason, authentication)
- **Audit Trail**: Full timeline with diffs, signatures, CSV/PDF export
- **Change Control**: Configurable per vertical (auto-revert on change, approval workflows)

### Internationalization (12 languages)
English, German, French, Spanish, Italian, Portuguese, Dutch, Japanese, Chinese (Simplified), Korean, Hindi, Thai

35+ locale directories prepared. Language selector in header with instant switching.

### Theming
Light and dark mode with full design system (CSS custom properties, Tailwind tokens).

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| Zustand | State Management (8 stores) |
| TanStack Table v8 | Tables |
| Recharts | Charts |
| react-i18next | Internationalization |
| Lucide React | Icons |

## Project Structure

```
src/
├── ai/                          # AI system
│   ├── types.ts, provider.ts, client.ts
│   └── prompts/                 # 6 AI prompt templates
├── templates/                   # Template composition
│   ├── types.ts, registry.ts, composer.ts
│   ├── verticals/               # 5 industry vertical templates
│   ├── modules/                 # 15 quality module definitions
│   └── regions/                 # 6 country + EU base + overlays
├── store/                       # 8 Zustand stores
├── i18n/                        # i18next configuration
├── hooks/                       # Custom hooks
├── lib/                         # Constants, ID generator, approval helpers
├── types/                       # All TypeScript types (50+ types)
├── components/
│   ├── layout/                  # AppShell
│   ├── wizard/                  # 6-step setup wizard
│   ├── requirements/            # Requirements table + modal
│   ├── tests/                   # Tests table + modal
│   ├── dashboard/               # 14 dashboard components
│   ├── ai/                      # AI panels (test gen, risk, settings)
│   ├── reports/                 # Report generator + preview
│   ├── audit/                   # Audit trail + signature modal
│   └── shared/                  # Shared components
└── public/locales/              # 12 complete translation files
```

**84 TypeScript source files, 14,000+ lines of code, 12 translation files (425 keys each)**

## Installation

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install
npm run dev
```

## Setup Wizard (6 steps)

1. **Country** — Select jurisdiction (37 countries)
2. **Industry Vertical** — Select GxP domain (optional)
3. **Metadata** — Project name, description, owner, version
4. **Project Type** — Software, Embedded, QMS, Validation, Clinical, Compliance, Supplier Quality
5. **Quality Modules** — Select composable quality controls
6. **Preview** — Review and customize generated requirements + tests

## AI Provider Configuration

Go to Settings (gear icon) to configure LLM providers:
- Anthropic (Claude)
- OpenAI-compatible (GPT-4o, OpenRouter, Ollama, etc.)
- Multiple providers with purpose-scoped routing
- Token usage tracking

## Documentation

- [User Guide](docs/USER-GUIDE.md) — Complete end-user documentation
- [Architecture](docs/ARCHITECTURE.md) — Technical architecture overview
- [Developer Guide](docs/DEVELOPER-GUIDE.md) — How to extend QAtrial (add countries, verticals, languages)
- [API Reference](docs/API-REFERENCE.md) — Stores, hooks, utilities, type definitions
- [Regulatory Reference](docs/REGULATORY-REFERENCE.md) — Standards and frameworks by country and vertical

## Contributing

QAtrial is open source and welcomes contributions. See the [Developer Guide](docs/DEVELOPER-GUIDE.md) for how to add countries, verticals, modules, languages, and AI prompts.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0).

You are free to use, modify, and distribute this software. If you modify QAtrial and provide it as a service over a network, you must make your modified source code available under the same license.
