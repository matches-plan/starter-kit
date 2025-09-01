'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import type { LoginInput } from '@/lib/validation/login';
import { Link } from '@/i18n/navigation';
import KakaoLoginButton from '@/components/auth/KakaoLoginButton';
import { useTranslations } from 'next-intl';
import { loginActionRHF } from '@/server/auth/login';
import { ROUTES } from '../../../../../config/routes';

type Props = React.ComponentProps<'div'> & {
    returnTo?: string;
    step?: string;
};

export function LoginForm({ returnTo, className, step, ...props }: Props) {
    const t = useTranslations('login');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        defaultValues: { email: '', password: '' },
        mode: 'onSubmit',
    });

    const onSubmit = async (values: LoginInput) => {
        const searchParams = returnTo ? returnTo : '';
        const res = await loginActionRHF(values, searchParams, ROUTES.AFTER_LOGIN);
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
                    <CardTitle className="text-xl">{t('title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                {/* 이메일 */}
                                <div className="grid gap-3">
                                    <Label htmlFor="email">{t('email_label')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        required
                                        {...register('email', {
                                            required: t('email_label') + '을(를) 입력해주세요.',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    t('email_label') + ' 형식이 올바르지 않습니다.',
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* 비밀번호 */}
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">{t('password_label')}</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="off"
                                        placeholder={t('password_placeholder')}
                                        required
                                        {...register('password', {
                                            required:
                                                t('password_label') + '이(가) 올바르지 않습니다.',
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* 로그인 버튼 */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {t('login_button')}
                                </Button>

                                {/* 이메일/비밀번호 찾기 */}
                                <div className="flex justify-center gap-1 text-sm">
                                    <Link
                                        href={`?action=find-email`}
                                        className="text-muted-foreground hover:text-primary hover:underline"
                                    >
                                        {/* ko.json에 별도 키 없어서 문구 하드코딩 or 추가 키 만들기 */}
                                        이메일 찾기
                                    </Link>
                                    <span className="text-muted-foreground">|</span>
                                    <Link
                                        href={`?action=find-password`}
                                        className="text-muted-foreground hover:text-primary hover:underline"
                                    >
                                        {t('forgot_password_link')}
                                    </Link>
                                </div>

                                {/* 회원가입 링크 */}
                                <p className="text-center text-sm text-muted-foreground">
                                    {t('no_account')}{' '}
                                    <Link
                                        href="/auth/signup"
                                        className="underline underline-offset-4"
                                    >
                                        {t('sign_up_link')}
                                    </Link>
                                </p>

                                {!step && (
                                    <>
                                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                                {t('social_login')}
                                            </span>
                                        </div>

                                        <KakaoLoginButton
                                            returnTo={returnTo}
                                            className="w-full bg-[#FEE500] text-black hover:bg-[#F7DA00]"
                                        >
                                            {/* ko.json에 kakao 키가 없으니 기본 문구를 fallback으로 */}
                                            {t('kakao_login', { default: '카카오로 로그인' })}
                                        </KakaoLoginButton>
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
