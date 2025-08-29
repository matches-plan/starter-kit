export function sanitizeRedirect(to?: string, fallback = '/') {
    if (!to) return fallback;
    const ok = to.startsWith('/') && !to.startsWith('//');
    return ok ? to : fallback;
}
