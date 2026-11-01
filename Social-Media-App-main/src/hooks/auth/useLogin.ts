import { useMutation } from "@tanstack/react-query";

import { loginRequest } from "@/api/auth";

import type { LoginCredentials } from "@/types/auth";

const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginRequest(credentials),
  });
};

export default useLogin;