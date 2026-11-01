import { useMutation } from "@tanstack/react-query";

import { registerRequest } from "@/api/auth";

import type { RegisterData } from "@/types/auth";

const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      registerRequest(data),
  });
};

export default useRegister;