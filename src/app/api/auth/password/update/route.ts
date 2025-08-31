import { NextResponse } from 'next/server';
import { updatePassword } from '@/server/auth';

async function parseBody(req: Request) {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await req.json();
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
}

export async function POST(req: Request) {
    const body = await parseBody(req);
    const newPassword = String(body.newPassword ?? '');
    const confirmPassword = String(body.confirmPassword ?? '');

    const token = req.headers.get('cookie')?.match(/(?:^|;\s*)pw_reset_token=([^;]+)/)?.[1] ?? '';
    const base = new URL('/auth/login', req.url);
    base.searchParams.set('action', 'find-password');

    const res = await updatePassword({
        resetToken: decodeURIComponent(token),
        newPassword,
        confirmPassword,
    });

    // 쿠키는 항상 제거(성공/실패 모두)
    const resp = NextResponse.redirect(
        (() => {
            if (!res.ok) {
                base.searchParams.set('phase', 'reset');
                base.searchParams.set('code', res.error);
            } else {
                base.searchParams.delete('action');
                base.searchParams.set('code', 'RESET_OK');
            }
            return base;
        })(),
        303,
    );
    resp.cookies.set('pw_reset_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    return resp;
}
