import { isAxiosError } from "axios";

type ApiErrorBody = {
  success?: false;
  error?: {
    message?: string;
    code?: string;
  };
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
