export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  issues?: Array<{ path: (string | number)[]; message: string }>;
  details?: unknown;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthSession = {
  user: AuthUser;
};

export type MeUser = AuthUser & {
  profileUrl: string | null;
  createdAt: string;
  channels: Array<{
    id: string;
    name: string;
    description: string;
    subscriberCount: number;
    createdAt: string;
  }>;
};
