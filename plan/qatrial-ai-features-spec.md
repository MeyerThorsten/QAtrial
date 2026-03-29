# QAtrial — AI Features, Dashboard & Reports Spec

## 1. Data Model Extensions

### New Types (`src/types/index.ts`)

```typescript
// --- Verticals ---
type IndustryVertical =
  | 'pharma'
  | 'biotech'
  | 'medical_devices'
  | 'cro'
  | 'clinical_lab'
  | 'logistics'
  | 'cosmetics'
  | 'aerospace'
  | 'chemical_env'
  | 'software_it';

interface VerticalConfig {
  id: IndustryVertical;
  name: string;                        // "Pharmaceuticals"
  gxpFocus: string[];                  // ["GMP", "GCP", "GLP", "GDP", "GVP", "GDocP"]
  primaryStandards: string[];          // ["21 CFR Parts 210/211", "ICH Guidelines"]
  riskTaxonomy: RiskTaxonomyType;      // which risk framework applies
  safetyClassification?: SafetyClassType;
}

type RiskTaxonomyType =
  | 'iso14971'      // Medical devices
  | 'ichQ9'         // Pharma
  | 'fmea'          // General / Aerospace
  | 'gamp5'         // Software/IT (GAMP categories 1-5)
  | 'generic';      // Fallback: severity × likelihood

type SafetyClassType =
  | 'iec62304'      // Software safety classes A/B/C
  | 'gamp5cat'      // GAMP categories 1-5
  | 'sil'           // Safety Integrity Level (aerospace/industrial)
  | 'none';

// --- Risk ---
type Severity = 1 | 2 | 3 | 4 | 5;    // 1=negligible, 5=catastrophic
type Likelihood = 1 | 2 | 3 | 4 | 5;   // 1=rare, 5=almost certain
type Detectability = 1 | 2 | 3 | 4 | 5; // 1=certain, 5=undetectable (for FMEA)

interface RiskAssessment {
  id: string;
  requirementId: string;
  severity: Severity;
  likelihood: Likelihood;
  detectability?: Detectability;         // Only for FMEA-based verticals
  riskScore: number;                     // severity × likelihood (× detectability for FMEA)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategy?: string;
  residualRisk?: number;
  classifiedBy: 'manual' | 'ai';
  classifiedAt: string;                  // ISO timestamp
}

// --- AI Generation ---
interface AIGeneratedTestCase {
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  requirementId: string;
  standard?: string;                     // Which regulation it traces to
  confidence: number;                    // 0-1, AI's self-assessed confidence
  accepted: boolean;                     // User reviewed and accepted
  generatedBy: string;                   // Model identifier (e.g. "claude-sonnet-4-20250514")
  providerId: string;                    // LLMProvider.id that produced this
}

interface AIGapAnalysis {
  standard: string;                      // "21 CFR Part 11.10(e)"
  clause: string;                        // Specific clause text
  status: 'covered' | 'partial' | 'missing';
  linkedRequirementIds: string[];
  linkedTestIds: string[];
  suggestion?: string;                   // AI-proposed requirement text
  generatedBy: string;
  providerId: string;
}

interface AIRiskClassification {
  requirementId: string;
  proposedSeverity: Severity;
  proposedLikelihood: Likelihood;
  reasoning: string;
  safetyClass?: string;                  // "IEC 62304 Class B" or "GAMP Category 4"
  confidence: number;
  generatedBy: string;
  providerId: string;
}

// --- Audit Trail & E-Signatures ---
interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entityType: 'requirement' | 'test' | 'project' | 'report';
  entityId: string;
  previousValue?: string;               // JSON snapshot
  newValue?: string;                     // JSON snapshot
  reason?: string;                       // Required for modifications in GxP
  signature?: ElectronicSignature;
}

type AuditAction =
  | 'create' | 'update' | 'delete'
  | 'status_change' | 'link' | 'unlink'
  | 'approve' | 'reject' | 'sign'
  | 'export' | 'generate_report';

interface ElectronicSignature {
  signerId: string;
  signerName: string;
  signerRole: string;
  timestamp: string;
  meaning: SignatureMeaning;
  method: 'password' | 'pin' | 'biometric';
  ip?: string;
}

type SignatureMeaning =
  | 'authored'      // I wrote this
  | 'reviewed'      // I reviewed this
  | 'approved'      // I approve this
  | 'verified'      // I verified execution
  | 'rejected';     // I reject this

// --- Reports ---
type ReportType =
  | 'validation_summary'    // VSR
  | 'traceability_matrix'   // Full RTM
  | 'gap_analysis'          // Standards gap report
  | 'risk_assessment'       // Risk matrix + assessments
  | 'executive_brief'       // C-level one-pager
  | 'submission_package';   // Formatted per authority

interface ReportConfig {
  type: ReportType;
  projectId: string;
  format: 'pdf' | 'docx' | 'html';
  includeSignatures: boolean;
  targetAuthority?: string;              // "FDA" | "EMA" | "PMDA" etc.
  generatedAt: string;
  generatedBy: string;
  sections: ReportSection[];
}

interface ReportSection {
  title: string;
  content: string;                       // Markdown or structured data
  aiGenerated: boolean;
  reviewedBy?: string;
  approvedBy?: string;
}

// --- Extended Project ---
interface Project {
  // ... existing fields
  country: string;
  vertical?: IndustryVertical;
  riskAssessments: RiskAssessment[];
  auditTrail: AuditEntry[];
  aiGeneratedItems: {
    testCases: AIGeneratedTestCase[];
    gaps: AIGapAnalysis[];
    riskClassifications: AIRiskClassification[];
  };
}
```

