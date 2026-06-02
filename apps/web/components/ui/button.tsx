import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "w-full rounded-lg bg-primary py-4 font-label-md text-label-md font-semibold uppercase tracking-widest text-on-primary transition-soft hover:opacity-90",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
