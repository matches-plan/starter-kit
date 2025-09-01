import 'client-only';

type ApiOk<T> = { ok: true; data: T & { redirectTo?: string | null } };
type ApiErr = { ok: false; code: string; fieldErrors?: Record<string, string> };
export type ApiResult<T> = ApiOk<T> | ApiErr;

export const CODE_MAP: Record<string, string> = {
    VALIDATION_ERROR: '입력값을 확인해주세요.',
    SEND_FAILED: '인증번호 전송에 실패했습니다.',
    VERIFY_FAILED: '인증번호 확인에 실패했습니다.',
    INVALID: '인증번호가 올바르지 않습니다.',
    EXPIRED: '인증번호가 만료되었습니다.',
    TOO_MANY_TRIES: '시도 횟수를 초과했습니다.',
    NOT_FOUND: '인증 세션을 찾을 수 없습니다.',
    USER_NOT_FOUND: '해당 정보를 찾을 수 없습니다.',
    TOKEN_INVALID: '토큰이 유효하지 않습니다.',
};

const BASE = '/api/auth';

async function call<T>(path: string, body: unknown): Promise<ApiResult<T>> {
    const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body ?? {}),
    });
    const json = await res.json().catch(() => ({}));
    return json as ApiResult<T>;
}

export const AuthApi = {
    findEmailSend: (input: { name: string; phone: string }) =>
        call<{ challengeId: string }>('/email/find/send', input),

    findEmailVerify: (input: { challengeId: string; code: string; name: string }) =>
        call<{ emails: string[] }>('/email/find/verify', input),
};
