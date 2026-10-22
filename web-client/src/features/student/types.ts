export interface SubjectInfo {
  id: number;
  code: string;
  name: string;
}

export interface ExamInfo {
  id: number;
  title: string;
  duration_minutes: number;
  total_points: string;
  pass_score: string;
  subject?: SubjectInfo;
}

export interface AssignedSession {
  id: number;
  exam_id: number;
  title: string;
  status: "draft" | "published" | "in_progress" | "closed" | "cancelled";
  start_at: string;
  end_at: string;
  allow_late_minutes: number;
  max_attempts: number;
  assigned_at?: string;
  exam?: ExamInfo;
}

export interface AssignedSessionsResponse {
  data: AssignedSession[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
