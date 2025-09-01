import { readSession } from '@/lib/auth';
import AuthClientProvider from './AuthClientProvider';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function AuthProvider({
    children,
    requireAuth = false,
}: {
    children: React.ReactNode;
    requireAuth?: boolean;
}) {
    const session = (await readSession()) ?? null;

    const headersList = await headers();
    const pathname = headersList.get('x-pathname');
    const search_params = headersList.get('x-search-params');
    if (!session && requireAuth) {
        const redirectUrl = encodeURIComponent(`${pathname}${search_params}`);

        redirect(`auth/login?return_to=${redirectUrl}`);
    }

    return <AuthClientProvider initialUser={session}>{children}</AuthClientProvider>;
}
