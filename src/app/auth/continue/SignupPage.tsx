import Link from 'next/link';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignupForm from './_client/SignupForm';

export default function SignupPage({ provider }: { provider?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-4">
                    <Link
                        href="?step=continue"
                        className="p-0 h-auto flex items-center hover:bg-transparent"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        이전으로
                    </Link>

                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl tracking-tight">가입 완료하기</h1>
                        </div>
                        <p className="text-muted-foreground">
                            서비스 이용을 위한 추가 정보를 입력해주세요
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>추가 정보 입력</CardTitle>
                        <CardDescription>
                            이메일과 전화번호를 입력하여 계정을 완성해주세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignupForm provider={provider} />
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        이미 계정이 있으신가요?{' '}
                        <Link
                            href="?step=continue"
                            className="text-primary hover:underline"
                        >
                            다시 선택하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
