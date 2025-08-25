// /src/middleware.ts  (보호 경로가 있을 때만)
export { auth as middleware } from '@/auth';
export const config = { matcher: ['/protected/:path*'] };
