export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const KAUTH_AUTHORIZE = 'https://kauth.kakao.com/oauth/authorize';

export async function GET(req: Request) {
    const redirectTo = new URL(req.url).searchParams.get('redirect');
    const state = redirectTo ?? '';

    // const cookieStore = await cookies();

    // cookieStore.set('kakao_oauth_state', state, {
    //     httpOnly: true,
    //     sameSite: 'lax',
    //     secure: false,
    //     path: '/',
    //     maxAge: 60 * 5,
    // });

    const url = new URL(KAUTH_AUTHORIZE);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', process.env.KAKAO_CLIENT_ID!);
    url.searchParams.set('redirect_uri', process.env.KAKAO_REDIRECT_URI!);
    url.searchParams.set('state', state);

    return NextResponse.redirect(url.toString());
}