### Wizard Flow Update (5 steps now)

```
Country → Vertical → Metadata → Project Type → Preview
```

The vertical step is optional — users can skip it and get the country-only templates. Selecting a vertical layers in the GxP requirements on top.

---

## 2. AI Test Case Generator

### Architecture

```
User writes/selects requirement
        ↓
  [Generate Tests] button
        ↓
  Build prompt with:
    - Requirement text
    - Project country + vertical
    - Applicable standards
    - Existing test cases (avoid duplication)
    - Risk classification (if available)
        ↓
  Anthropic / OpenAI-compatible API call via complete()
        ↓
  Parse structured JSON response
        ↓
  Show in review panel (accept/edit/reject per test)
        ↓
  Accepted tests added to project
```

### Prompt Architecture

```typescript
// src/ai/prompts/generateTests.ts

interface TestGenContext {
  requirement: Requirement;
  country: string;
  vertical?: IndustryVertical;
  applicableStandards: string[];
  existingTests: TestCase[];          // To avoid duplicates
  riskAssessment?: RiskAssessment;
  projectType: ProjectType;
}

function buildTestGenPrompt(ctx: TestGenContext): string {
  return `You are a QA validation engineer specializing in ${ctx.vertical || 'software'} 
testing for the ${ctx.country} regulatory market.

## Requirement Under Test
ID: ${ctx.requirement.id}
Title: ${ctx.requirement.title}
Description: ${ctx.requirement.description}
Priority: ${ctx.requirement.priority}
${ctx.riskAssessment ? `Risk Level: ${ctx.riskAssessment.riskLevel} (Severity: ${ctx.riskAssessment.severity}, Likelihood: ${ctx.riskAssessment.likelihood})` : ''}

## Applicable Regulatory Standards
${ctx.applicableStandards.map(s => `- ${s}`).join('\n')}

## Existing Test Cases (DO NOT duplicate)
${ctx.existingTests.map(t => `- ${t.title}`).join('\n') || 'None yet.'}

## Instructions
Generate 4-6 test cases that:
1. Directly verify the requirement above
2. Include at least one negative/boundary test
3. Reference specific regulatory clauses where applicable
4. Scale test rigor to the risk level (${ctx.riskAssessment?.riskLevel || 'medium'})
${ctx.vertical === 'pharma' || ctx.vertical === 'medical_devices' ? 
  '5. Include data integrity verification per ALCOA+ principles\n6. Include audit trail verification where applicable' : ''}
${ctx.projectType === 'embedded' ? 
  '5. Include hardware-software interface tests\n6. Include environmental condition tests where applicable' : ''}

Respond ONLY with a JSON array. No markdown, no preamble.
Each object:
{
  "title": "Short descriptive title",
  "description": "What this test verifies and why",
  "steps": ["Step 1: ...", "Step 2: ..."],
  "expectedResult": "Clear pass/fail criteria",
  "standard": "Specific clause reference if applicable (e.g., '21 CFR 11.10(e)')",
  "confidence": 0.0-1.0
}`;
}
```

### LLM Provider Configuration

QAtrial supports multiple LLM providers simultaneously, with purpose-scoped routing.

