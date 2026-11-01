import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest } from "@/api/auth";
import type { ForgotPasswordData } from "@/types/auth";

const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) =>
      forgotPasswordRequest(data),
  });
};

export default useForgotPassword;