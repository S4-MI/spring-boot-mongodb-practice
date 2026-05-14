import { isAxiosError } from "axios";

interface ApiErrorBody {
    message?: string;
    details?: string | Record<string, string>;
}

export function parseApiError(error: unknown, fallback = "Something went wrong"): string {
    if (!isAxiosError(error)) return fallback;

    const body = error.response?.data as ApiErrorBody | undefined;
    if (!body) return fallback;

    if (typeof body.details === "object") {
        const first = Object.values(body.details)[0];
        if (first) return first;
    }

    return body.message ?? fallback;
}
