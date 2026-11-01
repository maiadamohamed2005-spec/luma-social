"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { useMessages } from "@/hooks/messages/useMessages";
import { useAuth } from "@/context/AuthContext";
import { sendMessage } from "@/api/messages";

import {
    useConversationChannel,
    type RealtimeMessage,
} from "@/hooks/messages/useConversationChannel";

import { useAddRealtimeMessage } from "@/hooks/messages/useAddRealtimeMessage";
import { useConversations } from "@/hooks/messages/useConversations";
import { useMessageMutations } from "@/hooks/messages/useMessageMutations";
import { useMarkConversationAsRead } from "@/hooks/messages/useMarkConversationAsRead";

type ChatProps = {
    conversationId: number;
};

const Chat = ({ conversationId }: ChatProps) => {
    const { token, user } = useAuth();
    const router = useRouter();
    const [message, setMessage] = useState("");

    const [editingMessageId, setEditingMessageId] =
        useState<number | null>(null);

    const [editingBody, setEditingBody] =
        useState("");

    const [hasNewMessages, setHasNewMessages] =
        useState(false);

    const messagesContainerRef =
        useRef<HTMLDivElement>(null);

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const isInitialLoadRef =
        useRef(true);

    const { data: conversations } =
        useConversations();

    const conversation =
        conversations?.find(
            (item) =>
                item.id === conversationId
        );

    const otherUser = conversation?.user;

    /*
    |--------------------------------------------------------------------------
    | Mark Conversation As Read
    |--------------------------------------------------------------------------
    */

    const {
        mutate: markConversationAsRead,
    } = useMarkConversationAsRead();

    /*
    |--------------------------------------------------------------------------
    | Messages Query
    |--------------------------------------------------------------------------
    */

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMessages(conversationId);

    /*
    |--------------------------------------------------------------------------
    | Message Mutations
    |--------------------------------------------------------------------------
    */

    const addRealtimeMessage =
        useAddRealtimeMessage(
            conversationId
        );

    const {
        updateMessage,
        deleteMessage,
        isUpdating,
        isDeleting,
    } = useMessageMutations(
        conversationId
    );

    /*
    |--------------------------------------------------------------------------
    | Messages
    |--------------------------------------------------------------------------
    */

    const messages =
        data?.pages
            .flatMap((page) => page.data)
            .sort(
                (a, b) =>
                    new Date(
                        a.created_at
                    ).getTime() -
                    new Date(
                        b.created_at
                    ).getTime()
            ) ?? [];

    /*
    |--------------------------------------------------------------------------
    | Mark As Read When Opening Conversation
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!conversationId) {
            return;
        }

        markConversationAsRead(
            conversationId
        );

        setHasNewMessages(false);

        isInitialLoadRef.current = true;
    }, [
        conversationId,
        markConversationAsRead,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Check If User Is Near Bottom
    |--------------------------------------------------------------------------
    */

    const isNearBottom = useCallback(() => {
        const container =
            messagesContainerRef.current;

        if (!container) {
            return true;
        }

        const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;

        return distanceFromBottom < 150;
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Initial Scroll To Bottom
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            !isInitialLoadRef.current ||
            messages.length === 0
        ) {
            return;
        }

        messagesEndRef.current?.scrollIntoView({
            behavior: "auto",
        });

        isInitialLoadRef.current = false;
    }, [
        messages.length,
        conversationId,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Load Older Messages
    |--------------------------------------------------------------------------
    */

    const handleLoadMore = useCallback(
        async () => {
            if (
                !hasNextPage ||
                isFetchingNextPage
            ) {
                return;
            }

            const container =
                messagesContainerRef.current;

            if (!container) {
                return;
            }

            const previousScrollHeight =
                container.scrollHeight;

            const previousScrollTop =
                container.scrollTop;

            await fetchNextPage();

            requestAnimationFrame(() => {
                const newScrollHeight =
                    container.scrollHeight;

                const heightDifference =
                    newScrollHeight -
                    previousScrollHeight;

                container.scrollTop =
                    previousScrollTop +
                    heightDifference;
            });
        },
        [
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Scroll Listener
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const container =
            messagesContainerRef.current;

        if (!container) {
            return;
        }

        const handleScroll = () => {
            if (
                container.scrollTop <= 100 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                handleLoadMore();
            }

            if (isNearBottom()) {
                setHasNewMessages(false);
            }
        };

        container.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            container.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [
        handleLoadMore,
        hasNextPage,
        isFetchingNextPage,
        isNearBottom,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Send Message
    |--------------------------------------------------------------------------
    */

    const handleSend = async () => {
        const trimmedMessage =
            message.trim();

        if (!token || !trimmedMessage) {
            return;
        }

        try {
            await sendMessage(
                token,
                conversationId,
                trimmedMessage
            );

            setMessage("");

            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                });
            });
        } catch (error) {
            console.error(
                "Failed to send message:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Edit Message
    |--------------------------------------------------------------------------
    */

    const handleEditStart = (
        messageId: number,
        body: string
    ) => {
        setEditingMessageId(messageId);
        setEditingBody(body);
    };

    const handleEditCancel = () => {
        setEditingMessageId(null);
        setEditingBody("");
    };

    const handleEditSave = async () => {
        const trimmedBody =
            editingBody.trim();

        if (
            !editingMessageId ||
            !trimmedBody
        ) {
            return;
        }

        try {
            await updateMessage({
                messageId:
                    editingMessageId,
                body: trimmedBody,
            });

            handleEditCancel();
        } catch (error) {
            console.error(
                "Failed to update message:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Message
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (
        messageId: number
    ) => {
        try {
            await deleteMessage(
                messageId
            );
        } catch (error) {
            console.error(
                "Failed to delete message:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Realtime Message
    |--------------------------------------------------------------------------
    */

    const handleRealtimeMessage =
        useCallback(
            (message: RealtimeMessage) => {
                const userIsNearBottom =
                    isNearBottom();

                addRealtimeMessage(message);

                requestAnimationFrame(() => {
                    if (userIsNearBottom) {
                        messagesEndRef.current?.scrollIntoView(
                            {
                                behavior:
                                    "smooth",
                            }
                        );

                        setHasNewMessages(
                            false
                        );

                        markConversationAsRead(
                            conversationId
                        );
                    } else {
                        setHasNewMessages(
                            true
                        );
                    }
                });
            },
            [
                addRealtimeMessage,
                conversationId,
                isNearBottom,
                markConversationAsRead,
            ]
        );

    useConversationChannel({
        conversationId,
        onMessage:
            handleRealtimeMessage,
    });

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-white text-sm text-gray-500">
                Loading messages...
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center bg-white">
                <div className="text-center">
                    <p className="font-medium text-gray-800">
                        Failed to load messages.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <div className="flex h-full flex-col bg-white">
            {/* =========================================================
                Chat Header
            ========================================================= */}

            <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:px-5">

                {/* MOBILE BACK */}
                <button
                    type="button"
                    onClick={() => router.push("/chat")}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 md:hidden"
                    aria-label="Back to conversations"
                >
                    ←
                </button>

                {/* Avatar */}

                <div className="relative shrink-0">
                    <div className="h-11 w-11 overflow-hidden rounded-full bg-purple-100">
                        {otherUser?.avatar ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${otherUser.avatar}`}
                                alt={
                                    otherUser.name
                                }
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center font-semibold text-purple-700">
                                {otherUser?.name
                                    ?.charAt(
                                        0
                                    )
                                    .toUpperCase() ??
                                    "?"}
                            </div>
                        )}
                    </div>

                    {/* Online Indicator */}

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>

                {/* User Info */}

                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-gray-900">
                        {otherUser?.name ??
                            "Chat"}
                    </h2>

                    <p className="mt-0.5 text-xs text-green-600">
                        Active now
                    </p>
                </div>

                {/* Actions */}

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Search messages"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        🔍
                    </button>

                    <button
                        type="button"
                        aria-label="More options"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        ⋮
                    </button>
                </div>
            </div>

            {/* =========================================================
                Messages Container
            ========================================================= */}

            <div
                ref={messagesContainerRef}
                className="relative flex-1 overflow-y-auto bg-gray-50 px-4 py-5"
            >
                <div className="mx-auto flex max-w-4xl flex-col gap-3">
                    {/* =================================================
                        New Messages Button
                    ================================================= */}

                    {hasNewMessages && (
                        <div className="sticky bottom-4 z-20 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    messagesEndRef.current?.scrollIntoView(
                                        {
                                            behavior:
                                                "smooth",
                                        }
                                    );

                                    setHasNewMessages(
                                        false
                                    );

                                    markConversationAsRead(
                                        conversationId
                                    );
                                }}
                                className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-purple-700"
                            >
                                New messages ↓
                            </button>
                        </div>
                    )}

                    {/* =================================================
                        Loading Older Messages
                    ================================================= */}

                    {isFetchingNextPage && (
                        <div className="py-2 text-center text-sm text-gray-500">
                            Loading older
                            messages...
                        </div>
                    )}

                    {/* =================================================
                        Messages
                    ================================================= */}

                    {messages.map((item) => {
                        const isOwnMessage =
                            item.user?.id ===
                            user?.id;

                        const isEditing =
                            editingMessageId ===
                            item.id;

                        const avatarUrl =
                            item.user?.avatar
                                ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.user.avatar}`
                                : null;

                        const messageTime =
                            new Date(
                                item.created_at
                            ).toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            );

                        return (
                            <div
                                key={item.id}
                                className={`flex items-end gap-2 ${isOwnMessage
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >
                                {/* Other User Avatar */}

                                {!isOwnMessage && (
                                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                        {avatarUrl ? (
                                            <img
                                                src={
                                                    avatarUrl
                                                }
                                                alt={
                                                    item
                                                        .user
                                                        .name
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-purple-700">
                                                {item.user.name
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Message */}

                                <div
                                    className={`group flex max-w-[75%] flex-col ${isOwnMessage
                                        ? "items-end"
                                        : "items-start"
                                        }`}
                                >
                                    {/* Edit Mode */}

                                    {isEditing ? (
                                        <div className="min-w-[240px] max-w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                                            <input
                                                type="text"
                                                value={
                                                    editingBody
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setEditingBody(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                onKeyDown={(
                                                    event
                                                ) => {
                                                    if (
                                                        event.key ===
                                                        "Enter"
                                                    ) {
                                                        event.preventDefault();

                                                        handleEditSave();
                                                    }

                                                    if (
                                                        event.key ===
                                                        "Escape"
                                                    ) {
                                                        handleEditCancel();
                                                    }
                                                }}
                                                autoFocus
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50"
                                            />

                                            <div className="mt-3 flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleEditCancel
                                                    }
                                                    disabled={
                                                        isUpdating
                                                    }
                                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleEditSave
                                                    }
                                                    disabled={
                                                        isUpdating ||
                                                        !editingBody.trim()
                                                    }
                                                    className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                                                >
                                                    {isUpdating
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Message Bubble */}

                                            <div
                                                className={`rounded-2xl px-4 py-2.5 shadow-sm ${isOwnMessage
                                                    ? "rounded-br-md bg-purple-600 text-white"
                                                    : "rounded-bl-md bg-white text-gray-900"
                                                    }`}
                                            >
                                                <p className="break-words text-sm leading-6">
                                                    {
                                                        item.body
                                                    }
                                                </p>

                                                <div
                                                    className={`mt-1 text-right text-[10px] ${isOwnMessage
                                                        ? "text-purple-200"
                                                        : "text-gray-400"
                                                        }`}
                                                >
                                                    {
                                                        messageTime
                                                    }
                                                </div>
                                            </div>

                                            {/* Edit / Delete */}

                                            {isOwnMessage && (
                                                <div className="mt-1 flex gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditStart(
                                                                item.id,
                                                                item.body
                                                            )
                                                        }
                                                        disabled={
                                                            isUpdating ||
                                                            isDeleting
                                                        }
                                                        className="text-[11px] font-medium text-gray-400 transition hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting
                                                        }
                                                        className="text-[11px] font-medium text-gray-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isDeleting
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Bottom Anchor */}

                    <div
                        ref={messagesEndRef}
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* =========================================================
                Message Input
            ========================================================= */}

            <div className="shrink-0 border-t border-gray-200 bg-white p-4">
                <div className="mx-auto flex max-w-4xl items-center gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(event) =>
                            setMessage(
                                event.target.value
                            )
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                event.preventDefault();

                                handleSend();
                            }
                        }}
                        placeholder="Write a message..."
                        className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50"
                    />

                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={
                            !message.trim()
                        }
                        className="flex h-11 shrink-0 items-center justify-center rounded-2xl bg-purple-600 px-5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;