import Chat from "@/components/chat/Chat";
import ConversationList from "@/components/chat/ConversationList";

type PageProps = {
    params: Promise<{
        conversationId: string;
    }>;
};

const ChatPage = async ({ params }: PageProps) => {
    const { conversationId } = await params;

    const id = Number(conversationId);

    return (
        <div className="h-screen bg-white p-3 md:p-4">
            <div className="flex h-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <aside className="hidden w-[320px] shrink-0 border-r border-gray-200 bg-white md:block lg:w-[350px]">
                    <ConversationList
                        activeConversationId={id}
                    />
                </aside>

                <main className="min-w-0 flex-1 bg-white">
                    <Chat conversationId={id} />
                </main>
            </div>
        </div>
    );
};

export default ChatPage;