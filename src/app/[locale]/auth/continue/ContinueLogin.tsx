import { ArrowLeft, LogIn } from 'lucide-react';
import Link from 'next/link';
import { LoginForm } from '../_client/LoginForm';
import { useTranslations } from 'next-intl';

export default function LoginPage({ step }: { step: string }) {
    const t = useTranslations('auth.continueLogin');

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                {/* 헤더 영역 */}
                <div className="space-y-4">
                    <Link
                        href="?step=continue"
                        className="flex items-center p-0 h-auto hover:bg-transparent"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back')}
                    </Link>

                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <LogIn className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl tracking-tight">{t('title')}</h1>
                        </div>
                        <p className="text-muted-foreground">{t('description')}</p>
                    </div>
                </div>

                <LoginForm step={step} />

                {/* 추가 옵션 */}
                <div className="space-y-4">
                    {/* 구분선 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                {t('or')}
                            </span>
                        </div>
                    </div>

                    {/* 회원가입 링크 */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            {t('no_account')}{' '}
                            <Link
                                href="?step=signup"
                                className="text-primary hover:underline"
                            >
                                {t('signup_link')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
