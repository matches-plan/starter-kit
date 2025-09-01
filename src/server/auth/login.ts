'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginInput, loginSchema } from '@/lib/validation/login';
import { createSession } from '@/lib/auth';
import { sanitizeRedirect } from '@/lib/safeRedirect';

export async function loginActionRHF(
    raw: LoginInput,
    searchParams?: string,
    redirectTo?: string,
): Promise<{ fieldErrors?: Record<string, string> }> {
    // 1) 검증
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? 'form');
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        return { fieldErrors };
    }
    const { email, password } = parsed.data;

    // 2) 런타임 import
    const { prisma } = await import('@/lib/prisma');
    const bcrypt = await import('bcrypt');

    // 3) 유저 조회
    const lowerEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email: lowerEmail },
        select: { id: true, name: true, passwordHash: true, email: true, image: true },
    });
    if (!user || !user.passwordHash) {
        return { fieldErrors: { email: '가입된 이메일이 없습니다.' } };
    }

    // 4) 비밀번호 확인
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
        return { fieldErrors: { password: '비밀번호가 올바르지 않습니다.' } };
    }

    const cookieStore = await cookies();

    // (선택) pending_oauth 처리
    try {
        const pending = cookieStore.get('pending_oauth')?.value;
        if (pending) {
            const { provider, providerAccountId, image } = JSON.parse(pending);
            await prisma.account.create({
                data: { userId: user.id, provider, providerAccountId, type: 'oauth' },
            });
            await prisma.user.update({ where: { id: user.id }, data: { image } });
            cookieStore.delete('pending_oauth');
        }
    } finally {
        await createSession({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image ?? null,
        });
    }

    // 로그인 후 리다이렉트
    if (searchParams) {
        const dest = sanitizeRedirect(searchParams);
        redirect(dest);
    } else if ( redirectTo ) {
        const dest = sanitizeRedirect(redirectTo);
        redirect(dest);
    }

    return {};
}
