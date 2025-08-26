'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function emailLogin(formData: FormData) {
    try {
        await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            redirectTo: '/dashboard',
        });
    } catch (e) {
        if (e instanceof AuthError) {
            const code: string = (e?.cause?.code ?? 'LOGIN_FAILED') as string;

            return redirect(
                `/auth/login?error=${encodeURIComponent(e.type)}&code=${encodeURIComponent(code)}`,
            );
        }
        throw e;
    }
}

export async function kakaoLogin() {
    try {
        await signIn('kakao', {
            redirect: true,
            redirectTo: "/auth/continue?provider=kakao",
        });
    } catch (e) {
        if (e instanceof AuthError) {
            const code: string = (e?.cause?.code ?? 'LOGIN_FAILED') as string;

            return redirect(
                `/auth/login?error=${encodeURIComponent(e.type)}&code=${encodeURIComponent(code)}`,
            );
        }
        throw e;
    }
}
