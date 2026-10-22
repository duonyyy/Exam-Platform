import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitAttemptApi } from "../api";
import { SubmitAttemptPayload } from "../types";
import { EXAM_ATTEMPT_QUERY_KEY } from "./useExamAttempt";
import { ASSIGNED_SESSIONS_QUERY_KEY } from "@/features/student/hooks/useAssignedSessions";

export function useSubmitAttempt(attemptId: number | string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: SubmitAttemptPayload) => {
      if (!attemptId) throw new Error("Missing attemptId");
      const idempotencyKey = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined;
      return submitAttemptApi(attemptId, payload, idempotencyKey);
    },
    onSuccess: (response) => {
      // Invalidate attempt data and assigned sessions
      queryClient.invalidateQueries({ queryKey: EXAM_ATTEMPT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ASSIGNED_SESSIONS_QUERY_KEY });
    },
  });
}
