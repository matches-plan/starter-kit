// next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';

// User 모델 확장
declare module 'next-auth' {
    interface User extends DefaultUser {
        id: string;
        email: string;
        name?: string | null;
        image?: string | null;
        phone?: string | null;
        passwordHash?: string | null; // Credentials 로그인용
    }

    interface Session {
        user: {
            id: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
    }
}
