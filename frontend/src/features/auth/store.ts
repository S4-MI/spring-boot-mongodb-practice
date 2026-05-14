import { create } from "zustand";
import type { User } from "@/features/auth/schemas";
import { tokenStorage } from "@/features/auth/token-storage";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
    user: User | null;
    status: AuthStatus;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
    setStatus: (status: AuthStatus) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    status: "loading", // start as loading until initial refresh check completes

    setAuth: (user, accessToken, refreshToken) => {
        tokenStorage.setTokens(accessToken, refreshToken);
        set({ user, status: "authenticated" });
    },

    setUser: (user) => set({ user, status: "authenticated" }),

    setStatus: (status) => set({ status }),

    logout: () => {
        tokenStorage.clearTokens();
        set({ user: null, status: "unauthenticated" });
    },
}));
