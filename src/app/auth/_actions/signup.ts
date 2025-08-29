'use server';

import { redirect } from 'next/navigation';
import { signupSchema, type SignupInput } from '@/lib/validation/signup';
import { cookies } from 'next/headers';
import { ROUTES } from '../../../../config/routes';

export async function signupActionRHF(
    raw: SignupInput,
): Promise<{ fieldErrors?: Record<string, string> }> {
    // 1) 서버 검증
    const parsed = signupSchema.safeParse(raw);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? 'form');
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        return { fieldErrors };
    }
    const { email, name, password, phone } = parsed.data;

    // 3) 런타임 import (클라 번들 유입 방지)
    const { prisma } = await import('@/lib/prisma');
    const bcrypt = await import('bcrypt');

    // 5) 이메일 중복 검사
    const lowerEmail = email.trim().toLowerCase();
    const owner = await prisma.user.findUnique({
        where: { email: lowerEmail },
        select: { id: true },
    });
    if (owner) {
        return {
            fieldErrors: {
                email: '이미 가입된 이메일입니다. "기존 계정으로 연결하기"를 선택해주세요.',
            },
        };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
        const user = await prisma.user.create({ data: { email, name, phone, passwordHash } });

        // 소셜 연동 대기 쿠키(pending_oauth) 처리 (있을 때만)
        const cookieStore = await cookies();
        const pending = cookieStore.get('pending_oauth')?.value;

        if (pending) {
            const { provider, providerAccountId, image } = JSON.parse(pending);

            await prisma.account.create({
                data: {
                    userId: user.id,
                    provider,
                    providerAccountId,
                    type: 'oauth',
                },
            });

            await prisma.user.update({
                where: { id: user.id },
                data: { image },
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        // pending_oauth 는 여기서 삭제
        const cookieStore = await cookies();
        cookieStore.delete('pending_oauth');
    }

    redirect(ROUTES.AFTER_SIGNUP);
}
