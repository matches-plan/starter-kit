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
import { useTranslations } from 'next-intl';

export default function PopupSignup() {
    const t = useTranslations('auth.signup');
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
                <Button variant="outline">{t('signup')}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{t('signup')}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3"
                >
                    <label className="grid gap-1">
                        <span className="text-sm">{t('email_label')}</span>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            {...register('email', {
                                required: t('email_required'),
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: t('email_pattern_error'),
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </label>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="grid gap-1">
                            <span className="text-sm">{t('name_label')}</span>
                            <Input
                                id="name"
                                type="text"
                                placeholder={t('name_placeholder')}
                                required
                                {...register('name', {
                                    required: t('name_required'),
                                })}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name.message}</p>
                            )}
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm">{t('phone_label')}</span>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="010-1234-5678"
                                required
                                {...register('phone', {
                                    required: t('phone_required'),
                                    pattern: {
                                        value: /^\d{11}$/,
                                        message: t('phone_pattern_error'),
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
                            <span className="text-sm">{t('password_label')}</span>
                            <Input
                                id="password"
                                type="password"
                                required
                                {...register('password', {
                                    required: t('password_required'),
                                })}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm">{t('password_confirm_label')}</span>
                            <Input
                                id="passwordConfirm"
                                type="password"
                                required
                                {...register('passwordConfirm', {
                                    required: t('password_confirm_required'),
                                    validate: v =>
                                        v === getValues('password') || t('password_confirm_error'),
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
                        </label>
                        <label className="flex items-center gap-2 text-sm">
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
                                                {t('agreeMarketing_label')}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                {t('agreeMarketing_required')}
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
                        {t('signup')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
