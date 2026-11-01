"use client";

import {
  FormEvent,
  useState,
} from "react";
import { ShieldCheck } from "lucide-react";

import PasswordField from "@/components/common/PasswordField";
import PasswordRequirements from "@/components/common/PasswordRequirements";

import { useUpdatePassword } from "@/hooks/settings/useUpdatePassword";
import {
  isPasswordValid,
  validatePassword,
} from "@/lib/password";
import { ApiError } from "@/lib/api";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const {
    mutateAsync: updatePassword,
    isPending,
    error,
    reset,
  } = useUpdatePassword();

  const passwordChecks =
    validatePassword(password);

  const passwordsMatch =
    password.length > 0 &&
    password === passwordConfirmation;

  const canSubmit =
    currentPassword.length > 0 &&
    isPasswordValid(password) &&
    passwordsMatch &&
    currentPassword !== password &&
    !isPending;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canSubmit) return;

    reset();
    setSuccessMessage("");

    try {
      const response =
        await updatePassword({
          current_password:
            currentPassword,
          password,
          password_confirmation:
            passwordConfirmation,
        });

      setSuccessMessage(
        response.message
      );

      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch {
      // Error is handled by the mutation state.
    }
  };

  const currentPasswordError =
    error instanceof ApiError
      ? error.errors.current_password?.[0]
      : undefined;

  const passwordError =
    error instanceof ApiError
      ? error.errors.password?.[0]
      : undefined;

  const generalError =
    error &&
    !currentPasswordError &&
    !passwordError
      ? error instanceof ApiError
        ? error.message
        : "Unable to update password."
      : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-start gap-3 border-b border-gray-100 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your password to keep
            your account secure.
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-5"
      >
        {/* CURRENT PASSWORD */}
        <PasswordField
          id="current_password"
          name="current_password"
          label="Current Password"
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value
            )
          }
          autoComplete="current-password"
          placeholder="Enter your current password"
          error={currentPasswordError}
        />

        {/* NEW PASSWORD */}
        <PasswordField
          id="password"
          name="password"
          label="New Password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          autoComplete="new-password"
          placeholder="Enter your new password"
          error={passwordError}
        />

        {/* PASSWORD REQUIREMENTS */}
        {password && (
          <PasswordRequirements
            checks={passwordChecks}
          />
        )}

        {/* CONFIRM PASSWORD */}
        <PasswordField
          id="password_confirmation"
          name="password_confirmation"
          label="Confirm New Password"
          value={passwordConfirmation}
          onChange={(event) =>
            setPasswordConfirmation(
              event.target.value
            )
          }
          autoComplete="new-password"
          placeholder="Confirm your new password"
        />

        {/* PASSWORD MATCH ERROR */}
        {passwordConfirmation &&
          !passwordsMatch && (
            <p className="text-sm text-red-500">
              Passwords do not match.
            </p>
          )}

        {/* SAME PASSWORD ERROR */}
        {currentPassword &&
          password &&
          currentPassword === password && (
            <p className="text-sm text-red-500">
              New password must be
              different from the current
              password.
            </p>
          )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* GENERAL ERROR */}
        {generalError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {generalError}
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex justify-end border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={!canSubmit}
            className="cursor-pointer rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
          >
            {isPending
              ? "Updating..."
              : "Update Password"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChangePasswordForm;