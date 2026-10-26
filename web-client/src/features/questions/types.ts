export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_answer";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionStatus = "ready" | "disabled";

export interface QuestionValidationError {
  row: number;
  column: string;
  message: string;
}

export interface QuestionPreviewItem {
  row: number;
  topic_id: number;
  question_type: QuestionType | string;
  question_text: string;
  difficulty: QuestionDifficulty | string;
  options_count: number;
  correct_answer: string | string[];
}

export interface QuestionValidationData {
  total_rows: number;
  valid_count: number;
  invalid_count: number;
  errors: QuestionValidationError[];
  preview: QuestionPreviewItem[];
}

export interface QuestionValidationResponse {
  message: string;
  data: QuestionValidationData;
}

export interface QuestionImportData {
  imported_count: number;
  sample_imported_ids: number[];
  total_processed: number;
}

export interface QuestionImportResponse {
  message: string;
  data: QuestionImportData;
}

export interface QuestionItem {
  id: string;
  orderNumber: number;
  subjectCode: string;
  subjectName: string;
  topicName: string;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  isUsedInExam: boolean;
  usedInExamCount: number;
  options?: { key: string; text: string }[];
  correctAnswer: string[];
  explanation: string;
}

export interface QuestionImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (importedCount: number) => void;
  defaultTopicId?: number;
  topics?: { id: number; name: string; subjectName?: string }[];
}
