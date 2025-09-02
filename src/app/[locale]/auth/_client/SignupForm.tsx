'use client';

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Phone, ShieldCheck, Key, MinusIcon } from 'lucide-react';

import type { SignupInput as FormValues } from '@/lib/validation/signup';
import { signupActionRHF } from '@/server/auth/signup';
import { useTranslations } from 'next-intl';
import { ROUTES } from '../../../../../config/routes';

export default function SignupForm({ snsEmail }: { snsEmail?: string }) {
    const t = useTranslations('auth.signup');

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
        const res = await signupActionRHF(values, ROUTES.AFTER_SIGNUP);
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
                    <span>{t('email_label')} *</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('email_placeholder')}
                    aria-invalid={!!errors.email}
                    {...register('email', {
                        required: t('email_required'),
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t('email_pattern_error'),
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
                    <span>{t('name_label')} *</span>
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder={t('name_placeholder')}
                    aria-invalid={!!errors.name}
                    {...register('name', {
                        required: t('name_required'),
                        minLength: { value: 2, message: t('name_pattern_error') },
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
                    <span>{t('password_label')} *</span>
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder={t('password_placeholder')}
                    aria-invalid={!!errors.password}
                    {...register('password', {
                        required: t('password_required'),
                        minLength: { value: 8, message: t('password_pattern_error') },
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
                    <span>{t('password_confirm_label')} *</span>
                </Label>
                <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder={t('password_confirm_placeholder')}
                    aria-invalid={!!errors.passwordConfirm}
                    {...register('passwordConfirm', {
                        required: t('password_confirm_required'),
                        validate: v => v === getValues('password') || t('password_confirm_error'),
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
                    <span>{t('phone_label')} *</span>
                </Label>
                <Controller
                    control={control}
                    name="phone"
                    rules={{
                        required: t('phone_required'),
                        validate: v => /^\d{11}$/.test(v ?? '') || t('phone_pattern_error'),
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
                        rules={{ validate: v => v || t('agreeTerms_required') }}
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
                                    <span className="text-destructive">*</span>{' '}
                                    {t('agreeTerms_label')}
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
                        rules={{ validate: v => v || t('agreePrivacy_required') }}
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
                                    <span className="text-destructive">*</span>{' '}
                                    {t('agreePrivacy_label')}
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
                                        {t('agreeMarketing_required')}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        {t('agreeMarketing_label')}
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
                {isSubmitting ? t('signing') : t('signup')}
            </Button>
        </form>
    );
}
