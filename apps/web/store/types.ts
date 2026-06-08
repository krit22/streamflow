/**
 * StoreSetter type for Zustand store's set function
 */
export type StoreSetter<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
  actionName?: string | { type: string; [key: string]: unknown }
) => void;
