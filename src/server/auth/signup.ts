'use server';

import { redirect } from 'next/navigation';
import { signupSchema, type SignupInput } from '@/lib/validation/signup';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

export async function signupActionRHF(
    raw: SignupInput,
    redirectTo?: string,
): Promise<{ fieldErrors?: Record<string, string> }> {
    const tErr = await getTranslations('auth.signup.errors');

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
                email: tErr('email_exists'),
            },
        };
    }

    // 핸드폰 번호 중복 검사
    const lowerPhone = phone.trim().toLowerCase();
    const phoneOwner = await prisma.user.findFirst({
        where: { phone: lowerPhone },
        select: { id: true },
    });
    if (phoneOwner) {
        return {
            fieldErrors: {
                phone: tErr('phone_exists'),
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
        const cookieStore = await cookies();
        cookieStore.delete('pending_oauth');
    }

    if (redirectTo) {
        redirect(redirectTo);
    }

    return {};
}
