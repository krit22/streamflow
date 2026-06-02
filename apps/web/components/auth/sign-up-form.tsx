"use client";

import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export type SignUpFormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export type SignUpFormProps = {
  isActive: boolean;
  errors?: SignUpFormErrors;
  isSubmitting?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

export function SignUpForm({
  isActive,
  errors,
  isSubmitting = false,
  onSubmit,
}: SignUpFormProps) {
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
          : "pointer-events-none absolute top-0 left-0 w-full translate-x-full opacity-0",
      )}
      aria-hidden={!isActive}
    >
      <div className="space-y-6">
        <div className="relative">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Julian Voss"
            autoComplete="name"
            hasError={Boolean(errors?.name)}
          />
          {errors?.name ? <FieldError message={errors.name} /> : null}
        </div>
        <div className="relative">
          <Label htmlFor="signup-email">Email Address</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="name@cinema.art"
            autoComplete="email"
            hasError={Boolean(errors?.email)}
          />
          {errors?.email ? <FieldError message={errors.email} /> : null}
        </div>
        <div className="relative">
          <Label htmlFor="signup-password">Create Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            hasError={Boolean(errors?.password)}
          />
          {errors?.password ? <FieldError message={errors.password} /> : null}
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating Account…" : "Create Account"}
      </Button>
    </form>
  );
}
