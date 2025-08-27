'use client';

import { Input } from '@/components/ui/input';

export default function Uploader({ objectPath }: { objectPath: string }) {
    async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        const objectKey = `${objectPath}${file?.name}`;
        if (file) {
            const response = await fetch('/api/storage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objectKey, contentType: file.type }),
            });
            const { url } = await response.json();
            // Upload the file to the presigned URL
            await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });
        }
    }
    return (
        <Input
            id="picture"
            type="file"
            className="md:w-fit w-full"
            onChange={onChange}
        />
    );
}
