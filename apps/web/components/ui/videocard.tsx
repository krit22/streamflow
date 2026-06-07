import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoreVertical } from "lucide-react"
import Image from "next/image"

export type VideoCardProps = {
  thumbnailUrl: string
  title: string
  channelName: string
  channelAvatarUrl?: string
  views: string
  postedAt: string
  duration?: string
  className?: string
  onMenuClick?: () => void
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

export function VideoCard({
  thumbnailUrl,
  title,
  channelName,
  channelAvatarUrl,
  views,
  postedAt,
  duration,
  className,
  onMenuClick,
}: VideoCardProps) {
  return (
    <article className={cn("group flex flex-col gap-3", className)}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          unoptimized
          className="object-cover transition-opacity group-hover:opacity-90"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {duration ? (
          <span className="absolute right-1.5 bottom-1.5 rounded-sm bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
            {duration}
          </span>
        ) : null}
      </div>

      <div className="flex gap-3">
        <Avatar className="size-9">
          {channelAvatarUrl ? (
            <AvatarImage src={channelAvatarUrl} alt={channelName} />
          ) : null}
          <AvatarFallback>{getInitial(channelName)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1">
            <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug">
              {title}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-mt-1 shrink-0"
              aria-label="Video options"
              onClick={onMenuClick}
            >
              <MoreVertical />
            </Button>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {channelName}
          </p>
          <p className="text-sm text-muted-foreground">
            {views} views • {postedAt}
          </p>
        </div>
      </div>
    </article>
  )
}
