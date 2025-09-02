import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signoutAction } from '../../../server/auth/signout';
import DashboardClient from './DashboardClient';
import { ROUTES } from '../../../../config/routes';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
    const t = useTranslations('dashboard');

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
            </CardHeader>

            <CardContent>
                <DashboardClient />
                <form
                    action={async () => {
                        'use server';
                        await signoutAction(ROUTES.AFTER_LOGOUT);
                    }}
                >
                    <Button type="submit">{t('logout')}</Button>
                </form>
            </CardContent>
        </Card>
    );
}
