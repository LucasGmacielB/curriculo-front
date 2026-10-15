import type { Habilidade } from '@/types/portfolio';

export function initials(name?: string | null): string {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  return words.length ? `${words[0][0]}${words.length > 1 ? words[words.length - 1][0] : ''}`.toUpperCase() : '?';
}

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatPeriod(start?: string | null, end?: string | null): string {
  const first = formatDate(start);
  const last = formatDate(end);
  if (!first && !last) return 'Período não informado';
  return `${first ?? 'Início não informado'} — ${last ?? 'Término não informado'}`;
}

export function groupSkills(skills: Habilidade[]): { category: string; items: Habilidade[] }[] {
  const groups = new Map<string, Habilidade[]>();
  for (const skill of skills) {
    const category = skill.categoria?.trim() || 'Outras habilidades';
    groups.set(category, [...(groups.get(category) ?? []), skill]);
  }
  return Array.from(groups, ([category, items]) => ({ category, items }));
}
