// src/app/example/auth/page.tsx
import { Suspense } from 'react';
import PopupLogin from './popupLogin';
import PopupSignup from './PopupSignup';
// import PopupFindId from './popup-find-id';
// import PopupReset from './popup-reset';
import { signupActionRHF } from '@/server/auth/signup';

export default function ExampleAuthPage() {
    async function signupFromPopup(formData: FormData) {
        'use server';
        const email = String(formData.get('email') || '');
        const name = String(formData.get('name') || '');
        const password = String(formData.get('password') || '');
        const passwordConfirm = String(formData.get('passwordConfirm') || '');
        const phone = String(formData.get('phone') || '');
        const agreeTerms = formData.get('agreeTerms') === 'on';
        const agreePrivacy = formData.get('agreePrivacy') === 'on';
        const agreeMarketing = formData.get('agreeMarketing') === 'on';
        const provider = formData.get('provider') ? String(formData.get('provider')) : undefined;

        await signupActionRHF({
            email,
            name,
            password,
            passwordConfirm,
            phone,
            agreeTerms,
            agreePrivacy,
            agreeMarketing,
            provider,
        });
    }

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold">Auth Demo (Popup)</h2>
        </section>
    );
}
