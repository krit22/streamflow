import { ApiError } from "@/lib/api/errors";

export function mapSignInApiError(error: unknown): {
  general?: string;
  email?: string;
  password?: string;
} {
  if (!(error instanceof ApiError)) {
    return { general: "Something went wrong. Please try again." };
  }

  if (error.code === "VALIDATION_ERROR" && error.body.issues?.length) {
    return mapIssuesToFields(error.body.issues, ["email", "password"]);
  }

  if (
    error.code === "USER NOT FOUND" ||
    error.code === "INVALID_PASSWORD" ||
    error.code === "INVALID_CREDENTIALS"
  ) {
    return { general: "Invalid email or password. Please try again." };
  }

  return { general: error.message };
}

export function mapSignUpApiError(error: unknown): {
  general?: string;
  name?: string;
  email?: string;
  password?: string;
} {
  if (!(error instanceof ApiError)) {
    return { general: "Something went wrong. Please try again." };
  }

  if (error.code === "VALIDATION_ERROR" && error.body.issues?.length) {
    return mapIssuesToFields(error.body.issues, ["name", "email", "password"]);
  }

  if (error.code === "EMAIL_ALREADY_EXISTS") {
    return { email: "An account with this email already exists." };
  }

  return { general: error.message };
}

function mapIssuesToFields<T extends string>(
  issues: Array<{ path: (string | number)[]; message: string }>,
  fields: T[],
): Partial<Record<T, string>> {
  const result: Partial<Record<T, string>> = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && fields.includes(field as T) && !result[field as T]) {
      result[field as T] = issue.message;
    }
  }

  return result;
}
