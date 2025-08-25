export { auth as middleware } from "@/auth"

// 로그인 필요 경로를 matcher에 지정.
export const config = {
    matcher: ['/dashboard/:path*', '/settings/:path*'],
};
