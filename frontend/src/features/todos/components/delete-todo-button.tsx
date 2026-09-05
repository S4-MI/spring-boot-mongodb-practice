"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteTodo } from "@/features/todos/use-todo-mutations";

export function DeleteTodoButton({ todoId }: { todoId: string }) {
    const deleteTodo = useDeleteTodo();

    const handleDelete = () => {
        deleteTodo.mutate(todoId, {
            onSuccess: () => toast.success("Todo deleted"),
            onError: () => toast.error("Failed to delete todo"),
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="group/delete hover:bg-destructive/10"
                    />
                }
            >
                <Trash2 className="text-muted-foreground transition-colors group-hover/delete:text-destructive" />
                <span className="sr-only">Delete</span>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete todo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
