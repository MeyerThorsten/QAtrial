# Sprint 4: Reports — Completed

## What was built

### 1. AI Report Prompts
- **Executive Brief** (`src/ai/prompts/executiveBrief.ts`): C-level one-pager with STATUS, KEY METRICS, CRITICAL GAPS, RECOMMENDED ACTIONS, TIMELINE IMPACT
- **CAPA Suggestion** (`src/ai/prompts/capaSuggestion.ts`): Root cause, containment, corrective/preventive actions, effectiveness check
- **VSR Template** (`src/ai/prompts/vsrReport.ts`): 7-section Validation Summary Report (exec summary, scope, traceability, test execution, risk, deviations, conclusion)

### 2. Report Generator UI
- **ReportGenerator** (`src/components/reports/ReportGenerator.tsx`): 6 report types as cards, config options (format, signatures, authority), generate with loading state
- **ReportPreview** (`src/components/reports/ReportPreview.tsx`): TOC sidebar with approval progress, AI-generated badges, per-section approve toggles, print/download

### 3. Navigation
- "Reports" tab added to AppShell
- Settings gear icon for ProviderSettings

## Files created: 5 | Modified: 3 | Build: Clean
