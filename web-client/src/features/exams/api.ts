import { apiClient } from "@/lib/api-client";

export interface ExamItem {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  duration_minutes: number;
  pass_score: number;
  total_points: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  created_by: number;
  subject?: { id: number; code: string; name: string };
  questions_count?: number;
  questions?: any[];
  sessions_count?: number;
}

export interface QuestionItem {
  id: number;
  topic_id: number;
  question_type: string;
  question_text: string;
  options: Array<{ id: string; content: string }>;
  correct_answer?: string | string[];
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  status: "ready" | "disabled";
  source: string;
  created_by: number;
  topic?: { id: number; name: string; subject_id: number };
}

export interface ExamSessionItem {
  id: number;
  exam_id: number;
  title: string;
  start_at: string;
  end_at: string;
  allow_late_minutes: number;
  max_attempts: number;
  status: "draft" | "published" | "closed";
  created_by: number;
  exam?: ExamItem;
  assignments_count?: number;
  attempts_count?: number;
}

// Exams API
export async function getExamsApi(params?: { subject_id?: number; search?: string }): Promise<{ data: ExamItem[] }> {
  return apiClient<{ data: ExamItem[] }>("/api/proxy/exams", {
    method: "GET",
    params,
  });
}

export async function getExamApi(id: number): Promise<{ data: ExamItem }> {
  return apiClient<{ data: ExamItem }>(`/api/proxy/exams/${id}`, {
    method: "GET",
  });
}

export async function createExamApi(data: any): Promise<{ data: ExamItem }> {
  return apiClient<{ data: ExamItem }>("/api/proxy/exams", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExamApi(id: number, data: any): Promise<{ data: ExamItem }> {
  return apiClient<{ data: ExamItem }>(`/api/proxy/exams/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteExamApi(id: number): Promise<void> {
  return apiClient<void>(`/api/proxy/exams/${id}`, {
    method: "DELETE",
  });
}

// Questions API
export async function getQuestionsApi(params?: {
  subject_id?: number;
  topic_id?: number;
  search?: string;
  status?: string;
  type?: string;
  difficulty?: string;
  per_page?: number;
  with_details?: number;
}): Promise<{ data: QuestionItem[]; meta?: any }> {
  return apiClient<{ data: QuestionItem[]; meta?: any }>("/api/proxy/questions", {
    method: "GET",
    params: { with_details: 1, ...params },
  });
}

export async function getQuestionApi(id: number): Promise<{ data: QuestionItem }> {
  return apiClient<{ data: QuestionItem }>(`/api/proxy/questions/${id}`, {
    method: "GET",
  });
}

export async function createQuestionApi(data: any): Promise<{ data: QuestionItem }> {
  return apiClient<{ data: QuestionItem }>("/api/proxy/questions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateQuestionApi(id: number, data: any): Promise<{ data: QuestionItem }> {
  return apiClient<{ data: QuestionItem }>(`/api/proxy/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteQuestionApi(id: number): Promise<void> {
  return apiClient<void>(`/api/proxy/questions/${id}`, {
    method: "DELETE",
  });
}

// Exam Sessions API
export async function getExamSessionsApi(params?: { exam_id?: number; status?: string }): Promise<{ data: ExamSessionItem[] }> {
  return apiClient<{ data: ExamSessionItem[] }>("/api/proxy/exam-sessions", {
    method: "GET",
    params,
  });
}

export async function getExamSessionApi(id: number): Promise<{ data: ExamSessionItem }> {
  return apiClient<{ data: ExamSessionItem }>(`/api/proxy/exam-sessions/${id}`, {
    method: "GET",
  });
}

export async function createExamSessionApi(data: any): Promise<{ data: ExamSessionItem }> {
  return apiClient<{ data: ExamSessionItem }>("/api/proxy/exam-sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function publishExamSessionApi(id: number): Promise<{ data: ExamSessionItem }> {
  return apiClient<{ data: ExamSessionItem }>(`/api/proxy/exam-sessions/${id}/publish`, {
    method: "POST",
  });
}

export async function closeExamSessionApi(id: number): Promise<{ data: ExamSessionItem }> {
  return apiClient<{ data: ExamSessionItem }>(`/api/proxy/exam-sessions/${id}/close`, {
    method: "POST",
  });
}

export async function getSessionResultsApi(sessionId: number): Promise<{ data: any }> {
  return apiClient<{ data: any }>(`/api/proxy/exam-sessions/${sessionId}/results`, {
    method: "GET",
  });
}
