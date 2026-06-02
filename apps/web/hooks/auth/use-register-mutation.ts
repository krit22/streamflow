"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginUser, registerUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth-store";
import type { RegisterUserInput } from "@streamflow/validation";

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (input: RegisterUserInput) => {
      await registerUser(input);
      return loginUser({ email: input.email, password: input.password });
    },
    onSuccess: (data) => {
      setUser(data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
