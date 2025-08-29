import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus } from 'lucide-react';
import ContinueSignup from './ContinueSignup';
import { cookies } from 'next/headers';
import ContinueLogin from './ContinueLogin';

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ provider?: string; step?: string }>;
}) {
    const [resolvedParams] = await Promise.all([searchParams]);

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
                    <h1 className="text-2xl tracking-tight">반갑습니다! 👋</h1>
                    <p className="text-muted-foreground">계정 상태를 확인해주세요</p>
                </div>

                <div className="space-y-3">
                    <Card className="transition-all hover:shadow-md border-2 hover:border-primary/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">이미 회원입니다</CardTitle>
                                    <CardDescription>
                                        이전에 이메일로 회원가입을 진행한 적이 있어요
                                    </CardDescription>
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
                                    기존 계정으로 연결하기
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
                                    <CardTitle className="text-lg">처음 가입합니다</CardTitle>
                                    <CardDescription>
                                        이메일로 회원가입을 한 적이 없어요
                                    </CardDescription>
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
                                    새 계정 만들기
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        잘 모르겠다면 <span className="text-primary">도움말</span>을 확인해보세요
                    </p>
                </div>
            </div>
        </div>
    );
}
