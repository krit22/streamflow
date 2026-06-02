export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  videos: {
    all: ["videos"] as const,
    list: (limit: number) => [...queryKeys.videos.all, "list", limit] as const,
  },
  history: {
    all: ["history"] as const,
    list: (limit: number) => [...queryKeys.history.all, "list", limit] as const,
  },
} as const;
