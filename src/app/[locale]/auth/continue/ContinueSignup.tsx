import Link from 'next/link';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignupForm from '../_client/SignupForm';
import { useTranslations } from 'next-intl';

export default function SignupPage({ snsEmail }: { snsEmail?: string }) {
    const t = useTranslations('auth.continueSignup');

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-4">
                    <Link
                        href="?step=continue"
                        className="p-0 h-auto flex items-center hover:bg-transparent"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back')}
                    </Link>

                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl tracking-tight">{t('title')}</h1>
                        </div>
                        <p className="text-muted-foreground">{t('description')}</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('card_title')}</CardTitle>
                        <CardDescription>{t('card_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignupForm snsEmail={snsEmail} />
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        {t.rich('already.rich', {
                            link: chunks => (
                                <Link
                                    href="?step=continue"
                                    className="text-primary hover:underline"
                                >
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
