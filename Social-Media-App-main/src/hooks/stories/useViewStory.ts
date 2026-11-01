"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { viewStory } from "@/api/stories";
import { useAuth } from "@/context/AuthContext";
import type { StoryGroup } from "@/types/story";

export const useViewStory = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (storyId: number) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return viewStory(token, storyId);
    },

    onSuccess: (_, storyId) => {
      queryClient.setQueryData<StoryGroup[]>(
        ["stories"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return oldData.map((group) => {
            const hasStory = group.stories.some(
              (story) => story.id === storyId
            );

            if (!hasStory) {
              return group;
            }

            const updatedStories = group.stories.map(
              (story) =>
                story.id === storyId
                  ? {
                      ...story,
                      is_viewed: true,
                    }
                  : story
            );

            const hasUnseenStories =
              !group.is_current_user &&
              updatedStories.some(
                (story) => !story.is_viewed
              );

            return {
              ...group,
              stories: updatedStories,
              has_unseen_stories: hasUnseenStories,
            };
          });
        }
      );
    },
  });

  return {
    viewStory: mutation.mutateAsync,
    isViewing: mutation.isPending,
  };
};