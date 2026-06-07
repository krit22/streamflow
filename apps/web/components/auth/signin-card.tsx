"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    LoginUserSchema,
    type LoginUserInput,
} from "@streamflow/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useLogin } from "@/hooks/auth/useLogin"
import { getApiErrorMessage } from "@/lib/apiClient"

export function SigninCard() {
    const router = useRouter()
    const login = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginUserInput>({
        resolver: zodResolver(LoginUserSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (data: LoginUserInput) => {
        login.mutate(data, {
            onSuccess: () => router.push("/feed"),
            onError: (error) => {
                setError("root", { message: getApiErrorMessage(error) })
            },
        })
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>
                    Enter your email below to sign in to your account
                </CardDescription>
                <CardAction>
                    <Button onClick={() => router.push("/register")} variant="link">
                        Sign up
                    </Button>
                </CardAction>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                aria-invalid={!!errors.email}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                aria-invalid={!!errors.password}
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        {errors.root && (
                            <p className="text-sm text-destructive">{errors.root.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={login.isPending}>
                        {login.isPending ? "Signing in..." : "Login"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
