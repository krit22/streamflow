import { GALLERY_SIDEBAR_OFFSET } from "@/lib/gallery/constants";
import { cn } from "@/lib/cn";

export function GalleryFooter() {
  return (
    <footer
      className={cn(
        "w-full border-t border-outline-variant/10 bg-background py-16",
        GALLERY_SIDEBAR_OFFSET,
      )}
    >
      <div className="mx-auto flex max-w-container-max flex-col items-center gap-4 px-margin-mobile text-center md:px-margin-desktop">
        <span className="font-brand text-headline-lg-mobile text-primary">Stream Flow</span>
        <p className="font-body-md text-body-md text-secondary opacity-80">
          © 2024 Stream Flow. The Gallery Experience.
        </p>
      </div>
    </footer>
  );
}
