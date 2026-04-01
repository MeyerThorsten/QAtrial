/**
 * AI Response Schema Validation & Retry Logic
 *
 * Provides structured validation for AI-generated JSON responses
 * and retry/repair logic when responses fail validation.
 */

// ── JSON extraction ──────────────────────────────────────────────────────────

/**
 * Extract JSON from an AI response that may contain markdown code fences
 * or other surrounding text.
 */
export function extractJSON(text: string): string {
  // Try to extract from markdown code block
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find a JSON array or object
  const jsonMatch = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  return text.trim();
}

/**
 * Safely parse JSON from AI response text.
 * Handles markdown fences, trailing commas, and other common issues.
 */
export function safeParseJSON<T>(text: string): { data: T | null; error: string | null } {
  const extracted = extractJSON(text);
  try {
    const data = JSON.parse(extracted) as T;
    return { data, error: null };
  } catch (e) {
    // Try fixing common JSON issues
    try {
      // Remove trailing commas
      const fixed = extracted
        .replace(/,\s*([\]}])/g, '$1')
        // Fix unquoted keys
        .replace(/(\{|,)\s*([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
      const data = JSON.parse(fixed) as T;
      return { data, error: null };
    } catch {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid JSON' };
    }
  }
}

// ── Schema validators ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validate test generation response */
export function validateTestGeneration(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (!Array.isArray(data)) {
    return { valid: false, errors: ['Expected an array of test cases'] };
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (typeof item !== 'object' || item === null) {
      errors.push(`Item ${i}: expected an object`);
      continue;
    }
    const obj = item as Record<string, unknown>;
    if (!obj.title || typeof obj.title !== 'string') errors.push(`Item ${i}: missing or invalid 'title'`);
    if (!obj.description || typeof obj.description !== 'string') errors.push(`Item ${i}: missing or invalid 'description'`);
    if (!Array.isArray(obj.steps)) errors.push(`Item ${i}: missing or invalid 'steps' array`);
    if (!obj.expectedResult || typeof obj.expectedResult !== 'string') errors.push(`Item ${i}: missing or invalid 'expectedResult'`);
    if (typeof obj.confidence !== 'number' || obj.confidence < 0 || obj.confidence > 1) {
      errors.push(`Item ${i}: 'confidence' must be a number between 0 and 1`);
    }
  }
  return { valid: errors.length === 0, errors };
}

/** Validate risk classification response */
export function validateRiskClassification(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Expected an object'] };
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.proposedSeverity !== 'number' || obj.proposedSeverity < 1 || obj.proposedSeverity > 5) {
    errors.push("'proposedSeverity' must be 1-5");
  }
  if (typeof obj.proposedLikelihood !== 'number' || obj.proposedLikelihood < 1 || obj.proposedLikelihood > 5) {
    errors.push("'proposedLikelihood' must be 1-5");
  }
  if (!obj.reasoning || typeof obj.reasoning !== 'string') {
    errors.push("Missing or invalid 'reasoning'");
  }
  if (typeof obj.confidence !== 'number' || obj.confidence < 0 || obj.confidence > 1) {
    errors.push("'confidence' must be 0-1");
  }
  return { valid: errors.length === 0, errors };
}

/** Validate gap analysis response */
export function validateGapAnalysis(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (!Array.isArray(data)) {
    return { valid: false, errors: ['Expected an array of gap items'] };
  }
  const validStatuses = ['covered', 'partial', 'missing'];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (typeof item !== 'object' || item === null) {
      errors.push(`Item ${i}: expected an object`);
      continue;
    }
    const obj = item as Record<string, unknown>;
    if (!obj.standard || typeof obj.standard !== 'string') errors.push(`Item ${i}: missing 'standard'`);
    if (!obj.clause || typeof obj.clause !== 'string') errors.push(`Item ${i}: missing 'clause'`);
    if (!obj.status || !validStatuses.includes(obj.status as string)) {
      errors.push(`Item ${i}: 'status' must be one of: ${validStatuses.join(', ')}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

/** Validate CAPA suggestion response */
export function validateCAPASuggestion(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Expected an object'] };
  }
  const obj = data as Record<string, unknown>;
  const required = ['rootCause', 'containment', 'correctiveAction', 'preventiveAction', 'effectivenessCheck'];
  for (const field of required) {
    if (!obj[field] || typeof obj[field] !== 'string') {
      errors.push(`Missing or invalid '${field}'`);
    }
  }
  return { valid: errors.length === 0, errors };
}

// ── Retry with validation ────────────────────────────────────────────────────

export interface RetryConfig {
  maxRetries: number;
  validator: (data: unknown) => ValidationResult;
  /** Optional repair prompt to send if validation fails */
  repairPrompt?: (errors: string[]) => string;
}

/**
 * Wrap an AI call with JSON parsing, validation, and retry logic.
 * Returns the parsed+validated data or throws with validation details.
 */
export async function withValidation<T>(
  aiCall: (attempt: number) => Promise<string>,
  config: RetryConfig,
): Promise<{ data: T; retryCount: number; validationErrors: string[] }> {
  let lastErrors: string[] = [];

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const rawText = await aiCall(attempt);
    const { data, error: parseError } = safeParseJSON<T>(rawText);

    if (parseError) {
      lastErrors = [`JSON parse error: ${parseError}`];
      continue;
    }

    const validation = config.validator(data);
    if (validation.valid) {
      return { data: data as T, retryCount: attempt, validationErrors: [] };
    }

    lastErrors = validation.errors;
    // If we have more retries, the next attempt can use a repair prompt
  }

  throw new ValidationError(
    `AI response failed validation after ${config.maxRetries + 1} attempts`,
    lastErrors,
  );
}

export class ValidationError extends Error {
  public readonly validationErrors: string[];

  constructor(message: string, validationErrors: string[]) {
    super(message);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}
