"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth-store";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearUser();
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    },
  });
}
