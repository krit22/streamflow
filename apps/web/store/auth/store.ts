import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { flattenActions } from "../helpers";
import { AuthAction, AuthActionImpl } from "./action";
import { AuthState, initialState } from "./initialState";

export type AuthStore = AuthState & AuthAction;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        ...flattenActions<AuthAction>([new AuthActionImpl(set, get)]),
      }),
      {
        name: "streamflow-auth",
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          user: state.user,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);
