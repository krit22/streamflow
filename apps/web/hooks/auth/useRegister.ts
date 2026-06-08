"use client";

import { apiClient, type AuthUser } from "@/lib/apiClient";
import { useAuthStore } from "@/store/auth/store";
import type { RegisterUserInput } from "@streamflow/validation";
import { useMutation } from "@tanstack/react-query";

type RegisterResponse = {
    success: true;
    data: {
        user: AuthUser;
    };
};

async function registerUser(data: RegisterUserInput) {
    const response = await apiClient.post<RegisterResponse>("/users/register", data);
    return response.data.data.user;
}

export function useRegister() {
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (user) => {
            setUser(user);
        },
    });
}
