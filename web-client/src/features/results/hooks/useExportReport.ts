import { useMutation } from "@tanstack/react-query";
import {
  downloadSessionExcelApi,
  downloadSessionPdfApi,
  downloadExamPdfApi,
} from "../api";
import { ExamExportParams } from "../types";

/**
 * Hook to export examination session scoreboard in Excel format
 */
export function useExportSessionExcel() {
  return useMutation({
    mutationFn: (sessionId: number | string) => downloadSessionExcelApi(sessionId),
  });
}

/**
 * Hook to export examination session protocol in PDF format
 */
export function useExportSessionPdf() {
  return useMutation({
    mutationFn: (sessionId: number | string) => downloadSessionPdfApi(sessionId),
  });
}

/**
 * Hook to export official exam paper in PDF format
 */
export function useExportExamPdf() {
  return useMutation({
    mutationFn: ({ examId, includeAnswers }: ExamExportParams) =>
      downloadExamPdfApi(examId, includeAnswers),
  });
}
