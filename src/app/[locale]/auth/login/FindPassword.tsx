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
import { useTranslations } from 'next-intl';

type FindPasswordInput = { email: string; name: string; phone: string };
type VerifyInput = { code: string };
type ResetInput = { newPassword: string; confirmPassword: string };

export function FindPassword({ className, ...props }: React.ComponentProps<'div'>) {
    const searchParam = useSearchParams();
    const t = useTranslations('auth.findPassword');
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
                                <CardTitle className="text-xl">{t('title')}</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {phase === 'form' && t('subtitle.form')}
                                {phase === 'verify' && t('subtitle.verify')}
                                {phase === 'reset' && t('subtitle.reset')}
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
                                        {t('email_label')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        required
                                        readOnly={lock}
                                        disabled={lock}
                                        {...register('email', {
                                            required: t('email_required'),
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: t('email_pattern_error'),
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
                                        {t('name_label')}
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('name_placeholder')}
                                        required
                                        readOnly={lock}
                                        disabled={lock}
                                        {...register('name', {
                                            required: t('name_required'),
                                            minLength: {
                                                value: 2,
                                                message: t('name_pattern_error'),
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
                                        {t('phone_label')}
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="phone"
                                        rules={{
                                            required: t('phone_placeholder'),
                                            validate: v =>
                                                /^\d{10,11}$/.test((v ?? '').replace(/\D/g, '')) ||
                                                t('phone_pattern_error'),
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
                                    {t('send_code_button')}
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

                                    <Label htmlFor="otpCode">{t('code_label')}</Label>
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
                                        placeholder={t('code_placeholder')}
                                        autoComplete="one-time-code"
                                    />
                                    {verifyErrors.code && (
                                        <p className="text-xs text-destructive">
                                            {t('code_pattern_error')}
                                        </p>
                                    )}

                                    <Button
                                        className="w-full"
                                        type="submit"
                                    >
                                        {t('verify_button')}
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
                                            <Lock className="h-4 w-4" />{t('new_password_label')}
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
                                                {t('new_password_pattern_error')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="confirmPassword"
                                            className="flex items-center gap-2"
                                        >
                                            <Lock className="h-4 w-4" />{t('new_password_confirm_label')}
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
                                        {t('password_change')}
                                    </Button>
                                </form>
                            )}

                            <div className="text-center mt-6">
                                <p className="text-sm text-muted-foreground">
                                    {t('remember_account')}{' '}
                                    <Link
                                        href="/auth/login"
                                        className="text-primary hover:underline"
                                    >
                                        {t('login_button')}
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
