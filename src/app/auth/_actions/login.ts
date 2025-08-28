'use server';

import { cookies } from 'next/headers';
import { LoginInput, loginSchema } from '@/lib/validation/login';
import { redirect } from 'next/navigation';
import { createSession } from '@/lib/auth';

export async function loginActionRHF(
    raw: LoginInput,
): Promise<{ fieldErrors?: Record<string, string> }> {
    // 1) 서버 검증
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? 'form');
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        return { fieldErrors };
    }
    const { email, password, redirectTo } = parsed.data;

    // 3) 런타임 import (클라 번들 유입 방지)
    const { prisma } = await import('@/lib/prisma');
    const bcrypt = await import('bcrypt');

    // 5) 이메일 존재 검사
    const lowerEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email: lowerEmail },
        select: { id: true, passwordHash: true, email: true, image: true },
    });

    if (!user || !user.passwordHash) {
        return {
            fieldErrors: {
                email: '가입된 이메일이 없습니다.',
            },
        };
    }

    // 6) 비밀번호 검사
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
        return { fieldErrors: { password: '비밀번호가 올바르지 않습니다.' } };
    }

    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get('pending_oauth')?.value;

        if (cookie) {
            const { provider, providerAccountId, image } = JSON.parse(cookie);

            await prisma.account.create({
                data: {
                    userId: user.id,
                    provider: provider,
                    providerAccountId: providerAccountId,
                    type: 'oauth',
                },
            });

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    image: image,
                },
            });

            const cookieStore = await cookies();
            cookieStore.delete('pending_oauth');
        }
    } catch (e) {
        console.log(e);
    } finally {
        await createSession({
            id: user.id,
            email: user.email,
            image: user.image ?? null,
        });
    }

    const dest = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard';
    redirect(dest);
}
