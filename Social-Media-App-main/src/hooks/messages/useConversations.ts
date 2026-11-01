"use client";

import { useQuery } from "@tanstack/react-query";

import { getConversations } from "@/api/conversations";
import { useAuth } from "@/context/AuthContext";

export const useConversations = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["conversations"],

        queryFn: () =>
            getConversations(token!),

        enabled: !!token,
    });
};