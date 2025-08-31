import 'server-only';
import bcrypt from 'bcrypt';
import { OTP_MAX_ATTEMPTS, OTP_TTL_MS } from './constants';

type OtpCheckFail = 'NOT_FOUND' | 'EXPIRED' | 'TOO_MANY_TRIES' | 'INVALID';

export function generateOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

export async function createOtpChallenge(phone: string, purpose: string) {
    const { prisma } = await import('@/lib/prisma');
    const code = generateOtp();
    const codeHash = await bcrypt.hash(code, 10);

    const record = await prisma.verificationCode.create({
        data: {
            phone,
            purpose,
            codeHash,
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
        },
    });

    return { challengeId: String(record.id), code };
}

export async function checkOtpChallenge(
    challengeId: string,
    code: string,
    expectedPurpose: string,
): Promise<{ ok: true; phone: string } | { ok: false; reason: OtpCheckFail }> {
    const { prisma } = await import('@/lib/prisma');

    const record = await prisma.verificationCode.findUnique({
        where: { id: challengeId },
    });

    if (!record || record.purpose !== expectedPurpose) {
        return { ok: false, reason: 'NOT_FOUND' };
    }
    if (record.expiresAt < new Date()) {
        return { ok: false, reason: 'EXPIRED' };
    }
    if ((record.attempts ?? 0) >= OTP_MAX_ATTEMPTS) {
        return { ok: false, reason: 'TOO_MANY_TRIES' };
    }

    const matched = await bcrypt.compare(code, record.codeHash);
    if (!matched) {
        await prisma.verificationCode.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
        });
        return { ok: false, reason: 'INVALID' };
    }

    // success
    await prisma.verificationCode.delete({ where: { id: record.id } });
    return { ok: true, phone: record.phone };
}
