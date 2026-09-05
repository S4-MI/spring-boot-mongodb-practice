import { apiClient } from "@/api/client";
import {
    todoSchema,
    paginatedTodosSchema,
    type CreateTodoInput,
    type TodoExportFormat,
    type UpdateTodoInput,
} from "@/features/todos/schemas";

/** Pull the server-provided filename out of a Content-Disposition header. */
function parseFileName(header: string | undefined, fallback: string) {
    if (!header) return fallback;

    const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header);
    if (encoded) return decodeURIComponent(encoded[1]);

    const plain = /filename="?([^";]+)"?/i.exec(header);
    return plain ? plain[1] : fallback;
}

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

    async export(format: TodoExportFormat) {
        const response = await apiClient.get("/todos/export", {
            params: { format },
            responseType: "blob",
        });

        return {
            blob: response.data as Blob,
            fileName: parseFileName(
                response.headers["content-disposition"],
                `todos.${format.toLowerCase()}`,
            ),
        };
    },
};
