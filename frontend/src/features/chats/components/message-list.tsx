"use client";

import { useState } from "react";
import { useMessages } from "@/features/chats/use-chats";
import { MessageListView } from "./message-list-view";

interface MessageListProps {
    chatId: string;
}

export function MessageList({ chatId }: MessageListProps) {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useMessages(chatId, page);

    return (
        <MessageListView
            data={data}
            isLoading={isLoading}
            page={page}
            onPageChange={setPage}
        />
    );
}
