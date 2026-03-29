import { complete } from '../client';

export interface BriefContext {
  projectName: string;
  country: string;
  vertical?: string;
  standards: string[];
  totalReqs: number;
  coveredReqs: number;
  coveragePct: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  criticalRisks: number;
  highRisks: number;
  missingClauses: number;
}

export function buildExecutiveBriefPrompt(ctx: BriefContext): string {
  const verticalLabel = ctx.vertical || 'general';
  const failedPct =
    ctx.totalTests > 0
      ? ((ctx.failedTests / ctx.totalTests) * 100).toFixed(1)
      : '0.0';

  return `You are a senior regulatory compliance advisor writing an executive compliance brief for C-level leadership.

## Project
- Name: ${ctx.projectName}
- Market: ${ctx.country}
- Vertical: ${verticalLabel}
- Applicable Standards: ${ctx.standards.join(', ') || 'None specified'}

## Current Metrics
- Requirements: ${ctx.totalReqs} total, ${ctx.coveredReqs} covered by tests (${ctx.coveragePct.toFixed(1)}% coverage)
- Test Execution: ${ctx.totalTests} total, ${ctx.passedTests} passed, ${ctx.failedTests} failed (${failedPct}% failure rate)
- Risk Profile: ${ctx.criticalRisks} critical risks, ${ctx.highRisks} high risks
- Compliance Gaps: ${ctx.missingClauses} missing regulatory clauses

## Instructions
Write an executive compliance brief with the following structure. Use a professional, concise, C-level tone. Keep the entire brief under 400 words.

1. **STATUS**: One-line overall compliance status (e.g., "ON TRACK", "AT RISK", or "CRITICAL — ACTION REQUIRED"). Base this on the metrics above.

2. **KEY METRICS**: 4-6 bullet points summarizing the most important numbers. Highlight anything concerning.

3. **CRITICAL GAPS**: List the most significant compliance gaps or failures that require executive attention. If there are no critical gaps, state that clearly.

4. **RECOMMENDED ACTIONS**: 3-5 prioritized actions the organization should take immediately. Be specific and actionable.

5. **TIMELINE IMPACT**: Assessment of whether the current state affects regulatory submission timelines, and by how much.

Format the output as clean text with clear section headers. Do not use markdown code blocks. Use plain text formatting with section headers in ALL CAPS followed by a colon.`;
}

export async function generateExecutiveBrief(ctx: BriefContext): Promise<string> {
  const prompt = buildExecutiveBriefPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'report_narrative',
    maxTokens: 1500,
    temperature: 0.3,
  });

  return response.text;
}
