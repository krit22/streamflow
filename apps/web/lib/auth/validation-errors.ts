import type { ZodError } from "zod";

export function mapZodErrors<T extends string>(
  error: ZodError,
): Partial<Record<T, string>> {
  const fieldErrors: Partial<Record<T, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as T] = issue.message;
    }
  }

  return fieldErrors;
}
