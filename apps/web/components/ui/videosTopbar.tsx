"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Bell, Menu, Mic, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"

type VideosTopbarProps = {
  onMenuClick?: () => void
  menuOpen?: boolean
  userName?: string
  className?: string
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

export default function VideosTopbar({
  onMenuClick,
  menuOpen = false,
  userName = "Guest",
  className,
}: VideosTopbarProps) {
  const router = useRouter()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          aria-expanded={menuOpen}
        >
          <Menu />
        </Button>
        <button
          type="button"
          onClick={() => router.push("/feed")}
          className="text-lg font-semibold tracking-tight"
        >
          Streamflow
        </button>
      </div>

      <div className="mx-4 hidden flex-1 items-center justify-center md:flex">
        <div className="flex w-full max-w-2xl items-center gap-2">
          <div className="flex flex-1 overflow-hidden rounded-full border border-input bg-input/30">
            <Input
              placeholder="Search"
              className="h-10 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="secondary"
              className="h-10 rounded-none rounded-r-full border-0 border-l border-input px-5"
              aria-label="Search"
            >
              <Search />
            </Button>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            className="size-10 shrink-0 rounded-full"
            aria-label="Search with your voice"
          >
            <Mic />
          </Button>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          className="hidden rounded-full sm:inline-flex"
        >
          <Plus data-icon="inline-start" />
          Create
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Notifications"
        >
          <Bell />
        </Button>
        <Avatar className="cursor-pointer">
          <AvatarFallback>{getInitial(userName)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
