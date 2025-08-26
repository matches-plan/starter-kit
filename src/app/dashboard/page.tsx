'use client';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
    console.log(123123);
    
    const { data: session } = useSession();

    console.log(session, 1);
    return (
        <>
            <h1>대시보드</h1>
        </>
    );
}
