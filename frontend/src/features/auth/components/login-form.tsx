"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/use-auth-mutations";
import { parseApiError } from "@/api/errors";

export function LoginForm() {
    const login = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (data: LoginInput) => {
        login.mutate(data, {
            onError: (error) => {
                toast.error(parseApiError(error, "Login failed. Please try again."));
            },
        });
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={login.isPending}
                    >
                        {login.isPending && (
                            <Loader2 className="animate-spin" />
                        )}
                        Sign in
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
