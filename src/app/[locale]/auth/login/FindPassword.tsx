'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { ArrowLeft, Mail, MinusIcon, Phone, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';

type FindPasswordInput = { email: string; name: string; phone: string };
type VerifyInput = { code: string };
type ResetInput = { newPassword: string; confirmPassword: string };

export function FindPassword({ className, ...props }: React.ComponentProps<'div'>) {
    const searchParam = useSearchParams();
    const phase = (searchParam.get('phase') as 'form' | 'verify' | 'reset') ?? 'form';
    const qEmail = searchParam.get('email') ?? '';
    const qName = searchParam.get('name') ?? '';
    const qPhone = searchParam.get('phone') ?? '';
    const codeParam = searchParam.get('code') ?? '';
    const challengeId = searchParam.get('challenge') ?? '';

    const lock = phase !== 'form';

    // 1) 요청 폼
    const {
        control,
        register,
        handleSubmit: handleSend,
        formState: { errors: sendErrors },
        watch,
    } = useForm<FindPasswordInput>({
        defaultValues: { email: qEmail, name: qName, phone: qPhone },
    });
    const phoneValue = watch('phone') ?? '';
    const sendFormRef = useRef<HTMLFormElement>(null);
    const submitSend = handleSend(() => sendFormRef.current?.submit());

    // 2) 인증 폼
    const {
        register: registerVerify,
        handleSubmit: handleVerify,
        formState: { errors: verifyErrors },
    } = useForm<VerifyInput>({ defaultValues: { code: '' } });
    const verifyFormRef = useRef<HTMLFormElement>(null);
    const submitVerify = handleVerify(() => verifyFormRef.current?.submit());

    // 3) 비번 변경 폼
    const {
        register: registerReset,
        handleSubmit: handleReset,
        formState: { errors: resetErrors },
    } = useForm<ResetInput>();
    const resetFormRef = useRef<HTMLFormElement>(null);
    const submitReset = handleReset(() => resetFormRef.current?.submit());

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div
                    className={cn('flex flex-col gap-6', className)}
                    {...props}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="p-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                                <CardTitle className="text-xl">비밀번호 찾기</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {phase === 'form' && '가입 시 입력하신 정보를 입력해주세요'}
                                {phase === 'verify' && '전송된 6자리 인증번호를 입력해주세요'}
                                {phase === 'reset' && '새 비밀번호를 설정해주세요'}
                            </p>
                            {codeParam && (
                                <p className="mt-2 text-sm text-destructive">{codeParam}</p>
                            )}
                        </CardHeader>

                        <CardContent>
                            {/* 1단계: 이메일/이름/전화 */}
                            <form
                                ref={sendFormRef}
                                method="post"
                                action="/api/auth/password/reset/send"
                                onSubmit={submitSend}
                                className="grid gap-6"
                            >
                                <div className="grid gap-3">
                                    <Label
                                        htmlFor="email"
                                        className="flex items-center gap-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        이메일
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        required
                                        readOnly={lock}
                                        disabled={lock}
                                        {...register('email', {
                                            required: '이메일을 입력해주세요.',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: '이메일 형식이 올바르지 않습니다.',
                                            },
                                        })}
                                    />
                                    {sendErrors.email && (
                                        <p className="text-xs text-destructive">
                                            {sendErrors.email.message as string}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <Label
                                        htmlFor="name"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        이름
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="홍길동"
                                        required
                                        readOnly={lock}
                                        disabled={lock}
                                        {...register('name', {
                                            required: '이름을 입력해주세요.',
                                            minLength: {
                                                value: 2,
                                                message: '이름은 2자 이상 입력해주세요.',
                                            },
                                        })}
                                    />
                                    {sendErrors.name && (
                                        <p className="text-xs text-destructive">
                                            {sendErrors.name.message as string}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <Label
                                        htmlFor="phone"
                                        className="flex items-center gap-2"
                                    >
                                        <Phone className="h-4 w-4" />
                                        전화번호
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="phone"
                                        rules={{
                                            required: '전화번호를 입력해주세요.',
                                            validate: v =>
                                                /^\d{10,11}$/.test((v ?? '').replace(/\D/g, '')) ||
                                                '전화번호 형식이 올바르지 않습니다.',
                                        }}
                                        render={({ field: { value, onChange } }) => (
                                            <>
                                                <InputOTP
                                                    maxLength={11}
                                                    value={lock ? qPhone : value ?? ''}
                                                    onChange={val =>
                                                        onChange(
                                                            (val ?? '')
                                                                .replace(/\D/g, '')
                                                                .slice(0, 11),
                                                        )
                                                    }
                                                    disabled={lock}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={0}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={1}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={2}
                                                            className="w-8"
                                                        />
                                                    </InputOTPGroup>
                                                    <MinusIcon />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={3}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={4}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={5}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={6}
                                                            className="w-8"
                                                        />
                                                    </InputOTPGroup>
                                                    <MinusIcon />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={7}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={8}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={9}
                                                            className="w-8"
                                                        />
                                                        <InputOTPSlot
                                                            index={10}
                                                            className="w-8"
                                                        />
                                                    </InputOTPGroup>
                                                </InputOTP>

                                                {/* 서버로 숫자만 전송 */}
                                                <input
                                                    type="hidden"
                                                    name="phone"
                                                    value={(lock ? qPhone : phoneValue).replace(
                                                        /\D/g,
                                                        '',
                                                    )}
                                                />
                                            </>
                                        )}
                                    />
                                    {sendErrors.phone && (
                                        <p className="text-xs text-destructive">
                                            {sendErrors.phone.message as string}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={lock}
                                >
                                    인증번호 받기
                                </Button>
                            </form>

                            {/* 2단계: OTP 입력 */}
                            {phase === 'verify' && (
                                <form
                                    ref={verifyFormRef}
                                    method="post"
                                    action="/api/auth/password/reset/verify"
                                    onSubmit={submitVerify}
                                    className="mt-6 grid gap-3"
                                >
                                    {/* 컨텍스트 전달 */}
                                    <input
                                        type="hidden"
                                        name="challengeId"
                                        value={challengeId}
                                    />
                                    <input
                                        type="hidden"
                                        name="email"
                                        value={qEmail}
                                    />
                                    <input
                                        type="hidden"
                                        name="name"
                                        value={qName}
                                    />

                                    <Label htmlFor="otpCode">인증번호 6자리</Label>
                                    <Input
                                        id="otpCode"
                                        {...registerVerify('code', {
                                            required: true,
                                            validate: v => /^\d{6}$/.test((v ?? '').trim()),
                                        })}
                                        name="code"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="123456"
                                        autoComplete="one-time-code"
                                    />
                                    {verifyErrors.code && (
                                        <p className="text-xs text-destructive">
                                            6자리 숫자를 입력해주세요.
                                        </p>
                                    )}

                                    <Button
                                        className="w-full"
                                        type="submit"
                                    >
                                        인증하기
                                    </Button>
                                </form>
                            )}

                            {/* 3단계: 새 비밀번호 설정 */}
                            {phase === 'reset' && (
                                <form
                                    ref={resetFormRef}
                                    method="post"
                                    action="/api/auth/password/update"
                                    onSubmit={submitReset}
                                    className="mt-6 grid gap-4"
                                >
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="newPassword"
                                            className="flex items-center gap-2"
                                        >
                                            <Lock className="h-4 w-4" />새 비밀번호
                                        </Label>
                                        <Input
                                            id="newPassword"
                                            {...registerReset('newPassword', {
                                                required: true,
                                                minLength: 8,
                                            })}
                                            name="newPassword"
                                            type="password"
                                            minLength={8}
                                            required
                                        />
                                        {resetErrors.newPassword && (
                                            <p className="text-xs text-destructive">
                                                8자 이상 입력해주세요.
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="confirmPassword"
                                            className="flex items-center gap-2"
                                        >
                                            <Lock className="h-4 w-4" />새 비밀번호 확인
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            {...registerReset('confirmPassword', {
                                                required: true,
                                                minLength: 8,
                                            })}
                                            name="confirmPassword"
                                            type="password"
                                            minLength={8}
                                            required
                                        />
                                    </div>
                                    <Button
                                        className="w-full"
                                        type="submit"
                                    >
                                        비밀번호 변경
                                    </Button>
                                </form>
                            )}

                            <div className="text-center mt-6">
                                <p className="text-sm text-muted-foreground">
                                    계정이 기억나셨나요?{' '}
                                    <Link
                                        href="/auth/login"
                                        className="text-primary hover:underline"
                                    >
                                        로그인하기
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
