import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-svh flex-col bg-background">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
