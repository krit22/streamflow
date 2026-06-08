import { AuthUser } from "@/lib/apiClient";

export interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
}

export const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};
