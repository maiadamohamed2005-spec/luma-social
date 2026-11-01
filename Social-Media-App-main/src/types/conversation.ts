export type ConversationUser = {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
};

export type LastMessage = {
    id: number;
    body: string;
    user_id: number;
    created_at: string;
};

export type Conversation = {
    id: number;
    user: ConversationUser | null;
    last_message: LastMessage | null;
    unread_count: number;
    updated_at: string;
};