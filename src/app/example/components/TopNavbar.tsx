'use client';

import { useAuth } from '@/components/auth/AuthClientProvider';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import PopupLogin from '../auth/popupLogin';
import PopupSignup from '../auth/PopupSignup';
import { Button } from '@/components/ui/button';
import { signoutAction } from '@/server/auth/signout';

export function TopNavbar() {
    const user = useAuth();

    console.log(user);

    return (
        <header className="w-full border-b bg-background">
            <div className="flex h-14 items-center justify-between px-6">
                {/* 왼쪽: 로고 및 검색 */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                            <span className="text-primary-foreground text-sm font-medium">L</span>
                        </div>
                        <span className="hidden lg:block font-medium">Your App</span>
                    </div>

                    {user && (
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="검색..."
                                className="pl-9 bg-muted/50"
                            />
                        </div>
                    )}
                </div>

                {/* 오른쪽: 사용자 메뉴 */}
                <div className="flex items-center gap-2">
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <PopupLogin />
                            <PopupSignup />
                        </div>
                    ) : (
                        // 로그인한 상태
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>

                            <div>{user.name}</div>
                            <Button onClick={() => signoutAction()}>로그아웃</Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
