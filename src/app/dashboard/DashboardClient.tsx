'use client';

import { useAuth } from '@/components/auth/AuthClientProvider';

export default function DashboardClient() {
    const user = useAuth();

    console.log(user);

    if (!user) return <p>로그인이 필요합니다.</p>;
    return <p>안녕하세요, {user.name ?? user.email}님!</p>;
}
