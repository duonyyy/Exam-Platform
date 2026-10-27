import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubjectApi,
  createTopicApi,
  deleteSubjectApi,
  deleteTopicApi,
  getSubjectsApi,
  getSubjectTopicsApi,
  updateSubjectApi,
  updateTopicApi,
} from "./api";

export function useSubjects(search?: string) {
  return useQuery({
    queryKey: ["academic", "subjects", search],
    queryFn: () => getSubjectsApi(search),
  });
}

export function useSubjectTopics(subjectId?: number) {
  return useQuery({
    queryKey: ["academic", "topics", subjectId],
    queryFn: () => (subjectId ? getSubjectTopicsApi(subjectId) : Promise.resolve({ data: [] })),
    enabled: Boolean(subjectId),
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "subjects"] });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateSubjectApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "subjects"] });
    },
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, data }: { subjectId: number; data: any }) =>
      createTopicApi(subjectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["academic", "topics", variables.subjectId] });
      queryClient.invalidateQueries({ queryKey: ["academic", "subjects"] });
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any; subjectId?: number }) =>
      updateTopicApi(id, data),
    onSuccess: (_, variables) => {
      if (variables.subjectId) {
        queryClient.invalidateQueries({ queryKey: ["academic", "topics", variables.subjectId] });
      }
      queryClient.invalidateQueries({ queryKey: ["academic", "subjects"] });
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; subjectId?: number }) => deleteTopicApi(id),
    onSuccess: (_, variables) => {
      if (variables.subjectId) {
        queryClient.invalidateQueries({ queryKey: ["academic", "topics", variables.subjectId] });
      }
      queryClient.invalidateQueries({ queryKey: ["academic", "subjects"] });
    },
  });
}
