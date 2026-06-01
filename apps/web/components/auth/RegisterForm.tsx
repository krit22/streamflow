"use client";

import Link from "next/link";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserSchema, RegisterUserInput } from "@streamflow/validation";

import { useRegister } from "@/hooks/useRegister";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export const RegisterForm = () => {
  const formId = useId();
  const { mutate: registerUser, isPending, isError, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const onSubmit = (data: RegisterUserInput) => {
    registerUser(data);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Create an account</CardTitle>
        <CardDescription>
          Enter your details to get started with Streamflow.
        </CardDescription>
        <CardAction>
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field
              data-invalid={errors.name ? true : undefined}
              data-disabled={isPending ? true : undefined}
            >
              <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
              <Input
                id={`${formId}-name`}
                placeholder="Jane Doe"
                autoComplete="name"
                disabled={isPending}
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

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
                placeholder="At least 8 characters"
                autoComplete="new-password"
                disabled={isPending}
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            {isError ? (
              <FieldError>
                {getApiErrorMessage(error, "Registration failed. Please try again.")}
              </FieldError>
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
              Creating account
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="h-auto p-0 font-normal" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};
