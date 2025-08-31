import { z } from 'zod';

export const findEmailSchema = z.object({
    name: z.string().min(2, '이름은 2자 이상 입력해주세요.'),
    // 숫자만 10~11자리 허용 (통신사 별 길이 차이 고려)
    phone: z.string().regex(/^\d{10,11}$/, '전화번호 형식이 올바르지 않습니다.'),
});

export type FindEmailInput = z.infer<typeof findEmailSchema>;
