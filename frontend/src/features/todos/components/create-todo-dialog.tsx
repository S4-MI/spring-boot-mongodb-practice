"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
import { useCreateTodo } from "@/features/todos/use-todo-mutations";

export function CreateTodoDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const createTodo = useCreateTodo();

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        createTodo.mutate(
            {
                title: title.trim(),
                description: description.trim() || undefined,
            },
            {
                onSuccess: () => {
                    setTitle("");
                    setDescription("");
                    setOpen(false);
                    toast.success("Todo created");
                },
                onError: () => {
                    toast.error("Failed to create todo");
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
                <Plus />
                New
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Todo</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 pt-1"
                >
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="create-title">Title</Label>
                        <Input
                            id="create-title"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="create-desc">Description</Label>
                        <Textarea
                            id="create-desc"
                            placeholder="Optional details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={!title.trim() || createTodo.isPending}
                        >
                            {createTodo.isPending && (
                                <Loader2 className="animate-spin" />
                            )}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