```typescript
// src/ai/types.ts

type LLMProviderType = 'openai-compatible' | 'anthropic';

type LLMPurpose = 
  | 'all'                // Fallback: used for any AI task
  | 'test_generation'    // AI test case generator
  | 'gap_analysis'       // Regulatory gap detection
  | 'risk_classification'// Risk scoring + safety class
  | 'report_narrative'   // Report section generation (summaries, conclusions)
  | 'requirement_decomp' // Breaking regulation text into atomic reqs
  | 'capa';              // Corrective action suggestions

interface LLMProvider {
  id: string;                            // User-defined, e.g. "claude-main"
  name: string;                          // Display name: "Claude Sonnet"
  type: LLMProviderType;
  baseUrl: string;                       // "https://api.anthropic.com" | "https://openrouter.ai/api" | "http://localhost:11434"
  apiKey: string;                        // Encrypted at rest
  model: string;                         // "claude-sonnet-4-20250514" | "gpt-4o" | "llama3.1:70b"
  purpose: LLMPurpose[];                 // ["all"] or ["test_generation", "gap_analysis"]
  maxTokens: number;                     // Default: 2000
  temperature: number;                   // Default: 0.3 (low for regulatory precision)
  enabled: boolean;
  priority: number;                      // Lower = tried first when multiple match same purpose
}

// Example configurations:
const exampleProviders: LLMProvider[] = [
  {
    id: 'claude-primary',
    name: 'Claude Sonnet',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    apiKey: 'sk-ant-...',
    model: 'claude-sonnet-4-20250514',
    purpose: ['all'],
    maxTokens: 2000,
    temperature: 0.3,
    enabled: true,
    priority: 1,
  },
  {
    id: 'openrouter-fallback',
    name: 'OpenRouter GPT-4o',
    type: 'openai-compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: 'sk-or-...',
    model: 'openai/gpt-4o',
    purpose: ['test_generation', 'report_narrative'],
    maxTokens: 2000,
    temperature: 0.3,
    enabled: true,
    priority: 2,
  },
  {
    id: 'ollama-local',
    name: 'Local Llama 3.1 70B',
    type: 'openai-compatible',
    baseUrl: 'http://localhost:11434/v1',
    apiKey: '',                           // Ollama needs no key
    model: 'llama3.1:70b',
    purpose: ['risk_classification'],     // Cheaper task, local is fine
    maxTokens: 1500,
    temperature: 0.2,
    enabled: true,
    priority: 1,
  },
];
```

### Provider Resolution & Unified Client

```typescript
// src/ai/provider.ts

function resolveProvider(purpose: LLMPurpose, providers: LLMProvider[]): LLMProvider {
  // 1. Find enabled providers matching this specific purpose
  let candidates = providers
    .filter(p => p.enabled && p.purpose.includes(purpose))
    .sort((a, b) => a.priority - b.priority);
  
  // 2. Fallback to providers with purpose: 'all'
  if (candidates.length === 0) {
    candidates = providers
      .filter(p => p.enabled && p.purpose.includes('all'))
      .sort((a, b) => a.priority - b.priority);
  }
  
  if (candidates.length === 0) {
    throw new Error(`No LLM provider configured for purpose: ${purpose}`);
  }
  
  return candidates[0];
}

// src/ai/client.ts

interface CompletionRequest {
  prompt: string;
  purpose: LLMPurpose;
  maxTokens?: number;
  temperature?: number;
}

interface CompletionResponse {
  text: string;
  model: string;
  providerId: string;
  tokensUsed: { input: number; output: number };
}

async function complete(req: CompletionRequest): Promise<CompletionResponse> {
  const provider = resolveProvider(req.purpose, getProviders());
  
  const maxTokens = req.maxTokens ?? provider.maxTokens;
  const temperature = req.temperature ?? provider.temperature;
  
  if (provider.type === 'anthropic') {
    return callAnthropic(provider, req.prompt, maxTokens, temperature);
  } else {
    return callOpenAICompatible(provider, req.prompt, maxTokens, temperature);
  }
}

async function callAnthropic(
  provider: LLMProvider, prompt: string, maxTokens: number, temperature: number
): Promise<CompletionResponse> {
  const response = await fetch(`${provider.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await response.json();
  return {
    text: data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join(''),
    model: provider.model,
    providerId: provider.id,
    tokensUsed: { input: data.usage?.input_tokens ?? 0, output: data.usage?.output_tokens ?? 0 },
  };
}

async function callOpenAICompatible(
  provider: LLMProvider, prompt: string, maxTokens: number, temperature: number
): Promise<CompletionResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (provider.apiKey) headers['Authorization'] = `Bearer ${provider.apiKey}`;
  
  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: provider.model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content ?? '',
    model: provider.model,
    providerId: provider.id,
    tokensUsed: { input: data.usage?.prompt_tokens ?? 0, output: data.usage?.completion_tokens ?? 0 },
  };
}
```

### Using the Client (all AI features go through `complete()`)

```typescript
// src/ai/tasks/generateTests.ts

