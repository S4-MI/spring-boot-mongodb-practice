"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChats } from "@/features/chats/use-chats";
import { CreateChatDialog } from "./create-chat-dialog";
import type { Chat } from "@/features/chats/schemas";

interface ChatListProps {
    selectedChatId: string | null;
    onSelect: (chat: Chat) => void;
}

export function ChatList({ selectedChatId, onSelect }: ChatListProps) {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useChats(page);

    if (data && data.content.length === 0 && page > 0) {
        setPage(page - 1);
    }

    const chats = data?.content ?? [];
    const pageInfo = data?.page;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <h2 className="text-sm font-semibold">Chats</h2>
                <CreateChatDialog />
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="space-y-2 p-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-lg" />
                        ))}
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground py-12">
                        <MessageSquare className="size-8 opacity-30" />
                        <p className="text-sm">No chats yet.</p>
                    </div>
                ) : (
                    <ul className="p-2 space-y-1">
                        {chats.map((chat) => (
                            <li key={chat.id}>
                                <button
                                    onClick={() => onSelect(chat)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                                        selectedChatId === chat.id
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-muted"
                                    }`}
                                >
                                    <p className="text-sm font-medium truncate">{chat.name}</p>
                                    {chat.description && (
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {chat.description}
                                        </p>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {pageInfo && pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between px-3 py-2 border-t border-border shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 0}
                    >
                        <ChevronLeft />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        {page + 1} / {pageInfo.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= pageInfo.totalPages - 1}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            )}
        </div>
    );
}
