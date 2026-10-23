import {
  TaskCreateRequest,
  TaskResponse,
  TaskResumeRequest,
  AgentHealthResponse,
} from "./types";

/**
 * Call ExamOps Agent via Next.js first-party proxy (/api/examops/...)
 */
export async function createAgentTask(payload: TaskCreateRequest): Promise<TaskResponse> {
  const response = await fetch("/api/examops/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || errorData?.message || "Không thể khởi tạo tác vụ Agent.");
  }

  return response.json();
}

export async function getAgentTask(threadId: string): Promise<TaskResponse> {
  const response = await fetch(`/api/examops/api/v1/tasks/${threadId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || errorData?.message || "Không thể tải thông tin tác vụ Agent.");
  }

  return response.json();
}

export async function resumeAgentTask(
  threadId: string,
  payload: TaskResumeRequest
): Promise<TaskResponse> {
  const response = await fetch(`/api/examops/api/v1/tasks/${threadId}/resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || errorData?.message || "Không thể gửi quyết định phê duyệt.");
  }

  return response.json();
}

export async function getAgentHealth(): Promise<AgentHealthResponse> {
  const response = await fetch("/api/examops/health", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return {
      status: "degraded",
      version: "0.0.0",
      environment: "unknown",
      model_provider: "none",
    };
  }

  return response.json();
}

/**
 * Materialize approved blueprint into Core API database (/api/proxy/exams/from-blueprint)
 */
export async function createExamFromBlueprint(
  payload: import("./types").StoreExamFromBlueprintPayload
): Promise<{ data: import("./types").GeneratedExamData }> {
  const response = await fetch("/api/proxy/exams/from-blueprint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        errorData?.detail ||
        "Không thể tạo đề thi từ bản đề xuất blueprint."
    );
  }

  return response.json();
}

/**
 * Audit readiness of an exam from Core API (/api/proxy/exams/{id}/readiness-review)
 */
export async function getExamReadinessReview(
  examId: number
): Promise<{ data: import("./types").ExamReadinessReviewData }> {
  const response = await fetch(`/api/proxy/exams/${examId}/readiness-review`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        errorData?.detail ||
        "Không thể thẩm định độ sẵn sàng của đề thi."
    );
  }

  return response.json();
}

