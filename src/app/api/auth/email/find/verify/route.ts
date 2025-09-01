import { NextResponse } from 'next/server';
import { verifyIdOtp } from '@/server/auth';

async function parseBody(req: Request) {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return await req.json();
    const formData = await req.formData();
    return Object.fromEntries(formData.entries());
}

export async function POST(req: Request) {
    const body = await parseBody(req);
    const challengeId = String(body.challengeId ?? '');
    const code = String(body.code ?? '').trim();
    const name = String(body.name ?? '');

    const res = await verifyIdOtp({ challengeId, code, name });

    const base = new URL('/auth/login', req.url);
    base.searchParams.set('action', 'find-email');

    if (!res.ok) {
        base.searchParams.set('phase', 'verify');
        base.searchParams.set('code', res.error);
        base.searchParams.set('challenge', challengeId);
        base.searchParams.set('name', name);
        return NextResponse.redirect(base, 303);
    }

    const emailsParam = encodeURIComponent(res.emails.join('|'));
    base.searchParams.set('phase', 'done');
    base.searchParams.set('emails', emailsParam);
    return NextResponse.redirect(base, 303);
}
