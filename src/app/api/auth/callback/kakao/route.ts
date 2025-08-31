// app/api/kakao/callback/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { createSession } from '@/lib/auth';

interface KakaoUser {
    id: number;
    kakao_account?: {
        email?: string;
        profile?: {
            nickname?: string;
        };
    };
    properties?: {
        nickname?: string;
        profile_image?: string;
    };
}

const KAUTH_TOKEN = 'https://kauth.kakao.com/oauth/token';
const KAPI_ME = 'https://kapi.kakao.com/v2/user/me';

async function exchangeToken(code: string) {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
    });
    if (process.env.KAKAO_CLIENT_SECRET) {
        body.set('client_secret', process.env.KAKAO_CLIENT_SECRET);
    }

    const res = await fetch(KAUTH_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body,
    });

    if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
    return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

async function fetchKakaoUser(accessToken: string): Promise<KakaoUser> {
    const res = await fetch(KAPI_ME, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Fetch user failed: ${res.status} ${await res.text()}`);
    return res.json() as Promise<KakaoUser>;
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');

        if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

        const cookieStore = await cookies();

        cookieStore.delete('kakao_oauth_state');

        const { access_token } = await exchangeToken(code);

        const kakao = await fetchKakaoUser(access_token);

        const kakaoId = String(kakao.id);
        const email = kakao.kakao_account?.email ?? null;
        const nickname =
            kakao.properties?.nickname ?? kakao.kakao_account?.profile?.nickname ?? null;
        const image = kakao.properties?.profile_image ?? null;

        const { prisma } = await import('@/lib/prisma');

        const account = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: 'kakao',
                    providerAccountId: kakaoId,
                },
            },
        });

        if (account) {
            // 2-a) 이미 연결된 계정 → 해당 user로 세션 발급 후 대시보드
            const user = await prisma.user.findUnique({ where: { id: account.userId } });
            if (!user) {
                // 이론상 userId는 필수지만 방어적으로 컨티뉴로 보냄
                const res = NextResponse.redirect(`${process.env.AUTH_URL!}/auth/continue`);
                res.cookies.set(
                    'pending_oauth',
                    JSON.stringify({
                        provider: 'kakao',
                        providerAccountId: kakaoId,
                        email,
                        nickname,
                    }),
                    {
                        httpOnly: true,
                        sameSite: 'lax',
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                        maxAge: 60 * 10,
                    },
                );
                return res;
            }

            const token = await createSession({
                id: user.id,
                email: user.email,
                image: user.image ?? null,
            });

            const redirect_to = cookieStore.get('return_to')?.value;

            const res = NextResponse.redirect(
                `${process.env.AUTH_URL!}${
                    typeof redirect_to === 'string' && redirect_to !== ''
                        ? redirect_to
                        : '/dashboard'
                }`,
            );
            res.cookies.set('session', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60,
            });
            return res;
        }

        const res = NextResponse.redirect(`${process.env.AUTH_URL!}/auth/continue`);
        res.cookies.set(
            'pending_oauth',
            JSON.stringify({
                provider: 'kakao',
                providerAccountId: kakaoId,
                email,
                nickname,
                image: image,
            }),
            {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 10,
            },
        );
        return res;
    } catch (e) {
        console.error('[kakao-callback]', e);
        return NextResponse.json(
            { error: 'Kakao callback failed', detail: String(e) },
            { status: 500 },
        );
    }
}
