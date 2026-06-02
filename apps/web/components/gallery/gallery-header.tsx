"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { cn } from "@/lib/cn";
import { getUserInitials } from "@/lib/user";
import {
  selectIsHeaderCompact,
  useGalleryUiStore,
} from "@/stores/gallery-ui-store";
import { selectAuthUser, useAuthStore } from "@/stores/auth-store";

export function GalleryHeader() {
  const user = useAuthStore(selectAuthUser);
  const isHeaderCompact = useGalleryUiStore(selectIsHeaderCompact);
  const setHeaderCompact = useGalleryUiStore((state) => state.setHeaderCompact);
  const setActiveNav = useGalleryUiStore((state) => state.setActiveNav);

  useEffect(() => {
    const onScroll = () => {
      setHeaderCompact(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setHeaderCompact]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full bg-background/80 shadow-sm backdrop-blur-md transition-all duration-300 ease-in-out",
        isHeaderCompact ? "py-2 shadow-md" : "h-20",
      )}
    >
      <div className="flex h-full items-center justify-between pl-4 pr-margin-mobile md:pl-6 md:pr-margin-desktop">
        <Link
          href="/"
          className="font-brand text-display-lg text-primary tracking-widest"
          onClick={() => setActiveNav("home")}
        >
          Stream Flow
        </Link>
        <div className="flex items-center gap-8">
          {user ? (
            <button
              type="button"
              disabled
              className="cursor-not-allowed border-b-2 border-transparent pb-1 font-label-md text-label-md text-primary opacity-50"
              title="Upload coming soon"
            >
              Upload
            </button>
          ) : (
            <Link
              href="/auth"
              className="border-b-2 border-primary pb-1 font-label-md text-label-md text-primary transition-opacity hover:opacity-70"
            >
              Upload
            </Link>
          )}
          {user ? (
            <div
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-surface-container-highest transition-opacity hover:opacity-80"
              title={user.name}
            >
              {user.profileUrl ? (
                <Image
                  src={user.profileUrl}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-label-md text-[12px] font-semibold text-primary">
                  {getUserInitials(user.name)}
                </span>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-container-highest font-label-md text-[12px] font-semibold text-primary transition-opacity hover:opacity-80"
            >
              In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
