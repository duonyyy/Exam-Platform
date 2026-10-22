"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAgentTask,
  getAgentTask,
  resumeAgentTask,
  getAgentHealth,
} from "../api";
import { TaskCreateRequest, TaskResumeRequest } from "../types";

export const EXAM_OPS_QUERY_KEYS = {
  health: ["examops", "health"] as const,
  task: (threadId: string | null) => ["examops", "task", threadId] as const,
};

export function useAgentHealth() {
  return useQuery({
    queryKey: EXAM_OPS_QUERY_KEYS.health,
    queryFn: getAgentHealth,
    staleTime: 1000 * 30, // 30s
    retry: 1,
  });
}

export function useAgentTask(threadId: string | null) {
  return useQuery({
    queryKey: EXAM_OPS_QUERY_KEYS.task(threadId),
    queryFn: () => (threadId ? getAgentTask(threadId) : Promise.reject("No threadId")),
    enabled: !!threadId,
    staleTime: 1000 * 5,
  });
}

export function useCreateAgentTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskCreateRequest) => createAgentTask(payload),
    onSuccess: (data) => {
      if (data.thread_id) {
        queryClient.setQueryData(EXAM_OPS_QUERY_KEYS.task(data.thread_id), data);
      }
    },
  });
}

export function useResumeAgentTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      threadId,
      payload,
    }: {
      threadId: string;
      payload: TaskResumeRequest;
    }) => resumeAgentTask(threadId, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(EXAM_OPS_QUERY_KEYS.task(variables.threadId), data);
    },
  });
}
