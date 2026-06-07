import type { Video } from "@/types/video"
import type { VideoCardProps } from "@/components/ui/videocard"

const PLACEHOLDER_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23262626'/%3E%3C/svg%3E"

export function formatViewCount(count: number) {
  if (count >= 1_000_000) {
    const value = count / 1_000_000
    return `${value % 1 === 0 ? value : value.toFixed(1)}M`
  }

  if (count >= 1_000) {
    const value = count / 1_000
    return `${value % 1 === 0 ? value : value.toFixed(1)}K`
  }

  return count.toString()
}

export function formatTimeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  const intervals = [
    { label: "year", seconds: 31_536_000 },
    { label: "month", seconds: 2_592_000 },
    { label: "week", seconds: 604_800 },
    { label: "day", seconds: 86_400 },
    { label: "hour", seconds: 3_600 },
    { label: "minute", seconds: 60 },
  ] as const

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count === 1 ? "" : "s"} ago`
    }
  }

  return "just now"
}

export function mapVideoToCardProps(video: Video): VideoCardProps {
  return {
    thumbnailUrl: video.thumbnailUrl ?? PLACEHOLDER_THUMBNAIL,
    title: video.title,
    channelName: video.channel.name,
    views: formatViewCount(video.viewsCount),
    postedAt: formatTimeAgo(video.createdAt),
  }
}
