'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    try {
        await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            redirectTo: '/dashboard',
        });

        return { ok: true };
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
