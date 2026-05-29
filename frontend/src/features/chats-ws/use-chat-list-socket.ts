"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { chatKeys } from "@/features/chats/use-chats";
import { chatListEventSchema } from "@/features/chats/schemas";
import { getStompClient } from "@/features/socket/client";
import { useSocket } from "@/features/socket/use-socket";

/**
 * Subscribes to the current user's chat-list topic and invalidates the chat
 * list query on any event (chat added / removed / bumped) for realtime updates.
 */
export function useChatListSocket() {
    const userId = useAuthStore((s) => s.user?.id);
    const connected = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!connected || !userId) return;

        const subscription = getStompClient().subscribe(
            `/topic/users/${userId}/chats`,
            (frame) => {
                const parsed = chatListEventSchema.safeParse(JSON.parse(frame.body));
                if (!parsed.success) {
                    console.error("Failed to parse chat list event:", parsed.error);
                    return;
                }
                queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
            },
        );

        return () => subscription.unsubscribe();
    }, [userId, connected, queryClient]);
}
