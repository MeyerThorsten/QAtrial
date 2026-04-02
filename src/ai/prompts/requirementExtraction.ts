import { complete } from '../client';

export interface ExtractionContext {
  regulationText: string; // pasted regulation section
  country: string;
  vertical?: string;
}

export function buildExtractionPrompt(ctx: ExtractionContext): string {
  const verticalLabel = ctx.vertical || 'general';

  return `You are a regulatory affairs specialist for the ${verticalLabel} industry in the ${ctx.country} market.

## Task
Extract atomic, testable requirements from the following regulation text. Each requirement must be independently verifiable. Break compound clauses into separate requirements.

## Guidelines
1. Each requirement must have a clear, measurable acceptance criterion.
2. Use "shall" language for mandatory requirements.
3. Include the specific regulatory reference (clause, section, paragraph) for traceability.
4. Classify risk level based on patient/user safety impact:
   - "critical" — direct patient safety or data integrity risk
   - "high" — significant regulatory non-compliance risk
   - "medium" — moderate compliance impact
   - "low" — minor procedural or documentation requirement
5. Keep titles concise (under 120 characters).
6. Descriptions should be self-contained and unambiguous.

## Regulation Text
${ctx.regulationText}

## Instructions
Respond ONLY with a JSON array. No markdown, no preamble, no explanation outside the JSON.
Each object in the array:
{
  "title": "Concise requirement title",
  "description": "Detailed, testable requirement description with acceptance criteria",
  "regulatoryRef": "Specific clause/section reference (e.g., '820.30(a)', 'Annex II Section 4.1')",
  "riskLevel": "critical" | "high" | "medium" | "low"
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

export async function extractRequirements(
  ctx: ExtractionContext,
): Promise<{ title: string; description: string; regulatoryRef: string; riskLevel: string }[]> {
  const prompt = buildExtractionPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'requirement_decomp',
    maxTokens: 4000,
    temperature: 0.2,
  });

  const jsonText = stripCodeBlock(response.text);
  const parsed: Array<{
    title: string;
    description: string;
    regulatoryRef: string;
    riskLevel: string;
  }> = JSON.parse(jsonText);

  return parsed.map((item) => ({
    title: item.title ?? '',
    description: item.description ?? '',
    regulatoryRef: item.regulatoryRef ?? '',
    riskLevel: item.riskLevel ?? 'medium',
  }));
}
