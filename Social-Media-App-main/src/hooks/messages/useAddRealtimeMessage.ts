"use client";

import { useCallback } from "react";

import {
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";

import type {
    Message,
    MessagesPage,
} from "@/api/messages";

import type { Conversation } from "@/types/conversation";

export const useAddRealtimeMessage = (
    conversationId: number
) => {
    const queryClient = useQueryClient();

    return useCallback(
        (message: Message) => {
            /*
            |--------------------------------------------------------------------------
            | Update Messages Cache
            |--------------------------------------------------------------------------
            */

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
                            (page, index) => {
                                if (index !== 0) {
                                    return page;
                                }

                                /*
                                |--------------------------------------------------------------------------
                                | Prevent Duplicate Messages
                                |--------------------------------------------------------------------------
                                */

                                const alreadyExists =
                                    page.data.some(
                                        (item) =>
                                            item.id ===
                                            message.id
                                    );

                                if (
                                    alreadyExists
                                ) {
                                    return page;
                                }

                                return {
                                    ...page,

                                    data: [
                                        message,
                                        ...page.data,
                                    ],
                                };
                            }
                        ),
                    };
                }
            );

            /*
            |--------------------------------------------------------------------------
            | Update Conversations Cache
            |--------------------------------------------------------------------------
            */

            queryClient.setQueryData<
                Conversation[]
            >(
                ["conversations"],
                (oldConversations) => {
                    if (
                        !oldConversations
                    ) {
                        return oldConversations;
                    }

                    return oldConversations
                        .map(
                            (conversation) => {
                                if (
                                    conversation.id !==
                                    conversationId
                                ) {
                                    return conversation;
                                }

                                return {
                                    ...conversation,

                                    last_message: {
                                        id:
                                            message.id,
                                        body:
                                            message.body,
                                        user_id:
                                            message.user.id,
                                        created_at:
                                            message.created_at,
                                    },

                                    updated_at:
                                        message.created_at,
                                };
                            }
                        )
                        .sort(
                            (a, b) =>
                                new Date(
                                    b.updated_at
                                ).getTime() -
                                new Date(
                                    a.updated_at
                                ).getTime()
                        );
                }
            );
        },
        [
            queryClient,
            conversationId,
        ]
    );
};