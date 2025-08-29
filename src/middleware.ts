import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ROUTES } from '../config/routes';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('session')?.value;
    const { pathname, search } = req.nextUrl;

    const needsAuth = ROUTES.SIGNED_PREFIXES.some(p => pathname.startsWith(p));
    const isAuthArea = ROUTES.UNSIGNED_PREFIXES.some(p => pathname.startsWith(p));

    // 1) 보호 경로인데 미인증 → 로그인으로 보내며 "return_to" 쿠키 저장
    if (!token && needsAuth) {
        const url = new URL('/auth/login', req.url);

        const res = NextResponse.redirect(url);

        res.cookies.set('return_to', `${pathname}${search}`, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 5, // 5분
            secure: process.env.NODE_ENV === 'production',
        });

        return res;
    }

    // 2) 인증 상태에서 /auth 접근 → AFTER_LOGIN으로 (남아있을 수 있는 return_to 쿠키는 제거)
    if (token && isAuthArea) {
        const res = NextResponse.redirect(new URL(ROUTES.AFTER_LOGIN, req.url));
        res.cookies.delete('return_to');
        return res;
    }

    // 3) 토큰이 없고 보호 경로도 아니면 통과
    if (!token) return NextResponse.next();

    // 4) 토큰 검증
    try {
        await jwtVerify(token, secret, { algorithms: ['HS256'] });
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}
