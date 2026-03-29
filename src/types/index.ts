// ── Status enums ──────────────────────────────────────────────────────────────

export type RequirementStatus = 'Draft' | 'Active' | 'Closed';
export type TestStatus = 'Not Run' | 'Passed' | 'Failed';

// ── Industry verticals & configuration ────────────────────────────────────────

export type IndustryVertical =
  | 'pharma'
  | 'biotech'
  | 'medical_devices'
  | 'cro'
  | 'clinical_lab'
  | 'logistics'
  | 'cosmetics'
  | 'aerospace'
  | 'chemical_env'
  | 'software_it';

export type RiskTaxonomyType = 'iso14971' | 'ichQ9' | 'fmea' | 'gamp5' | 'generic';
export type SafetyClassType = 'iec62304' | 'gamp5cat' | 'sil' | 'none';

export interface VerticalConfig {
  id: IndustryVertical;
  name: string;
  gxpFocus: string[];
  primaryStandards: string[];
  riskTaxonomy: RiskTaxonomyType;
  safetyClassification?: SafetyClassType;
}

// ── Risk assessment ───────────────────────────────────────────────────────────

export type Severity = 1 | 2 | 3 | 4 | 5;
export type Likelihood = 1 | 2 | 3 | 4 | 5;
export type Detectability = 1 | 2 | 3 | 4 | 5;

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAssessment {
  id: string;
  requirementId: string;
  severity: Severity;
  likelihood: Likelihood;
  detectability?: Detectability;
  riskScore: number;
  riskLevel: RiskLevel;
  mitigationStrategy?: string;
  residualRisk?: number;
  classifiedBy: 'manual' | 'ai';
  classifiedAt: string;
}

// ── Core domain models ────────────────────────────────────────────────────────

export interface Requirement {
  id: string;
  title: string;
  description: string;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
  // Sprint 1 extensions (all optional for backward compatibility)
  tags?: string[];
  jurisdictions?: string[];
  verticals?: string[];
  riskLevel?: RiskLevel;
  regulatoryRef?: string;
  evidenceHints?: string[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  status: TestStatus;
  linkedRequirementIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Project types ─────────────────────────────────────────────────────────────

export type ProjectType = 'software' | 'embedded' | 'compliance' | 'empty';

export interface ProjectMeta {
  name: string;
  description: string;
  owner: string;
  version: string;
  type: ProjectType;
  createdAt: string;
  // Sprint 1 extensions
  country?: string;
  vertical?: IndustryVertical;
  modules?: string[];
}

export interface ProjectData {
  version: 1;
  exportedAt: string;
  project?: ProjectMeta;
  requirements: Requirement[];
  tests: Test[];
  counters: { reqCounter: number; testCounter: number };
}

// ── Evaluation & dashboard ────────────────────────────────────────────────────

export interface EvaluationMetrics {
  totalRequirements: number;
  totalTests: number;
  coveragePercent: number;
  coveredRequirements: Requirement[];
  orphanedRequirements: Requirement[];
  orphanedTests: Test[];
  requirementStatusCounts: Record<RequirementStatus, number>;
  testStatusCounts: Record<TestStatus, number>;
}

export interface DashboardFilters {
  requirementStatus: RequirementStatus | 'All';
  testStatus: TestStatus | 'All';
}

export type ViewTab = 'requirements' | 'tests' | 'dashboard' | 'reports' | 'settings';

// ── Templates ─────────────────────────────────────────────────────────────────

export interface TemplateItem {
  title: string;
  description: string;
  category: string;
}

export interface ProjectTemplate {
  type: ProjectType;
  label: string;
  description: string;
  requirements: TemplateItem[];
  tests: (TemplateItem & { linkedReqIndices: number[] })[];
}

// ── AI-generated artefacts ────────────────────────────────────────────────────

export interface AIGeneratedTestCase {
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  requirementId: string;
  standard?: string;
  confidence: number; // 0-1
  accepted: boolean;
  generatedBy: string;
  providerId: string;
}

export type GapStatus = 'covered' | 'partial' | 'missing';

export interface AIGapAnalysis {
  standard: string;
  clause: string;
  status: GapStatus;
  linkedRequirementIds: string[];
  linkedTestIds: string[];
  suggestion?: string;
  generatedBy: string;
  providerId: string;
}

export interface AIRiskClassification {
  requirementId: string;
  proposedSeverity: Severity;
  proposedLikelihood: Likelihood;
  reasoning: string;
  safetyClass?: string;
  confidence: number; // 0-1
  generatedBy: string;
  providerId: string;
}

// ── Audit trail ───────────────────────────────────────────────────────────────

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'status_change'
  | 'link'
  | 'unlink'
  | 'approve'
  | 'reject'
  | 'sign'
  | 'export'
  | 'generate_report';

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  signature?: ElectronicSignature;
}

// ── Electronic signatures ─────────────────────────────────────────────────────

export type SignatureMeaning = 'authored' | 'reviewed' | 'approved' | 'verified' | 'rejected';

export interface ElectronicSignature {
  signerId: string;
  signerName: string;
  signerRole: string;
  timestamp: string;
  meaning: SignatureMeaning;
  method: string;
}

// ── Reports ───────────────────────────────────────────────────────────────────

export type ReportType =
  | 'validation_summary'
  | 'traceability_matrix'
  | 'gap_analysis'
  | 'risk_assessment'
  | 'executive_brief'
  | 'submission_package';

export interface ReportSection {
  title: string;
  content: string;
  aiGenerated: boolean;
  reviewedBy?: string;
  approvedBy?: string;
}

export interface ReportConfig {
  type: ReportType;
  projectId: string;
  format: string;
  includeSignatures: boolean;
  targetAuthority?: string;
  generatedAt: string;
  generatedBy: string;
  sections: ReportSection[];
}

// ── LLM provider configuration ───────────────────────────────────────────────

export type LLMProviderType = 'openai-compatible' | 'anthropic';

export type LLMPurpose =
  | 'all'
  | 'test_generation'
  | 'gap_analysis'
  | 'risk_classification'
  | 'report_narrative'
  | 'requirement_decomp'
  | 'capa';

export interface LLMProvider {
  id: string;
  name: string;
  type: LLMProviderType;
  baseUrl: string;
  apiKey: string;
  model: string;
  purpose: LLMPurpose[];
  maxTokens: number;
  temperature: number;
  enabled: boolean;
  priority: number;
}

// ── Change control ────────────────────────────────────────────────────────────

export interface ChangeControlConfig {
  requireApprovalFor: string[];
  minimumApprovers: number;
  requireReason: boolean;
  requireSignature: boolean;
  autoRevertOnChange: boolean;
}

// ── Country & module configuration ────────────────────────────────────────────

export interface CountryConfig {
  code: string;
  name: string;
  region: string;
  defaultLanguage: string;
  flag: string;
  availableVerticals: IndustryVertical[];
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  requirementCount: number;
  testCount: number;
}
