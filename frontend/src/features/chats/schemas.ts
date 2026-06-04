import { z } from "zod";

export const pageInfoSchema = z.object({
    size: z.number(),
    number: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
});

export const chatSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    creatorId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const messageTypeSchema = z.enum(["text", "system"]).default("text");

export const messageSchema = z.object({
    id: z.string(),
    chatId: z.string(),
    senderId: z.string(),
    content: z.string(),
    type: messageTypeSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const chatListEventSchema = z.object({
    type: z.enum(["CHAT_ADDED", "CHAT_REMOVED", "CHAT_UPDATED"]),
    data: z.object({ chatId: z.string() }),
});

export const roleSchema = z.enum(["member", "moderator", "admin"]);

export const participantUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
});

export const participantSchema = z.object({
    id: z.string(),
    chatId: z.string(),
    user: participantUserSchema,
    role: roleSchema,
    createdAt: z.string(),
});

export const paginatedChatsSchema = z.object({
    content: z.array(chatSchema),
    page: pageInfoSchema,
});

export const paginatedMessagesSchema = z.object({
    content: z.array(messageSchema),
    page: pageInfoSchema,
});

export const createChatSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be at most 30 characters"),
    description: z.string().max(500).optional(),
});

export const updateChatSchema = z.object({
    name: z.string().min(2).max(30).optional(),
    description: z.string().max(500).optional(),
});

export const sendMessageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty").max(2000),
});

export const addParticipantSchema = z.object({
    userId: z.string().min(1),
    role: roleSchema,
});

export const updateParticipantRoleSchema = z.object({
    role: roleSchema,
});

export type Chat = z.infer<typeof chatSchema>;
export type Message = z.infer<typeof messageSchema>;
export type MessageType = z.infer<typeof messageTypeSchema>;
export type ChatListEvent = z.infer<typeof chatListEventSchema>;
export type Participant = z.infer<typeof participantSchema>;
export type ParticipantUser = z.infer<typeof participantUserSchema>;
export type Role = z.infer<typeof roleSchema>;
export type PageInfo = z.infer<typeof pageInfoSchema>;
export type PaginatedChats = z.infer<typeof paginatedChatsSchema>;
export type PaginatedMessages = z.infer<typeof paginatedMessagesSchema>;
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type UpdateChatInput = z.infer<typeof updateChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type AddParticipantInput = z.infer<typeof addParticipantSchema>;
export type UpdateParticipantRoleInput = z.infer<
    typeof updateParticipantRoleSchema
>;
