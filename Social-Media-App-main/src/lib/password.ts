export type PasswordChecks = {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  symbol: boolean;
};

export const validatePassword = (
  password: string
): PasswordChecks => {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
};

export const isPasswordValid = (
  password: string
): boolean => {
  return Object.values(
    validatePassword(password)
  ).every(Boolean);
};