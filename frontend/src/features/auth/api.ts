import { apiClient } from "@/api/client";
import {
    tokenPairSchema,
    userSchema,
    type LoginInput,
    type RegisterInput,
} from "@/features/auth/schemas";

export const authApi = {
    async login(input: LoginInput) {
        const { data } = await apiClient.post("/auth/login", input);
        return tokenPairSchema.parse(data);
    },

    async register(input: RegisterInput) {
        const { data } = await apiClient.post("/auth/register", input);
        return tokenPairSchema.parse(data);
    },

    async me() {
        const { data } = await apiClient.get("/users/me");
        return userSchema.parse(data);
    },
};
