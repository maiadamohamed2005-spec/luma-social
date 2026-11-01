import { apiFetch } from "@/lib/api";

import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserResponse,
  ForgotPasswordData,
  ResetPasswordData,
  PasswordResetResponse,
} from "@/types/auth";

export const loginRequest = (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerRequest = (data: RegisterData): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getCurrentUserRequest = (token: string): Promise<UserResponse> => {
  return apiFetch<UserResponse>("/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logoutRequest = (token: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>("/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const forgotPasswordRequest = (
  data: ForgotPasswordData
): Promise<PasswordResetResponse> => {
  return apiFetch<PasswordResetResponse>("/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const resetPasswordRequest = (
  data: ResetPasswordData
): Promise<PasswordResetResponse> => {
  return apiFetch<PasswordResetResponse>("/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};