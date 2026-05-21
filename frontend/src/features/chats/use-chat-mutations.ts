import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { chatsApi } from "@/features/chats/api";
import { chatKeys } from "@/features/chats/use-chats";
import type {
    CreateChatInput,
    UpdateChatInput,
    AddParticipantInput,
    UpdateParticipantRoleInput,
} from "@/features/chats/schemas";

export function useCreateChat() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateChatInput) => chatsApi.createChat(input),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: chatKeys.lists() });
            toast.success("Chat created");
        },
        onError: () => toast.error("Failed to create chat"),
    });
}

export function useUpdateChat() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, input }: { chatId: string; input: UpdateChatInput }) =>
            chatsApi.updateChat(chatId, input),
        onSuccess: (updated) => {
            qc.invalidateQueries({ queryKey: chatKeys.lists() });
            qc.setQueryData(chatKeys.detail(updated.id), updated);
            toast.success("Chat updated");
        },
        onError: () => toast.error("Failed to update chat"),
    });
}

export function useDeleteChat() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (chatId: string) => chatsApi.deleteChat(chatId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: chatKeys.lists() });
            toast.success("Chat deleted");
        },
        onError: () => toast.error("Failed to delete chat"),
    });
}

export function useSendMessage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
            chatsApi.sendMessage(chatId, content),
        onSuccess: (_, { chatId }) => {
            qc.invalidateQueries({ queryKey: chatKeys.messages(chatId, 0, 50) });
        },
        onError: () => toast.error("Failed to send message"),
    });
}

export function useEditMessage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            messageId,
            content,
        }: {
            chatId: string;
            messageId: string;
            content: string;
        }) => chatsApi.editMessage(chatId, messageId, content),
        onSuccess: (_, { chatId }) => {
            qc.invalidateQueries({ queryKey: chatKeys.messages(chatId, 0, 50) });
            toast.success("Message edited");
        },
        onError: () => toast.error("Failed to edit message"),
    });
}

export function useDeleteMessage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageId }: { chatId: string; messageId: string }) =>
            chatsApi.deleteMessage(chatId, messageId),
        onSuccess: (_, { chatId }) => {
            qc.invalidateQueries({ queryKey: chatKeys.messages(chatId, 0, 50) });
            toast.success("Message deleted");
        },
        onError: () => toast.error("Failed to delete message"),
    });
}

export function useAddParticipant() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, input }: { chatId: string; input: AddParticipantInput }) =>
            chatsApi.addParticipant(chatId, input),
        onSuccess: (_, { chatId }) => {
            qc.invalidateQueries({ queryKey: chatKeys.participants(chatId) });
            toast.success("Participant added");
        },
        onError: () => toast.error("Failed to add participant"),
    });
}

export function useUpdateParticipantRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            userId,
            input,
        }: {
            chatId: string;
            userId: string;
            input: UpdateParticipantRoleInput;
        }) => chatsApi.updateParticipantRole(chatId, userId, input),
        onSuccess: (_, { chatId }) => {
            qc.invalidateQueries({ queryKey: chatKeys.participants(chatId) });
            toast.success("Role updated");
        },
        onError: () => toast.error("Failed to update role"),
    });
}

export function useRemoveParticipant() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
            chatsApi.removeParticipant(chatId, userId),
        onSuccess: (_, { chatId }) => {
            qc.invalidateQueries({ queryKey: chatKeys.participants(chatId) });
            toast.success("Participant removed");
        },
        onError: () => toast.error("Failed to remove participant"),
    });
}
