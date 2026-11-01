import ProtectedRoute from "@/components/common/ProtectedRoute";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";

const SettingsPage = () => {
  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-3xl py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account and security settings.
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </ProtectedRoute>
  );
};

export default SettingsPage;