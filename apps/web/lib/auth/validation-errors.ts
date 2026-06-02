type ZodIssue = {
  path: PropertyKey[];
  message: string;
};

export function mapZodErrors<T extends string>(
  issues: ZodIssue[],
): Partial<Record<T, string>> {
  const fieldErrors: Partial<Record<T, string>> = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as T] = issue.message;
    }
  }

  return fieldErrors;
}
