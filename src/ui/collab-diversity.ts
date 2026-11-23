import { countryNames, getHouse } from '../data';
import type { Collaboration } from '../types';

/** What partner brands can differ in. */
export type Dimension = 'category' | 'market' | 'country';
export const DIMENSIONS: readonly Dimension[] = ['category', 'market', 'country'];
/** `variety`: how evenly partners are spread; `reach`: how many different values they cover. */
export type DiversityMode = 'variety' | 'reach';

/** One partner's values in a dimension (a brand can have several categories). */
export function dimensionValues(id: string, dimension: Dimension): readonly string[] {
  const house = getHouse(id);
  if (!house) return [];
  if (dimension === 'category') return house.tags.brandCategory;
  return [dimension === 'market' ? house.tags.marketPositioning : countryNames[house.country]];
}

/** Distinct partner brands per brand, however many releases they shared. */
export function partnersByBrand(releases: readonly Pick<Collaboration, 'houses'>[]) {
  const partners = new Map<string, Set<string>>();
  for (const project of releases) for (const id of project.houses) {
    const set = partners.get(id) ?? new Set<string>();
    for (const other of project.houses) if (other !== id) set.add(other);
    partners.set(id, set);
  }
  return partners;
}

/**
 * Chance (0–1) that two different partners picked at random differ. A partner
 * with several values is as likely to count as any one of them.
 */
export function variety(partners: readonly (readonly string[])[]): number {
  const listed = partners.filter((values) => values.length);
  const n = listed.length;
  if (n < 2) return 0;
  const weights = new Map<string, number>();
  // Pairing a partner with itself isn't a pair: take those matches back out.
  let self = 0;
  for (const values of listed) {
    const share = 1 / values.length;
    for (const value of values) weights.set(value, (weights.get(value) ?? 0) + share);
    self += share;
  }
  const same = [...weights.values()].reduce((sum, weight) => sum + weight * weight, 0) - self;
  // Clamp rounding noise, so "all the same" is exactly 0.
  return Math.min(1, Math.max(0, 1 - same / (n * (n - 1))));
}

/** Share of the other values below each one, 0–100; ties share the middle of their range. */
export function percentiles(values: readonly number[]): number[] {
  if (values.length < 2) return values.map(() => 100);
  return values.map((value) => {
    let below = 0, tied = -1;
    for (const other of values) {
      if (other < value) below++;
      else if (other === value) tied++;
    }
    return ((below + tied / 2) / (values.length - 1)) * 100;
  });
}

export interface DiversityRow {
  id: string;
  partners: ReadonlySet<string>;
  /** Per dimension: a 0–1 chance (variety) or a number of values (reach). */
  scores: Record<Dimension, number>;
  /** Average percentile over the included dimensions, 0–100. */
  overall: number;
}

/** Every brand with enough partners, scored against each other. */
export function diversityRows(partners: ReadonlyMap<string, ReadonlySet<string>>, mode: DiversityMode,
  included: readonly Dimension[], minPartners: number): DiversityRow[] {
  const scored = [...partners].filter(([, set]) => set.size >= minPartners).map(([id, set]) => ({
    id, partners: set, scores: Object.fromEntries(DIMENSIONS.map((dimension) => {
      const values = [...set].map((partner) => dimensionValues(partner, dimension));
      // Rounded so floating-point noise can't split ties.
      return [dimension, mode === 'reach' ? new Set(values.flat()).size : Math.round(variety(values) * 1e6) / 1e6];
    })) as Record<Dimension, number>,
  }));
  const ranks = included.map((dimension) => percentiles(scored.map((row) => row.scores[dimension])));
  return scored.map((row, index) => ({ ...row, overall: ranks.reduce((sum, rank) => sum + rank[index]!, 0) / (ranks.length || 1) }));
}
