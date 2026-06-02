"use client";

import Link from "next/link";
import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export type SignInFormErrors = {
  email?: string;
  password?: string;
};

export type SignInFormProps = {
  isActive: boolean;
  errors?: SignInFormErrors;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

export function SignInForm({ isActive, errors, onSubmit }: SignInFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-8 transition-soft",
        isActive
          ? "relative translate-x-0 opacity-100"
          : "pointer-events-none absolute top-0 left-0 w-full -translate-x-full opacity-0",
      )}
      aria-hidden={!isActive}
    >
      <div className="space-y-6">
        <div className="relative">
          <Label htmlFor="signin-email">Email Address</Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            placeholder="name@cinema.art"
            autoComplete="email"
            hasError={Boolean(errors?.email)}
          />
          {errors?.email ? <FieldError message={errors.email} /> : null}
        </div>
        <div className="relative">
          <div className="mb-1 flex items-center justify-between">
            <Label htmlFor="signin-password" className="mb-0">
              Password
            </Label>
            <Link
              href="#"
              className="font-label-md text-[10px] text-secondary transition-colors hover:text-primary"
            >
              FORGOT?
            </Link>
          </div>
          <Input
            id="signin-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            hasError={Boolean(errors?.password)}
          />
          {errors?.password ? <FieldError message={errors.password} /> : null}
        </div>
      </div>
      <Button type="submit">Sign In</Button>
    </form>
  );
}
