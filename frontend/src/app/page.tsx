import Link from "next/link";
import { CheckSquare, MessageSquare, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const features = [
    {
        icon: CheckSquare,
        title: "Todos",
        description:
            "Per-user CRUD with pagination, backed by MongoDB and React Query.",
        href: "/todos",
    },
    {
        icon: MessageSquare,
        title: "Chat",
        description:
            "Realtime messaging over WebSocket, with system messages and a live chat list.",
        href: "/chats",
    },
    {
        icon: ShieldCheck,
        title: "Auth",
        description:
            "JWT access and refresh tokens, auto-refresh interceptor, protected routes.",
        href: "/login",
    },
];

export default function Home() {
    return (
        <main className="flex flex-1 flex-col items-center px-6 py-16">
            <section className="flex max-w-2xl flex-col items-center text-center">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    Spring Boot + Next.js Template
                </h1>
                <p className="text-muted-foreground mt-4 text-lg">
                    A full-stack starter: Spring Boot 4 REST API on MongoDB with
                    JWT auth, and a Next.js 16 app on React 19 and Tailwind v4.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button size="lg">
                        <Link href="/todos">View todos</Link>
                    </Button>
                    <Button size="lg" variant="outline">
                        <Link href="/chats">Open chat</Link>
                    </Button>
                </div>
            </section>

            <section className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
                {features.map(({ icon: Icon, title, description, href }) => (
                    <Card key={title} className="flex flex-col">
                        <CardHeader>
                            <Icon className="text-muted-foreground size-5" />
                            <CardTitle className="mt-2">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <Button
                                variant="link"
                                className="h-auto p-0"
                            >
                                <Link href={href}>Explore →</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </main>
    );
}
