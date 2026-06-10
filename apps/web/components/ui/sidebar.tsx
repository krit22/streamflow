"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Clock, Home, Library, PlaySquare, ThumbsUp } from "lucide-react"

const navItems = [
  { label: "Home", href: "/feed", icon: Home },
  { label: "Subscriptions", href: "/subscriptions", icon: PlaySquare },
  { label: "History", href: "/history", icon: Clock },
  { label: "Your videos", href: "#", icon: Library },
  { label: "Liked videos", href: "/liked-videos", icon: ThumbsUp },
]

type AppSidebarProps = {
  open?: boolean
  className?: string
}

export function AppSidebar({ open = true, className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-14 h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto border-r bg-background transition-[width] duration-200",
        open ? "w-60" : "w-[72px]",
        className
      )}
    >
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Button
              key={item.label}
              variant="ghost"
              asChild
              className={cn(
                "h-10 w-full justify-start gap-5 px-3",
                !open && "justify-center px-0"
              )}
            >
              <Link href={item.href}>
                <Icon />
                {open ? <span>{item.label}</span> : null}
              </Link>
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}

export default AppSidebar
