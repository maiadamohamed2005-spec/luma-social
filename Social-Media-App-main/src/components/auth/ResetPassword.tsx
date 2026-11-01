"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import useResetPassword from "@/hooks/auth/useResetPassword";
import { ApiError } from "@/lib/api";

import type { ResetPasswordValidationErrors } from "@/types/auth";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [errors, setErrors] =
    useState<ResetPasswordValidationErrors>({});

  const [message, setMessage] = useState("");

  const resetPasswordMutation = useResetPassword();

  const passwordRequirements = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9\s]/.test(password),
  };

  const passwordsMatch =
    password.length > 0 &&
    password === passwordConfirmation;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    setMessage("");

    resetPasswordMutation.mutate(
      {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onSuccess: (data) => {
          setMessage(data.message);

          setTimeout(() => {
            router.push("/login");
          }, 1500);
        },

        onError: (error) => {
          if (error instanceof ApiError) {
            setErrors(error.errors);
            setMessage(error.message);
          }
        },
      }
    );
  };

  if (!email || !token) {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid Reset Link
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This password reset link is invalid or incomplete.
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 inline-block font-medium text-purple-600 transition-colors hover:text-purple-800 hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Reset Password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your new password below.
        </p>
      </div>

      {message && (
        <div
          className={`mb-5 rounded-lg p-3 text-sm ${resetPasswordMutation.isSuccess
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-600"
            }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            New Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            autoComplete="new-password"
            required
            className="
              w-full rounded-lg border border-gray-300
              px-4 py-2.5 text-gray-900
              outline-none transition
              placeholder:text-gray-400
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-200
            "
          />

          {errors.password?.[0] && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.password[0]}
            </p>
          )}
        </div>

        {password && (
          <div className="space-y-1 text-xs">
            <PasswordRule
              valid={passwordRequirements.minLength}
              text="At least 8 characters"
            />

            <PasswordRule
              valid={passwordRequirements.uppercase}
              text="One uppercase letter"
            />

            <PasswordRule
              valid={passwordRequirements.lowercase}
              text="One lowercase letter"
            />

            <PasswordRule
              valid={passwordRequirements.number}
              text="One number"
            />

            <PasswordRule
              valid={passwordRequirements.symbol}
              text="One special character"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="password_confirmation"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>

          <input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) =>
              setPasswordConfirmation(e.target.value)
            }
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
            className="
              w-full rounded-lg border border-gray-300
              px-4 py-2.5 text-gray-900
              outline-none transition
              placeholder:text-gray-400
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-200
            "
          />

          {errors.password_confirmation?.[0] && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.password_confirmation[0]}
            </p>
          )}

          {passwordConfirmation && (
            <p
              className={`mt-1.5 text-sm ${passwordsMatch
                ? "text-green-600"
                : "text-red-500"
                }`}
            >
              {passwordsMatch
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="
            w-full rounded-lg
            bg-purple-600
            px-4 py-2.5
            font-medium text-white
            transition-all duration-200
            hover:bg-purple-700
            active:bg-purple-800
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {resetPasswordMutation.isPending
            ? "Resetting..."
            : "Reset Password"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-800 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

type PasswordRuleProps = {
  valid: boolean;
  text: string;
};

const PasswordRule = ({
  valid,
  text,
}: PasswordRuleProps) => {
  return (
    <p
      className={
        valid ? "text-green-600" : "text-gray-400"
      }
    >
      {valid ? "✓" : "•"} {text}
    </p>
  );
};

export default ResetPassword;