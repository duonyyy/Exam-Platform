export type QuestionType = "single_choice" | "multiple_choice" | "true_false" | "short_answer";

export interface QuestionOption {
  id: string;
  content: string;
}

export interface ExamQuestion {
  id: number;
  question_id: number;
  order: number;
  points: number;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[];
}

export interface AttemptAnswer {
  id?: number;
  question_id: number;
  selected_options: string[] | string | null;
  updated_at?: string;
}

export interface ExamAttemptDetail {
  id: number;
  exam_session_id: number;
  attempt_number: number;
  status: "in_progress" | "submitted" | "graded";
  started_at: string;
  submitted_at?: string | null;
  remaining_seconds: number;
  score?: number | null;
  total_points?: number | null;
  is_passed?: boolean | null;
  exam?: {
    id: number;
    title: string;
    duration_minutes: number;
    total_points: number;
  } | null;
  questions: ExamQuestion[];
  answers: AttemptAnswer[];
}

export interface SaveAnswerPayload {
  question_id: number;
  selected_options: string[] | string;
}

export interface SubmitAttemptPayload {
  final_answers?: Array<{
    question_id: number;
    selected_options: string[] | string;
  }>;
}

export interface SubmitAttemptResult {
  attempt_id: number;
  status: "submitted" | "graded";
  started_at: string;
  submitted_at: string;
  total_questions: number;
  answered_questions: number;
  score: number | null;
  total_points: number | null;
  is_passed: boolean | null;
}
