import 'server-only';
import { z } from 'zod';
import { sendSMS } from '@/lib/sms';
import { maskEmail } from '@/lib/mask';
import { PURPOSE, SMS_SENDER } from './constants';
import { createOtpChallenge, checkOtpChallenge } from './otp';
import { idRequestSchema, idVerifySchema } from './schemas';
import { prisma } from '@/lib/prisma';

type FieldErrors = Record<string, string>;

export async function requestIdOtp(input: z.infer<typeof idRequestSchema>) {
    const parsed = idRequestSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: FieldErrors = {};
        for (const i of parsed.error.issues) {
            fieldErrors[String(i.path[0] ?? 'form')] = i.message;
        }
        return { ok: false as const, error: 'VALIDATION_ERROR', fieldErrors };
    }

    const { name, phone } = parsed.data;

    // name phone 존재하는지 확인
    const user = await prisma.user.findFirst({
        where: { name, phone },
        select: { id: true },
    });

    if (!user) return { ok: false as const, error: 'USER_NOT_FOUND' };

    const { challengeId, code } = await createOtpChallenge(phone, PURPOSE.findId);

    await sendSMS({
        title: '아이디 찾기 인증번호',
        msg: `인증번호: ${code}\n5분 내에 입력해주세요.`,
        receiver: [phone],
        sender: SMS_SENDER,
    });

    return { ok: true as const, challengeId, name, phone };
}

export async function verifyIdOtp(input: z.infer<typeof idVerifySchema>) {
    const parsed = idVerifySchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: FieldErrors = {};
        for (const i of parsed.error.issues) {
            fieldErrors[String(i.path[0] ?? 'form')] = i.message;
        }
        return { ok: false as const, error: 'VALIDATION_ERROR', fieldErrors };
    }

    const { challengeId, code, name } = parsed.data;

    const otpCheck = await checkOtpChallenge(challengeId, code, PURPOSE.findId);
    if (!otpCheck.ok) {
        return { ok: false as const, error: otpCheck.reason };
    }

    const users = await prisma.user.findMany({
        where: { name, phone: otpCheck.phone },
        select: { email: true },
    });

    const maskedEmails = users.map(u => maskEmail(u.email));
    return { ok: true as const, emails: maskedEmails };
}
