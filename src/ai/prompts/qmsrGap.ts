import { complete } from '../client';

export interface QMSRContext {
  requirements: { id: string; title: string; description: string }[];
  vertical: string;
}

/**
 * ISO 13485:2016 clauses 4–8 that QMSR (21 CFR 820 harmonized) incorporates by reference.
 */
const ISO_13485_CLAUSES = [
  { clause: '4.1', title: 'Quality management system — General requirements' },
  { clause: '4.2.1', title: 'Documentation — General' },
  { clause: '4.2.2', title: 'Quality manual' },
  { clause: '4.2.3', title: 'Medical device file' },
  { clause: '4.2.4', title: 'Control of documents' },
  { clause: '4.2.5', title: 'Control of records' },
  { clause: '5.1', title: 'Management commitment' },
  { clause: '5.2', title: 'Customer focus' },
  { clause: '5.3', title: 'Quality policy' },
  { clause: '5.4', title: 'Planning' },
  { clause: '5.5', title: 'Responsibility, authority and communication' },
  { clause: '5.6', title: 'Management review' },
  { clause: '6.1', title: 'Provision of resources' },
  { clause: '6.2', title: 'Human resources' },
  { clause: '6.3', title: 'Infrastructure' },
  { clause: '6.4', title: 'Work environment and contamination control' },
  { clause: '7.1', title: 'Planning of product realization' },
  { clause: '7.2', title: 'Customer-related processes' },
  { clause: '7.3', title: 'Design and development' },
  { clause: '7.4', title: 'Purchasing' },
  { clause: '7.5', title: 'Production and service provision' },
  { clause: '7.6', title: 'Control of monitoring and measuring equipment' },
  { clause: '8.1', title: 'Measurement, analysis and improvement — General' },
  { clause: '8.2', title: 'Monitoring and measurement' },
  { clause: '8.3', title: 'Control of nonconforming product' },
  { clause: '8.4', title: 'Analysis of data' },
  { clause: '8.5', title: 'Improvement' },
];

export function buildQMSRGapPrompt(ctx: QMSRContext): string {
  const reqSummary = ctx.requirements
    .map((r) => `- [${r.id}] ${r.title}: ${r.description.slice(0, 200)}`)
    .join('\n');

  const clauseList = ISO_13485_CLAUSES
    .map((c) => `- ${c.clause}: ${c.title}`)
    .join('\n');

  return `You are a QMSR (Quality Management System Regulation) compliance specialist for the ${ctx.vertical} industry.

## Background
The FDA's QMSR (21 CFR Part 820, effective February 2026) incorporates ISO 13485:2016 by reference, replacing the legacy QSR. Medical device manufacturers must now demonstrate conformity to ISO 13485:2016 clauses 4 through 8.

## Task
Assess the project's requirements against each ISO 13485:2016 clause below. For each clause, determine compliance status based on the project requirements provided.

## ISO 13485:2016 Clauses (QMSR Scope)
${clauseList}

## Project Requirements (${ctx.requirements.length} total)
${reqSummary || 'None defined yet.'}

## Classification Rules
- "compliant": One or more requirements directly and fully address this clause.
- "partial": Requirements partially address this clause but have gaps.
- "gap": No requirement addresses this clause, or coverage is insufficient.

## Instructions
1. Map each ISO 13485 clause to the project requirements above.
2. For "partial" and "gap" clauses, provide a specific recommendation.
3. For "compliant" clauses, cite the requirement ID(s) as evidence.

Respond ONLY with a JSON array. No markdown, no preamble, no explanation outside the JSON.
Each object in the array:
{
  "iso13485Clause": "clause number (e.g., '7.3')",
  "clauseTitle": "clause title",
  "status": "compliant" | "partial" | "gap",
  "evidence": "requirement ID(s) or description of how the clause is addressed (for compliant/partial)",
  "recommendation": "specific action to achieve compliance (for partial/gap, omit for compliant)"
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

export async function assessQMSRGap(
  ctx: QMSRContext,
): Promise<{
  iso13485Clause: string;
  clauseTitle: string;
  status: 'compliant' | 'partial' | 'gap';
  evidence?: string;
  recommendation?: string;
}[]> {
  const prompt = buildQMSRGapPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'gap_analysis',
    maxTokens: 4000,
    temperature: 0.2,
  });

  const jsonText = stripCodeBlock(response.text);
  const parsed: Array<{
    iso13485Clause: string;
    clauseTitle: string;
    status: 'compliant' | 'partial' | 'gap';
    evidence?: string;
    recommendation?: string;
  }> = JSON.parse(jsonText);

  return parsed.map((item) => ({
    iso13485Clause: item.iso13485Clause ?? '',
    clauseTitle: item.clauseTitle ?? '',
    status: item.status ?? 'gap',
    evidence: item.evidence,
    recommendation: item.recommendation,
  }));
}
