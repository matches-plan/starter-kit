import { GalleryVerticalEnd } from 'lucide-react';
import { FindEmail } from './FindEmail';
import { FindPassword } from './FindPassword';
import { LoginForm } from '../_client/LoginForm';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{
        action?: string;
        return_to?: string;
    }>;
}) {
    const sp = await searchParams;
    const action = sp.action ?? null;
    const returnTo = sp.return_to ?? '';

    if (action === 'find-email') {
        return <FindEmail />;
    }

    if (action === 'find-password') {
        return <FindPassword />;
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Acme Inc.
                </a>
                <LoginForm returnTo={returnTo} />
            </div>
        </div>
    );
}
