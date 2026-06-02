import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Support" },
] as const;

export function AuthFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-container-max flex-col items-center gap-4 bg-background px-margin-desktop py-8">
      <div className="flex gap-8">
        {footerLinks.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="font-label-md text-label-md text-secondary opacity-80 transition-colors hover:text-primary hover:opacity-100"
          >
            {label}
          </Link>
        ))}
      </div>
      <p className="mt-2 font-label-md text-label-md text-secondary-fixed-dim">
        © 2024 Kinetic Cinema. Artistry in Motion.
      </p>
    </footer>
  );
}
