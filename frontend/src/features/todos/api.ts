import { apiClient } from "@/api/client";
import {
    todoSchema,
    paginatedTodosSchema,
    type CreateTodoInput,
    type UpdateTodoInput,
} from "@/features/todos/schemas";

export const todosApi = {
    async list(page: number = 0, size: number = 10) {
        const { data } = await apiClient.get("/todos", {
            params: { page, size },
        });
        return paginatedTodosSchema.parse(data);
    },

    async get(id: string) {
        const { data } = await apiClient.get(`/todos/${id}`);
        return todoSchema.parse(data);
    },

    async create(input: CreateTodoInput) {
        const { data } = await apiClient.post("/todos", input);
        return todoSchema.parse(data);
    },

    async update(id: string, input: UpdateTodoInput) {
        const { data } = await apiClient.put(`/todos/${id}`, input);
        return todoSchema.parse(data);
    },

    async delete(id: string) {
        await apiClient.delete(`/todos/${id}`);
    },
};
