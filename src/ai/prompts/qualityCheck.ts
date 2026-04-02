import { complete } from '../client';

export interface QualityCheckContext {
  requirement: { id: string; title: string; description: string };
  vertical?: string;
}

export interface QualityIssue {
  type: 'vague' | 'untestable' | 'ambiguous' | 'incomplete' | 'duplicate_risk' | 'missing_criteria';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
}

function buildPrompt(ctx: QualityCheckContext): string {
  const verticalNote = ctx.vertical
    ? `\nIndustry vertical: ${ctx.vertical}. Apply domain-specific standards when evaluating.`
    : '';

  return `You are a quality assurance expert reviewing a requirement for a regulated environment.${verticalNote}

Analyze the following requirement for quality issues:

**Title:** ${ctx.requirement.title}
**Description:** ${ctx.requirement.description || '(empty)'}

Check for ALL of the following issues:

1. **Vague** - Contains subjective terms without measurable criteria (e.g., "user-friendly", "fast", "easy to use", "intuitive", "robust", "adequate", "appropriate"). Flag ANY such terms.
2. **Untestable** - No clear pass/fail criteria. Cannot be verified through testing. No measurable outcome defined.
3. **Ambiguous** - Could be interpreted in multiple ways. Uses "or", "and/or", unclear pronouns, or terms that have multiple meanings.
4. **Incomplete** - Missing acceptance criteria, boundary conditions, error handling, performance thresholds, or expected behavior.
5. **Duplicate Risk** - Uses overly generic patterns that likely overlap with other requirements (e.g., "the system shall be secure", "data shall be backed up").
6. **Missing Criteria** - Lacks quantitative/measurable acceptance criteria. No specific numbers, thresholds, time limits, or measurable outcomes.

Respond with ONLY a JSON array (no markdown, no explanation). Each item must have:
- "type": one of "vague", "untestable", "ambiguous", "incomplete", "duplicate_risk", "missing_criteria"
- "severity": "error" (blocks approval), "warning" (should fix), or "info" (suggestion)
- "message": Brief explanation of the issue found
- "suggestion": Concrete rewrite or improvement suggestion

If the requirement has no issues, respond with an empty array: []

Important: Be thorough but practical. Even well-written requirements often have at least one area for improvement. Focus on issues that would actually matter in a regulated environment (GxP, ISO 13485, IEC 62304, 21 CFR Part 11, etc.).`;
}

/**
 * Check the quality of a requirement using AI analysis.
 * Returns a list of quality issues found.
 */
export async function checkRequirementQuality(ctx: QualityCheckContext): Promise<QualityIssue[]> {
  const prompt = buildPrompt(ctx);

  const response = await complete({
    prompt,
    purpose: 'all',
    maxTokens: 2048,
    temperature: 0.2,
  });

  try {
    // Extract JSON from the response (handle cases where LLM wraps in markdown)
    let jsonText = response.text.trim();

    // Strip markdown code fences if present
    const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonText = fenceMatch[1].trim();
    }

    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Validate and sanitize each issue
    const validTypes = new Set(['vague', 'untestable', 'ambiguous', 'incomplete', 'duplicate_risk', 'missing_criteria']);
    const validSeverities = new Set(['error', 'warning', 'info']);

    return parsed
      .filter(
        (item: any) =>
          item &&
          typeof item.type === 'string' &&
          validTypes.has(item.type) &&
          typeof item.message === 'string' &&
          typeof item.suggestion === 'string',
      )
      .map((item: any) => ({
        type: item.type as QualityIssue['type'],
        severity: validSeverities.has(item.severity) ? (item.severity as QualityIssue['severity']) : 'warning',
        message: item.message,
        suggestion: item.suggestion,
      }));
  } catch {
    // If parsing fails, return a single error issue
    return [
      {
        type: 'incomplete',
        severity: 'info',
        message: 'Could not parse AI quality check response.',
        suggestion: 'Try running the quality check again.',
      },
    ];
  }
}
