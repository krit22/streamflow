import { cn } from "@/lib/cn";

export type AuthTab = "signin" | "signup";

export type AuthTabsProps = {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
};

const tabs: { id: AuthTab; label: string }[] = [
  { id: "signin", label: "SIGN IN" },
  { id: "signup", label: "CREATE ACCOUNT" },
];

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="mb-10 flex justify-center gap-8 border-b border-surface-container">
      {tabs.map(({ id, label }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={cn(
              "pb-4 font-label-md text-label-md transition-soft border-b-2",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
