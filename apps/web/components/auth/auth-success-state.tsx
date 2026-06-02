import { Icon } from "@/components/ui/icon";

export function AuthSuccessState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg">
        <Icon name="check" className="text-[32px] text-on-primary" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Welcome back!
        </h3>
        <p className="font-body-md text-body-md text-secondary">
          Redirecting you to your feed.
        </p>
      </div>
    </div>
  );
}
