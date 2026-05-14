import { ProtectedLayout } from "@/features/auth/protected-layout";
import { UserMenu } from "@/features/auth/components/user-menu";

export default function ProtectedRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-background">
                <header className="border-b border-border">
                    <div className="mx-auto max-w-xl flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-medium">My App</span>
                        <UserMenu />
                    </div>
                </header>
                <main>{children}</main>
            </div>
        </ProtectedLayout>
    );
}
