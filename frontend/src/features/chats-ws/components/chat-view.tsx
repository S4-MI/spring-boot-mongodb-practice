"use client";

import { MessageWsList } from "@/features/chats-ws/components/message-list";
import { ParticipantsPanel } from "@/features/chats/components/participants-panel";
import type { Chat } from "@/features/chats/schemas";
import { MessageWsInput } from "./message-input";

interface ChatViewProps {
    chat: Chat;
}

export function ChatWsView({ chat }: ChatViewProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold truncate">
                        {chat.name}
                    </h2>
                    {chat.description && (
                        <p className="text-xs text-muted-foreground truncate">
                            {chat.description}
                        </p>
                    )}
                </div>
                <ParticipantsPanel
                    chatId={chat.id}
                    creatorId={chat.creatorId}
                />
            </div>

            <MessageWsList chatId={chat.id} />
            <MessageWsInput chatId={chat.id} />
        </div>
    );
}
