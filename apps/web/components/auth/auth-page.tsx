"use client";

import { useState } from "react";

import { AuthBranding } from "@/components/auth/auth-branding";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeroImage } from "@/components/auth/auth-hero-image";
import { AuthSuccessState } from "@/components/auth/auth-success-state";
import { AuthTabs, type AuthTab } from "@/components/auth/auth-tabs";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Divider } from "@/components/ui/divider";
import { ProgressBar, type ProgressValue } from "@/components/ui/progress-bar";
import { SocialAuthButton } from "@/components/ui/social-auth-button";

export type AuthPageProps = {
  initialTab?: AuthTab;
  view?: "form" | "success";
  demoErrors?: {
    general?: string;
    email?: string;
  };
};

const tabProgress: Record<AuthTab, ProgressValue> = {
  signin: 25,
  signup: 50,
};

export function AuthPage({
  initialTab = "signin",
  view = "form",
  demoErrors,
}: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);

  if (view === "success") {
    return (
      <>
        <ProgressBar progress={100} />
        <main className="flex grow items-center justify-center px-margin-mobile py-16 md:px-0">
          <div className="flex w-full max-w-[480px] flex-col items-center">
            <AuthCard>
              <AuthBranding />
              <AuthSuccessState />
            </AuthCard>
            <AuthHeroImage />
          </div>
        </main>
        <AuthFooter />
      </>
    );
  }

  return (
    <>
      <ProgressBar progress={tabProgress[activeTab]} />
      <main className="flex grow items-center justify-center px-margin-mobile py-16 md:px-0">
        <div className="flex w-full max-w-[480px] flex-col items-center">
          <AuthCard>
            <AuthBranding />
            {demoErrors?.general ? (
              <AlertBanner message={demoErrors.general} />
            ) : null}
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="relative overflow-hidden">
              <SignInForm
                isActive={activeTab === "signin"}
                errors={
                  demoErrors?.email
                    ? { email: demoErrors.email }
                    : undefined
                }
              />
              <SignUpForm isActive={activeTab === "signup"} />
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-4">
              <SocialAuthButton provider="google" />
              <SocialAuthButton provider="apple" />
            </div>
          </AuthCard>
          <AuthHeroImage />
        </div>
      </main>
      <AuthFooter />
    </>
  );
}
