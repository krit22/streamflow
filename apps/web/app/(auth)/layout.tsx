import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthPageLayout>{children}</AuthPageLayout>;
}
