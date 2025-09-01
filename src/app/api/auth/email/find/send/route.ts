import { NextResponse } from 'next/server';
import { requestIdOtp } from '@/server/auth';

async function parseBody(req: Request) {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return await req.json();
    const formData = await req.formData();
    return Object.fromEntries(formData.entries());
}

export async function POST(req: Request) {
    const body = await parseBody(req);
    const name = String(body.name ?? '');
    const phone = String(body.phone ?? '').replace(/\D/g, '');

    const res = await requestIdOtp({ name, phone });

    // 다음 페이지 URL 빌드
    const base = new URL('/auth/login', req.url);
    base.searchParams.set('action', 'find-email');

    if (!res.ok) {
        base.searchParams.set('phase', 'form');
        base.searchParams.set('code', res.error);
        if (name) base.searchParams.set('name', name);
        if (phone) base.searchParams.set('phone', phone);
        return NextResponse.redirect(base, 303);
    }

    base.searchParams.set('phase', 'verify');
    base.searchParams.set('name', res.name ?? name);
    base.searchParams.set('phone', phone);
    base.searchParams.set('challenge', res.challengeId);
    return NextResponse.redirect(base, 303);
}
