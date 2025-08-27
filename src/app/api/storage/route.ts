import { putPresignedUrl } from '@/lib/storage';

export async function POST(req: Request) {
    const { objectKey, contentType } = await req.json();
    const url = await putPresignedUrl(objectKey, contentType);
    return new Response(JSON.stringify({ url }));
}
