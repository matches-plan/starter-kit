'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Key, Mail } from 'lucide-react';

import type { LoginInput } from '@/lib/validation/login';
import { loginActionRHF } from '@/server/auth/login';

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        defaultValues: {
            email: '',
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
        <Card>
            <CardHeader>
                <CardTitle>로그인 정보 입력</CardTitle>
                <CardDescription>기존에 가입한 이메일과 비밀번호를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* 이메일 입력 */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="flex items-center space-x-2"
                        >
                            <Mail className="h-4 w-4" />
                            <span>이메일 주소</span>
                        </Label>
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
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    {/* 비밀번호 입력 */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="password"
                            className="flex items-center space-x-2"
                        >
                            <Key className="h-4 w-4" />
                            <span>비밀번호</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={'password'}
                                placeholder="비밀번호를 입력하세요"
                                required
                                className="pr-10"
                                {...register('password', {
                                    required: '비밀번호가 올바르지 않습니다.',
                                })}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            ></Button>
                        </div>
                    </div>

                    {/* 비밀번호 찾기 링크 */}
                    <div className="text-right">
                        <button
                            type="button"
                            className="text-sm text-primary hover:underline"
                        >
                            비밀번호를 잊으셨나요?
                        </button>
                    </div>

                    {/* 로그인 버튼 */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        계정 연결하기
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
