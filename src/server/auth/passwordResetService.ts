import 'server-only';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { sign, verify as verifyJwt } from 'jsonwebtoken';
import { PURPOSE, SMS_SENDER, JWT_SECRET } from './constants';
import { createOtpChallenge, checkOtpChallenge } from './otp';
import { resetRequestSchema, resetVerifySchema, passwordUpdateSchema } from './schemas';
import { sendSMS } from '@/lib/sms';

type FieldErrors = Record<string, string>;

export async function requestResetOtp(input: z.infer<typeof resetRequestSchema>) {
    const parsed = resetRequestSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: FieldErrors = {};
        for (const i of parsed.error.issues) {
            fieldErrors[String(i.path[0] ?? 'form')] = i.message;
        }
        return { ok: false as const, error: 'VALIDATION_ERROR', fieldErrors };
    }

    const { email, name, phone } = parsed.data;

    const { prisma } = await import('@/lib/prisma');
    const exists = await prisma.user.findFirst({
        where: { email, name, phone },
        select: { id: true },
    });
    if (!exists) return { ok: false as const, error: 'USER_NOT_FOUND' };

    const { challengeId, code } = await createOtpChallenge(phone, PURPOSE.resetPw);

    await sendSMS({
        title: '비밀번호 재설정 인증번호',
        msg: `인증번호: ${code}\n5분 내에 입력해주세요.`,
        receiver: [phone],
        sender: SMS_SENDER,
    });

    return { ok: true as const, challengeId };
}

export async function verifyResetOtp(input: z.infer<typeof resetVerifySchema>) {
    const parsed = resetVerifySchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: FieldErrors = {};
        for (const i of parsed.error.issues) {
            fieldErrors[String(i.path[0] ?? 'form')] = i.message;
        }
        return { ok: false as const, error: 'VALIDATION_ERROR', fieldErrors };
    }

    const { challengeId, code, email, name } = parsed.data;

    const otpCheck = await checkOtpChallenge(challengeId, code, PURPOSE.resetPw);
    if (!otpCheck.ok) return { ok: false as const, error: otpCheck.reason };

    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findFirst({
        where: { email, name, phone: otpCheck.phone },
        select: { id: true },
    });
    if (!user) return { ok: false as const, error: 'USER_NOT_FOUND' };

    // 클라이언트가 최종 비번변경 때 들고올 토큰 (10분 유효)
    const resetToken = sign({ uid: user.id, kind: 'pw_reset' }, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '10m',
    });

    return { ok: true as const, resetToken };
}

export async function updatePassword(input: z.infer<typeof passwordUpdateSchema>) {
    const parsed = passwordUpdateSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: FieldErrors = {};
        for (const i of parsed.error.issues) {
            fieldErrors[String(i.path[0] ?? 'form')] = i.message;
        }
        return { ok: false as const, error: 'VALIDATION_ERROR', fieldErrors };
    }

    const { resetToken, newPassword } = parsed.data;

    let userId: string | number | undefined;
    try {
        const payload = verifyJwt(resetToken, JWT_SECRET) as { uid: string | number; kind: string };
        if (payload.kind !== 'pw_reset') throw new Error('BAD_KIND');
        userId = payload.uid;
    } catch {
        return { ok: false as const, error: 'TOKEN_INVALID' };
    }

    const { prisma } = await import('@/lib/prisma');
    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId as any }, data: { passwordHash: hash } });

    return { ok: true as const };
}
