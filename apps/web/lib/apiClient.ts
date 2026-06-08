import axios, { isAxiosError } from "axios";
import { useAuthStore } from "@/store/auth/store";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    withCredentials: true, // Sends secure cookies automatically
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor to handle 401 Unauthorized
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error) && error.response?.status === 401) {
            useAuthStore.getState().clearUser();
        }
        return Promise.reject(error);
    }
);

export type AuthUser = {
    id: string;
    email: string;
    name: string;
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