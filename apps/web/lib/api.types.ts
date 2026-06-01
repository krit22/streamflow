export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type LoginResponseData = {
  token: string;
};

export type RegisterResponseData = {
  user: {
    id: string;
    email: string;
    name: string;
  };
};
