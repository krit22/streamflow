/** Hostnames allowed for next/image (keep in sync with next.config.ts remotePatterns). */
export const NEXT_IMAGE_HOSTNAMES = new Set([
  "lh3.googleusercontent.com",
  "picsum.photos",
]);

export function registerNextImageHostname(hostname: string): void {
  NEXT_IMAGE_HOSTNAMES.add(hostname);
}

export function isNextImageHostnameAllowed(src: string): boolean {
  try {
    const hostname = new URL(src).hostname;
    return NEXT_IMAGE_HOSTNAMES.has(hostname);
  } catch {
    return false;
  }
}
