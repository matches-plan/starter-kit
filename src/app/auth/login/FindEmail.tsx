'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@radix-ui/react-label';
import { ArrowLeft, MinusIcon, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { CODE_MAP } from '@/components/api/auth';
import { useRef } from 'react';

type FindEmailInput = { name: string; phone: string };
type VerifyInput = { code: string };

export function FindEmail({ className, ...props }: React.ComponentProps<'div'>) {
    const searchParam = useSearchParams();

    const phase = (searchParam.get('phase') as 'form' | 'verify' | 'done') ?? 'form';
    const qName = searchParam.get('name') ?? '';
    const qPhone = searchParam.get('phone') ?? '';
    const challengeId = searchParam.get('challenge') ?? '';
    const codeParam = searchParam.get('code') ?? '';

    const doneEmails =
        phase === 'done'
            ? decodeURIComponent(searchParam.get('emails') ?? '')
                  .split('|')
                  .filter(Boolean)
            : [];

    const lock = phase !== 'form';

    // ── 1단계: 이름/전화 폼
    const {
        control,
        register,
        handleSubmit: handleSend,
        formState: { errors: sendErrors },
        watch,
    } = useForm<FindEmailInput>({
        defaultValues: { name: qName || '', phone: qPhone || '' },
    });
    const phoneValue = watch('phone') ?? '';
    const sendFormRef = useRef<HTMLFormElement>(null);

    const submitSend = handleSend(() => {
        sendFormRef.current?.submit();
    });

    // ── 2단계: 인증번호 폼
    const {
        register: registerVerify,
        handleSubmit: handleVerify,
        formState: { errors: verifyErrors },
    } = useForm<VerifyInput>({ defaultValues: { code: '' } });

    const verifyFormRef = useRef<HTMLFormElement>(null);
    const submitVerify = handleVerify(() => {
        verifyFormRef.current?.submit();
    });

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
                                <CardTitle className="text-xl">이메일 찾기</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {phase === 'form' && '가입 시 입력하신 정보를 입력해주세요'}
                                {phase === 'verify' && '전송된 6자리 인증번호를 입력해주세요'}
                                {phase === 'done' && '확인이 완료되었습니다'}
                            </p>
                            {codeParam && (
                                <p className="mt-2 text-sm text-destructive">
                                    {CODE_MAP[codeParam] ?? codeParam}
                                </p>
                            )}
                        </CardHeader>

                        <CardContent>
                            {/* 1단계: 이름/전화 */}
                            <form
                                ref={sendFormRef}
                                method="post"
                                action="/api/auth/email/find/send"
                                onSubmit={submitSend}
                                className="grid gap-6"
                            >
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
                                        readOnly={lock}
                                        disabled={lock}
                                        defaultValue={qName}
                                        {...register('name', { required: true, minLength: 2 })}
                                    />
                                    {sendErrors.name && (
                                        <p className="text-xs text-destructive">
                                            이름을 올바르게 입력해주세요.
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
                                            required: true,
                                            validate: v =>
                                                /^\d{10,11}$/.test((v ?? '').replace(/\D/g, '')),
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
                                            전화번호 형식이 올바르지 않습니다.
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

                            {/* 2단계: 인증번호 */}
                            {phase === 'verify' && (
                                <form
                                    ref={verifyFormRef}
                                    method="post"
                                    action="/api/auth/email/find/verify"
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
                                        name="name"
                                        value={qName}
                                    />

                                    <Label htmlFor="code">인증번호 6자리</Label>
                                    <Input
                                        id="code"
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

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            type="submit"
                                        >
                                            인증하기
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* 3단계: 결과 */}
                            {phase === 'done' && (
                                <div className="mt-6 grid gap-3">
                                    {doneEmails.length > 0 ? (
                                        <ul className="list-disc pl-5 text-sm">
                                            {doneEmails.map((e, i) => (
                                                <li key={i}>{e}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            해당 정보로 가입된 계정을 찾을 수 없습니다.
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <Link
                                            href="/auth/login"
                                            className="flex-1"
                                        >
                                            <Button className="w-full">로그인하러 가기</Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
