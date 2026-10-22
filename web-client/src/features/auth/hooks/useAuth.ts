import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserApi, loginApi, logoutApi } from "../api";
import { LoginCredentials, User } from "../types";
import { useRouter } from "next/navigation";

export const AUTH_QUERY_KEY = ["auth", "currentUser"];

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getCurrentUserApi,
    staleTime: 5 * 60 * 1000,
    retry: false,
    select: (res) => res.data,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, { data: response.data.user });
      const user = response.data.user;

      if (user.role === "student") {
        router.push("/student/exams");
      } else if (user.role === "teacher") {
        router.push("/teacher");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push("/login");
    },
  });
}
