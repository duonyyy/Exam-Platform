import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminUserApi,
  getAdminAuditLogsApi,
  getAdminDashboardStatsApi,
  getAdminUsersApi,
  updateAdminUserApi,
} from "./api";

export function useAdminUsers(params?: {
  search?: string;
  role?: string;
  is_active?: boolean;
  per_page?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsersApi(params),
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateAdminUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminDashboardStatsApi,
    refetchInterval: 30000,
  });
}

export function useAdminAuditLogs(params?: { per_page?: number }) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => getAdminAuditLogsApi(params),
    refetchInterval: 15000,
  });
}
