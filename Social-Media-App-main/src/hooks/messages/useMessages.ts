"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "@/api/messages";
import { useAuth } from "@/context/AuthContext";

export const useMessages = (
    conversationId: number | null
) => {
    const { token } = useAuth();

    return useInfiniteQuery({
        queryKey: ["messages", conversationId],

        queryFn: ({ pageParam }) =>
            getMessages(
                token!,
                conversationId!,
                pageParam
            ),

        enabled: !!token && !!conversationId,

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {
            if (
                lastPage.current_page <
                lastPage.last_page
            ) {
                return lastPage.current_page + 1;
            }

            return undefined;
        },
    });
};