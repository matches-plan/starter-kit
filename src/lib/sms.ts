export interface SendSMSProps {
    sender: string;
    receiver: string[]; // ['01012345678']
    msg: string;
    title?: string;
}
export interface SendSMSResponse {
    result_code: string; // '1' = success
    message: string; // 'success'
    success_cnt?: number;
    error_cnt?: number;
    msg_id?: string;
    msg_type?: string;
}

const SMS_API_URL = process.env.SMS_API_URL; // 예: https://...cloudtype.app
if (!SMS_API_URL) {
    throw new Error('SMS_API_URL is not set');
}

export async function sendSMS(body: SendSMSProps): Promise<SendSMSResponse> {
    const res = await fetch(`${SMS_API_URL}/message/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error(`SMS API HTTP ${res.status}`);
    }
    const data = (await res.json()) as SendSMSResponse;
    if (data.result_code !== '1') {
        throw new Error(data.message || 'SMS failed');
    }
    return data;
}
