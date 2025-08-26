'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus } from 'lucide-react';
import { useState, use } from 'react';
import SignupPage from './SignupPage';

type PageType = 'continue' | 'signup';

export default function ContinuePage({
    searchParams,
}: {
    searchParams: Promise<{ provider?: string }>;
}) {
    const [currentPage, setCurrentPage] = useState<PageType>('continue');
    const { provider } = use(searchParams);

    const handleExistingUser = () => {
        // 기존 회원 로직 처리
        console.log('기존 회원으로 로그인');
        // 실제로는 router.push('/dashboard') 등으로 이동
    };

    const handleNewUser = () => {
        console.log('신규 회원가입 진행');
        setCurrentPage('signup');
    };

    const handleBackToContinue = () => {
        setCurrentPage('continue');
    };

    if (currentPage === 'signup') {
        return (
            <SignupPage
                provider={(provider ?? 'SNS').toLowerCase()}
                onBack={handleBackToContinue}
            />
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                {/* 헤더 영역 */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl tracking-tight">반갑습니다! 👋</h1>
                    <p className="text-muted-foreground">계정 상태를 확인해주세요</p>
                </div>

                {/* 선택 카드들 */}
                <div className="space-y-3">
                    {/* 기존 회원 카드 */}
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
                        <CardContent className="pt-0 cursor-pointer">
                            <Button
                                className="w-full cursor-pointer"
                                size="lg"
                            >
                                기존 계정으로 연결하기
                            </Button>
                        </CardContent>
                    </Card>

                    {/* 신규 회원 카드 */}
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
                        <CardContent className="pt-0 cursor-pointer">
                            <Button
                                onClick={handleNewUser}
                                variant="secondary"
                                className="w-full cursor-pointer"
                                size="lg"
                            >
                                새 계정 만들기
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* 도움말 */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        잘 모르겠다면{' '}
                        <button className="text-primary hover:underline">도움말</button>을
                        확인해보세요
                    </p>
                </div>
            </div>
        </div>
    );
}
