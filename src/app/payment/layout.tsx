import AuthProvider from '@/components/auth/AuthProvider';

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
    return <AuthProvider requireAuth>{children}</AuthProvider>;
}
