// src/auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';
import { z } from 'zod';

const signInSchema = z.object({
    email: z.string().email('올바른 이메일을 입력하세요.'),
    password: z.string().min(8).max(32),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: { email: { type: 'email' }, password: { type: 'password' } },
            async authorize(raw) {
                const { email, password } = await signInSchema.parseAsync(raw);
                const { prisma } = await import('@/lib/prisma');
                const bcrypt = await import('bcrypt');

                const user = await prisma.user.findUnique({
                    where: { email: email.trim().toLowerCase() },
                });
                if (!user || !user.passwordHash) return null;

                const ok = await bcrypt.compare(password.trim(), user.passwordHash);
                if (!ok) return null;

                return { id: user.id, email: user.email, name: user.name ?? undefined };
            },
        }),

        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
            account({
                providerAccountId,
                access_token,
                refresh_token,
                scope,
                id_token,
                expires_at,
            }) {
                console.log('Kakao account info:', {
                    providerAccountId,
                    access_token,
                    refresh_token,
                    scope,
                    id_token,
                    expires_at,
                });
            },
        }),
    ],

    session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
    pages: { signIn: '/auth/login', error: '/auth/login' },

    callbacks: {
        authorized({ auth }) {
            return !!auth;
        },
        async jwt({ token, user, account }) {
            if (user) token.id = user.id;

            if (account?.provider === 'kakao') {
                token.kakaoAccess = account.access_token;
                token.kakaoRefresh = account.refresh_token;
                token.kakaoScope = account.scope;
                token.kakaoIdToken = account.id_token;
                token.kakaoExpiresAt = account.expires_at;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },

    events: {
        async linkAccount({ user, account }) {
            if (account.provider === 'kakao') {
                console.log('Kakao linked to user:', user.id, account.providerAccountId);
            }
        },
    },
});
