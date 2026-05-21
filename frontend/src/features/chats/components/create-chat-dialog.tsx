"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateChat } from "@/features/chats/use-chat-mutations";

export function CreateChatDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const createChat = useCreateChat();

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        createChat.mutate(
            { name: name.trim(), description: description.trim() || undefined },
            {
                onSuccess: () => {
                    setName("");
                    setDescription("");
                    setOpen(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
                <Plus />
                New Chat
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="chat-name">Name</Label>
                        <Input
                            id="chat-name"
                            placeholder="Chat name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="chat-desc">Description</Label>
                        <Textarea
                            id="chat-desc"
                            placeholder="Optional description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={name.trim().length < 2 || createChat.isPending}
                        >
                            {createChat.isPending && <Loader2 className="animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
