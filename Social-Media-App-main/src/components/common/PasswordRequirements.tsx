import {
  type PasswordChecks,
} from "@/lib/password";

type PasswordRequirementsProps = {
  checks: PasswordChecks;
};

const requirements: {
  key: keyof PasswordChecks;
  label: string;
}[] = [
  {
    key: "minLength",
    label: "At least 8 characters",
  },
  {
    key: "uppercase",
    label: "Uppercase letter",
  },
  {
    key: "lowercase",
    label: "Lowercase letter",
  },
  {
    key: "number",
    label: "At least one number",
  },
  {
    key: "symbol",
    label: "At least one symbol",
  },
];

const PasswordRequirements = ({
  checks,
}: PasswordRequirementsProps) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Password requirements
      </p>

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        {requirements.map(
          ({ key, label }) => {
            const isValid =
              checks[key];

            return (
              <div
                key={key}
                className={`flex items-center gap-2 ${
                  isValid
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    isValid
                      ? "bg-green-100"
                      : "bg-gray-200"
                  }`}
                >
                  ✓
                </span>

                <span>{label}</span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default PasswordRequirements;