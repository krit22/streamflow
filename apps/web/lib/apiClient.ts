import axios, { isAxiosError } from "axios";
import { useAuthStore } from "@/store/auth/store";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    withCredentials: true, // Sends secure cookies automatically
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for logging
apiClient.interceptors.request.use((config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        withCredentials: config.withCredentials
    });
    return config;
});

// Response interceptor to handle 401 Unauthorized and logging
apiClient.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`, {
            hasData: !!response.data,
            setCookie: response.headers["set-cookie"]
        });
        return response;
    },
    (error) => {
        if (isAxiosError(error)) {
            console.error(`[API Error] ${error.response?.status} ${error.config?.url}`, {
                message: error.message,
                data: error.response?.data
            });
            if (error.response?.status === 401) {
                useAuthStore.getState().clearUser();
            }
        }
        return Promise.reject(error);
    }
);

export type Channel = {
    id: string;
    name: string;
    description: string | null;
    subscriberCount: number;
    createdAt: string;
};

export type AuthUser = {
    id: string;
    email: string;
    name: string;
    channels?: Channel[];
};

type ApiErrorResponse = {
    error?: {
        message?: string;
    };
};

export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong. Please try again."
) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.error?.message ?? fallback;
    }

    return fallback;
}