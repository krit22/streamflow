"use client";

import { LoginUserSchema, RegisterUserSchema } from "@streamflow/validation";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AuthBranding } from "@/components/auth/auth-branding";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeroImage } from "@/components/auth/auth-hero-image";
import { AuthSuccessState } from "@/components/auth/auth-success-state";
import { AuthTabs, type AuthTab } from "@/components/auth/auth-tabs";
import {
  SignInForm,
  type SignInFormErrors,
} from "@/components/auth/sign-in-form";
import {
  SignUpForm,
  type SignUpFormErrors,
} from "@/components/auth/sign-up-form";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Divider } from "@/components/ui/divider";
import { ProgressBar, type ProgressValue } from "@/components/ui/progress-bar";
import { SocialAuthButton } from "@/components/ui/social-auth-button";
import { useLoginMutation, useRegisterMutation } from "@/hooks/auth";
import { mapSignInApiError, mapSignUpApiError } from "@/lib/auth/map-api-errors";
import { mapZodErrors } from "@/lib/auth/validation-errors";

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

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function AuthPage({
  initialTab = "signin",
  view: initialView = "form",
  demoErrors,
}: AuthPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [view, setView] = useState<"form" | "success">(initialView);
  const [generalError, setGeneralError] = useState<string | undefined>(
    demoErrors?.general,
  );
  const [signInErrors, setSignInErrors] = useState<SignInFormErrors | undefined>(
    demoErrors?.email ? { email: demoErrors.email } : undefined,
  );
  const [signUpErrors, setSignUpErrors] = useState<SignUpFormErrors>();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const isSubmitting = loginMutation.isPending || registerMutation.isPending;

  useEffect(() => {
    if (view !== "success") {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [view, router]);

  const clearErrors = () => {
    setGeneralError(undefined);
    setSignInErrors(undefined);
    setSignUpErrors(undefined);
  };

  const handleTabChange = (tab: AuthTab) => {
    clearErrors();
    setActiveTab(tab);
  };

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: readFormString(formData, "email"),
      password: readFormString(formData, "password"),
    };

    const parsed = LoginUserSchema.safeParse(payload);
    if (!parsed.success) {
      setSignInErrors(mapZodErrors(parsed.error.issues));
      return;
    }

    loginMutation.mutate(parsed.data, {
      onSuccess: () => setView("success"),
      onError: (error) => {
        const mapped = mapSignInApiError(error);
        setGeneralError(mapped.general);
        setSignInErrors({
          email: mapped.email,
          password: mapped.password,
        });
      },
    });
  };

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: readFormString(formData, "name"),
      email: readFormString(formData, "email"),
      password: readFormString(formData, "password"),
    };

    const parsed = RegisterUserSchema.safeParse(payload);
    if (!parsed.success) {
      setSignUpErrors(mapZodErrors(parsed.error.issues));
      return;
    }

    registerMutation.mutate(parsed.data, {
      onSuccess: () => setView("success"),
      onError: (error) => {
        const mapped = mapSignUpApiError(error);
        setGeneralError(mapped.general);
        setSignUpErrors({
          name: mapped.name,
          email: mapped.email,
          password: mapped.password,
        });
      },
    });
  };

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
            {generalError ? <AlertBanner message={generalError} /> : null}
            <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="relative overflow-hidden">
              <SignInForm
                isActive={activeTab === "signin"}
                errors={signInErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSignIn}
              />
              <SignUpForm
                isActive={activeTab === "signup"}
                errors={signUpErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSignUp}
              />
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-4">
              <SocialAuthButton provider="google" disabled={isSubmitting} />
              <SocialAuthButton provider="apple" disabled={isSubmitting} />
            </div>
          </AuthCard>
          <AuthHeroImage />
        </div>
      </main>
      <AuthFooter />
    </>
  );
}
