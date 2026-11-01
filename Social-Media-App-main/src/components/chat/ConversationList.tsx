"use client";

import { useRouter } from "next/navigation";

import { useConversations } from "@/hooks/messages/useConversations";

import ConversationItem from "./ConversationItem";

type ConversationListProps = {
    activeConversationId?: number;
};

const ConversationList = ({
    activeConversationId,
}: ConversationListProps) => {
    const router = useRouter();

    const {
        data: conversations,
        isLoading,
        isError,
    } = useConversations();

    const handleConversationClick = (
        conversationId: number
    ) => {
        router.push(
            `/chat/${conversationId}`
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-full flex-col">
                <div className="border-b px-5 py-5">
                    <div className="h-6 w-36 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="space-y-2 p-3">
                    {[1, 2, 3, 4].map(
                        (item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 p-3"
                            >
                                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />

                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center px-6 text-center">
                <div>
                    <p className="font-medium text-gray-800">
                        Failed to load conversations.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    if (!conversations?.length) {
        return (
            <div className="flex h-full flex-col">
                <div className="border-b px-5 py-5">
                    <h2 className="text-xl font-bold text-gray-900">
                        Messages
                    </h2>
                </div>

                <div className="flex flex-1 items-center justify-center px-6 text-center">
                    <div>
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-2xl">
                            💬
                        </div>

                        <h3 className="font-semibold text-gray-900">
                            No conversations yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Start a conversation
                            with a friend.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-white">

            {/* Header */}

            <div className="shrink-0 border-b px-5 py-5">
                <h2 className="text-xl font-bold text-gray-900">
                    Messages
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {conversations.length}{" "}
                    {conversations.length ===
                        1
                        ? "conversation"
                        : "conversations"}
                </p>
            </div>

            {/* Conversations */}

            <div className="min-h-0 flex-1 overflow-y-auto py-2">
                {conversations.map(
                    (conversation) => (
                        <ConversationItem
                            key={
                                conversation.id
                            }
                            conversation={
                                conversation
                            }
                            isActive={
                                conversation.id ===
                                activeConversationId
                            }
                            onClick={() =>
                                handleConversationClick(
                                    conversation.id
                                )
                            }
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default ConversationList;