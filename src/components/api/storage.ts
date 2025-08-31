import 'client-only';

export async function uploadFile(file: File, objectKey: string) {
    try {
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
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

export function getDownloadLink(objectKey: string) {
    return `/api/storage?key=${encodeURIComponent(objectKey)}`;
}

export function deleteObject(objectKey: string) {
    return fetch(`/api/storage?key=${encodeURIComponent(objectKey)}`, {
        method: 'DELETE',
    });
}
