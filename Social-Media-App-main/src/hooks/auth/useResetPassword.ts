import { useMutation } from "@tanstack/react-query";
import { resetPasswordRequest } from "@/api/auth";
import type { ResetPasswordData } from "@/types/auth";

const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordData) =>
      resetPasswordRequest(data),
  });
};

export default useResetPassword;