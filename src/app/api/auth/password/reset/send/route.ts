import { NextResponse } from 'next/server';
import { requestResetOtp } from '@/server/auth';

async function parseBody(req: Request) {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await req.json();
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
}

export async function POST(req: Request) {
    const body = await parseBody(req);
    const email = String(body.email ?? '')
        .trim()
        .toLowerCase();
    const name = String(body.name ?? '').trim();
    const phone = String(body.phone ?? '').replace(/\D/g, '');

    const res = await requestResetOtp({ email, name, phone });

    const base = new URL('/auth/login', req.url);
    base.searchParams.set('action', 'find-password');

    if (!res.ok) {
        base.searchParams.set('phase', 'form');
        base.searchParams.set('code', res.error);
        if (email) base.searchParams.set('email', email);
        if (name) base.searchParams.set('name', name);
        if (phone) base.searchParams.set('phone', phone);
        return NextResponse.redirect(base, 303);
    }

    base.searchParams.set('phase', 'verify');
    base.searchParams.set('email', email);
    base.searchParams.set('name', name);
    base.searchParams.set('phone', phone);
    base.searchParams.set('challenge', res.challengeId);
    return NextResponse.redirect(base, 303);
}
