"use client";

import { useEffect, useRef } from "react";
import { useEcho } from "@/hooks/shared/useEcho";

export type RealtimeMessage = {
  id: number;
  body: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  created_at: string;
  updated_at: string;
};

type UseConversationChannelProps = {
  conversationId: number | null;
  onMessage: (message: RealtimeMessage) => void;
};

export const useConversationChannel = ({
  conversationId,
  onMessage,
}: UseConversationChannelProps) => {
  const echo = useEcho();

  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!conversationId || !echo) {
      return;
    }

    const channelName = `conversation.${conversationId}`;

    const channel = echo.private(channelName);

    channel.listen(".message.sent", (message: RealtimeMessage) => {
      onMessageRef.current(message);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [conversationId, echo]);
};
