export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
const KAUTH_AUTHORIZE = 'https://kauth.kakao.com/oauth/authorize';

export async function GET(req: Request) {
    const return_to = new URL(req.url).searchParams.get('return_to');
    const state = return_to ?? '';

    const url = new URL(KAUTH_AUTHORIZE);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', process.env.KAKAO_CLIENT_ID!);
    url.searchParams.set('redirect_uri', process.env.KAKAO_REDIRECT_URI!);
    url.searchParams.set('state', state);

    return NextResponse.redirect(url.toString());
}
