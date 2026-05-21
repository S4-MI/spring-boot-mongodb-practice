"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "@/features/chats/use-chats";
import type { UserProfile } from "@/features/chats/api";

interface UserPickerProps {
    excludeUserIds?: string[];
    onSelect: (user: UserProfile) => void;
    isPending?: boolean;
}

export function UserPicker({ excludeUserIds = [], onSelect, isPending }: UserPickerProps) {
    const [search, setSearch] = useState("");
    const { data, isLoading } = useUsers(search || undefined);

    const users = (data?.content ?? []).filter((u) => !excludeUserIds.includes(u.id));

    return (
        <div className="flex flex-col gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                />
            </div>

            <div className="max-h-48 overflow-y-auto rounded-md border border-border">
                {isLoading ? (
                    <div className="space-y-1 p-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-9 w-full rounded" />
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        {search ? "No users found." : "No users available."}
                    </p>
                ) : (
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-2 px-3 rounded-none"
                                    onClick={() => onSelect(user)}
                                    disabled={isPending}
                                >
                                    <div className="text-left">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
