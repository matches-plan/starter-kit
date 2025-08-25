import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <Card className={cn('w-full max-w-md', className)}>
            <CardHeader>
                <CardTitle className="text-2xl">회원가입</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="grid w-full items-center gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">이메일</Label>
                        <Input id="email" type="email" placeholder="이메일" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="비밀번호"
                        />
                    </div>
                    {/* 이름 */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">이름</Label>
                        <Input id="name" type="text" placeholder="이름" />
                    </div>
                    {/* 전화번호 */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="phone">전화번호</Label>
                        <Input id="phone" type="tel" placeholder="전화번호" />
                    </div>
                    <Button type="submit">회원가입</Button>
                </form>
            </CardContent>
        </Card>
    );
}
