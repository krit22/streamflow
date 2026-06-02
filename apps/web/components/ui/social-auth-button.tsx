import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type SocialProvider = "google" | "apple";

const providerConfig: Record<
  SocialProvider,
  { label: string; icon: IconName }
> = {
  google: { label: "GOOGLE", icon: "cloud" },
  apple: { label: "APPLE", icon: "ios" },
};

export type SocialAuthButtonProps = {
  provider: SocialProvider;
  className?: string;
  onClick?: () => void;
};

export function SocialAuthButton({
  provider,
  className,
  onClick,
}: SocialAuthButtonProps) {
  const { label, icon } = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-3 rounded-lg border border-surface-container py-3 transition-soft hover:bg-surface-container-low",
        className,
      )}
    >
      <Icon name={icon} className="text-[20px]" />
      <span className="font-label-md text-[12px] tracking-wide">{label}</span>
    </button>
  );
}
