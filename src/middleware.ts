import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SignedPaths = ['/dashboard', '/payment'];
const UnSignedPaths = ['/auth'];
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('session')?.value;

    if (!token && SignedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
        return NextResponse.redirect(
            new URL(`/auth/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`, req.url),
        );
    }

    if (token && UnSignedPaths.some(path => req.nextUrl.pathname.match(path))) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!token) return NextResponse.next();

    try {
        await jwtVerify(token, secret, { algorithms: ['HS256'] });
        return NextResponse.next();
    } catch (e) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/payment/:path*', '/auth/:path*'],
};
