import { apiClient } from "@/lib/api-client";
import { ExamAttemptDetail, SaveAnswerPayload, SubmitAttemptPayload, SubmitAttemptResult } from "./types";

export async function getExamAttemptApi(attemptId: number | string): Promise<{ data: ExamAttemptDetail }> {
  return apiClient<{ data: ExamAttemptDetail }>(`/api/proxy/exam-attempts/${attemptId}`, {
    method: "GET",
  });
}

export async function saveAnswerApi(
  attemptId: number | string,
  payload: SaveAnswerPayload
): Promise<{ data: { attempt_id: number; question_id: number; selected_options: unknown } }> {
  return apiClient(`/api/proxy/exam-attempts/${attemptId}/answers`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function submitAttemptApi(
  attemptId: number | string,
  payload?: SubmitAttemptPayload,
  idempotencyKey?: string
): Promise<{ data: SubmitAttemptResult; message: string }> {
  const headers: Record<string, string> = {};
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  return apiClient(`/api/proxy/exam-attempts/${attemptId}/submit`, {
    method: "POST",
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });
}
