'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { LoginInput } from '@/lib/validation/login';
import { loginActionRHF } from '@/server/auth/login';
import { useTranslations } from 'next-intl';

export default function PopupLogin() {
    const t = useTranslations('auth.login');
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (values: LoginInput) => {
        const res = await loginActionRHF(values);
        if (res?.fieldErrors) {
            Object.entries(res.fieldErrors).forEach(([name, message]) => {
                setError(name as keyof LoginInput, { type: 'server', message });
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
                <Button>{t('login')}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('login')}</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3"
                >
                    <label>
                        <span className="text-sm">{t('email_label')}</span>
                        <Input
                            id="email"
                            type="email"
                            required
                            {...register('email', {
                                required: t('email_label_placeholder'),
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
                    <label>
                        <span className="text-sm">{t('password_label')}</span>
                        <Input
                            id="password"
                            type="password"
                            required
                            {...register('password', {
                                required: t('password_pattern_error'),
                            })}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </label>
                    <Button type="submit">{t('login')}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
