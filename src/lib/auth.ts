// src/lib/auth.ts
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sanitizeRedirect } from './safeRedirect';

export const SESSION_COOKIE = 'session';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

export type SessionPayload = {
    id: number | string;
    email: string;
    image?: string | null;
    name?: string | null;
    phone?: string | null;
};

export function createJwt(payload: SessionPayload) {
    return sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
}

export function verifyJwt(token: string) {
    return verify(token, JWT_SECRET) as SessionPayload;
}

export async function readSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
        return null;
    }
    try {
        return verifyJwt(token);
    } catch {
        return null;
    }
}

export async function createSession(payload: SessionPayload) {
    const cookieStore = await cookies();

    const token = createJwt(payload);
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
        secure: process.env.NODE_ENV === 'production',
    });
    return token;
}

/** 로그아웃 (리다이렉트 없음, API에서 사용) */
export async function clearSessionCookie() {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE);
}

/** 로그아웃 (리다이렉트 포함, 기존 로직 유지) */
export async function clearSession(redirectTo?: string) {
    await clearSessionCookie();

    if (redirectTo) {
        const dest = sanitizeRedirect(redirectTo);

        redirect(dest);
    }
}
