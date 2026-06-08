"use client";

import { apiClient, type AuthUser } from "@/lib/apiClient";
import { useAuthStore } from "@/store/auth/store";
import type { LoginUserInput } from "@streamflow/validation";
import { useMutation } from "@tanstack/react-query";

type LoginResponse = {
    success: true;
    data: {
        user: AuthUser;
    };
};

async function loginUser(data: LoginUserInput) {
    const response = await apiClient.post<LoginResponse>("/users/login", data);
    return response.data.data.user;
}

export function useLogin() {
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (user) => {
            setUser(user);
        },
    });
}
