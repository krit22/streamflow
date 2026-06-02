import { AuthPage } from "@/components/auth/auth-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinetic Cinema | Authentication",
};

export default function AuthRoutePage() {
  // Visual QA — swap return to preview error/success states from the mock:
  // return <AuthPage demoErrors={{ general: "Invalid credentials. Please try again.", email: "Please enter a valid email address" }} />;
  // return <AuthPage view="success" />;
  return <AuthPage />;
}
