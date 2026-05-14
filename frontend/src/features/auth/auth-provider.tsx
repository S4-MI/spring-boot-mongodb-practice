"use client";

import { registerAuthFailureHandler } from "@/api/client";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { tokenStorage } from "@/features/auth/token-storage";
import { useEffect, type ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
    const setUser = useAuthStore((s) => s.setUser);
    const setStatus = useAuthStore((s) => s.setStatus);
    const logout = useAuthStore((s) => s.logout);

    useEffect(() => {
        // Register the logout callback with the axios client
        registerAuthFailureHandler(logout);

        // On mount: check if we have tokens and try to fetch the user
        // If access token is expired, the interceptor will refresh automatically
        async function initAuth() {
            const accessToken = tokenStorage.getAccessToken();
            if (!accessToken) {
                setStatus("unauthenticated");
                return;
            }

            try {
                const user = await authApi.me();
                setUser(user);
            } catch {
                // /me failed even after refresh attempt — tokens are invalid
                logout();
            }
        }

        initAuth();
    }, [logout, setStatus, setUser]);

    return <>{children}</>;
}
