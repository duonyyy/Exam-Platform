import { apiClient } from "@/lib/api-client";
import {
  ProctoringEventPayload,
  ProctoringEventItem,
  ProctoringSummary,
} from "./types";

export async function sendProctoringEvent(
  attemptId: number,
  payload: ProctoringEventPayload | { events: ProctoringEventPayload[] }
): Promise<{ data: ProctoringEventItem | ProctoringEventItem[]; message: string }> {
  return apiClient<{ data: ProctoringEventItem | ProctoringEventItem[]; message: string }>(
    `/exam-attempts/${attemptId}/proctoring-events`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getProctoringSummary(
  sessionId: number
): Promise<{ data: ProctoringSummary }> {
  return apiClient<{ data: ProctoringSummary }>(
    `/exam-sessions/${sessionId}/proctoring-summary`
  );
}

export async function getProctoringEvents(
  sessionId: number,
  params?: {
    severity?: string;
    event_type?: string;
    attempt_id?: number;
    page?: number;
    per_page?: number;
  }
): Promise<{ data: ProctoringEventItem[]; meta?: Record<string, unknown> }> {
  const query = new URLSearchParams();
  if (params?.severity) query.set("severity", params.severity);
  if (params?.event_type) query.set("event_type", params.event_type);
  if (params?.attempt_id) query.set("attempt_id", params.attempt_id.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.per_page) query.set("per_page", params.per_page.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient<{ data: ProctoringEventItem[]; meta?: Record<string, unknown> }>(
    `/exam-sessions/${sessionId}/proctoring-events${qs}`
  );
}
