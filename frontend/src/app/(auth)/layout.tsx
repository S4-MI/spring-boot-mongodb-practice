import { GuestLayout } from "@/features/auth/guest-layout";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <GuestLayout>
            <div className="min-h-screen flex items-center justify-center px-4">
                {children}
            </div>
        </GuestLayout>
    );
}
