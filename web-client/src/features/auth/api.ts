import { apiClient } from "@/lib/api-client";
import { CurrentUserResponse, LoginCredentials, LoginResponse } from "./types";

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logoutApi(): Promise<{ success: boolean; message: string }> {
  return apiClient<{ success: boolean; message: string }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUserApi(): Promise<CurrentUserResponse> {
  return apiClient<CurrentUserResponse>("/api/auth/me", {
    method: "GET",
  });
}
