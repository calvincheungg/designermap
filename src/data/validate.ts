import { collectionTags, designers, houses, marketPositionings } from './index';

/**
 * Sanity checks that types can't catch. House ids are already checked by the
 * compiler. Run with `npm test`; problems are also logged in the browser
 * console on startup.
 */
export function validateData(): string[] {
  const problems: string[] = [];
  const thisYear = new Date().getFullYear();

  for (const d of designers) {
    if (d.career.length === 0) problems.push(`${d.id}: has no career entries`);

    for (const t of d.career) {
      const where = `${d.id} @ ${t.house} (${t.start})`;
      if (t.start !== undefined) {
        if (typeof t.end === 'number' && t.end < t.start) problems.push(`${where}: end before start`);
        if (t.start > thisYear + 1) problems.push(`${where}: start year is in the future`);
        if (d.born && t.start < d.born + 14) problems.push(`${where}: starts before age 14`);
      }
      if (d.died && t.end === null) problems.push(`${where}: marked current but designer died ${d.died}`);
    }
  }

  for (const h of houses) {
    if (!marketPositionings.includes(h.tags.marketPositioning)) {
      problems.push(`${h.id}: choose a valid market positioning`);
    }
    if (h.tags.aesthetic.length < 1 || h.tags.aesthetic.length > 3) {
      problems.push(`${h.id}: choose 1–3 main aesthetics`);
    }
    if (h.tags.product.length < 1 || h.tags.product.length > 4) {
      problems.push(`${h.id}: choose 1–4 primary product tags`);
    }
    if (h.tags.collections.length < 1 || h.tags.collections.length > 2 || !h.tags.collections.every((tag) => collectionTags.includes(tag))) {
      problems.push(`${h.id}: choose 1–2 valid collections`);
    }
    for (const [group, tags] of Object.entries(h.tags)) {
      if (!Array.isArray(tags)) continue;
      if (new Set(tags).size !== tags.length) problems.push(`${h.id}: duplicate ${group} tags`);
    }
    if (h.website && !/^https?:\/\/[^\s/]+\.[^\s]+$/.test(h.website)) {
      problems.push(`${h.id}: website should be a full URL like https://www.example.com`);
    }
    if (h.instagram && !/^[A-Za-z0-9._]{1,30}$/.test(h.instagram)) {
      problems.push(`${h.id}: instagram should be just the handle, without "@" or a URL (e.g. "loewe")`);
    }
    if (h.logo && !/^https?:\/\//.test(h.logo) && !/\.(svg|png|jpe?g|webp|gif|avif)$/i.test(h.logo)) {
      problems.push(`${h.id}: logo should be an image file in public/logos/ (e.g. "${h.id}.svg") or a full URL`);
    }
  }

  return problems;
}

/** Houses with nobody linked yet: not an error, just research still to do. */
export function researchTodos(): string[] {
  return houses
    .filter((h) => !designers.some((d) => d.career.some((t) => t.house === h.id)))
    .map((h) => `${h.name}: no founder or creative director recorded yet`);
}
