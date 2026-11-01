"use client";

import { useMemo } from "react";
import { useConversations } from "./useConversations";

export const useUnreadMessagesCount = () => {
    const { data: conversations, ...query } =
        useConversations();

    const unreadCount = useMemo(() => {
        return (
            conversations?.reduce(
                (total, conversation) =>
                    total + conversation.unread_count,
                0
            ) ?? 0
        );
    }, [conversations]);

    return {
        count: unreadCount,
        ...query,
    };
};