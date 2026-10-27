import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeExamSessionApi,
  createExamApi,
  createExamSessionApi,
  createQuestionApi,
  deleteExamApi,
  deleteQuestionApi,
  getExamApi,
  getExamsApi,
  getExamSessionApi,
  getExamSessionsApi,
  getQuestionsApi,
  getSessionResultsApi,
  publishExamSessionApi,
  updateExamApi,
  updateQuestionApi,
} from "./api";

// Exam Hooks
export function useExams(params?: { subject_id?: number; search?: string }) {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: () => getExamsApi(params),
  });
}

export function useExam(id?: number) {
  return useQuery({
    queryKey: ["exams", id],
    queryFn: () => (id ? getExamApi(id) : Promise.resolve({ data: null as any })),
    enabled: Boolean(id),
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExamApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateExamApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExamApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}

// Question Bank Hooks
export function useQuestions(params?: {
  subject_id?: number;
  topic_id?: number;
  search?: string;
  status?: string;
  type?: string;
  difficulty?: string;
  per_page?: number;
}) {
  return useQuery({
    queryKey: ["questions", params],
    queryFn: () => getQuestionsApi(params),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateQuestionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

// Exam Sessions Hooks
export function useExamSessions(params?: { exam_id?: number; status?: string }) {
  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () => getExamSessionsApi(params),
  });
}

export function useExamSession(id?: number) {
  return useQuery({
    queryKey: ["sessions", id],
    queryFn: () => (id ? getExamSessionApi(id) : Promise.resolve({ data: null as any })),
    enabled: Boolean(id),
  });
}

export function useCreateExamSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExamSessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function usePublishExamSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishExamSessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useCloseExamSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closeExamSessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useSessionResults(sessionId?: number) {
  return useQuery({
    queryKey: ["sessions", sessionId, "results"],
    queryFn: () => (sessionId ? getSessionResultsApi(sessionId) : Promise.resolve({ data: null })),
    enabled: Boolean(sessionId),
  });
}
