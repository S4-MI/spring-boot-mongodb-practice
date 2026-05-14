"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/use-auth-mutations";

export function UserMenu() {
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();

    if (!user) return null;

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
            >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
            </Button>
        </div>
    );
}
