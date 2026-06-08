"use client";

import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/auth/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function logoutUser() {
    await apiClient.post("/users/logout");
}

export function useLogout() {
    const queryClient = useQueryClient();
    const clearUser = useAuthStore((state) => state.clearUser);

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            clearUser();
            queryClient.clear();
            window.location.href = "/login";
        },
    });
}
