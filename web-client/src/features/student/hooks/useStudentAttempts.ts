import { useQuery } from "@tanstack/react-query";
import { getStudentAttemptsApi } from "../api";

export function useStudentAttempts() {
  return useQuery({
    queryKey: ["student", "attempts"],
    queryFn: getStudentAttemptsApi,
  });
}
