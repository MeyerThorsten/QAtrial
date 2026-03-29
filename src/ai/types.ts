import type { LLMPurpose } from '../types';

export interface CompletionRequest {
  prompt: string;
  purpose: LLMPurpose;
  maxTokens?: number;
  temperature?: number;
}

export interface CompletionResponse {
  text: string;
  model: string;
  providerId: string;
  tokensUsed: { input: number; output: number };
}
