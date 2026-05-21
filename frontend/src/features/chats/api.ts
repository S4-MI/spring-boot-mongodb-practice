import { apiClient } from "@/api/client";
import {
    chatSchema,
    messageSchema,
    participantSchema,
    paginatedChatsSchema,
    paginatedMessagesSchema,
    type CreateChatInput,
    type UpdateChatInput,
    type AddParticipantInput,
    type UpdateParticipantRoleInput,
} from "@/features/chats/schemas";
import { z } from "zod";

export const profileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
});

export type UserProfile = z.infer<typeof profileResponseSchema>;

export const chatsApi = {
    // ── Chats ────────────────────────────────────────────────────────────────

    async listChats(page: number = 0, size: number = 20) {
        const { data } = await apiClient.get("/chats", { params: { page, size, sort: "createdAt,desc" } });
        return paginatedChatsSchema.parse(data);
    },

    async createChat(input: CreateChatInput) {
        const { data } = await apiClient.post("/chats", input);
        return chatSchema.parse(data);
    },

    async getChat(chatId: string) {
        const { data } = await apiClient.get(`/chats/${chatId}`);
        return chatSchema.parse(data);
    },

    async updateChat(chatId: string, input: UpdateChatInput) {
        const { data } = await apiClient.put(`/chats/${chatId}`, input);
        return chatSchema.parse(data);
    },

    async deleteChat(chatId: string) {
        await apiClient.delete(`/chats/${chatId}`);
    },

    // ── Messages ─────────────────────────────────────────────────────────────

    async listMessages(chatId: string, page: number = 0, size: number = 50) {
        const { data } = await apiClient.get(`/chats/${chatId}/messages`, {
            params: { page, size, sort: "createdAt,asc" },
        });
        return paginatedMessagesSchema.parse(data);
    },

    async sendMessage(chatId: string, content: string) {
        const { data } = await apiClient.post(`/chats/${chatId}/messages`, { content });
        return messageSchema.parse(data);
    },

    async editMessage(chatId: string, messageId: string, content: string) {
        const { data } = await apiClient.patch(`/chats/${chatId}/messages/${messageId}`, { content });
        return messageSchema.parse(data);
    },

    async deleteMessage(chatId: string, messageId: string) {
        await apiClient.delete(`/chats/${chatId}/messages/${messageId}`);
    },

    // ── Participants ──────────────────────────────────────────────────────────

    async listParticipants(chatId: string) {
        const { data } = await apiClient.get(`/chats/${chatId}/participants`);
        return z.array(participantSchema).parse(data);
    },

    async addParticipant(chatId: string, input: AddParticipantInput) {
        const { data } = await apiClient.post(`/chats/${chatId}/participants`, input);
        return participantSchema.parse(data);
    },

    async updateParticipantRole(chatId: string, userId: string, input: UpdateParticipantRoleInput) {
        const { data } = await apiClient.patch(`/chats/${chatId}/participants/${userId}`, input);
        return participantSchema.parse(data);
    },

    async removeParticipant(chatId: string, userId: string) {
        await apiClient.delete(`/chats/${chatId}/participants/${userId}`);
    },
};

export const usersApi = {
    async listUsers(search?: string, page: number = 0, size: number = 20) {
        const { data } = await apiClient.get("/users", { params: { search, page, size } });
        return z.object({
            content: z.array(profileResponseSchema),
            page: z.object({
                size: z.number(),
                number: z.number(),
                totalElements: z.number(),
                totalPages: z.number(),
            }),
        }).parse(data);
    },
};
