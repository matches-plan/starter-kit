import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus } from 'lucide-react';
import ContinueSignup from './ContinueSignup';
import { cookies } from 'next/headers';
import ContinueLogin from './ContinueLogin';
import { getTranslations } from 'next-intl/server';

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ provider?: string; step?: string }>;
}) {
    const [resolvedParams] = await Promise.all([searchParams]);
    const t = await getTranslations('auth.continue');

    const step =
        resolvedParams?.step === 'login'
            ? 'login'
            : resolvedParams?.step === 'signup'
            ? 'signup'
            : 'continue';

    const cookieStore = await cookies();
    const cookie = cookieStore.get('pending_oauth')?.value;

    const { email } = cookie ? JSON.parse(cookie) : {};

    if (step === 'login') {
        return <ContinueLogin step={step} />;
    }

    if (step === 'signup') {
        return <ContinueSignup snsEmail={email} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl tracking-tight">{t('title')} 👋</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>

                <div className="space-y-3">
                    <Card className="transition-all hover:shadow-md border-2 hover:border-primary/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">
                                        {t('options.member.title')}
                                    </CardTitle>
                                    <CardDescription>{t('options.member.desc')}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Link
                                href={`?step=login`}
                                className="w-full"
                            >
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    size="lg"
                                >
                                    {t('options.member.button')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md border-2 hover:border-primary/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-secondary/80 rounded-lg">
                                    <UserPlus className="h-5 w-5 text-secondary-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">
                                        {t('options.new.title')}
                                    </CardTitle>
                                    <CardDescription>{t('options.new.desc')}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Link
                                href={`?step=signup`}
                                className="block"
                            >
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    size="lg"
                                >
                                    {t('options.new.button')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        {t.rich('help.text', {
                            em: chunks => <span className="text-primary">{chunks}</span>,
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
