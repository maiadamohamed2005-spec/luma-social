import { Suspense } from "react";

import ResetPassword from "@/components/auth/ResetPassword";

const ResetPasswordPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Suspense
        fallback={
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        }
      >
        <ResetPassword />
      </Suspense>
    </main>
  );
};

export default ResetPasswordPage;