import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

export type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl bg-white p-8 ambient-shadow transition-soft md:p-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
