import { tokenPairSchema } from "@/features/auth/schemas";
import { tokenStorage } from "@/features/auth/token-storage";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshPromise: Promise<string> | null = null;
let onAuthFailure: (() => void) | null = null;

export function registerAuthFailureHandler(handler: () => void) {
    onAuthFailure = handler;
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${API_URL}/auth/token-refresh`, {
        refreshToken,
    });

    const tokens = tokenPairSchema.parse(response.data);
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });
            }
            const newAccessToken = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            tokenStorage.clearTokens();
            onAuthFailure?.();
            return Promise.reject(refreshError);
        }
    },
);
