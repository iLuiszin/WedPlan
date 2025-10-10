export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function generateProjectSlug(
  brideFirstName: string,
  groomFirstName: string,
  weddingDate?: Date | null
): string {
  const base = `${brideFirstName} e ${groomFirstName}`;
  const dateSuffix = weddingDate ? `-${weddingDate.getFullYear()}` : '';
  const rand = Math.random().toString(36).slice(2, 6);
  return `${slugify(base)}${dateSuffix}-${rand}`;
}
