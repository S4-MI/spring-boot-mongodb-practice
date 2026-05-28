"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store";
import { messageSchema } from "@/features/chats/schemas";
import type { PaginatedMessages } from "@/features/chats/schemas";
import { chatKeys, useMessages } from "@/features/chats/use-chats";
import { getStompClient } from "@/features/socket/client";
import { useSocket } from "@/features/socket/use-socket";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./message-bubble";

interface Props {
    chatId: string;
}

export function MessageWsList({ chatId }: Props) {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useMessages(chatId, page, 20, false);
    const currentUserId = useAuthStore((s) => s.user?.id);
    const bottomRef = useRef<HTMLDivElement>(null);
    const connected = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (page === 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [data, page]);

    useEffect(() => {
        if (!connected) return;

        const client = getStompClient();
        const subscription = client.subscribe(
            `/topic/chats/${chatId}/messages`,
            (frame) => {
                const parsed = messageSchema.safeParse(JSON.parse(frame.body));
                if (!parsed.success) {
                    console.error(
                        "Failed to parse incoming message:",
                        parsed.error,
                    );
                    return;
                }
                const newMessage = parsed.data;

                // Append to page 0 cache only. Pages > 0 are invalidated so
                // they refetch fresh from the server, avoiding duplicates when
                // WS-injected messages overlap with server-paginated results.
                const page0Key = chatKeys.messages(chatId, 0, 20);
                queryClient.setQueryData<PaginatedMessages>(page0Key, (old) => {
                    if (!old) return old;
                    if (old.content.some((m) => m.id === newMessage.id))
                        return old;

                    const trimmed =
                        old.content.length >= old.page.size
                            ? old.content.slice(1)
                            : old.content;

                    return {
                        ...old,
                        content: [...trimmed, newMessage],
                        page: {
                            ...old.page,
                            totalElements: old.page.totalElements + 1,
                        },
                    };
                });

                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey;
                        return (
                            Array.isArray(key) &&
                            key[0] === "chats" &&
                            key[1] === "messages" &&
                            key[2] === chatId &&
                            typeof key[3] === "object" &&
                            (key[3] as { page: number }).page > 0
                        );
                    },
                });
            },
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [chatId, connected, queryClient]);

    const messages = data?.content ?? [];
    const pageInfo = data?.page;

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {pageInfo && pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-border shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage((p) => p - 1)}
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
                        onClick={() => setPage((p) => p + 1)}
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
