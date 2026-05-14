import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi } from "@/features/todos/api";
import { todoKeys } from "@/features/todos/use-todos";
import type {
    CreateTodoInput,
    UpdateTodoInput,
} from "@/features/todos/schemas";

export function useCreateTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateTodoInput) => todosApi.create(input),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: todoKeys.lists() });
        },
    });
}

export function useUpdateTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
            todosApi.update(id, input),
        onSuccess: (updated) => {
            qc.invalidateQueries({ queryKey: todoKeys.lists() });
            qc.setQueryData(todoKeys.detail(updated.id), updated);
        },
    });
}

export function useDeleteTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => todosApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: todoKeys.lists() });
        },
    });
}
