export type LinkKind = 'web' | 'email' | 'phone';

export function safeWebUrl(value?: string | null): string | null {
  if (!value?.trim() || /[\u0000-\u0020\u007f]/.test(value.trim())) return null;
  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function safeExternalUrl(value: string | null | undefined, kind: LinkKind = 'web'): string | null {
  if (kind === 'web') return safeWebUrl(value);
  if (!value?.trim()) return null;
  if (kind === 'email') {
    const email = value.trim().replace(/^mailto:/i, '');
    return /^[^\s@?&#%]+@[^\s@?&#%]+\.[^\s@?&#%]+$/.test(email) ? `mailto:${email}` : null;
  }
  const phone = value.trim().replace(/^tel:/i, '');
  if (!/^[+\d()\s.-]+$/.test(phone)) return null;
  const normalized = phone.replace(/[()\s.-]/g, '');
  return /^\+?\d{7,15}$/.test(normalized) ? `tel:${normalized}` : null;
}
