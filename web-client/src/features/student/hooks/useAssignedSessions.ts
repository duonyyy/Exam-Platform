import { useQuery } from "@tanstack/react-query";
import { getAssignedSessionsApi } from "../api";

export const ASSIGNED_SESSIONS_QUERY_KEY = ["student", "assigned-sessions"];

export function useAssignedSessions(status?: string) {
  return useQuery({
    queryKey: [...ASSIGNED_SESSIONS_QUERY_KEY, status],
    queryFn: () => getAssignedSessionsApi(status),
    staleTime: 30 * 1000, // 30 seconds
  });
}
