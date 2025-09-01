import { NextResponse } from 'next/server';
import { verifyResetOtp } from '@/server/auth';

async function parseBody(req: Request) {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await req.json();
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
}

export async function POST(req: Request) {
    const body = await parseBody(req);
    const challengeId = String(body.challengeId ?? '');
    const code = String(body.code ?? '').trim();
    const email = String(body.email ?? '')
        .trim()
        .toLowerCase();
    const name = String(body.name ?? '').trim();

    const base = new URL('/auth/login', req.url);
    base.searchParams.set('action', 'find-password');

    const res = await verifyResetOtp({ challengeId, code, email, name });
    if (!res.ok) {
        base.searchParams.set('phase', 'verify');
        base.searchParams.set('code', res.error);
        base.searchParams.set('challenge', challengeId);
        base.searchParams.set('email', email);
        base.searchParams.set('name', name);
        return NextResponse.redirect(base, 303);
    }

    // resetToken은 URL에 노출하지 말고 HttpOnly 쿠키로 보관
    const resp = NextResponse.redirect(
        (() => {
            base.searchParams.set('phase', 'reset'); // 새 비밀번호 입력 화면
            return base;
        })(),
        303,
    );
    resp.cookies.set('pw_reset_token', res.resetToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 10 * 60, // 10분
    });
    return resp;
}
