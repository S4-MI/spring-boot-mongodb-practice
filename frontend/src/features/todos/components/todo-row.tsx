"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { Todo } from "@/features/todos/schemas";
import { useUpdateTodo } from "@/features/todos/use-todo-mutations";
import { EditTodoDialog } from "./edit-todo-dialog";
import { DeleteTodoButton } from "./delete-todo-button";

export function TodoRow({ todo }: { todo: Todo }) {
    const updateTodo = useUpdateTodo();

    const handleToggle = () => {
        updateTodo.mutate({
            id: todo.id,
            input: {
                title: todo.title,
                description: todo.description ?? undefined,
                completed: !todo.completed,
            },
        });
    };

    return (
        <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
            />
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-medium truncate ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                >
                    {todo.title}
                </p>
                {todo.description && (
                    <p className="text-xs text-muted-foreground truncate">
                        {todo.description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <EditTodoDialog todo={todo} />
                <DeleteTodoButton todoId={todo.id} />
            </div>
        </li>
    );
}
