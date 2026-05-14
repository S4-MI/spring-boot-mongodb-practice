import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(2, "Name is required"),
});

export const tokenPairSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
});

export const loginResponseSchema = tokenPairSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TokenPair = z.infer<typeof tokenPairSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
