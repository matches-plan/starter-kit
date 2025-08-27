import 'server-only';

import {
    S3Client,
    HeadObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ENDPOINT = process.env.STORAGE_ENDPOINT;
const ACCESS_KEY_ID = process.env.STORAGE_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.STORAGE_SECRET_ACCESS_KEY;
const BUCKET = process.env.STORAGE_BUCKET;

const S3 = new S3Client({
    region: 'auto',
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID ?? '',
        secretAccessKey: SECRET_ACCESS_KEY ?? '',
    },
});

async function headObject(objectKey: string) {
    const data = await S3.send(
        new HeadObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
        }),
    );
    return data;
}

/**
 *
 * @param MaxKeys 최대 개수 (default: 1000개)
 *
 * @param Prefix 접두사 (폴더 경로)
 */
async function listObjects({ MaxKeys, Prefix }: { MaxKeys?: number; Prefix?: string }) {
    const data = await S3.send(
        new ListObjectsV2Command({
            Bucket: BUCKET,
            MaxKeys,
            Prefix,
        }),
    );
    return data;
}

async function downloadObject(objectKey: string) {
    return await S3.send(
        new GetObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
        }),
    );
}

async function deleteObject(objectKey: string) {
    await S3.send(
        new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
        }),
    );
}

async function deleteObjects(objectKeys: string[]) {
    await S3.send(
        new DeleteObjectsCommand({
            Bucket: BUCKET,
            Delete: {
                Objects: objectKeys.map(key => ({ Key: key })),
            },
        }),
    );
}

async function getPresignedUrl(objectKey: string) {
    const url = await getSignedUrl(
        S3,
        new GetObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
        }),
    );

    return url;
}

async function putPresignedUrl(objectKey: string, contentType: string) {
    console.log(BUCKET);

    const url = await getSignedUrl(
        S3,
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
            ContentType: contentType,
        }),
    );

    return url;
}

export {
    headObject,
    listObjects,
    getPresignedUrl,
    putPresignedUrl,
    downloadObject,
    deleteObject,
    deleteObjects,
};
