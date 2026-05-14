"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";

export function GuestLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const status = useAuthStore((s) => s.status);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/todos");
        }
    }, [status, router]);

    if (status === "loading") {
        return null;
    }

    if (status === "authenticated") {
        return null;
    }

    return <>{children}</>;
}
