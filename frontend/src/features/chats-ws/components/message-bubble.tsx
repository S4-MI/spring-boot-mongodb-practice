"use client";

import { useState } from "react";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Message } from "@/features/chats/schemas";
import { useEditMessage, useDeleteMessage } from "@/features/chats/use-chat-mutations";

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const editMessage = useEditMessage();
    const deleteMessage = useDeleteMessage();

    const handleEditSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!editContent.trim() || editContent === message.content) {
            setEditing(false);
            return;
        }
        editMessage.mutate(
            { chatId: message.chatId, messageId: message.id, content: editContent.trim() },
            { onSuccess: () => setEditing(false) },
        );
    };

    const handleDelete = () => {
        deleteMessage.mutate({ chatId: message.chatId, messageId: message.id });
    };

    return (
        <div className={`flex gap-2 group ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {editing ? (
                    <form onSubmit={handleEditSubmit} className="flex gap-2">
                        <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            autoFocus
                            className="text-sm"
                        />
                        <Button type="submit" size="sm" disabled={editMessage.isPending}>
                            {editMessage.isPending ? <Loader2 className="animate-spin" /> : "Save"}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setEditing(false);
                                setEditContent(message.content);
                            }}
                        >
                            Cancel
                        </Button>
                    </form>
                ) : (
                    <div
                        className={`px-3 py-2 rounded-2xl text-sm ${
                            isOwn
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-muted rounded-tl-sm"
                        }`}
                    >
                        {message.content}
                    </div>
                )}
                <span className="text-xs text-muted-foreground px-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    {message.updatedAt !== message.createdAt && " · edited"}
                </span>
            </div>

            {isOwn && !editing && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                            <MoreHorizontal />
                            <span className="sr-only">Message options</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditing(true)}>
                                <Pencil />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
}
