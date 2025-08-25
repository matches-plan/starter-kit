'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    try {
        await signIn('credentials', formData, { redirectTo: '/dashboard' });
    } catch (e) {
        if (e instanceof AuthError) {
            const code = (e as any)?.cause?.code ?? 'LOGIN_FAILED';

            return redirect(
                `/auth/login?error=${encodeURIComponent(e.type)}&code=${encodeURIComponent(code)}`,
            );
        }
        throw e;
    }
}
