/** Text helpers shared by the map, the data sheets and the windows. */

/** A–Z sorting that ignores case and accents and counts numbers (2 before 10). */
export const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
export const byName = (a: { name: string }, b: { name: string }) => collator.compare(a.name, b.name);

/** Drop accents: "Hermès" → "Hermes". */
export const stripAccents = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '');
/** Text compared ignoring case, accents and outer spaces. */
export const fold = (text: string) => stripAccents(text).toLowerCase().trim();
