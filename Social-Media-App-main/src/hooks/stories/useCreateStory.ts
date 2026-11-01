"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStory,
  type CreateStoryData,
} from "@/api/stories";

import { useAuth } from "@/context/AuthContext";

export const useCreateStory = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateStoryData) => {
      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      return createStory(token, data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
    },
  });

  return {
    createStory: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};