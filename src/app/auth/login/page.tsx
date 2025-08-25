// /app/auth/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';
import { loginAction } from './actions';
import { GalleryVerticalEnd } from 'lucide-react';

const MAP: Record<string, string> = {
    USER_NOT_FOUND: '존재하지 않는 이메일입니다.',
    INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
    VALIDATION_ERROR: '입력값이 올바르지 않습니다.',
    LOGIN_FAILED: '로그인에 실패했습니다.',
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; code?: string }>;
}) {
    const sp = await searchParams;

    const message = sp.code
        ? MAP[sp.code] ?? sp.code
        : sp.error === 'CredentialsSignin'
        ? '로그인에 실패했습니다.'
        : undefined;

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

                {message && (
                    <div className="mb-4 rounded border px-3 py-2 text-sm text-red-600">
                        {message}
                    </div>
                )}

                <LoginForm action={loginAction} />
            </div>
        </div>
    );
}
