"use client";

import { useRealtimeConversations } from "@/hooks/messages/useRealtimeConversations";

const RealtimeProvider = () => {
    useRealtimeConversations();

    return null;
};

export default RealtimeProvider;