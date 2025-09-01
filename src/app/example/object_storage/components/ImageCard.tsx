'use client';

import { deleteObject, getDownloadLink } from '@/components/api/storage';
import { useAuth } from '@/components/auth/AuthClientProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Download, Trash2 } from 'lucide-react';

export default function ImageCard({
    objectKey,
    url,
    reloadData,
}: {
    objectKey: string;
    url: string;
    reloadData: () => Promise<void>;
}) {
    const user = useAuth();
    return (
        <Card>
            <CardHeader>{objectKey}</CardHeader>
            <CardContent>
                <img
                    src={url}
                    alt={objectKey}
                />
            </CardContent>
            <CardFooter className="gap-2">
                <Button asChild>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Image
                    </a>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="icon"
                >
                    <a
                        href={getDownloadLink(objectKey)}
                        download
                    >
                        <Download />
                    </a>
                </Button>
                <Button
                    disabled={!user}
                    variant="outline"
                    size="icon"
                    className="border-red-400 text-red-400 hover:bg-red-600 hover:text-red-50"
                    onClick={async () => {
                        await deleteObject(objectKey);
                        reloadData();
                    }}
                >
                    <Trash2 />
                </Button>
            </CardFooter>
        </Card>
    );
}
