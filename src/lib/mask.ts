export function maskEmail(email: string) {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    if (local.length <= 2) return `${local[0] ?? ''}*@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
}
