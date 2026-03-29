# Sprint 3: Gap Analysis + Dashboards — Completed

## What was built

### 1. AI Gap Analysis Engine
- **Prompt** (`src/ai/prompts/gapAnalysis.ts`): Compares project requirements against regulatory standards, classifies each clause as covered/partial/missing, suggests requirement text for gaps.
- **Dashboard** (`src/components/dashboard/GapAnalysisView.tsx`): Heatmap table grouped by standard, coverage bars, critical gaps list, per-gap "Generate Requirement" button, bulk "Generate Requirements for All Gaps" action.

### 2. Compliance Readiness Score
- **Component** (`src/components/dashboard/ComplianceReadiness.tsx`): Circular progress with weighted score (req coverage 25%, test coverage 25%, pass rate 20%, risk assessed 15%, signatures 15%). Color-coded mini progress bars. Critical gap penalty.

### 3. Risk Matrix Visualization
- **Component** (`src/components/dashboard/RiskMatrixView.tsx`): Interactive 5×5 severity × likelihood grid. Color-coded zones (green/yellow/orange/red). Click cells to see requirements. Summary stats. "Classify All Unassessed" bulk AI action.

### 4. Dashboard Tabs
- EvaluationDashboard now has 3 sub-tabs: **Overview** (existing), **Compliance** (readiness + gaps), **Risk** (matrix).

## Files created: 4 new files
## Files modified: 2 files
## Build status: Clean
