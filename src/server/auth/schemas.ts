import 'server-only';
import { z } from 'zod';

export const idRequestSchema = z.object({
    name: z.string().min(2, '이름은 2자 이상 입력해주세요.').trim(),
    phone: z
        .string()
        .transform(v => v.replace(/\D/g, ''))
        .refine(v => /^\d{10,11}$/.test(v), '전화번호 형식이 올바르지 않습니다.'),
});

export const idVerifySchema = z.object({
    challengeId: z.string().min(1),
    code: z.string().regex(/^\d{6}$/, '인증번호 6자리를 입력해주세요.'),
    name: z.string().min(2).trim(),
});

export const resetRequestSchema = z.object({
    email: z.string().email('이메일 형식이 올바르지 않습니다.').trim().toLowerCase(),
    name: z.string().min(2).trim(),
    phone: z
        .string()
        .transform(v => v.replace(/\D/g, ''))
        .refine(v => /^\d{10,11}$/.test(v), '전화번호 형식이 올바르지 않습니다.'),
});

export const resetVerifySchema = z.object({
    challengeId: z.string().min(1),
    code: z.string().regex(/^\d{6}$/),
    email: z.string().email().toLowerCase(),
    name: z.string().min(2).trim(),
});

export const passwordUpdateSchema = z
    .object({
        resetToken: z.string().min(1),
        newPassword: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
        confirmPassword: z.string(),
    })
    .refine(d => d.newPassword === d.confirmPassword, {
        path: ['confirmPassword'],
        message: '비밀번호가 일치하지 않습니다.',
    });
