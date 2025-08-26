import 'server-only'; // 클라 번들 유입 방지
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email('올바른 이메일을 입력하세요.'),
    password: z.string().min(8, '8자 이상').max(32, '32자 이하'),
    name: z.string().min(1, '이름은 필수입니다.'),
    phone: z.string().regex(/^\d{10,11}$/, '숫자 10~11자'),
});

export async function createUser(raw: {
    email: string;
    password: string;
    name: string;
    phone: string;
}) {
    const parsed = signupSchema.safeParse({
        email: raw.email.trim().toLowerCase(),
        password: raw.password.trim(),
        name: raw.name.trim(),
        phone: raw.phone.replace(/\D/g, ''),
    });
    if (!parsed.success) return { ok: false as const, error: parsed.error.flatten() };

    const { email, password, name, phone } = parsed.data;

    try {
        const exists = await prisma.user.findUnique({ where: { email } });

        if (exists)
            return { ok: false as const, error: { formErrors: ['이미 가입된 이메일입니다.'] } };

        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.create({ data: { email, name, phone, passwordHash } });
        return { ok: true as const };
    } catch (e: unknown) {
        if (typeof e === 'object' && e !== null && 'code' in e && (e as { code?: string }).code === 'P2002') {
            return { ok: false as const, error: { formErrors: ['이미 가입된 이메일입니다.'] } };
        }
        throw e;
    }
}
