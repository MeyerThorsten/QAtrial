import type { AIGeneratedTestCase } from '../../types';
import { complete } from '../client';

export interface TestGenContext {
  requirement: { id: string; title: string; description: string };
  country: string;
  vertical?: string;
  applicableStandards: string[];
  existingTests: { title: string }[];
  riskLevel?: string;
  projectType?: string;
}

export function buildTestGenPrompt(ctx: TestGenContext): string {
  const verticalLabel = ctx.vertical || 'software';
  const riskLevel = ctx.riskLevel || 'medium';

  let extraInstructions = '';
  if (ctx.vertical === 'pharma' || ctx.vertical === 'medical_devices') {
    extraInstructions =
      '5. Include data integrity verification per ALCOA+ principles\n6. Include audit trail verification where applicable';
  }
  if (ctx.projectType === 'embedded') {
    extraInstructions =
      '5. Include hardware-software interface tests\n6. Include environmental condition tests where applicable';
  }

  return `You are a QA validation engineer specializing in ${verticalLabel} testing for the ${ctx.country} regulatory market.

## Requirement Under Test
ID: ${ctx.requirement.id}
Title: ${ctx.requirement.title}
Description: ${ctx.requirement.description}
Risk Level: ${riskLevel}

## Applicable Regulatory Standards
${ctx.applicableStandards.map((s) => `- ${s}`).join('\n') || '- None specified'}

## Existing Test Cases (DO NOT duplicate)
${ctx.existingTests.map((t) => `- ${t.title}`).join('\n') || 'None yet.'}

## Instructions
Generate 4-6 test cases that:
1. Directly verify the requirement above
2. Include at least one negative/boundary test
3. Reference specific regulatory clauses where applicable
4. Scale test rigor to the risk level (${riskLevel})
${extraInstructions}

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

/**
 * Strips markdown code block wrappers (```json ... ``` or ``` ... ```)
 * from a response string to extract raw JSON.
 */
function stripCodeBlock(text: string): string {
  let cleaned = text.trim();
  // Remove ```json or ``` prefix
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
  // Remove trailing ```
  cleaned = cleaned.replace(/\n?```\s*$/, '');
  return cleaned.trim();
}

export async function generateTestCases(
  ctx: TestGenContext,
): Promise<AIGeneratedTestCase[]> {
  const prompt = buildTestGenPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'test_generation',
    maxTokens: 3000,
    temperature: 0.3,
  });

  const jsonText = stripCodeBlock(response.text);
  const parsed: Array<{
    title: string;
    description: string;
    steps: string[];
    expectedResult: string;
    standard?: string;
    confidence: number;
  }> = JSON.parse(jsonText);

  return parsed.map((item) => ({
    title: item.title,
    description: item.description,
    steps: item.steps,
    expectedResult: item.expectedResult,
    requirementId: ctx.requirement.id,
    standard: item.standard,
    confidence: Math.max(0, Math.min(1, item.confidence)),
    accepted: false,
    generatedBy: response.model,
    providerId: response.providerId,
  }));
}
