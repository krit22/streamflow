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
  profileUrl?: string | null;
};

export type FeedChannel = {
  id: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  subscriberCount: number;
  createdAt: string;
  userId: string;
};

export type FeedVideo = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  videoUrl: string;
  likeCount: number;
  viewsCount: number;
  status: string;
  type: string;
  createdAt: string;
  channelId: string;
  channel: FeedChannel;
};

export type VideosPage = {
  videos: FeedVideo[];
  nextCursor: string | null;
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
