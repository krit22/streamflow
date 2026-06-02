import Image from "next/image";

import { AUTH_HERO_IMAGE_ALT, AUTH_HERO_IMAGE_URL } from "@/lib/auth-constants";

export function AuthHeroImage() {
  return (
    <div className="relative mt-12 h-[200px] w-full overflow-hidden rounded-xl bg-surface-container opacity-20 transition-opacity hover:opacity-30">
      <Image
        src={AUTH_HERO_IMAGE_URL}
        alt={AUTH_HERO_IMAGE_ALT}
        fill
        className="object-cover grayscale"
        sizes="480px"
        priority={false}
      />
    </div>
  );
}
