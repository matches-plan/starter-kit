'use client';

import { useAuth } from '@/components/auth/AuthClientProvider';

export default function PaymentPage() {
    const user = useAuth();
    console.log(user);
    return <div>Payment Page</div>;
}
