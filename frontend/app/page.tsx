"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type Todo = {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
};

async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch(`${API}/api/v1/todos?size=20`);
    if (!res.ok) throw new Error("Failed to load todos");
    const data = await res.json();
    return data.results;
}

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () =>
        fetchTodos()
            .then(setTodos)
            .catch(() => toast.error("Could not load todos"));

    useEffect(() => {
        let cancelled = false;
        fetchTodos()
            .then((data) => {
                if (!cancelled) setTodos(data);
            })
            .catch(() => {
                if (!cancelled) toast.error("Could not load todos");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleToggle = async (todo: Todo) => {
        try {
            const res = await fetch(`${API}/api/v1/todos/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: todo.title,
                    description: todo.description,
                    completed: !todo.completed,
                }),
            });
            if (!res.ok) throw new Error();
            setTodos((prev) =>
                prev.map((t) =>
                    t.id === todo.id ? { ...t, completed: !t.completed } : t,
                ),
            );
        } catch {
            toast.error("Failed to update todo");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API}/api/v1/todos/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error();
            setTodos((prev) => prev.filter((t) => t.id !== id));
            toast.success("Todo deleted");
        } catch {
            toast.error("Failed to delete todo");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-xl px-4 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Todos
                    </h1>
                    <CreateDialog onCreated={load} />
                </div>

                {loading ? (
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
                    <ul className="space-y-2">
                        {todos.map((todo) => (
                            <TodoRow
                                key={todo.id}
                                todo={todo}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdited={load}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function TodoRow({
    todo,
    onToggle,
    onDelete,
    onEdited,
}: {
    todo: Todo;
    onToggle: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onEdited: () => void;
}) {
    return (
        <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggle(todo)}
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
                <EditDialog todo={todo} onEdited={onEdited} />
                <DeleteButton todoId={todo.id} onDelete={onDelete} />
            </div>
        </li>
    );
}

function CreateDialog({ onCreated }: { onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/v1/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                }),
            });
            if (!res.ok) throw new Error();
            setTitle("");
            setDescription("");
            setOpen(false);
            onCreated();
            toast.success("Todo created");
        } catch {
            toast.error("Failed to create todo");
        } finally {
            setSaving(false);
        }
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
                            disabled={!title.trim() || saving}
                        >
                            {saving && <Loader2 className="animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ todo, onEdited }: { todo: Todo; onEdited: () => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description ?? "");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/v1/todos/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                    completed: todo.completed,
                }),
            });
            if (!res.ok) throw new Error();
            setOpen(false);
            onEdited();
            toast.success("Todo updated");
        } catch {
            toast.error("Failed to update todo");
        } finally {
            setSaving(false);
        }
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
                            disabled={!title.trim() || saving}
                        >
                            {saving && <Loader2 className="animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteButton({
    todoId,
    onDelete,
}: {
    todoId: string;
    onDelete: (id: string) => void;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={<Button variant="ghost" size="icon-sm" />}
            >
                <Trash2 className="text-destructive" />
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
                        onClick={() => onDelete(todoId)}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
