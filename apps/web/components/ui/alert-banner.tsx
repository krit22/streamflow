import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type AlertBannerProps = {
  message: string;
  className?: string;
};

export function AlertBanner({ message, className }: AlertBannerProps) {
  return (
    <div
      className={cn(
        "mb-6 flex items-center gap-2 rounded-lg bg-error-container p-3 font-label-md text-[12px] text-on-error-container",
        className,
      )}
      role="alert"
    >
      <Icon name="error" className="text-[18px]" />
      <span>{message}</span>
    </div>
  );
}
