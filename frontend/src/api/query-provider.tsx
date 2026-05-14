"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { createQueryClient } from "./query-client";

export function QueryProvider({ children }: { children: ReactNode }) {
    // useState ensures the client isn't recreated on re-renders;
    // also makes it per-request safe in Next.js (no cross-request leakage)
    const [queryClient] = useState(() => createQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
