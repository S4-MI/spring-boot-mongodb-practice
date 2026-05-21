"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useParticipants } from "@/features/chats/use-chats";
import { useAddParticipant, useRemoveParticipant } from "@/features/chats/use-chat-mutations";
import { useAuthStore } from "@/features/auth/store";
import { UserPicker } from "./user-picker";
import type { UserProfile } from "@/features/chats/api";

interface ParticipantsPanelProps {
    chatId: string;
    creatorId: string;
}

export function ParticipantsPanel({ chatId, creatorId }: ParticipantsPanelProps) {
    const [open, setOpen] = useState(false);
    const [addingUser, setAddingUser] = useState(false);
    const { data: participants, isLoading } = useParticipants(chatId);
    const addParticipant = useAddParticipant();
    const removeParticipant = useRemoveParticipant();
    const currentUserId = useAuthStore((s) => s.user?.id);

    const isCreator = currentUserId === creatorId;
    const participantUserIds = participants?.map((p) => p.user.id) ?? [];

    const handleAddUser = (user: UserProfile) => {
        addParticipant.mutate(
            { chatId, input: { userId: user.id, role: "member" } },
            { onSuccess: () => setAddingUser(false) },
        );
    };

    const handleRemove = (userId: string) => {
        removeParticipant.mutate({ chatId, userId });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                <Users />
                Participants
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Participants</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : (
                        <ul className="divide-y divide-border rounded-md border border-border">
                            {participants?.map((p) => (
                                <li key={p.id} className="flex items-center justify-between px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium">{p.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.user.email}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{p.role}</p>
                                    </div>
                                    {isCreator && p.user.id !== currentUserId && (
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleRemove(p.user.id)}
                                            disabled={removeParticipant.isPending}
                                        >
                                            {removeParticipant.isPending ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <Trash2 />
                                            )}
                                            <span className="sr-only">Remove</span>
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {isCreator && (
                        <>
                            {addingUser ? (
                                <div className="flex flex-col gap-2">
                                    <UserPicker
                                        excludeUserIds={participantUserIds}
                                        onSelect={handleAddUser}
                                        isPending={addParticipant.isPending}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setAddingUser(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAddingUser(true)}
                                >
                                    <Plus />
                                    Add participant
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
