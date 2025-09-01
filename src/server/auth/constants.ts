import 'server-only';

export const SMS_SENDER = process.env.SMS_SENDER || '01000000000';
export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5 as const;

export const PURPOSE = {
    findId: 'find_id',
    resetPw: 'reset_pw',
} as const;

export const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
