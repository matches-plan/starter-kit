// /app/(...)/actions.ts
'use server';

import { createUser } from '@/server/services/userService';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export type SignupActionResult =
    | { ok: true }
    | { ok: false; error: { formErrors?: string[]; fieldErrors?: Record<string, string[]> } };

export async function signupAction(formData: FormData): Promise<SignupActionResult> {
    const raw = {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        name: String(formData.get('name') ?? ''),
        phone: String(formData.get('phone') ?? ''),
    };

    const res = await createUser(raw);
    if (!res.ok) {
        console.log(11);
        console.log(res.error);

        return { ok: false, error: res.error };
    }

    try {
        await signIn('credentials', {
            email: raw.email,
            password: raw.password,
            redirectTo: '/dashboard',
        });
        return { ok: true };
    } catch (e) {
        if (e instanceof AuthError) {
            const code: string = (e?.cause?.code ?? 'LOGIN_FAILED') as string;
            return {
                ok: false,
                error: { formErrors: [`가입은 되었으나 자동 로그인에 실패했습니다. (${code})`] },
            };
        }
        throw e;
    }
}
