"use client";

import { ChatList } from "@/features/chats/components/chat-list";
import { ChatView, ChatViewEmpty } from "@/features/chats/components/chat-view";
import { MessageWsList } from "@/features/chats-ws/components/message-list";
import { Chat } from "@/features/chats/schemas";
import { useState } from "react";

export default function ChatsWsPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    return (
        <div className="flex h-[calc(100vh-49px)]">
            <aside className="w-64 shrink-0 border-r border-border flex flex-col">
                <ChatList
                    selectedChatId={selectedChat?.id ?? null}
                    onSelect={setSelectedChat}
                />
            </aside>
            <main className="flex-1 flex flex-col min-w-0">
                {selectedChat ? (
                    <ChatView key={selectedChat.id} chat={selectedChat} messageList={<MessageWsList chatId={selectedChat.id} />} />
                ) : (
                    <ChatViewEmpty />
                )}
            </main>
        </div>
    );
}
