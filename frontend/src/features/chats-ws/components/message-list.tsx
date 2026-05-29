"use client";

import { useState } from "react";
import { messageSchema } from "@/features/chats/schemas";
import type { PaginatedMessages } from "@/features/chats/schemas";
import { chatKeys, useMessages } from "@/features/chats/use-chats";
import { MessageListView } from "@/features/chats/components/message-list-view";
import { getStompClient } from "@/features/socket/client";
import { useSocket } from "@/features/socket/use-socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface Props {
    chatId: string;
}

export function MessageWsList({ chatId }: Props) {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useMessages(chatId, page, 20, false);
    const connected = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!connected) return;

        const client = getStompClient();
        const subscription = client.subscribe(
            `/topic/chats/${chatId}/messages`,
            (frame) => {
                const parsed = messageSchema.safeParse(JSON.parse(frame.body));
                if (!parsed.success) {
                    console.error("Failed to parse incoming message:", parsed.error);
                    return;
                }
                const newMessage = parsed.data;

                // Append to page 0 cache only. Pages > 0 are invalidated so
                // they refetch fresh from the server, avoiding duplicates when
                // WS-injected messages overlap with server-paginated results.
                const page0Key = chatKeys.messages(chatId, 0, 20);
                queryClient.setQueryData<PaginatedMessages>(page0Key, (old) => {
                    if (!old) return old;
                    if (old.content.some((m) => m.id === newMessage.id)) return old;

                    const trimmed =
                        old.content.length >= old.page.size
                            ? old.content.slice(1)
                            : old.content;

                    return {
                        ...old,
                        content: [...trimmed, newMessage],
                        page: { ...old.page, totalElements: old.page.totalElements + 1 },
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

        return () => subscription.unsubscribe();
    }, [chatId, connected, queryClient]);

    return (
        <MessageListView
            data={data}
            isLoading={isLoading}
            page={page}
            onPageChange={setPage}
        />
    );
}
