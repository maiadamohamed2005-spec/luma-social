
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import useLogin from "@/hooks/auth/useLogin";
import { ApiError } from "@/lib/api";

import type {
  LoginCredentials,
  LoginValidationErrors,
} from "@/types/auth";

import PasswordField from "@/components/common/PasswordField";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();

  const {
    mutateAsync: loginMutation,
    isPending,
  } = useLogin();

  const [form, setForm] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginValidationErrors>({});
  const [message, setMessage] = useState("");

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
      const data = await loginMutation(form);

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
    <main className="auth-slide-right min-h-screen bg-[#fff8fc] p-4 sm:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-[#f3e4ef] bg-white shadow-[0_20px_60px_rgba(151,105,151,0.10)] sm:min-h-[calc(100vh-4rem)]">

        {/* Illustration */}
        <section className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-[#fce7f3] via-[#fdf2f8] to-[#ede9fe] lg:flex">
          <div className="absolute left-10 top-10 max-w-xs">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9874a8]">
              Your space to connect
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-[#513b5b]">
              Share moments.
              <br />
              Stay connected.
            </h2>
          </div>

          <Image
            src="/auth-illustration.png"
            alt="Social media illustration"
            fill
            priority
            sizes="50vw"
            className="object-contain p-8 pt-40"
          />

          <div className="absolute bottom-10 left-10 right-10 rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur-sm">
            <p className="text-sm leading-6 text-[#765e80]">
              A little place for your thoughts, stories, and people.
            </p>
          </div>
        </section>

        {/* Login form */}
        <section className="flex w-full items-center justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-md">

            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight text-[#9b6bb0] transition hover:text-[#805293]"
            >
             Luma SOCIAL
              <span className="ml-1 text-[#e8a4c5]">.</span>
            </Link>

            <div className="mb-8 mt-10">
              <h1 className="text-3xl font-bold tracking-tight text-[#49364f]">
                Welcome back
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#96849b]">
                Sign in to catch up with your community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#624c69]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`w-full rounded-2xl border bg-[#fffafd] px-4 py-3.5 text-sm text-[#49364f] outline-none transition placeholder:text-[#b6a6bb] focus:bg-white focus:ring-4 ${
                    errors.email
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-[#f0e2ef] focus:border-[#c5a3d6] focus:ring-[#f7edf9]"
                  }`}
                />

                {errors.email && (
                  <p className="text-xs text-red-500">
                    {errors.email[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <PasswordField
                id="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password?.[0]}
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#9b6bb0] transition hover:text-[#805293] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="mt-1 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-[#b58acb] to-[#d99cbe] py-3.5 font-semibold text-white shadow-md shadow-[#d9b5d9]/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Logging in..." : "Login"}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                {message}
              </div>
            )}

            <p className="mt-8 text-center text-sm text-[#96849b]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#9b6bb0] transition hover:text-[#805293] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
