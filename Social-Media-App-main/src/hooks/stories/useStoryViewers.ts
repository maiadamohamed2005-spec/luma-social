"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoryViewers } from "@/api/stories";
import { useAuth } from "@/context/AuthContext";

export const useStoryViewers = (
  storyId: number | null,
  enabled = true
) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: [
      "story-viewers",
      storyId,
    ],

    queryFn: () => {
      if (!token || !storyId) {
        throw new Error(
          "Authentication required."
        );
      }

      return getStoryViewers(
        token,
        storyId
      );
    },

    enabled:
      Boolean(token) &&
      Boolean(storyId) &&
      enabled,
  });
};