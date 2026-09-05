"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodos } from "@/features/todos/use-todos";
import { TodoRow } from "./todo-row";
import { CreateTodoDialog } from "./create-todo-dialog";
import { ExportTodosButton } from "./export-todos-button";

export function TodoList() {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useTodos(page);

    // Adjust page if current page is empty (e.g., after deleting the last item)
    if (data && data.content.length === 0 && page > 0) {
        setPage(page - 1);
    }

    const todos = data?.content ?? [];
    const pageInfo = data?.page;
    const remaining = todos.filter((t) => !t.completed).length;

    return (
        <>
            <div className="flex items-end justify-between gap-4 mb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Todos
                    </h1>
                    {!isLoading && (
                        <p className="text-sm text-muted-foreground">
                            {pageInfo?.totalElements ?? todos.length} total
                            {todos.length > 0 && ` · ${remaining} open`}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <ExportTodosButton
                        disabled={isLoading || todos.length === 0}
                    />
                    <CreateTodoDialog />
                </div>
            </div>

            {isLoading ? (
                <div className="rounded-xl border border-border bg-card divide-y divide-border">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <Skeleton className="size-4 rounded-sm shrink-0" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    ))}
                </div>
            ) : todos.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
                    <ListTodo className="size-8 text-muted-foreground/60" />
                    <div className="space-y-1">
                        <p className="text-sm font-medium">No todos yet</p>
                        <p className="text-sm text-muted-foreground">
                            Create your first one to get started.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <ul className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
                        {todos.map((todo) => (
                            <TodoRow key={todo.id} todo={todo} />
                        ))}
                    </ul>

                    {pageInfo && pageInfo.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 0}
                            >
                                <ChevronLeft />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground tabular-nums">
                                Page {page + 1} of {pageInfo.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= pageInfo.totalPages - 1}
                            >
                                Next
                                <ChevronRight />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
