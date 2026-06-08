"use client";

import { useAuthStore } from "@/store/auth/store";

/**
 * Convenient hook to access auth state and actions.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  return {
    user,
    isLoggedIn,
    setUser,
    clearUser,
  };
}
