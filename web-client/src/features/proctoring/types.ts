export type ProctoringEventType =
  | "tab_hidden"
  | "window_blur"
  | "fullscreen_exit"
  | "devtools_opened"
  | "copy_paste_attempt"
  | "multiple_displays";

export type ProctoringSeverity = "low" | "medium" | "high" | "critical";

export interface ProctoringEventPayload {
  event_type: ProctoringEventType;
  occurred_at?: string;
  metadata?: Record<string, unknown>;
}

export interface ProctoringEventItem {
  id: number;
  attempt_id: number;
  student?: {
    id: number;
    name: string;
    email: string;
    code: string | null;
  } | null;
  event_type: ProctoringEventType;
  severity: ProctoringSeverity;
  occurred_at: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
}

export interface TopFlaggedAttempt {
  attempt_id: number;
  student_id: number | null;
  student_name: string | null;
  student_code: string | null;
  total_events: number;
  highest_severity: ProctoringSeverity;
  severities: Record<string, number>;
}

export interface ProctoringSummary {
  exam_session_id: number;
  session_title: string;
  status: string;
  total_events: number;
  flagged_students_count: number;
  severity_breakdown: Record<ProctoringSeverity, number>;
  event_type_breakdown: Record<string, number>;
  top_flagged_attempts: TopFlaggedAttempt[];
}
