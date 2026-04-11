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
  id?: string;
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

export type ViewTab = 'requirements' | 'tests' | 'dashboard' | 'reports' | 'settings' | 'design_control' | 'complaints' | 'suppliers' | 'batches' | 'training' | 'documents' | 'systems' | 'impact' | 'pms' | 'udi' | 'stability' | 'envmon' | 'audit_records' | 'workflows' | 'change_control' | 'deviations' | 'tasks' | 'kpi' | 'forms' | 'etmf' | 'econsent' | 'submissions' | 'scheduled_reports';

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
  | 'generate_report'
  | 'ai_generate'
  | 'ai_accept'
  | 'ai_reject'
  | 'login'
  | 'logout'
  | 'import';

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
  projectName?: string;
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

// ── Design Control ───────────────────────────────────────────────────────────

export type DesignPhase = 'user_needs' | 'design_input' | 'design_output' | 'verification' | 'validation' | 'transfer' | 'released';

export interface DesignControlItem {
  id: string;
  projectId: string;
  phase: DesignPhase;
  title: string;
  description: string;
  status: 'draft' | 'in_review' | 'approved' | 'rejected';
  linkedRequirementIds: string[];
  linkedTestIds: string[];
  attachments: string[]; // file references
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentRecordType = 'DHF' | 'DMR' | 'DHR';

export interface DocumentRecord {
  id: string;
  projectId: string;
  type: DocumentRecordType;
  title: string;
  description: string;
  version: string;
  status: 'draft' | 'active' | 'superseded' | 'obsolete';
  sections: DocumentSection[];
  linkedDesignItems: string[]; // DesignControlItem IDs
  linkedRequirementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string; // markdown
  order: number;
  linkedArtifacts: string[]; // requirement/test/design item IDs
}

// ── Custom Fields ────────────────────────────────────────────────────────────

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'multi_select' | 'boolean' | 'url';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: CustomFieldType;
  options?: string[]; // for select/multi_select
  required: boolean;
  appliesTo: ('requirement' | 'test' | 'capa' | 'design_item')[];
  defaultValue?: string;
}

// ── Workflow Engine ──────────────────────────────────────────────────────────

export type WorkflowStepType = 'approval' | 'review' | 'sign' | 'notify' | 'auto_check';

export interface WorkflowDefinition {
  id: string;
  name: string;
  trigger: 'on_status_change' | 'on_create' | 'on_edit' | 'manual';
  entityType: string;
  steps: WorkflowStep[];
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  assigneeRole?: string;
  requiredApprovers: number;
  slaHours?: number;
  escalateTo?: string;
  conditions?: { field: string; operator: string; value: string }[];
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  currentStepIndex: number;
  status: 'active' | 'completed' | 'cancelled' | 'escalated';
  approvals: { stepId: string; userId: string; action: 'approved' | 'rejected'; timestamp: string; reason?: string }[];
  startedAt: string;
  completedAt?: string;
}

// ── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'approval_needed' | 'task_overdue' | 'capa_deadline' | 'deviation_opened' | 'workflow_escalation' | 'comment_mention' | 'document_review' | 'training_due' | 'audit_reminder' | 'status_change' | 'mention';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  projectId?: string;
  userId: string;
  read: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  entityType: string;
  entityId: string;
  projectId: string;
  userId: string;
  userName: string;
  content: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'overdue';

export interface QTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  entityType?: string;
  entityId?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}
