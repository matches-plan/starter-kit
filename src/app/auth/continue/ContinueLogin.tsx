import { ArrowLeft, LogIn } from 'lucide-react';
import Link from 'next/link';
import LoginForm from '../_client/ContinueLoginForm';

export default function LoginPage() {
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
                        이전으로
                    </Link>

                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <LogIn className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl tracking-tight">계정 연결하기</h1>
                        </div>
                        <p className="text-muted-foreground">
                            기존 이메일 계정과 계정을 연결해주세요
                        </p>
                    </div>
                </div>

                <LoginForm />

                {/* 추가 옵션 */}
                <div className="space-y-4">
                    {/* 구분선 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">또는</span>
                        </div>
                    </div>

                    {/* 회원가입 링크 */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            아직 계정이 없으신가요?{' '}
                            <Link
                                href="?step=signup"
                                className="text-primary hover:underline"
                            >
                                새 계정 만들기
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