async function generateTestCases(ctx: TestGenContext): Promise<AIGeneratedTestCase[]> {
  const prompt = buildTestGenPrompt(ctx);
  
  const response = await complete({
    prompt,
    purpose: 'test_generation',
    temperature: 0.3,
  });
  
  const clean = response.text.replace(/```json|```/g, '').trim();
  const parsed: AIGeneratedTestCase[] = JSON.parse(clean);
  
  return parsed.map(tc => ({
    ...tc,
    requirementId: ctx.requirement.id,
    accepted: false,
    generatedBy: response.model,          // Track which model produced it
    providerId: response.providerId,
  }));
}
```

### Provider Settings UI

```
┌──────────────────────────────────────────────────────────────────┐
│ Settings → LLM Providers                                        │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ ● Claude Sonnet (Primary)                    [Edit] [Test] │   │
│ │   Type: anthropic │ Purpose: All tasks                     │   │
│ │   Model: claude-sonnet-4-20250514                          │   │
│ │   Status: ✅ Connected │ Avg latency: 1.2s                │   │
│ ├────────────────────────────────────────────────────────────┤   │
│ │ ○ OpenRouter GPT-4o (Fallback)              [Edit] [Test]  │   │
│ │   Type: openai-compatible │ Purpose: Tests, Reports        │   │
│ │   Model: openai/gpt-4o                                     │   │
│ │   Status: ✅ Connected │ Avg latency: 0.9s                │   │
│ ├────────────────────────────────────────────────────────────┤   │
│ │ ○ Local Llama 3.1 70B                       [Edit] [Test]  │   │
│ │   Type: openai-compatible │ Purpose: Risk Classification   │   │
│ │   Model: llama3.1:70b @ localhost:11434                    │   │
│ │   Status: ⚠️ Unreachable                                  │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ [+ Add Provider]                                                 │
│                                                                  │
│ Purpose Routing:                                                 │
│ ┌──────────────────────┬──────────────────────────────────────┐  │
│ │ Test Generation      │ Claude Sonnet → OpenRouter GPT-4o   │  │
│ │ Gap Analysis         │ Claude Sonnet                        │  │
│ │ Risk Classification  │ Local Llama → Claude Sonnet          │  │
│ │ Report Narrative     │ Claude Sonnet → OpenRouter GPT-4o   │  │
│ │ Req Decomposition    │ Claude Sonnet                        │  │
│ │ CAPA Suggestions     │ Claude Sonnet                        │  │
│ └──────────────────────┴──────────────────────────────────────┘  │
│                                                                  │
│ Token Usage (this month):                                        │
│ Claude Sonnet:  42,380 input / 18,290 output                    │
│ OpenRouter:      8,120 input /  3,450 output                    │
│ Local Llama:    12,500 input /  5,200 output  (no cost)          │
└──────────────────────────────────────────────────────────────────┘
```

### Zustand Store

```typescript
// src/store/useLLMStore.ts

interface LLMStore {
  providers: LLMProvider[];
  
  addProvider: (provider: LLMProvider) => void;
  updateProvider: (id: string, updates: Partial<LLMProvider>) => void;
  removeProvider: (id: string) => void;
  
  testConnection: (id: string) => Promise<{ ok: boolean; latencyMs: number; error?: string }>;
  
  // Usage tracking (persisted to localStorage)
  usage: Record<string, { inputTokens: number; outputTokens: number; calls: number }>;
  trackUsage: (providerId: string, input: number, output: number) => void;
  
  // Convenience
  getProviderForPurpose: (purpose: LLMPurpose) => LLMProvider | null;
  hasAnyProvider: () => boolean;
}
```

### UI: Test Generation Review Panel

```
┌─────────────────────────────────────────────────────────┐
│ AI-Generated Test Cases for REQ-042                     │
│ "System shall log all data modifications with timestamp │
│  and user identity per 21 CFR Part 11.10(e)"           │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✅ TC-1: Verify audit log entry on data create      │ │
│ │    Confidence: 95%  │  Standard: 21 CFR 11.10(e)    │ │
│ │    Steps: 1. Create new record → 2. Check audit...  │ │
│ │    Expected: Log entry with timestamp, user ID...   │ │
│ │    [Accept] [Edit] [Reject]                         │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ ✅ TC-2: Verify audit log entry on data modify      │ │
│ │    Confidence: 94%  │  Standard: 21 CFR 11.10(e)    │ │
│ │    ...                                              │ │
│ │    [Accept] [Edit] [Reject]                         │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ ⚠️ TC-3: Verify audit log on delete (negative)     │ │
│ │    Confidence: 82%  │  Standard: 21 CFR 11.10(e)    │ │
│ │    ...                                              │ │
│ │    [Accept] [Edit] [Reject]                         │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ ⚠️ TC-4: Verify log tamper protection              │ │
│ │    Confidence: 78%  │  Standard: 21 CFR 11.10(a)    │ │
│ │    ...                                              │ │
│ │    [Accept] [Edit] [Reject]                         │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 🔵 TC-5: Boundary - max concurrent modifications   │ │
│ │    Confidence: 71%  │  Standard: —                  │ │
│ │    ...                                              │ │
│ │    [Accept] [Edit] [Reject]                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Accept All (5)] [Accept High Confidence (3)] [Cancel]  │
└─────────────────────────────────────────────────────────┘
```

Confidence thresholds: ≥90% = ✅ green, 70-89% = ⚠️ amber, <70% = 🔴 red.

---

## 3. AI Gap Analysis Engine

### Prompt Architecture

```typescript
// src/ai/prompts/gapAnalysis.ts

