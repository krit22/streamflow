"use client";

import Link from "next/link";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema, LoginUserInput } from "@streamflow/validation";

import { useLogin } from "@/hooks/useLogin";
import { getApiErrorMessage } from "@/lib/api-errors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type LoginFormProps = {
  registered?: boolean;
};

export function LoginForm({ registered = false }: LoginFormProps) {
  const formId = useId();
  const { mutate: loginUser, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(LoginUserSchema),
  });

  const onSubmit = (data: LoginUserInput) => {
    loginUser(data);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">
          Sign in to your account
        </CardTitle>
        <CardDescription>
          Enter your email and password to continue.
        </CardDescription>
        <CardAction>
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {registered ? (
          <FieldDescription className="mb-4 rounded-lg border border-border bg-muted/50 px-3 py-2">
            Account created successfully. Sign in to continue.
          </FieldDescription>
        ) : null}

        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field
              data-invalid={errors.email ? true : undefined}
              data-disabled={isPending ? true : undefined}
            >
              <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
              <Input
                id={`${formId}-email`}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isPending}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field
              data-invalid={errors.password ? true : undefined}
              data-disabled={isPending ? true : undefined}
            >
              <FieldLabel htmlFor={`${formId}-password`}>Password</FieldLabel>
              <Input
                id={`${formId}-password`}
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                disabled={isPending}
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            {isError ? (
              <FieldError>{getApiErrorMessage(error, "Sign in failed.")}</FieldError>
            ) : null}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form={formId}
          className="w-full"
          size="lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Signing in
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Button variant="link" className="h-auto p-0 font-normal" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
