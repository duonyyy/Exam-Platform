import { useQuery } from "@tanstack/react-query";
import { getExamAttemptApi } from "../api";

export const EXAM_ATTEMPT_QUERY_KEY = ["exam-attempt"];

export function useExamAttempt(attemptId: number | string | undefined) {
  return useQuery({
    queryKey: [...EXAM_ATTEMPT_QUERY_KEY, String(attemptId)],
    queryFn: () => getExamAttemptApi(attemptId!),
    enabled: Boolean(attemptId),
    staleTime: 10 * 1000,
    select: (res) => res.data,
  });
}