function buildGapAnalysisPrompt(ctx: GapAnalysisContext): string {
  return `You are a regulatory compliance auditor for ${ctx.vertical} products 
in the ${ctx.country} market.

## Project Standards Scope
${ctx.applicableStandards.map(s => `- ${s}`).join('\n')}

## Current Requirements (${ctx.requirements.length} total)
${ctx.requirements.map(r => `- [${r.id}] ${r.title}`).join('\n')}

## Current Test Cases (${ctx.tests.length} total)
${ctx.tests.map(t => `- [${t.id}] ${t.title} → linked to: ${t.linkedRequirementIds.join(', ') || 'none'}`).join('\n')}

## Instructions
Analyze the project against the applicable standards and identify:
1. Which standard clauses are fully covered (requirement exists AND has linked passing tests)
2. Which are partially covered (requirement exists but no/insufficient tests)
3. Which are completely missing (no requirement at all)

For missing items, propose a requirement title and description.

Respond ONLY with a JSON array:
{
  "standard": "Standard name",
  "clause": "Specific clause reference",
  "clauseDescription": "What this clause requires",
  "status": "covered" | "partial" | "missing",
  "linkedRequirementIds": ["REQ-xxx"],
  "linkedTestIds": ["TC-xxx"],
  "suggestion": "Proposed requirement text (for partial/missing only)",
  "priority": "critical" | "high" | "medium" | "low"
}`;
}
```

### Dashboard: Gap Analysis Heatmap

```
┌──────────────────────────────────────────────────────────────────┐
│ Compliance Gap Analysis — USA / Pharmaceutical / GxP            │
│                                                                  │
│ Overall Readiness: ████████████░░░░ 72%                         │
│                                                                  │
│ ┌──────────────────────┬───────┬─────────┬─────────┬──────────┐ │
│ │ Standard             │ Total │ Covered │ Partial │ Missing  │ │
│ ├──────────────────────┼───────┼─────────┼─────────┼──────────┤ │
│ │ 21 CFR Part 11       │  12   │ ██ 8    │ █ 3     │ █ 1      │ │
│ │ 21 CFR Parts 210/211 │  18   │ ██ 11   │ █ 4     │ █ 3      │ │
│ │ ICH Q7 (GMP)         │  15   │ █ 9     │ █ 5     │ █ 1      │ │
│ │ ICH E6(R2) (GCP)     │  10   │ █ 7     │ █ 2     │ █ 1      │ │
│ │ FDA Data Integrity    │   8   │ █ 6     │ █ 1     │ █ 1      │ │
│ └──────────────────────┴───────┴─────────┴─────────┴──────────┘ │
│                                                                  │
│ 🔴 Critical Gaps (click to auto-generate requirements)           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 21 CFR 211.68 — Automatic equipment backup & validation     │ │
│ │ 21 CFR 211.188 — Batch production record completeness       │ │
│ │ 21 CFR 211.192 — Investigation of discrepancies             │ │
│ │ ICH Q7 §12.4 — Revalidation schedule & criteria            │ │
│ │ [Generate Requirements for All Gaps]                        │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. AI Risk Classification

### Prompt Architecture

```typescript
function buildRiskClassificationPrompt(ctx: RiskClassContext): string {
  return `You are a risk management specialist using ${ctx.riskTaxonomy} methodology 
for ${ctx.vertical} in ${ctx.country}.

## Risk Taxonomy: ${ctx.riskTaxonomy}
${ctx.riskTaxonomy === 'iso14971' ? `
Severity scale (ISO 14971):
1 = Negligible (no injury)
2 = Minor (temporary, no intervention)
3 = Serious (intervention required)  
4 = Critical (permanent impairment)
5 = Catastrophic (death)` : ''}
${ctx.riskTaxonomy === 'ichQ9' ? `
Severity scale (ICH Q9):
1 = No impact on product quality
2 = Minor quality deviation
3 = Significant quality impact
4 = Major patient safety concern
5 = Critical patient safety hazard` : ''}
${ctx.riskTaxonomy === 'gamp5' ? `
GAMP 5 Categories:
1 = Infrastructure software (OS, databases)
3 = Non-configured products (COTS)
4 = Configured products  
5 = Custom applications` : ''}

## Requirement to Classify
ID: ${ctx.requirement.id}
Title: ${ctx.requirement.title}
Description: ${ctx.requirement.description}
Category: ${ctx.requirement.category}

