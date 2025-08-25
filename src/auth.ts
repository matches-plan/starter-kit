import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const signInSchema = z.object({
    email: z.string().email('올바른 이메일을 입력하세요.'),
    password: z.string().min(8).max(32),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: { email: { type: 'email' }, password: { type: 'password' } },
            async authorize(raw) {
                try {
                    const { email, password } = await signInSchema.parseAsync(raw);

                    const DEMO_EMAIL = 'demo@example.com';
                    const DEMO_PASS = 'pass1234';

                    console.log(password);
                    console.log(DEMO_PASS);

                    const emailNorm = email.trim().toLowerCase();
                    const passNorm = password.trim();

                    if (emailNorm !== DEMO_EMAIL) {
                        throw new CredentialsSignin('Credentials failed', {
                            cause: { code: 'USER_NOT_FOUND' },
                        });
                    }
                    if (passNorm !== DEMO_PASS) {
                        throw new CredentialsSignin('Credentials failed', {
                            cause: { code: 'INVALID_PASSWORD' },
                        });
                    }
                    return { id: 'demo-user', email, name: 'Demo User' };
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
    ],
    pages: { signIn: '/auth/login', error: '/auth/login' },
});
