"use client";

import { useEffect, useRef } from "react";
import { useEcho } from "@/hooks/shared/useEcho";

export type ReceivedMessage = {
  id: number;
  conversation_id: number;
  body: string;
  user_id: number;
  created_at: string;
};

type UseUserChannelProps = {
  userId: number | null;
  onMessage: (message: ReceivedMessage) => void;
};

export const useUserChannel = ({ userId, onMessage }: UseUserChannelProps) => {
  const echo = useEcho();

  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!userId || !echo) {
      return;
    }

    const channelName = `App.Models.User.${userId}`;

    const channel = echo.private(channelName);

    channel.listen(".message.received", (message: ReceivedMessage) => {
      onMessageRef.current(message);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [userId, echo]);
};
