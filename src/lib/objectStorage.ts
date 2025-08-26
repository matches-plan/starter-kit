import {
    S3Client,
    HeadObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ENDPOINT = process.env.ENDPOINT;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const BUCKET = process.env.BUCKET;

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

export { headObject, listObjects, getPresignedUrl };
