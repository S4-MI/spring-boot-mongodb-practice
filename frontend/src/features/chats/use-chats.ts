import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { chatsApi, usersApi } from "@/features/chats/api";

export const chatKeys = {
    all: ["chats"] as const,
    lists: () => [...chatKeys.all, "list"] as const,
    list: (page: number, size: number) =>
        [...chatKeys.all, "list", { page, size }] as const,
    detail: (chatId: string) => [...chatKeys.all, "detail", chatId] as const,
    messages: (chatId: string, page: number, size: number) =>
        [...chatKeys.all, "messages", chatId, { page, size }] as const,
    participants: (chatId: string) =>
        [...chatKeys.all, "participants", chatId] as const,
};

export const userKeys = {
    all: ["users"] as const,
    list: (search: string | undefined, page: number, size: number) =>
        [...userKeys.all, "list", { search, page, size }] as const,
};

export function useChats(page: number = 0, size: number = 20) {
    return useQuery({
        queryKey: chatKeys.list(page, size),
        queryFn: () => chatsApi.listChats(page, size),
        placeholderData: keepPreviousData,
        refetchInterval: 10000,
    });
}

export function useChat(chatId: string) {
    return useQuery({
        queryKey: chatKeys.detail(chatId),
        queryFn: () => chatsApi.getChat(chatId),
        enabled: Boolean(chatId),
    });
}

export function useMessages(
    chatId: string,
    page: number = 0,
    size: number = 50,
    refetchInterval: number | false = 5000,
) {
    return useQuery({
        queryKey: chatKeys.messages(chatId, page, size),
        queryFn: () => chatsApi.listMessages(chatId, page, size),
        enabled: Boolean(chatId),
        placeholderData: keepPreviousData,
        refetchInterval,
    });
}

export function useParticipants(chatId: string) {
    return useQuery({
        queryKey: chatKeys.participants(chatId),
        queryFn: () => chatsApi.listParticipants(chatId),
        enabled: Boolean(chatId),
    });
}

export function useUsers(search?: string, page: number = 0, size: number = 20) {
    return useQuery({
        queryKey: userKeys.list(search, page, size),
        queryFn: () => usersApi.listUsers(search, page, size),
        placeholderData: keepPreviousData,
    });
}
