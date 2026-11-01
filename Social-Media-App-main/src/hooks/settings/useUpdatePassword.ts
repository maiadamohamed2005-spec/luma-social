"use client";

import { useMutation } from "@tanstack/react-query";

import {
  updatePassword,
  type UpdatePasswordData,
} from "@/api/settings";

import { useAuth } from "@/context/AuthContext";

export const useUpdatePassword = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (
      data: UpdatePasswordData
    ) => {
      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      return updatePassword(
        token,
        data
      );
    },
  });
};