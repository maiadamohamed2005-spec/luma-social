"use client";

import {
    useMutation,
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";

import {
    updateMessage,
    deleteMessage,
    type Message,
    type MessagesPage,
} from "@/api/messages";

import { useAuth } from "@/context/AuthContext";

export const useMessageMutations = (
    conversationId: number
) => {
    const { token } = useAuth();

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({
            messageId,
            body,
        }: {
            messageId: number;
            body: string;
        }) => {
            if (!token) {
                throw new Error("Authentication required.");
            }

            return updateMessage(
                token,
                messageId,
                body
            );
        },

        onSuccess: (response) => {
            queryClient.setQueryData<
                InfiniteData<MessagesPage>
            >(
                ["messages", conversationId],
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,

                        pages: oldData.pages.map(
                            (page) => ({
                                ...page,

                                data: page.data.map(
                                    (message) =>
                                        message.id ===
                                        response.data.id
                                            ? response.data
                                            : message
                                ),
                            })
                        ),
                    };
                }
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (messageId: number) => {
            if (!token) {
                throw new Error("Authentication required.");
            }

            return deleteMessage(
                token,
                messageId
            );
        },

        onSuccess: (_, messageId) => {
            queryClient.setQueryData<
                InfiniteData<MessagesPage>
            >(
                ["messages", conversationId],
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,

                        pages: oldData.pages.map(
                            (page) => ({
                                ...page,

                                data: page.data.filter(
                                    (message) =>
                                        message.id !==
                                        messageId
                                ),
                            })
                        ),
                    };
                }
            );
        },
    });

    return {
        updateMessage: updateMutation.mutateAsync,
        deleteMessage: deleteMutation.mutateAsync,

        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};