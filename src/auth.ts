// src/auth.ts
import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';
import { z } from 'zod';
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcrypt';

const signInSchema = z.object({
    email: z.email('올바른 이메일을 입력하세요.'),
    password: z.string().min(8).max(32),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: { email: { type: 'email' }, password: { type: 'password' } },
            async authorize(raw) {
                try {
                    const { email, password } = await signInSchema.parseAsync(raw);

                    const { prisma } = await import('@/lib/prisma');
                    const bcrypt = await import('bcrypt');

                    const user = await prisma.user.findUnique({
                        where: { email: email.trim().toLowerCase() },
                    });
                    if (!user || !user.passwordHash) {
                        throw new CredentialsSignin('Credentials failed', {
                            cause: { code: 'USER_NOT_FOUND' },
                        });
                    }
                    const ok = await bcrypt.compare(password.trim(), user.passwordHash);
                    if (!ok) {
                        throw new CredentialsSignin('Credentials failed', {
                            cause: { code: 'INVALID_PASSWORD' },
                        });
                    }
                    return { id: user.id, email: user.email, name: user.name ?? undefined };
                } catch (e) {
                    if (e instanceof z.ZodError) {
                        throw new CredentialsSignin('Credentials failed', {
                            cause: { code: 'VALIDATION_ERROR' },
                        });
                    }
                    throw e;
                }
            },
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
    ],
    pages: { signIn: '/auth/login', error: '/auth/login' },
    callbacks: {
        authorized({ auth }) {
            return !!auth; // 미들웨어에서 사용할 로그인 가드
        },
        async jwt({ token, user }) {
            type UserType = { id: string; email?: string; name?: string | null };
            if (user) token.id = (user as UserType).id; // 로그인 시 1회 주입
            return token;
        },
        async session({ session, token }) {
            type SessionUserWithId = typeof session.user & { id: string };
            if (session.user && token.id) {
                (session.user as SessionUserWithId).id = token.id as string;
            }
            return session;
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30일
    },
});
