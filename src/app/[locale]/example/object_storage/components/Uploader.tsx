'use client';

import { uploadFile } from '@/components/api/storage';
import { useAuth } from '@/components/auth/AuthClientProvider';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';

export default function Uploader({
    objectPath,
    reloadData,
}: {
    objectPath: string;
    reloadData: () => Promise<void>;
}) {
    const user = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);
    async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        const ext = file?.name.split('.').pop();
        const objectKey = `${objectPath}${Date.now()}.${ext}`;
        if (file) {
            await uploadFile(file, objectKey);
            inputRef.current!.value = '';
            await reloadData();
        }
    }
    return (
        <Input
            disabled={!user}
            ref={inputRef}
            id="picture"
            type="file"
            className="md:w-fit w-full"
            onChange={onChange}
        />
    );
}