## Project Context
Vertical: ${ctx.vertical}
Country: ${ctx.country}
Other requirements in scope: ${ctx.allRequirements.length}

Respond ONLY with JSON:
{
  "severity": 1-5,
  "likelihood": 1-5,
  "reasoning": "2-3 sentence explanation",
  "safetyClass": "e.g. IEC 62304 Class B / GAMP Category 4 / SIL 2",
  "confidence": 0.0-1.0,
  "mitigationSuggestion": "Recommended mitigation if risk is high"
}`;
}
```

### Dashboard: Risk Matrix

```
┌──────────────────────────────────────────────────────────┐
│ Risk Matrix — ISO 14971                                  │
│                                                          │
│ Likelihood                                               │
│   5 │  ·    ·    ●    ●●   ●●●                          │
│   4 │  ·    ·    ●    ●●   ●●                           │
│   3 │  ·    ●    ●●   ●    ·                            │
│   2 │  ·    ·    ●    ·    ·                            │
│   1 │  ·    ·    ·    ·    ·                            │
│     └──────────────────────────                          │
│       1    2    3    4    5   Severity                    │
│                                                          │
│ ■ Low (12)  ■ Medium (8)  ■ High (4)  ■ Critical (2)   │
│                                                          │
│ Critical Items:                                          │
│ • REQ-012: Infusion rate calculation accuracy  [5×4=20]  │
│ • REQ-031: Emergency shutdown response time    [4×5=20]  │
│                                                          │
│ [Classify All Unassessed (7)] [Export Risk Report]       │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Report Generator

### Report Types & Structure

#### 5a. Validation Summary Report (VSR)

```
Section 1: Executive Summary
  - Project name, vertical, country, date range
  - Overall pass rate, coverage %, risk summary
  - AI-generated natural language summary

Section 2: Scope & Approach
  - Applicable standards (auto-populated from country+vertical)
  - Validation strategy (IQ/OQ/PQ or equivalent)
  - Risk-based testing rationale

Section 3: Traceability Matrix
  - Full requirement → test → result mapping
  - Coverage indicators per standard

Section 4: Test Execution Summary
  - Pass/Fail/Not Run breakdown
  - Defect summary with severity
  - Retest results

Section 5: Risk Assessment
  - Risk matrix visualization
  - Residual risk summary
  - Risk acceptance rationale

Section 6: Deviations & CAPA
  - Failed tests → root cause → corrective action
  - AI-suggested CAPA items

Section 7: Conclusion
  - AI-generated compliance statement
  - Signature block (electronic signatures)

Appendices:
  A. Detailed test results
  B. Change history / audit trail extract
  C. AI-generated content disclosure
```

#### 5b. Executive Compliance Brief (One-Pager)

```typescript
function buildExecutiveBriefPrompt(ctx: ReportContext): string {
  return `You are a regulatory affairs director writing a one-page compliance 
status brief for C-level executives.

## Project Data
Name: ${ctx.project.name}
Country: ${ctx.project.country}
Vertical: ${ctx.project.vertical}
Standards in scope: ${ctx.standards.join(', ')}

## Metrics
Requirements: ${ctx.totalReqs} total, ${ctx.coveredReqs} covered (${ctx.coveragePct}%)
Tests: ${ctx.totalTests} total, ${ctx.passedTests} passed, ${ctx.failedTests} failed
Risk items: ${ctx.criticalRisks} critical, ${ctx.highRisks} high
Gaps: ${ctx.missingClauses} standard clauses with no coverage

## Recent Activity (last 30 days)
- ${ctx.recentChanges.map(c => c.summary).join('\n- ')}

Write a concise executive brief with:
1. STATUS — one line: On Track / At Risk / Blocked
2. KEY METRICS — 4-5 bullet points with the numbers
3. CRITICAL GAPS — top 3 issues that need attention
4. RECOMMENDED ACTIONS — 2-3 specific next steps
5. TIMELINE IMPACT — will this affect submission/audit dates?

Tone: Direct, no jargon padding, assume reader is CFO/CEO.
Keep it under 400 words.`;
}
```

#### 5c. Regulatory Submission Package

Template structure varies by target authority:

```typescript
const submissionFormats: Record<string, SubmissionFormat> = {
  'FDA_510k': {
    name: 'FDA 510(k) Premarket Notification',
    sections: [
      'Device Description',
      'Predicate Comparison',
      'Software Documentation (IEC 62304)',
      'Verification & Validation Summary',
      'Risk Analysis (ISO 14971)',
      'Biocompatibility (if applicable)',
      'Performance Testing',
      'Labeling',
    ],
    format: 'pdf',
    guidance: 'FDA Guidance for 510(k) Submissions',
  },
  'EU_MDR_TD': {
    name: 'EU MDR Technical Documentation (Annex II/III)',
    sections: [
      'Device Description & Specification',
      'Design & Manufacturing Information',
      'General Safety & Performance Requirements',
      'Benefit-Risk Analysis',
      'Product Verification & Validation',
      'Clinical Evaluation',
      'Post-Market Surveillance Plan',
    ],
    format: 'pdf',
    guidance: 'MDCG 2019-9 Rev.1',
  },
  'PMDA_STED': {
    name: 'PMDA Summary Technical Documentation',
    sections: [
      'Device Description',
      'Design Verification & Validation',
      'Software Documentation',
      'Risk Management',
      'Clinical Evidence',
      'Labeling',
    ],
    format: 'pdf',
    guidance: 'PMDA STED Guidance',
  },
};
```

### Report Generation Flow

```
User clicks [Generate Report]
        ↓
