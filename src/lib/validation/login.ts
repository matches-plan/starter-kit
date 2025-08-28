import z from 'zod';

export const loginSchema = z.object({
    email: z.string().email("올바른 이메일을 입력해주세요.").max(100),
    password: z.string().min(8).max(100),
    redirectTo: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;