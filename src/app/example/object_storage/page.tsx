import Uploader from '@/app/example/object_storage/components/Uploader';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { getPresignedUrl, listObjects } from '@/lib/storage';

export default async function ObjectStoragePage() {
    const data = await listObjects({});

    return (
        <div className="flex flex-col gap-4 p-4">
            <Uploader objectPath={`test/`} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.Contents?.filter(item => item.Key).map(async item => {
                    const url = await getPresignedUrl(item.Key!);
                    return (
                        <Card>
                            <CardHeader>{item.Key}</CardHeader>
                            <CardContent>
                                <img
                                    src={url}
                                    alt={item.Key!}
                                />
                            </CardContent>
                            <CardFooter>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Image
                                </a>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
