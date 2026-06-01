export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponseData = {
  user: AuthUser;
};

export type ChannelSummary = {
  id: string;
  name: string;
  description: string | null;
  subscriberCount: number;
  createdAt: string;
};

export type MeResponseData = AuthUser & {
  profileUrl?: string | null;
  createdAt?: string;
  channels?: ChannelSummary[];
};

export type InitializeVideoUploadData = {
  videoId: string;
  uploadUrl: string;
  videoUrl: string;
};

export type CreateChannelData = {
  id: string;
  name: string;
  description: string;
  userId: string;
};

export type RegisterResponseData = {
  user: {
    id: string;
    email: string;
    name: string;
  };
};
