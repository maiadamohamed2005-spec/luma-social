"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  error?: string;
};

const PasswordField = ({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div
        className={`flex items-center rounded-xl border bg-slate-50 transition focus-within:bg-white focus-within:ring-2 ${error
            ? "border-red-400 focus-within:border-red-400 focus-within:ring-red-100"
            : "border-slate-200 focus-within:border-purple-400 focus-within:ring-purple-100"
          }`}
      >
        <LockKeyhole className="ml-4 h-4 w-4 shrink-0 text-gray-400" />

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="custom-password-input min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="mr-4 cursor-pointer text-gray-400 transition hover:text-purple-600"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;