import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000, // 30s — adjust per query as needed
                gcTime: 5 * 60 * 1000, // 5min cache retention
                refetchOnWindowFocus: false,
                retry: (failureCount, error) => {
                    // Don't retry on auth errors — the interceptor handles refresh,
                    // and if refresh failed we want to surface that immediately
                    if (error instanceof AxiosError) {
                        const status = error.response?.status;
                        if (
                            status === 401 ||
                            status === 403 ||
                            status === 404
                        ) {
                            return false;
                        }
                    }
                    return failureCount < 2;
                },
            },
            mutations: {
                retry: false,
            },
        },
    });
}
