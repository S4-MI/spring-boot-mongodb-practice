import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { todosApi } from "@/features/todos/api";
import type { TodoExportFormat } from "@/features/todos/schemas";

function saveBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

export function useExportTodos() {
    return useMutation({
        mutationFn: (format: TodoExportFormat) => todosApi.export(format),
        onSuccess: ({ blob, fileName }) => {
            saveBlob(blob, fileName);
            toast.success(`Exported to ${fileName}`);
        },
        onError: () => {
            toast.error("Failed to export todos");
        },
    });
}
