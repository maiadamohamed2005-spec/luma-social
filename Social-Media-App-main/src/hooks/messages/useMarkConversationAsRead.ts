"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markConversationAsRead } from "@/api/conversations";
import type { Conversation } from "@/types/conversation";
import { useAuth } from "@/context/AuthContext";

export const useMarkConversationAsRead = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            conversationId: number
        ) => {
            if (!token) {
                throw new Error(
                    "Authentication required."
                );
            }

            return markConversationAsRead(
                token,
                conversationId
            );
        },

        onSuccess: (_, conversationId) => {
            queryClient.setQueryData<Conversation[]>(
                ["conversations"],
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return oldData.map(
                        (conversation) =>
                            conversation.id ===
                            conversationId
                                ? {
                                      ...conversation,
                                      unread_count: 0,
                                  }
                                : conversation
                    );
                }
            );
        },
    });
};