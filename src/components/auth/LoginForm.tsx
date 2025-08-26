// /src/components/auth/LoginForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation'; // (선택) next 파라미터 복귀용
import { signIn } from 'next-auth/react';

type Props = React.ComponentProps<'div'> & {
    action: (formData: FormData) => void | Promise<void>;
};

export function LoginForm({ className, action, ...props }: Props) {
    const search = useSearchParams();
    // const next = search?.get('next') ?? '/dashboard'; // 로그인 후 돌아갈 경로
    // const [kakaoLoading, setKakaoLoading] = useState(false);

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
                    <form action={action}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="m@example.com"
                                        required
                                    />
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
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                >
                                    Login
                                </Button>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>

                                {/* ✅ Kakao 로그인 버튼 */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full bg-[#FEE500] text-black hover:bg-[#F7DA00]"
                                    onClick={() => signIn('kakao', { redirect: true, redirectTo: '/api/auth/callback/kakao' })}
                                >
                                    {/* 심플 아이콘 */}
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
                                    {/* {kakaoLoading ? 'Redirecting…' : '카카오로 로그인'} */}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
