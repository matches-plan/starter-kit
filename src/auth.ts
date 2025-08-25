import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// Your own logic for dealing with plaintext password strings; be careful!
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { email, object, string } from 'zod';

export const signInSchema = object({
    email: email('Email is required'),
    password: string('Password is required')
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {
                    type: 'email',
                    label: 'Email',
                },
                password: {
                    type: 'password',
                    label: 'Password',
                },
            },
            authorize: async (credentials) => {
                let user = null;

                const { email, password } = await signInSchema.parseAsync(
                    credentials
                );

                // logic to salt and hash password
                const pwHash = await bcrypt.hash(password, 12);

                // logic to verify if the user exists
                user = await prisma.user.findFirst({
                    where: {
                        email: email,
                        passwordHash: pwHash,
                    },
                });

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error('Invalid credentials.');
                }

                // return user object with their profile data
                return {
                    id: user.id,
                    email: user.email,
                };
            },
        }),
        // 2) Google (예시)
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),

        // 3) Kakao, Naver 등도 필요시 추가
    ],
    callbacks: {
        async signIn() {
            // 로그인 성공 시 추가 작업
            return true;
        },
        async jwt({ token, user }) {
            // 최초 로그인 시 user.id를 토큰에 포함
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }) {
            // 클라이언트에서 session.user.id 접근 가능하게
            if (token?.id && session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        // 커스텀 페이지 사용 시 설정 (선택)
        signIn: '/auth/login',
        error: '/auth/login', // ?error= 쿼리로 확인
    },
});
