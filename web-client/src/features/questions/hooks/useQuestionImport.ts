import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  downloadQuestionTemplateApi,
  validateQuestionsExcelApi,
  importQuestionsExcelApi,
} from "../api";
import {
  QuestionValidationResponse,
  QuestionImportResponse,
} from "../types";

export const QUESTIONS_QUERY_KEY = ["questions"] as const;

export interface UploadExcelPayload {
  file: File;
  topicId?: number;
}

/**
 * Hook to download question authoring template (.xlsx)
 */
export function useDownloadQuestionTemplate() {
  return useMutation({
    mutationFn: (topicId?: number) => downloadQuestionTemplateApi(topicId),
  });
}

/**
 * Hook to dry-run validate questions in uploaded Excel file
 */
export function useValidateQuestionsExcel() {
  return useMutation<QuestionValidationResponse, Error, UploadExcelPayload>({
    mutationFn: ({ file, topicId }) => validateQuestionsExcelApi(file, topicId),
  });
}

/**
 * Hook to bulk import verified questions into the question bank
 */
export function useImportQuestionsExcel() {
  const queryClient = useQueryClient();

  return useMutation<QuestionImportResponse, Error, UploadExcelPayload>({
    mutationFn: ({ file, topicId }) => importQuestionsExcelApi(file, topicId),
    onSuccess: () => {
      // Invalidate questions query to trigger auto-refetch in management views
      queryClient.invalidateQueries({ queryKey: QUESTIONS_QUERY_KEY });
    },
  });
}
