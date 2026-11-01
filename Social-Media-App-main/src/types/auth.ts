export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
  token: string;
};

export type UserResponse = {
  user: AuthUser;
};

export type RegisterData = {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ResetPasswordData = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};

export type PasswordResetResponse = {
  message: string;
};

export type ForgotPasswordValidationErrors = Partial<
  Record<keyof ForgotPasswordData, string[]>
>;

export type ResetPasswordValidationErrors = Partial<
  Record<keyof ResetPasswordData, string[]>
>;

export type RegisterValidationErrors = Partial<
  Record<keyof RegisterData, string[]>
>;

export type LoginValidationErrors = Partial<
  Record<keyof LoginCredentials, string[]>
>;