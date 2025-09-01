'use client';

import { useAuth } from '@/components/auth/AuthClientProvider';
import { useSearchParams } from 'next/navigation';

export default function PaymentPage() {
    const user = useAuth();

    const params = useSearchParams();
    console.log(params.get('test'));

    console.log(user);
    return <div>Payment Page</div>;
}
