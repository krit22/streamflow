import { LoginForm } from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;

  return <LoginForm registered={registered === "true"} />;
}
