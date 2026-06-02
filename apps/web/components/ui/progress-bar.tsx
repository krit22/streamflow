import { cn } from "@/lib/cn";

export type ProgressValue = 25 | 50 | 75 | 100;

const progressWidth: Record<ProgressValue, string> = {
  25: "w-1/4",
  50: "w-1/2",
  75: "w-3/4",
  100: "w-full",
};

export type ProgressBarProps = {
  progress: ProgressValue;
  className?: string;
};

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div
      className={cn("fixed top-0 left-0 z-50 h-[2px] w-full bg-surface-container", className)}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full bg-primary transition-all duration-700 ease-in-out",
          progressWidth[progress],
        )}
      />
    </div>
  );
}
