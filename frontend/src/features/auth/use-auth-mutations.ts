import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { tokenStorage } from "@/features/auth/token-storage";
import type { LoginInput, RegisterInput } from "@/features/auth/schemas";

export function useLogin() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: async (input: LoginInput) => {
            const tokens = await authApi.login(input);
            console.log("Received tokens:", tokens);

            tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
            const user = await authApi.me();

            console.log("Received user:", user);
            return { user, tokens };
        },
        onSuccess: ({ user, tokens }) => {
            setAuth(user, tokens.accessToken, tokens.refreshToken);
            router.push("/todos");
        },
    });
}

export function useRegister() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: async (input: RegisterInput) => {
            const tokens = await authApi.register(input);
            tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
            const user = await authApi.me();
            return { user, tokens };
        },
        onSuccess: ({ user, tokens }) => {
            setAuth(user, tokens.accessToken, tokens.refreshToken);
            router.push("/todos");
        },
    });
}

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: async () => {},
        onSettled: () => {
            logout();
            router.push("/login");
        },
    });
}
