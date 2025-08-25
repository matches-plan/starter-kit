'use server';
import { auth, signIn, signOut } from '@/auth';

export const signInWithCredentials = async (formData: FormData) => {
    await signIn('credentials', {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    });
    // ...
};
export const signInWithGoogle = async () => {
    await signIn('google', {
        /* 옵션 */
    });
    // ...
};
export const signInWithGitHub = async () => {
    await signIn('github', {
        /* 옵션 */
    });
    // ...
};
export const signOutWithForm = async () => {
    await signOut();
};
export { auth as getSession };
