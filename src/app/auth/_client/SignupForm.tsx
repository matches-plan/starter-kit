'use client';

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Phone, ShieldCheck, Key, MinusIcon } from 'lucide-react';
import { signupActionRHF } from '../../../server/auth/signup';

import type { SignupInput as FormValues } from '@/lib/validation/signup';

export default function SignupForm({ snsEmail }: { snsEmail?: string }) {
    const {
        register,
        handleSubmit,
        control,
        setError,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            email: snsEmail || '',
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
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {/* 이메일 */}
            <div className="space-y-1">
                <Label
                    htmlFor="email"
                    className="flex items-center gap-2"
                >
                    <Mail className="h-4 w-4" />
                    <span>이메일 주소 *</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    aria-invalid={!!errors.email}
                    {...register('email', {
                        required: '이메일을 입력해주세요.',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: '이메일 형식이 올바르지 않습니다.',
                        },
                    })}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* 이름 */}
            <div className="space-y-1">
                <Label
                    htmlFor="name"
                    className="flex items-center gap-2"
                >
                    <Mail className="h-4 w-4" />
                    <span>이름 *</span>
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="이름"
                    aria-invalid={!!errors.name}
                    {...register('name', {
                        required: '이름을 입력해주세요.',
                        minLength: { value: 2, message: '이름은 2자 이상 입력해주세요.' },
                    })}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-1">
                <Label
                    htmlFor="password"
                    className="flex items-center gap-2"
                >
                    <Key className="h-4 w-4" />
                    <span>비밀번호 *</span>
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    aria-invalid={!!errors.password}
                    {...register('password', {
                        required: '비밀번호를 입력해주세요.',
                        minLength: { value: 8, message: '8자 이상 입력해주세요.' },
                    })}
                />
                {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-1">
                <Label
                    htmlFor="passwordConfirm"
                    className="flex items-center gap-2"
                >
                    <ShieldCheck className="h-4 w-4" />
                    <span>비밀번호 확인 *</span>
                </Label>
                <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="비밀번호 확인"
                    aria-invalid={!!errors.passwordConfirm}
                    {...register('passwordConfirm', {
                        required: '비밀번호 확인을 입력해주세요.',
                        validate: v =>
                            v === getValues('password') || '비밀번호가 일치하지 않습니다.',
                    })}
                />
                {errors.passwordConfirm && (
                    <p className="text-xs text-destructive">{errors.passwordConfirm.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label
                    htmlFor="phone"
                    className="flex items-center gap-2"
                >
                    <Phone className="h-4 w-4" />
                    <span>전화번호 *</span>
                </Label>
                <Controller
                    control={control}
                    name="phone"
                    rules={{
                        required: '전화번호를 입력해주세요.',
                        validate: v =>
                            /^\d{11}$/.test(v ?? '') || '전화번호 형식이 올바르지 않습니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                        <InputOTP
                            maxLength={11}
                            value={value ?? ''}
                            onChange={val => onChange((val ?? '').replace(/\D/g, '').slice(0, 11))}
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
                    )}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
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
                                    <span className="text-destructive">*</span> 서비스 이용약관에
                                    동의합니다
                                </Label>
                            </>
                        )}
                    />
                </div>
                {errors.agreeTerms && (
                    <p className="text-xs text-destructive">{errors.agreeTerms.message}</p>
                )}

                <div className="flex items-center gap-3">
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
                                    <span className="text-destructive">*</span> 개인정보 처리방침에
                                    동의합니다
                                </Label>
                            </>
                        )}
                    />
                </div>
                {errors.agreePrivacy && (
                    <p className="text-xs text-destructive">{errors.agreePrivacy.message}</p>
                )}

                <div className="flex items-start gap-3">
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
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
            >
                {isSubmitting ? '가입 중...' : '가입 완료하기'}
            </Button>
        </form>
    );
}
