export type ExportReportFormat = "excel" | "pdf";

export interface SessionExportParams {
  sessionId: number | string;
}

export interface ExamExportParams {
  examId: number | string;
  includeAnswers?: boolean;
}

export interface ExportReportButtonsProps {
  sessionId?: number | string;
  examId?: number | string;
  sessionTitle?: string;
  examTitle?: string;
  className?: string;
}
