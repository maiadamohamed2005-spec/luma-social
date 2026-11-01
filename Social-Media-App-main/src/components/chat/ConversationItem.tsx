"use client";

import type { Conversation } from "@/types/conversation";

type ConversationItemProps = {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
};

const ConversationItem = ({
    conversation,
    isActive,
    onClick,
}: ConversationItemProps) => {
    const user = conversation.user;

    const avatarUrl = user?.avatar
        ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${user.avatar}`
        : null;

    const lastMessage =
        conversation.last_message?.body ??
        "No messages yet";

    const messageTime =
        conversation.last_message
            ? new Date(
                  conversation.last_message.created_at
              ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
              })
            : "";

    const hasUnread =
        conversation.unread_count > 0;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group flex w-full items-center gap-3 px-3 py-3 text-left transition ${
                isActive
                    ? "bg-purple-50"
                    : "hover:bg-gray-50"
            }`}
        >
            {/* Avatar */}

            <div className="relative shrink-0">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={
                                user?.name ??
                                "User"
                            }
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-purple-100 font-semibold text-purple-700">
                            {user?.name
                                ?.charAt(0)
                                .toUpperCase() ??
                                "?"}
                        </div>
                    )}
                </div>

                {/* Online indicator */}

                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
            </div>

            {/* Conversation Info */}

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <h3
                        className={`truncate text-sm ${
                            hasUnread
                                ? "font-bold text-gray-900"
                                : "font-semibold text-gray-800"
                        }`}
                    >
                        {user?.name ??
                            "Unknown user"}
                    </h3>

                    {messageTime && (
                        <span
                            className={`shrink-0 text-[11px] ${
                                hasUnread
                                    ? "font-medium text-purple-600"
                                    : "text-gray-400"
                            }`}
                        >
                            {messageTime}
                        </span>
                    )}
                </div>

                <div className="mt-1 flex items-center gap-2">
                    <p
                        className={`min-w-0 flex-1 truncate text-sm ${
                            hasUnread
                                ? "font-medium text-gray-800"
                                : "text-gray-500"
                        }`}
                    >
                        {lastMessage}
                    </p>

                    {hasUnread && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 px-1.5 text-[11px] font-bold text-white">
                            {conversation.unread_count >
                            99
                                ? "99+"
                                : conversation.unread_count}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ConversationItem;