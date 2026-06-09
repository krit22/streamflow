export type Channel = {
  id: string
  name: string
  description: string | null
  bannerUrl: string | null
  subscriberCount: number
  createdAt: string
  userId: string
  videos?: Video[]
}

export type Video = {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  videoUrl: string
  likeCount: number
  viewsCount: number
  status: string
  type: string
  createdAt: string
  channelId: string
  channel: Channel
}

export type VideosPage = {
  videos: Video[]
  nextCursor: string | null
}

export type GetVideosResponse = {
  success: true
  data: VideosPage
}

export type GetVideoResponse = {
  success: true
  data: Video
}

export type GetChannelProfileResponse = {
  success: true
  data: Channel
}
