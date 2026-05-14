"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodos } from "@/features/todos/use-todos";
import { TodoRow } from "./todo-row";
import { CreateTodoDialog } from "./create-todo-dialog";

export function TodoList() {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useTodos(page);

    // Adjust page if current page is empty (e.g., after deleting the last item)
    if (data && data.content.length === 0 && page > 0) {
        setPage(page - 1);
    }

    const todos = data?.content ?? [];
    const pageInfo = data?.page;

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Todos
                </h1>
                <CreateTodoDialog />
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-12 w-full rounded-lg"
                        />
                    ))}
                </div>
            ) : todos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                    No todos yet.
                </p>
            ) : (
                <>
                    <ul className="space-y-2">
                        {todos.map((todo) => (
                            <TodoRow key={todo.id} todo={todo} />
                        ))}
                    </ul>

                    {pageInfo && pageInfo.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 0}
                            >
                                <ChevronLeft />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
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
