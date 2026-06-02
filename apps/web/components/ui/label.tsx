import { type LabelHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-1 block font-label-md text-[10px] uppercase tracking-widest text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
