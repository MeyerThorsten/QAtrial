import { complete } from '../client';

export interface CAPAContext {
  failedTest: { id: string; title: string; description: string };
  linkedRequirement: { id: string; title: string; description: string };
  vertical?: string;
  country: string;
}

export interface CAPAResult {
  rootCause: string;
  containment: string;
  correctiveAction: string;
  preventiveAction: string;
  effectivenessCheck: string;
}

export function buildCAPAPrompt(ctx: CAPAContext): string {
  const verticalLabel = ctx.vertical || 'general';

  return `You are a CAPA (Corrective and Preventive Action) specialist in the ${verticalLabel} industry for the ${ctx.country} regulatory market.

## Failed Test
- ID: ${ctx.failedTest.id}
- Title: ${ctx.failedTest.title}
- Description: ${ctx.failedTest.description}

## Linked Requirement
- ID: ${ctx.linkedRequirement.id}
- Title: ${ctx.linkedRequirement.title}
- Description: ${ctx.linkedRequirement.description}

## Instructions
Based on the failed test and its linked requirement, generate a structured CAPA recommendation. Consider regulatory requirements specific to ${verticalLabel} in ${ctx.country}.

Respond ONLY with a JSON object. No markdown, no preamble, no explanation outside the JSON.

{
  "rootCause": "Analysis of the most likely root cause for the test failure. Be specific and reference the requirement and test details.",
  "containment": "Immediate containment action to limit the impact of the failure while the root cause is being addressed.",
  "correctiveAction": "Specific corrective action to fix the identified root cause. Reference applicable regulatory standards.",
  "preventiveAction": "Preventive action to ensure this type of failure does not recur. Include process or system changes.",
  "effectivenessCheck": "How to verify that the corrective and preventive actions were effective. Include specific metrics or tests."
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

export async function suggestCAPA(ctx: CAPAContext): Promise<CAPAResult> {
  const prompt = buildCAPAPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'capa',
    maxTokens: 2000,
    temperature: 0.3,
  });

  const jsonText = stripCodeBlock(response.text);
  const parsed: CAPAResult = JSON.parse(jsonText);

  return {
    rootCause: parsed.rootCause || '',
    containment: parsed.containment || '',
    correctiveAction: parsed.correctiveAction || '',
    preventiveAction: parsed.preventiveAction || '',
    effectivenessCheck: parsed.effectivenessCheck || '',
  };
}
