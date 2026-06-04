"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "./message-bubble";
import { useAuthStore } from "@/features/auth/store";
import type { PaginatedMessages } from "@/features/chats/schemas";

interface MessageListViewProps {
    data: PaginatedMessages | undefined;
    isLoading: boolean;
    page: number;
    onPageChange: (page: number) => void;
}

export function MessageListView({
    data,
    isLoading,
    page,
    onPageChange,
}: MessageListViewProps) {
    const messages = data?.content ?? [];
    const pageInfo = data?.page;
    const currentUserId = useAuthStore((s) => s.user?.id);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (page === 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [data, page]);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {pageInfo && pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-border shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 0}
                    >
                        <ChevronLeft />
                        Newer
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {page + 1} of {pageInfo.totalPages}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= pageInfo.totalPages - 1}
                    >
                        Older
                        <ChevronRight />
                    </Button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className={`h-10 w-2/3 rounded-2xl ${i % 2 === 0 ? "" : "ml-auto"}`}
                            />
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">
                        No messages yet. Say hello!
                    </p>
                ) : (
                    messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={message.senderId === currentUserId}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
