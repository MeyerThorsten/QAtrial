# Sprint 2: AI Core — Completed

## What was built

### 1. LLM Provider System
- **Types** (`src/ai/types.ts`): CompletionRequest/Response interfaces
- **Provider Resolution** (`src/ai/provider.ts`): Purpose-scoped routing with priority ordering and 'all' fallback
- **Unified Client** (`src/ai/client.ts`): Single `complete()` function supporting Anthropic API + OpenAI-compatible APIs (OpenRouter, Ollama, etc.)
- **Store** (`src/store/useLLMStore.ts`): Provider CRUD, usage tracking (tokens per provider), connection testing with latency measurement

### 2. AI Test Case Generator
- **Prompt** (`src/ai/prompts/generateTests.ts`): Context-aware prompt with vertical, country, standards, risk level. Asks for 4-6 test cases. Adds ALCOA+ checks for pharma/meddev, HW-SW interface tests for embedded.
- **Review Panel** (`src/components/ai/TestGenerationPanel.tsx`): Modal showing generated tests with confidence color coding (green ≥90%, amber 70-89%, red <70%), Accept/Edit/Reject per test, Accept All / Accept High Confidence bulk actions.

### 3. AI Risk Classification
- **Prompt** (`src/ai/prompts/riskClassification.ts`): Taxonomy-specific severity scales (ISO 14971 for devices, ICH Q9 for pharma, GAMP 5 for software, generic fallback). Returns severity, likelihood, reasoning, safety class.
- **Panel** (`src/components/ai/RiskClassificationPanel.tsx`): Shows classification results with Accept/Edit/Reject. Accept writes riskLevel to the requirement.

### 4. Provider Settings UI
- **Component** (`src/components/ai/ProviderSettings.tsx`): Full settings panel — provider list with status badges, add/edit modal with all fields (type, URL, key, model, purposes, temperature, priority), purpose routing table, token usage summary.

### 5. Integration
- RequirementsTable: AI action buttons (Sparkles for test gen, ShieldAlert for risk) visible when provider configured.

## Files created: 9 new files
## Files modified: 1 file
## Build status: Clean (0 TypeScript errors)
