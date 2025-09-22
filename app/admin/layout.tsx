import SessionProvider from '@/components/auth/session-provider';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SessionProvider>{children}</SessionProvider>;
}
