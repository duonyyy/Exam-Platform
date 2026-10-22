import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startAttemptApi } from "../api";
import { useRouter } from "next/navigation";
import { EXAM_ATTEMPT_QUERY_KEY } from "@/features/exam-taking/hooks/useExamAttempt";

export function useStartAttempt() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number | string) => startAttemptApi(sessionId),
    onSuccess: (response) => {
      const attempt = response.data;
      queryClient.setQueryData([...EXAM_ATTEMPT_QUERY_KEY, String(attempt.id)], response);
      router.push(`/exam/${attempt.id}`);
    },
  });
}
