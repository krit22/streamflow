export function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6">
      {children}
    </main>
  );
}
