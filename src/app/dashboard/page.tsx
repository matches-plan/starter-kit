import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signoutAction } from '../../server/auth/signout';
import DashboardClient from './DashboardClient';
import { ROUTES } from '../../../config/routes';

export default function DashboardPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>대시보드</CardTitle>
            </CardHeader>

            <CardContent>
                <DashboardClient />
                <form
                    action={async () => {
                        'use server';
                        await signoutAction(ROUTES.AFTER_LOGOUT);
                    }}
                >
                    <Button type="submit">로그아웃</Button>
                </form>
            </CardContent>
        </Card>
    );
}
