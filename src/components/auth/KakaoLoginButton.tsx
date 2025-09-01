export default function KakaoLoginButton({
    returnTo,
    children,
    ...props
}: { returnTo?: string } & React.ComponentProps<'a'>) {
    return (
        <a href={`/api/kakao/login?return_to=${returnTo}`} {...props}>
           {children}
        </a>
    );
}
