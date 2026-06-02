import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "auth-input w-full border-b bg-transparent py-3 font-body-md text-body-md transition-colors placeholder:text-secondary-fixed-dim",
          hasError
            ? "auth-input--error border-error focus:border-error"
            : "border-surface-container focus:border-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
