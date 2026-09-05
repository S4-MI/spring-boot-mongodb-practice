"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
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
        <li className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
            <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                className="shrink-0"
            />
            <div className="flex-1 min-w-0">
                <p
                    className={cn(
                        "text-sm font-medium truncate transition-colors",
                        todo.completed &&
                            "line-through text-muted-foreground decoration-muted-foreground/50",
                    )}
                >
                    {todo.title}
                </p>
                {todo.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {todo.description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <EditTodoDialog todo={todo} />
                <DeleteTodoButton todoId={todo.id} />
            </div>
        </li>
    );
}
