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
