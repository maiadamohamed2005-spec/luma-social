"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import useForgotPassword from "@/hooks/auth/useForgotPassword";
import { ApiError } from "@/lib/api";

import type {
  ForgotPasswordData,
  ForgotPasswordValidationErrors,
} from "@/types/auth";

const ForgotPassword = () => {
  const [form, setForm] = useState<ForgotPasswordData>({
    email: "",
  });

  const [errors, setErrors] =
    useState<ForgotPasswordValidationErrors>({});

  const [message, setMessage] = useState("");

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    setMessage("");

    forgotPasswordMutation.mutate(form, {
      onSuccess: (data) => {
        setMessage(data.message);
      },

      onError: (error) => {
        if (error instanceof ApiError) {
          setErrors(error.errors);
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your email address and we&apos;ll send you a link
          to reset your password.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            placeholder="Enter your email"
            autoComplete="email"
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

          {errors.email?.[0] && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.email[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
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
          {forgotPasswordMutation.isPending
            ? "Sending..."
            : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="
            text-sm font-medium text-purple-600
            transition-colors
            hover:text-purple-800
            hover:underline
          "
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;