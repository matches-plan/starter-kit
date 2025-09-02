// middleware.ts
import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intl = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
    const res = intl(req);

    const existing = res.headers.get('x-middleware-override-headers');
    const extras = ['x-url', 'x-origin', 'x-pathname', 'x-search-params'];
    res.headers.set(
        'x-middleware-override-headers',
        existing ? `${existing},${extras.join(',')}` : extras.join(','),
    );

    res.headers.set('x-url', req.url);
    res.headers.set('x-origin', req.nextUrl.origin);
    res.headers.set('x-pathname', req.nextUrl.pathname);
    res.headers.set('x-search-params', req.nextUrl.search ?? '');

    console.log('x-next-intl-locale =', res.headers.get('x-next-intl-locale'));

    return res;
}

export const config = {
    matcher: ['/', '/(ko|en)/:path*', '/((?!api|_next|.*\\..*).*)'],
};
