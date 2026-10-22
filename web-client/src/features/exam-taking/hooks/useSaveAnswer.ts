import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveAnswerApi } from "../api";
import { SaveAnswerPayload } from "../types";
import { EXAM_ATTEMPT_QUERY_KEY } from "./useExamAttempt";

export function useSaveAnswer(attemptId: number | string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveAnswerPayload) => {
      if (!attemptId) throw new Error("Missing attemptId");
      return saveAnswerApi(attemptId, payload);
    },
    onSuccess: (response, variables) => {
      // Invalidate or update attempt answers cache
      queryClient.setQueryData([...EXAM_ATTEMPT_QUERY_KEY, String(attemptId)], (old: any) => {
        if (!old?.data) return old;

        const updatedAnswers = [...old.data.answers];
        const existingIdx = updatedAnswers.findIndex(
          (a) => a.question_id === variables.question_id
        );

        if (existingIdx >= 0) {
          updatedAnswers[existingIdx] = {
            ...updatedAnswers[existingIdx],
            selected_options: variables.selected_options,
            updated_at: new Date().toISOString(),
          };
        } else {
          updatedAnswers.push({
            question_id: variables.question_id,
            selected_options: variables.selected_options,
            updated_at: new Date().toISOString(),
          });
        }

        return {
          ...old,
          data: {
            ...old.data,
            answers: updatedAnswers,
          },
        };
      });
    },
  });
}
