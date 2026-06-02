"use client";

import { useMutation } from "@tanstack/react-query";

import { loginUser, registerUser } from "@/lib/api/auth";
import type { RegisterUserInput } from "@streamflow/validation";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (input: RegisterUserInput) => {
      await registerUser(input);
      return loginUser({ email: input.email, password: input.password });
    },
  });
}
