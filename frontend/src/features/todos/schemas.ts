import { z } from "zod";

export const todoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    completed: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const pageInfoSchema = z.object({
    size: z.number(),
    number: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
});

export const paginatedTodosSchema = z.object({
    content: z.array(todoSchema),
    page: pageInfoSchema,
});

export const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(1000).optional(),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
    completed: z.boolean().optional(),
});

export const exportFormatSchema = z.enum(["CSV", "MARKDOWN", "JSON"]);

export const TODO_EXPORT_FORMATS = [
    { value: "CSV", label: "CSV", extension: "csv" },
    { value: "MARKDOWN", label: "Markdown", extension: "md" },
    { value: "JSON", label: "JSON", extension: "json" },
] as const satisfies ReadonlyArray<{
    value: TodoExportFormat;
    label: string;
    extension: string;
}>;

export type TodoExportFormat = z.infer<typeof exportFormatSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type PageInfo = z.infer<typeof pageInfoSchema>;
export type PaginatedTodos = z.infer<typeof paginatedTodosSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
