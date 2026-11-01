"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import useRegister from "@/hooks/auth/useRegister";

import { ApiError } from "@/lib/api";

import type {
  RegisterData,
  RegisterValidationErrors,
} from "@/types/auth";

import PasswordField from "@/components/common/PasswordField";
import PasswordRequirements from "@/components/common/PasswordRequirements";
import { validatePassword } from "@/lib/password";

const INITIAL_FORM: RegisterData = {
  name: "",
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const Register = () => {
  const router = useRouter();

  const { login } = useAuth();

  const {
    mutateAsync: registerMutation,
    isPending,
  } = useRegister();

  const [form, setForm] =
    useState<RegisterData>(INITIAL_FORM);

  const [errors, setErrors] =
    useState<RegisterValidationErrors>({});

  const [message, setMessage] = useState("");

  const passwordRequirements =
    validatePassword(form.password);

  const passwordsMatch =
    form.password_confirmation.length > 0 &&
    form.password === form.password_confirmation;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setMessage("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrors({});
    setMessage("");

    try {
      const data = await registerMutation(form);

      login(data.token, data.user);

      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          setErrors(error.errors);
          return;
        }

        setMessage(error.message);
        return;
      }

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  return (
    <main className="auth-slide-left min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">

        {/* IMAGE SECTION */}
        <div className="relative hidden w-1/2 lg:block">
          <Image
            src="/auth-illustration.png"
            alt="Social media illustration"
            fill
            priority
            sizes="50vw"
            className="object-contain p-8 xl:p-12"
          />
        </div>

        {/* FORM SECTION */}
        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">

            {/* LOGO */}
            <div className="mb-7">
              <Link
                href="/"
                className="text-2xl font-bold text-purple-600 transition hover:text-purple-700"
              >
                Luma SOCIAL
              </Link>
            </div>

            {/* TITLE */}
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Create an account
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Join Luma SOCIAL and connect with your friends
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >

              {/* NAME */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 ${errors.name
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                    }`}
                />

                {errors.name && (
                  <p className="text-xs text-red-500">
                    {errors.name[0]}
                  </p>
                )}
              </div>

              {/* USERNAME */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 ${errors.username
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                    }`}
                />

                {errors.username && (
                  <p className="text-xs text-red-500">
                    {errors.username[0]}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 ${errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                    }`}
                />

                {errors.email && (
                  <p className="text-xs text-red-500">
                    {errors.email[0]}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <PasswordField
                  id="password"
                  name="password"
                  label="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  error={errors.password?.[0]}
                />

                {form.password && (
                  <PasswordRequirements
                    checks={passwordRequirements}
                  />
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-2">
                <PasswordField
                  id="password_confirmation"
                  name="password_confirmation"
                  label="Confirm Password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  error={errors.password_confirmation?.[0]}
                />

                {form.password_confirmation && (
                  <p
                    className={`text-xs ${passwordsMatch
                        ? "text-green-600"
                        : "text-red-500"
                      }`}
                  >
                    {passwordsMatch
                      ? "✓ Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                disabled={isPending}
                className="mt-2 w-full cursor-pointer rounded-xl bg-purple-600 py-3.5 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
              >
                {isPending
                  ? "Creating account..."
                  : "Register"}
              </button>
            </form>

            {/* GENERAL ERROR */}
            {message && (
              <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                {message}
              </div>
            )}

            {/* LOGIN */}
            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-medium text-purple-600 transition hover:text-purple-700 hover:underline"
              >
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;