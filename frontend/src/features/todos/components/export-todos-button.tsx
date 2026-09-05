"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TODO_EXPORT_FORMATS } from "@/features/todos/schemas";
import { useExportTodos } from "@/features/todos/use-export-todos";

export function ExportTodosButton({ disabled }: { disabled?: boolean }) {
    const exportTodos = useExportTodos();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button size="sm" variant="outline" />}
                disabled={disabled || exportTodos.isPending}
            >
                {exportTodos.isPending ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <Download />
                )}
                Export
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Export all as</DropdownMenuLabel>
                    {TODO_EXPORT_FORMATS.map((format) => (
                        <DropdownMenuItem
                            key={format.value}
                            onClick={() => exportTodos.mutate(format.value)}
                        >
                            {format.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
