"use client";

import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Todo } from "@/features/todos/schemas";
import { useUpdateTodo } from "@/features/todos/use-todo-mutations";

export function EditTodoDialog({ todo }: { todo: Todo }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description ?? "");
    const updateTodo = useUpdateTodo();

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        updateTodo.mutate(
            {
                id: todo.id,
                input: {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    completed: todo.completed,
                },
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    toast.success("Todo updated");
                },
                onError: () => {
                    toast.error("Failed to update todo");
                },
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (o) {
                    setTitle(todo.title);
                    setDescription(todo.description ?? "");
                }
            }}
        >
            <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <Pencil />
                <span className="sr-only">Edit</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Todo</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 pt-1"
                >
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-desc">Description</Label>
                        <Textarea
                            id="edit-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={!title.trim() || updateTodo.isPending}
                        >
                            {updateTodo.isPending && (
                                <Loader2 className="animate-spin" />
                            )}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
