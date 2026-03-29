import type { AIRiskClassification } from '../../types';
import { complete } from '../client';

export interface RiskClassContext {
  requirement: {
    id: string;
    title: string;
    description: string;
    category?: string;
  };
  vertical?: string;
  country: string;
  riskTaxonomy: string;
  allRequirements: { id: string; title: string }[];
}

export function buildRiskClassificationPrompt(ctx: RiskClassContext): string {
  let severityScale = '';

  if (ctx.riskTaxonomy === 'iso14971') {
    severityScale = `
Severity scale (ISO 14971):
1 = Negligible (no injury)
2 = Minor (temporary, no intervention)
3 = Serious (intervention required)
4 = Critical (permanent impairment)
5 = Catastrophic (death)`;
  } else if (ctx.riskTaxonomy === 'ichQ9') {
    severityScale = `
Severity scale (ICH Q9):
1 = No impact on product quality
2 = Minor quality deviation
3 = Significant quality impact
4 = Major patient safety concern
5 = Critical patient safety hazard`;
  } else if (ctx.riskTaxonomy === 'gamp5') {
    severityScale = `
GAMP 5 Categories:
1 = Infrastructure software (OS, databases)
3 = Non-configured products (COTS)
4 = Configured products
5 = Custom applications`;
  } else {
    severityScale = `
Generic severity scale:
1 = Negligible
2 = Minor
3 = Moderate
4 = Major
5 = Critical`;
  }

  return `You are a risk management specialist using ${ctx.riskTaxonomy} methodology for ${ctx.vertical || 'general'} in ${ctx.country}.

## Risk Taxonomy: ${ctx.riskTaxonomy}
${severityScale}

Likelihood scale:
1 = Rare
2 = Unlikely
3 = Possible
4 = Likely
5 = Almost certain

## Requirement to Classify
ID: ${ctx.requirement.id}
Title: ${ctx.requirement.title}
Description: ${ctx.requirement.description}
${ctx.requirement.category ? `Category: ${ctx.requirement.category}` : ''}

## Project Context
Vertical: ${ctx.vertical || 'general'}
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

/**
 * Strips markdown code block wrappers from a response string.
 */
function stripCodeBlock(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
  cleaned = cleaned.replace(/\n?```\s*$/, '');
  return cleaned.trim();
}

export async function classifyRisk(
  ctx: RiskClassContext,
): Promise<AIRiskClassification> {
  const prompt = buildRiskClassificationPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'risk_classification',
    maxTokens: 1000,
    temperature: 0.2,
  });

  const jsonText = stripCodeBlock(response.text);
  const parsed: {
    severity: number;
    likelihood: number;
    reasoning: string;
    safetyClass?: string;
    confidence: number;
    mitigationSuggestion?: string;
  } = JSON.parse(jsonText);

  const severity = Math.max(1, Math.min(5, Math.round(parsed.severity))) as 1 | 2 | 3 | 4 | 5;
  const likelihood = Math.max(1, Math.min(5, Math.round(parsed.likelihood))) as 1 | 2 | 3 | 4 | 5;

  return {
    requirementId: ctx.requirement.id,
    proposedSeverity: severity,
    proposedLikelihood: likelihood,
    reasoning: parsed.reasoning,
    safetyClass: parsed.safetyClass,
    confidence: Math.max(0, Math.min(1, parsed.confidence)),
    generatedBy: response.model,
    providerId: response.providerId,
  };
}
