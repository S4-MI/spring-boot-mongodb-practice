import { ProtectedLayout } from "@/features/auth/protected-layout";
import { UserMenu } from "@/features/auth/components/user-menu";
import { NavLinks } from "@/components/nav-links";

export default function ProtectedRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedLayout>
            <div className="flex flex-col min-h-screen bg-background">
                <header className="border-b border-border shrink-0">
                    <div className="flex items-center justify-between px-4 py-3">
                        <nav className="flex items-center gap-4">
                            <span className="text-sm font-medium">My App</span>
                            <NavLinks />
                        </nav>
                        <UserMenu />
                    </div>
                </header>
                <main className="flex-1 flex flex-col">{children}</main>
            </div>
        </ProtectedLayout>
    );
}
