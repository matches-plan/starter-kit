'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import type { LoginInput } from '@/lib/validation/login';
import { loginActionRHF } from '../_actions/login';

type Props = React.ComponentProps<'div'> & {
    redirectTo?: string;
    step?: string;
};

export function LoginForm({ redirectTo, className, step, ...props }: Props) {
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
    };

    return (
        <div
            className={cn('flex flex-col gap-6', className)}
            {...props}
        >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">환영합니다</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
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
                                        <p className="text-xs text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
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
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    Login
                                </Button>

                                {!step && (
                                    <>
                                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                                Or continue with
                                            </span>
                                        </div>

                                        <a
                                            href={`/api/kakao/login?redirect=${redirectTo}`}
                                            className="w-full bg-[#FEE500] text-black hover:bg-[#F7DA00]"
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                aria-hidden
                                                className="mr-2"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                />
                                            </svg>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
