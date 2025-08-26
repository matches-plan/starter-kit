'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SignupActionResult } from '@/app/auth/signup/actions';
import { Label } from '@/components/ui/label';

type Props = React.ComponentProps<'div'> & {
    action: (formData: FormData) => Promise<SignupActionResult>;
};
type Errors = Partial<Record<'email' | 'password' | 'name' | 'phone', string>>;

export function SignupForm({ className, action, ...props }: Props) {
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const formatPhone = (value: string) => {
        const onlyNums = value.replace(/\D/g, '');
        if (onlyNums.length < 4) return onlyNums;
        if (onlyNums.length < 8) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    };

    const validate = (fd: FormData): Errors => {
        const email = String(fd.get('email') ?? '').trim();
        const password = String(fd.get('password') ?? '').trim();
        const name = String(fd.get('name') ?? '').trim();
        const phone = String(fd.get('phone') ?? '').trim();

        const next: Errors = {};

        // 이메일
        if (!email) next.email = '이메일을 입력해 주세요.';
        else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = '올바른 이메일 형식이 아닙니다.';

        // 비밀번호 (8~32)
        if (!password) next.password = '비밀번호를 입력해 주세요.';
        else if (password.length < 8) next.password = '8자 이상 입력해 주세요.';
        else if (password.length > 32) next.password = '32자 이하로 입력해 주세요.';

        // 이름 (선택이라면 제거 가능)
        if (!name) next.name = '이름을 입력해 주세요.';

        // phone 은 하이픈 빼고 검사
        const digits = phone.replace(/\D/g, '');
        if (!digits) next.phone = '전화번호를 입력해 주세요.';
        else if (!/^\d{10,11}$/.test(digits)) next.phone = '숫자만 10~11자 입력해 주세요.';

        return next;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const v = validate(fd);
        setErrors(v);

        if (Object.keys(v).length) return;

        try {
            setSubmitting(true);
            const r: SignupActionResult = await action(fd); // 🔹결과 받기
            if (!r.ok) {
                const fe = r.error.fieldErrors ?? {};
                setErrors({
                    email: fe.email?.[0],
                    password: fe.password?.[0],
                    name: fe.name?.[0],
                    phone: fe.phone?.[0],
                });
                setFormError(r.error.formErrors?.join('\n') ?? null); // 🔹상단 전역 에러
                return;
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card
            className={cn('w-full max-w-md', className)}
            {...props}
        >
            <CardHeader>
                <CardTitle className="text-2xl">회원가입</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="grid w-full items-center gap-4"
                    onSubmit={handleSubmit}
                >
                    {/* 🔹폼 상단에 전역 에러 표시 */}
                    {formError && (
                        <p
                            role="alert"
                            className="text-sm text-red-600"
                        >
                            {formError}
                        </p>
                    )}

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="이메일"
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="비밀번호"
                            aria-invalid={!!errors.password}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">이름</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="이름"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="phone">전화번호</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="010-1234-5678"
                            value={phone}
                            onChange={e => setPhone(formatPhone(e.target.value))}
                            aria-invalid={!!errors.phone}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? '처리 중…' : '회원가입'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