Select report type (VSR / Brief / Submission / RTM / Gap / Risk)
        ↓
Configure options:
  - Format (PDF / DOCX / HTML)
  - Include e-signatures: yes/no
  - Target authority (for submission packages)
  - Date range filter
        ↓
System assembles structured data from project
        ↓
AI generates narrative sections (summaries, conclusions, CAPA)
        ↓
User reviews AI-generated sections (edit/approve each)
        ↓
Render final document with:
  - Company branding (logo, colors)
  - Page numbers, TOC, headers/footers
  - Signature blocks
  - "AI-assisted content" watermark where applicable
        ↓
Download + audit trail entry logged
```

---

## 6. Electronic Signatures & Audit Trail

### 21 CFR Part 11 / EU Annex 11 Compliance

```typescript
// src/store/useAuditStore.ts (Zustand)

interface AuditStore {
  entries: AuditEntry[];
  
  // Log any change
  log: (action: AuditAction, entityType: string, entityId: string, 
        prev?: any, next?: any, reason?: string) => void;
  
  // Electronic signature flow
  requestSignature: (entityType: string, entityId: string, 
                     meaning: SignatureMeaning) => Promise<ElectronicSignature>;
  
  // Query
  getEntriesForEntity: (entityId: string) => AuditEntry[];
  getEntriesByDateRange: (from: string, to: string) => AuditEntry[];
  exportAuditTrail: (format: 'csv' | 'pdf') => void;
}
```

### Signature UI Flow

```
User clicks [Approve Requirement] or [Sign Report]
        ↓
Modal:
┌──────────────────────────────────────────────┐
│ Electronic Signature                         │
│                                              │
│ Action: Approve REQ-042                      │
│ Meaning: ○ Authored  ○ Reviewed  ● Approved  │
│                                              │
│ Reason for signing:                          │
│ ┌──────────────────────────────────────────┐ │
│ │ Verified against 21 CFR 11.10(e)...     │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Authenticate:                                │
│ Password: [••••••••••]                       │
│                                              │
│ By signing, you confirm this record is       │
│ accurate and complete.                       │
│                                              │
│ [Cancel]                      [Sign & Apply] │
└──────────────────────────────────────────────┘
```

### Audit Trail View

```
┌────────────────────────────────────────────────────────────────────┐
│ Audit Trail — REQ-042                                             │
│                                                                    │
│ 2026-03-27 14:32  │ Created by T. Meyer                           │
│                   │ "System shall log all data modifications..."   │
│                                                                    │
│ 2026-03-27 15:01  │ AI generated 5 test cases                     │
│                   │ 4 accepted, 1 rejected by T. Meyer             │
│                                                                    │
│ 2026-03-27 15:15  │ Risk classified (AI): Severity 4, Likelihood 3│
│                   │ Risk level: High — IEC 62304 Class B           │
│                   │ Reviewed and confirmed by T. Meyer              │
│                                                                    │
│ 2026-03-27 16:02  │ Description modified by T. Meyer               │
│                   │ Reason: "Added specific clause reference"       │
│                   │ [View Diff]                                     │
│                                                                    │
│ 2026-03-27 16:30  │ ✍ Signed: Approved by T. Meyer                │
│                   │ Meaning: Approved                               │
│                   │ Method: Password                                │
│                                                                    │
│ [Export Trail (PDF)] [Export Trail (CSV)]                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## 7. Dashboard Extensions

### 7a. Compliance Readiness Score

Weighted formula:

```typescript
function calculateReadinessScore(project: Project): number {
  const weights = {
    requirementCoverage: 0.25,    // % of standard clauses with requirements
    testCoverage: 0.25,           // % of requirements with linked tests
    testPassRate: 0.20,           // % of tests passing
    riskAssessed: 0.15,           // % of requirements with risk assessment
    signatureCompleteness: 0.15,  // % of critical items signed off
  };
  
  // Each metric is 0-100, multiply by weight, sum
  // Critical gaps apply a penalty multiplier (e.g., 0.8 if any critical gap exists)
}
```

