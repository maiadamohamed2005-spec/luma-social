"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Conversation } from "@/types/conversation";
import {
  useUserChannel,
  type ReceivedMessage,
} from "@/hooks/notifications/useUserChannel";

import { useAuth } from "@/context/AuthContext";

export const useRealtimeConversations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleMessage = useCallback(
    (message: ReceivedMessage) => {
      queryClient.setQueryData<Conversation[]>(
        ["conversations"],
        (oldConversations) => {
          if (!oldConversations) {
            return oldConversations;
          }

          return oldConversations
            .map((conversation) => {
              if (conversation.id !== message.conversation_id) {
                return conversation;
              }

              return {
                ...conversation,

                last_message: {
                  id: message.id,
                  body: message.body,
                  user_id: message.user_id,
                  created_at: message.created_at,
                },

                unread_count: conversation.unread_count + 1,

                updated_at: message.created_at,
              };
            })
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
            );
        },
      );
    },
    [queryClient],
  );

  useUserChannel({
    userId: user?.id ?? null,
    onMessage: handleMessage,
  });
};
