import { cn } from "@/lib/cn";

export type IconName = "error" | "check" | "cloud" | "ios";

export type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  return (
    <span className={cn("material-symbols-outlined", className)} aria-hidden>
      {name}
    </span>
  );
}
