"use client";

import { MessageSquare } from "lucide-react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { ParticipantsPanel } from "./participants-panel";
import type { Chat } from "@/features/chats/schemas";

interface ChatViewProps {
    chat: Chat;
}

export function ChatView({ chat }: ChatViewProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold truncate">{chat.name}</h2>
                    {chat.description && (
                        <p className="text-xs text-muted-foreground truncate">{chat.description}</p>
                    )}
                </div>
                <ParticipantsPanel chatId={chat.id} creatorId={chat.creatorId} />
            </div>

            <MessageList chatId={chat.id} />
            <MessageInput chatId={chat.id} />
        </div>
    );
}

export function ChatViewEmpty() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <MessageSquare className="size-12 opacity-20" />
            <p className="text-sm">Select a chat to start messaging</p>
        </div>
    );
}
