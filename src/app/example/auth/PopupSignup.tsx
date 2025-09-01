'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Controller, useForm } from 'react-hook-form';

import type { SignupInput as FormValues } from '@/lib/validation/signup';
import { signupActionRHF } from '@/server/auth/signup';
import { Label } from '@/components/ui/label';

export default function PopupSignup() {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        getValues,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: '',
            name: '',
            password: '',
            passwordConfirm: '',
            phone: '',
            agreeTerms: false,
            agreePrivacy: false,
            agreeMarketing: false,
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (values: FormValues) => {
        const res = await signupActionRHF(values);
        if (res?.fieldErrors) {
            Object.entries(res.fieldErrors).forEach(([name, message]) => {
                setError(name as keyof FormValues, { type: 'server', message });
            });
            return;
        }

        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline">회원가입</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>회원가입</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3"
                >
                    <label className="grid gap-1">
                        <span className="text-sm">이메일</span>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            {...register('email', {
                                required: '이메일을 입력해주세요.',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: '이메일 형식이 올바르지 않습니다.',
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </label>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="grid gap-1">
                            <span className="text-sm">이름</span>
                            <Input
                                id="name"
                                type="text"
                                placeholder="홍길동"
                                required
                                {...register('name', {
                                    required: '이름을 입력해주세요.',
                                })}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name.message}</p>
                            )}
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm">전화번호</span>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="010-1234-5678"
                                required
                                {...register('phone', {
                                    required: '전화번호를 입력해주세요.',
                                    pattern: {
                                        value: /^\d{11}$/,
                                        message: '전화번호 형식이 올바르지 않습니다.',
                                    },
                                })}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">{errors.phone.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="grid gap-1">
                            <span className="text-sm">비밀번호</span>
                            <Input
                                id="password"
                                type="password"
                                required
                                {...register('password', {
                                    required: '비밀번호를 입력해주세요.',
                                })}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm">비밀번호 확인</span>
                            <Input
                                id="passwordConfirm"
                                type="password"
                                required
                                {...register('passwordConfirm', {
                                    required: '비밀번호 확인을 입력해주세요.',
                                    validate: v =>
                                        v === getValues('password') ||
                                        '비밀번호가 일치하지 않습니다.',
                                })}
                            />
                            {errors.passwordConfirm && (
                                <p className="text-xs text-destructive">
                                    {errors.passwordConfirm.message}
                                </p>
                            )}
                        </label>
                    </div>

                    <div className="mt-2 grid gap-2">
                        <label className="flex items-center gap-2 text-sm">
                            <Controller
                                control={control}
                                name="agreeTerms"
                                rules={{ validate: v => v || '약관 동의는 필수입니다.' }}
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <Checkbox
                                            id="agreeTerms"
                                            checked={value}
                                            onCheckedChange={v => onChange(Boolean(v))}
                                        />
                                        <Label
                                            htmlFor="agreeTerms"
                                            className="text-sm cursor-pointer"
                                        >
                                            <span className="text-destructive">*</span> 서비스
                                            이용약관에 동의합니다
                                        </Label>
                                    </>
                                )}
                            />
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <Controller
                                control={control}
                                name="agreePrivacy"
                                rules={{ validate: v => v || '개인정보 동의는 필수입니다.' }}
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <Checkbox
                                            id="agreePrivacy"
                                            checked={value}
                                            onCheckedChange={v => onChange(Boolean(v))}
                                        />
                                        <Label
                                            htmlFor="agreePrivacy"
                                            className="text-sm cursor-pointer"
                                        >
                                            <span className="text-destructive">*</span> 개인정보
                                            처리방침에 동의합니다
                                        </Label>
                                    </>
                                )}
                            />
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <Controller
                                control={control}
                                name="agreeMarketing"
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <Checkbox
                                            id="agreeMarketing"
                                            checked={value}
                                            onCheckedChange={v => onChange(Boolean(v))}
                                        />
                                        <div>
                                            <Label
                                                htmlFor="agreeMarketing"
                                                className="text-sm cursor-pointer"
                                            >
                                                마케팅 정보 수신에 동의합니다 (선택)
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                이벤트, 혜택 등의 알림을 받을 수 있습니다
                                            </p>
                                        </div>
                                    </>
                                )}
                            />
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-2"
                    >
                        가입하기
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
