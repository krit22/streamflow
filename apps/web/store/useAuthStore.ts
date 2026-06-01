import { create } from "zustand";
import type { AuthUser } from "@/lib/api.types";
import { apiClient } from "@/lib/apiClient";

interface AuthState {
  user: AuthUser | null;
  isHydrated: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  logout: async () => {
    try {
      await apiClient.post("/users/logout");
    } finally {
      set({ user: null });
    }
  },
}));
