import { apiFetch } from "@/lib/api";

export type Message = {
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

export type MessagesPage = {
    data: Message[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export const getMessages = async (
    token: string,
    conversationId: number,
    page: number = 1
): Promise<MessagesPage> => {
    return apiFetch(
        `/conversations/${conversationId}/messages?page=${page}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const sendMessage = async (
    token: string,
    conversationId: number,
    body: string
): Promise<{ data: Message }> => {
    return apiFetch(
        `/conversations/${conversationId}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                body,
            }),
        }
    );
};


export const updateMessage = async (
    token: string,
    messageId: number,
    body: string
): Promise<{ data: Message }> => {
    return apiFetch(
        `/messages/${messageId}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                body,
            }),
        }
    );
};

export const deleteMessage = async (
    token: string,
    messageId: number
): Promise<{ message: string }> => {
    return apiFetch(
        `/messages/${messageId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};