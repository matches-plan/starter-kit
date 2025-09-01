import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signoutAction } from '../auth/_actions/signout';
import DashboardClient from './DashboardClient';

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
                        await signoutAction();
                    }}
                >
                    <Button type="submit">로그아웃</Button>
                </form>
            </CardContent>
        </Card>
    );
}
