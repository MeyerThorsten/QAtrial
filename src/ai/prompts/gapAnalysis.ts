import type { AIGapAnalysis } from '../../types';
import { complete } from '../client';

export interface GapAnalysisContext {
  country: string;
  vertical?: string;
  applicableStandards: string[];
  requirements: { id: string; title: string; description: string }[];
  tests: { id: string; title: string; linkedRequirementIds: string[] }[];
}

export function buildGapAnalysisPrompt(ctx: GapAnalysisContext): string {
  const verticalLabel = ctx.vertical || 'general';

  const reqSummary = ctx.requirements
    .map(
      (r) =>
        `- [${r.id}] ${r.title}: ${r.description.slice(0, 200)}`,
    )
    .join('\n');

  const testSummary = ctx.tests
    .map(
      (t) =>
        `- [${t.id}] ${t.title} (linked to: ${t.linkedRequirementIds.join(', ') || 'none'})`,
    )
    .join('\n');

  return `You are a regulatory compliance specialist for the ${verticalLabel} industry in the ${ctx.country} market.

## Task
Perform a gap analysis comparing the project's requirements and test cases against each applicable regulatory standard. For every clause/section in each standard, determine whether it is:
- "covered": A requirement explicitly addresses this clause AND at least one test verifies it.
- "partial": A requirement partially addresses this clause, OR it is addressed but no test covers it.
- "missing": No requirement addresses this clause at all.

## Applicable Standards
${ctx.applicableStandards.map((s) => `- ${s}`).join('\n') || '- None specified'}

## Project Requirements (${ctx.requirements.length} total)
${reqSummary || 'None defined yet.'}

## Project Test Cases (${ctx.tests.length} total)
${testSummary || 'None defined yet.'}

## Instructions
1. For each standard listed above, identify its key clauses/sections relevant to ${verticalLabel} in ${ctx.country}.
2. Map each clause to the project requirements and tests above.
3. Classify each clause as "covered", "partial", or "missing".
4. For "partial" and "missing" clauses, provide a suggested requirement title and description to close the gap.

Respond ONLY with a JSON array. No markdown, no preamble, no explanation outside the JSON.
Each object in the array:
{
  "standard": "Name of the standard (e.g., '21 CFR Part 11')",
  "clause": "Specific clause reference (e.g., '11.10(a) - Validation')",
  "status": "covered" | "partial" | "missing",
  "linkedRequirementIds": ["REQ-001"],
  "linkedTestIds": ["TST-001"],
  "suggestion": "Suggested requirement text to address this gap (only for partial/missing)"
}`;
}

/**
 * Strips markdown code block wrappers from a response string.
 */
function stripCodeBlock(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
  cleaned = cleaned.replace(/\n?```\s*$/, '');
  return cleaned.trim();
}

export async function analyzeGaps(
  ctx: GapAnalysisContext,
): Promise<AIGapAnalysis[]> {
  const prompt = buildGapAnalysisPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'gap_analysis',
    maxTokens: 4000,
    temperature: 0.2,
  });

  const jsonText = stripCodeBlock(response.text);
  const parsed: Array<{
    standard: string;
    clause: string;
    status: 'covered' | 'partial' | 'missing';
    linkedRequirementIds: string[];
    linkedTestIds: string[];
    suggestion?: string;
  }> = JSON.parse(jsonText);

  return parsed.map((item) => ({
    standard: item.standard,
    clause: item.clause,
    status: item.status,
    linkedRequirementIds: Array.isArray(item.linkedRequirementIds)
      ? item.linkedRequirementIds
      : [],
    linkedTestIds: Array.isArray(item.linkedTestIds)
      ? item.linkedTestIds
      : [],
    suggestion: item.suggestion,
    generatedBy: response.model,
    providerId: response.providerId,
  }));
}
