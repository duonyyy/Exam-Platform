import { apiClient, downloadFileApi } from "@/lib/api-client";
import {
  QuestionImportResponse,
  QuestionValidationResponse,
} from "./types";

/**
 * Download standardized Excel template for question bulk authoring.
 */
export async function downloadQuestionTemplateApi(topicId?: number): Promise<void> {
  const params: Record<string, number | undefined> = {};
  if (topicId) {
    params.topic_id = topicId;
  }
  return downloadFileApi(
    "/api/proxy/questions/import/template",
    "exam_platform_questions_template.xlsx",
    params
  );
}

/**
 * Validate questions from uploaded Excel file.
 */
export async function validateQuestionsExcelApi(
  file: File,
  topicId?: number
): Promise<QuestionValidationResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (topicId) {
    formData.append("topic_id", String(topicId));
  }

  return apiClient<QuestionValidationResponse>("/api/proxy/questions/import/validate", {
    method: "POST",
    body: formData,
  });
}

/**
 * Execute bulk import of valid questions into database.
 */
export async function importQuestionsExcelApi(
  file: File,
  topicId?: number
): Promise<QuestionImportResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (topicId) {
    formData.append("topic_id", String(topicId));
  }

  return apiClient<QuestionImportResponse>("/api/proxy/questions/import", {
    method: "POST",
    body: formData,
  });
}
