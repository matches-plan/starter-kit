// src/components/auth/AuthClientProvider.tsx  (Client Component)
'use client';

import type { SessionPayload } from '@/lib/auth';
import { createContext, useContext } from 'react';

const AuthContext = createContext<SessionPayload | null>(null);

export default function AuthClientProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: SessionPayload | null;
}) {
    return <AuthContext.Provider value={initialUser}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
