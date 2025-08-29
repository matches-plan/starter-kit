export const ROUTES = {
    // 로그인 성공 후 기본 경로
    AFTER_LOGIN: '/dashboard',
    // 회원가입 성공 후 기본 경로
    AFTER_SIGNUP: '/continue',
    // 로그아웃 후 경로
    AFTER_LOGOUT: '/auth/login',
    // 인증된 사용자만 접근 가능한 Prefix들
    SIGNED_PREFIXES: ['/dashboard', '/payment'],
    // 로그인 상태에서 접근하면 안 되는 Prefix들 (ex. /auth)
    UNSIGNED_PREFIXES: ['/auth'],
} as const;
