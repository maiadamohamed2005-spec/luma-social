import ConversationList from "@/components/chat/ConversationList";

const ChatPage = () => {
    return (
        <div className="h-screen bg-white p-3 md:p-4">
            <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <ConversationList />
            </div>
        </div>
    );
};

export default ChatPage;