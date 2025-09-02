import { downloadObject, getPresignedUrl, listObjects } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import ImageCard from './components/ImageCard';
import Uploader from './components/Uploader';

export default async function ObjectStoragePage() {
    let data = await listObjects({});

    async function reloadData() {
        'use server';
        revalidatePath('/example/object_storage');
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <Uploader
                objectPath={`test/`}
                reloadData={reloadData}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.Contents?.filter(item => item.Key).map(async item => {
                    const url = await getPresignedUrl(item.Key!);

                    return (
                        <ImageCard
                            key={item.Key}
                            objectKey={item.Key!}
                            url={url}
                            reloadData={reloadData}
                        />
                    );
                })}
            </div>
        </div>
    );
}
