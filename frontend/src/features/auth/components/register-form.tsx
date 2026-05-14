"use client";

import { useForm } from "react-hook-form";

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
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/use-auth-mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseApiError } from "@/api/errors";

export function RegisterForm() {
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = (data: RegisterInput) => {
        registerMutation.mutate(data, {
            onError: (error) => {
                toast.error(parseApiError(error, "Registration failed. Please try again."));
            },
        });
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                    Enter your details to get started
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            autoComplete="name"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
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
                            autoComplete="new-password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending && (
                            <Loader2 className="animate-spin" />
                        )}
                        Create account
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