### 7b. Portfolio Dashboard (Multi-Project)

```
┌──────────────────────────────────────────────────────────────────┐
│ Portfolio Compliance Overview                                    │
│                                                                  │
│ ┌─────────────────────┬─────────┬───────────┬──────┬──────────┐ │
│ │ Project             │ Country │ Vertical  │ Score│ Status   │ │
│ ├─────────────────────┼─────────┼───────────┼──────┼──────────┤ │
│ │ InfusionPump v3.1   │ 🇺🇸 USA │ Med Device│  84% │ On Track │ │
│ │ LabConnect Cloud    │ 🇩🇪 DE  │ Software  │  72% │ At Risk  │ │
│ │ PharmaBatch MES     │ 🇯🇵 JP  │ Pharma    │  41% │ Blocked  │ │
│ │ SupplyTrack Mobile  │ 🇬🇧 UK  │ Logistics │  91% │ Complete │ │
│ └─────────────────────┴─────────┴───────────┴──────┴──────────┘ │
│                                                                  │
│ Cross-Project Risks: 3 critical items across 2 projects          │
│ Next Audit: PharmaBatch MES — PMDA inspection Apr 15, 2026       │
└──────────────────────────────────────────────────────────────────┘
```

### 7c. Trend Charts

- Test pass rate over time (line chart, per project)
- Requirement stability (how many reqs changed per week — high churn = not ready)
- Gap closure velocity (how fast missing clauses get addressed)
- AI acceptance rate (what % of AI-generated tests/reqs get accepted — calibration signal)

---

## 8. Change Control Workflow

For GxP environments, modifications need approval:

```
Author makes change → Change logged in audit trail
        ↓
If entity is in "Approved" state:
  → Change requires re-approval
  → Status reverts to "Draft"
  → Notification sent to approvers
        ↓
Reviewer reviews change
  → [Approve] with e-signature → entity returns to "Approved"
  → [Reject] with reason → author notified
```

### Configurable per vertical:

```typescript
interface ChangeControlConfig {
  requireApprovalFor: ('requirements' | 'tests' | 'risk')[];
  minimumApprovers: number;           // 1 for most, 2 for pharma/medical
  requireReason: boolean;             // GxP = always true
  requireSignature: boolean;          // 21 CFR Part 11 = true
  autoRevertOnChange: boolean;        // Approved → Draft on edit
}

const verticalChangeControl: Record<IndustryVertical, ChangeControlConfig> = {
  pharma: {
    requireApprovalFor: ['requirements', 'tests', 'risk'],
    minimumApprovers: 2,
    requireReason: true,
    requireSignature: true,
    autoRevertOnChange: true,
  },
  software_it: {
    requireApprovalFor: ['requirements'],
    minimumApprovers: 1,
    requireReason: false,
    requireSignature: false,
    autoRevertOnChange: false,
  },
  // ...
};
```

---

## 9. Implementation Sequence

### Sprint 1 (Foundation)
- Data model extensions (types, risk, audit)
- Vertical selection in wizard (StepVertical.tsx)
- Audit trail store + basic logging
- Vertical → template mapping

### Sprint 2 (AI Core)
- LLM provider configuration system + settings UI
- AI test case generator + review UI
- AI risk classification + review UI

### Sprint 3 (Gap Analysis)
- AI gap analysis engine
- Gap analysis dashboard (heatmap + detail view)
- "Generate requirements for gaps" flow

### Sprint 4 (Reports)
- Report generation framework (data assembly + AI narrative)
- VSR report template
- Executive brief generator
- Traceability matrix export (enhanced)

### Sprint 5 (Compliance Features)
- Electronic signature system
- Change control workflow
- Audit trail viewer + export

### Sprint 6 (Dashboard & Portfolio)
- Compliance readiness score
- Risk matrix visualization
- Trend charts
- Portfolio dashboard (multi-project)

### Sprint 7 (Submission Packages)
- FDA 510(k) format
- EU MDR Technical Documentation
- PMDA STED format
- Report review + approval workflow

---

## 10. Pricing Implications

These features create natural tier separation:

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Country templates | 1 country | All | All |
| Vertical templates | — | All | All |
| AI test generation | 5/month | 100/month | Unlimited |
| AI gap analysis | — | ✓ | ✓ |
| AI risk classification | — | ✓ | ✓ |
| Reports (VSR, RTM) | — | ✓ | ✓ |
| Executive brief | — | — | ✓ |
| Submission packages | — | — | ✓ |
| E-signatures | — | — | ✓ |
| Change control | — | — | ✓ |
| Portfolio dashboard | — | — | ✓ |
| Audit trail export | — | Basic | Full |
| CAPA suggestions | — | — | ✓ |
