import { deleteObject, downloadObject, putPresignedUrl } from '@/lib/storage';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export async function POST(req: Request) {
    const { objectKey, contentType } = await req.json();
    const url = await putPresignedUrl(objectKey, contentType);
    return new Response(JSON.stringify({ url }));
}

export async function GET(req: Request) {
    const key = new URL(req.url).searchParams.get('key');
    if (!key) return Response.json({ error: 'key required' }, { status: 400 });

    const out = await downloadObject(key);
    if (!out.Body) return Response.json({ error: 'no body' }, { status: 404 });

    const stream =
        typeof (out.Body as any).transformToWebStream === 'function'
            ? (out.Body as any).transformToWebStream()
            : (await import('stream')).Readable.toWeb(out.Body as Readable);

    const headers = new Headers();
    headers.set('Content-Type', out.ContentType ?? 'application/octet-stream');
    headers.set(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(key.split('/').pop() || 'download')}`,
    );
    if (out.ContentLength != null) headers.set('Content-Length', String(out.ContentLength));
    return new Response(stream, { headers });
}

export async function DELETE(req: Request) {
    const key = new URL(req.url).searchParams.get('key');
    if (!key) return Response.json({ error: 'key required' }, { status: 400 });

    await deleteObject(key);
    return new Response(null, { status: 204 });
}
