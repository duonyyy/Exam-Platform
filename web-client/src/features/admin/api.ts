import { apiClient } from "@/lib/api-client";

export interface AdminUserItem {
  id: number;
  code: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  role_label: string;
  is_active: boolean;
  email_verified_at?: string;
  created_at?: string;
}

export interface AdminDashboardStats {
  users: {
    total: number;
    students: number;
    teachers: number;
    admins: number;
    inactive: number;
  };
  academics: {
    total_subjects: number;
    total_topics: number;
    total_questions: number;
  };
  exams: {
    total_blueprints: number;
    total_sessions: number;
    active_sessions: number;
  };
  attempts: {
    total_attempts: number;
    submitted: number;
    in_progress: number;
  };
  security_alerts_today: number;
}

export interface AdminAuditLogItem {
  id: string;
  category: "ai_copilot" | "proctoring";
  action: string;
  actor?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  description: string;
  severity: "info" | "low" | "medium" | "high";
  timestamp: string;
}

export async function getAdminUsersApi(params?: {
  search?: string;
  role?: string;
  is_active?: boolean;
  per_page?: number;
  page?: number;
}): Promise<{ data: AdminUserItem[]; meta?: any }> {
  return apiClient<{ data: AdminUserItem[]; meta?: any }>("/api/proxy/admin/users", {
    method: "GET",
    params,
  });
}

export async function createAdminUserApi(data: any): Promise<{ data: AdminUserItem }> {
  return apiClient<{ data: AdminUserItem }>("/api/proxy/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminUserApi(id: number, data: any): Promise<{ data: AdminUserItem }> {
  return apiClient<{ data: AdminUserItem }>(`/api/proxy/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getAdminDashboardStatsApi(): Promise<{ data: AdminDashboardStats }> {
  return apiClient<{ data: AdminDashboardStats }>("/api/proxy/admin/dashboard-stats", {
    method: "GET",
  });
}

export async function getAdminAuditLogsApi(params?: { per_page?: number }): Promise<{ data: AdminAuditLogItem[]; meta?: any }> {
  return apiClient<{ data: AdminAuditLogItem[]; meta?: any }>("/api/proxy/admin/audit-logs", {
    method: "GET",
    params,
  });
}
