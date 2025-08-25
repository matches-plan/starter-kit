import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// Kakao, Naver 등도 필요시 import
import bcrypt from 'bcrypt';
import { z } from 'zod';

const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(72),
});

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    providers: [
        // 1) Credentials (이메일/비번)
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.passwordHash) return null;

                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;

                const authUser: NextAuthUser = {
                    id: user.id,
                    name: user.name ?? undefined,
                    email: user.email,
                    image: user.image ?? undefined,
                };
                return authUser;
            },
        }),

        // 2) Google (예시)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // 3) Kakao, Naver 등도 필요시 추가
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        // 커스텀 페이지 사용 시 설정 (선택)
        signIn: '/login',
        error: '/login', // ?error= 쿼리로 확인
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
