export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  code: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface CurrentUserResponse {
  data: User;
}
