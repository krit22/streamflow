import Link from "next/link";

import { MaterialIcon } from "@/components/ui/material-icon";
import { Button } from "@/components/ui/button";

export function HistorySignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <MaterialIcon name="history" className="mb-4 text-5xl text-secondary-fixed-dim" />
      <h2 className="font-headline-lg text-headline-lg text-primary">Sign in to see history</h2>
      <p className="mt-2 max-w-md font-body-md text-body-md text-secondary">
        Your watch history is saved when you&apos;re signed in and open a video.
      </p>
      <Link href="/auth" className="mt-8 inline-block w-full max-w-xs">
        <Button type="button" className="pointer-events-none">
          Sign In
        </Button>
      </Link>
    </div>
  );
}
