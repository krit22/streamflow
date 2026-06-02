import { cn } from "@/lib/cn";

export type FieldErrorProps = {
  message: string;
  className?: string;
};

export function FieldError({ message, className }: FieldErrorProps) {
  return (
    <p className={cn("mt-1 font-label-md text-[10px] text-error", className)} role="alert">
      {message}
    </p>
  );
}
