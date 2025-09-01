import { GalleryVerticalEnd } from 'lucide-react';
import SignupForm from '../_client/SignupForm';
import { Card, CardContent } from '@/components/ui/card';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-2">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Acme Inc.
                </a>
            </div>
            <Card>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    );
}
