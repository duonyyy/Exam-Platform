import { apiClient } from "@/lib/api-client";

export interface SubjectItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  created_by: number;
  owner_teacher_id?: number;
  creator?: { id: number; name: string; email: string };
  owner_teacher?: { id: number; name: string; email: string };
  topics_count?: number;
}

export interface TopicItem {
  id: number;
  subject_id: number;
  name: string;
  description?: string;
  questions_count?: number;
}

export async function getSubjectsApi(search?: string): Promise<{ data: SubjectItem[] }> {
  return apiClient<{ data: SubjectItem[] }>("/api/proxy/subjects", {
    method: "GET",
    params: search ? { search } : undefined,
  });
}

export async function getSubjectTopicsApi(subjectId: number): Promise<{ data: TopicItem[] }> {
  return apiClient<{ data: TopicItem[] }>(`/api/proxy/subjects/${subjectId}/topics`, {
    method: "GET",
  });
}

export async function createSubjectApi(data: {
  code: string;
  name: string;
  description?: string;
  owner_teacher_id?: number;
}): Promise<{ data: SubjectItem }> {
  return apiClient<{ data: SubjectItem }>("/api/proxy/subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSubjectApi(
  id: number,
  data: { code?: string; name?: string; description?: string; owner_teacher_id?: number }
): Promise<{ data: SubjectItem }> {
  return apiClient<{ data: SubjectItem }>(`/api/proxy/subjects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteSubjectApi(id: number): Promise<void> {
  return apiClient<void>(`/api/proxy/subjects/${id}`, {
    method: "DELETE",
  });
}

export async function createTopicApi(
  subjectId: number,
  data: { name: string; description?: string }
): Promise<{ data: TopicItem }> {
  return apiClient<{ data: TopicItem }>(`/api/proxy/subjects/${subjectId}/topics`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTopicApi(
  id: number,
  data: { name?: string; description?: string }
): Promise<{ data: TopicItem }> {
  return apiClient<{ data: TopicItem }>(`/api/proxy/topics/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTopicApi(id: number): Promise<void> {
  return apiClient<void>(`/api/proxy/topics/${id}`, {
    method: "DELETE",
  });
}
