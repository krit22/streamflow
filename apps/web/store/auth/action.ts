import { AuthUser } from "@/lib/apiClient";
import { StoreSetter } from "../types";
import { AuthStore } from "./store";

export class AuthActionImpl {
  private readonly set: StoreSetter<AuthStore>;
  private readonly get: () => AuthStore;

  constructor(set: StoreSetter<AuthStore>, get: () => AuthStore) {
    this.set = set;
    this.get = get;
  }

  setUser = (user: AuthUser) => {
    this.set({ user, isLoggedIn: true }, false, "setUser");
  };

  clearUser = () => {
    this.set({ user: null, isLoggedIn: false }, false, "clearUser");
  };
}

export type AuthAction = Pick<AuthActionImpl, keyof AuthActionImpl>;
