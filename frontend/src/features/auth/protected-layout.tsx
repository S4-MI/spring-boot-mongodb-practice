"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";

export function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const status = useAuthStore((s) => s.status);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>; // your shadcn skeleton goes here
    }

    if (status === "unauthenticated") {
        return null;
    }

    return <>{children}</>;
}
