import { downloadFileApi } from "@/lib/api-client";
import { ExamExportParams } from "./types";

/**
 * Download examination session scoreboard and analytics as a 3-sheet Excel workbook.
 */
export async function downloadSessionExcelApi(sessionId: number | string): Promise<void> {
  return downloadFileApi(
    `/api/proxy/exam-sessions/${sessionId}/export/excel`,
    `bang_diem_ca_thi_${sessionId}.xlsx`
  );
}

/**
 * Download examination session official protocol and attendance sheet as an A4 landscape PDF.
 */
export async function downloadSessionPdfApi(sessionId: number | string): Promise<void> {
  return downloadFileApi(
    `/api/proxy/exam-sessions/${sessionId}/export/pdf`,
    `bien_ban_thi_${sessionId}.pdf`
  );
}

/**
 * Download official exam paper as an A4 portrait PDF (with or without answers/paper answer sheet).
 */
export async function downloadExamPdfApi(
  examId: number | string,
  includeAnswers: boolean = false
): Promise<void> {
  return downloadFileApi(
    `/api/proxy/exams/${examId}/export/pdf`,
    `de_thi_${examId}.pdf`,
    { include_answers: includeAnswers ? 1 : 0 }
  );
}
