import { z } from 'zod';
import { redirect } from 'next/navigation';

export const signupSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8, '8자 이상 입력해주세요.'),
        passwordConfirm: z.string().min(8),
        phone: z.string().regex(/^\d{11}$/, '전화번호 형식이 올바르지 않습니다.'),
        agreeTerms: z.boolean().refine(Boolean, { message: '약관 동의는 필수입니다.' }),
        agreePrivacy: z.boolean().refine(Boolean, { message: '개인정보 동의는 필수입니다.' }),
        agreeMarketing: z.boolean().optional(),
        provider: z.string().optional(),
    })
    .refine(d => d.password === d.passwordConfirm, {
        message: '비밀번호가 일치하지 않습니다.',
        path: ['passwordConfirm'],
    });

export type SignupInput = z.infer<typeof signupSchema>;

export async function signupActionRHF(
    data: SignupInput,
): Promise<{ fieldErrors?: Record<string, string> }> {
    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? 'form');
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        return { fieldErrors };
    }

    const { email, password, phone, provider } = data;

    console.log(email);
    console.log(password);
    console.log(phone);
    console.log(provider);

    /**
     * account db 에 저장
     *
     */

    redirect('/dashboard');
}
