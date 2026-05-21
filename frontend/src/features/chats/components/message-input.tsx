"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/features/chats/use-chat-mutations";

interface MessageInputProps {
    chatId: string;
}

export function MessageInput({ chatId }: MessageInputProps) {
    const [content, setContent] = useState("");
    const sendMessage = useSendMessage();

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!content.trim() || sendMessage.isPending) return;

        sendMessage.mutate(
            { chatId, content: content.trim() },
            { onSuccess: () => setContent("") },
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 px-4 py-3 border-t border-border shrink-0"
        >
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="resize-none flex-1"
            />
            <Button
                type="submit"
                size="icon"
                disabled={!content.trim() || sendMessage.isPending}
            >
                <Send />
                <span className="sr-only">Send</span>
            </Button>
        </form>
    );
}
