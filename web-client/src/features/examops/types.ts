/**
 * TypeScript types and contracts for ExamOps Agent (agentic-system)
 * Synchronized with: agentic-system/src/examops/schemas.py
 */

export interface ActorContext {
  actor_id: string;
  actor_role: "admin" | "teacher" | "student";
  permissions?: string[];
}

export interface ExamDifficultyDistribution {
  easy: number; // 0.0 - 100.0
  medium: number;
  hard: number;
}

export interface TopicDistributionItem {
  topic_id: string;
  topic_name: string;
  question_count: number;
}

export interface ExamBlueprint {
  title: string;
  subject_id: string;
  duration_minutes: number;
  total_questions: number;
  total_points: number;
  passing_score: number;
  difficulty_distribution: ExamDifficultyDistribution;
  topic_distribution: TopicDistributionItem[];
}

export interface ReadinessCheckItem {
  check_name: string;
  status: "PASS" | "FAIL" | "WARNING";
  message: string;
}

export interface ReadinessReview {
  status: "PASS" | "FAIL" | "WARNING";
  total_checks: number;
  passed_checks: number;
  failed_checks: number;
  checks: ReadinessCheckItem[];
  violations: string[];
  recommendations: string[];
}

export interface ApprovalProposal {
  action: string;
  arguments: Record<string, unknown>;
  proposal_hash: string;
  proposed_by: string;
  reason: string;
}

export interface VerificationResult {
  is_valid: boolean;
  checks_passed: string[];
  checks_failed: string[];
  is_terminal?: boolean;
}

export interface AgentSkillOutput {
  blueprint?: ExamBlueprint;
  readiness_review?: ReadinessReview;
  verification?: VerificationResult;
  [key: string]: unknown;
}

export interface TaskCreateRequest {
  goal: string;
  actor: ActorContext;
  subject: string;
  constraints?: {
    total_questions?: number;
    duration_minutes?: number;
    pass_score?: number;
    total_points?: number;
    difficulty_distribution?: ExamDifficultyDistribution;
    topics?: TopicDistributionItem[];
    requires_write?: boolean;
    [key: string]: unknown;
  };
  thread_id?: string;
}

export interface TaskResumeRequest {
  decision: "approve" | "reject";
  actor: ActorContext;
  reason?: string;
}

export interface TaskResponse {
  task_id: string;
  thread_id: string;
  status: "COMPLETED" | "WAITING_FOR_APPROVAL" | "FAILED" | "REJECTED";
  summary: string;
  result?: AgentSkillOutput | null;
  proposal?: ApprovalProposal | null;
  errors?: string[];
}

export interface AgentHealthResponse {
  status: string;
  version: string;
  environment: string;
  model_provider: string;
  mode?: "live" | "simulated";
}
