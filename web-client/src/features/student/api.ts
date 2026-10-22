import { apiClient } from "@/lib/api-client";
import { AssignedSessionsResponse } from "./types";
import { ExamAttemptDetail } from "../exam-taking/types";

export async function getAssignedSessionsApi(status?: string): Promise<AssignedSessionsResponse> {
  return apiClient<AssignedSessionsResponse>("/api/proxy/student/assigned-sessions", {
    method: "GET",
    params: status ? { status } : undefined,
  });
}

export async function startAttemptApi(sessionId: number | string): Promise<{ data: ExamAttemptDetail }> {
  return apiClient<{ data: ExamAttemptDetail }>(`/api/proxy/exam-sessions/${sessionId}/attempts`, {
    method: "POST",
  });
}
