import { todosApi } from "@/features/todos/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const todoKeys = {
    all: ["todos"] as const,
    lists: () => [...todoKeys.all, "list"] as const,
    list: (page: number, size: number) =>
        [...todoKeys.all, "list", { page, size }] as const,
    detail: (id: string) => [...todoKeys.all, "detail", id] as const,
};

export function useTodos(page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: todoKeys.list(page, size),
        queryFn: () => todosApi.list(page, size),
        placeholderData: keepPreviousData,
    });
}

export function useTodo(id: string) {
    return useQuery({
        queryKey: todoKeys.detail(id),
        queryFn: () => todosApi.get(id),
        enabled: Boolean(id),
    });
}
