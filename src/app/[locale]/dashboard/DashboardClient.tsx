'use client';

import { useAuth } from '@/components/auth/AuthClientProvider';
import { useTranslations } from 'next-intl';

export default function DashboardClient() {
    const t = useTranslations('dashboard');
    const user = useAuth();

    console.log(user);

    if (!user) return <p>{t('login_required')}</p>;
    return <p>{t('greeting', { name: user.name ?? user.email })}</p>;
}
