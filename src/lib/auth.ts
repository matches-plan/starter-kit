// src/lib/auth.ts
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sanitizeRedirect } from './safeRedirect';
import { ROUTES } from '../../config/routes';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

export type SessionPayload = {
    id: number | string;
    email: string;
    image?: string | null;
};

export function createJwt(payload: SessionPayload) {
    return sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
}

export function verifyJwt(token: string) {
    return verify(token, JWT_SECRET) as SessionPayload;
}

export async function createSession(payload: SessionPayload) {
    const token = createJwt(payload);
    const cookieStore = await cookies();

    cookieStore.set('session', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
        secure: process.env.NODE_ENV === 'production',
    });

    return token;
}

/** 로그아웃 */
export async function clearSession(redirectTo?: string) {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    cookieStore.delete('return_to');

    const dest = sanitizeRedirect(redirectTo, ROUTES.AFTER_LOGOUT);
    redirect(dest);
}
