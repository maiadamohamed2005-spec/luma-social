"use client";

import { useMutation } from "@tanstack/react-query";

import {
  generateAIPost,
  type GeneratePostData,
} from "@/api/ai";

import { useAuth } from "@/context/AuthContext";

export const useGeneratePost = () => {
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: (
      data: GeneratePostData
    ) => {
      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      return generateAIPost(
        token,
        data
      );
    },
  });

  return {
    generatePost:
      mutation.mutateAsync,

    generatedPost:
      mutation.data?.content ?? null,

    isGenerating:
      mutation.isPending,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
};