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

export default function PopupLogin() {
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
                <Button>로그인</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>로그인</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3"
                >
                    <label>
                        <span className="text-sm">이메일</span>
                        <Input
                            id="email"
                            type="email"
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
                    <label>
                        <span className="text-sm">비밀번호</span>
                        <Input
                            id="password"
                            type="password"
                            required
                            {...register('password', {
                                required: '비밀번호가 올바르지 않습니다.',
                            })}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </label>
                    <Button type="submit">로그인</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
